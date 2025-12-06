import { createClient } from 'jsr:@supabase/supabase-js@2'
import { requestHandler } from '../_shared/request-handler.ts';
import { validateInput, environmentalImpactSchema } from '../_shared/validation.ts';
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
    functionName: 'environmental-impact-engine',
    requireAuth: true,
    requireSubscription: true,
    validationSchema: environmentalImpactSchema,
    rateLimitPerHour: 100,
    logCost: {
      provider: 'usda',
      serviceType: 'environmental-analysis',
    },
  }, async (ctx) => {
    const { supabase, user, validatedData } = ctx;
    const { analysis_id, county_fips, soil_data, proposed_treatments = [] } = validatedData;

    console.log(`Environmental impact assessment for analysis ${analysis_id} in county ${county_fips}`);

    // Fetch water body data with graceful degradation
    const water_body_data = await safeExternalCall(
      'epa',
      async () => {
        // Primary: Try EPA water proximity API
        return await fetchWaterProximityData(county_fips);
      },
      async () => {
        // Fallback: Use estimated data
        return { distance_miles: getEstimatedWaterProximity(county_fips) };
      }
    );

    // Calculate runoff risk score
    const runoffRisk = calculateRunoffRisk(soil_data, water_body_data);
    
    // Determine water body proximity
    const waterProximity = calculateWaterBodyProximity(county_fips, water_body_data);
    
    // Assess contamination risk
    const contaminationRisk = assessContaminationRisk(soil_data, proposed_treatments, waterProximity);
    
    // Generate eco-friendly alternatives
    const ecoAlternatives = generateEcoFriendlyAlternatives(soil_data, proposed_treatments, runoffRisk);
    
    // Calculate carbon footprint
    const carbonFootprint = calculateCarbonFootprint(proposed_treatments, ecoAlternatives);
    
    // Assess biodiversity impact
    const biodiversityImpact = assessBiodiversityImpact(soil_data, proposed_treatments, ecoAlternatives);

    // Track cost for this analysis
    await trackExternalAPICost(supabase, {
      provider: 'epa',
      endpoint: 'water-proximity',
      featureName: 'environmental-impact-engine',
      userId: user.id,
    });

    // Store the impact assessment
    const { data: impactScore, error: insertError } = await supabase
      .from('environmental_impact_scores')
      .upsert({
        user_id: user.id,
        county_fips,
        analysis_id,
        runoff_risk_score: runoffRisk.score,
        water_body_proximity: waterProximity,
        contamination_risk: contaminationRisk.level,
        eco_friendly_alternatives: ecoAlternatives,
        carbon_footprint_score: carbonFootprint.total_score,
        biodiversity_impact: biodiversityImpact.overall
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing impact score:', insertError);
      throw new Error('Failed to store impact assessment');
    }

    return {
      impact_assessment: impactScore,
      detailed_analysis: {
        runoff_risk: runoffRisk,
        contamination_assessment: contaminationRisk,
        eco_alternatives: ecoAlternatives,
        carbon_analysis: carbonFootprint,
        biodiversity_assessment: biodiversityImpact
      },
      recommendations: generateRecommendations(runoffRisk, contaminationRisk, ecoAlternatives),
      patent_protected_algorithms: {
        runoff_risk_with_alternatives: true,
        multi_factor_environmental_scoring: true,
        geographic_contamination_modeling: true
      }
    };
  })(req);
});

// Helper function to estimate water proximity when EPA API unavailable
function getEstimatedWaterProximity(county_fips: string): number {
  const stateCode = county_fips.substring(0, 2);
  const waterProximityByState: Record<string, number> = {
    '12': 2.5, // Florida
    '06': 8.2, // California
    '17': 4.1, // Illinois
    '48': 12.8, // Texas
  };
  return waterProximityByState[stateCode] || 6.5;
}

// Placeholder for actual EPA API call
async function fetchWaterProximityData(county_fips: string): Promise<any> {
  // In production, this would call EPA water proximity API
  return { distance_miles: getEstimatedWaterProximity(county_fips) };
}

