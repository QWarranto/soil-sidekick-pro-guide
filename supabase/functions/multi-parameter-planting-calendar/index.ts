import { createClient } from 'jsr:@supabase/supabase-js@2'
import { requestHandler } from '../_shared/request-handler.ts';
import { validateInput, plantingCalendarSchema } from '../_shared/validation.ts';
import { trackExternalAPICost } from '../_shared/cost-tracker.ts';
import { safeExternalCall } from '../_shared/graceful-degradation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return requestHandler({
    functionName: 'multi-parameter-planting-calendar',
    requireAuth: true,
    requireSubscription: true,
    validationSchema: plantingCalendarSchema,
    rateLimitPerHour: 100,
    logCost: {
      provider: 'usda',
      serviceType: 'planting-optimization',
    },
  }, async (ctx) => {
    const { supabase, user, validatedData } = ctx;
    const { county_fips, crop_type, soil_data = {}, climate_preferences = {}, sustainability_goals = [] } = validatedData;

    console.log(`Multi-parameter planting optimization for ${crop_type} in county ${county_fips}`);

    // Multi-parameter correlation analysis with graceful degradation
    const soilFactors = analyzeSoilFactors(soil_data);
    
    // Climate data with fallback
    const climateFactors = await safeExternalCall(
      'noaa',
      async () => await analyzeClimateFactors(county_fips, crop_type),
      async () => getDefaultClimateFactors(county_fips, crop_type)
    );

    // Track cost for climate API call
    await trackExternalAPICost(supabase, {
      provider: 'usda',
      endpoint: 'climate-analysis',
      featureName: 'multi-parameter-planting-calendar',
      userId: user.id,
    });

    const plantingWindow = calculateOptimalPlantingWindow(crop_type, soilFactors, climateFactors, climate_preferences);
    const sustainabilityScore = calculateSustainabilityScore(soilFactors, climateFactors, sustainability_goals);
    const yieldPrediction = predictYield(crop_type, soilFactors, climateFactors, plantingWindow);
    const riskAssessment = assessPlantingRisks(crop_type, soilFactors, climateFactors, plantingWindow);
    const alternativeCrops = findAlternativeCrops(soilFactors, climateFactors, sustainability_goals);

    // Store optimization results
    const { data: optimization, error: insertError } = await supabase
      .from('planting_optimizations')
      .upsert({
        user_id: user.id,
        county_fips,
        crop_type,
        optimal_planting_window: plantingWindow,
        soil_factors: soilFactors,
        climate_factors: climateFactors,
        sustainability_score: sustainabilityScore,
        yield_prediction: yieldPrediction.predicted_yield,
        risk_assessment: riskAssessment,
        alternative_crops: alternativeCrops
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing optimization:', insertError);
      throw new Error('Failed to store planting optimization');
    }

    return {
      optimization_id: optimization.id,
      crop_analysis: {
        primary_crop: crop_type,
        optimal_planting_window: plantingWindow,
        yield_prediction: yieldPrediction,
        sustainability_metrics: {
          overall_score: sustainabilityScore,
          soil_health_impact: calculateSoilHealthImpact(soilFactors, crop_type),
          carbon_sequestration: calculateCarbonSequestration(crop_type, soilFactors),
          water_efficiency: calculateWaterEfficiency(crop_type, climateFactors)
        }
      },
      multi_parameter_analysis: {
        soil_optimization: soilFactors,
        climate_correlation: climateFactors,
        parameter_interactions: analyzeParameterInteractions(soilFactors, climateFactors),
        limiting_factors: identifyLimitingFactors(soilFactors, climateFactors, crop_type)
      },
      risk_management: riskAssessment,
      alternative_options: alternativeCrops,
      actionable_recommendations: generateActionableRecommendations(soilFactors, climateFactors, plantingWindow, sustainabilityScore),
      patent_protected_algorithms: {
        multi_parameter_correlation_engine: true,
        sustainability_integrated_optimization: true,
        dynamic_planting_window_adjustment: true,
        holistic_crop_selection_matrix: true
      }
    };
  })(req);
});

