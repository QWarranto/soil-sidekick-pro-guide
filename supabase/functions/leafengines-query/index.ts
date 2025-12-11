import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticateApiKey, logSecurityEvent, createSecureResponse } from "../_shared/security-utils.ts";

// FIPS code validation
const fipsCodeSchema = z.string().regex(/^\d{5}$/, "FIPS code must be exactly 5 digits");

// LeafEngines Query schema (matching validation.ts)
const leafEnginesSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    address: z.string().max(500).optional(),
    county_fips: fipsCodeSchema.optional(),
  }),
  plant: z.object({
    common_name: z.string().max(200).optional(),
    scientific_name: z.string().max(200).optional(),
    plant_id: z.string().max(100).optional(),
    care_requirements: z.object({
      sun_exposure: z.enum(['full_sun', 'partial_shade', 'full_shade']).optional(),
      water_needs: z.enum(['low', 'medium', 'high']).optional(),
      soil_ph_range: z.object({ min: z.number(), max: z.number() }).optional(),
      hardiness_zones: z.array(z.string()).optional(),
    }).optional(),
  }),
  options: z.object({
    include_satellite_data: z.boolean().optional(),
    include_water_quality: z.boolean().optional(),
    include_recommendations: z.boolean().optional(),
  }).optional(),
});

type LeafEnginesQuery = z.infer<typeof leafEnginesSchema>;

interface EnvironmentalCompatibilityScore {
  overall_score: number; // 0-100
  soil_compatibility: number;
  water_compatibility: number;
  climate_compatibility: number;
  breakdown: {
    soil: {
      score: number;
      factors: string[];
      concerns: string[];
    };
    water: {
      score: number;
      factors: string[];
      concerns: string[];
    };
    climate: {
      score: number;
      factors: string[];
      concerns: string[];
    };
  };
  recommendations: string[];
  risk_level: "low" | "medium" | "high";
  metadata: {
    location: string;
    timestamp: string;
    data_sources: string[];
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Authenticate API key
    const apiKeyHeader = req.headers.get("x-api-key");
    if (!apiKeyHeader) {
      await logSecurityEvent(supabaseClient, {
        event_type: "api_key_missing",
        severity: "medium",
        details: { endpoint: "leafengines-query" }
      }, req);
      
      return createSecureResponse(
        { error: "API key required. Contact sales@leafengines.com for access." },
        401,
        corsHeaders
      );
    }

    const { user, permissions, error: authError } = await authenticateApiKey(
      supabaseClient,
      req
    );

    if (authError || !user) {
      await logSecurityEvent(supabaseClient, {
        event_type: "api_key_invalid",
        severity: "high",
        details: { endpoint: "leafengines-query", error: authError }
      }, req);

      return createSecureResponse(
        { error: "Invalid API key" },
        401,
        corsHeaders
      );
    }

    // Check permissions
    if (!permissions?.endpoints?.includes("leafengines-query")) {
      return createSecureResponse(
        { error: "API key does not have access to leafengines-query endpoint" },
        403,
        corsHeaders
      );
    }

    // Parse and validate input using Zod schema
    let rawInput: unknown;
    try {
      rawInput = await req.json();
    } catch {
      return createSecureResponse(
        { error: "Invalid JSON body" },
        400,
        corsHeaders
      );
    }

    const validationResult = leafEnginesSchema.safeParse(rawInput);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      
      await logSecurityEvent(supabaseClient, {
        event_type: "leafengines_query_validation_failed",
        severity: "low",
        details: { errors: validationResult.error.errors }
      }, req);

      return createSecureResponse(
        { error: "Validation failed", details: errorMessage },
        400,
        corsHeaders
      );
    }

    const query: LeafEnginesQuery = validationResult.data;

    // Validate business logic requirements
    if (!query.location.county_fips && !query.location.latitude) {
      return createSecureResponse(
        { error: "Location data required (county_fips or latitude/longitude)" },
        400,
        corsHeaders
      );
    }

    if (!query.plant.common_name && !query.plant.plant_id) {
      return createSecureResponse(
        { error: "Plant identification required (common_name or plant_id)" },
        400,
        corsHeaders
      );
    }

    const dataSources: string[] = [];
    const startTime = Date.now();

    // Resolve county_fips if not provided
    let countyFips = query.location.county_fips;
    if (!countyFips && query.location.latitude && query.location.longitude) {
      // Call county-lookup to resolve FIPS from coordinates
      const countyLookupResponse = await supabaseClient.functions.invoke("county-lookup", {
        body: {
          latitude: query.location.latitude,
          longitude: query.location.longitude
        }
      });

      if (countyLookupResponse.data?.fips_code) {
        countyFips = countyLookupResponse.data.fips_code;
      }
    }

