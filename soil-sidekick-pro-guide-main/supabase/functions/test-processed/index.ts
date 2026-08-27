import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const errors: string[] = [];
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, serviceKey);
    
    // Test processed_updates insert
    const { data, error } = await supabase
      .from('processed_updates')
      .insert({
        update_id: 777777777,
        telegram_id: 888888888,
        chat_id: 888888888,
        command: 'test',
        processed_at: new Date().toISOString()
      })
      .select('update_id')
      .single();
    
    errors.push(`processed_updates: ${error ? 'ERROR: ' + error.message : 'ok'}`);
    
    if (data?.update_id) {
      await supabase.from('processed_updates').delete().eq('update_id', 777777777);
      errors.push('Cleanup: ok');
    }
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
