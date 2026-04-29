# Temp Mail Service

A temporary email service built with React (Vite) and Cloudflare Workers (D1).

## Prerequisites

- Node.js
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

## Installation

### 1. Frontend Setup

Install dependencies for the React frontend:

```bash
npm install
```

### 2. Worker Setup

Navigate to the worker directory and install its dependencies:

```bash
cd worker
npm install
```

### 3. Database Setup (Cloudflare D1)

The backend uses Cloudflare D1 for storing emails.

1. Create a new D1 database:
   ```bash
   npx wrangler d1 create temp_mail_db
   ```
2. Copy the `database_id` from the output and update the `worker/wrangler.toml` file:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "temp_mail_db"
   database_id = "YOUR_NEW_DATABASE_ID"
   ```
3. Initialize the database schema:
   ```bash
   npx wrangler d1 execute temp_mail_db --local --file=./schema.sql
   npx wrangler d1 execute temp_mail_db --remote --file=./schema.sql
   ```

## Running Locally

To run the full stack locally, you need two terminal windows:

**Terminal 1 (Worker/Backend):**
```bash
cd worker
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Deployment

**Deploy the Worker:**
```bash
cd worker
npx wrangler deploy
```

**Deploy the Frontend:**
```bash
npm run build
```
(Deploy the `dist` folder to Cloudflare Pages or your preferred static hosting).

## Cloudflare Email Routing Setup

To allow the worker to receive and process incoming emails, you need to configure Email Routing in the Cloudflare Dashboard:

1. **Log in to Cloudflare:** Go to your Cloudflare Dashboard and select your domain.
2. **Navigate to Email:** Click on **Email** -> **Email Routing** in the left sidebar.
3. **Enable Email Routing:** If you haven't already, click **Get Started** and configure your domain's DNS records as prompted (Cloudflare will automatically add the required MX and TXT records).
4. **Create a Catch-all Address:**
   - Go to the **Routing rules** tab.
   - Scroll down to the **Catch-all address** section.
   - Click **Edit** (or create a new catch-all rule).
   - Set the action to **Send to a Worker**.
   - Select your deployed `temp-mail-worker` from the dropdown list.
   - Save the rule.

Now, any email sent to `[anything]@yourdomain.com` will trigger the worker and be saved to your D1 database!
