import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// Standalone ENV handler with full error exposure
serve(async (req) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await req.json();
    const { analysis_id, county_fips, soil_data, proposed_treatments = [] } = body;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Water proximity estimate
    const stateCode = county_fips?.substring(0, 2) || '00';
    const water_proximity = ({'12':2.5,'06':8.2,'17':4.1,'48':12.8}[stateCode]) || 6.5;

    // Simple calculations
    const ph = soil_data?.ph_level || 7.0;
    const runoff_score = Math.min(100, ph < 5.5 ? 40 : ph < 6 ? 25 : 15);
    
    return new Response(JSON.stringify({
      success: true,
      impact_assessment: {
        county_fips,
        analysis_id,
        runoff_risk_score: runoff_score,
        water_body_proximity: water_proximity,
      },
      simple: true,
    }), { headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error_message: e.message,
      error_name: e.name,
      error_stack: e.stack,
    }), { status: 200, headers: corsHeaders });
  }
});