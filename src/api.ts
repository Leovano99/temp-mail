const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

export const getEmails = async (address: string) => {
  const res = await fetch(`${API_BASE}/api/emails/${address}`);
  if (!res.ok) throw new Error("Failed to fetch inbox");
  return res.json();
};

export const getEmailDetail = async (address: string, id: string) => {
  const res = await fetch(`${API_BASE}/api/emails/${address}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch email details");
  return res.json();
};
