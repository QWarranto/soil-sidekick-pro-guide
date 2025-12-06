import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ComparisonResult {
  baseline: {
    identification: string;
    confidence: number;
    response_time_ms: number;
    details: string;
  };
  enhanced: {
    identification: string;
    confidence: number;
    response_time_ms: number;
    details: string;
    environmental_context: any;
  };
  comparison_metrics: {
    confidence_improvement: number;
    response_time_difference_ms: number;
    additional_data_points: number;
    match_agreement: boolean;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { image, description, location } = await req.json();

    if (!image && !description) {
      return new Response(JSON.stringify({ error: "Image or description required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // BASELINE: Simple plant identification without environmental context
    const baselineStart = performance.now();
    const baselineResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a basic plant identification assistant. Identify the plant based on the description provided. 
Respond with JSON only:
{
  "plant_name": "Common name",
  "scientific_name": "Scientific name",
  "confidence": 0.0-1.0,
  "basic_info": "Brief description"
}`
          },
          {
            role: "user",
            content: image 
              ? [
                  { type: "text", text: `Identify this plant. ${description || ""}` },
                  { type: "image_url", image_url: { url: image } }
                ]
              : `Identify this plant: ${description}`
          }
        ],
      }),
    });
    const baselineTime = performance.now() - baselineStart;
    
    let baselineResult = { plant_name: "Unknown", scientific_name: "", confidence: 0, basic_info: "" };
    if (baselineResponse.ok) {
      const baselineData = await baselineResponse.json();
      const content = baselineData.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          baselineResult = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Baseline parse error:", e);
      }
    }

    // ENHANCED: LeafEngines-style identification with environmental context
    const enhancedStart = performance.now();
    
    // Fetch environmental data if location provided
    let environmentalContext: any = null;
    if (location?.latitude && location?.longitude) {
      try {
        // Get county info
        const countyResponse = await supabase.functions.invoke("county-lookup", {
          body: { latitude: location.latitude, longitude: location.longitude }
        });
        
        if (countyResponse.data?.county) {
          const countyFips = countyResponse.data.county.fips_code;
          
          // Get soil data
          const soilResponse = await supabase.functions.invoke("get-soil-data", {
            body: { county_fips: countyFips }
          });
          
          // Get water quality
          const waterResponse = await supabase.functions.invoke("territorial-water-quality", {
            body: { county_fips: countyFips }
          });
          
          environmentalContext = {
            county: countyResponse.data.county,
            soil: soilResponse.data,
            water_quality: waterResponse.data,
          };
        }
      } catch (e) {
        console.error("Environmental data fetch error:", e);
      }
    }

    const enhancedPrompt = `You are LeafEngines, an advanced botanical identification system with environmental context integration.

${environmentalContext ? `ENVIRONMENTAL CONTEXT:
- County: ${environmentalContext.county?.county_name}, ${environmentalContext.county?.state_code}
- Soil pH: ${environmentalContext.soil?.ph_level || "N/A"}
- Soil Organic Matter: ${environmentalContext.soil?.organic_matter || "N/A"}%
- Water Quality Risk: ${environmentalContext.water_quality?.contamination_risk || "N/A"}
- Climate Zone: ${environmentalContext.soil?.usda_zone || "N/A"}` : "No location data provided."}

Provide comprehensive plant identification with environmental compatibility analysis.
Respond with JSON only:
{
  "plant_name": "Common name",
  "scientific_name": "Scientific name", 
  "confidence": 0.0-1.0,
  "family": "Plant family",
  "native_region": "Origin",
  "environmental_compatibility": {
    "soil_match": 0.0-1.0,
    "climate_match": 0.0-1.0,
    "water_needs_match": 0.0-1.0,
    "overall_suitability": 0.0-1.0
  },
  "care_recommendations": ["recommendation1", "recommendation2"],
  "pest_disease_risks": ["risk1", "risk2"],
  "growth_predictions": {
    "expected_height": "X feet",
    "growth_rate": "slow/medium/fast",
    "optimal_planting_season": "season"
  },
  "detailed_analysis": "Comprehensive botanical analysis including environmental factors"
}`;

    const enhancedResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: enhancedPrompt },
          {
            role: "user",
            content: image 
              ? [
                  { type: "text", text: `Identify this plant with full environmental analysis. ${description || ""}` },
                  { type: "image_url", image_url: { url: image } }
                ]
              : `Identify this plant with full environmental analysis: ${description}`
          }
        ],
      }),
    });
    const enhancedTime = performance.now() - enhancedStart;

    let enhancedResult: any = { 
      plant_name: "Unknown", 
      scientific_name: "", 
      confidence: 0, 
      environmental_compatibility: {},
      care_recommendations: [],
      pest_disease_risks: [],
      growth_predictions: {},
      detailed_analysis: ""
    };
    
    if (enhancedResponse.ok) {
      const enhancedData = await enhancedResponse.json();
      const content = enhancedData.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          enhancedResult = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Enhanced parse error:", e);
      }
    }

    // Calculate comparison metrics
    const baselineDataPoints = Object.keys(baselineResult).length;
    const enhancedDataPoints = Object.keys(enhancedResult).length + 
      Object.keys(enhancedResult.environmental_compatibility || {}).length +
      (enhancedResult.care_recommendations?.length || 0) +
      (enhancedResult.pest_disease_risks?.length || 0) +
      Object.keys(enhancedResult.growth_predictions || {}).length;

    const comparison: ComparisonResult = {
      baseline: {
        identification: baselineResult.plant_name,
        confidence: baselineResult.confidence || 0,
        response_time_ms: Math.round(baselineTime),
        details: baselineResult.basic_info || "",
      },
      enhanced: {
        identification: enhancedResult.plant_name,
        confidence: enhancedResult.confidence || 0,
        response_time_ms: Math.round(enhancedTime),
        details: enhancedResult.detailed_analysis || "",
        environmental_context: environmentalContext,
      },
      comparison_metrics: {
        confidence_improvement: ((enhancedResult.confidence || 0) - (baselineResult.confidence || 0)) * 100,
        response_time_difference_ms: Math.round(enhancedTime - baselineTime),
        additional_data_points: enhancedDataPoints - baselineDataPoints,
        match_agreement: baselineResult.plant_name?.toLowerCase() === enhancedResult.plant_name?.toLowerCase(),
      },
    };

    // Log comparison for analytics
    await supabase.from("cost_tracking").insert({
      service_provider: "lovable_ai",
      service_type: "plant_id_comparison",
      feature_name: "admin_baseline_test",
      cost_usd: 0.002, // Approximate cost for 2 API calls
      usage_count: 1,
      user_id: user.id,
      request_details: {
        baseline_result: baselineResult,
        enhanced_result: enhancedResult,
        metrics: comparison.comparison_metrics,
      },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      comparison,
      full_baseline: baselineResult,
      full_enhanced: enhancedResult,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Comparison error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Comparison failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
