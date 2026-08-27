import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AggRow {
  channel: string;
  endpoint: string;
  requests: number;
  failures: number;
  rate_limited: number;
  durations: number[];
}

function pct(arr: number[], p: number): number | null {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - 60 * 60 * 1000);
  const agg = new Map<string, AggRow>();

  const upsert = (channel: string, endpoint: string, status: number | null, ms: number | null, limited = false) => {
    const key = `${channel}::${endpoint}`;
    let row = agg.get(key);
    if (!row) {
      row = { channel, endpoint, requests: 0, failures: 0, rate_limited: 0, durations: [] };
      agg.set(key, row);
    }
    row.requests++;
    if (status !== null && status >= 400) row.failures++;
    if (limited || status === 429) row.rate_limited++;
    if (ms !== null && ms >= 0) row.durations.push(ms);
  };

  // Channel 1: edge function logs (analytics)
  try {
    const analyticsUrl = `${Deno.env.get("SUPABASE_URL")}/analytics/v1/query`;
    const q = `select m.function_id, response.status_code, m.execution_time_ms
      from function_edge_logs
      cross join unnest(metadata) as m
      cross join unnest(m.response) as response
      where timestamp >= '${windowStart.toISOString()}'
      limit 10000`;
    const resp = await fetch(analyticsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ query: q }),
    });
    if (resp.ok) {
      const data = await resp.json();
      for (const r of data.result ?? data.data ?? []) {
        upsert("edge_function", r.function_id ?? "unknown", r.status_code ?? null, r.execution_time_ms ?? null);
      }
    }
  } catch (e) {
    console.error("[snapshot] edge logs error:", e);
  }

  // Channel 2: api_key_access_log
  const { data: apiRows } = await supabase
    .from("api_key_access_log")
    .select("endpoint, success, rate_limited, response_time_ms")
    .gte("access_time", windowStart.toISOString())
    .limit(20000);
  for (const r of apiRows ?? []) {
    upsert("api_key", r.endpoint ?? "unknown", r.success ? 200 : 500, r.response_time_ms, !!r.rate_limited);
  }

  // Channel 3: anonymous_api_usage
  const { data: anonRows } = await supabase
    .from("anonymous_api_usage")
    .select("endpoint_name, response_status, response_time_ms")
    .gte("created_at", windowStart.toISOString())
    .limit(20000);
  for (const r of anonRows ?? []) {
    upsert("anonymous", r.endpoint_name ?? "unknown", r.response_status, r.response_time_ms);
  }

  // Channel 4: mcp_tool_call_log
  const { data: mcpRows } = await supabase
    .from("mcp_tool_call_log")
    .select("tool_name, response_status, response_time_ms, success")
    .gte("created_at", windowStart.toISOString())
    .limit(20000);
  for (const r of mcpRows ?? []) {
    upsert("mcp", r.tool_name ?? "unknown", r.response_status ?? (r.success ? 200 : 500), r.response_time_ms);
  }

  // Channel 5: client_telemetry_events (from telemetry-ingest)
  const { data: telemetryRows } = await supabase
    .from("client_telemetry_events")
    .select("surface, tool_name, latency_ms, status_code, event_type")
    .gte("created_at", windowStart.toISOString())
    .limit(20000);
  for (const r of telemetryRows ?? []) {
    const channel = r.surface ?? "unknown";
    const endpoint = r.tool_name ?? "unknown";
    const status = r.status_code ?? (r.event_type === "error" ? 500 : 200);
    const ms = r.latency_ms;
    upsert(channel, endpoint, status, ms);
  }

  // Insert snapshots
  const inserts = [...agg.values()].map((r) => ({
    channel: r.channel,
    endpoint: r.endpoint,
    requests: r.requests,
    failures: r.failures,
    rate_limited: r.rate_limited,
    avg_ms: r.durations.length ? r.durations.reduce((a, b) => a + b, 0) / r.durations.length : null,
    p95_ms: pct(r.durations, 95),
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString(),
  }));

  if (inserts.length) {
    const { error } = await supabase.from("endpoint_activity_snapshots").insert(inserts);
    if (error) console.error("[snapshot] insert error:", error);
  }

  return new Response(
    JSON.stringify({ ok: true, rows: inserts.length, window: { windowStart, windowEnd } }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
