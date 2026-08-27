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
    const rawBody = await req.text();
    errors.push(`rawBody: ${rawBody.substring(0, 200)}`);
    
    let body;
    try {
      body = JSON.parse(rawBody);
      errors.push("parsed json ok");
    } catch (e) {
      errors.push(`json parse error: ${e.message}`);
      return new Response(JSON.stringify({ ok: false, steps: errors }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    const secretParam = new URL(req.url).searchParams.get("secret");
    const webhookSecret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET") || "";
    if (webhookSecret && secretParam !== webhookSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
    errors.push("secret ok");
    
    const message = body?.message;
    errors.push(`message type: ${typeof message}, text: ${message?.text}`);
    
    if (!message || !message.text) {
      errors.push("returning early - no message/text");
      return new Response(JSON.stringify({ ok: false, steps: errors }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    const chatId = message.chat.id;
    const telegramId = message.from?.id || 0;
    const text = message.text;
    errors.push(`chatId=${chatId} telegramId=${telegramId} text=${text}`);
    
    return new Response(JSON.stringify({ ok: true, steps: errors }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    errors.push(`FATAL: ${err.message}`);
    return new Response(JSON.stringify({ ok: false, steps: errors }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
