import { createClient } from 'jsr:@supabase/supabase-js@2'

// ──────────────────────────────────────────────
// Synthetic Reliability Monitor
// Probes core Edge Functions every 5 minutes
// Logs results to reliability_probe_results
// ──────────────────────────────────────────────

const PROBES = [
  {
    name: 'soil_13247',
    function: 'get-soil-data',
    body: { county_fips: '13247', county_name: 'Rockdale County', state_code: 'GA' }
  },
  {
    name: 'planting_collards_13247',
    function: 'multi-parameter-planting-calendar',
    body: { county_fips: '13247', county_name: 'Rockdale County', state_code: 'GA', crop_type: 'collards' }
  },
  {
    name: 'county_lookup_rockdale',
    function: 'county-lookup',
    body: { term: 'Rockdale County, GA' }
  }
];

Deno.serve(async (req) => {
  // Auth check — x-cron-secret required for cron invocations
  const cronSecret = req.headers.get('x-cron-secret');
  const expectedSecret = Deno.env.get('BIGFOOT_CRON_SECRET');

  if (expectedSecret && cronSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const results = [];

  for (const probe of PROBES) {
    const start = Date.now();
    try {
      const url = `${supabaseUrl}/functions/v1/${probe.function}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify(probe.body)
      });

      const latency = Date.now() - start;
      const bodyText = await resp.text();
      const success = resp.ok;

      // Classify failure stage for prioritization
      let failureStage: string | null = null;
      if (!success) {
        if (resp.status === 401) failureStage = 'auth';
        else if (resp.status === 500) failureStage = 'downstream';
        else if (resp.status === 504 || resp.status === 408) failureStage = 'timeout';
        else failureStage = 'http_error';
      }

      await supabase.from('reliability_probe_results').insert({
        probe_name: probe.name,
        target_function: probe.function,
        status_code: resp.status,
        latency_ms: latency,
        success,
        failure_stage: failureStage,
        error_message: success ? null : bodyText.substring(0, 500),
        response_preview: bodyText.substring(0, 200)
      });

      results.push({
        probe: probe.name,
        success,
        latency_ms: latency,
        status: resp.status,
        stage: failureStage
      });

    } catch (err: any) {
      const latency = Date.now() - start;

      await supabase.from('reliability_probe_results').insert({
        probe_name: probe.name,
        target_function: probe.function,
        status_code: 0,
        latency_ms: latency,
        success: false,
        failure_stage: 'network',
        error_message: err.message,
        response_preview: null
      });

      results.push({
        probe: probe.name,
        success: false,
        latency_ms: latency,
        status: 0,
        stage: 'network',
        error: err.message
      });
    }
  }

  return new Response(JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
