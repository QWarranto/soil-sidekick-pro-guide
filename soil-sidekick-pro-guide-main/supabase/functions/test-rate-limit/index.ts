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
    const identifier = '123456789';
    const action = 'start';
    
    // Test 1: Query rate_limit_tracking
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('rate_limit_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', oneHourAgo);
    
    errors.push(`1. Query: ${error ? 'ERROR: ' + error.message : 'ok, count=' + count}`);
    
    // Test 2: Insert
    const { error: insertError } = await supabase
      .from('rate_limit_tracking')
      .insert({ identifier, action });
    
    errors.push(`2. Insert: ${insertError ? 'ERROR: ' + insertError.message : 'ok'}`);
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
