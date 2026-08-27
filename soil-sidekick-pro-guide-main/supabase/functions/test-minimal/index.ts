import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const message = body?.message;
    if (!message || !message.text) return new Response('ok', { headers: corsHeaders });
    
    const chatId = message.chat.id;
    const text = message.text;
    
    if (text === '/start') {
      const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🌱 *Welcome to LeafEngines!*\nYour free account is ready.',
          parse_mode: 'Markdown'
        })
      });
      const data = await resp.json();
      console.log('sendMessage result:', data);
    }
    
    return new Response('ok', { headers: corsHeaders });
  } catch (e: any) {
    console.error('Error:', e);
    return new Response('error: ' + e.message, { status: 500 });
  }
});
