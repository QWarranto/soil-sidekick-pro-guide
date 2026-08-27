import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  
  const errors = [];
  
  try {
    const chatId = 123456789;
    
    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" }),
    });
    const data = await resp.json();
    errors.push(`1. sendTyping: ${data.ok ? "ok" : "ERROR: " + data.description}`);
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
