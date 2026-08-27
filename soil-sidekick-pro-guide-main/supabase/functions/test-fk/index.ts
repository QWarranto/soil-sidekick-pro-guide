import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const errors: string[] = [];
  
  try {
    const supabase = getSupabase();
    
    // Test api_keys insert with random user_id
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: crypto.randomUUID(),
        key_name: 'test-fk-' + crypto.randomUUID().slice(0, 8),
        key_hash: 'test-hash',
        channel: 'telegram',
        subscription_tier: 'free',
        daily_ai_count: 0,
        daily_data_count: 0,
        last_reset_date: new Date().toISOString().split('T')[0],
        is_active: true,
      })
      .select('id')
      .single();
    
    errors.push(`1. api_keys insert: ${error ? 'ERROR: ' + error.message : 'ok, id=' + data?.id}`);
    
    if (data?.id) {
      await supabase.from('api_keys').delete().eq('id', data.id);
      errors.push('2. Cleaned up');
    }
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
