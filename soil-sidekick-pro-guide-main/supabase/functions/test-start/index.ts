import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
  const errors: string[] = [];
  
  try {
    errors.push(`1. BOT_TOKEN length: ${BOT_TOKEN.length}`);
    
    // Test 1: Simple sendMessage
    try {
      const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 862109690,
          text: '🔧 Test: Plain text message (no parse mode)',
        })
      });
      const data = await resp.json();
      errors.push(`2. Plain text: status=${resp.status}, ok=${data.ok}`);
    } catch (e: any) {
      errors.push(`2. Plain text FAILED: ${e.message}`);
    }
    
    // Test 2: MarkdownV2 message
    try {
      const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 862109690,
          text: '🌱 *Welcome to LeafEngines\\!*',
          parse_mode: 'MarkdownV2',
        })
      });
      const data = await resp.json();
      errors.push(`3. MarkdownV2: status=${resp.status}, ok=${data.ok}, err=${data.description || 'none'}`);
    } catch (e: any) {
      errors.push(`3. MarkdownV2 FAILED: ${e.message}`);
    }
    
    // Test 3: Welcome message from actual function
    try {
      const welcomeMsg = `🌱 *Welcome to LeafEngines\\!* Soil Sidekick Pro is ready.\\nYour free account is auto\\-provisioned \\(free tier\\).\\nTap a button below to get started:`;
      const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 862109690,
          text: welcomeMsg,
          parse_mode: 'MarkdownV2',
        })
      });
      const data = await resp.json();
      errors.push(`4. Welcome msg: status=${resp.status}, ok=${data.ok}, err=${data.description || 'none'}`);
    } catch (e: any) {
      errors.push(`4. Welcome msg FAILED: ${e.message}`);
    }
    
    // Test 4: Check Supabase
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error } = await supabase
        .from('processed_updates')
        .insert({
          update_id: 666666666,
          telegram_id: 777777777,
          chat_id: 777777777,
          command: 'test',
          processed_at: new Date().toISOString()
        });
      errors.push(`5. DB insert: ${error ? 'ERROR: ' + error.message : 'SUCCESS'}`);
      if (!error) {
        await supabase.from('processed_updates').delete().eq('update_id', 666666666);
      }
    } catch (e: any) {
      errors.push(`5. DB FAILED: ${e.message}`);
    }
    
    return new Response(JSON.stringify({ errors }, null, 2), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
    
  } catch (e: any) {
    return new Response(JSON.stringify({ fatal: e.message, errors }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
