import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
  
  // Test Telegram API
  let telegramStatus = 'unknown';
  let botName = 'unknown';
  try {
    const resp = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await resp.json();
    telegramStatus = data.ok ? 'OK' : `FAIL: ${data.description}`;
    if (data.ok) botName = data.result.username;
  } catch (e: any) {
    telegramStatus = `EXCEPTION: ${e.message}`;
  }

  return new Response(JSON.stringify({
    botExists: !!botToken,
    botTokenLength: botToken.length,
    telegramStatus,
    botName
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
