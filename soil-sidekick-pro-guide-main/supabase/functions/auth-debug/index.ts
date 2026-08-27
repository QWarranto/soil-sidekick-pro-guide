import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const results: any = {};

  // Test get-soil-data
  try {
    const { data, error } = await client.functions.invoke('get-soil-data', {
      body: { county_fips: "13247", county_name: "Rockdale", state_code: "GA", analysis_id: "t1" }
    });
    results.soil = { ok: !error, has_data: !!data, keys: data ? Object.keys(data) : [] };
  } catch (e) {
    results.soil = { caught: (e as Error).message };
  }

  // Test env-simple
  try {
    const { data, error } = await client.functions.invoke('env-simple', {
      body: { analysis_id: "t1", county_fips: "13247", soil_data: {}, proposed_treatments: [] }
    });
    results.env_simple = { ok: !error, has_data: !!data, keys: data ? Object.keys(data) : [] };
  } catch (e) {
    results.env_simple = { caught: (e as Error).message };
  }

  // Test environmental-impact-engine via direct fetch to expose actual error body
  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/environmental-impact-engine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        analysis_id: "t1",
        county_fips: "13247",
        soil_data: { ph_level: 6.5 },
        proposed_treatments: []
      }),
    });
    if (!resp.ok) {
      const errorBody = await resp.text();
      results.env = { status: resp.status, body: errorBody.substring(0, 500) };
    } else {
      const data = await resp.json();
      results.env = { ok: true, has_data: !!data, keys: Object.keys(data) };
    }
  } catch (e) {
    results.env = { caught: (e as Error).message };
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
});