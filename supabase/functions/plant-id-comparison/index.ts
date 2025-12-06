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
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User authenticated:", user.id);

    // Check admin role using service role client (bypasses RLS)
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    console.log("Role check result:", { roleData, roleError });

    if (!roleData) {
      console.error("User is not admin:", user.id);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { image, description, location } = await req.json();
    console.log("Request payload:", { hasImage: !!image, hasDescription: !!description, location });

    if (!image && !description) {
      return new Response(JSON.stringify({ error: "Image or description required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // BASELINE: Simple plant identification without environmental context
    console.log("Starting baseline identification...");
    const baselineStart = performance.now();
    
    const baselineMessages: any[] = [
      {
        role: "system",
        content: `You are a plant identification assistant. Identify the plant and provide your response as a JSON object.
Your response must be ONLY valid JSON with no additional text before or after:
{
  "plant_name": "Common name of the plant",
  "scientific_name": "Scientific name",
  "confidence": 0.85,
  "basic_info": "Brief description of the plant"
}
Use a confidence value between 0.5 and 0.95 based on how certain you are.`
      }
    ];

    // Build user message content
    if (image) {
      baselineMessages.push({
        role: "user",
        content: [
          { type: "text", text: `Identify this plant${description ? `: ${description}` : ""}` },
          { type: "image_url", image_url: { url: image } }
        ]
      });
    } else {
      baselineMessages.push({
        role: "user",
        content: `Identify this plant: ${description}`
      });
    }

    const baselineResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: baselineMessages,
      }),
    });
    const baselineTime = performance.now() - baselineStart;
    
    let baselineResult = { plant_name: "Unknown", scientific_name: "", confidence: 0, basic_info: "" };
    
    if (!baselineResponse.ok) {
      const errorText = await baselineResponse.text();
      console.error("Baseline API error:", baselineResponse.status, errorText);
    } else {
      const baselineData = await baselineResponse.json();
      const content = baselineData.choices?.[0]?.message?.content || "";
      console.log("Baseline raw response:", content.substring(0, 500));
      
      try {
        // Try to extract JSON from the response
        let jsonContent = content.trim();
        
        // Remove markdown code blocks if present
        if (jsonContent.startsWith("```json")) {
          jsonContent = jsonContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonContent.startsWith("```")) {
          jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        
        // Try to find JSON object in the content
        const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          baselineResult = {
            plant_name: parsed.plant_name || "Unknown",
            scientific_name: parsed.scientific_name || "",
            confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
            basic_info: parsed.basic_info || parsed.description || ""
          };
          console.log("Baseline parsed result:", baselineResult);
        } else {
          console.error("No JSON found in baseline response");
        }
      } catch (e) {
        console.error("Baseline parse error:", e);
      }
    }

    // ENHANCED: LeafEngines-style identification with environmental context
    console.log("Starting enhanced identification...");
    const enhancedStart = performance.now();
    
    // Fetch environmental data if location provided
    let environmentalContext: any = null;
    if (location?.latitude && location?.longitude) {
      console.log("Fetching environmental data for location:", location);
      try {
        // Get county info
        const countyResponse = await supabase.functions.invoke("county-lookup", {
          body: { latitude: location.latitude, longitude: location.longitude }
        });
        
        console.log("County lookup response:", countyResponse.data);
        
        if (countyResponse.data?.county) {
          const countyFips = countyResponse.data.county.fips_code;
          
          // Get soil data
          const soilResponse = await supabase.functions.invoke("get-soil-data", {
            body: { county_fips: countyFips }
          });
          console.log("Soil data response:", soilResponse.data);
          
          // Get water quality
          const waterResponse = await supabase.functions.invoke("territorial-water-quality", {
            body: { county_fips: countyFips }
          });
          console.log("Water quality response:", waterResponse.data);
          
          environmentalContext = {
            county: countyResponse.data.county,
            soil: soilResponse.data,
            water_quality: waterResponse.data,
          };
        } else {
          console.log("No county data found for location");
        }
      } catch (e) {
        console.error("Environmental data fetch error:", e);
      }
    }

    const enhancedSystemPrompt = `You are LeafEngines, an advanced botanical identification system with environmental context integration.

${environmentalContext ? `ENVIRONMENTAL CONTEXT:
- County: ${environmentalContext.county?.county_name || "Unknown"}, ${environmentalContext.county?.state_code || "Unknown"}
- Soil pH: ${environmentalContext.soil?.ph_level || "Not available"}
- Soil Organic Matter: ${environmentalContext.soil?.organic_matter || "Not available"}%
- Water Quality Risk: ${environmentalContext.water_quality?.contamination_risk || "Not available"}
- Climate Zone: ${environmentalContext.soil?.usda_zone || "Not available"}` : "No location data provided - using general analysis."}

Provide comprehensive plant identification with environmental compatibility analysis.
Your response must be ONLY valid JSON with no additional text before or after:
{
  "plant_name": "Common name",
  "scientific_name": "Scientific name", 
  "confidence": 0.85,
  "family": "Plant family",
  "native_region": "Origin region",
  "environmental_compatibility": {
    "soil_match": 0.75,
    "climate_match": 0.80,
    "water_needs_match": 0.70,
    "overall_suitability": 0.75
  },
  "care_recommendations": ["recommendation1", "recommendation2"],
  "pest_disease_risks": ["risk1", "risk2"],
  "growth_predictions": {
    "expected_height": "X feet",
    "growth_rate": "medium",
    "optimal_planting_season": "spring"
  },
  "detailed_analysis": "Comprehensive botanical analysis"
}
Use confidence and compatibility values between 0.5 and 0.95 based on the plant and environmental factors.`;

    const enhancedMessages: any[] = [
      { role: "system", content: enhancedSystemPrompt }
    ];

    if (image) {
      enhancedMessages.push({
        role: "user",
        content: [
          { type: "text", text: `Identify this plant with full environmental analysis${description ? `: ${description}` : ""}` },
          { type: "image_url", image_url: { url: image } }
        ]
      });
    } else {
      enhancedMessages.push({
        role: "user",
        content: `Identify this plant with full environmental analysis: ${description}`
      });
    }

    const enhancedResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: enhancedMessages,
      }),
    });
    const enhancedTime = performance.now() - enhancedStart;

    let enhancedResult: any = { 
      plant_name: "Unknown", 
      scientific_name: "", 
      confidence: 0, 
      environmental_compatibility: {
        soil_match: 0,
        climate_match: 0,
        water_needs_match: 0,
        overall_suitability: 0
      },
      care_recommendations: [],
      pest_disease_risks: [],
      growth_predictions: {},
      detailed_analysis: ""
    };
    
    if (!enhancedResponse.ok) {
      const errorText = await enhancedResponse.text();
      console.error("Enhanced API error:", enhancedResponse.status, errorText);
    } else {
      const enhancedData = await enhancedResponse.json();
      const content = enhancedData.choices?.[0]?.message?.content || "";
      console.log("Enhanced raw response:", content.substring(0, 500));
      
      try {
        let jsonContent = content.trim();
        
        // Remove markdown code blocks if present
        if (jsonContent.startsWith("```json")) {
          jsonContent = jsonContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonContent.startsWith("```")) {
          jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        
        const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          enhancedResult = {
            plant_name: parsed.plant_name || "Unknown",
            scientific_name: parsed.scientific_name || "",
            confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
            family: parsed.family || "",
            native_region: parsed.native_region || "",
            environmental_compatibility: {
              soil_match: parsed.environmental_compatibility?.soil_match || 0.5,
              climate_match: parsed.environmental_compatibility?.climate_match || 0.5,
              water_needs_match: parsed.environmental_compatibility?.water_needs_match || 0.5,
              overall_suitability: parsed.environmental_compatibility?.overall_suitability || 0.5,
            },
            care_recommendations: parsed.care_recommendations || [],
            pest_disease_risks: parsed.pest_disease_risks || [],
            growth_predictions: parsed.growth_predictions || {},
            detailed_analysis: parsed.detailed_analysis || ""
          };
          console.log("Enhanced parsed result:", enhancedResult);
        } else {
          console.error("No JSON found in enhanced response");
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

    console.log("Final comparison:", comparison);

    // Log comparison for analytics
    await supabase.from("cost_tracking").insert({
      service_provider: "lovable_ai",
      service_type: "plant_id_comparison",
      feature_name: "admin_baseline_test",
      cost_usd: 0.002,
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
