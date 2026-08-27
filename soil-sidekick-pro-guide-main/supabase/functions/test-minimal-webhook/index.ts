import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = (Deno as any).env.get("TELEGRAM_BOT_TOKEN") || "";
const WEBHOOK_SECRET = (Deno as any).env.get("TELEGRAM_WEBHOOK_SECRET") || "leafengines-hook";

function getSupabase() {
  return createClient(
    (Deno as any).env.get("SUPABASE_URL") || "",
    (Deno as any).env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") return new Response(JSON.stringify({ status: "ok" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    
    const secretParam = new URL(req.url).searchParams.get("secret");
    if (WEBHOOK_SECRET && secretParam !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const message = body?.message;
    if (!message || !message.text) return new Response("ok", { headers: corsHeaders });
    
    const chatId = message.chat.id;
    const text = message.text;
    const telegramId = message.from?.id || 0;
    
    if (text === "/start") {
      const supabase = getSupabase();
      
      const { data: existing } = await supabase
        .from("telegram_link")
        .select("api_key_id, api_keys(subscription_tier)")
        .eq("telegram_id", telegramId)
        .eq("is_active", true)
        .maybeSingle();
      
      if (!existing) {
        const { data: apiKey } = await supabase
          .from("api_keys")
          .insert({
            user_id: crypto.randomUUID(),
            key_name: `telegram-${telegramId}`,
            key_hash: crypto.randomUUID(),
            channel: "telegram",
            subscription_tier: "free",
            daily_ai_count: 0,
            daily_data_count: 0,
            last_reset_date: new Date().toISOString().split("T")[0],
            is_active: true,
          })
          .select("id")
          .single();
        
        if (apiKey?.id) {
          await supabase.from("telegram_link").insert({
            telegram_id: telegramId,
            username: message.from?.username || null,
            first_name: message.from?.first_name || "User",
            last_name: message.from?.last_name || null,
            api_key_id: apiKey.id,
            language_code: message.from?.language_code || "en",
            is_active: true,
          });
        }
      }
      
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🌱 Welcome to LeafEngines!",
        })
      });
    }
    
    return new Response("ok", { headers: corsHeaders });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal error: " + err.message, { status: 500 });
  }
});