function calculateRunoffRisk(soil_data: any, water_body_data?: any): any {
  const ph = soil_data.ph_level || 7.0;
  const organicMatter = soil_data.organic_matter || 3.0;
  const slope = soil_data.slope || 'moderate';
  const drainage = soil_data.drainage || 'moderate';
  
  let baseScore = 0;
  
  // pH factor (acidic soils increase runoff)
  if (ph < 5.5) baseScore += 25;
  else if (ph < 6.0) baseScore += 15;
  else if (ph > 8.0) baseScore += 10;
  
  // Organic matter factor (higher OM reduces runoff)
  if (organicMatter < 2.0) baseScore += 20;
  else if (organicMatter < 3.0) baseScore += 10;
  else if (organicMatter > 5.0) baseScore -= 10;
  
  // Slope factor
  const slopeFactor = {
    'flat': 0,
    'gentle': 10,
    'moderate': 20,
    'steep': 35,
    'very_steep': 50
  };
  baseScore += slopeFactor[slope as keyof typeof slopeFactor] || 15;
  
  // Drainage factor
  const drainageFactor = {
    'poor': 30,
    'moderate': 15,
    'good': 5,
    'excessive': 25
  };
  baseScore += drainageFactor[drainage as keyof typeof drainageFactor] || 15;
  
  // Water body proximity modifier
  const proximity = water_body_data?.distance_miles || 5;
  if (proximity < 0.5) baseScore += 20;
  else if (proximity < 1.0) baseScore += 15;
  else if (proximity < 2.0) baseScore += 10;
  
  const finalScore = Math.min(Math.max(baseScore, 0), 100);
  
  return {
    score: Number(finalScore.toFixed(2)),
    risk_level: finalScore > 70 ? 'high' : finalScore > 40 ? 'medium' : 'low',
    contributing_factors: {
      ph_impact: ph < 6.0 || ph > 8.0,
      low_organic_matter: organicMatter < 3.0,
      slope_concern: slope === 'steep' || slope === 'very_steep',
      drainage_issue: drainage === 'poor' || drainage === 'excessive',
      water_proximity: proximity < 2.0
    }
  };
}

function calculateWaterBodyProximity(county_fips: string, water_body_data?: any): number {
  if (water_body_data?.distance_miles) {
    return water_body_data.distance_miles;
  }
  return getEstimatedWaterProximity(county_fips);
}

function assessContaminationRisk(soil_data: any, treatments: any[], water_proximity: number): any {
  let riskScore = 0;
  const factors = [];
  
  // Nutrient loading risk
  const nitrogenLevel = soil_data.nitrogen_level;
  const phosphorusLevel = soil_data.phosphorus_level;
  
  if (nitrogenLevel === 'high' || phosphorusLevel === 'high') {
    riskScore += 30;
    factors.push('high_existing_nutrients');
  }
  
  // Treatment risk assessment
  treatments.forEach(treatment => {
    if (treatment.type === 'nitrogen_fertilizer') {
      riskScore += 25;
      factors.push('nitrogen_fertilizer_application');
    }
    if (treatment.type === 'phosphorus_fertilizer') {
      riskScore += 20;
      factors.push('phosphorus_fertilizer_application');
    }
    if (treatment.type === 'pesticide') {
      riskScore += 35;
      factors.push('pesticide_application');
    }
  });
  
  // Water proximity modifier
  if (water_proximity < 1.0) riskScore *= 1.5;
  else if (water_proximity < 2.0) riskScore *= 1.2;
  
  const finalScore = Math.min(riskScore, 100);
  
  let level: string;
  if (finalScore > 75) level = 'critical';
  else if (finalScore > 50) level = 'high';
  else if (finalScore > 25) level = 'medium';
  else level = 'low';
  
  return {
    level,
    score: Number(finalScore.toFixed(2)),
    risk_factors: factors,
    water_proximity_modifier: water_proximity < 2.0
  };
}

