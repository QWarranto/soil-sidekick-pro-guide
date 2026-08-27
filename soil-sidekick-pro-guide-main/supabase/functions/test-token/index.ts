import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN') || 'NOT_SET';
  const prefix = token.slice(0, 20);
  const len = token.length;
  return new Response(JSON.stringify({ prefix, len, isHex: /^[a-f0-9]+$/.test(token) }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
