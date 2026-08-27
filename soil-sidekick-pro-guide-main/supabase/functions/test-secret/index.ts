import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET') || 'NOT_SET';
  return new Response(JSON.stringify({
    secret: secret.substring(0, 8) + '...' + secret.substring(secret.length - 8),
    length: secret.length
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
