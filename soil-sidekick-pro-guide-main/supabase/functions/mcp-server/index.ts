// LeafEngines MCP Server with Claude-optimized descriptions
// Updated: March 24, 2026 - Added tier pricing and Claude-specific context

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { CircuitBreaker, safeExternalCall, withFallback } from '../_shared/graceful-degradation.ts'
import { APICacheManager } from '../_shared/api-cache-manager.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Updated tool descriptions for Claude with tier pricing
const tools = [
  {
    name: "get_soil_data",
    description: "COMMODITIZED TIER ($0.001/call): Get USDA SSURGO soil analysis for any US county. Returns pH, nutrients (N-P-K), organic matter %, drainage class, and soil texture. Perfect for Claude when you need: agricultural planning, environmental assessments, land evaluation, or basic soil composition data. Example: 'What's the soil pH in Travis County, Texas?'",
    inputSchema: {
      type: "object",
      properties: {
        county_fips: {
          type: "string",
          pattern: "^[0-9]{5}$",
          description: "5-digit US county FIPS code (e.g., '48453' for Travis County, TX)"
        }
      },
      required: ["county_fips"]
    }
  },
  {
    name: "county_lookup",
    description: "COMMODITIZED TIER ($0.001/call): Resolve US location names to FIPS codes. Search by county name, state, or FIPS code. Returns county details needed for other LeafEngines tools. Use when Claude needs to: convert 'Travis County, Texas' to FIPS 48453, find counties by partial name, or validate location before soil/water analysis.",
    inputSchema: {
      type: "object",
      properties: {
        term: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          description: "Search term — county name, state name, or partial FIPS code (e.g., 'Miami-Dade', 'Georgia', '13')"
        }
      },
      required: ["term"]
    }
  },
  {
    name: "agricultural_intelligence",
    description: "ENHANCED TIER ($0.003/call): AI-powered agricultural insights combining soil, climate, and crop science. Get planting recommendations, yield predictions, risk assessments, and sustainability scores. Perfect for Claude when helping with: crop planning, farm management decisions, agricultural consulting, or sustainability assessments. Example: 'What's the best corn variety for Travis County, TX?'",
    inputSchema: {
      type: "object",
      properties: {
        county_fips: {
          type: "string",
          pattern: "^[0-9]{5}$",
          description: "5-digit US county FIPS code"
        },
        crop_type: {
          type: "string",
          description: "Crop to analyze (e.g., 'corn', 'soybeans', 'wheat', 'cotton')"
        },
        question: {
          type: "string",
          description: "Specific agricultural question to answer"
        }
      },
      required: ["county_fips"]
    }
  },
  {
    name: "territorial_water_quality",
    description: "COMMODITIZED TIER ($0.001/call): Get EPA water quality data for US counties. Returns contamination risk scores, water body proximity, and parameter readings. Use when Claude needs: environmental impact assessments, regulatory compliance checks, water safety analysis, or land development planning.",
    inputSchema: {
      type: "object",
      properties: {
        county_fips: {
          type: "string",
          pattern: "^[0-9]{5}$",
          description: "5-digit US county FIPS code"
        }
      },
      required: ["county_fips"]
    }
  },
  {
    name: "safe_identification",
    description: "ENHANCED TIER ($0.003/call): Identify plants with toxic lookalike warnings. Get safety alerts, confidence scores, and habitat info. Essential for Claude when: helping foragers avoid dangerous plants, identifying field specimens, creating plant guides, or educational content about local flora.",
    inputSchema: {
      type: "object",
      properties: {
        plant_name: {
          type: "string",
          description: "Common or scientific plant name to identify"
        },
        location: {
          type: "string",
          description: "Geographic context (state, region, or coordinates)"
        }
      },
      required: ["plant_name"]
    }
  },
  {
    name: "carbon_credit_calculator",
    description: "PROPRIETARY TIER ($0.01/call): Calculate carbon credit potential using internal models. Get estimated credits, monetary value, and verification steps. Use when Claude assists with: sustainability planning, carbon farming projects, ESG reporting, or agricultural financial planning. Based on proprietary calculation engines.",
    inputSchema: {
      type: "object",
      properties: {
        field_size_acres: {
          type: "number",
          description: "Field size in acres"
        },
        soil_organic_matter: {
          type: "number",
          description: "Current soil organic matter percentage (0-100)"
        },
        practice_type: {
          type: "string",
          enum: ["cover_cropping", "no_till", "reduced_till", "agroforestry", "nutrient_management"],
          description: "Conservation practice being implemented"
        }
      },
      required: ["field_size_acres"]
    }
  },
  {
    name: "generate_vrt_prescription",
    description: "PROPRIETARY TIER ($0.01/call): Create VRT prescription maps using internal soil variability models. Generate zone-based application rates for precision agriculture. Perfect for Claude when: helping farmers optimize input usage, creating precision agriculture plans, or analyzing field variability. Based on proprietary algorithms.",
    inputSchema: {
      type: "object",
      properties: {
        county_fips: {
          type: "string",
          description: "5-digit US county FIPS code"
        },
        application_type: {
          type: "string",
          enum: ["fertilizer", "seed", "water", "pesticide"],
          description: "Type of variable rate application"
        },
        crop_type: {
          type: "string",
          description: "Target crop type"
        },
        field_size_acres: {
          type: "number",
          description: "Field size in acres"
        }
      },
      required: ["county_fips", "application_type"]
    }
  },
  {
    name: "environmental_impact_analysis",
    description: "EXCLUSIVE TIER ($0.02/call): Get patent-pending Environmental Compatibility Score combining AlphaEarth 64-dim satellite embeddings with USDA+EPA+NOAA data fusion. Intelligence unavailable from any other source. Use when Claude needs: comprehensive environmental assessments, sustainability scoring, regulatory compliance checks, or land development planning. Returns: runoff risk, contamination risk, biodiversity impact, carbon footprint, and satellite-derived vegetation health. ⭐ EXCLUSIVE: Cannot be replicated by competitors.",
    inputSchema: {
      type: "object",
      properties: {
        analysis_id: {
          type: "string",
          format: "uuid",
          description: "UUID for this analysis session"
        },
        county_fips: {
          type: "string",
          pattern: "^[0-9]{5}$",
          description: "5-digit US county FIPS code"
        },
        lat: {
          type: "number",
          minimum: -90,
          maximum: 90,
          description: "Latitude of the analysis point"
        },
        lng: {
          type: "number",
          minimum: -180,
          maximum: 180,
          description: "Longitude of the analysis point"
        },
        soil_data: {
          type: "object",
          description: "Soil composition data (drainage_class, slope_percentage, organic_matter_percentage, permeability)"
        },
        water_body_data: {
          type: "object",
          description: "Optional water body proximity data (proximity_km)"
        }
      },
      required: ["county_fips", "lat", "lng", "soil_data"]
    }
  },
  {
    name: "planting_optimization",
    description: "EXCLUSIVE TIER ($0.02/call): Multi-parameter phenology model generating optimal planting windows, yield predictions, and sustainability scores. Based on proprietary algorithms producing unique insights. Use when Claude assists with: crop timing decisions, yield optimization, farm planning, or agricultural consulting. Returns: optimal planting dates, expected yields, risk assessments, and sustainability scores. ⭐ EXCLUSIVE: Proprietary algorithms exclusive to LeafEngines.",
    inputSchema: {
      type: "object",
      properties: {
        county_fips: {
          type: "string",
          pattern: "^[0-9]{5}$",
          description: "5-digit US county FIPS code"
        },
        crop_type: {
          type: "string",
          description: "Crop to optimize planting for (e.g., 'corn', 'soybeans', 'wheat')"
        },
        field_size_acres: {
          type: "number",
          description: "Field size in acres for yield estimation"
        },
        planting_year: {
          type: "integer",
          description: "Target planting year"
        }
      },
      required: ["county_fips", "crop_type"]
    }
  }
]

