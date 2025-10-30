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
    const { county_fips, county_name, state_code, property_address, force_refresh } = await req.json();
    
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

    // Check if we already have analysis for this exact property address (unless force_refresh is true)
    if (!force_refresh) {
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
    } else {
      console.log('Force refresh requested - fetching fresh data');
      // Delete old analyses for this property
      await supabase
        .from('soil_analyses')
        .delete()
        .eq('user_id', user.id)
        .eq('county_fips', county_fips)
        .eq('property_address', property_address);
    }

    // Fetch real soil data from USDA Soil Data Access (SDA) API
    console.log('Fetching real SSURGO data from SDA API...');
    const soilData = await fetchRealSoilData(county_fips, property_address, state_code);

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

// Fetch real soil data from USDA Soil Data Access (SDA) API
async function fetchRealSoilData(countyFips: string, propertyAddress: string, stateCode: string) {
  const SDA_URL = 'https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest';
  
  try {
    // Construct proper areasymbol: state code + county numeric portion
    // Example: FIPS "13247" with state "GA" becomes "GA247"
    const countyNumeric = countyFips.substring(2);
    const areasymbol = `${stateCode}${countyNumeric}`;
    
    console.log(`Looking up SSURGO data for areasymbol: ${areasymbol}`);
    
    // Query to get soil properties for the county
    // We'll get representative values for the dominant map units in the county
    const sqlQuery = `
      SELECT TOP 5
        c.mukey,
        c.cokey,
        c.compname,
        c.comppct_r as component_percent,
        ch.hzname,
        ch.hzdept_r as depth_top,
        ch.hzdepb_r as depth_bottom,
        ch.ph1to1h2o_r as ph,
        ch.om_r as organic_matter,
        ch.claytotal_r as clay,
        ch.silttotal_r as silt,
        ch.sandtotal_r as sand,
        ch.cec7_r as cec,
        ch.ecec_r as ecec,
        ch.ksat_r as ksat
      FROM legend l
      INNER JOIN mapunit mu ON mu.lkey = l.lkey
      INNER JOIN component c ON c.mukey = mu.mukey
      INNER JOIN chorizon ch ON ch.cokey = c.cokey
      WHERE l.areasymbol = '${areasymbol}'
        AND c.compkind = 'Series'
        AND ch.hzdept_r = 0
      ORDER BY c.comppct_r DESC
    `;

    console.log('Executing SDA query:', sqlQuery);

    const response = await fetch(SDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sqlQuery })
    });

    if (!response.ok) {
      console.error('SDA API error:', response.status, response.statusText);
      throw new Error(`SDA API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('SDA API response:', JSON.stringify(data).substring(0, 500));

    // Parse the SDA response and calculate weighted averages
    if (data && data.Table && data.Table.length > 0) {
      return parseSDAResponse(data.Table);
    } else {
      console.log('No SSURGO data available, using regional estimates');
      return getRegionalEstimates(countyFips);
    }
    
  } catch (error) {
    console.error('Error fetching SSURGO data:', error);
    // Fallback to regional estimates if API fails
    return getRegionalEstimates(countyFips);
  }
}

function parseSDAResponse(tableData: any[]) {
  console.log('Parsing', tableData.length, 'soil horizons from SDA');
  
  // Calculate weighted averages based on component percentages
  let totalWeight = 0;
  let weightedPh = 0;
  let weightedOm = 0;
  let soilTypes: string[] = [];

  for (const row of tableData) {
    const weight = row[3] || 0; // component_percent
    const ph = row[7] || 0;
    const om = row[8] || 0;
    const compname = row[2] || 'Unknown';

    if (weight > 0) {
      totalWeight += weight;
      if (ph > 0) weightedPh += ph * weight;
      if (om > 0) weightedOm += om * weight;
      if (!soilTypes.includes(compname)) soilTypes.push(compname);
    }
  }

  const avgPh = totalWeight > 0 ? Number((weightedPh / totalWeight).toFixed(1)) : 6.5;
  const avgOm = totalWeight > 0 ? Number((weightedOm / totalWeight).toFixed(1)) : 2.5;

  // Estimate nutrient levels based on organic matter and pH
  const nitrogen = avgOm < 2.0 ? 'low' : avgOm < 4.0 ? 'medium' : 'high';
  const phosphorus = avgPh < 6.0 || avgPh > 7.5 ? 'low' : avgOm < 2.5 ? 'medium' : 'high';
  const potassium = avgOm < 2.5 ? 'low' : avgOm < 4.0 ? 'medium' : 'high';

  // Generate recommendations
  const recommendations = generateRecommendations(avgPh, avgOm, nitrogen, phosphorus, potassium);

  return {
    ph_level: avgPh,
    organic_matter: avgOm,
    nitrogen_level: nitrogen,
    phosphorus_level: phosphorus,
    potassium_level: potassium,
    recommendations: recommendations.join(' '),
    soil_type: soilTypes.join(', '),
    analysis_method: 'USDA SSURGO - Soil Data Access',
    confidence_level: 'high',
    source_data: `Based on ${tableData.length} soil components from SSURGO database`
  };
}

function getRegionalEstimates(countyFips: string) {
  // Fallback regional estimates based on state FIPS code
  const stateFips = countyFips.substring(0, 2);
  
  const stateEstimates: Record<string, any> = {
    '01': { ph: 6.2, om: 2.0, type: 'Coastal Plain' }, // Alabama
    '04': { ph: 7.8, om: 1.2, type: 'Desert' }, // Arizona
    '05': { ph: 6.5, om: 2.5, type: 'Delta' }, // Arkansas
    '06': { ph: 7.0, om: 2.0, type: 'Mediterranean' }, // California
    '08': { ph: 7.2, om: 2.5, type: 'Mountain' }, // Colorado
    '12': { ph: 6.0, om: 3.0, type: 'Subtropical' }, // Florida
    '13': { ph: 6.0, om: 2.2, type: 'Piedmont' }, // Georgia
    '17': { ph: 6.5, om: 4.0, type: 'Prairie' }, // Illinois
    '18': { ph: 6.5, om: 3.5, type: 'Till Plain' }, // Indiana
    '19': { ph: 6.8, om: 4.5, type: 'Loess' }, // Iowa
    '20': { ph: 6.5, om: 3.0, type: 'Great Plains' }, // Kansas
    '27': { ph: 6.5, om: 4.0, type: 'Glacial' }, // Minnesota
    '29': { ph: 6.2, om: 3.0, type: 'Loess Hills' }, // Missouri
    '31': { ph: 6.8, om: 3.2, type: 'Loess Plains' }, // Nebraska
    '36': { ph: 6.2, om: 3.5, type: 'Glacial' }, // New York
    '37': { ph: 5.8, om: 2.5, type: 'Coastal Plain' }, // North Carolina
    '39': { ph: 6.5, om: 3.5, type: 'Till Plain' }, // Ohio
    '48': { ph: 7.5, om: 1.5, type: 'Arid' }, // Texas
    '53': { ph: 6.0, om: 4.0, type: 'Volcanic' }, // Washington
    '55': { ph: 6.5, om: 4.0, type: 'Glacial' }, // Wisconsin
  };

  const estimates = stateEstimates[stateFips] || { ph: 6.5, om: 2.5, type: 'Temperate' };
  
  const nitrogen = estimates.om < 2.0 ? 'low' : estimates.om < 4.0 ? 'medium' : 'high';
  const phosphorus = estimates.om < 2.5 ? 'medium' : 'high';
  const potassium = estimates.om < 2.5 ? 'medium' : 'high';

  const recommendations = generateRecommendations(estimates.ph, estimates.om, nitrogen, phosphorus, potassium);

  return {
    ph_level: estimates.ph,
    organic_matter: estimates.om,
    nitrogen_level: nitrogen,
    phosphorus_level: phosphorus,
    potassium_level: potassium,
    recommendations: recommendations.join(' '),
    soil_type: estimates.type,
    analysis_method: 'Regional SSURGO estimates',
    confidence_level: 'moderate',
    source_data: 'Based on regional soil characteristics'
  };
}

function generateRecommendations(ph: number, organicMatter: number, nitrogen: string, phosphorus: string, potassium: string): string[] {
  const recommendations: string[] = [];
  
  if (ph < 6.0) {
    recommendations.push('Soil pH is acidic. Consider lime application to raise pH for optimal nutrient availability and plant growth.');
  } else if (ph > 7.5) {
    recommendations.push('Soil pH is alkaline. Consider sulfur application if growing acid-loving plants, or select alkaline-tolerant species.');
  } else {
    recommendations.push('Soil pH is within optimal range for most plants.');
  }
  
  if (organicMatter < 2.0) {
    recommendations.push('Organic matter is low. Adding compost, cover crops, or organic amendments will improve soil structure, water retention, and nutrient cycling.');
  } else if (organicMatter < 3.0) {
    recommendations.push('Organic matter is moderate. Continue good management practices and consider additional organic amendments for improvement.');
  } else {
    recommendations.push('Organic matter levels are good, supporting healthy soil biology and structure.');
  }
  
  if (nitrogen === 'low') {
    recommendations.push('Nitrogen levels are low. Consider nitrogen-rich fertilizers or planting legume cover crops to improve nitrogen availability.');
  }
  
  if (phosphorus === 'low') {
    recommendations.push('Phosphorus is deficient. Rock phosphate or bone meal applications are recommended for root development and flowering.');
  }
  
  if (potassium === 'low') {
    recommendations.push('Potassium levels need improvement. Potash applications will enhance drought tolerance and disease resistance.');
  }

  if (recommendations.length === 1 && ph >= 6.0 && ph <= 7.5) {
    recommendations.push('Overall soil conditions are favorable for most landscaping and agricultural applications. Continue current management practices.');
  }

  return recommendations;
}