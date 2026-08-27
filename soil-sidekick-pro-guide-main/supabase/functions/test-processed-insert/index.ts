import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  
  const errors = [];
  
  try {
    const supabase = getSupabase();
    
    // Test 1: Insert WITHOUT processed_at (what telegram-webhook does)
    const { error: err1 } = await supabase.from("processed_updates").insert({
      update_id: 888001,
      telegram_id: 123,
      chat_id: 123,
      command: "start",
    });
    errors.push(`1. Without processed_at: ${err1 ? "ERROR: " + err1.message : "ok"}`);
    
    // Test 2: Insert WITH processed_at
    const { error: err2 } = await supabase.from("processed_updates").insert({
      update_id: 888002,
      telegram_id: 123,
      chat_id: 123,
      command: "start",
      processed_at: new Date().toISOString(),
    });
    errors.push(`2. With processed_at: ${err2 ? "ERROR: " + err2.message : "ok"}`);
    
    // Cleanup
    await supabase.from("processed_updates").delete().in("update_id", [888001, 888002]);
    errors.push("3. Cleaned up");
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    errors.push(`FATAL: ${err.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
