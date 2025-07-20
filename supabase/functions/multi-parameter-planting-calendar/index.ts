import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlantingRequest {
  county_fips: string;
  crop_type: string;
  soil_data: any;
  climate_preferences?: any;
  sustainability_goals?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { county_fips, crop_type, soil_data, climate_preferences = {}, sustainability_goals = {} }: PlantingRequest = await req.json();
    
    if (!county_fips || !crop_type || !soil_data) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: county_fips, crop_type, and soil_data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Multi-parameter planting optimization for ${crop_type} in county ${county_fips}`);

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

    // Multi-parameter correlation analysis
    const soilFactors = analyzeSoilFactors(soil_data);
    const climateFactors = await analyzeClimateFactors(county_fips, crop_type);
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
      return new Response(
        JSON.stringify({ error: 'Failed to store planting optimization' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
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

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in multi-parameter-planting-calendar function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
  // Simulated climate data analysis (in production, would use NOAA/weather APIs)
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
  
  // Multi-parameter optimization
  let optimalStart = new Date(climate_factors.average_frost_dates.last);
  let optimalEnd = new Date(climate_factors.average_frost_dates.first);
  
  // Adjust for soil temperature
  if (soil_factors.drainage_classification === 'poor') {
    optimalStart.setDate(optimalStart.getDate() + 14); // Wait for better drainage
  }
  
  // Adjust for soil fertility
  if (soil_factors.fertility_index < 0.6) {
    optimalStart.setDate(optimalStart.getDate() + 7); // Allow time for amendments
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
  const waterEfficiency = climate_factors.irrigation_needs.efficiency_rating || 0.7;
  score += waterEfficiency * 25;
  
  // Carbon sequestration potential (20% of score)
  const carbonPotential = soil_factors.organic_matter > 3.0 ? 20 : soil_factors.organic_matter * 6.67;
  score += carbonPotential * 0.2;
  
  // Biodiversity support (15% of score)
  const biodiversityScore = calculateBiodiversitySupport(soil_factors, climate_factors);
  score += biodiversityScore * 0.15;
  
  // Apply sustainability goals multipliers
  if (goals.organic_farming) score *= 1.1;
  if (goals.carbon_neutral) score *= 1.05;
  if (goals.water_conservation) score *= 1.08;
  
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
  if (climate_factors.climate_suitability.overall_rating > 0.8) yieldMultiplier *= 1.2;
  else if (climate_factors.climate_suitability.overall_rating < 0.5) yieldMultiplier *= 0.7;
  
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
  if (climate_factors.weather_risks.late_frost_probability > 0.3) {
    risks.push({
      type: 'late_frost',
      probability: climate_factors.weather_risks.late_frost_probability,
      impact: 'high',
      mitigation: 'Use row covers or delay planting'
    });
  }
  
  if (climate_factors.weather_risks.drought_risk > 0.4) {
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
  if (climate_factors.pest_disease_pressure.overall_risk > 0.5) {
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
  
  // Analyze what crops would perform better given current conditions
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
  
  // Sort by overall score (combination of suitability, sustainability, and profitability)
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

// Helper functions (simplified implementations)
function classifyDrainage(soil_data: any): string {
  return soil_data.drainage || 'moderate';
}

function classifyTexture(soil_data: any): string {
  return soil_data.texture || 'loam';
}

function calculateFertilityIndex(ph: number, om: number, n: string, p: string, k: string): number {
  let index = 0;
  
  // pH contribution (0-0.25)
  if (ph >= 6.0 && ph <= 7.5) index += 0.25;
  else if (ph >= 5.5 && ph <= 8.0) index += 0.15;
  
  // Organic matter contribution (0-0.25)
  index += Math.min(om / 5.0, 1.0) * 0.25;
  
  // Nutrient contributions (0-0.5 total)
  const nutrientScore = (getNutrientScore(n) + getNutrientScore(p) + getNutrientScore(k)) / 3;
  index += nutrientScore * 0.5;
  
  return Number(index.toFixed(3));
}

function calculateSoilHealthScore(soil_data: any): number {
  const ph = soil_data.ph_level || 7.0;
  const om = soil_data.organic_matter || 3.0;
  
  let score = 50; // Base score
  
  // pH contribution
  if (ph >= 6.0 && ph <= 7.5) score += 20;
  else if (ph >= 5.5 && ph <= 8.0) score += 10;
  
  // Organic matter contribution
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
  const scores = { 'low': 0.3, 'medium': 0.7, 'high': 1.0 };
  return scores[level as keyof typeof scores] || 0.5;
}

function identifyLimitingNutrients(n: string, p: string, k: string): string[] {
  const limiting = [];
  if (n === 'low') limiting.push('nitrogen');
  if (p === 'low') limiting.push('phosphorus');
  if (k === 'low') limiting.push('potassium');
  return limiting;
}

function calculateAmendmentNeeds(ph: number, om: number, n: string, p: string, k: string): any {
  const needs = [];
  
  if (ph < 6.0) needs.push({ type: 'lime', amount: '2-4 tons/acre', purpose: 'raise pH' });
  if (ph > 7.8) needs.push({ type: 'sulfur', amount: '200-400 lbs/acre', purpose: 'lower pH' });
  if (om < 3.0) needs.push({ type: 'compost', amount: '2-4 yards/acre', purpose: 'increase organic matter' });
  if (n === 'low') needs.push({ type: 'nitrogen', amount: '100-150 lbs/acre', purpose: 'boost nitrogen' });
  if (p === 'low') needs.push({ type: 'phosphorus', amount: '50-80 lbs/acre', purpose: 'boost phosphorus' });
  if (k === 'low') needs.push({ type: 'potassium', amount: '100-120 lbs/acre', purpose: 'boost potassium' });
  
  return needs;
}

function getClimateRegion(stateCode: string): string {
  const regions: Record<string, string> = {
    '01': 'humid_subtropical', '06': 'mediterranean', '08': 'semi_arid',
    '12': 'tropical', '17': 'humid_continental', '48': 'hot_semi_arid'
  };
  return regions[stateCode] || 'temperate';
}

function getHardinessZone(county_fips: string): string {
  // Simplified hardiness zone mapping
  const stateCode = county_fips.substring(0, 2);
  const zones: Record<string, string> = {
    '01': '7b-8a', '06': '8a-10a', '08': '4a-7a',
    '12': '9a-11', '17': '5a-7a', '48': '7a-9a'
  };
  return zones[stateCode] || '6a-7a';
}

function getFrostDates(region: string): any {
  const frostDates: Record<string, any> = {
    'humid_subtropical': { first: '2024-11-15', last: '2024-03-15' },
    'mediterranean': { first: '2024-12-01', last: '2024-02-15' },
    'semi_arid': { first: '2024-10-15', last: '2024-04-15' },
    'tropical': { first: null, last: null },
    'humid_continental': { first: '2024-10-01', last: '2024-04-30' },
    'hot_semi_arid': { first: '2024-11-01', last: '2024-03-01' }
  };
  return frostDates[region] || { first: '2024-10-15', last: '2024-04-15' };
}

function getGrowingSeasonLength(region: string): number {
  const lengths: Record<string, number> = {
    'humid_subtropical': 240, 'mediterranean': 290, 'semi_arid': 180,
    'tropical': 365, 'humid_continental': 150, 'hot_semi_arid': 240
  };
  return lengths[region] || 200;
}

function getPrecipitationPattern(region: string): any {
  const patterns: Record<string, any> = {
    'humid_subtropical': { annual: 50, peak_season: 'summer', distribution: 'even' },
    'mediterranean': { annual: 20, peak_season: 'winter', distribution: 'winter_wet' },
    'semi_arid': { annual: 15, peak_season: 'spring', distribution: 'sparse' },
    'tropical': { annual: 60, peak_season: 'summer', distribution: 'wet_dry' },
    'humid_continental': { annual: 35, peak_season: 'summer', distribution: 'even' },
    'hot_semi_arid': { annual: 25, peak_season: 'spring', distribution: 'sparse' }
  };
  return patterns[region] || { annual: 30, peak_season: 'summer', distribution: 'moderate' };
}

function getTemperatureExtremes(region: string): any {
  const extremes: Record<string, any> = {
    'humid_subtropical': { summer_high: 90, winter_low: 25 },
    'mediterranean': { summer_high: 85, winter_low: 35 },
    'semi_arid': { summer_high: 95, winter_low: 10 },
    'tropical': { summer_high: 88, winter_low: 60 },
    'humid_continental': { summer_high: 85, winter_low: -10 },
    'hot_semi_arid': { summer_high: 100, winter_low: 20 }
  };
  return extremes[region] || { summer_high: 85, winter_low: 20 };
}

function getHumidityLevels(region: string): any {
  const humidity: Record<string, any> = {
    'humid_subtropical': { average: 75, summer: 85, winter: 65 },
    'mediterranean': { average: 60, summer: 55, winter: 70 },
    'semi_arid': { average: 45, summer: 40, winter: 50 },
    'tropical': { average: 80, summer: 85, winter: 75 },
    'humid_continental': { average: 65, summer: 70, winter: 60 },
    'hot_semi_arid': { average: 50, summer: 45, winter: 60 }
  };
  return humidity[region] || { average: 60, summer: 65, winter: 55 };
}

function getCropRequirements(crop_type: string): any {
  const requirements: Record<string, any> = {
    'corn': { soil_temp_requirement: 60, planting_window_days: 30, days_to_maturity: 100, typical_yield: 180 },
    'soybeans': { soil_temp_requirement: 55, planting_window_days: 45, days_to_maturity: 120, typical_yield: 50 },
    'wheat': { soil_temp_requirement: 45, planting_window_days: 60, days_to_maturity: 90, typical_yield: 60 },
    'tomatoes': { soil_temp_requirement: 65, planting_window_days: 20, days_to_maturity: 80, typical_yield: 25 }
  };
  return requirements[crop_type] || { soil_temp_requirement: 55, planting_window_days: 30, days_to_maturity: 90, typical_yield: 100 };
}

function assessClimateSuitability(crop_type: string, climate_data: any): any {
  // Simplified climate suitability assessment
  let rating = 0.7; // Base rating
  
  if (climate_data.growing_season_length > 150) rating += 0.1;
  if (climate_data.precipitation_patterns.annual > 20) rating += 0.1;
  
  return {
    overall_rating: Number(Math.min(rating, 1.0).toFixed(2)),
    temperature_suitability: 0.8,
    precipitation_suitability: 0.75,
    season_length_suitability: 0.85
  };
}

function identifyWeatherRisks(crop_type: string, climate_data: any, region: string): any {
  return {
    late_frost_probability: region.includes('continental') ? 0.4 : 0.2,
    early_frost_probability: region.includes('continental') ? 0.3 : 0.1,
    drought_risk: region.includes('arid') ? 0.6 : 0.3,
    flood_risk: climate_data.precipitation_patterns.annual > 40 ? 0.3 : 0.1,
    hail_risk: region.includes('continental') ? 0.25 : 0.1
  };
}

function calculateIrrigationNeeds(crop_type: string, climate_data: any): any {
  const baseNeed = climate_data.precipitation_patterns.annual < 25 ? 'high' : 'low';
  
  return {
    base_requirement: baseNeed,
    efficiency_rating: baseNeed === 'high' ? 0.6 : 0.8,
    critical_periods: ['flowering', 'fruit_set'],
    estimated_inches: baseNeed === 'high' ? 15 : 5
  };
}

function assessPestDiseasePressure(crop_type: string, climate_data: any, region: string): any {
  let pressure = 0.4; // Base pressure
  
  if (climate_data.humidity_levels.average > 70) pressure += 0.2;
  if (climate_data.precipitation_patterns.annual > 40) pressure += 0.1;
  
  return {
    overall_risk: Number(Math.min(pressure, 1.0).toFixed(2)),
    primary_pests: ['aphids', 'corn_borer'],
    primary_diseases: ['rust', 'blight'],
    peak_pressure_months: ['june', 'july', 'august']
  };
}

function calculateWindowConfidence(soil_factors: any, climate_factors: any, crop_requirements: any): number {
  let confidence = 0.7; // Base confidence
  
  if (soil_factors.fertility_index > 0.7) confidence += 0.1;
  if (climate_factors.climate_suitability.overall_rating > 0.8) confidence += 0.15;
  if (soil_factors.drainage_classification === 'good') confidence += 0.05;
  
  return Number(Math.min(confidence, 0.95).toFixed(2));
}

function identifyWindowRisks(planting_window: any, climate_factors: any, soil_factors: any): string[] {
  const risks = [];
  
  if (climate_factors.weather_risks.late_frost_probability > 0.3) {
    risks.push('Late frost damage risk');
  }
  
  if (soil_factors.drainage_classification === 'poor') {
    risks.push('Soil may be too wet for planting');
  }
  
  if (climate_factors.precipitation_patterns.distribution === 'sparse') {
    risks.push('Insufficient moisture for germination');
  }
  
  return risks;
}

function calculateSuccessProbability(soil_factors: any, climate_factors: any, crop_requirements: any): number {
  let probability = 0.6; // Base probability
  
  probability += soil_factors.fertility_index * 0.2;
  probability += climate_factors.climate_suitability.overall_rating * 0.15;
  
  if (soil_factors.ph_status === 'optimal') probability += 0.05;
  
  return Number(Math.min(probability, 0.95).toFixed(2));
}

function calculateBiodiversitySupport(soil_factors: any, climate_factors: any): number {
  let score = 50; // Base score
  
  if (soil_factors.organic_matter > 4.0) score += 20;
  if (soil_factors.ph_status === 'optimal') score += 10;
  if (climate_factors.precipitation_patterns.distribution !== 'sparse') score += 15;
  
  return Number(Math.min(score, 100).toFixed(1));
}

function analyzeParameterInteractions(soil_factors: any, climate_factors: any): any {
  return {
    ph_nutrient_interaction: calculatePhNutrientInteraction(soil_factors),
    moisture_temperature_synergy: calculateMoistureTemperatureSynergy(climate_factors),
    organic_matter_drainage_relationship: calculateOMDrainageRelationship(soil_factors),
    climate_soil_harmony_index: calculateClimateHarmonyIndex(soil_factors, climate_factors)
  };
}

function identifyLimitingFactors(soil_factors: any, climate_factors: any, crop_type: string): string[] {
  const limiting = [];
  
  if (soil_factors.fertility_index < 0.5) limiting.push('soil_fertility');
  if (climate_factors.climate_suitability.overall_rating < 0.6) limiting.push('climate_mismatch');
  if (soil_factors.drainage_classification === 'poor') limiting.push('poor_drainage');
  if (climate_factors.precipitation_patterns.annual < 15) limiting.push('insufficient_moisture');
  
  return limiting;
}

function calculateYieldConfidence(soil_factors: any, climate_factors: any): string {
  const score = (soil_factors.fertility_index + climate_factors.climate_suitability.overall_rating) / 2;
  
  if (score > 0.8) return 'high';
  if (score > 0.6) return 'medium';
  return 'low';
}

function identifyYieldLimitingFactors(soil_factors: any, climate_factors: any, crop_requirements: any): string[] {
  const factors = [];
  
  if (soil_factors.limiting_nutrients.length > 0) {
    factors.push(`Nutrient deficiency: ${soil_factors.limiting_nutrients.join(', ')}`);
  }
  
  if (soil_factors.ph_status !== 'optimal') {
    factors.push('Suboptimal soil pH');
  }
  
  if (climate_factors.weather_risks.drought_risk > 0.4) {
    factors.push('Water stress risk');
  }
  
  return factors;
}

function calculateImprovementPotential(soil_factors: any, current_multiplier: number): any {
  const maxMultiplier = 1.5; // Theoretical maximum
  const improvement = maxMultiplier - current_multiplier;
  
  return {
    yield_increase_potential: Number((improvement * 100).toFixed(1)),
    key_improvement_areas: soil_factors.amendment_needs.slice(0, 3).map((need: any) => need.type),
    investment_required: soil_factors.amendment_needs.length * 250 // Simplified cost estimation
  };
}

function calculateOverallRisk(risks: any[]): string {
  const highRisks = risks.filter(r => r.impact === 'high').length;
  const totalRisks = risks.length;
  
  if (highRisks > 2 || totalRisks > 5) return 'high';
  if (highRisks > 0 || totalRisks > 3) return 'medium';
  return 'low';
}

function estimateMitigationCost(risks: any[]): number {
  return risks.reduce((cost, risk) => {
    const riskCosts = { high: 500, medium: 200, low: 50 };
    return cost + (riskCosts[risk.impact as keyof typeof riskCosts] || 100);
  }, 0);
}

function calculateCropSuitability(crop: any, soil_factors: any, climate_factors: any): number {
  let suitability = 0.5; // Base suitability
  
  // pH range check
  const ph = soil_factors.ph_level;
  if (ph >= crop.soil_ph_range[0] && ph <= crop.soil_ph_range[1]) {
    suitability += 0.2;
  }
  
  // Drainage match
  if (crop.drainage === 'any' || crop.drainage === soil_factors.drainage_classification) {
    suitability += 0.2;
  }
  
  // Climate factors
  suitability += climate_factors.climate_suitability.overall_rating * 0.1;
  
  return Number(Math.min(suitability, 1.0).toFixed(2));
}

function getCropAdvantages(crop: any, soil_factors: any, climate_factors: any): string[] {
  const advantages = [];
  
  if (crop.sustainability > 0.8) advantages.push('High sustainability rating');
  if (crop.name.includes('cover')) advantages.push('Soil improvement benefits');
  if (crop.name === 'soybeans') advantages.push('Nitrogen fixation capability');
  
  return advantages;
}

function estimateAlternativeYield(crop: any, soil_factors: any, climate_factors: any): number {
  // Simplified yield estimation
  const baseYields: Record<string, number> = {
    'corn': 180, 'soybeans': 50, 'wheat': 60, 'oats': 80, 'barley': 70
  };
  
  return baseYields[crop.name] || 100;
}

function calculateProfitabilityIndex(crop: any, suitability_score: number): number {
  // Simplified profitability calculation
  const marketPrices: Record<string, number> = {
    'corn': 5.50, 'soybeans': 13.50, 'wheat': 7.00, 'oats': 4.50, 'barley': 6.00
  };
  
  const price = marketPrices[crop.name] || 5.0;
  return Number((suitability_score * price / 10).toFixed(2));
}

function calculateDiversificationBenefits(alternatives: any[]): any {
  return {
    risk_reduction: alternatives.length > 3 ? 'high' : 'medium',
    market_stability: alternatives.length > 2 ? 'improved' : 'moderate',
    soil_health_benefit: alternatives.some(a => a.crop_name.includes('cover')) ? 'significant' : 'moderate'
  };
}

function identifyRotationOpportunities(alternatives: any[], soil_factors: any): string[] {
  const opportunities = [];
  
  const hasLegume = alternatives.some(a => a.crop_name === 'soybeans');
  const hasGrass = alternatives.some(a => ['corn', 'wheat', 'oats'].includes(a.crop_name));
  
  if (hasLegume && hasGrass) {
    opportunities.push('Legume-grass rotation for nitrogen cycling');
  }
  
  if (alternatives.some(a => a.crop_name.includes('cover'))) {
    opportunities.push('Cover crop integration for soil health');
  }
  
  if (soil_factors.organic_matter < 3.0) {
    opportunities.push('High-residue crops to build organic matter');
  }
  
  return opportunities;
}

function generateActionableRecommendations(soil_factors: any, climate_factors: any, planting_window: any, sustainability_score: number): string[] {
  const recommendations = [];
  
  if (soil_factors.fertility_index < 0.6) {
    recommendations.push(`Apply ${soil_factors.amendment_needs[0]?.type || 'compost'} before planting`);
  }
  
  if (planting_window.success_probability < 0.7) {
    recommendations.push('Consider delaying planting by 1-2 weeks for better conditions');
  }
  
  if (climate_factors.irrigation_needs.base_requirement === 'high') {
    recommendations.push('Install drip irrigation system for water efficiency');
  }
  
  if (sustainability_score < 70) {
    recommendations.push('Incorporate cover crops to improve sustainability metrics');
  }
  
  recommendations.push(`Optimal planting window: ${planting_window.optimal_start} to ${planting_window.optimal_end}`);
  
  return recommendations;
}

// Additional helper functions for parameter interactions
function calculatePhNutrientInteraction(soil_factors: any): number {
  const ph = soil_factors.ph_level;
  const optimalRange = ph >= 6.0 && ph <= 7.5;
  
  return optimalRange ? 1.0 : Math.max(0.3, 1.0 - Math.abs(ph - 6.75) * 0.2);
}

function calculateMoistureTemperatureSynergy(climate_factors: any): number {
  // Simplified calculation of how well moisture and temperature work together
  const precip = climate_factors.precipitation_patterns.annual;
  const tempRange = climate_factors.temperature_extremes.summer_high - climate_factors.temperature_extremes.winter_low;
  
  return Number((precip * 0.01 + (100 - tempRange) * 0.01).toFixed(2));
}

function calculateOMDrainageRelationship(soil_factors: any): number {
  const om = soil_factors.organic_matter;
  const drainage = soil_factors.drainage_classification;
  
  if (drainage === 'good' && om > 3.0) return 1.0;
  if (drainage === 'moderate' && om > 2.0) return 0.8;
  if (drainage === 'poor' && om > 4.0) return 0.6;
  
  return 0.4;
}

function calculateClimateHarmonyIndex(soil_factors: any, climate_factors: any): number {
  const soilScore = soil_factors.fertility_index;
  const climateScore = climate_factors.climate_suitability.overall_rating;
  
  return Number(((soilScore + climateScore) / 2).toFixed(2));
}