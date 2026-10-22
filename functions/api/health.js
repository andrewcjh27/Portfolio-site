// Cloudflare Pages Function: GET /api/health
export function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({ ok: Boolean(env.GROQ_API_KEY), service: "soccer-ai-chat" }),
    {
      status: env.GROQ_API_KEY ? 200 : 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }
  );
}
