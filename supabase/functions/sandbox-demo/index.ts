import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Fire-and-forget logging for sandbox traffic into api_key_access_log.
// Uses NULL api_key_id (sandbox keys aren't in api_keys table) but records
// endpoint, IP, UA, success so reconciliation reports see the volume.
async function logSandboxAccess(req: Request, opts: {
  endpoint: string;
  success: boolean;
  failureReason?: string | null;
  responseTimeMs?: number;
  rateLimited?: boolean;
}) {
  try {
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || null;
    await serviceClient.from('api_key_access_log').insert({
      api_key_id: null,
      user_id: null,
      endpoint: `sandbox-demo:${opts.endpoint}`,
      success: opts.success,
      failure_reason: opts.failureReason ?? null,
      response_time_ms: opts.responseTimeMs ?? null,
      rate_limited: opts.rateLimited ?? false,
      ip_address: ip,
      user_agent: req.headers.get('user-agent'),
    });
  } catch (err) {
    console.error('[logSandboxAccess] failed:', err);
  }
}

// ─── API Key Validation ─────────────────────────────────────────────
// Accepts ak_sandbox_* keys via x-api-key header or Authorization: Bearer
function extractApiKey(req: Request): string | null {
  const xApiKey = req.headers.get('x-api-key');
  if (xApiKey) return xApiKey;
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function validateApiKey(key: string | null): { valid: boolean; tier: string; error?: string } {
  if (!key) return { valid: false, tier: 'none', error: 'Missing API key. Send x-api-key or Authorization: Bearer header.' };
  if (!key.startsWith('ak_sandbox_')) return { valid: false, tier: 'none', error: 'Invalid key prefix. Sandbox keys must start with ak_sandbox_' };
  if (key.length < 16) return { valid: false, tier: 'none', error: 'API key too short' };
  // Sandbox keys grant full-tier access for testing
  return { valid: true, tier: 'sandbox' };
}

// ─── Rate Limit Simulation ──────────────────────────────────────────
const rateLimitCounters = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 60; // requests per minute
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(apiKey: string): { allowed: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  let entry = rateLimitCounters.get(apiKey);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    rateLimitCounters.set(apiKey, entry);
  }
  entry.count++;
  const remaining = Math.max(0, RATE_LIMIT - entry.count);
  const reset = Math.floor((entry.windowStart + RATE_WINDOW_MS) / 1000);
  return { allowed: entry.count <= RATE_LIMIT, limit: RATE_LIMIT, remaining, reset };
}

// ─── Demo Data ──────────────────────────────────────────────────────
const DEMO_COUNTIES_DATA: Record<string, { name: string; state: string; zone: string; climate: string }> = {
  "12086": { name: "Miami-Dade", state: "FL", zone: "10b-11a", climate: "tropical" },
  "06037": { name: "Los Angeles", state: "CA", zone: "9b-11a", climate: "mediterranean" },
  "48201": { name: "Harris", state: "TX", zone: "9a", climate: "humid_subtropical" },
  "36061": { name: "New York", state: "NY", zone: "7a-7b", climate: "humid_continental" },
  "17031": { name: "Cook", state: "IL", zone: "5b-6a", climate: "humid_continental" },
  "04013": { name: "Maricopa", state: "AZ", zone: "9b-10a", climate: "arid" },
};

// ─── Endpoint Handlers ──────────────────────────────────────────────

