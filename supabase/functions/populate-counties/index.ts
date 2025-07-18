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

    // Sample county data for testing
    const sampleCounties = [
      // California
      { county_name: 'Los Angeles', state_name: 'California', state_code: 'CA', fips_code: '06037' },
      { county_name: 'San Diego', state_name: 'California', state_code: 'CA', fips_code: '06073' },
      { county_name: 'Orange', state_name: 'California', state_code: 'CA', fips_code: '06059' },
      { county_name: 'Riverside', state_name: 'California', state_code: 'CA', fips_code: '06065' },
      { county_name: 'San Bernardino', state_name: 'California', state_code: 'CA', fips_code: '06071' },
      { county_name: 'Santa Clara', state_name: 'California', state_code: 'CA', fips_code: '06085' },
      { county_name: 'Alameda', state_name: 'California', state_code: 'CA', fips_code: '06001' },
      { county_name: 'Sacramento', state_name: 'California', state_code: 'CA', fips_code: '06067' },
      { county_name: 'Fresno', state_name: 'California', state_code: 'CA', fips_code: '06019' },
      { county_name: 'Kern', state_name: 'California', state_code: 'CA', fips_code: '06029' },
      
      // Texas
      { county_name: 'Harris', state_name: 'Texas', state_code: 'TX', fips_code: '48201' },
      { county_name: 'Dallas', state_name: 'Texas', state_code: 'TX', fips_code: '48113' },
      { county_name: 'Tarrant', state_name: 'Texas', state_code: 'TX', fips_code: '48439' },
      { county_name: 'Bexar', state_name: 'Texas', state_code: 'TX', fips_code: '48029' },
      { county_name: 'Travis', state_name: 'Texas', state_code: 'TX', fips_code: '48453' },
      { county_name: 'Collin', state_name: 'Texas', state_code: 'TX', fips_code: '48085' },
      { county_name: 'Hidalgo', state_name: 'Texas', state_code: 'TX', fips_code: '48215' },
      { county_name: 'El Paso', state_name: 'Texas', state_code: 'TX', fips_code: '48141' },
      
      // Florida
      { county_name: 'Miami-Dade', state_name: 'Florida', state_code: 'FL', fips_code: '12086' },
      { county_name: 'Broward', state_name: 'Florida', state_code: 'FL', fips_code: '12011' },
      { county_name: 'Palm Beach', state_name: 'Florida', state_code: 'FL', fips_code: '12099' },
      { county_name: 'Hillsborough', state_name: 'Florida', state_code: 'FL', fips_code: '12057' },
      { county_name: 'Orange', state_name: 'Florida', state_code: 'FL', fips_code: '12095' },
      { county_name: 'Pinellas', state_name: 'Florida', state_code: 'FL', fips_code: '12103' },
      { county_name: 'Duval', state_name: 'Florida', state_code: 'FL', fips_code: '12031' },
      
      // New York
      { county_name: 'New York', state_name: 'New York', state_code: 'NY', fips_code: '36061' },
      { county_name: 'Kings', state_name: 'New York', state_code: 'NY', fips_code: '36047' },
      { county_name: 'Queens', state_name: 'New York', state_code: 'NY', fips_code: '36081' },
      { county_name: 'Suffolk', state_name: 'New York', state_code: 'NY', fips_code: '36103' },
      { county_name: 'Bronx', state_name: 'New York', state_code: 'NY', fips_code: '36005' },
      { county_name: 'Nassau', state_name: 'New York', state_code: 'NY', fips_code: '36059' },
      { county_name: 'Westchester', state_name: 'New York', state_code: 'NY', fips_code: '36119' },
      
      // Iowa (Agricultural)
      { county_name: 'Polk', state_name: 'Iowa', state_code: 'IA', fips_code: '19153' },
      { county_name: 'Linn', state_name: 'Iowa', state_code: 'IA', fips_code: '19113' },
      { county_name: 'Scott', state_name: 'Iowa', state_code: 'IA', fips_code: '19163' },
      { county_name: 'Johnson', state_name: 'Iowa', state_code: 'IA', fips_code: '19103' },
      { county_name: 'Black Hawk', state_name: 'Iowa', state_code: 'IA', fips_code: '19013' },
      { county_name: 'Woodbury', state_name: 'Iowa', state_code: 'IA', fips_code: '19193' },
      { county_name: 'Dubuque', state_name: 'Iowa', state_code: 'IA', fips_code: '19061' },
      { county_name: 'Story', state_name: 'Iowa', state_code: 'IA', fips_code: '19169' },
      
      // Additional states for variety
      { county_name: 'Cook', state_name: 'Illinois', state_code: 'IL', fips_code: '17031' },
      { county_name: 'Maricopa', state_name: 'Arizona', state_code: 'AZ', fips_code: '04013' },
      { county_name: 'King', state_name: 'Washington', state_code: 'WA', fips_code: '53033' },
      { county_name: 'Clark', state_name: 'Nevada', state_code: 'NV', fips_code: '32003' },
      { county_name: 'Multnomah', state_name: 'Oregon', state_code: 'OR', fips_code: '41051' },
    ];

    console.log(`Populating ${sampleCounties.length} counties...`);

    // Check if counties already exist
    const { data: existingCounties } = await supabase
      .from('counties')
      .select('fips_code');

    const existingFips = new Set(existingCounties?.map(c => c.fips_code) || []);
    const newCounties = sampleCounties.filter(county => !existingFips.has(county.fips_code));

    if (newCounties.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Counties already populated', 
          total: sampleCounties.length,
          existing: existingCounties?.length || 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert new counties
    const { data, error } = await supabase
      .from('counties')
      .insert(newCounties)
      .select();

    if (error) {
      console.error('Error inserting counties:', error);
      throw error;
    }

    console.log(`Successfully inserted ${data?.length || 0} new counties`);

    return new Response(
      JSON.stringify({ 
        message: 'Counties populated successfully',
        inserted: data?.length || 0,
        total: sampleCounties.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in populate-counties function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to populate counties' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});