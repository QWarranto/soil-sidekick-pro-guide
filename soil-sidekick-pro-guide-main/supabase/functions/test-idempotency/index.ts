import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const updateId = body?.update_id || 0;
    const telegramId = body?.telegram_id || 0;
    const chatId = body?.chat_id || 0;
    const command = body?.command || 'test';
    
    const supabase = getSupabase();
    
    // Check if already processed
    const { data: existing } = await supabase
      .from('processed_updates')
      .select('update_id')
      .eq('update_id', updateId)
      .maybeSingle();
    
    if (existing) {
      return new Response(JSON.stringify({ result: 'already processed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Mark as processed
    const { error } = await supabase.from('processed_updates').insert({
      update_id: updateId,
      telegram_id: telegramId,
      chat_id: chatId,
      command: command,
      processed_at: new Date().toISOString()
    });
    
    if (error) {
      return new Response(JSON.stringify({ result: 'insert failed', error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Clean up
    await supabase.from('processed_updates').delete().eq('update_id', updateId);
    
    return new Response(JSON.stringify({ result: 'processed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
