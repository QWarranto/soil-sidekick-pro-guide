import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Test with missing soil_data (should fail validation with 400)
  const badBody = {
    analysis_id: crypto.randomUUID(),
    county_fips: '13247',
    proposed_treatments: [],
  };

  const { data, error } = await client.functions.invoke('environmental-impact-engine', {
    body: badBody,
  });

  if (error) {
    // Explore the full error object structure
    const errKeys = Object.keys(error);
    return new Response(JSON.stringify({
      test: 'missing_soil_data',
      error_keys: errKeys,
      error_name: error.name,
      error_message: error.message,
      error_error: error.error,
      error_context: error.context,
      error_status: error.status,
      error_stack: error.stack,
      typeof_context: typeof error.context,
      context_keys: error.context ? Object.keys(error.context) : null,
      context_status: error.context?.status,
      context_body_type: typeof error.context?.body,
      context_body: error.context?.body,
      has_context_body: !!error.context?.body,
    }, null, 2), { status: 200 });
  }

  return new Response(JSON.stringify({ test: 'unexpected_success', keys: Object.keys(data) }, null, 2), { status: 200 });
});
