/// <reference types="@cloudflare/workers-types" />
import PostalMime from 'postal-mime';

export interface Env {
  DB: D1Database;
}

export default {
  // Handler for incoming Emails from Cloudflare Email Routing
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      const recipient = message.to;
      const sender = message.from;
      
      const rawEmailResponse = await new Response(message.raw).arrayBuffer();
      // Parse the email using postal-mime for proper HTML/Text extraction
      const Parser = new PostalMime();
      const parsedEmail = await Parser.parse(rawEmailResponse);
      
      const subject = parsedEmail.subject || "No Subject";
      const bodyText = parsedEmail.text || "";
      const bodyHtml = parsedEmail.html || "";
      
      const id = crypto.randomUUID();

      await env.DB.prepare(
        "INSERT INTO emails (id, recipient, sender, subject, body_text, body_html) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(id, recipient, sender, subject, bodyText, bodyHtml)
      .run();

    } catch (e) {
      console.error("Failed handling email", e);
      message.setReject("Backend error parsing email");
    }
  },

  // REST API handler to fetch emails
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS configuration
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/emails/")) {
      const pathParts = url.pathname.replace("/api/emails/", "").split("/");
      const address = pathParts[0];
      const emailId = pathParts[1];

      if (emailId) {
        // Fetch specific email
        const data = await env.DB.prepare("SELECT * FROM emails WHERE id = ? AND recipient = ?").bind(emailId, address).first();
        if (!data) return new Response("Not found", { status: 404, headers: corsHeaders });
        return Response.json(data, { headers: corsHeaders });
      }

      if (address) {
        // Fetch list for address
        const { results } = await env.DB.prepare(
          "SELECT id, sender, subject, body_text as preview, created_at as time FROM emails WHERE recipient = ? ORDER BY created_at DESC LIMIT 50"
        ).bind(address).all();
        
        return Response.json(results, { headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ status: "TempMail API Active" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  },

  // Cron trigger to auto-delete emails older than 1 hour
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      const result = await env.DB.prepare(
        "DELETE FROM emails WHERE created_at <= datetime('now', '-1 hour')"
      ).run();
      
      console.log(`Auto-deleted old emails: ${result.meta.changes} rows removed.`);
    } catch (e) {
      console.error("Failed to auto-delete emails", e);
    }
  }
};