    if (!countyFips) {
      return createSecureResponse(
        { error: "Unable to resolve location to county FIPS code" },
        400,
        corsHeaders
      );
    }

    // Fetch soil data
    const soilDataResponse = await supabaseClient.functions.invoke("get-soil-data", {
      body: { county_fips: countyFips }
    });

    let soilData = null;
    if (soilDataResponse.data) {
      soilData = soilDataResponse.data;
      dataSources.push("USDA_NRCS");
    }

    // Fetch water quality data (if requested)
    let waterData = null;
    if (query.options?.include_water_quality !== false) {
      const waterResponse = await supabaseClient.functions.invoke("territorial-water-quality", {
        body: { county_fips: countyFips }
      });

      if (waterResponse.data) {
        waterData = waterResponse.data;
        dataSources.push("EPA_WQP");
      }
    }

    // Fetch satellite data (if requested and coordinates provided)
    let satelliteData = null;
    if (query.options?.include_satellite_data && query.location.latitude && query.location.longitude) {
      const satelliteResponse = await supabaseClient.functions.invoke(
        "alpha-earth-environmental-enhancement",
        {
          body: {
            latitude: query.location.latitude,
            longitude: query.location.longitude
          }
        }
      );

      if (satelliteResponse.data) {
        satelliteData = satelliteResponse.data;
        dataSources.push("ALPHA_EARTH");
      }
    }

    // Calculate environmental compatibility score
    const compatibilityScore = calculateCompatibilityScore(
      query.plant,
      soilData,
      waterData,
      satelliteData
    );

    // Log API usage for billing
    await supabaseClient.from("adapt_api_usage").insert({
      user_id: user.user_id,
      endpoint: "leafengines-query",
      request_type: "environmental_compatibility",
      data_type: "multi_source_analysis",
      subscription_tier: permissions?.tier || "partner",
      success: true,
      response_time_ms: Date.now() - startTime,
      request_size_kb: Math.ceil(JSON.stringify(query).length / 1024)
    });

    return createSecureResponse(
      {
        success: true,
        data: compatibilityScore,
        usage: {
          credits_used: 1,
          response_time_ms: Date.now() - startTime
        }
      },
      200,
      corsHeaders
    );

  } catch (error) {
    console.error("LeafEngines query error:", error);
    
    await logSecurityEvent(supabaseClient, {
      event_type: "api_error",
      severity: "high",
      details: { 
        endpoint: "leafengines-query",
        error: error.message,
        stack: error.stack
      }
    }, req);

    return createSecureResponse(
      { 
        error: "Internal server error"
      },
      500,
      corsHeaders
    );
  }
});

function calculateCompatibilityScore(
  plant: LeafEnginesQuery["plant"],
  soilData: any,
  waterData: any,
  satelliteData: any
): EnvironmentalCompatibilityScore {
  const soilScore = calculateSoilCompatibility(plant, soilData);
  const waterScore = calculateWaterCompatibility(plant, waterData);
  const climateScore = calculateClimateCompatibility(plant, satelliteData);

  // Weighted average: soil 40%, water 30%, climate 30%
  const overallScore = Math.round(
    soilScore.score * 0.4 + waterScore.score * 0.3 + climateScore.score * 0.3
  );

  const allRecommendations = [
    ...soilScore.recommendations,
    ...waterScore.recommendations,
    ...climateScore.recommendations
  ];

  const riskLevel = 
    overallScore >= 70 ? "low" :
    overallScore >= 50 ? "medium" : "high";

  return {
    overall_score: overallScore,
    soil_compatibility: soilScore.score,
    water_compatibility: waterScore.score,
    climate_compatibility: climateScore.score,
    breakdown: {
      soil: {
        score: soilScore.score,
        factors: soilScore.factors,
        concerns: soilScore.concerns
      },
      water: {
        score: waterScore.score,
        factors: waterScore.factors,
        concerns: waterScore.concerns
      },
      climate: {
        score: climateScore.score,
        factors: climateScore.factors,
        concerns: climateScore.concerns
      }
    },
    recommendations: allRecommendations,
    risk_level: riskLevel,
    metadata: {
      location: soilData?.county_name || "Unknown",
      timestamp: new Date().toISOString(),
      data_sources: ["USDA_NRCS", "EPA_WQP", "ALPHA_EARTH"].filter(Boolean)
    }
  };
}

