import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  const errors: string[] = [];
  
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
      
      errors.push(`1. Env vars: URL=${!!supabaseUrl}, KEY=${!!serviceKey}, BOT=${!!botToken}`);
      
      // Test 1: Create supabase client
      let supabase;
      try {
        supabase = createClient(supabaseUrl, serviceKey);
        errors.push('2. Supabase client created');
      } catch (e: any) {
        errors.push(`2. Client FAILED: ${e.message}`);
        throw e;
      }
      
      // Test 2: Query telegram_link
      try {
        const { data, error } = await supabase
          .from('telegram_link')
          .select('api_key_id')
          .eq('telegram_id', telegramId)
          .eq('is_active', true)
          .maybeSingle();
        errors.push(`3. telegram_link: data=${!!data}, error=${error?.message || 'none'}`);
      } catch (e: any) {
        errors.push(`3. telegram_link FAILED: ${e.message}`);
      }
      
      // Test 3: Insert into api_keys
      try {
        const keyName = `telegram-test-${telegramId}`;
        const keyHash = crypto.randomUUID();
        const { data, error } = await supabase
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
          .select('id')
          .single();
        errors.push(`4. api_keys insert: data=${!!data}, error=${error?.message || 'none'}`);
        if (data?.id) {
          // Clean up
          await supabase.from('api_keys').delete().eq('id', data.id);
          errors.push('5. Cleaned up test row');
        }
      } catch (e: any) {
        errors.push(`4. api_keys FAILED: ${e.message}`);
      }
      
      // Send results
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔧 Diagnostic:\n${errors.join('\n')}`,
        })
      });
    }
    
    return new Response('ok', { headers: corsHeaders });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
