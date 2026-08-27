import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENTS = ["tpptrafficpump@gmail.com"];  // Resend testing mode: verify sidekickpro.com to restore support@sidekickpro.com
const WINDOW_HOURS = 6;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

  const { data: snaps, error } = await supabase
    .from("endpoint_activity_snapshots")
    .select("channel, endpoint, requests, failures, rate_limited, avg_ms, p95_ms")
    .gte("window_end", windowStart.toISOString())
    .lte("window_end", windowEnd.toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Aggregate per channel/endpoint
  const map = new Map<string, any>();
  for (const s of snaps ?? []) {
    const key = `${s.channel}::${s.endpoint}`;
    const e = map.get(key) ?? {
      channel: s.channel, endpoint: s.endpoint,
      requests: 0, failures: 0, rate_limited: 0,
      avg_ms_sum: 0, avg_ms_n: 0, p95_max: 0,
    };
    e.requests += s.requests || 0;
    e.failures += s.failures || 0;
    e.rate_limited += s.rate_limited || 0;
    if (s.avg_ms != null) { e.avg_ms_sum += Number(s.avg_ms) * (s.requests || 1); e.avg_ms_n += (s.requests || 1); }
    if (s.p95_ms != null && Number(s.p95_ms) > e.p95_max) e.p95_max = Number(s.p95_ms);
    map.set(key, e);
  }

  const rows = [...map.values()]
    .map((e) => ({
      channel: e.channel,
      endpoint: e.endpoint,
      requests: e.requests,
      failures: e.failures,
      rate_limited: e.rate_limited,
      avg_ms: e.avg_ms_n ? Math.round(e.avg_ms_sum / e.avg_ms_n) : null,
      p95_ms: e.p95_max || null,
    }))
    .sort((a, b) => b.requests - a.requests);

  const totals = rows.reduce(
    (acc, r) => ({
      requests: acc.requests + r.requests,
      failures: acc.failures + r.failures,
      rate_limited: acc.rate_limited + r.rate_limited,
    }),
    { requests: 0, failures: 0, rate_limited: 0 },
  );

  const channelsSummary: Record<string, { requests: number; failures: number }> = {};
  for (const r of rows) {
    const c = channelsSummary[r.channel] ?? { requests: 0, failures: 0 };
    c.requests += r.requests; c.failures += r.failures;
    channelsSummary[r.channel] = c;
  }

  // Send email via send-transactional-email for each recipient
  const sendErrors: string[] = [];
  for (const recipient of RECIPIENTS) {
    try {
      const { error: sendErr } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "endpoint-activity-digest",
          recipientEmail: recipient,
          idempotencyKey: `digest-${windowEnd.toISOString().slice(0, 13)}-${recipient}`,
          templateData: {
            windowHours: WINDOW_HOURS,
            windowStart: windowStart.toISOString(),
            windowEnd: windowEnd.toISOString(),
            totals,
            rows: rows.slice(0, 50),
          },
        },
      });
      if (sendErr) sendErrors.push(`${recipient}: ${sendErr.message}`);
    } catch (e) {
      sendErrors.push(`${recipient}: ${(e as Error).message}`);
    }
  }

  await supabase.from("endpoint_digest_log").insert({
    recipients: RECIPIENTS,
    window_hours: WINDOW_HOURS,
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString(),
    total_requests: totals.requests,
    total_failures: totals.failures,
    total_rate_limited: totals.rate_limited,
    channels_summary: channelsSummary,
    status: sendErrors.length ? "partial" : "sent",
    error: sendErrors.length ? sendErrors.join("; ") : null,
  });

  return new Response(
    JSON.stringify({ ok: true, totals, rows: rows.length, sendErrors }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
