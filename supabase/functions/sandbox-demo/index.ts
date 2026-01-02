import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Demo data for sandbox environment - no authentication required
const DEMO_PLANTS = {
  tomato: {
    common_name: "Tomato",
    scientific_name: "Solanum lycopersicum",
    plant_type: "vegetable",
    hardiness_zones: ["4-11"]
  },
  monstera: {
    common_name: "Monstera",
    scientific_name: "Monstera deliciosa",
    plant_type: "houseplant",
    hardiness_zones: ["10-12"]
  },
  basil: {
    common_name: "Basil",
    scientific_name: "Ocimum basilicum",
    plant_type: "herb",
    hardiness_zones: ["2-11"]
  },
  rose: {
    common_name: "Rose",
    scientific_name: "Rosa",
    plant_type: "ornamental",
    hardiness_zones: ["3-10"]
  }
};

const DEMO_COUNTIES = {
  "12086": { name: "Miami-Dade", state: "FL", zone: "10b-11a", climate: "tropical" },
  "06037": { name: "Los Angeles", state: "CA", zone: "9b-11a", climate: "mediterranean" },
  "48201": { name: "Harris", state: "TX", zone: "9a", climate: "humid_subtropical" },
  "36061": { name: "New York", state: "NY", zone: "7a-7b", climate: "humid_continental" }
};

function generateCompatibilityScore(plant: string, county: string): number {
  // Simulate realistic scores based on plant-county combinations
  const plantData = DEMO_PLANTS[plant.toLowerCase()] || DEMO_PLANTS.tomato;
  const countyData = DEMO_COUNTIES[county] || DEMO_COUNTIES["12086"];
  
  // Base score with some randomization for demo purposes
  let score = 75 + Math.floor(Math.random() * 20);
  
  // Adjust based on climate compatibility
  if (countyData.climate === "tropical" && plantData.plant_type === "vegetable") {
    score = Math.min(95, score + 10);
  }
  
  return score;
}

