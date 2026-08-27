import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const message = body?.message;
    if (!message || !message.text) return new Response('ok', { headers: corsHeaders });
    
    const chatId = message.chat.id;
    const text = message.text;
    const telegramId = message.from?.id || chatId;
    
    if (text === '/start') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
      
      // Test DB connection
      let dbStatus = 'unknown';
      try {
        const supabase = createClient(supabaseUrl, serviceKey);
        const { error } = await supabase
          .from('telegram_link')
          .select('count')
          .limit(1);
        dbStatus = error ? `error: ${error.message}` : 'ok';
      } catch (e: any) {
        dbStatus = `exception: ${e.message}`;
      }
      
      // Send diagnostic message
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔧 Diagnostic:\nDB: ${dbStatus}\nURL: ${supabaseUrl ? 'set' : 'missing'}\nKey: ${serviceKey ? 'set' : 'missing'}\nBot: ${botToken ? 'set' : 'missing'}`,
        })
      });
    }
    
    return new Response('ok', { headers: corsHeaders });
  } catch (e: any) {
    console.error('Error:', e);
    return new Response('error: ' + e.message, { status: 500 });
  }
});
