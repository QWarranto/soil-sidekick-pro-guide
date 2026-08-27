import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  const diagnostics: any = { steps: [] };
  
  // Step 1: Check env
  diagnostics.steps.push({ step: 'env', supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey, botToken: botToken.length });
  
  // Step 2: Try DB insert via service role
  try {
    const supabase = createClient(supabaseUrl, serviceKey);
    const { error: insertErr } = await supabase
      .from('processed_updates')
      .insert({
        update_id: 777777777,
        telegram_id: 888888888,
        chat_id: 888888888,
        command_label: 'diagnostic',
        processed_at: new Date().toISOString()
      });
    diagnostics.steps.push({ step: 'db_insert', error: insertErr?.message || null });
    if (!insertErr) {
      await supabase.from('processed_updates').delete().eq('update_id', 777777777);
    }
  } catch (e: any) {
    diagnostics.steps.push({ step: 'db_insert', exception: e.message });
  }
  
  // Step 3: Try to send Telegram message
  try {
    const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: 862109690,
        text: '🔧 Diagnostic: T1 bot connectivity test',
        parse_mode: 'Markdown'
      })
    });
    const data = await resp.json();
    diagnostics.steps.push({ step: 'telegram_send', status: resp.status, ok: data.ok, error: data.description || null });
  } catch (e: any) {
    diagnostics.steps.push({ step: 'telegram_send', exception: e.message });
  }

  return new Response(JSON.stringify(diagnostics), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  });
});