function generateDemoResponse(endpoint: string, body: Record<string, unknown>) {
  const startTime = Date.now();
  
  switch (endpoint) {
    case "leafengines-query": {
      const plantName = (body.plant as Record<string, string>)?.common_name || "Tomato";
      const countyFips = (body.location as Record<string, string>)?.county_fips || "12086";
      const county = DEMO_COUNTIES[countyFips] || DEMO_COUNTIES["12086"];
      const plant = DEMO_PLANTS[plantName.toLowerCase()] || DEMO_PLANTS.tomato;
      const score = generateCompatibilityScore(plantName, countyFips);
      
      return {
        compatibility_score: score,
        plant: plant,
        location: {
          county_name: county.name,
          state: county.state,
          hardiness_zone: county.zone,
          climate_type: county.climate
        },
        environmental_factors: {
          soil_compatibility: score + Math.floor(Math.random() * 10) - 5,
          climate_suitability: score + Math.floor(Math.random() * 10) - 5,
          water_quality_impact: "low",
          seasonal_timing: "optimal"
        },
        recommendations: [
          `${plant.common_name} grows well in ${county.name} County's ${county.climate} climate`,
          `Plant in zones ${plant.hardiness_zones.join(", ")} - your area (${county.zone}) is compatible`,
          "Monitor soil moisture during peak summer months",
          "Consider companion planting for pest management"
        ],
        risk_assessment: {
          frost_risk: county.climate === "tropical" ? "none" : "moderate",
          drought_risk: "low",
          pest_pressure: "moderate"
        },
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime,
          api_version: "1.2.0"
        }
      };
    }
    
    case "safe-identification": {
      return {
        species: {
          id: "monstera-deliciosa",
          common_name: "Monstera Deliciosa",
          scientific_name: "Monstera deliciosa",
          confidence: 94.2
        },
        toxic_lookalike_warnings: [
          {
            lookalike_name: "Philodendron selloum",
            toxicity_level: "moderate",
            distinguishing_features: "Monstera has characteristic holes (fenestrations) in mature leaves; Philodendron has solid, deeply lobed leaves",
            risk_if_confused: "Mild digestive upset if ingested"
          }
        ],
        environmental_compatibility_score: 87,
        is_toxic_to_pets: true,
        care_level: "easy",
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime,
          api_version: "1.2.0"
        }
      };
    }
    
    case "dynamic-care": {
      const plantId = body.plant_identifier || "monstera";
      return {
        plant_identifier: plantId,
        immediate_care_needs: [
          "Check soil moisture - water if top 2 inches are dry",
          "Rotate plant 1/4 turn for even growth"
        ],
        weekly_recommendations: [
          "Mist leaves to increase humidity",
          "Wipe leaves with damp cloth to remove dust",
          "Check for pests under leaves"
        ],
        seasonal_adjustments: [
          "Current season: Reduce watering frequency",
          "Move away from cold drafts near windows",
          "Hold off on fertilizing until spring"
        ],
        local_environment_factors: {
          region: "South Florida",
          current_temp: "78°F",
          humidity: "72%",
          daylight_hours: 10.5
        },
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime,
          api_version: "1.2.0"
        }
      };
    }
    
    case "beginner-guidance": {
      return {
        plant_name: "Pothos",
        difficulty_rating: "beginner-friendly",
        quick_tips: [
          "Water when soil feels dry to touch",
          "Thrives in indirect light, tolerates low light",
          "Nearly impossible to kill - great first plant!"
        ],
        common_mistakes_to_avoid: [
          "Overwatering (let soil dry between waterings)",
          "Direct sunlight (causes leaf burn)",
          "Cold drafts near windows"
        ],
        success_indicators: [
          "New leaf growth",
          "Glossy, vibrant leaves",
          "Trailing vines getting longer"
        ],
        encouragement: "You've got this! Pothos are incredibly forgiving plants perfect for beginners.",
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime,
          api_version: "1.2.0"
        }
      };
    }
    
    case "get-soil-data": {
      const countyFips = body.county_fips || "12086";
      const county = DEMO_COUNTIES[countyFips as string] || DEMO_COUNTIES["12086"];
      
      return {
        county_name: county.name,
        state: county.state,
        fips_code: countyFips,
        soil_data: {
          ph_level: 6.8,
          organic_matter: 3.2,
          nitrogen_ppm: 45,
          phosphorus_ppm: 32,
          potassium_ppm: 180,
          texture: "sandy loam",
          drainage: "well-drained"
        },
        recommendations: [
          "Soil pH is optimal for most vegetables",
          "Consider adding compost to boost organic matter",
          "Nitrogen levels are adequate for leafy greens"
        ],
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime,
          api_version: "1.2.0"
        }
      };
    }
    
    default:
      return {
        error: "Unknown endpoint",
        available_endpoints: [
          "leafengines-query",
          "safe-identification", 
          "dynamic-care",
          "beginner-guidance",
          "get-soil-data"
        ],
        _metadata: {
          demo_mode: true,
          response_time_ms: Date.now() - startTime
        }
      };
  }
}

serve(async (req: Request) => {
  const startTime = Date.now();
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'leafengines-query';
    
    let body: Record<string, unknown> = {};
    if (req.method === 'POST') {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    console.log(`[Sandbox] Demo request for endpoint: ${endpoint}`);
    console.log(`[Sandbox] Request body:`, JSON.stringify(body));

    const response = generateDemoResponse(endpoint, body);
    const responseTime = Date.now() - startTime;

    console.log(`[Sandbox] Response generated in ${responseTime}ms`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Response-Time': `${responseTime}ms`,
        'X-Response-Time-Ms': String(responseTime),
        'X-Demo-Mode': 'true',
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '9',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60)
      }
    });
  } catch (error) {
    console.error('[Sandbox] Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Sandbox error',
      message: error instanceof Error ? error.message : 'Unknown error',
      _metadata: {
        demo_mode: true,
        response_time_ms: Date.now() - startTime
      }
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
