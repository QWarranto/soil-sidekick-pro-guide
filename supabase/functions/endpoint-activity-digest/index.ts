// IMPORTANT — DO NOT REVERT TO send-transactional-email.
// The transactional email queue infrastructure (suppressed_emails,
// email_unsubscribe_tokens, enqueue_email RPC, process-email-queue) does
// NOT exist in this project. send-transactional-email fails closed at the
// suppression check, which records every digest as `partial` and stops
// delivery. This was first patched on Apr 20 (Option B). It was reverted
// on May 7 ~18:00 UTC and digests stopped again.
//
// This function MUST send directly via Resend until the full email queue
// infrastructure is built. See chat history May 10 for context.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// TEMPORARY: Resend sandbox sender (onboarding@resend.dev) only allows
// delivery to the verified Resend account email. Until a custom sender
// domain is verified in Resend, redirect digests to the verified address
// only. Original recipients: ["support@sidekickpro.com", "visionassocllc@gmail.com"].
const RECIPIENTS = ["tpptrafficpump@gmail.com"];
const WINDOW_HOURS = 6;
// Resend's shared sender. soilsidekickpro.com is not verified in Resend
// (Lovable Emails owns notify.soilsidekickpro.com via NS delegation, so it
// can't be verified there). Switch back to a verified sender once one exists.
const FROM_ADDRESS = "SoilSidekick Pro Ops <onboarding@resend.dev>";

function renderHtml(opts: {
  windowHours: number;
  windowStart: string;
  windowEnd: string;
  totals: { requests: number; failures: number; rate_limited: number };
  rows: Array<{ channel: string; endpoint: string; requests: number; failures: number; rate_limited: number; avg_ms: number | null; p95_ms: number | null }>;
}) {
  const rowHtml = opts.rows.slice(0, 50).map(r => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">${r.channel}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">${r.endpoint}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${r.requests.toLocaleString()}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${r.failures}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${r.rate_limited}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${r.avg_ms ?? "-"}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${r.p95_ms ?? "-"}</td>
    </tr>`).join("");
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#222;background:#fff;padding:20px">
  <h2 style="margin:0 0 8px">🌱 LeafEngines Endpoint Activity — ${opts.windowHours}h Digest</h2>
  <p style="color:#666;margin:0 0 16px;font-size:13px">Window: ${opts.windowStart} → ${opts.windowEnd}</p>
  <div style="background:#f5f7f2;padding:12px 16px;border-radius:6px;margin-bottom:16px">
    <div><strong>Total requests:</strong> ${opts.totals.requests.toLocaleString()}</div>
    <div><strong>Failures:</strong> ${opts.totals.failures.toLocaleString()}</div>
    <div><strong>Rate-limited:</strong> ${opts.totals.rate_limited.toLocaleString()}</div>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead><tr style="background:#fafafa;text-align:left">
      <th style="padding:8px 10px;border-bottom:2px solid #ddd">Channel</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd">Endpoint</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd;text-align:right">Req</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd;text-align:right">Fail</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd;text-align:right">429</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd;text-align:right">avg ms</th>
      <th style="padding:8px 10px;border-bottom:2px solid #ddd;text-align:right">p95 ms</th>
    </tr></thead>
    <tbody>${rowHtml || `<tr><td colspan="7" style="padding:12px;color:#888">No traffic in window.</td></tr>`}</tbody>
  </table>
  <p style="color:#999;font-size:11px;margin-top:24px">SoilSidekick Pro · Operational Monitoring</p>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

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
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

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
      channel: e.channel, endpoint: e.endpoint,
      requests: e.requests, failures: e.failures, rate_limited: e.rate_limited,
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

  const html = renderHtml({
    windowHours: WINDOW_HOURS,
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    totals, rows,
  });
  const subject = `LeafEngines Endpoint Activity — ${totals.requests} requests in last ${WINDOW_HOURS}h`;

  const sendErrors: string[] = [];
  for (const recipient of RECIPIENTS) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: [recipient],
          subject,
          html,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Resend send failed", { recipient, status: res.status, body });
        sendErrors.push(`${recipient}: ${res.status} ${body.slice(0, 200)}`);
      } else {
        console.log("Resend send ok", { recipient });
      }
    } catch (e) {
      console.error("Resend fetch threw", { recipient, err: (e as Error).message });
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
