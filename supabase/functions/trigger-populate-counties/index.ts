import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Triggering populate-counties function...');

    // Call the populate-counties function
    const { data, error } = await supabase.functions.invoke('populate-counties', {
      body: {}
    });

    if (error) {
      console.error('Error calling populate-counties:', error);
      throw error;
    }

    console.log('Successfully triggered populate-counties:', data);

    return new Response(
      JSON.stringify({ 
        message: 'Successfully triggered county population',
        result: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-populate-counties function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to trigger county population' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});