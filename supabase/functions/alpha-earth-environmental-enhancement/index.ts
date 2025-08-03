import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnhancementRequest {
  analysis_id: string;
  county_fips: string;
  lat: number;
  lng: number;
  soil_data: any;
  water_body_data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { analysis_id, county_fips, lat, lng, soil_data, water_body_data }: EnhancementRequest = await req.json();

    // Get satellite embeddings from Google Earth Engine
    const satelliteData = await getSatelliteEmbeddings(lat, lng);
    
    // Enhance environmental impact analysis
    const enhancedAnalysis = await enhanceEnvironmentalImpact(
      soil_data,
      satelliteData,
      water_body_data
    );

    // Store enhanced results
    const { error: insertError } = await supabase
      .from('environmental_impact_scores')
      .upsert({
        analysis_id,
        user_id: user.id,
        county_fips,
        runoff_risk_score: enhancedAnalysis.runoff_risk_score,
        contamination_risk_score: enhancedAnalysis.contamination_risk_score,
        biodiversity_impact_score: enhancedAnalysis.biodiversity_impact_score,
        carbon_footprint_score: enhancedAnalysis.carbon_footprint_score,
        overall_environmental_score: enhancedAnalysis.overall_score,
        satellite_enhancement_data: satelliteData,
        enhanced_recommendations: enhancedAnalysis.recommendations,
        confidence_score: enhancedAnalysis.confidence_score
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      enhanced_analysis: enhancedAnalysis,
      satellite_insights: satelliteData.insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in alpha-earth-environmental-enhancement:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getSatelliteEmbeddings(lat: number, lng: number) {
  const earthEngineApiKey = Deno.env.get('GOOGLE_EARTH_ENGINE_API_KEY');
  
  try {
    // Initialize Google Earth Engine
    const initResponse = await fetch('https://earthengine.googleapis.com/v1/projects/earthengine-legacy/value:compute', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${earthEngineApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: {
          functionName: 'Image.load',
          arguments: {
            id: {
              constantValue: 'GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL'
            }
          }
        }
      })
    });

    // Get satellite embeddings for the specific location
    const embedResponse = await fetch('https://earthengine.googleapis.com/v1/projects/earthengine-legacy/value:compute', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${earthEngineApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: {
          functionName: 'Image.sampleRectangle',
          arguments: {
            image: {
              functionName: 'Image.load',
              arguments: {
                id: { constantValue: 'GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL' }
              }
            },
            geometry: {
              functionName: 'Geometry.Rectangle',
              arguments: {
                coords: {
                  constantValue: [lng - 0.001, lat - 0.001, lng + 0.001, lat + 0.001]
                }
              }
            },
            defaultValue: { constantValue: 0 },
            scale: { constantValue: 10 }
          }
        }
      })
    });

    const embedData = await embedResponse.json();
    
    return {
      embeddings: embedData.result || [],
      insights: analyzeSatelliteInsights(embedData.result || []),
      confidence: calculateConfidence(embedData.result || [])
    };
  } catch (error) {
    console.error('Error fetching satellite embeddings:', error);
    return {
      embeddings: [],
      insights: { vegetation_health: 'moderate', water_stress: 'low', soil_moisture: 'moderate' },
      confidence: 0.5
    };
  }
}

function analyzeSatelliteInsights(embeddings: number[]) {
  if (!embeddings || embeddings.length === 0) {
    return {
      vegetation_health: 'moderate',
      water_stress: 'low', 
      soil_moisture: 'moderate',
      erosion_risk: 'low'
    };
  }

  // Analyze embeddings to extract environmental insights
  const avgEmbedding = embeddings.reduce((sum, val) => sum + val, 0) / embeddings.length;
  
  return {
    vegetation_health: avgEmbedding > 0.6 ? 'high' : avgEmbedding > 0.3 ? 'moderate' : 'low',
    water_stress: avgEmbedding < 0.3 ? 'high' : avgEmbedding < 0.6 ? 'moderate' : 'low',
    soil_moisture: avgEmbedding > 0.5 ? 'high' : avgEmbedding > 0.2 ? 'moderate' : 'low',
    erosion_risk: avgEmbedding < 0.4 ? 'high' : avgEmbedding < 0.7 ? 'moderate' : 'low'
  };
}

