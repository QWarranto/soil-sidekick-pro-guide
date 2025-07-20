import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CacheRequest {
  county_fips: string;
  data_sources: string[];
  fallback_levels?: number[];
  force_refresh?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { county_fips, data_sources, fallback_levels = [1, 2, 3, 4], force_refresh = false }: CacheRequest = await req.json();
    
    if (!county_fips || !data_sources?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: county_fips and data_sources' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Hierarchical FIPS cache request for ${county_fips}, sources: ${data_sources.join(', ')}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: Record<string, any> = {};
    
    for (const dataSource of data_sources) {
      let found = false;
      
      // Try each cache level until we find data
      for (const level of fallback_levels) {
        if (found) break;
        
        const cacheKey = generateCacheKey(county_fips, dataSource, level);
        
        // Check cache first (unless force refresh)
        if (!force_refresh) {
          const { data: cachedData } = await supabase
            .from('fips_data_cache')
            .select('*')
            .eq('county_fips', county_fips)
            .eq('data_source', dataSource)
            .eq('cache_key', cacheKey)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

          if (cachedData) {
            console.log(`Cache hit: level ${level} for ${dataSource}`);
            results[dataSource] = {
              data: cachedData.cached_data,
              cache_level: level,
              cached: true,
              last_updated: cachedData.last_accessed
            };
            
            // Update access count and last accessed
            await supabase
              .from('fips_data_cache')
              .update({ 
                access_count: cachedData.access_count + 1,
                last_accessed: new Date().toISOString()
              })
              .eq('id', cachedData.id);
            
            found = true;
            continue;
          }
        }
        
        // Fetch fresh data if not in cache
        const freshData = await fetchDataByLevel(county_fips, dataSource, level);
        
        if (freshData) {
          console.log(`Fresh data fetched: level ${level} for ${dataSource}`);
          
          // Store in cache
          await supabase
            .from('fips_data_cache')
            .upsert({
              county_fips,
              data_source: dataSource,
              cache_key: cacheKey,
              cached_data: freshData,
              cache_level: level,
              expires_at: new Date(Date.now() + getCacheExpiryMs(level)).toISOString(),
              access_count: 1,
              last_accessed: new Date().toISOString()
            });
          
          results[dataSource] = {
            data: freshData,
            cache_level: level,
            cached: false,
            last_updated: new Date().toISOString()
          };
          
          found = true;
        }
      }
      
      if (!found) {
        results[dataSource] = {
          error: `No data available for ${dataSource} at any cache level`,
          cache_level: null,
          cached: false
        };
      }
    }

    return new Response(
      JSON.stringify({ 
        county_fips,
        results,
        cache_strategy: 'hierarchical_fips_optimized',
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hierarchical-fips-cache function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateCacheKey(county_fips: string, dataSource: string, level: number): string {
  const hierarchicalKey = {
    1: county_fips, // County level
    2: county_fips.substring(0, 2), // State level
    3: getRegionCode(county_fips), // Regional level
    4: 'national' // National level
  };
  
  return `${dataSource}_${hierarchicalKey[level as keyof typeof hierarchicalKey]}_${level}`;
}

function getRegionCode(county_fips: string): string {
  const stateCode = county_fips.substring(0, 2);
  const regionMap: Record<string, string> = {
    '01': 'southeast', '04': 'southwest', '06': 'west', '08': 'west',
    '09': 'northeast', '10': 'northeast', '12': 'southeast', '13': 'southeast',
    // Add more state-to-region mappings
  };
  return regionMap[stateCode] || 'unknown';
}

function getCacheExpiryMs(level: number): number {
  const expiryHours = {
    1: 1,    // County: 1 hour
    2: 6,    // State: 6 hours
    3: 24,   // Region: 1 day
    4: 168   // National: 7 days
  };
  return (expiryHours[level as keyof typeof expiryHours] || 24) * 60 * 60 * 1000;
}

async function fetchDataByLevel(county_fips: string, dataSource: string, level: number): Promise<any> {
  // Simulate different data sources based on level
  switch (dataSource) {
    case 'usda_soil':
      return await fetchUSDAData(county_fips, level);
    case 'noaa_weather':
      return await fetchNOAAData(county_fips, level);
    case 'epa_water':
      return await fetchEPAData(county_fips, level);
    case 'census_demographics':
      return await fetchCensusData(county_fips, level);
    default:
      return null;
  }
}

async function fetchUSDAData(county_fips: string, level: number): Promise<any> {
  // Simulated USDA soil data with hierarchical fallback
  const baseData = {
    soil_types: ['loam', 'clay', 'sandy'],
    drainage: 'moderate',
    slope: 'gentle',
    elevation_range: [100, 500]
  };
  
  switch (level) {
    case 1: // County-specific
      return { ...baseData, county_fips, detail_level: 'high', samples: 250 };
    case 2: // State-level
      return { ...baseData, state_code: county_fips.substring(0, 2), detail_level: 'medium', samples: 50 };
    case 3: // Regional
      return { ...baseData, region: getRegionCode(county_fips), detail_level: 'low', samples: 10 };
    case 4: // National
      return { ...baseData, scope: 'national', detail_level: 'very_low', samples: 5 };
    default:
      return null;
  }
}

async function fetchNOAAData(county_fips: string, level: number): Promise<any> {
  const baseData = {
    precipitation: 35.5,
    temperature_avg: 65.2,
    frost_dates: { first: '2024-10-15', last: '2024-04-15' }
  };
  
  switch (level) {
    case 1:
      return { ...baseData, county_fips, resolution: '1km', weather_stations: 5 };
    case 2:
      return { ...baseData, state_code: county_fips.substring(0, 2), resolution: '10km', weather_stations: 50 };
    case 3:
      return { ...baseData, region: getRegionCode(county_fips), resolution: '50km', weather_stations: 20 };
    case 4:
      return { ...baseData, scope: 'national', resolution: '100km', weather_stations: 1000 };
    default:
      return null;
  }
}

async function fetchEPAData(county_fips: string, level: number): Promise<any> {
  const baseData = {
    water_quality_index: 78,
    air_quality_aqi: 45,
    superfund_sites: 0
  };
  
  switch (level) {
    case 1:
      return { ...baseData, county_fips, monitoring_sites: 12 };
    case 2:
      return { ...baseData, state_code: county_fips.substring(0, 2), monitoring_sites: 150 };
    case 3:
      return { ...baseData, region: getRegionCode(county_fips), monitoring_sites: 75 };
    case 4:
      return { ...baseData, scope: 'national', monitoring_sites: 5000 };
    default:
      return null;
  }
}

async function fetchCensusData(county_fips: string, level: number): Promise<any> {
  const baseData = {
    population: 125000,
    median_income: 52000,
    agriculture_employment_pct: 8.5
  };
  
  switch (level) {
    case 1:
      return { ...baseData, county_fips, census_blocks: 245 };
    case 2:
      return { ...baseData, state_code: county_fips.substring(0, 2), counties: 67 };
    case 3:
      return { ...baseData, region: getRegionCode(county_fips), states: 8 };
    case 4:
      return { ...baseData, scope: 'national', total_counties: 3143 };
    default:
      return null;
  }
}