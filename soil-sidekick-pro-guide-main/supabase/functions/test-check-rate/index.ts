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
    const identifier = '123456791';
    const action = 'start';
    const maxPerHour = 1;
    
    // Test checkRateLimit logic
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    errors.push(`1. oneHourAgo: ${oneHourAgo}`);
    
    const { count, error } = await supabase
      .from('rate_limit_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', oneHourAgo);
    
    errors.push(`2. Query: ${error ? 'ERROR: ' + error.message : 'ok, count=' + count}`);
    errors.push(`3. Allowed: ${(count ?? 0) < maxPerHour}`);
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
