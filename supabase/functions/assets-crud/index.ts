/**
 * assets-crud v1
 * x-api-key auth. Service-role scoped to key owner (api_keys.user_id).
 * Optimistic locking via If-Match header (managed_assets.version).
 * Idempotency via Idempotency-Key header (stored in external_id).
 * Soft delete + asset_history audit trail.
 */
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, if-match, idempotency-key",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const ALLOWED_COLS = [
  "asset_type", "species", "common_name", "latitude", "longitude", "geometry",
  "dbh_inches", "height_feet", "canopy_spread_feet", "condition_rating",
  "risk_rating", "maintenance_priority", "last_inspection_date",
  "next_inspection_due", "notes", "custom_fields", "is_public",
  "sync_source", "external_id",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return json(401, { error: "Missing x-api-key header" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  // Validate key (accept either key_hash column)
  const { data: keyRow, error: keyErr } = await supabase
    .from("api_keys")
    .select("user_id, daily_data_count, daily_data_limit, is_active, is_locked")
    .or(`key_hash.eq.${apiKey},key_hash_v2.eq.${apiKey}`)
    .maybeSingle();

  if (keyErr || !keyRow) return json(401, { error: "Invalid API key" });
  if (keyRow.is_locked || keyRow.is_active === false) {
    return json(403, { error: "API key inactive or locked" });
  }

  // Rate limit
  const limit = keyRow.daily_data_limit ?? 1000;
  const used = keyRow.daily_data_count ?? 0;
  if (used >= limit) return json(429, { error: "Daily data quota exceeded" });

  // Fire-and-forget usage increment
  supabase.from("api_keys")
    .update({ daily_data_count: used + 1, last_used_at: new Date().toISOString() })
    .or(`key_hash.eq.${apiKey},key_hash_v2.eq.${apiKey}`)
    .then(() => {});

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const userId = keyRow.user_id;

  try {
    switch (req.method) {
      case "GET": {
        let q = supabase
          .from("managed_assets")
          .select("*")
          .eq("user_id", userId)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });
        if (id) q = q.eq("id", id);
        const { data, error } = await q.limit(1000);
        if (error) throw error;
        return json(200, { data });
      }

      case "POST": {
        const body = await req.json();
        const idempotencyKey = req.headers.get("idempotency-key");

        if (idempotencyKey) {
          const { data: existing } = await supabase
            .from("managed_assets")
            .select("*")
            .eq("user_id", userId)
            .eq("external_id", `idempotency:${idempotencyKey}`)
            .maybeSingle();
          if (existing) return json(200, { data: existing, idempotent: true });
        }

        const insert: Record<string, unknown> = { user_id: userId };
        for (const k of ALLOWED_COLS) if (k in body) insert[k] = body[k];
        if (idempotencyKey) insert.external_id = `idempotency:${idempotencyKey}`;
        if (!insert.sync_source) insert.sync_source = "api";

        const { data, error } = await supabase
          .from("managed_assets")
          .insert(insert)
          .select()
          .single();
        if (error) throw error;

        await supabase.from("asset_history").insert({
          asset_id: data.id,
          user_id: userId,
          change_type: "INSERT",
          changed_by: userId,
          new_data: data,
          version: data.version ?? 1,
        });

        return json(201, { data });
      }

      case "PATCH": {
        if (!id) return json(400, { error: "id query param required" });
        const body = await req.json();
        const ifMatch = req.headers.get("if-match");

        const { data: current } = await supabase
          .from("managed_assets")
          .select("*")
          .eq("id", id)
          .eq("user_id", userId)
          .eq("is_deleted", false)
          .maybeSingle();
        if (!current) return json(404, { error: "Asset not found" });
        if (ifMatch && Number(current.version) !== Number(ifMatch)) {
          return json(409, { error: "Conflict: asset modified since last read" });
        }

        const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
        for (const k of ALLOWED_COLS) if (k in body) update[k] = body[k];
        update.version = (current.version ?? 1) + 1;

        const { data, error } = await supabase
          .from("managed_assets")
          .update(update)
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();
        if (error) throw error;

        await supabase.from("asset_history").insert({
          asset_id: id,
          user_id: userId,
          change_type: "UPDATE",
          changed_by: userId,
          previous_data: current,
          new_data: data,
          version: data.version,
        });

        return json(200, { data });
      }

      case "DELETE": {
        if (!id) return json(400, { error: "id query param required" });
        const { data: current } = await supabase
          .from("managed_assets")
          .select("*")
          .eq("id", id)
          .eq("user_id", userId)
          .maybeSingle();
        if (!current) return json(404, { error: "Asset not found" });

        const { data, error } = await supabase
          .from("managed_assets")
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();
        if (error) throw error;

        await supabase.from("asset_history").insert({
          asset_id: id,
          user_id: userId,
          change_type: "DELETE",
          changed_by: userId,
          previous_data: current,
          new_data: data,
          version: data.version ?? current.version ?? 1,
        });

        return json(200, { data });
      }

      default:
        return json(405, { error: "Method not allowed" });
    }
  } catch (err) {
    console.error("assets-crud error:", err);
    return json(500, { error: (err as Error).message });
  }
});