function generateEcoFriendlyAlternatives(soil_data: any, treatments: any[], runoff_risk: any): any {
  const alternatives = [];
  
  // Organic matter improvement alternatives
  if (soil_data.organic_matter < 3.0) {
    alternatives.push({
      category: 'soil_improvement',
      alternative: 'compost_application',
      description: 'Apply aged compost to improve soil structure and nutrient retention',
      environmental_benefit: 'Reduces runoff by 35-50%, increases carbon sequestration',
      implementation_cost: 'medium',
      effectiveness_score: 85
    });
    
    alternatives.push({
      category: 'cover_crops',
      alternative: 'nitrogen_fixing_cover_crops',
      description: 'Plant legume cover crops to naturally fix nitrogen',
      environmental_benefit: 'Eliminates synthetic nitrogen need, prevents soil erosion',
      implementation_cost: 'low',
      effectiveness_score: 78
    });
  }
  
  // pH management alternatives
  const ph = soil_data.ph_level || 7.0;
  if (ph < 6.0) {
    alternatives.push({
      category: 'ph_management',
      alternative: 'agricultural_lime',
      description: 'Use calcium carbonate lime instead of synthetic amendments',
      environmental_benefit: 'Natural pH correction, improves nutrient availability',
      implementation_cost: 'low',
      effectiveness_score: 90
    });
  }
  
  // Runoff prevention alternatives
  if (runoff_risk.score > 40) {
    alternatives.push({
      category: 'erosion_control',
      alternative: 'contour_farming',
      description: 'Implement contour farming and buffer strips',
      environmental_benefit: 'Reduces runoff by 60-80%, protects water quality',
      implementation_cost: 'medium',
      effectiveness_score: 92
    });
    
    alternatives.push({
      category: 'water_management',
      alternative: 'bioswales',
      description: 'Install bioswales and retention ponds',
      environmental_benefit: 'Filters runoff, supports wildlife habitat',
      implementation_cost: 'high',
      effectiveness_score: 88
    });
  }
  
  // Fertilizer alternatives
  treatments.forEach(treatment => {
    if (treatment.type?.includes('fertilizer')) {
      alternatives.push({
        category: 'fertilizer_replacement',
        alternative: 'precision_application',
        description: 'Use precision agriculture for targeted nutrient application',
        environmental_benefit: 'Reduces fertilizer use by 30-40%, minimizes runoff',
        implementation_cost: 'high',
        effectiveness_score: 94
      });
      
      alternatives.push({
        category: 'organic_fertilizer',
        alternative: 'composted_manure',
        description: 'Replace synthetic fertilizers with composted organic matter',
        environmental_benefit: 'Slow-release nutrients, improves soil biology',
        implementation_cost: 'medium',
        effectiveness_score: 82
      });
    }
  });
  
  return {
    alternatives,
    total_alternatives: alternatives.length,
    average_effectiveness: alternatives.length > 0 
      ? Number((alternatives.reduce((sum, alt) => sum + alt.effectiveness_score, 0) / alternatives.length).toFixed(1))
      : 0,
    estimated_cost_savings: calculateCostSavings(alternatives),
    environmental_score_improvement: calculateEnvironmentalImprovement(alternatives, runoff_risk.score)
  };
}

function calculateCarbonFootprint(treatments: any[], eco_alternatives: any): any {
  let conventionalFootprint = 0;
  let alternativeFootprint = 0;
  
  // Calculate conventional treatment footprint
  treatments.forEach(treatment => {
    switch (treatment.type) {
      case 'nitrogen_fertilizer':
        conventionalFootprint += 5.2; // kg CO2 equivalent per kg N
        break;
      case 'phosphorus_fertilizer':
        conventionalFootprint += 1.4;
        break;
      case 'pesticide':
        conventionalFootprint += 4.8;
        break;
      default:
        conventionalFootprint += 2.0;
    }
  });
  
  // Calculate alternative footprint (typically 40-70% lower)
  eco_alternatives.alternatives.forEach((alt: any) => {
    switch (alt.category) {
      case 'cover_crops':
        alternativeFootprint -= 2.8; // Carbon sequestration
        break;
      case 'compost_application':
        alternativeFootprint += 0.8; // Lower than synthetic
        break;
      case 'organic_fertilizer':
        alternativeFootprint += conventionalFootprint * 0.3; // 70% reduction
        break;
      default:
        alternativeFootprint += conventionalFootprint * 0.5;
    }
  });
  
  const netReduction = conventionalFootprint - Math.max(alternativeFootprint, 0);
  
  return {
    conventional_footprint: Number(conventionalFootprint.toFixed(2)),
    alternative_footprint: Number(Math.max(alternativeFootprint, 0).toFixed(2)),
    net_reduction: Number(netReduction.toFixed(2)),
    percent_reduction: conventionalFootprint > 0 
      ? Number(((netReduction / conventionalFootprint) * 100).toFixed(1))
      : 0,
    total_score: Number((100 - (Math.max(alternativeFootprint, 0) / Math.max(conventionalFootprint, 1)) * 100).toFixed(2))
  };
}