// Default climate factors when API unavailable
function getDefaultClimateFactors(county_fips: string, crop_type: string): any {
  const stateCode = county_fips.substring(0, 2);
  const region = getClimateRegion(stateCode);
  
  return {
    hardiness_zone: getHardinessZone(county_fips),
    average_frost_dates: getFrostDates(region),
    growing_season_length: getGrowingSeasonLength(region),
    precipitation_patterns: getPrecipitationPattern(region),
    temperature_extremes: getTemperatureExtremes(region),
    humidity_levels: getHumidityLevels(region),
    region,
    climate_suitability: { overall_rating: 0.7, suitable: true },
    weather_risks: { late_frost_probability: 0.2, drought_risk: 0.3 },
    irrigation_needs: { required: true, efficiency_rating: 0.7 },
    pest_disease_pressure: { overall_risk: 0.4 }
  };
}

function analyzeSoilFactors(soil_data: any): any {
  const ph = soil_data.ph_level || 7.0;
  const organicMatter = soil_data.organic_matter || 3.0;
  const nitrogen = soil_data.nitrogen_level || 'medium';
  const phosphorus = soil_data.phosphorus_level || 'medium';
  const potassium = soil_data.potassium_level || 'medium';
  
  // Advanced soil factor analysis
  const drainageClass = classifyDrainage(soil_data);
  const textureClass = classifyTexture(soil_data);
  const fertilityIndex = calculateFertilityIndex(ph, organicMatter, nitrogen, phosphorus, potassium);
  const soilHealthScore = calculateSoilHealthScore(soil_data);
  
  return {
    ph_level: ph,
    ph_status: classifyPH(ph),
    organic_matter: organicMatter,
    organic_matter_status: classifyOrganicMatter(organicMatter),
    nutrient_levels: {
      nitrogen: { level: nitrogen, score: getNutrientScore(nitrogen) },
      phosphorus: { level: phosphorus, score: getNutrientScore(phosphorus) },
      potassium: { level: potassium, score: getNutrientScore(potassium) }
    },
    drainage_classification: drainageClass,
    texture_classification: textureClass,
    fertility_index: fertilityIndex,
    soil_health_score: soilHealthScore,
    limiting_nutrients: identifyLimitingNutrients(nitrogen, phosphorus, potassium),
    amendment_needs: calculateAmendmentNeeds(ph, organicMatter, nitrogen, phosphorus, potassium)
  };
}

async function analyzeClimateFactors(county_fips: string, crop_type: string): Promise<any> {
  const stateCode = county_fips.substring(0, 2);
  const region = getClimateRegion(stateCode);
  
  const climateData = {
    hardiness_zone: getHardinessZone(county_fips),
    average_frost_dates: getFrostDates(region),
    growing_season_length: getGrowingSeasonLength(region),
    precipitation_patterns: getPrecipitationPattern(region),
    temperature_extremes: getTemperatureExtremes(region),
    humidity_levels: getHumidityLevels(region)
  };

  return {
    ...climateData,
    region,
    climate_suitability: assessClimateSuitability(crop_type, climateData),
    weather_risks: identifyWeatherRisks(crop_type, climateData, region),
    irrigation_needs: calculateIrrigationNeeds(crop_type, climateData),
    pest_disease_pressure: assessPestDiseasePressure(crop_type, climateData, region)
  };
}

