import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'NOT_SET';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'NOT_SET';
  
  // Try DB insert
  let dbResult = 'unknown';
  try {
    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase
      .from('processed_updates')
      .insert({
        update_id: 888888888,
        telegram_id: 999999999,
        chat_id: 999999999,
        command_label: 'test',
        processed_at: new Date().toISOString()
      });
    dbResult = error ? `ERROR: ${error.message}` : 'SUCCESS';
    // Clean up test row
    await supabase.from('processed_updates').delete().eq('update_id', 888888888);
  } catch (e: any) {
    dbResult = `EXCEPTION: ${e.message}`;
  }
  
  return new Response(JSON.stringify({
    supabaseUrl: supabaseUrl.substring(0, 20) + '...',
    serviceKey: serviceKey === 'NOT_SET' ? 'NOT_SET' : serviceKey.substring(0, 10) + '...',
    dbResult
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
