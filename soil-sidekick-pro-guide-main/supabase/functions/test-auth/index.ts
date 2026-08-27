import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  // Test calling agricultural-intelligence via internal fetch (same as telegram-webhook does)
  let downstreamResult = 'not_tested';
  let downstreamStatus = 0;

  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/agricultural-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': `${serviceRoleKey}`,
      },
      body: JSON.stringify({
        query: 'What crops are best suited for Rockdale County, GA?',
        context: { county_fips: '13247', county_name: 'Rockdale County', state_code: 'GA' }
      }),
    });
    downstreamStatus = resp.status;
    downstreamResult = await resp.text();
  } catch (e: any) {
    downstreamResult = `fetch_error: ${e.message}`;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      service_role: { present: !!serviceRoleKey, length: serviceRoleKey?.length || 0 },
      downstream_ag_intel: {
        status: downstreamStatus,
        body_preview: downstreamResult.substring(0, 300),
      },
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