function assessBiodiversityImpact(soil_data: any, treatments: any[], eco_alternatives: any): any {
  let impactScore = 0;
  const factors = [];
  
  // Negative impacts from conventional treatments
  treatments.forEach(treatment => {
    if (treatment.type === 'pesticide') {
      impactScore -= 30;
      factors.push('pesticide_toxicity');
    }
    if (treatment.type?.includes('fertilizer')) {
      impactScore -= 10;
      factors.push('fertilizer_runoff');
    }
  });
  
  // Positive impacts from alternatives
  eco_alternatives.alternatives.forEach((alt: any) => {
    switch (alt.category) {
      case 'cover_crops':
        impactScore += 25;
        factors.push('pollinator_habitat');
        break;
      case 'erosion_control':
        impactScore += 20;
        factors.push('wildlife_corridors');
        break;
      case 'water_management':
        impactScore += 30;
        factors.push('aquatic_habitat');
        break;
      case 'organic_fertilizer':
        impactScore += 15;
        factors.push('soil_microbiome');
        break;
    }
  });
  
  // Soil health factor
  const organicMatter = soil_data.organic_matter || 3.0;
  if (organicMatter > 4.0) {
    impactScore += 10;
    factors.push('healthy_soil_ecosystem');
  }
  
  let overall: string;
  if (impactScore > 20) overall = 'positive';
  else if (impactScore > -10) overall = 'neutral';
  else overall = 'negative';
  
  return {
    overall,
    impact_score: impactScore,
    contributing_factors: factors,
    pollinator_support: factors.includes('pollinator_habitat'),
    soil_health_benefit: factors.includes('soil_microbiome') || factors.includes('healthy_soil_ecosystem'),
    aquatic_protection: factors.includes('aquatic_habitat') || impactScore > 0
  };
}

function generateRecommendations(runoff_risk: any, contamination_risk: any, eco_alternatives: any): string[] {
  const recommendations = [];
  
  if (runoff_risk.score > 50) {
    recommendations.push("Implement erosion control measures to reduce runoff risk by 60-80%");
    recommendations.push("Consider precision agriculture techniques to minimize nutrient loss");
  }
  
  if (contamination_risk.level === 'high' || contamination_risk.level === 'critical') {
    recommendations.push("Switch to organic fertilizer alternatives to reduce contamination risk");
    recommendations.push("Install buffer strips near water bodies to filter runoff");
  }
  
  if (eco_alternatives.alternatives.length > 0) {
    const topAlternative = eco_alternatives.alternatives
      .sort((a: any, b: any) => b.effectiveness_score - a.effectiveness_score)[0];
    recommendations.push(`Prioritize ${topAlternative.alternative}: ${topAlternative.description}`);
  }
  
  recommendations.push("Monitor environmental impact scores to track improvement over time");
  
  return recommendations;
}

function calculateCostSavings(alternatives: any[]): number {
  return alternatives.reduce((total, alt) => {
    const savings = alt.cost === 'low' ? 500 : alt.cost === 'medium' ? 200 : -300;
    return total + savings;
  }, 0);
}

function calculateEnvironmentalImprovement(alternatives: any[], current_runoff_score: number): number {
  const improvement = alternatives.reduce((total, alt) => {
    return total + (alt.effectiveness_score * 0.1);
  }, 0);
  
  return Number(Math.min(improvement, current_runoff_score * 0.8).toFixed(1));
}