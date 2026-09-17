/**
 * Hierarchical FIPS Cache Function - Migrated to requestHandler
 * Updated: December 9, 2025 - Phase 3B.3 QC Migration
 * 
 * Features:
 * - Unified requestHandler with auth checks
 * - Zod validation for inputs
 * - Rate limiting: 200 requests/hour
 * - Preserves hierarchical cache invalidation (L1 → L2 → L3 → L4)
 * - Access count tracking for cache optimization
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { fipsCacheSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false, // Allow free tier with rate limiting
  validationSchema: fipsCacheSchema,
  rateLimit: {
    requests: 200,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  useServiceRole: true,
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { county_fips, data_sources, fallback_levels, force_refresh } = validatedData;
    
    logSafe('Hierarchical FIPS cache request', { county_fips, data_sources, force_refresh });

    const results: Record<string, any> = {};
    
    for (const dataSource of data_sources) {
      let found = false;
      
      // Try each cache level until we find data
      for (const level of fallback_levels) {
        if (found) break;
        
        const cacheKey = generateCacheKey(county_fips, dataSource, level);
        
        // Check cache first (unless force refresh)
        if (!force_refresh) {
          const { data: cachedData } = await supabaseClient
            .from('fips_data_cache')
            .select('*')
            .eq('county_fips', county_fips)
            .eq('data_source', dataSource)
            .eq('cache_key', cacheKey)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

          if (cachedData) {
            logSafe(`Cache hit: level ${level} for ${dataSource}`);
            results[dataSource] = {
              data: cachedData.cached_data,
              cache_level: level,
              cached: true,
              last_updated: cachedData.last_accessed,
            };
            
            // Update access count and last accessed
            await supabaseClient
              .from('fips_data_cache')
              .update({ 
                access_count: cachedData.access_count + 1,
                last_accessed: new Date().toISOString(),
              })
              .eq('id', cachedData.id);
            
            found = true;
            continue;
          }
        }
        
        // Fetch fresh data if not in cache
        const freshData = await fetchDataByLevel(county_fips, dataSource, level);
        
        if (freshData) {
          logSafe(`Fresh data fetched: level ${level} for ${dataSource}`);
          
          // Store in cache
          await supabaseClient
            .from('fips_data_cache')
            .upsert({
              county_fips,
              data_source: dataSource,
              cache_key: cacheKey,
              cached_data: freshData,
              cache_level: level,
              expires_at: new Date(Date.now() + getCacheExpiryMs(level)).toISOString(),
              access_count: 1,
              last_accessed: new Date().toISOString(),
            });
          
          results[dataSource] = {
            data: freshData,
            cache_level: level,
            cached: false,
            last_updated: new Date().toISOString(),
          };
          
          found = true;
        }
      }
      
      if (!found) {
        results[dataSource] = {
          error: `No data available for ${dataSource} at any cache level`,
          cache_level: null,
          cached: false,
        };
      }
    }

    return {
      county_fips,
      results,
      cache_strategy: 'hierarchical_fips_optimized',
      generated_at: new Date().toISOString(),
    };
  },
});

// ============================================
// Cache Key and Level Functions
// ============================================

function generateCacheKey(county_fips: string, dataSource: string, level: number): string {
  const hierarchicalKey = {
    1: county_fips, // County level
    2: county_fips.substring(0, 2), // State level
    3: getRegionCode(county_fips), // Regional level
    4: 'national', // National level
  };
  
  return `${dataSource}_${hierarchicalKey[level as keyof typeof hierarchicalKey]}_${level}`;
}

function getRegionCode(county_fips: string): string {
  const stateCode = county_fips.substring(0, 2);
  const regionMap: Record<string, string> = {
    '01': 'southeast', '04': 'southwest', '06': 'west', '08': 'west',
    '09': 'northeast', '10': 'northeast', '12': 'southeast', '13': 'southeast',
    '17': 'midwest', '18': 'midwest', '19': 'midwest', '20': 'midwest',
    '21': 'southeast', '22': 'south', '24': 'northeast', '25': 'northeast',
    '26': 'midwest', '27': 'midwest', '29': 'midwest', '31': 'midwest',
    '33': 'northeast', '34': 'northeast', '36': 'northeast', '37': 'southeast',
    '39': 'midwest', '40': 'south', '42': 'northeast', '45': 'southeast',
    '47': 'southeast', '48': 'south', '51': 'southeast', '53': 'west',
    '55': 'midwest',
  };
  return regionMap[stateCode] || 'unknown';
}

function getCacheExpiryMs(level: number): number {
  const expiryHours = {
    1: 1,    // County: 1 hour
    2: 6,    // State: 6 hours
    3: 24,   // Region: 1 day
    4: 168,  // National: 7 days
  };
  return (expiryHours[level as keyof typeof expiryHours] || 24) * 60 * 60 * 1000;
}

// ============================================
// Data Fetching by Level
// ============================================

async function fetchDataByLevel(county_fips: string, dataSource: string, level: number): Promise<any> {
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
  const baseData = {
    soil_types: ['loam', 'clay', 'sandy'],
    drainage: 'moderate',
    slope: 'gentle',
    elevation_range: [100, 500],
  };
  
  switch (level) {
    case 1:
      return { ...baseData, county_fips, detail_level: 'high', samples: 250 };
    case 2:
      return { ...baseData, state_code: county_fips.substring(0, 2), detail_level: 'medium', samples: 50 };
    case 3:
      return { ...baseData, region: getRegionCode(county_fips), detail_level: 'low', samples: 10 };
    case 4:
      return { ...baseData, scope: 'national', detail_level: 'very_low', samples: 5 };
    default:
      return null;
  }
}

async function fetchNOAAData(county_fips: string, level: number): Promise<any> {
  const baseData = {
    precipitation: 35.5,
    temperature_avg: 65.2,
    frost_dates: { first: '2024-10-15', last: '2024-04-15' },
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
    superfund_sites: 0,
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
    agriculture_employment_pct: 8.5,
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
