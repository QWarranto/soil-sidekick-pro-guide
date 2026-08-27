import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Create client that will pass auth internally
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error } = await client.functions.invoke('environmental-impact-engine', {
      body: {
        analysis_id: "test-001",
        county_fips: "13247",
        county_name: "Rockdale County",
        state_code: "GA",
        soil_data: {"ph_level": 6.5, "organic_matter": 2.8, "slope": 3.5, "drainage": "well-drained"},
        proposed_treatments: []
      }
    });

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error_type: typeof error,
        error_keys: Object.keys(error),
        error_message: error.message,
        error_context: error.context,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      has_data: !!data,
      data_keys: data ? Object.keys(data) : [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      catch_type: e.constructor?.name,
      catch_message: e.message,
      catch_keys: Object.keys(e),
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
});