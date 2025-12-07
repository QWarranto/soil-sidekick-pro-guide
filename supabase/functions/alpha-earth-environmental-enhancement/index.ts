/**
 * Alpha Earth Environmental Enhancement Function
 * Migrated to requestHandler: December 7, 2025 (Phase 3A.5)
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requestHandler } from '../_shared/request-handler.ts';
import { satelliteAnalysisSchema } from '../_shared/validation.ts';
import { rateLimiter, exponentialBackoff } from '../_shared/api-rate-limiter.ts';
import { APICacheManager } from '../_shared/api-cache-manager.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

type SatelliteAnalysisRequest = z.infer<typeof satelliteAnalysisSchema>;

requestHandler<SatelliteAnalysisRequest>({
  requireAuth: true,
  requireSubscription: 'professional', // Professional tier required for satellite analysis
  validationSchema: satelliteAnalysisSchema,
  rateLimit: {
    requests: 50,  // 50 satellite analyses per hour
    windowMs: 60 * 60 * 1000,
  },
  handler: async ({ supabaseClient, user, validatedData, startTime }) => {
    const { analysis_id, county_fips, lat, lng, soil_data, water_body_data } = validatedData;

    // Initialize cache manager
    const cacheManager = new APICacheManager(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Use cache manager for satellite data (12 hour TTL)
    const { data: satelliteData, fromCache, cacheLevel } = await cacheManager.getOrFetch(
      {
        provider: 'GOOGLE_EE',
        key: `satellite_${lat}_${lng}`,
        ttl: 12 * 60 * 60 * 1000, // 12 hours
        staleWhileRevalidate: true,
        countyFips: county_fips,
      },
      async () => {
        // Check rate limits before calling Google Earth Engine
        const canCall = await rateLimiter.canMakeRequest('GOOGLE_EE', 3);
        if (!canCall) {
          throw new Error('Google Earth Engine rate limit exceeded');
        }

        try {
          const data = await getSatelliteEmbeddings(lat, lng);
          rateLimiter.recordSuccess('GOOGLE_EE');
          return data;
        } catch (error) {
          rateLimiter.recordFailure('GOOGLE_EE', error as Error);
          throw error;
        }
      }
    );

    console.log(`[Satellite] Data source: ${fromCache ? `cache (${cacheLevel})` : 'fresh GEE call'}`);
    
    // Enhance environmental impact analysis
    const enhancedAnalysis = await enhanceEnvironmentalImpact(
      soil_data,
      satelliteData,
      water_body_data
    );

    // Store enhanced results
    const { error: insertError } = await supabaseClient
      .from('environmental_impact_scores')
      .upsert({
        analysis_id,
        user_id: user.id,
        county_fips,
        runoff_risk_score: enhancedAnalysis.runoff_risk_score,
        contamination_risk: enhancedAnalysis.contamination_risk_score > 0.6 ? 'high' : enhancedAnalysis.contamination_risk_score > 0.3 ? 'medium' : 'low',
        biodiversity_impact: enhancedAnalysis.biodiversity_impact_score > 0.6 ? 'negative' : enhancedAnalysis.biodiversity_impact_score > 0.3 ? 'neutral' : 'positive',
        carbon_footprint_score: enhancedAnalysis.carbon_footprint_score,
        eco_friendly_alternatives: { recommendations: enhancedAnalysis.recommendations },
      });

    if (insertError) {
      console.error('Database error:', insertError);
      throw new Error('Failed to store enhanced analysis');
    }

    // Track cost
    const costUsd = fromCache ? 0 : 0.01; // Only charge for fresh GEE calls
    await supabaseClient.from('cost_tracking').insert({
      service_provider: 'google_earth',
      service_type: 'satellite-embeddings',
      feature_name: 'alpha-earth-environmental-enhancement',
      user_id: user.id,
      cost_usd: costUsd,
      usage_count: 1,
      request_details: {
        from_cache: fromCache,
        cache_level: cacheLevel,
        lat,
        lng,
        duration_ms: Date.now() - startTime,
      },
    });

    // Get rate limiter status
    const rateLimitStatus = rateLimiter.getStatus('GOOGLE_EE');

    return {
      enhanced_analysis: enhancedAnalysis,
      satellite_insights: satelliteData.insights,
      cache_info: {
        cached: fromCache,
        cache_level: cacheLevel,
      },
      rate_limit_status: {
        requests_this_minute: rateLimitStatus.requestsLastMinute,
        requests_this_hour: rateLimitStatus.requestsLastHour,
      }
    };
  },
});

async function getSatelliteEmbeddings(lat: number, lng: number) {
  const earthEngineApiKey = Deno.env.get('GOOGLE_EARTH_ENGINE_API_KEY');
  
  // Use exponential backoff for GEE API calls
  return await exponentialBackoff(async () => {
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
      }),
      signal: AbortSignal.timeout(20000)
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
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!embedResponse.ok) {
      throw new Error(`GEE API returned ${embedResponse.status}`);
    }

    const embedData = await embedResponse.json();
    
    return {
      embeddings: embedData.result || [],
      insights: analyzeSatelliteInsights(embedData.result || []),
      confidence: calculateConfidence(embedData.result || [])
    };
  }, 3, 3000);
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
  
  const baseRunoffRisk = calculateBaseRunoffRisk(soilData);
  const satelliteRunoffAdjustment = insights.soil_moisture === 'high' ? -0.1 : 
                                   insights.soil_moisture === 'low' ? 0.2 : 0;
  const enhancedRunoffRisk = Math.max(0, Math.min(1, baseRunoffRisk + satelliteRunoffAdjustment));

  const baseContaminationRisk = calculateBaseContaminationRisk(soilData, waterBodyData);
  const vegetationProtection = insights.vegetation_health === 'high' ? -0.15 : 
                               insights.vegetation_health === 'low' ? 0.1 : 0;
  const enhancedContaminationRisk = Math.max(0, Math.min(1, baseContaminationRisk + vegetationProtection));

  const biodiversityScore = calculateBiodiversityScore(insights);
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
