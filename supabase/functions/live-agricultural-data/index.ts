/**
 * Live Agricultural Data Function - Migrated to requestHandler
 * Updated: December 9, 2025 - Phase 3B.2 QC Migration
 * 
 * Features:
 * - Unified requestHandler with auth and subscription checks
 * - Zod validation for inputs
 * - Rate limiting: 100 requests/hour
 * - Graceful degradation: USDA NASS → Historical averages → Simulated data
 * - Cost tracking for real-time data APIs
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { liveAgDataSchema } from '../_shared/validation.ts';
import { trackExternalAPICost } from '../_shared/cost-tracker.ts';
import { withFallback } from '../_shared/graceful-degradation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: liveAgDataSchema,
  rateLimit: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { county_fips, county_name, state_code, data_types } = validatedData;
    
    logSafe('Fetching live agricultural data', { county_fips, data_types });

    const liveData: Record<string, any> = {};
    const dataSources: string[] = [];
    const startTime = Date.now();

    // Fetch data based on requested types with graceful degradation
    for (const dataType of data_types) {
      try {
        switch (dataType) {
          case 'weather':
            logSafe('Fetching NOAA weather data...');
            liveData.weather = await withFallback(
              () => fetchNOAAWeatherData(county_fips, state_code),
              () => generateSimulatedWeatherData(state_code),
              'NOAA Weather API'
            );
            if (liveData.weather.source === 'live') {
              dataSources.push('NOAA Weather API');
              await trackExternalAPICost(supabaseClient, {
                provider: 'noaa',
                endpoint: 'weather-api',
                featureName: 'live-agricultural-data',
                userId: user?.id,
              });
            }
            break;

          case 'soil':
            logSafe('Fetching USDA soil data...');
            liveData.soil = await withFallback(
              () => fetchUSDAsoilData(county_fips, state_code),
              () => generateSimulatedSoilData(county_fips, state_code),
              'USDA Soil Survey API'
            );
            if (liveData.soil.source === 'live') {
              dataSources.push('USDA Soil Survey API');
              await trackExternalAPICost(supabaseClient, {
                provider: 'usda',
                endpoint: 'soil-data-access',
                featureName: 'live-agricultural-data',
                userId: user?.id,
              });
            }
            break;

          case 'crop':
            logSafe('Fetching USDA crop data...');
            liveData.crop = await withFallback(
              () => fetchUSDAcropData(county_fips, state_code),
              () => generateSimulatedCropData(county_fips, state_code),
              'USDA NASS API'
            );
            if (liveData.crop.source === 'live') {
              dataSources.push('USDA NASS API');
              await trackExternalAPICost(supabaseClient, {
                provider: 'usda',
                endpoint: 'nass-api',
                featureName: 'live-agricultural-data',
                userId: user?.id,
              });
            }
            break;

          case 'environmental':
            logSafe('Fetching EPA environmental data...');
            liveData.environmental = await withFallback(
              () => fetchEPAenvironmentalData(county_fips, state_code),
              () => generateSimulatedEnvironmentalData(county_fips, state_code),
              'EPA Environmental API'
            );
            if (liveData.environmental.source === 'live') {
              dataSources.push('EPA Environmental API');
              await trackExternalAPICost(supabaseClient, {
                provider: 'epa',
                endpoint: 'air-quality',
                featureName: 'live-agricultural-data',
                userId: user?.id,
              });
            }
            break;
        }
      } catch (error) {
        logError(`Failed to fetch ${dataType} data`, error);
      }
    }

    // Cache the results if we got live data
    if (dataSources.length > 0) {
      await cacheAgriculturalData(supabaseClient, county_fips, liveData, dataSources);
    }

    logSafe('Successfully fetched agricultural data', { sources: dataSources });

    return {
      county_fips,
      county_name,
      state_code,
      data: liveData,
      sources: dataSources,
      timestamp: new Date().toISOString(),
      cache_status: dataSources.length > 0 ? 'updated' : 'fallback',
      response_time_ms: Date.now() - startTime,
    };
  },
});

// ============================================
// Data Fetching Functions with Graceful Degradation
// ============================================

async function fetchNOAAWeatherData(countyFips: string, stateCode: string) {
  const stationUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=FIPS:${countyFips}&limit=5`;
  
  const stationResponse = await fetch(stationUrl, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (stationResponse.ok) {
    const stationData = await stationResponse.json();
    
    if (stationData.results && stationData.results.length > 0) {
      const station = stationData.results[0];
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const weatherUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=${station.id}&startdate=${startDate}&enddate=${endDate}&limit=100`;
      
      const weatherResponse = await fetch(weatherUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        return {
          source: 'live',
          station_id: station.id,
          station_name: station.name,
          recent_data: weatherData.results || [],
          temperature_avg: calculateAverageTemp(weatherData.results || []),
          precipitation_total: calculateTotalPrecip(weatherData.results || []),
          last_updated: new Date().toISOString(),
        };
      }
    }
  }

  throw new Error('NOAA data unavailable');
}

async function fetchUSDAsoilData(countyFips: string, stateCode: string) {
  const soilUrl = `https://sdmdataaccess.nrcs.usda.gov/tabular/post.rest`;
  
  const query = `
    SELECT 
      co.cokey, co.compname, co.comppct_r, 
      ch.chkey, ch.hzname, ch.hzdept_r, ch.hzdepb_r,
      ch.ph1to1h2o_r, ch.om_r, ch.cec7_r
    FROM legend l
    INNER JOIN mapunit mu ON mu.lkey = l.lkey
    INNER JOIN component co ON co.mukey = mu.mukey
    INNER JOIN chorizon ch ON ch.cokey = co.cokey
    WHERE l.areasymbol LIKE '%${stateCode}%'
    ORDER BY co.comppct_r DESC, ch.hzdept_r ASC
    FETCH FIRST 50 ROWS ONLY
  `;

  const response = await fetch(soilUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, format: 'json' }),
    signal: AbortSignal.timeout(15000),
  });

  if (response.ok) {
    const soilData = await response.json();
    
    if (soilData.Table && soilData.Table.length > 0) {
      const processedData = processSoilData(soilData.Table);
      return {
        source: 'live',
        api: 'USDA Soil Data Access',
        county_fips: countyFips,
        soil_components: processedData.components,
        average_ph: processedData.avg_ph,
        organic_matter_avg: processedData.avg_om,
        dominant_soil_type: processedData.dominant_type,
        last_updated: new Date().toISOString(),
      };
    }
  }

  throw new Error('USDA soil data unavailable');
}

async function fetchUSDAcropData(countyFips: string, stateCode: string) {
  const nassApiKey = Deno.env.get('USDA_NASS_API_KEY');
  
  if (!nassApiKey) {
    throw new Error('USDA NASS API key not configured');
  }

  const year = new Date().getFullYear() - 1;
  const cropUrl = `https://quickstats.nass.usda.gov/api/api_GET/?key=${nassApiKey}&source_desc=CENSUS&sector_desc=CROPS&group_desc=FIELD%20CROPS&agg_level_desc=COUNTY&state_alpha=${stateCode}&county_code=${countyFips.slice(-3)}&year=${year}&format=json`;

  const response = await fetch(cropUrl, {
    signal: AbortSignal.timeout(10000),
  });

  if (response.ok) {
    const cropData = await response.json();
    
    if (cropData.data && cropData.data.length > 0) {
      const processedCrops = processCropData(cropData.data);
      return {
        source: 'live',
        api: 'USDA NASS QuickStats',
        year,
        county_fips: countyFips,
        crops: processedCrops.crops,
        total_acres: processedCrops.total_acres,
        dominant_crops: processedCrops.dominant_crops,
        last_updated: new Date().toISOString(),
      };
    }
  }

  throw new Error('USDA NASS data unavailable');
}

async function fetchEPAenvironmentalData(countyFips: string, stateCode: string) {
  const airQualityUrl = `https://www.airnowapi.org/aq/forecast/county/?format=application/json&county=${countyFips}&API_KEY=GUEST`;

  const response = await fetch(airQualityUrl, {
    signal: AbortSignal.timeout(10000),
  });

  if (response.ok) {
    const airData = await response.json();
    return {
      source: 'live',
      api: 'EPA AirNow',
      county_fips: countyFips,
      air_quality: airData,
      environmental_score: calculateEnvironmentalScore(airData),
      last_updated: new Date().toISOString(),
    };
  }

  throw new Error('EPA data unavailable');
}

// ============================================
// Helper Functions
// ============================================

function calculateAverageTemp(weatherData: any[]): number {
  const tempData = weatherData.filter(d => d.datatype === 'TMAX' || d.datatype === 'TMIN');
  if (tempData.length === 0) return 20;
  return Math.round(tempData.reduce((sum, d) => sum + (d.value / 10), 0) / tempData.length * 10) / 10;
}

function calculateTotalPrecip(weatherData: any[]): number {
  const precipData = weatherData.filter(d => d.datatype === 'PRCP');
  return precipData.reduce((sum, d) => sum + (d.value / 10), 0);
}

function processSoilData(soilData: any[]) {
  const components = soilData.map(row => ({
    name: row[1],
    percentage: row[2],
    horizon: row[4],
    depth_top: row[5],
    depth_bottom: row[6],
    ph: row[7],
    organic_matter: row[8],
    cec: row[9],
  }));

  const validPh = components.filter(c => c.ph !== null).map(c => c.ph);
  const validOm = components.filter(c => c.organic_matter !== null).map(c => c.organic_matter);

  return {
    components: components.slice(0, 10),
    avg_ph: validPh.length > 0 ? validPh.reduce((a, b) => a + b, 0) / validPh.length : 6.5,
    avg_om: validOm.length > 0 ? validOm.reduce((a, b) => a + b, 0) / validOm.length : 2.5,
    dominant_type: components[0]?.name || 'Mixed soils',
  };
}

function processCropData(cropData: any[]) {
  const crops = cropData.map(item => ({
    name: item.commodity_desc,
    acres: parseInt(item.Value?.replace(/,/g, '') || '0'),
    unit: item.unit_desc,
    practice: item.domaincat_desc,
  }));

  const totalAcres = crops.reduce((sum, crop) => sum + crop.acres, 0);
  const sortedCrops = crops.sort((a, b) => b.acres - a.acres);

  return {
    crops: sortedCrops.slice(0, 10),
    total_acres: totalAcres,
    dominant_crops: sortedCrops.slice(0, 3).map(c => c.name),
  };
}

function calculateEnvironmentalScore(airData: any[]): number {
  if (!airData || airData.length === 0) return 75;
  const aqi = airData[0]?.AQI || 50;
  return Math.max(0, 100 - aqi);
}

// ============================================
// Fallback Simulation Functions
// ============================================

function generateSimulatedWeatherData(stateCode: string) {
  const regionData = getRegionalWeatherDefaults(stateCode);
  return {
    source: 'simulated',
    reason: 'Live NOAA data unavailable',
    temperature_avg: regionData.temp + (Math.random() - 0.5) * 10,
    precipitation_total: regionData.precip + (Math.random() - 0.5) * 20,
    humidity_avg: regionData.humidity + (Math.random() - 0.5) * 20,
    last_updated: new Date().toISOString(),
  };
}

function generateSimulatedSoilData(countyFips: string, stateCode: string) {
  const regionData = getRegionalSoilDefaults(stateCode);
  return {
    source: 'simulated',
    reason: 'Live USDA soil data unavailable',
    average_ph: regionData.ph + (Math.random() - 0.5) * 2,
    organic_matter_avg: regionData.om + (Math.random() - 0.5) * 1,
    dominant_soil_type: regionData.soilType,
    last_updated: new Date().toISOString(),
  };
}

function generateSimulatedCropData(countyFips: string, stateCode: string) {
  const regionCrops = getRegionalCropDefaults(stateCode);
  return {
    source: 'simulated',
    reason: 'Live USDA crop data unavailable',
    dominant_crops: regionCrops,
    total_acres: Math.floor(Math.random() * 50000) + 10000,
    last_updated: new Date().toISOString(),
  };
}

function generateSimulatedEnvironmentalData(countyFips: string, stateCode: string) {
  return {
    source: 'simulated',
    reason: 'Live EPA data unavailable',
    air_quality_index: Math.floor(Math.random() * 100) + 25,
    environmental_score: Math.floor(Math.random() * 30) + 60,
    last_updated: new Date().toISOString(),
  };
}

function getRegionalWeatherDefaults(stateCode: string) {
  const regions: Record<string, any> = {
    'CA': { temp: 18, precip: 400, humidity: 65 },
    'TX': { temp: 22, precip: 800, humidity: 70 },
    'FL': { temp: 25, precip: 1200, humidity: 80 },
    'NY': { temp: 12, precip: 1000, humidity: 65 },
    'IL': { temp: 10, precip: 900, humidity: 70 },
    'default': { temp: 15, precip: 800, humidity: 65 },
  };
  return regions[stateCode] || regions['default'];
}

function getRegionalSoilDefaults(stateCode: string) {
  const regions: Record<string, any> = {
    'CA': { ph: 7.2, om: 1.8, soilType: 'Mollisols' },
    'TX': { ph: 6.8, om: 2.1, soilType: 'Vertisols' },
    'FL': { ph: 6.2, om: 3.2, soilType: 'Spodosols' },
    'NY': { ph: 6.5, om: 3.8, soilType: 'Inceptisols' },
    'IL': { ph: 6.9, om: 4.2, soilType: 'Mollisols' },
    'default': { ph: 6.7, om: 2.5, soilType: 'Mixed soils' },
  };
  return regions[stateCode] || regions['default'];
}

function getRegionalCropDefaults(stateCode: string) {
  const regions: Record<string, string[]> = {
    'CA': ['Almonds', 'Grapes', 'Strawberries'],
    'TX': ['Cotton', 'Corn', 'Sorghum'],
    'FL': ['Oranges', 'Sugarcane', 'Tomatoes'],
    'NY': ['Corn', 'Hay', 'Apples'],
    'IL': ['Corn', 'Soybeans', 'Wheat'],
    'default': ['Corn', 'Soybeans', 'Wheat'],
  };
  return regions[stateCode] || regions['default'];
}

async function cacheAgriculturalData(supabase: any, countyFips: string, data: any, sources: string[]) {
  try {
    await supabase.from('fips_data_cache').upsert({
      cache_key: `agricultural_data_${countyFips}`,
      county_fips: countyFips,
      data_source: 'live_agricultural',
      cached_data: {
        ...data,
        sources,
        cached_at: new Date().toISOString(),
      },
      cache_level: 1,
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    });
    logSafe('Cached agricultural data', { county_fips: countyFips });
  } catch (error) {
    logError('Error caching data', error);
  }
}
