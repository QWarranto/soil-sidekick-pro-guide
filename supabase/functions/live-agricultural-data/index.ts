import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataRequest {
  county_fips: string;
  data_types: string[]; // ['weather', 'soil', 'crop', 'environmental']
  state_code: string;
  county_name: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { county_fips, data_types, state_code, county_name }: DataRequest = await req.json();
    
    console.log(`Fetching live agricultural data for ${county_name}, ${state_code} (FIPS: ${county_fips})`);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const liveData: any = {};
    const dataSources: string[] = [];

    // Fetch data based on requested types
    if (data_types.includes('weather')) {
      console.log('Fetching NOAA weather data...');
      liveData.weather = await fetchNOAAWeatherData(county_fips, state_code);
      if (liveData.weather.source === 'live') dataSources.push('NOAA Weather API');
    }

    if (data_types.includes('soil')) {
      console.log('Fetching USDA soil data...');
      liveData.soil = await fetchUSDAsoilData(county_fips, state_code);
      if (liveData.soil.source === 'live') dataSources.push('USDA Soil Survey API');
    }

    if (data_types.includes('crop')) {
      console.log('Fetching USDA crop data...');
      liveData.crop = await fetchUSDAcropData(county_fips, state_code);
      if (liveData.crop.source === 'live') dataSources.push('USDA NASS API');
    }

    if (data_types.includes('environmental')) {
      console.log('Fetching EPA environmental data...');
      liveData.environmental = await fetchEPAenvironmentalData(county_fips, state_code);
      if (liveData.environmental.source === 'live') dataSources.push('EPA Environmental API');
    }

    // Cache the results
    if (dataSources.length > 0) {
      await cacheAgriculturalData(supabase, county_fips, liveData, dataSources);
    }

    console.log(`Successfully fetched data from sources: ${dataSources.join(', ')}`);

    return new Response(JSON.stringify({
      county_fips,
      county_name,
      state_code,
      data: liveData,
      sources: dataSources,
      timestamp: new Date().toISOString(),
      cache_status: dataSources.length > 0 ? 'updated' : 'fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in live-agricultural-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: 'Using cached or sample data'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchNOAAWeatherData(countyFips: string, stateCode: string) {
  try {
    // NOAA Climate Data Online API (free, no key required for basic data)
    const stationUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=FIPS:${countyFips}&limit=5`;
    
    const stationResponse = await fetch(stationUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (stationResponse.ok) {
      const stationData = await stationResponse.json();
      
      if (stationData.results && stationData.results.length > 0) {
        // Get recent weather data
        const station = stationData.results[0];
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const weatherUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=${station.id}&startdate=${startDate}&enddate=${endDate}&limit=100`;
        
        const weatherResponse = await fetch(weatherUrl, {
          headers: {
            'Accept': 'application/json'
          }
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
            last_updated: new Date().toISOString()
          };
        }
      }
    }

    // Fallback to simulated data
    return generateSimulatedWeatherData(stateCode);

  } catch (error) {
    console.error('NOAA API error:', error);
    return generateSimulatedWeatherData(stateCode);
  }
}

async function fetchUSDAsoilData(countyFips: string, stateCode: string) {
  try {
    // USDA Soil Survey API (public, no key required)
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
      AND mu.mukey IN (
        SELECT DISTINCT mukey 
        FROM muaggatt 
        WHERE mukey IS NOT NULL
      )
      ORDER BY co.comppct_r DESC, ch.hzdept_r ASC
      FETCH FIRST 50 ROWS ONLY
    `;

    const response = await fetch(soilUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        format: 'json'
      })
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
          last_updated: new Date().toISOString()
        };
      }
    }

    // Fallback to simulated data
    return generateSimulatedSoilData(countyFips, stateCode);

  } catch (error) {
    console.error('USDA Soil API error:', error);
    return generateSimulatedSoilData(countyFips, stateCode);
  }
}

async function fetchUSDAcropData(countyFips: string, stateCode: string) {
  try {
    // USDA NASS QuickStats API - requires API key
    const nassApiKey = Deno.env.get('USDA_NASS_API_KEY');
    
    if (!nassApiKey) {
      console.log('USDA NASS API key not configured, using simulated data');
      return generateSimulatedCropData(countyFips, stateCode);
    }

    const year = new Date().getFullYear() - 1; // Most recent complete year
    const cropUrl = `https://quickstats.nass.usda.gov/api/api_GET/?key=${nassApiKey}&source_desc=CENSUS&sector_desc=CROPS&group_desc=FIELD%20CROPS&agg_level_desc=COUNTY&state_alpha=${stateCode}&county_code=${countyFips.slice(-3)}&year=${year}&format=json`;

    const response = await fetch(cropUrl);

    if (response.ok) {
      const cropData = await response.json();
      
      if (cropData.data && cropData.data.length > 0) {
        const processedCrops = processCropData(cropData.data);
        
        return {
          source: 'live',
          api: 'USDA NASS QuickStats',
          year: year,
          county_fips: countyFips,
          crops: processedCrops.crops,
          total_acres: processedCrops.total_acres,
          dominant_crops: processedCrops.dominant_crops,
          last_updated: new Date().toISOString()
        };
      }
    }

    return generateSimulatedCropData(countyFips, stateCode);

  } catch (error) {
    console.error('USDA NASS API error:', error);
    return generateSimulatedCropData(countyFips, stateCode);
  }
}

async function fetchEPAenvironmentalData(countyFips: string, stateCode: string) {
  try {
    // EPA Air Quality API (public, no key required)
    const airQualityUrl = `https://www.airnowapi.org/aq/forecast/county/?format=application/json&county=${countyFips}&API_KEY=GUEST`;

    const response = await fetch(airQualityUrl);

    if (response.ok) {
      const airData = await response.json();
      
      return {
        source: 'live',
        api: 'EPA AirNow',
        county_fips: countyFips,
        air_quality: airData,
        environmental_score: calculateEnvironmentalScore(airData),
        last_updated: new Date().toISOString()
      };
    }

    return generateSimulatedEnvironmentalData(countyFips, stateCode);

  } catch (error) {
    console.error('EPA API error:', error);
    return generateSimulatedEnvironmentalData(countyFips, stateCode);
  }
}

// Helper functions for data processing
function calculateAverageTemp(weatherData: any[]): number {
  const tempData = weatherData.filter(d => d.datatype === 'TMAX' || d.datatype === 'TMIN');
  if (tempData.length === 0) return 20; // Default
  
  const avgTemp = tempData.reduce((sum, d) => sum + (d.value / 10), 0) / tempData.length; // Convert from tenths of degrees
  return Math.round(avgTemp * 10) / 10;
}

function calculateTotalPrecip(weatherData: any[]): number {
  const precipData = weatherData.filter(d => d.datatype === 'PRCP');
  return precipData.reduce((sum, d) => sum + (d.value / 10), 0); // Convert from tenths of mm
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
    cec: row[9]
  }));

  const validPh = components.filter(c => c.ph !== null).map(c => c.ph);
  const validOm = components.filter(c => c.organic_matter !== null).map(c => c.organic_matter);

  return {
    components: components.slice(0, 10), // Top 10 components
    avg_ph: validPh.length > 0 ? validPh.reduce((a, b) => a + b, 0) / validPh.length : 6.5,
    avg_om: validOm.length > 0 ? validOm.reduce((a, b) => a + b, 0) / validOm.length : 2.5,
    dominant_type: components[0]?.name || 'Mixed soils'
  };
}

