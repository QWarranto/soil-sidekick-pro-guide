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
    const telegramId = 123456792;
    
    // Step 1: Check existing
    const { data: existing } = await supabase
      .from('telegram_link')
      .select('api_key_id, api_keys(subscription_tier)')
      .eq('telegram_id', telegramId)
      .eq('is_active', true)
      .maybeSingle();
    
    errors.push(`1. Existing: ${existing ? 'yes' : 'no'}`);
    
    if (!existing) {
      // Step 2: Create api_key
      const keyName = `telegram-${telegramId}`;
      const keyHash = crypto.randomUUID();
      const { data: apiKey, error: apiKeyError } = await supabase
        .from('api_keys')
        .insert({
          user_id: crypto.randomUUID(),
          key_name: keyName,
          key_hash: keyHash,
          channel: 'telegram',
          subscription_tier: 'free',
          daily_ai_count: 0,
          daily_data_count: 0,
          last_reset_date: new Date().toISOString().split('T')[0],
          is_active: true,
        })
        .select('id, subscription_tier')
        .single();
      
      errors.push(`2. api_key: ${apiKeyError ? 'ERROR: ' + apiKeyError.message : 'ok, id=' + apiKey?.id}`);
      
      if (apiKey?.id) {
        // Step 3: Create telegram_link
        const { error: linkError } = await supabase
          .from('telegram_link')
          .insert({
            telegram_id: telegramId,
            username: 'testuser',
            first_name: 'Test',
            last_name: null,
            api_key_id: apiKey.id,
            language_code: 'en',
            is_active: true,
          });
        
        errors.push(`3. telegram_link: ${linkError ? 'ERROR: ' + linkError.message : 'ok'}`);
        
        // Cleanup
        if (!linkError) {
          await supabase.from('telegram_link').delete().eq('telegram_id', telegramId);
        }
        await supabase.from('api_keys').delete().eq('id', apiKey.id);
        errors.push('4. Cleaned up');
      }
    }
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