// L0.2 + L0.3: Initialize caching and circuit breakers
const cacheManager = new APICacheManager(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

// Circuit breakers for downstream edge functions
const circuitBreakers: Record<string, CircuitBreaker> = {
  'get-soil-data': new CircuitBreaker(5, 60000, 30000),
  'county-lookup': new CircuitBreaker(5, 60000, 30000),
  'territorial-water-quality': new CircuitBreaker(5, 60000, 30000),
  'agricultural-intelligence': new CircuitBreaker(3, 60000, 30000),
  'safe-identification': new CircuitBreaker(3, 60000, 30000),
  'carbon-credit-calculator': new CircuitBreaker(3, 120000, 60000),
  'generate-vrt-prescription': new CircuitBreaker(3, 120000, 60000),
  'environmental-impact-engine': new CircuitBreaker(3, 120000, 60000),
  'multi-parameter-planting-calendar': new CircuitBreaker(3, 120000, 60000),
};

// Data tools (commoditized tier) — cached
const CACHED_DATA_TOOLS = new Set(['get_soil_data', 'county_lookup', 'territorial_water_quality']);

// LLM-dependent tools — use openai circuit breaker
const LLM_TOOLS = new Set(['agricultural_intelligence', 'safe_identification']);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { method, params, id } = await req.json()

    // Handle tools/list request
    if (method === 'tools/list') {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { tools }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Handle tools/call request
    if (method === 'tools/call') {
      const { name, arguments: args } = params
      const apiKey = req.headers.get('x-api-key')

      if (!apiKey) {
 // Dual-meter rate limits for free-tier (no API key)
 const FREE_TIER_LIMITS = {
 data: { daily: 20, label: 'data calls' }, // county-lookup, get-soil-data, territorial-water-quality
 ai: { daily: 5, label: 'AI calls' }, // agricultural-intelligence, safe-identification
 identification: { daily: 3, label: 'identifications' }, // safe-identification specifically
 };

 const FREE_TIER_DATA_TOOLS = new Set([
 'county_lookup',
 'get_soil_data',
 'territorial_water_quality',
 ]);

 const FREE_TIER_AI_TOOLS = new Set([
 'agricultural_intelligence',
 'safe_identification',
 ]);

 // Check if tool is available for free-tier
 const isDataTool = FREE_TIER_DATA_TOOLS.has(name);
 const isAITool = FREE_TIER_AI_TOOLS.has(name);
 const isIdentification = name === 'safe_identification';

 if (!isDataTool && !isAITool) {
 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 error: {
 code: -32600,
 message: 'This tool requires an API key. Get one free at https://soilsidekick.com/api-keys'
 }
 }),
 {
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 status: 401,
 }
 );
 }

 // Provision a service-side client for free-tier calls
 const supabaseFree = createClient(
 Deno.env.get('SUPABASE_URL')!,
 Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
 );

 // Dual-meter check: use a session-based key derived from IP or a temporary UUID
 // For MCP (no session context), use a per-request approach — each no-key request
 // gets metered via a transient free-tier key stored in api_keys
 // TODO: T1.2 will add telegram_link-based metering; for now, use IP + daily window
 const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
 const freeTierKey = `free-${clientIp}-${new Date().toISOString().slice(0, 10)}`;

 // Check existing usage for this free-tier session
 const { data: existingUsage } = await supabaseFree
 .from('api_keys')
 .select('daily_ai_count, daily_data_count')
 .eq('key_value', freeTierKey)
 .single();

 const currentAiCount = existingUsage?.daily_ai_count || 0;
 const currentDataCount = existingUsage?.daily_data_count || 0;

 // Enforce limits
 if (isAITool) {
 if (isIdentification && currentAiCount >= FREE_TIER_LIMITS.identification.daily) {
 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 result: {
 content: [{
 type: 'text',
 text: JSON.stringify({
 _quota: {
 identifications_used: currentAiCount,
 identifications_limit: FREE_TIER_LIMITS.identification.daily,
 ai_calls_used: currentAiCount,
 ai_calls_limit: FREE_TIER_LIMITS.ai.daily,
 data_calls_remaining: FREE_TIER_LIMITS.data.daily - currentDataCount,
 },
 message: `${currentAiCount}/${FREE_TIER_LIMITS.identification.daily} identifications today. /soil still available! Upgrade at https://soilsidekick.com/api-keys`,
 }, null, 2)
 }]
 }
 }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
 );
 }
 if (currentAiCount >= FREE_TIER_LIMITS.ai.daily) {
 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 result: {
 content: [{
 type: 'text',
 text: JSON.stringify({
 _quota: {
 ai_calls_used: currentAiCount,
 ai_calls_limit: FREE_TIER_LIMITS.ai.daily,
 data_calls_remaining: FREE_TIER_LIMITS.data.daily - currentDataCount,
 },
 message: `${currentAiCount}/${FREE_TIER_LIMITS.ai.daily} AI calls today. Data tools (/county, /soil, /water) still available!`,
 }, null, 2)
 }]
 }
 }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
 );
 }
 }
 if (isDataTool && currentDataCount >= FREE_TIER_LIMITS.data.daily) {
 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 result: {
 content: [{
 type: 'text',
 text: JSON.stringify({
 _quota: {
 data_calls_used: currentDataCount,
 data_calls_limit: FREE_TIER_LIMITS.data.daily,
 },
 message: `${currentDataCount}/${FREE_TIER_LIMITS.data.daily} data calls today. Reset at midnight UTC. Get unlimited access at https://soilsidekick.com/api-keys`,
 }, null, 2)
 }]
 }
 }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
 );
 }

 // Execute real downstream call using server-side provisioned key
 const FREE_TIER_SERVER_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
 const functionMap: Record<string, string> = {
 'get_soil_data': 'get-soil-data',
 'county_lookup': 'county-lookup',
 'territorial_water_quality': 'territorial-water-quality',
 'agricultural_intelligence': 'agricultural-intelligence',
 'safe_identification': 'safe-identification',
 };
 const functionName = functionMap[name];
 if (!functionName) {
 return new Response(
 JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown tool: ${name}` } }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
 );
 }

 // Build args for downstream (reuse transform logic from authenticated path)
 let downstreamArgs = { ...args };
 if (name === 'agricultural_intelligence') {
 downstreamArgs = {
 query: args.question || args.query || `Analyze agriculture for FIPS ${args.county_fips || 'unknown'}`,
 context: { county_fips: args.county_fips, soil_data: args.soil_data, user_location: args.user_location },
 };
 } else if (name === 'safe_identification') {
 downstreamArgs = {
 image: args.image || '',
 location: typeof args.location === 'string'
 ? { county_fips: args.county_fips, user_location: args.location }
 : (args.location || { county_fips: args.county_fips }),
 use_case: args.use_case || 'scientific',
 additional_context: args.plant_name ? `Identify plant known as: ${args.plant_name}` : args.additional_context,
 };
 } else if (name === 'get_soil_data') {
 // Minimal transform — county_name/state_code not required for free-tier basic path
 downstreamArgs = {
 county_fips: args.county_fips,
 county_name: args.county_name || `County ${args.county_fips}`,
 state_code: args.state_code || '',
 };
 } else if (name === 'territorial_water_quality') {
 downstreamArgs = {
 fips_code: args.county_fips,
 state_code: args.state_code || '',
 admin_unit_name: args.admin_unit_name || args.county_name || `County ${args.county_fips}`,
 };
 }

 const { data: realData, error: callError } = await supabaseFree.functions.invoke(functionName, {
 body: downstreamArgs,
 headers: {
 'x-api-key': FREE_TIER_SERVER_KEY,
 'Authorization': `Bearer ${FREE_TIER_SERVER_KEY}`,
 },
 });

 if (callError) {
 console.error(`[free-tier] ${name} call failed:`, callError);
 return new Response(
 JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32603, message: `Service temporarily unavailable: ${callError.message}` } }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
 );
 }

 // Increment dual-meter counters
 const meterField = isAITool ? 'daily_ai_count' : 'daily_data_count';
 const currentCount = isAITool ? currentAiCount : currentDataCount;

 if (existingUsage) {
 await supabaseFree
 .from('api_keys')
 .update({ [meterField]: currentCount + 1 })
 .eq('key_value', freeTierKey);
 } else {
 await supabaseFree
 .from('api_keys')
 .insert({
 key_value: freeTierKey,
 subscription_tier: 'free',
 channel: 'mcp-free',
 daily_ai_count: isAITool ? 1 : 0,
 daily_data_count: isDataTool ? 1 : 0,
 monthly_alert_count: 0,
 last_reset_date: new Date().toISOString().slice(0, 10),
 });
 }

 // Return real data with dual-meter context
 const responseData = {
 ...realData,
 _meter: {
 [isAITool ? 'ai_calls' : 'data_calls']: (currentCount + 1),
 limit: isAITool ? FREE_TIER_LIMITS.ai.daily : FREE_TIER_LIMITS.data.daily,
 remaining: (isAITool ? FREE_TIER_LIMITS.ai.daily : FREE_TIER_LIMITS.data.daily) - (currentCount + 1),
 resets: 'midnight UTC',
 },
 };

 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 result: {
 content: [{
 type: 'text',
 text: JSON.stringify(responseData, null, 2)
 }]
 }
 }),
 { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
 );
 }

 // Forward to actual backend API
 const supabase = createClient(
 Deno.env.get('SUPABASE_URL')!,
 Deno.env.get('SUPABASE_ANON_KEY')!
 )

 // Separate client with service role key for telemetry writes (bypasses RLS)
 const supabaseTelemetry = createClient(
 Deno.env.get('SUPABASE_URL')!,
 Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
 )

 // Map MCP tool names to actual function names
      const functionMap: Record<string, string> = {
        'get_soil_data': 'get-soil-data',
        'county_lookup': 'county-lookup',
        'agricultural_intelligence': 'agricultural-intelligence',
        'territorial_water_quality': 'territorial-water-quality',
        'safe_identification': 'safe-identification',
        'carbon_credit_calculator': 'carbon-credit-calculator',
        'generate_vrt_prescription': 'generate-vrt-prescription',
        'environmental_impact_analysis': 'environmental-impact-engine',
        'planting_optimization': 'multi-parameter-planting-calendar'
      }

      const functionName = functionMap[name]
      if (!functionName) {
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Tool not found: ${name}`
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        )
      }

      // Transform MCP args to match downstream function schemas
      let transformedArgs = { ...args };
      if (name === 'agricultural_intelligence') {
        transformedArgs = {
          query: args.question || args.query || `Analyze agriculture for FIPS ${args.county_fips || 'unknown'}`,
          context: {
            county_fips: args.county_fips,
            soil_data: args.soil_data,
            user_location: args.user_location,
          },
          useGPT5: args.useGPT5 || false,
        };
      } else if (name === 'safe_identification') {
        // MCP sends: { plant_name, location (string) }
        // Edge function expects: { image, location (object), use_case }
        // For name-based identification (no image), set image to empty and use_case to default
        transformedArgs = {
          image: args.image || '',
          location: typeof args.location === 'string'
            ? { county_fips: args.county_fips, user_location: args.location }
            : (args.location || { county_fips: args.county_fips }),
          use_case: args.use_case || 'scientific',
          additional_context: args.plant_name
            ? `Identify plant known as: ${args.plant_name}`
            : args.additional_context,
        };
      } else if (name === 'get_soil_data') {
    // MCP sends: { county_fips }
    // Edge function expects (soilDataSchema): { county_fips, county_name, state_code, property_address?, force_refresh? }
    // county_name and state_code are required by the downstream Zod schema.
    // Try a county-lookup to resolve them; fall back to placeholder values if lookup fails.
    let resolvedCountyName = args.county_name || '';
    let resolvedStateCode = args.state_code || '';

    if (!resolvedCountyName || !resolvedStateCode) {
      try {
        const { data: lookupData, error: lookupError } = await supabase.functions.invoke('county-lookup', {
          body: { term: args.county_fips },
          headers: {
            'x-api-key': apiKey,
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!lookupError && lookupData?.results?.length > 0) {
          const best = lookupData.results[0];
          if (!resolvedCountyName) resolvedCountyName = best.county_name || '';
          if (!resolvedStateCode) resolvedStateCode = best.state_code || '';
        }
 } catch (lookupErr: any) {
 console.warn(`[get_soil_data transform] county-lookup failed for FIPS ${args.county_fips}:`, lookupErr);
      }
    }

    // Fallback: derive state_code from first 2 digits of FIPS (state FIPS prefix)
    if (!resolvedStateCode && args.county_fips) {
      // TODO: Add a full state-FIPS-to-code lookup table for robust resolution
      resolvedStateCode = '';
    }

 transformedArgs = {
 county_fips: args.county_fips,
 county_name: resolvedCountyName || `County ${args.county_fips}`,
 state_code: resolvedStateCode,
 property_address: args.property_address,
 force_refresh: args.force_refresh,
 };
 } else if (name === 'territorial_water_quality') {
 // L0.6: MCP sends: { county_fips }
 // Edge function expects (Zod schema): { fips_code, state_code, admin_unit_name }
 // Resolve via county-lookup, then fall back to FIPS-derived values.
 let resolvedStateCode = args.state_code || '';
 let resolvedAdminUnitName = args.admin_unit_name || args.county_name || '';

 if (!resolvedStateCode || !resolvedAdminUnitName) {
 try {
 const { data: lookupData, error: lookupError } = await supabase.functions.invoke('county-lookup', {
 body: { term: args.county_fips },
 headers: {
 'x-api-key': apiKey,
 'Authorization': `Bearer ${apiKey}`,
 },
 });
 if (!lookupError && lookupData?.results?.length > 0) {
 const best = lookupData.results[0];
 if (!resolvedStateCode) resolvedStateCode = best.state_code || '';
 if (!resolvedAdminUnitName) resolvedAdminUnitName = best.county_name || '';
 }
 } catch (lookupErr: any) {
 console.warn(`[territorial_water_quality transform] county-lookup failed for FIPS ${args.county_fips}:`, lookupErr);
 }
 }

 transformedArgs = {
 fips_code: args.county_fips,
 state_code: resolvedStateCode,
 admin_unit_name: resolvedAdminUnitName || `County ${args.county_fips}`,
 };
 } else if (name === 'environmental_impact_analysis') {
 // MCP sends: { county_fips, lat, lng, soil_data, water_body_data }
 // Edge function expects: { analysis_id, county_fips, soil_data, proposed_treatments }
 transformedArgs = {
          analysis_id: args.analysis_id || crypto.randomUUID(),
          county_fips: args.county_fips,
          soil_data: args.soil_data || {
            ph_level: 6.5,
            organic_matter: 2.8,
            slope: 3.5,
            drainage: 'well-drained',
            nitrogen_level: 'medium',
            phosphorus_level: 'medium',
          },
          proposed_treatments: args.proposed_treatments || [],
        };
 }

 // Call the actual function — pass API key as both x-api-key and Authorization Bearer
 // so downstream functions can authenticate via either method
 const callStart = Date.now();
 let data: any;
 let error: any;

 if (CACHED_DATA_TOOLS.has(name)) {
 // L0.2: Data tools — cache + circuit breaker
 const cacheKey = `${name}:${JSON.stringify(transformedArgs)}`;
 const breaker = circuitBreakers[functionName];
 try {
 const cacheResult = await cacheManager.getOrFetch(
 {
 provider: functionName,
 key: cacheKey,
 ttl: 3600000, // 1 hour cache for data tools
 staleWhileRevalidate: true,
 countyFips: transformedArgs.county_fips || transformedArgs.fips_code,
 },
 () => breaker.execute(async () => {
 const { data: d, error: e } = await supabase.functions.invoke(functionName, {
 body: transformedArgs,
 headers: {
 'x-api-key': apiKey,
 'Authorization': `Bearer ${apiKey}`,
 },
 });
 if (e) throw e;
 return d;
 })
 );
 data = cacheResult.data;
 } catch (err) {
 error = err;
 }
 } else if (LLM_TOOLS.has(name)) {
 // L0.3: LLM-dependent tools — openai circuit breaker with fallback
 try {
 data = await safeExternalCall('openai', async () => {
 const { data: d, error: e } = await supabase.functions.invoke(functionName, {
 body: transformedArgs,
 headers: {
 'x-api-key': apiKey,
 'Authorization': `Bearer ${apiKey}`,
 },
 });
 if (e) throw new Error(e.message);
 return d;
 }, async () => {
 // Fallback: return a graceful degradation message
 return {
 success: false,
 fallback: true,
 message: 'AI analysis temporarily unavailable. Please try again in a few minutes.',
 retry_after_seconds: 30,
 };
 });
 } catch (err) {
 error = err;
 }
 } else {
 // Non-cached, non-LLM tools — still use circuit breaker
 const breaker = circuitBreakers[functionName];
 try {
 const result = await breaker.execute(async () => {
 const { data: d, error: e } = await supabase.functions.invoke(functionName, {
 body: transformedArgs,
 headers: {
 'x-api-key': apiKey,
 'Authorization': `Bearer ${apiKey}`,
 },
 });
 if (e) throw new Error(e.message);
 return d;
 });
 data = result;
 } catch (err) {
 error = err;
 }
 }
 const callDuration = Date.now() - callStart;

 // Emit telemetry event for every tool call (server-side backfill)
 // This covers the 580+ installs that don't have the client SDK yet
 try {
 await supabaseTelemetry.from('client_telemetry_events').insert({
      event_id: crypto.randomUUID(),
      event_type: 'tool_call',
      event_name: `mcp:${name}`,
      timestamp: new Date().toISOString(),
      properties: {
        tool_name: name,
        function_name: functionName,
        duration_ms: callDuration,
        success: !error,
        error_message: error?.message || null,
        api_key_prefix: apiKey.substring(0, 8) + '...',
      },
      severity: error ? 'error' : 'info',
      session_id: id?.toString() || null,
      user_id: null,
      app_version: 'mcp-server-v100-L1',
      platform: 'mcp',
      created_at: new Date().toISOString(),
    });
  } catch (telemetryErr) {
    // Never fail the actual request because of telemetry
    console.error('Telemetry write failed:', telemetryErr);
  }

 if (error) {
 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 error: {
 code: -32603,
 message: `Function error: ${error.message}`
 }
 }),
 {
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 status: 500,
 }
 )
 }

 return new Response(
 JSON.stringify({
 jsonrpc: '2.0',
 id,
 result: {
 content: [
 {
 type: 'text',
 text: JSON.stringify(data, null, 2)
 }
 ]
 }
 }),
 {
 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
 status: 200,
 }
 )
 }

 // Unknown method
 return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: `Internal error: ${error.message}`
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})