function processCropData(cropData: any[]) {
  const crops = cropData.map(item => ({
    name: item.commodity_desc,
    acres: parseInt(item.Value?.replace(/,/g, '') || '0'),
    unit: item.unit_desc,
    practice: item.domaincat_desc
  }));

  const totalAcres = crops.reduce((sum, crop) => sum + crop.acres, 0);
  const sortedCrops = crops.sort((a, b) => b.acres - a.acres);

  return {
    crops: sortedCrops.slice(0, 10),
    total_acres: totalAcres,
    dominant_crops: sortedCrops.slice(0, 3).map(c => c.name)
  };
}

function calculateEnvironmentalScore(airData: any[]): number {
  if (!airData || airData.length === 0) return 75; // Default score
  
  const aqi = airData[0]?.AQI || 50;
  return Math.max(0, 100 - aqi); // Inverse AQI for environmental score
}

// Fallback simulation functions
function generateSimulatedWeatherData(stateCode: string) {
  const regionData = getRegionalWeatherDefaults(stateCode);
  
  return {
    source: 'simulated',
    reason: 'Live NOAA data unavailable',
    temperature_avg: regionData.temp + (Math.random() - 0.5) * 10,
    precipitation_total: regionData.precip + (Math.random() - 0.5) * 20,
    humidity_avg: regionData.humidity + (Math.random() - 0.5) * 20,
    last_updated: new Date().toISOString()
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
    last_updated: new Date().toISOString()
  };
}

function generateSimulatedCropData(countyFips: string, stateCode: string) {
  const regionCrops = getRegionalCropDefaults(stateCode);
  
  return {
    source: 'simulated',
    reason: 'Live USDA crop data unavailable',
    dominant_crops: regionCrops,
    total_acres: Math.floor(Math.random() * 50000) + 10000,
    last_updated: new Date().toISOString()
  };
}

function generateSimulatedEnvironmentalData(countyFips: string, stateCode: string) {
  return {
    source: 'simulated',
    reason: 'Live EPA data unavailable',
    air_quality_index: Math.floor(Math.random() * 100) + 25,
    environmental_score: Math.floor(Math.random() * 30) + 60,
    last_updated: new Date().toISOString()
  };
}

// Regional defaults for fallback data
function getRegionalWeatherDefaults(stateCode: string) {
  const regions: Record<string, any> = {
    'CA': { temp: 18, precip: 400, humidity: 65 },
    'TX': { temp: 22, precip: 800, humidity: 70 },
    'FL': { temp: 25, precip: 1200, humidity: 80 },
    'NY': { temp: 12, precip: 1000, humidity: 65 },
    'IL': { temp: 10, precip: 900, humidity: 70 },
    'default': { temp: 15, precip: 800, humidity: 65 }
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
    'default': { ph: 6.7, om: 2.5, soilType: 'Mixed soils' }
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
    'default': ['Corn', 'Soybeans', 'Wheat']
  };
  
  return regions[stateCode] || regions['default'];
}

async function cacheAgriculturalData(supabase: any, countyFips: string, data: any, sources: string[]) {
  try {
    await supabase
      .from('fips_data_cache')
      .upsert({
        cache_key: `agricultural_data_${countyFips}`,
        county_fips: countyFips,
        data_source: 'live_agricultural',
        cached_data: {
          ...data,
          sources: sources,
          cached_at: new Date().toISOString()
        },
        cache_level: 1,
        expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
      });
      
    console.log(`Cached agricultural data for FIPS ${countyFips}`);
  } catch (error) {
    console.error('Error caching data:', error);
  }
}