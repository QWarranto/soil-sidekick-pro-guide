import { createClient } from 'jsr:@supabase/supabase-js@2'
import { rateLimiter, exponentialBackoff } from '../_shared/api-rate-limiter.ts';
import { APICacheManager } from '../_shared/api-cache-manager.ts';
import { withTimingHeaders, logResponseTime } from '../_shared/response-timing.ts';
import { soilDataSchema, validateInput } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ENDPOINT_NAME = 'get-soil-data';

// Helper function to hash API key
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Authenticate via JWT or API key
async function authenticateRequest(
  supabase: any,
  authHeader: string | null
): Promise<{ user: { id: string } | null; error?: string; authMethod?: string }> {
  if (!authHeader) {
    return { user: null, error: 'Authorization required' };
  }

  const token = authHeader.replace('Bearer ', '');

  // Check if it's an API key (starts with 'ak_')
  if (token.startsWith('ak_')) {
    console.log('Authenticating via API key...');
    const keyHash = await hashApiKey(token);
    
    const { data: keyData, error: keyError } = await supabase.rpc('validate_api_key', { 
      key_hash: keyHash,
      client_ip: null
    });

    if (keyError) {
      console.error('API key validation error:', keyError);
      return { user: null, error: 'API key validation failed' };
    }

    if (!keyData || keyData.length === 0 || !keyData[0].is_valid) {
      return { user: null, error: 'Invalid or expired API key' };
    }

    console.log('API key authenticated for user:', keyData[0].user_id);
    return { 
      user: { id: keyData[0].user_id }, 
      authMethod: 'api_key' 
    };
  }

  // Otherwise, try JWT auth
  console.log('Authenticating via JWT...');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return { user: null, error: 'Invalid authorization' };
  }

  return { user, authMethod: 'jwt' };
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input using Zod schema to prevent SQL injection
    const rawBody = await req.json();
    let validatedData;
    
    try {
      validatedData = validateInput(soilDataSchema, rawBody);
    } catch (validationError) {
      logResponseTime(ENDPOINT_NAME, startTime, false);
      return new Response(
        JSON.stringify({ error: validationError instanceof Error ? validationError.message : 'Invalid input parameters' }),
        { status: 400, headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
      );
    }
    
    // Extract validated and sanitized parameters
    // soilDataSchema ensures:
    // - county_fips: exactly 5 digits (^\d{5}$)
    // - state_code: exactly 2 uppercase letters (^[A-Z]{2}$)
    // - county_name: 1-100 characters, trimmed
    // - property_address: 1-500 characters, trimmed
    // This prevents SQL injection by constraining inputs to safe formats
    const { county_fips, county_name, state_code, property_address, force_refresh } = validatedData;

    // Use county-level identifier if no specific address provided
    const analysisLocation = property_address || `${county_name}, ${state_code}`;
    console.log(`Getting soil data for ${analysisLocation} (FIPS: ${county_fips})`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize cache manager
    const cacheManager = new APICacheManager(supabaseUrl, supabaseKey);

    // Authenticate user (supports both JWT and API key)
    const authHeader = req.headers.get('authorization');
    const { user, error: authError, authMethod } = await authenticateRequest(supabase, authHeader);
    
    if (authError || !user) {
      logResponseTime(ENDPOINT_NAME, startTime, false);
      return new Response(
        JSON.stringify({ error: authError || 'Invalid authorization' }),
        { status: 401, headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
      );
    }

    console.log(`Authenticated via ${authMethod} for user ${user.id}`);

    // Check cache first
    const cacheKey = `soil:${county_fips}:${analysisLocation}`;
    let fromCache = false;
    let cacheLevel = 0;
    let soilData: any;

    // Check if we already have analysis for this exact property address (unless force_refresh is true)
    if (!force_refresh) {
      const cachedData = await cacheManager.get(cacheKey, county_fips, 'soil');
      if (cachedData) {
        console.log('Returning cached soil data');
        fromCache = true;
        cacheLevel = cachedData.cache_level;
        soilData = cachedData.data;
      } else {
        const { data: existingAnalysis } = await supabase
          .from('soil_analyses')
          .select('*')
          .eq('user_id', user.id)
          .eq('county_fips', county_fips)
          .eq('property_address', analysisLocation)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingAnalysis) {
          console.log('Returning existing analysis for this property address');
          logResponseTime(ENDPOINT_NAME, startTime, true);
          return new Response(
            JSON.stringify({ soilAnalysis: existingAnalysis }),
            { headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
          );
        }
      }
    } else {
      console.log('Force refresh requested - fetching fresh data');
      // Delete old analyses for this location
      await supabase
        .from('soil_analyses')
        .delete()
        .eq('user_id', user.id)
        .eq('county_fips', county_fips)
        .eq('property_address', analysisLocation);
    }

    // Fetch real soil data if not cached
    if (!soilData) {
      console.log('Fetching real SSURGO data from SDA API...');
      
      // Check rate limiter and wait if needed
      await rateLimiter.checkRateLimit('USDA_SDA');
      
      try {
        soilData = await fetchRealSoilData(county_fips, property_address, state_code);
        
        // Cache the result
        await cacheManager.set(cacheKey, soilData, county_fips, 'soil');
      } catch (error) {
        console.error('Failed to fetch soil data:', error);
        throw error;
      }
    }

    // Store the analysis in the database with property address
    const { data: newAnalysis, error: insertError } = await supabase
      .from('soil_analyses')
      .insert({
        user_id: user.id,
        county_name,
        county_fips,
        state_code,
        property_address: analysisLocation,
        ph_level: soilData.ph_level,
        organic_matter: soilData.organic_matter,
        nitrogen_level: soilData.nitrogen_level,
        phosphorus_level: soilData.phosphorus_level,
        potassium_level: soilData.potassium_level,
        recommendations: soilData.recommendations,
        analysis_data: {
          ...soilData,
          cached: fromCache,
          cache_level: cacheLevel,
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing analysis:', insertError);
      logResponseTime(ENDPOINT_NAME, startTime, false);
      return new Response(
        JSON.stringify({ error: 'Failed to store analysis' }),
        { status: 500, headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
      );
    }

    // Get rate limiter status
    const rateLimitStatus = rateLimiter.getStatus('USDA_SDA');

    logResponseTime(ENDPOINT_NAME, startTime, true);
    return new Response(
      JSON.stringify({ 
        soilAnalysis: newAnalysis,
        cache_info: {
          cached: fromCache,
          cache_level: cacheLevel,
        },
        rate_limit_status: {
          requests_this_minute: rateLimitStatus.requestsLastMinute,
          requests_this_hour: rateLimitStatus.requestsLastHour,
        }
      }),
      { headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
    );

  } catch (error) {
    console.error('Error in get-soil-data function:', error);
    logResponseTime(ENDPOINT_NAME, startTime, false);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, ENDPOINT_NAME) }
    );
  }
});

// Fetch real soil data from USDA Soil Data Access (SDA) API
async function fetchRealSoilData(countyFips: string, propertyAddress: string, stateCode: string) {
  // Use exponential backoff for USDA API calls
  return await exponentialBackoff(async () => {
    const SDA_URL = 'https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest';
    
    // Construct proper areasymbol: state code + county numeric portion
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
      body: JSON.stringify({ query: sqlQuery }),
      signal: AbortSignal.timeout(15000) // 15 second timeout
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
  }, 3, 2000); // 3 retries, 2 second base delay
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

  // Derive drainage class from soil texture and organic matter
  const drainage = deriveDrainageClass(tableData);

  return {
    ph_level: avgPh,
    organic_matter: avgOm,
    nitrogen_level: nitrogen,
    phosphorus_level: phosphorus,
    potassium_level: potassium,
    drainage,
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

  // Estimate drainage from soil type
  const drainage = estimates.type === 'Desert' || estimates.type === 'Arid' ? 'excessive' 
    : estimates.type === 'Coastal Plain' || estimates.type === 'Subtropical' ? 'moderate'
    : estimates.om > 3.5 ? 'good' : 'moderate';

  return {
    ph_level: estimates.ph,
    organic_matter: estimates.om,
    nitrogen_level: nitrogen,
    phosphorus_level: phosphorus,
    potassium_level: potassium,
    drainage,
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

/**
 * Derive drainage class from SSURGO soil texture data.
 * Uses clay/sand percentages and ksat (saturated hydraulic conductivity).
 */
function deriveDrainageClass(tableData: any[]): string {
  // Use the dominant component (first row, highest comppct_r)
  if (!tableData || tableData.length === 0) return 'moderate';

  const row = tableData[0];
  const clay = row[9] || 0;   // claytotal_r
  const sand = row[11] || 0;  // sandtotal_r
  const ksat = row[14] || 0;  // ksat_r (µm/sec)

  // ksat-based classification (most reliable if available)
  if (ksat > 0) {
    if (ksat > 100) return 'excessive';
    if (ksat > 10) return 'good';
    if (ksat > 1) return 'moderate';
    return 'poor';
  }

  // Texture-based fallback
  if (clay > 40) return 'poor';
  if (clay > 25) return 'moderate';
  if (sand > 70) return 'excessive';
  return 'good';
}

  if (recommendations.length === 1 && ph >= 6.0 && ph <= 7.5) {
    recommendations.push('Overall soil conditions are favorable for most landscaping and agricultural applications. Continue current management practices.');
  }

  return recommendations;
}