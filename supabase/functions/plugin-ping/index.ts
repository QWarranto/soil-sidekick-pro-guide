// ── LeafEngines™ Plugin Ping ────────────────────────────────────────
// Ultra-light telemetry endpoint for QGIS plugin activation events.
// No PII stored — just version, platform, and an install-derived ID.
// Called once per plugin session, fire-and-forget.
// ────────────────────────────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, x-plugin-ping',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST with x-plugin-ping header
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const isPing = req.headers.get('x-plugin-ping') === 'true';
  if (!isPing) {
    return new Response(JSON.stringify({ error: 'Missing x-plugin-ping header' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { version, qgis_version, python_version, os, machine } = body;

    const auditClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Insert into mcp_tool_call_log for unified visibility
    await auditClient.from('mcp_tool_call_log').insert({
      tool_name: 'qgis_plugin_ping',
      access_source: 'qgis',
      success: true,
      response_time_ms: 0,
      user_agent: `QGIS/${qgis_version ?? '?'} Python/${python_version ?? '?'} ${os ?? '?'}/${machine ?? '?'}`,
      tool_arguments: {
        plugin_version: version,
        qgis_version,
        python_version,
        os,
        machine,
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[plugin-ping]', msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