function handleGetSoilData(body: Record<string, unknown>, startTime: number) {
  const countyFips = (body.county_fips as string) || "12086";
  const county = DEMO_COUNTIES_DATA[countyFips] || DEMO_COUNTIES_DATA["12086"];
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
      drainage: "well-drained",
      cation_exchange_capacity: 12.4,
      bulk_density: 1.35
    },
    recommendations: [
      "Soil pH is optimal for most vegetables",
      "Consider adding compost to boost organic matter",
      "Nitrogen levels are adequate for leafy greens"
    ],
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleCountyLookup(body: Record<string, unknown>, startTime: number) {
  const term = (body.term as string) || "";
  const results = Object.entries(DEMO_COUNTIES_DATA)
    .filter(([_, c]) => c.name.toLowerCase().includes(term.toLowerCase()) || c.state.toLowerCase().includes(term.toLowerCase()))
    .map(([fips, c]) => ({ fips_code: fips, county_name: c.name, state_code: c.state, state_name: c.state }));
  return {
    results: results.length > 0 ? results : [{ fips_code: "12086", county_name: "Miami-Dade", state_code: "FL", state_name: "Florida" }],
    total: results.length || 1,
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleTerritorialWaterQuality(body: Record<string, unknown>, startTime: number) {
  const countyFips = (body.county_fips as string) || "12086";
  const county = DEMO_COUNTIES_DATA[countyFips] || DEMO_COUNTIES_DATA["12086"];
  return {
    county: county.name, state: county.state, fips_code: countyFips,
    water_quality: {
      overall_score: 82, ph: 7.2, dissolved_oxygen_mg_l: 8.1,
      nitrate_mg_l: 3.4, phosphate_mg_l: 0.08, turbidity_ntu: 4.2,
      e_coli_cfu_100ml: 45, conductivity_us_cm: 320
    },
    assessment: "Good",
    sources: ["USGS NWIS", "EPA STORET"],
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleTerritorialWaterAnalytics(body: Record<string, unknown>, startTime: number) {
  return {
    territory_type: body.territory_type || "state",
    analytics: {
      avg_quality_score: 78, monitoring_stations: 142, trend: "stable",
      top_contaminants: ["nitrate", "phosphate", "sediment"],
      seasonal_variation: { spring: 74, summer: 71, fall: 79, winter: 83 }
    },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleMultiParameterPlantingCalendar(body: Record<string, unknown>, startTime: number) {
  const cropType = (body.crop_type as string) || "tomato";
  return {
    crop_type: cropType,
    planting_windows: {
      optimal_start: "2026-03-15", optimal_end: "2026-04-30",
      acceptable_start: "2026-03-01", acceptable_end: "2026-05-15"
    },
    frost_dates: { last_frost: "2026-02-28", first_frost: "2026-11-15" },
    growing_degree_days: { required: 1200, accumulated: 0 },
    soil_temperature: { current: 62, required_minimum: 60 },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleLiveAgriculturalData(body: Record<string, unknown>, startTime: number) {
  return {
    county_fips: body.county_fips || "12086",
    data_types: body.data_types || ["weather", "soil"],
    weather: { temperature_f: 78, humidity_pct: 72, wind_mph: 8, precipitation_in: 0.0, uv_index: 7 },
    soil: { moisture_pct: 34, temperature_f: 71 },
    market: { corn_bushel: 4.52, soybean_bushel: 11.38 },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleEnvironmentalImpactEngine(body: Record<string, unknown>, startTime: number) {
  return {
    analysis_id: body.analysis_id || "sandbox-demo",
    county_fips: body.county_fips || "12086",
    environmental_compatibility_score: 84,
    impact_factors: {
      runoff_risk_score: 22, carbon_footprint_score: 68,
      biodiversity_impact: "positive", contamination_risk: "low",
      water_body_proximity_km: 3.2
    },
    eco_friendly_alternatives: [
      { practice: "Cover cropping", benefit: "Reduces erosion by 40%" },
      { practice: "Integrated pest management", benefit: "Reduces chemical use by 60%" }
    ],
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleAlphaEarthEnhancement(body: Record<string, unknown>, startTime: number) {
  return {
    latitude: body.latitude || 25.7617, longitude: body.longitude || -80.1918,
    satellite_analysis: {
      ndvi: 0.72, evi: 0.58, land_surface_temp_c: 28.4,
      soil_moisture_index: 0.41, vegetation_health: "good",
      cloud_cover_pct: 12
    },
    alpha_earth_embeddings: { dimension: 64, model_version: "ae-v2.1" },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleAgriculturalIntelligence(body: Record<string, unknown>, startTime: number) {
  return {
    county_fips: body.county_fips || "12086",
    analysis_type: body.analysis_type || "crop_recommendation",
    recommendations: [
      { crop: "Tomato", suitability_score: 92, confidence: 0.88 },
      { crop: "Pepper", suitability_score: 87, confidence: 0.85 },
      { crop: "Squash", suitability_score: 81, confidence: 0.82 }
    ],
    market_outlook: { demand_trend: "increasing", price_forecast: "stable" },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleSeasonalPlanningAssistant(body: Record<string, unknown>, startTime: number) {
  return {
    planning_type: (body as Record<string, unknown>).planningType || "spring_planting",
    location: body.location || { county_fips: "12086", state_code: "FL" },
    seasonal_tasks: [
      { week: 1, task: "Prepare soil beds", priority: "high" },
      { week: 2, task: "Start seedlings indoors", priority: "high" },
      { week: 4, task: "Transplant cool-season crops", priority: "medium" }
    ],
    weather_outlook: { avg_temp_f: 74, rainfall_in: 2.1, frost_risk: "none" },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleSmartReportSummary(body: Record<string, unknown>, startTime: number) {
  return {
    report_type: body.reportType || "soil",
    summary: "Soil analysis indicates healthy conditions with optimal pH and adequate nutrient levels. Minor improvement recommended for organic matter content.",
    key_findings: [
      { metric: "pH Level", value: "6.8", status: "optimal" },
      { metric: "Organic Matter", value: "3.2%", status: "adequate" },
      { metric: "NPK Balance", value: "balanced", status: "good" }
    ],
    action_items: [
      "Add compost at 2 tons/acre to boost organic matter",
      "Monitor nitrogen levels through growing season"
    ],
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleCarbonCreditCalculator(body: Record<string, unknown>, startTime: number) {
  const fieldSize = (body.field_size_acres as number) || 100;
  return {
    field_name: body.field_name || "Test Field",
    field_size_acres: fieldSize,
    estimated_credits: Math.round(fieldSize * 0.8 * 100) / 100,
    credit_value_usd: Math.round(fieldSize * 0.8 * 28.5 * 100) / 100,
    methodology: "Verra VCS VM0042",
    verification_timeline_months: 12,
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleLeafEnginesQuery(body: Record<string, unknown>, startTime: number) {
  const plantInput = body.plant as Record<string, string> | undefined;
  const locationInput = body.location as Record<string, string> | undefined;
  const plantName = plantInput?.common_name || "Tomato";
  const countyFips = locationInput?.county_fips || "12086";
  const county = DEMO_COUNTIES_DATA[countyFips] || DEMO_COUNTIES_DATA["12086"];
  const score = 75 + Math.floor(Math.random() * 20);
  return {
    compatibility_score: score,
    plant: { common_name: plantName, scientific_name: "Solanum lycopersicum", plant_type: "vegetable" },
    location: { county_name: county.name, state: county.state, hardiness_zone: county.zone, climate_type: county.climate },
    environmental_factors: {
      soil_compatibility: score + Math.floor(Math.random() * 10) - 5,
      climate_suitability: score + Math.floor(Math.random() * 10) - 5,
      water_quality_impact: "low", seasonal_timing: "optimal"
    },
    recommendations: [
      `${plantName} grows well in ${county.name} County's ${county.climate} climate`,
      "Monitor soil moisture during peak summer months"
    ],
    risk_assessment: { frost_risk: county.climate === "tropical" ? "none" : "moderate", drought_risk: "low", pest_pressure: "moderate" },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleVisualCropAnalysis(body: Record<string, unknown>, startTime: number) {
  return {
    analysis_type: body.analysis_type || "crop_health",
    confidence: 0.91,
    findings: {
      overall_health: "good", growth_stage: "vegetative",
      detected_issues: [{ issue: "Minor leaf discoloration", severity: "low", affected_area_pct: 5 }],
      chlorophyll_index: 42.3, leaf_area_index: 3.8
    },
    recommendations: ["Continue current irrigation schedule", "Monitor discolored area for progression"],
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleSafeIdentification(_body: Record<string, unknown>, startTime: number) {
  return {
    species: { id: "monstera-deliciosa", common_name: "Monstera Deliciosa", scientific_name: "Monstera deliciosa", confidence: 94.2 },
    toxic_lookalike_warnings: [{
      lookalike_name: "Philodendron selloum", toxicity_level: "moderate",
      distinguishing_features: "Monstera has characteristic holes (fenestrations) in mature leaves",
      risk_if_confused: "Mild digestive upset if ingested"
    }],
    environmental_compatibility_score: 87, is_toxic_to_pets: true, care_level: "easy",
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleDynamicCare(body: Record<string, unknown>, startTime: number) {
  return {
    plant_identifier: body.plant_identifier || "monstera",
    immediate_care_needs: ["Check soil moisture - water if top 2 inches are dry", "Rotate plant 1/4 turn for even growth"],
    weekly_recommendations: ["Mist leaves to increase humidity", "Check for pests under leaves"],
    seasonal_adjustments: ["Current season: Reduce watering frequency", "Hold off on fertilizing until spring"],
    local_environment_factors: { region: "South Florida", current_temp: "78°F", humidity: "72%", daylight_hours: 10.5 },
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

function handleBeginnerGuidance(_body: Record<string, unknown>, startTime: number) {
  return {
    plant_name: "Pothos", difficulty_rating: "beginner-friendly",
    quick_tips: ["Water when soil feels dry to touch", "Thrives in indirect light, tolerates low light", "Nearly impossible to kill!"],
    common_mistakes_to_avoid: ["Overwatering", "Direct sunlight (causes leaf burn)", "Cold drafts near windows"],
    success_indicators: ["New leaf growth", "Glossy, vibrant leaves", "Trailing vines getting longer"],
    encouragement: "You've got this! Pothos are incredibly forgiving plants perfect for beginners.",
    _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime, api_version: "1.2.0" }
  };
}

// ─── Router ─────────────────────────────────────────────────────────
const ENDPOINT_MAP: Record<string, (body: Record<string, unknown>, startTime: number) => unknown> = {
  "get-soil-data": handleGetSoilData,
  "county-lookup": handleCountyLookup,
  "territorial-water-quality": handleTerritorialWaterQuality,
  "territorial-water-analytics": handleTerritorialWaterAnalytics,
  "multi-parameter-planting-calendar": handleMultiParameterPlantingCalendar,
  "live-agricultural-data": handleLiveAgriculturalData,
  "environmental-impact-engine": handleEnvironmentalImpactEngine,
  "alpha-earth-environmental-enhancement": handleAlphaEarthEnhancement,
  "agricultural-intelligence": handleAgriculturalIntelligence,
  "seasonal-planning-assistant": handleSeasonalPlanningAssistant,
  "smart-report-summary": handleSmartReportSummary,
  "carbon-credit-calculator": handleCarbonCreditCalculator,
  "leafengines-query": handleLeafEnginesQuery,
  "visual-crop-analysis": handleVisualCropAnalysis,
  "safe-identification": handleSafeIdentification,
  "dynamic-care": handleDynamicCare,
  "beginner-guidance": handleBeginnerGuidance,
};

serve(async (req: Request) => {
  const startTime = Date.now();

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ── Auth ────────────────────────────────────────────────────────
  const apiKey = extractApiKey(req);
  const auth = validateApiKey(apiKey);

  if (!auth.valid) {
    return new Response(JSON.stringify({ error: 'Unauthorized', message: auth.error }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Rate limit ──────────────────────────────────────────────────
  const rl = checkRateLimit(apiKey!);
  const rlHeaders = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(rl.reset),
  };

  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded', retry_after_seconds: rl.reset - Math.floor(Date.now() / 1000) }), {
      status: 429,
      headers: { ...corsHeaders, ...rlHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'leafengines-query';

    let body: Record<string, unknown> = {};
    if (req.method === 'POST') {
      try { body = await req.json(); } catch { body = {}; }
    }

    console.log(`[Sandbox] ${auth.tier} | ${endpoint} | key=${apiKey!.substring(0, 14)}...`);

    const handler = ENDPOINT_MAP[endpoint];
    if (!handler) {
      return new Response(JSON.stringify({
        error: "Unknown endpoint",
        available_endpoints: Object.keys(ENDPOINT_MAP),
        _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime }
      }), {
        status: 404,
        headers: { ...corsHeaders, ...rlHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = handler(body, startTime);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        ...rlHeaders,
        'Content-Type': 'application/json',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-Response-Time-Ms': String(Date.now() - startTime),
        'X-Demo-Mode': 'true',
        'X-Sandbox-Tier': auth.tier,
      },
    });
  } catch (error) {
    console.error('[Sandbox] Error:', error);
    return new Response(JSON.stringify({
      error: 'Sandbox error',
      message: error instanceof Error ? error.message : 'Unknown error',
      _metadata: { demo_mode: true, response_time_ms: Date.now() - startTime }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