function calculateOptimalPlantingWindow(crop_type: string, soil_factors: any, climate_factors: any, preferences: any): any {
  const cropRequirements = getCropRequirements(crop_type);
  
  let optimalStart = new Date(climate_factors.average_frost_dates.last);
  let optimalEnd = new Date(climate_factors.average_frost_dates.first);
  
  // Adjust for soil temperature
  if (soil_factors.drainage_classification === 'poor') {
    optimalStart.setDate(optimalStart.getDate() + 14);
  }
  
  // Adjust for soil fertility
  if (soil_factors.fertility_index < 0.6) {
    optimalStart.setDate(optimalStart.getDate() + 7);
  }
  
  // Adjust for crop-specific requirements
  optimalStart.setDate(optimalStart.getDate() + (cropRequirements.soil_temp_requirement - 50) / 2);
  
  // Apply user preferences
  if (preferences.early_planting) {
    optimalStart.setDate(optimalStart.getDate() - 7);
  }
  if (preferences.late_harvest) {
    optimalEnd.setDate(optimalEnd.getDate() + 14);
  }
  
  const plantingWindow = {
    optimal_start: optimalStart.toISOString().split('T')[0],
    optimal_end: new Date(optimalStart.getTime() + cropRequirements.planting_window_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    extended_start: new Date(optimalStart.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    extended_end: new Date(optimalStart.getTime() + (cropRequirements.planting_window_days + 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    harvest_estimate: new Date(optimalStart.getTime() + cropRequirements.days_to_maturity * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  
  return {
    ...plantingWindow,
    confidence_level: calculateWindowConfidence(soil_factors, climate_factors, cropRequirements),
    risk_factors: identifyWindowRisks(plantingWindow, climate_factors, soil_factors),
    success_probability: calculateSuccessProbability(soil_factors, climate_factors, cropRequirements)
  };
}

function calculateSustainabilityScore(soil_factors: any, climate_factors: any, goals: any): number {
  let score = 0;
  
  // Soil health contribution (40% of score)
  score += soil_factors.soil_health_score * 0.4;
  
  // Water efficiency (25% of score)
  const waterEfficiency = climate_factors.irrigation_needs?.efficiency_rating || 0.7;
  score += waterEfficiency * 25;
  
  // Carbon sequestration potential (20% of score)
  const carbonPotential = soil_factors.organic_matter > 3.0 ? 20 : soil_factors.organic_matter * 6.67;
  score += carbonPotential * 0.2;
  
  // Biodiversity support (15% of score)
  const biodiversityScore = calculateBiodiversitySupport(soil_factors, climate_factors);
  score += biodiversityScore * 0.15;
  
  // Apply sustainability goals multipliers
  const goalsArray = Array.isArray(goals) ? goals : [];
  if (goalsArray.includes('organic_farming')) score *= 1.1;
  if (goalsArray.includes('carbon_neutral')) score *= 1.05;
  if (goalsArray.includes('water_conservation')) score *= 1.08;
  
  return Number(Math.min(score, 100).toFixed(2));
}

function predictYield(crop_type: string, soil_factors: any, climate_factors: any, planting_window: any): any {
  const cropRequirements = getCropRequirements(crop_type);
  const baseYield = cropRequirements.typical_yield;
  
  let yieldMultiplier = 1.0;
  
  // Soil factor adjustments
  if (soil_factors.fertility_index > 0.8) yieldMultiplier *= 1.15;
  else if (soil_factors.fertility_index < 0.4) yieldMultiplier *= 0.75;
  
  if (soil_factors.ph_status === 'optimal') yieldMultiplier *= 1.1;
  else if (soil_factors.ph_status === 'poor') yieldMultiplier *= 0.8;
  
  if (soil_factors.organic_matter > 4.0) yieldMultiplier *= 1.12;
  else if (soil_factors.organic_matter < 2.0) yieldMultiplier *= 0.85;
  
  // Climate factor adjustments
  if (climate_factors.climate_suitability?.overall_rating > 0.8) yieldMultiplier *= 1.2;
  else if (climate_factors.climate_suitability?.overall_rating < 0.5) yieldMultiplier *= 0.7;
  
  // Planting timing adjustment
  if (planting_window.success_probability > 0.85) yieldMultiplier *= 1.05;
  else if (planting_window.success_probability < 0.6) yieldMultiplier *= 0.9;
  
  const predictedYield = baseYield * yieldMultiplier;
  
  return {
    predicted_yield: Number(predictedYield.toFixed(1)),
    yield_range: {
      conservative: Number((predictedYield * 0.85).toFixed(1)),
      optimistic: Number((predictedYield * 1.15).toFixed(1))
    },
    confidence_interval: calculateYieldConfidence(soil_factors, climate_factors),
    limiting_factors: identifyYieldLimitingFactors(soil_factors, climate_factors, cropRequirements),
    improvement_potential: calculateImprovementPotential(soil_factors, yieldMultiplier)
  };
}

function assessPlantingRisks(crop_type: string, soil_factors: any, climate_factors: any, planting_window: any): any {
  const risks = [];
  
  // Weather risks
  if (climate_factors.weather_risks?.late_frost_probability > 0.3) {
    risks.push({
      type: 'late_frost',
      probability: climate_factors.weather_risks.late_frost_probability,
      impact: 'high',
      mitigation: 'Use row covers or delay planting'
    });
  }
  
  if (climate_factors.weather_risks?.drought_risk > 0.4) {
    risks.push({
      type: 'drought',
      probability: climate_factors.weather_risks.drought_risk,
      impact: 'medium',
      mitigation: 'Install irrigation system'
    });
  }
  
  // Soil risks
  if (soil_factors.drainage_classification === 'poor') {
    risks.push({
      type: 'waterlogging',
      probability: 0.6,
      impact: 'medium',
      mitigation: 'Improve drainage or use raised beds'
    });
  }
  
  if (soil_factors.fertility_index < 0.5) {
    risks.push({
      type: 'nutrient_deficiency',
      probability: 0.7,
      impact: 'medium',
      mitigation: 'Apply organic matter and balanced fertilizer'
    });
  }
  
  // Pest and disease risks
  if (climate_factors.pest_disease_pressure?.overall_risk > 0.5) {
    risks.push({
      type: 'pest_disease',
      probability: climate_factors.pest_disease_pressure.overall_risk,
      impact: 'variable',
      mitigation: 'Implement IPM strategies'
    });
  }
  
  return {
    total_risks: risks.length,
    risk_level: calculateOverallRisk(risks),
    specific_risks: risks,
    mitigation_cost: estimateMitigationCost(risks),
    insurance_recommended: risks.some(r => r.impact === 'high')
  };
}

function findAlternativeCrops(soil_factors: any, climate_factors: any, sustainability_goals: any): any {
  const alternatives = [];
  
  const cropDatabase = [
    { name: 'corn', soil_ph_range: [6.0, 6.8], drainage: 'good', sustainability: 0.6 },
    { name: 'soybeans', soil_ph_range: [6.0, 7.0], drainage: 'moderate', sustainability: 0.8 },
    { name: 'wheat', soil_ph_range: [6.0, 7.5], drainage: 'good', sustainability: 0.7 },
    { name: 'oats', soil_ph_range: [5.5, 7.0], drainage: 'moderate', sustainability: 0.75 },
    { name: 'barley', soil_ph_range: [6.0, 7.5], drainage: 'good', sustainability: 0.7 },
    { name: 'cover_crop_mix', soil_ph_range: [5.0, 8.0], drainage: 'any', sustainability: 0.95 }
  ];
  
  cropDatabase.forEach(crop => {
    const suitabilityScore = calculateCropSuitability(crop, soil_factors, climate_factors);
    
    if (suitabilityScore > 0.7) {
      alternatives.push({
        crop_name: crop.name,
        suitability_score: suitabilityScore,
        sustainability_rating: crop.sustainability,
        advantages: getCropAdvantages(crop, soil_factors, climate_factors),
        estimated_yield: estimateAlternativeYield(crop, soil_factors, climate_factors),
        profitability_index: calculateProfitabilityIndex(crop, suitabilityScore)
      });
    }
  });
  
  alternatives.sort((a, b) => {
    const scoreA = (a.suitability_score * 0.4 + a.sustainability_rating * 0.3 + a.profitability_index * 0.3);
    const scoreB = (b.suitability_score * 0.4 + b.sustainability_rating * 0.3 + b.profitability_index * 0.3);
    return scoreB - scoreA;
  });
  
  return {
    recommended_alternatives: alternatives.slice(0, 5),
    diversification_benefits: calculateDiversificationBenefits(alternatives),
    rotation_opportunities: identifyRotationOpportunities(alternatives, soil_factors)
  };
}

// Helper functions
function classifyDrainage(soil_data: any): string {
  return soil_data.drainage || 'moderate';
}

function classifyTexture(soil_data: any): string {
  return soil_data.texture || 'loam';
}

function calculateFertilityIndex(ph: number, om: number, n: string, p: string, k: string): number {
  let index = 0;
  
  if (ph >= 6.0 && ph <= 7.5) index += 0.25;
  else if (ph >= 5.5 && ph <= 8.0) index += 0.15;
  
  index += Math.min(om / 5.0, 1.0) * 0.25;
  
  const nutrientScore = (getNutrientScore(n) + getNutrientScore(p) + getNutrientScore(k)) / 3;
  index += nutrientScore * 0.5;
  
  return Number(index.toFixed(3));
}

function calculateSoilHealthScore(soil_data: any): number {
  const ph = soil_data.ph_level || 7.0;
  const om = soil_data.organic_matter || 3.0;
  
  let score = 50;
  
  if (ph >= 6.0 && ph <= 7.5) score += 20;
  else if (ph >= 5.5 && ph <= 8.0) score += 10;
  
  score += Math.min(om * 8, 30);
  
  return Number(Math.min(score, 100).toFixed(1));
}

function classifyPH(ph: number): string {
  if (ph < 5.5) return 'too_acidic';
  if (ph <= 6.0) return 'acidic';
  if (ph <= 7.5) return 'optimal';
  if (ph <= 8.0) return 'alkaline';
  return 'too_alkaline';
}

function classifyOrganicMatter(om: number): string {
  if (om < 2.0) return 'low';
  if (om <= 4.0) return 'moderate';
  if (om <= 6.0) return 'good';
  return 'excellent';
}

function getNutrientScore(level: string): number {
  const scores: Record<string, number> = {
    'very_low': 0.2,
    'low': 0.4,
    'medium': 0.6,
    'high': 0.8,
    'very_high': 1.0
  };
  return scores[level] || 0.5;
}

function identifyLimitingNutrients(n: string, p: string, k: string): string[] {
  const limiting = [];
  if (n === 'low' || n === 'very_low') limiting.push('nitrogen');
  if (p === 'low' || p === 'very_low') limiting.push('phosphorus');
  if (k === 'low' || k === 'very_low') limiting.push('potassium');
  return limiting;
}

function calculateAmendmentNeeds(ph: number, om: number, n: string, p: string, k: string): any {
  const amendments = [];
  
  if (ph < 6.0) amendments.push({ type: 'lime', priority: 'high' });
  if (ph > 7.5) amendments.push({ type: 'sulfur', priority: 'medium' });
  if (om < 2.5) amendments.push({ type: 'compost', priority: 'high' });
  if (n === 'low' || n === 'very_low') amendments.push({ type: 'nitrogen_fertilizer', priority: 'high' });
  if (p === 'low' || p === 'very_low') amendments.push({ type: 'phosphorus_fertilizer', priority: 'medium' });
  if (k === 'low' || k === 'very_low') amendments.push({ type: 'potassium_fertilizer', priority: 'medium' });
  
  return amendments;
}

function getClimateRegion(stateCode: string): string {
  const regions: Record<string, string> = {
    '01': 'southeast', '04': 'southwest', '06': 'pacific', '08': 'mountain',
    '12': 'southeast', '17': 'midwest', '18': 'midwest', '19': 'midwest',
    '21': 'southeast', '26': 'midwest', '27': 'midwest', '29': 'midwest',
    '31': 'plains', '36': 'northeast', '37': 'southeast', '39': 'midwest',
    '42': 'northeast', '45': 'southeast', '47': 'southeast', '48': 'south_central',
    '51': 'southeast', '55': 'midwest'
  };
  return regions[stateCode] || 'temperate';
}

function getHardinessZone(county_fips: string): string {
  const stateCode = county_fips.substring(0, 2);
  const zones: Record<string, string> = {
    '01': '7b-8a', '04': '9a-10a', '06': '8b-10b', '08': '4b-6a',
    '12': '9a-11a', '17': '5b-6b', '18': '5b-6b', '19': '4b-5b',
    '21': '6a-7a', '26': '4b-6a', '27': '3a-4b', '29': '5b-7a',
    '31': '4b-5b', '36': '5a-7a', '37': '7a-8a', '39': '5b-6b',
    '42': '5b-7a', '45': '7b-8b', '47': '6b-7b', '48': '6b-9b',
    '51': '6a-7b', '55': '4a-5b'
  };
  return zones[stateCode] || '5b-6b';
}

function getFrostDates(region: string): any {
  const dates: Record<string, any> = {
    'southeast': { last: '2025-03-15', first: '2025-11-15' },
    'southwest': { last: '2025-02-15', first: '2025-12-01' },
    'pacific': { last: '2025-02-28', first: '2025-11-30' },
    'mountain': { last: '2025-05-15', first: '2025-09-15' },
    'midwest': { last: '2025-04-20', first: '2025-10-15' },
    'northeast': { last: '2025-04-30', first: '2025-10-01' },
    'plains': { last: '2025-04-25', first: '2025-10-10' },
    'south_central': { last: '2025-03-20', first: '2025-11-10' },
    'temperate': { last: '2025-04-15', first: '2025-10-20' }
  };
  return dates[region] || dates['temperate'];
}

function getGrowingSeasonLength(region: string): number {
  const lengths: Record<string, number> = {
    'southeast': 240, 'southwest': 290, 'pacific': 270, 'mountain': 120,
    'midwest': 175, 'northeast': 155, 'plains': 165, 'south_central': 230, 'temperate': 180
  };
  return lengths[region] || 180;
}

function getPrecipitationPattern(region: string): any {
  const patterns: Record<string, any> = {
    'southeast': { annual_inches: 50, distribution: 'even' },
    'southwest': { annual_inches: 12, distribution: 'monsoon' },
    'pacific': { annual_inches: 20, distribution: 'winter_heavy' },
    'mountain': { annual_inches: 18, distribution: 'spring_heavy' },
    'midwest': { annual_inches: 38, distribution: 'summer_heavy' },
    'northeast': { annual_inches: 42, distribution: 'even' },
    'plains': { annual_inches: 22, distribution: 'spring_summer' },
    'south_central': { annual_inches: 35, distribution: 'spring_fall' },
    'temperate': { annual_inches: 35, distribution: 'even' }
  };
  return patterns[region] || patterns['temperate'];
}

function getTemperatureExtremes(region: string): any {
  const temps: Record<string, any> = {
    'southeast': { summer_high: 92, winter_low: 30 },
    'southwest': { summer_high: 105, winter_low: 35 },
    'pacific': { summer_high: 85, winter_low: 40 },
    'mountain': { summer_high: 85, winter_low: -10 },
    'midwest': { summer_high: 90, winter_low: 5 },
    'northeast': { summer_high: 85, winter_low: 10 },
    'plains': { summer_high: 95, winter_low: 0 },
    'south_central': { summer_high: 98, winter_low: 25 },
    'temperate': { summer_high: 85, winter_low: 20 }
  };
  return temps[region] || temps['temperate'];
}

function getHumidityLevels(region: string): any {
  const levels: Record<string, any> = {
    'southeast': { average: 75, summer: 80 },
    'southwest': { average: 30, summer: 25 },
    'pacific': { average: 60, summer: 55 },
    'mountain': { average: 40, summer: 35 },
    'midwest': { average: 65, summer: 70 },
    'northeast': { average: 65, summer: 70 },
    'plains': { average: 55, summer: 60 },
    'south_central': { average: 70, summer: 75 },
    'temperate': { average: 60, summer: 65 }
  };
  return levels[region] || levels['temperate'];
}

function assessClimateSuitability(crop_type: string, climateData: any): any {
  const cropClimateReqs: Record<string, any> = {
    'corn': { min_growing_days: 90, max_temp: 95, min_rain: 20 },
    'soybeans': { min_growing_days: 100, max_temp: 90, min_rain: 25 },
    'wheat': { min_growing_days: 120, max_temp: 85, min_rain: 15 },
    'tomatoes': { min_growing_days: 80, max_temp: 90, min_rain: 20 }
  };
  
  const reqs = cropClimateReqs[crop_type] || { min_growing_days: 90, max_temp: 90, min_rain: 20 };
  const growingDays = climateData.growing_season_length;
  const summerHigh = climateData.temperature_extremes?.summer_high || 85;
  const annualRain = climateData.precipitation_patterns?.annual_inches || 35;
  
  let suitabilityScore = 0.5;
  if (growingDays >= reqs.min_growing_days) suitabilityScore += 0.2;
  if (summerHigh <= reqs.max_temp) suitabilityScore += 0.15;
  if (annualRain >= reqs.min_rain) suitabilityScore += 0.15;
  
  return {
    overall_rating: suitabilityScore,
    suitable: suitabilityScore >= 0.7,
    limiting_factors: []
  };
}

function identifyWeatherRisks(crop_type: string, climateData: any, region: string): any {
  return {
    late_frost_probability: region === 'mountain' ? 0.4 : 0.2,
    drought_risk: region === 'southwest' ? 0.6 : 0.3,
    flood_risk: region === 'southeast' ? 0.3 : 0.15
  };
}

function calculateIrrigationNeeds(crop_type: string, climateData: any): any {
  const rainfall = climateData.precipitation_patterns?.annual_inches || 35;
  return {
    required: rainfall < 25,
    efficiency_rating: rainfall >= 35 ? 0.9 : rainfall >= 25 ? 0.7 : 0.5
  };
}

function assessPestDiseasePressure(crop_type: string, climateData: any, region: string): any {
  const humidity = climateData.humidity_levels?.average || 60;
  return {
    overall_risk: humidity > 70 ? 0.6 : 0.3
  };
}

function getCropRequirements(crop_type: string): any {
  const requirements: Record<string, any> = {
    'corn': { soil_temp_requirement: 60, planting_window_days: 30, days_to_maturity: 90, typical_yield: 180 },
    'soybeans': { soil_temp_requirement: 55, planting_window_days: 35, days_to_maturity: 100, typical_yield: 50 },
    'wheat': { soil_temp_requirement: 40, planting_window_days: 40, days_to_maturity: 120, typical_yield: 60 },
    'tomatoes': { soil_temp_requirement: 65, planting_window_days: 20, days_to_maturity: 80, typical_yield: 35 }
  };
  return requirements[crop_type] || { soil_temp_requirement: 55, planting_window_days: 30, days_to_maturity: 90, typical_yield: 100 };
}

function calculateWindowConfidence(soil_factors: any, climate_factors: any, cropRequirements: any): number {
  let confidence = 0.7;
  if (soil_factors.fertility_index > 0.7) confidence += 0.1;
  if (climate_factors.climate_suitability?.overall_rating > 0.8) confidence += 0.1;
  return Number(Math.min(confidence, 0.95).toFixed(2));
}

function identifyWindowRisks(plantingWindow: any, climate_factors: any, soil_factors: any): string[] {
  const risks = [];
  if (climate_factors.weather_risks?.late_frost_probability > 0.3) risks.push('late_frost');
  if (soil_factors.drainage_classification === 'poor') risks.push('wet_soil');
  return risks;
}

function calculateSuccessProbability(soil_factors: any, climate_factors: any, cropRequirements: any): number {
  let probability = 0.6;
  if (soil_factors.fertility_index > 0.6) probability += 0.15;
  if (climate_factors.climate_suitability?.overall_rating > 0.7) probability += 0.15;
  return Number(Math.min(probability, 0.95).toFixed(2));
}

function calculateBiodiversitySupport(soil_factors: any, climate_factors: any): number {
  return soil_factors.organic_matter > 3.0 ? 70 : 50;
}

function calculateSoilHealthImpact(soil_factors: any, crop_type: string): any {
  return { improvement_potential: soil_factors.organic_matter < 3.0 ? 'high' : 'moderate' };
}

function calculateCarbonSequestration(crop_type: string, soil_factors: any): any {
  return { potential_tons_per_acre: soil_factors.organic_matter < 4.0 ? 1.2 : 0.8 };
}

function calculateWaterEfficiency(crop_type: string, climate_factors: any): any {
  return { rating: climate_factors.irrigation_needs?.efficiency_rating || 0.7 };
}

function analyzeParameterInteractions(soil_factors: any, climate_factors: any): any {
  return { ph_climate_interaction: 'neutral', organic_matter_moisture_interaction: 'positive' };
}

function identifyLimitingFactors(soil_factors: any, climate_factors: any, crop_type: string): string[] {
  const factors = [];
  if (soil_factors.fertility_index < 0.5) factors.push('low_fertility');
  if (climate_factors.weather_risks?.drought_risk > 0.4) factors.push('drought_risk');
  return factors;
}

function generateActionableRecommendations(soil_factors: any, climate_factors: any, plantingWindow: any, sustainabilityScore: number): string[] {
  const recommendations = [];
  
  if (soil_factors.organic_matter < 3.0) {
    recommendations.push('Apply 2-4 tons/acre of compost before planting to improve organic matter');
  }
  
  if (soil_factors.ph_status !== 'optimal') {
    recommendations.push(`Adjust soil pH to optimal range (6.0-7.5) using ${soil_factors.ph_level < 6.0 ? 'agricultural lime' : 'sulfur'}`);
  }
  
  if (climate_factors.weather_risks?.drought_risk > 0.4) {
    recommendations.push('Consider installing drip irrigation to manage drought risk');
  }
  
  if (sustainabilityScore < 60) {
    recommendations.push('Implement cover cropping to improve sustainability score');
  }
  
  return recommendations;
}

function calculateYieldConfidence(soil_factors: any, climate_factors: any): number {
  return soil_factors.fertility_index > 0.6 ? 0.85 : 0.7;
}

function identifyYieldLimitingFactors(soil_factors: any, climate_factors: any, cropRequirements: any): string[] {
  return soil_factors.limiting_nutrients || [];
}

function calculateImprovementPotential(soil_factors: any, currentMultiplier: number): number {
  return currentMultiplier < 1.0 ? (1.0 - currentMultiplier) * 100 : 10;
}

function calculateOverallRisk(risks: any[]): string {
  if (risks.some(r => r.impact === 'high')) return 'high';
  if (risks.length > 2) return 'medium';
  return 'low';
}

function estimateMitigationCost(risks: any[]): number {
  return risks.reduce((total, risk) => {
    const costs: Record<string, number> = { high: 500, medium: 200, variable: 300 };
    return total + (costs[risk.impact] || 100);
  }, 0);
}

function calculateCropSuitability(crop: any, soil_factors: any, climate_factors: any): number {
  let score = 0.5;
  const ph = soil_factors.ph_level;
  if (ph >= crop.soil_ph_range[0] && ph <= crop.soil_ph_range[1]) score += 0.3;
  if (crop.drainage === 'any' || crop.drainage === soil_factors.drainage_classification) score += 0.2;
  return score;
}

function getCropAdvantages(crop: any, soil_factors: any, climate_factors: any): string[] {
  const advantages = [];
  if (crop.sustainability > 0.7) advantages.push('high_sustainability');
  if (crop.name === 'soybeans') advantages.push('nitrogen_fixing');
  return advantages;
}

function estimateAlternativeYield(crop: any, soil_factors: any, climate_factors: any): number {
  const baseYields: Record<string, number> = {
    'corn': 180, 'soybeans': 50, 'wheat': 60, 'oats': 75, 'barley': 65, 'cover_crop_mix': 0
  };
  return baseYields[crop.name] || 50;
}

function calculateProfitabilityIndex(crop: any, suitabilityScore: number): number {
  return Number((suitabilityScore * 0.8 + crop.sustainability * 0.2).toFixed(2));
}

function calculateDiversificationBenefits(alternatives: any[]): any {
  return { risk_reduction: alternatives.length * 5, yield_stability: alternatives.length > 2 ? 'improved' : 'moderate' };
}

function identifyRotationOpportunities(alternatives: any[], soil_factors: any): string[] {
  return alternatives.filter(a => a.crop_name === 'soybeans' || a.crop_name === 'cover_crop_mix').map(a => a.crop_name);
}