function calculateSoilCompatibility(plant: any, soilData: any) {
  const factors: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];
  let score = 70; // Base score

  if (!soilData) {
    return {
      score: 50,
      factors: ["No soil data available"],
      concerns: ["Unable to assess soil compatibility"],
      recommendations: ["Conduct local soil testing for accurate assessment"]
    };
  }

  // pH compatibility
  if (plant.care_requirements?.soil_ph_range && soilData.ph_level) {
    const phMin = plant.care_requirements.soil_ph_range.min;
    const phMax = plant.care_requirements.soil_ph_range.max;
    const actualPh = soilData.ph_level;

    if (actualPh >= phMin && actualPh <= phMax) {
      score += 10;
      factors.push(`Soil pH (${actualPh}) is optimal for plant`);
    } else if (actualPh < phMin) {
      score -= 15;
      concerns.push(`Soil is too acidic (${actualPh}), plant prefers ${phMin}-${phMax}`);
      recommendations.push("Consider adding lime to raise soil pH");
    } else {
      score -= 15;
      concerns.push(`Soil is too alkaline (${actualPh}), plant prefers ${phMin}-${phMax}`);
      recommendations.push("Consider adding sulfur to lower soil pH");
    }
  }

  // Organic matter
  if (soilData.organic_matter) {
    if (soilData.organic_matter > 3) {
      score += 10;
      factors.push("Good organic matter content supports healthy growth");
    } else if (soilData.organic_matter < 2) {
      score -= 5;
      concerns.push("Low organic matter may limit nutrient availability");
      recommendations.push("Amend soil with compost or organic matter");
    }
  }

  // Nutrient levels
  if (soilData.nitrogen_level === "adequate" || soilData.nitrogen_level === "high") {
    score += 5;
    factors.push("Adequate nitrogen levels");
  } else if (soilData.nitrogen_level === "low") {
    concerns.push("Low nitrogen may affect plant growth");
    recommendations.push("Consider nitrogen fertilization");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    concerns,
    recommendations
  };
}

function calculateWaterCompatibility(plant: any, waterData: any) {
  const factors: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];
  let score = 70;

  if (!waterData) {
    return {
      score: 60,
      factors: ["No water quality data available"],
      concerns: [],
      recommendations: ["Monitor local water quality for irrigation purposes"]
    };
  }

  // Check water quality parameters
  if (waterData.contamination_risk === "low") {
    score += 15;
    factors.push("Low contamination risk in area");
  } else if (waterData.contamination_risk === "high") {
    score -= 20;
    concerns.push("High contamination risk detected");
    recommendations.push("Test irrigation water before use");
    recommendations.push("Consider filtered or municipal water sources");
  }

  if (waterData.nitrate_nitrogen?.value) {
    const nitrateLevel = waterData.nitrate_nitrogen.value;
    if (nitrateLevel < 10) {
      score += 10;
      factors.push("Safe nitrate levels in water");
    } else {
      concerns.push("Elevated nitrate levels in water supply");
      recommendations.push("Monitor for nutrient burn");
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    concerns,
    recommendations
  };
}

function calculateClimateCompatibility(plant: any, satelliteData: any) {
  const factors: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];
  let score = 70;

  if (!satelliteData) {
    return {
      score: 65,
      factors: ["Satellite data not available"],
      concerns: [],
      recommendations: ["Consider local climate conditions"]
    };
  }

  // NDVI (vegetation health indicator)
  if (satelliteData.ndvi) {
    if (satelliteData.ndvi > 0.6) {
      score += 10;
      factors.push("High vegetation health in area");
    } else if (satelliteData.ndvi < 0.3) {
      score -= 10;
      concerns.push("Low vegetation health detected in area");
      recommendations.push("Prepare for challenging growing conditions");
    }
  }

  // Soil moisture
  if (satelliteData.soil_moisture) {
    const moistureLevel = satelliteData.soil_moisture;
    
    if (plant.care_requirements?.water_needs === "high" && moistureLevel < 0.2) {
      score -= 15;
      concerns.push("Low soil moisture for water-demanding plant");
      recommendations.push("Plan for frequent irrigation");
    } else if (plant.care_requirements?.water_needs === "low" && moistureLevel > 0.7) {
      score -= 10;
      concerns.push("High soil moisture may cause issues for drought-tolerant plant");
      recommendations.push("Ensure good drainage");
    } else {
      score += 5;
      factors.push("Soil moisture levels compatible with plant needs");
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    concerns,
    recommendations
  };
}