function calculateConfidence(embeddings: number[]): number {
  if (!embeddings || embeddings.length === 0) return 0.5;
  
  const variance = embeddings.reduce((sum, val, _, arr) => {
    const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
    return sum + Math.pow(val - avg, 2);
  }, 0) / embeddings.length;
  
  return Math.min(0.95, Math.max(0.5, 1 - variance));
}

async function enhanceEnvironmentalImpact(soilData: any, satelliteData: any, waterBodyData?: any) {
  const insights = satelliteData.insights;
  
  // Enhanced runoff risk calculation with satellite data
  const baseRunoffRisk = calculateBaseRunoffRisk(soilData);
  const satelliteRunoffAdjustment = insights.soil_moisture === 'high' ? -0.1 : 
                                   insights.soil_moisture === 'low' ? 0.2 : 0;
  const enhancedRunoffRisk = Math.max(0, Math.min(1, baseRunoffRisk + satelliteRunoffAdjustment));

  // Enhanced contamination risk with vegetation health
  const baseContaminationRisk = calculateBaseContaminationRisk(soilData, waterBodyData);
  const vegetationProtection = insights.vegetation_health === 'high' ? -0.15 : 
                               insights.vegetation_health === 'low' ? 0.1 : 0;
  const enhancedContaminationRisk = Math.max(0, Math.min(1, baseContaminationRisk + vegetationProtection));

  // Biodiversity impact assessment
  const biodiversityScore = calculateBiodiversityScore(insights);
  
  // Carbon footprint with vegetation carbon sequestration
  const carbonScore = calculateCarbonScore(soilData, insights);
  
  const overallScore = (enhancedRunoffRisk + enhancedContaminationRisk + biodiversityScore + carbonScore) / 4;
  
  return {
    runoff_risk_score: enhancedRunoffRisk,
    contamination_risk_score: enhancedContaminationRisk,
    biodiversity_impact_score: biodiversityScore,
    carbon_footprint_score: carbonScore,
    overall_score: overallScore,
    confidence_score: satelliteData.confidence,
    recommendations: generateEnhancedRecommendations(insights, enhancedRunoffRisk, enhancedContaminationRisk)
  };
}

function calculateBaseRunoffRisk(soilData: any): number {
  const drainage = soilData.drainage_class || 'moderate';
  const slope = soilData.slope_percentage || 5;
  
  let risk = 0.3;
  if (drainage === 'poor') risk += 0.3;
  if (slope > 15) risk += 0.2;
  if (slope > 30) risk += 0.2;
  
  return Math.min(1, risk);
}

function calculateBaseContaminationRisk(soilData: any, waterBodyData?: any): number {
  let risk = 0.2;
  
  if (waterBodyData?.proximity_km < 1) risk += 0.4;
  else if (waterBodyData?.proximity_km < 5) risk += 0.2;
  
  if (soilData.permeability === 'high') risk += 0.2;
  
  return Math.min(1, risk);
}

function calculateBiodiversityScore(insights: any): number {
  let score = 0.5;
  
  if (insights.vegetation_health === 'high') score -= 0.2;
  if (insights.vegetation_health === 'low') score += 0.3;
  if (insights.erosion_risk === 'high') score += 0.2;
  
  return Math.max(0, Math.min(1, score));
}

function calculateCarbonScore(soilData: any, insights: any): number {
  let score = 0.4;
  
  const organicMatter = soilData.organic_matter_percentage || 2;
  if (organicMatter > 4) score -= 0.2;
  if (organicMatter < 1) score += 0.3;
  
  if (insights.vegetation_health === 'high') score -= 0.1;
  
  return Math.max(0, Math.min(1, score));
}

function generateEnhancedRecommendations(insights: any, runoffRisk: number, contaminationRisk: number): string[] {
  const recommendations = [];
  
  if (insights.vegetation_health === 'low') {
    recommendations.push('Implement cover cropping to improve vegetation health and soil protection');
  }
  
  if (insights.soil_moisture === 'low') {
    recommendations.push('Consider drought-resistant crops and improved irrigation efficiency');
  }
  
  if (insights.erosion_risk === 'high') {
    recommendations.push('Install erosion control measures such as terracing or buffer strips');
  }
  
  if (runoffRisk > 0.7) {
    recommendations.push('Reduce fertilizer application rates and implement precision agriculture techniques');
  }
  
  if (contaminationRisk > 0.6) {
    recommendations.push('Establish riparian buffers and consider organic farming practices');
  }
  
  if (insights.water_stress === 'high') {
    recommendations.push('Implement water conservation practices and soil moisture monitoring');
  }
  
  return recommendations;
}