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
    
    errors.push(`URL: ${supabaseUrl ? 'set' : 'missing'}`);
    errors.push(`Key: ${serviceKey ? 'set (' + serviceKey.length + ')' : 'missing'}`);
    
    const supabase = createClient(supabaseUrl, serviceKey);
    
    // Test 1: Query api_keys
    const { data: queryData, error: queryError } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);
    errors.push(`Query: ${queryError ? 'ERROR: ' + queryError.message : 'ok'}`);
    
    // Test 2: Insert into api_keys
    const { data: insertData, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: crypto.randomUUID(),
        key_name: 'test-' + crypto.randomUUID().slice(0, 8),
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
    
    errors.push(`Insert: ${insertError ? 'ERROR: ' + insertError.message : 'ok, id=' + insertData?.id}`);
    
    if (insertData?.id) {
      await supabase.from('api_keys').delete().eq('id', insertData.id);
      errors.push('Cleanup: ok');
    }
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
