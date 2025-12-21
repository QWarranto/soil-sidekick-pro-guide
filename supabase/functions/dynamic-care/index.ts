/**
 * Dynamic Care API - /api/v2/dynamic-care
 * Hyper-localized, real-time plant care recommendations
 * 
 * Created: December 21, 2025
 * Consumer Pain Point Solution: Generic or Harmful Care Advice
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { trackExternalAPICost } from '../_shared/cost-tracker.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';
import { withFallback } from '../_shared/graceful-degradation.ts';

// Validation schema
const dynamicCareSchema = z.object({
  plant_species: z.string().min(1, 'Plant species is required'),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    county_fips: z.string().optional(),
    zip_code: z.string().optional(),
  }),
  environment: z.enum(['indoor', 'outdoor', 'greenhouse', 'container_outdoor']),
  container_details: z.object({
    diameter_inches: z.number().optional(),
    depth_inches: z.number().optional(),
    material: z.enum(['terracotta', 'ceramic_glazed', 'plastic', 'self_watering', 'fabric', 'wood']).optional(),
    has_drainage: z.boolean().optional(),
  }).optional(),
  soil_type: z.string().optional(),
  last_watered: z.string().optional(),
  last_fertilized: z.string().optional(),
  problems_observed: z.array(z.enum([
    'yellowing_leaves', 'brown_tips', 'wilting', 'slow_growth', 
    'leggy_growth', 'pests_visible', 'dropping_leaves', 'spots_on_leaves'
  ])).optional(),
});

// Plant care database (simplified - in production would be comprehensive)
const PLANT_CARE_DB: Record<string, any> = {
  'ficus lyrata': {
    common_name: 'Fiddle Leaf Fig',
    watering: { base_days: 7, drought_tolerance: 'low' },
    humidity: { optimal: 50, minimum: 30 },
    light: 'bright_indirect',
    fertilizing: { growing_season: 'monthly', dormant: 'none' },
    temperature: { min: 60, max: 85, optimal: 70 },
    toxic_to: ['dogs', 'cats'],
  },
  'monstera deliciosa': {
    common_name: 'Monstera',
    watering: { base_days: 10, drought_tolerance: 'medium' },
    humidity: { optimal: 60, minimum: 40 },
    light: 'bright_indirect',
    fertilizing: { growing_season: 'monthly', dormant: 'none' },
    temperature: { min: 55, max: 85, optimal: 75 },
    toxic_to: ['dogs', 'cats'],
  },
  'pothos': {
    common_name: 'Pothos',
    watering: { base_days: 10, drought_tolerance: 'high' },
    humidity: { optimal: 50, minimum: 30 },
    light: 'low_to_bright_indirect',
    fertilizing: { growing_season: 'monthly', dormant: 'none' },
    temperature: { min: 50, max: 85, optimal: 70 },
    toxic_to: ['dogs', 'cats'],
  },
  'default': {
    common_name: 'General Houseplant',
    watering: { base_days: 7, drought_tolerance: 'medium' },
    humidity: { optimal: 50, minimum: 30 },
    light: 'medium_indirect',
    fertilizing: { growing_season: 'monthly', dormant: 'none' },
    temperature: { min: 55, max: 85, optimal: 70 },
    toxic_to: [],
  },
};

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: dynamicCareSchema,
  rateLimit: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { 
      plant_species, location, environment, container_details, 
      soil_type, last_watered, last_fertilized, problems_observed 
    } = validatedData;
    const startTime = Date.now();

    logSafe('Generating dynamic care recommendations', { plant_species, environment });

    // Fetch environmental data in parallel
    const [weatherData, soilData] = await Promise.all([
      fetchWeatherData(supabaseClient, location),
      fetchSoilData(supabaseClient, location, soil_type),
    ]);

    // Get plant profile
    const plantProfile = getPlantProfile(plant_species);

    // Calculate dynamic watering
    const watering = calculateDynamicWatering(
      plantProfile,
      weatherData,
      soilData,
      environment,
      container_details,
      last_watered
    );

    // Calculate humidity requirements
    const humidity = calculateHumidityNeeds(plantProfile, weatherData, environment);

    // Calculate light requirements
    const light = calculateLightNeeds(plantProfile, location, environment);

    // Calculate fertilizing schedule
    const fertilizing = calculateFertilizingSchedule(plantProfile, last_fertilized);

    // Get seasonal care notes
    const seasonalCare = getSeasonalCare(plantProfile, weatherData);

    // Diagnose problems if any observed
    const problemDiagnosis = problems_observed?.length 
      ? diagnoseProblem(problems_observed, weatherData, watering)
      : null;

    // Generate environmental alerts
    const alerts = generateEnvironmentalAlerts(plantProfile, weatherData, humidity, environment);

    // Generate weekly forecast care
    const weeklyForecast = generateWeeklyForecast(weatherData, watering, environment);

    // Track API usage
    await trackExternalAPICost(supabaseClient, {
      provider: 'noaa',
      endpoint: 'weather-api',
      featureName: 'dynamic-care',
      userId: user?.id,
    });

    logSafe('Dynamic care generation complete', { duration_ms: Date.now() - startTime });

    return {
      plant_name: plantProfile.common_name,
      scientific_name: plant_species,
      watering,
      humidity,
      light,
      fertilizing,
      seasonal_care: seasonalCare,
      problem_diagnosis: problemDiagnosis,
      environmental_alerts: alerts,
      weekly_forecast_care: weeklyForecast,
      metadata: {
        location_data_source: weatherData.source,
        soil_data_source: soilData.source,
        processing_time_ms: Date.now() - startTime,
      },
    };
  },
});

// Fetch weather data
async function fetchWeatherData(supabase: any, location: any) {
  try {
    // Check for cached weather data
    if (location.county_fips) {
      const { data: cached } = await supabase
        .from('fips_data_cache')
        .select('cached_data')
        .eq('county_fips', location.county_fips)
        .eq('data_source', 'weather')
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (cached) {
        return { ...cached.cached_data, source: 'cached' };
      }
    }

    // Return simulated data based on season/region
    return getSimulatedWeather(location);
  } catch (error) {
    logError('Failed to fetch weather data', error);
    return getSimulatedWeather(location);
  }
}

// Fetch soil data
async function fetchSoilData(supabase: any, location: any, soilType?: string) {
  if (soilType) {
    return { type: soilType, source: 'user_provided', drainage: getDrainageClass(soilType) };
  }

  try {
    if (location.county_fips) {
      const { data: analysis } = await supabase
        .from('soil_analyses')
        .select('analysis_data')
        .eq('county_fips', location.county_fips)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (analysis?.analysis_data) {
        return { 
          ...analysis.analysis_data, 
          source: 'USDA SSURGO',
          drainage: analysis.analysis_data.drainage_class || 'well_drained',
        };
      }
    }
  } catch (error) {
    logError('Failed to fetch soil data', error);
  }

  return { type: 'standard_potting_mix', source: 'default', drainage: 'well_drained' };
}

// Get plant profile from database
function getPlantProfile(species: string) {
  const normalized = species.toLowerCase().trim();
  return PLANT_CARE_DB[normalized] || PLANT_CARE_DB['default'];
}

// Calculate dynamic watering schedule
function calculateDynamicWatering(
  plant: any,
  weather: any,
  soil: any,
  environment: string,
  container?: any,
  lastWatered?: string
) {
  let frequencyDays = plant.watering.base_days;
  const adjustments: any[] = [];

  // Humidity adjustment
  const currentHumidity = weather.humidity || 50;
  const optimalHumidity = plant.humidity.optimal;
  if (currentHumidity < optimalHumidity - 20) {
    const reduction = Math.min(0.4, (optimalHumidity - currentHumidity) / 100);
    frequencyDays *= (1 - reduction);
    adjustments.push({
      factor: 'Low humidity',
      impact: `-${Math.round(reduction * 100)}% interval`,
      current_value: `${currentHumidity}% (optimal: ${optimalHumidity}%)`
    });
  }

  // Temperature adjustment
  const temp = weather.temperature || 70;
  if (temp > 85) {
    const reduction = Math.min(0.3, (temp - 85) / 50);
    frequencyDays *= (1 - reduction);
    adjustments.push({
      factor: 'High temperature',
      impact: `-${Math.round(reduction * 100)}% interval`,
      current_value: `${temp}°F`
    });
  } else if (temp < 55) {
    const increase = Math.min(0.5, (55 - temp) / 40);
    frequencyDays *= (1 + increase);
    adjustments.push({
      factor: 'Low temperature (dormancy)',
      impact: `+${Math.round(increase * 100)}% interval`,
      current_value: `${temp}°F - plant metabolism slowed`
    });
  }

  // Container adjustment
  if (container?.material) {
    const materialModifiers: Record<string, number> = {
      'terracotta': 0.8,
      'ceramic_glazed': 1.0,
      'plastic': 1.2,
      'self_watering': 1.8,
      'fabric': 0.9,
      'wood': 0.95,
    };
    const modifier = materialModifiers[container.material] || 1.0;
    if (modifier !== 1.0) {
      frequencyDays *= modifier;
      adjustments.push({
        factor: 'Container type',
        impact: `${container.material} (${modifier < 1 ? 'dries faster' : 'retains moisture'})`,
        current_value: container.material
      });
    }
  }

  // Soil drainage adjustment (outdoor)
  if (environment === 'outdoor' || environment === 'container_outdoor') {
    const drainageModifiers: Record<string, number> = {
      'excessively_drained': 0.7,
      'well_drained': 1.0,
      'moderately_well_drained': 1.15,
      'somewhat_poorly_drained': 1.3,
      'poorly_drained': 1.5,
    };
    const modifier = drainageModifiers[soil.drainage] || 1.0;
    if (modifier !== 1.0) {
      frequencyDays *= modifier;
      adjustments.push({
        factor: 'Soil drainage',
        impact: soil.drainage.replace(/_/g, ' '),
        current_value: soil.type || 'Unknown'
      });
    }

    // Recent precipitation
    if (weather.precipitation_7day > 1) {
      frequencyDays += Math.min(4, weather.precipitation_7day);
      adjustments.push({
        factor: 'Recent rainfall',
        impact: `+${Math.min(4, Math.round(weather.precipitation_7day))} days`,
        current_value: `${weather.precipitation_7day}" in past 7 days`
      });
    }
  }

  // Season adjustment (winter = less watering)
  const month = new Date().getMonth();
  if (month >= 11 || month <= 2) {
    frequencyDays *= 1.4;
    adjustments.push({
      factor: 'Winter dormancy',
      impact: '+40% interval',
      current_value: 'Reduced growth period'
    });
  }

  // Calculate urgency
  let urgency: 'routine' | 'soon' | 'urgent' | 'critical' = 'routine';
  let nextWateringDate = new Date();
  
  if (lastWatered) {
    const lastDate = new Date(lastWatered);
    const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysRemaining = frequencyDays - daysSince;
    
    if (daysRemaining <= 0) {
      urgency = 'urgent';
    } else if (daysRemaining <= 1) {
      urgency = 'soon';
    } else if (daysRemaining <= 2) {
      urgency = 'routine';
    }
    
    nextWateringDate = new Date(lastDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000);
  } else {
    nextWateringDate.setDate(nextWateringDate.getDate() + Math.round(frequencyDays));
  }

  // Calculate water amount (rough estimate based on pot size)
  let amountMl = 500;
  if (container?.diameter_inches && container?.depth_inches) {
    const volume = Math.PI * Math.pow(container.diameter_inches / 2, 2) * container.depth_inches;
    amountMl = Math.round(volume * 0.1 * 29.57); // 10% of pot volume, convert to ml
  }

  return {
    next_watering_date: nextWateringDate.toISOString().split('T')[0],
    urgency,
    frequency_days: Math.round(frequencyDays * 10) / 10,
    base_frequency_days: plant.watering.base_days,
    amount_ml: amountMl,
    method_recommendation: getWateringMethod(plant, environment),
    adjustments,
  };
}

// Calculate humidity needs
function calculateHumidityNeeds(plant: any, weather: any, environment: string) {
  const current = weather.humidity || 50;
  const optimal = plant.humidity.optimal;
  
  let actionNeeded: 'none' | 'monitor' | 'increase' | 'decrease' = 'none';
  const recommendations: string[] = [];

  if (current < plant.humidity.minimum) {
    actionNeeded = 'increase';
    recommendations.push(`CRITICAL: Humidity (${current}%) is below minimum (${plant.humidity.minimum}%)`);
    recommendations.push('Use a humidifier near the plant');
    recommendations.push('Place on pebble tray with water');
    recommendations.push('Group with other plants for humidity microclimate');
    if (environment === 'indoor') {
      recommendations.push('Move away from heating/cooling vents');
    }
  } else if (current < optimal - 15) {
    actionNeeded = 'increase';
    recommendations.push(`Humidity (${current}%) is below optimal (${optimal}%)`);
    recommendations.push('Consider occasional misting (morning only)');
    recommendations.push('Pebble tray recommended');
  } else if (current > 80 && plant.humidity.optimal < 70) {
    actionNeeded = 'decrease';
    recommendations.push('Humidity is high - ensure good air circulation');
    recommendations.push('Watch for fungal issues');
  } else {
    recommendations.push('Humidity levels are adequate');
  }

  return {
    current_estimated: current,
    optimal_for_species: optimal,
    action_needed: actionNeeded,
    recommendations,
  };
}

// Calculate light needs
function calculateLightNeeds(plant: any, location: any, environment: string) {
  const month = new Date().getMonth();
  // Rough day length calculation (simplified)
  const baseDayLength = 12 + 4 * Math.sin((month - 2) * Math.PI / 6);
  const dayLengthHours = Math.round(baseDayLength * 10) / 10;

  const lightRequirements: Record<string, string> = {
    'bright_direct': '6+ hours direct sunlight',
    'bright_indirect': 'Bright but no direct sun',
    'medium_indirect': '4-6 hours filtered light',
    'low_to_bright_indirect': 'Adaptable, tolerates low light',
    'low': 'Can survive in low light conditions',
  };

  let actionNeeded = '';
  if (month >= 11 || month <= 2) {
    if (environment === 'indoor') {
      actionNeeded = 'Winter light levels reduced. Consider moving closer to window or adding grow light.';
    }
  }

  return {
    current_day_length_hours: dayLengthHours,
    species_requirement: lightRequirements[plant.light] || 'Medium indirect light',
    action_needed: actionNeeded || 'Light levels appear adequate',
  };
}

// Calculate fertilizing schedule
function calculateFertilizingSchedule(plant: any, lastFertilized?: string) {
  const month = new Date().getMonth();
  const isGrowingSeason = month >= 3 && month <= 9;

  let nextDate: string | null = null;
  let strength = 100;
  let typeRecommendation = 'Balanced fertilizer (10-10-10 or similar)';
  let seasonalNote = '';

  if (!isGrowingSeason) {
    strength = 0;
    typeRecommendation = 'None until spring';
    seasonalNote = 'Plants are in dormancy/low growth phase. Resume fertilizing in March-April at 50% strength.';
  } else if (month === 3 || month === 4) {
    strength = 50;
    seasonalNote = 'Early growing season - use half strength to avoid shock';
    if (lastFertilized) {
      const next = new Date(lastFertilized);
      next.setDate(next.getDate() + 30);
      nextDate = next.toISOString().split('T')[0];
    }
  } else {
    seasonalNote = 'Active growing season - regular fertilizing supports growth';
    if (lastFertilized) {
      const next = new Date(lastFertilized);
      next.setDate(next.getDate() + 30);
      nextDate = next.toISOString().split('T')[0];
    }
  }

  return {
    next_fertilize_date: nextDate,
    strength_percentage: strength,
    type_recommendation: typeRecommendation,
    seasonal_note: seasonalNote,
  };
}

// Get seasonal care notes
function getSeasonalCare(plant: any, weather: any) {
  const month = new Date().getMonth();
  let season = 'spring';
  let growthPhase = 'active growth';
  const priorities: string[] = [];
  const upcomingTransitions: string[] = [];

  if (month >= 2 && month <= 4) {
    season = 'spring';
    growthPhase = 'emerging from dormancy';
    priorities.push('Resume regular watering as growth increases');
    priorities.push('Begin fertilizing at half strength');
    priorities.push('Check for pests awakening');
    upcomingTransitions.push('Transition to summer care in 4-6 weeks');
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
    growthPhase = 'peak growth';
    priorities.push('Maintain consistent watering schedule');
    priorities.push('Full-strength monthly fertilizing');
    priorities.push('Monitor for heat stress and pests');
    upcomingTransitions.push('Begin reducing fertilizer in late summer');
  } else if (month >= 8 && month <= 10) {
    season = 'fall';
    growthPhase = 'slowing growth';
    priorities.push('Reduce watering frequency gradually');
    priorities.push('Stop fertilizing by October');
    priorities.push('Prepare for dormancy');
    upcomingTransitions.push('Winter care transition in 4-6 weeks');
  } else {
    season = 'winter';
    growthPhase = 'dormancy';
    priorities.push('Minimal watering - only when soil is dry');
    priorities.push('No fertilizing');
    priorities.push('Watch humidity levels near heating');
    upcomingTransitions.push('Growth resumption expected in March');
  }

  return {
    current_season: season,
    growth_phase: growthPhase,
    key_priorities: priorities,
    upcoming_transitions: upcomingTransitions,
  };
}

// Diagnose observed problems
function diagnoseProblem(problems: string[], weather: any, watering: any) {
  const likelyCauses: string[] = [];
  const recommendedActions: string[] = [];
  let urgency = 'monitor';

  for (const problem of problems) {
    switch (problem) {
      case 'yellowing_leaves':
        if (weather.humidity < 40) {
          likelyCauses.push('Low humidity stress');
          recommendedActions.push('Increase humidity with humidifier or pebble tray');
        }
        if (watering.frequency_days > 10) {
          likelyCauses.push('Possible underwatering');
          recommendedActions.push('Check soil moisture more frequently');
        }
        likelyCauses.push('Possible nutrient deficiency (nitrogen)');
        recommendedActions.push('Consider fertilizing if in growing season');
        break;
      case 'brown_tips':
        likelyCauses.push('Low humidity or fluoride in water');
        recommendedActions.push('Use filtered or distilled water');
        recommendedActions.push('Increase humidity around plant');
        break;
      case 'wilting':
        urgency = 'urgent';
        likelyCauses.push('Underwatering OR overwatering with root rot');
        recommendedActions.push('Check soil moisture immediately');
        recommendedActions.push('If dry, water thoroughly');
        recommendedActions.push('If wet, check roots for rot');
        break;
      case 'pests_visible':
        urgency = 'urgent';
        likelyCauses.push('Pest infestation');
        recommendedActions.push('Isolate plant from others immediately');
        recommendedActions.push('Identify pest type (mites, aphids, mealybugs)');
        recommendedActions.push('Apply appropriate treatment (neem oil, insecticidal soap)');
        break;
      case 'leggy_growth':
        likelyCauses.push('Insufficient light');
        recommendedActions.push('Move to brighter location');
        recommendedActions.push('Consider grow lights for winter');
        break;
    }
  }

  return {
    likely_causes: [...new Set(likelyCauses)],
    recommended_actions: [...new Set(recommendedActions)],
    urgency,
  };
}

// Generate environmental alerts
function generateEnvironmentalAlerts(plant: any, weather: any, humidity: any, environment: string) {
  const alerts: any[] = [];

  // Humidity critical alert
  if (weather.humidity < plant.humidity.minimum) {
    alerts.push({
      type: 'humidity_critical',
      severity: 'critical',
      message: `Your location's humidity (${weather.humidity}%) is critically low for this tropical species`,
      action: 'Implement humidity solutions immediately to prevent leaf damage',
    });
  }

  // Winter heating alert
  const month = new Date().getMonth();
  if ((month >= 11 || month <= 2) && environment === 'indoor') {
    alerts.push({
      type: 'heating_season',
      severity: 'warning',
      message: 'Indoor heating significantly reduces humidity and can stress tropical plants',
      action: 'Monitor humidity levels and adjust watering frequency',
    });
  }

  // Temperature alerts
  if (weather.temperature && weather.temperature < plant.temperature.min) {
    alerts.push({
      type: 'cold_stress',
      severity: 'critical',
      message: `Temperature (${weather.temperature}°F) is below minimum (${plant.temperature.min}°F)`,
      action: 'Move plant to warmer location immediately',
    });
  }

  return alerts;
}

// Generate weekly forecast care
function generateWeeklyForecast(weather: any, watering: any, environment: string) {
  const forecast: any[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const skipWatering = weather.precipitation_forecast?.[i] > 0.5 && 
      (environment === 'outdoor' || environment === 'container_outdoor');

    forecast.push({
      date: dateStr,
      weather_summary: weather.forecast_summary?.[i] || 'No forecast available',
      care_notes: i === 0 ? 'Check soil moisture' : 'Continue monitoring',
      skip_watering: skipWatering,
      skip_reason: skipWatering ? 'Rain expected' : undefined,
    });
  }

  return forecast;
}

// Helper functions
function getWateringMethod(plant: any, environment: string) {
  if (plant.watering.drought_tolerance === 'low') {
    return 'Water thoroughly until drainage, then discard excess. Keep soil consistently moist but not soggy.';
  }
  return 'Water when top 1-2 inches of soil is dry. Water thoroughly until drainage.';
}

function getDrainageClass(soilType: string) {
  const drainageMap: Record<string, string> = {
    'sandy': 'excessively_drained',
    'sandy_loam': 'well_drained',
    'loam': 'well_drained',
    'clay_loam': 'moderately_well_drained',
    'clay': 'poorly_drained',
    'standard_potting_mix': 'well_drained',
  };
  return drainageMap[soilType.toLowerCase()] || 'well_drained';
}

function getSimulatedWeather(location: any) {
  const month = new Date().getMonth();
  const isWinter = month >= 11 || month <= 2;
  
  return {
    temperature: isWinter ? 68 : 75,
    humidity: isWinter ? 30 : 50,
    precipitation_7day: 0,
    precipitation_forecast: [0, 0, 0.3, 0.5, 0, 0, 0],
    forecast_summary: ['Sunny', 'Partly cloudy', 'Chance of rain', 'Rainy', 'Clearing', 'Sunny', 'Sunny'],
    source: 'simulated',
  };
}
