import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";
import { resolveAuth } from "../_shared/apiKeyAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const url = new URL(req.url);
    if (url.searchParams.get("action") === "health") {
      return json({ ok: true, env: { url: Deno.env.get("SUPABASE_URL") ? "SET" : "MISSING", key: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "SET" : "MISSING" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const auth = await resolveAuth(req);
    if (auth.error || !auth.userId) {
      return json({ error: auth.error || "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action ?? "");

    if (action === "list") {
      const { data, error } = await supabase
        .from("managed_assets")
        .select("*")
        .eq("user_id", auth.userId)
        .eq("is_deleted", false)
        .limit(10);
      if (error) return json({ error: error.message }, 500);
      return json({ assets: data });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (e) {
    return json({ error: "Internal error", detail: e instanceof Error ? e.message : String(e) }, 500);
  }
});
