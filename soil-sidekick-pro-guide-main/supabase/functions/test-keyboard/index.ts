import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";

function getStartKeyboard(): Record<string, unknown> {
  return {
    inline_keyboard: [
      [
        { text: "🌱 Soil", callback_data: "/soil" },
        { text: "🌽 Crops", callback_data: "/crop" },
      ],
      [
        { text: "💧 Water", callback_data: "/water" },
        { text: "🌍 Env", callback_data: "/env" },
      ],
    ],
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  
  const errors: string[] = [];
  
  try {
    const chatId = 123456789;
    
    const resp1 = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🌱 Welcome!",
      })
    });
    const data1 = await resp1.json();
    errors.push(`1. Plain text: ${data1.ok ? "ok" : "ERROR: " + data1.description}`);
    
    const resp2 = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🌱 Welcome!",
        reply_markup: getStartKeyboard(),
      })
    });
    const data2 = await resp2.json();
    errors.push(`2. With keyboard: ${data2.ok ? "ok" : "ERROR: " + data2.description}`);
    
    return new Response(JSON.stringify({ errors }, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    errors.push(`FATAL: ${e.message}`);
    return new Response(JSON.stringify({ errors }, null, 2), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
