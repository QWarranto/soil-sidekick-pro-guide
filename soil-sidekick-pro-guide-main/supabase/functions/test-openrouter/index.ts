import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  
  return new Response(JSON.stringify({
    openRouter_present: !!openRouterKey,
    openRouter_length: openRouterKey ? openRouterKey.length : 0,
    lovable_present: !!lovableKey,
    lovable_length: lovableKey ? lovableKey.length : 0,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
