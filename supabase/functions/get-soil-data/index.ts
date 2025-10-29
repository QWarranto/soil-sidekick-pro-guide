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
    const { county_fips, county_name, state_code, property_address } = await req.json();
    
    if (!county_fips || !county_name || !state_code || !property_address) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters (county_fips, county_name, state_code, property_address)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Getting soil data for ${property_address} in ${county_name}, ${state_code} (FIPS: ${county_fips})`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we already have analysis for this exact property address
    const { data: existingAnalysis } = await supabase
      .from('soil_analyses')
      .select('*')
      .eq('user_id', user.id)
      .eq('county_fips', county_fips)
      .eq('property_address', property_address)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingAnalysis) {
      console.log('Returning existing analysis for this property address');
      return new Response(
        JSON.stringify({ soilAnalysis: existingAnalysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, generate sample soil data based on county characteristics
    // In production, this would call external APIs like USDA Soil Survey
    const soilData = generateSampleSoilData(county_name, state_code, county_fips);

    // Store the analysis in the database with property address
    const { data: newAnalysis, error: insertError } = await supabase
      .from('soil_analyses')
      .insert({
        user_id: user.id,
        county_name,
        county_fips,
        state_code,
        property_address,
        ph_level: soilData.ph_level,
        organic_matter: soilData.organic_matter,
        nitrogen_level: soilData.nitrogen_level,
        phosphorus_level: soilData.phosphorus_level,
        potassium_level: soilData.potassium_level,
        recommendations: soilData.recommendations,
        analysis_data: soilData
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing analysis:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ soilAnalysis: newAnalysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-soil-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSampleSoilData(countyName: string, stateCode: string, fips: string) {
  // Generate realistic soil data based on county/state characteristics
  // This is sample data - in production, use real USDA Soil Survey API
  
  const regions = {
    'CA': { ph: [6.2, 7.8], om: [1.5, 4.2], type: 'mediterranean' },
    'TX': { ph: [7.0, 8.2], om: [1.0, 3.5], type: 'arid' },
    'FL': { ph: [5.5, 7.0], om: [2.0, 5.0], type: 'subtropical' },
    'IA': { ph: [6.0, 7.5], om: [3.0, 6.0], type: 'prairie' },
    'NY': { ph: [5.8, 7.2], om: [2.5, 5.5], type: 'temperate' },
  };

  const region = regions[stateCode as keyof typeof regions] || { ph: [6.0, 7.5], om: [2.0, 4.0], type: 'temperate' };
  
  // Generate values within regional ranges
  const ph = Number((Math.random() * (region.ph[1] - region.ph[0]) + region.ph[0]).toFixed(1));
  const organicMatter = Number((Math.random() * (region.om[1] - region.om[0]) + region.om[0]).toFixed(1));
  
  // Generate nutrient levels
  const nutrients = ['low', 'medium', 'high'];
  const nitrogen = nutrients[Math.floor(Math.random() * nutrients.length)];
  const phosphorus = nutrients[Math.floor(Math.random() * nutrients.length)];
  const potassium = nutrients[Math.floor(Math.random() * nutrients.length)];

  // Generate recommendations based on soil properties
  let recommendations = [];
  
  if (ph < 6.0) {
    recommendations.push('Consider lime application to raise pH for optimal nutrient availability.');
  } else if (ph > 7.5) {
    recommendations.push('pH is slightly alkaline. Consider sulfur application if growing acid-loving crops.');
  }
  
  if (organicMatter < 2.0) {
    recommendations.push('Organic matter is low. Consider adding compost or cover crops to improve soil structure.');
  }
  
  if (nitrogen === 'low') {
    recommendations.push('Nitrogen levels are low. Consider nitrogen-rich fertilizers or legume cover crops.');
  }
  
  if (phosphorus === 'low') {
    recommendations.push('Phosphorus is deficient. Rock phosphate or bone meal applications recommended.');
  }
  
  if (potassium === 'low') {
    recommendations.push('Potassium levels need improvement. Consider potash applications.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Soil conditions are generally good for most crops. Continue current management practices.');
  }

  return {
    ph_level: ph,
    organic_matter: organicMatter,
    nitrogen_level: nitrogen,
    phosphorus_level: phosphorus,
    potassium_level: potassium,
    recommendations: recommendations.join(' '),
    soil_type: region.type,
    analysis_method: 'USDA Soil Survey simulation',
    confidence_level: 'moderate'
  };
}