import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const SANDBOX_QUOTA = {
  calls_per_hour: 100,
  calls_per_day: 500,
  max_concurrent: 10,
  reset_at: new Date(Date.now() + 3600000).toISOString(),
};

const VALID_ENDPOINTS = [
  'get-soil-data',
  'get-water-quality',
  'resolve-location',
  'agricultural-intelligence',
  'environmental-impact',
  'plant-identify',
  'carbon-credit-calculator',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'quota';
    const body = req.method === 'POST' ? await req.json() : {};

    // get_sandbox_quota
    if (action === 'quota' || body.action === 'get_sandbox_quota') {
      return new Response(
        JSON.stringify({
          ...SANDBOX_QUOTA,
          remaining_hour: SANDBOX_QUOTA.calls_per_hour,
          remaining_day: SANDBOX_QUOTA.calls_per_day,
          used_hour: 0,
          used_day: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // view_recent_requests
    if (action === 'history' || body.action === 'view_recent_requests') {
      const { limit = 10 } = body;
      return new Response(
        JSON.stringify({
          requests: [],
          limit,
          note: 'Request history is ephemeral in sandbox mode. Use production API for persistent logs.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // validate_api_key
    if (action === 'validate' || body.action === 'validate_api_key') {
      const { api_key } = body;
      const isValid = api_key && (
        api_key.startsWith('ak_') || api_key.startsWith('tk_')
      );
      const tier = api_key?.startsWith('ak_') ? 'production' : api_key?.startsWith('tk_') ? 'trial' : 'unknown';
      return new Response(
        JSON.stringify({
          valid: isValid,
          tier: isValid ? tier : null,
          prefix: api_key?.substring(0, 3) || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // compare_response_versions
    if (action === 'compare' || body.action === 'compare_response_versions') {
      const { endpoint, params = {} } = body;
      return new Response(
        JSON.stringify({
          endpoint,
          v1: { status: 'not_implemented', note: 'v1 API is deprecated' },
          v2: { status: 'current', note: 'Use /functions/v1/ endpoint' },
          diff: ['All endpoints now use v2 schema by default'],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        actions: ['get_sandbox_quota', 'view_recent_requests', 'validate_api_key', 'compare_response_versions'],
        valid_endpoints: VALID_ENDPOINTS,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('webmcp-sandbox error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
