import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { validateBearerToken, checkRateLimit, RateLimitStatus } from './oauth2.ts';

// Service-role client for audit logging (fire-and-forget, never blocks tool calls)
const auditClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

interface ToolCallAudit {
  api_key_hash?: string;
  source_ip?: string;
  user_agent?: string;
  tool_name: string;
  tool_arguments?: Record<string, unknown>;
  context_mode?: string;
  kv_cache_hint?: string;
  preferred_model_tier?: string;
  success: boolean;
  error_message?: string;
  response_status?: number;
  response_time_ms?: number;
  downstream_endpoint?: string;
  jsonrpc_id?: string;
  is_batch?: boolean;
  correlation_id?: string;
}

// ── PII / Sensitive Data Sanitization ───────────────────────────────
const SENSITIVE_KEYS = new Set(['lat', 'lng', 'latitude', 'longitude', 'email', 'name', 'address', 'phone', 'ssn', 'password', 'token', 'secret']);
const COORDINATE_KEYS = new Set(['lat', 'lng', 'latitude', 'longitude']);

function sanitizeArguments(args: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    const lk = key.toLowerCase();
    if (COORDINATE_KEYS.has(lk) && typeof value === 'number') {
      // Truncate coordinates to ~11km precision (1 decimal place)
      sanitized[key] = Math.round(value * 10) / 10;
    } else if (SENSITIVE_KEYS.has(lk) && typeof value === 'string') {
      sanitized[key] = `[REDACTED:${value.length}chars]`;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeArguments(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function logToolCall(entry: ToolCallAudit) {
  // Sanitize tool_arguments before persisting
  const sanitizedEntry = {
    ...entry,
    tool_arguments: entry.tool_arguments ? sanitizeArguments(entry.tool_arguments) : undefined,
  };
  auditClient.from('mcp_tool_call_log').insert(sanitizedEntry).then(
    () => {},
    (e: unknown) => console.error('[MCP-AUDIT]', e),
  );
  // Fire-and-forget telemetry to central telemetry-ingest pipeline
  sendTelemetry(sanitizedEntry);
}

function sendTelemetry(entry: ToolCallAudit) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  if (!supabaseUrl) return;
  const event = {
    surface: 'mcp',
    event_type: entry.success ? 'tool_call' : 'error',
    tool_name: entry.tool_name,
    latency_ms: entry.response_time_ms ?? 0,
    status_code: entry.response_status ?? (entry.success ? 200 : 500),
    error_message: entry.error_message ?? null,
    api_key_tier: null,
    api_key_prefix: entry.api_key_hash ? entry.api_key_hash.slice(0, 8) : null,
    metadata: {
      downstream_endpoint: entry.downstream_endpoint ?? 'unknown',
      jsonrpc_id: entry.jsonrpc_id ?? null,
      is_batch: entry.is_batch ?? false,
      correlation_id: entry.correlation_id ?? null,
      success: entry.success,
    },
  };
  fetch(`${supabaseUrl}/functions/v1/telemetry-ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(anonKey ? { 'apikey': anonKey } : {}),
    },
    body: JSON.stringify([event]),
  }).then(
    () => {},
    (e: unknown) => console.error('[MCP-TELEMETRY]', e),
  );
}

function hashKey(key: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(key + '_mcp_audit');
  let hash = 0;
  for (const byte of data) { hash = ((hash << 5) - hash) + byte; hash |= 0; }
  return 'mcp_' + Math.abs(hash).toString(36);
}

/**
 * LeafEngines™ MCP Server — Streamable HTTP Transport
 * 
 * Exposes core LeafEngines API endpoints as MCP-callable tools
 * for AI agents (Claude, GPT, Gemini, open-source models).
 * 
 * Protocol: MCP Streamable HTTP (JSON-RPC 2.0)
 * Auth: x-api-key header (same as regular API)
 * 
 * TurboQuant Integration (v1.1.0):
 *   - 3-bit KV cache quantization metadata exposed via initialize/capabilities
 *   - AI-powered tools accept optional context_mode & kv_cache_hint parameters
 *   - New `turbo_quant_capabilities` tool for runtime hardware profiling
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// ── TurboQuant Configuration ────────────────────────────────────────

const TURBOQUANT_CONFIG = {
  version: '1.0.0',
  kvCacheBits: 3,
  supportedModels: [
    { model: 'gemma-2b-it-onnx', minRamGB: 1, kvCacheGB: 0.5, tier: 'starter', contextTokens: 24000 },
    { model: 'gemma-7b-it', minRamGB: 4, kvCacheGB: 1.3, tier: 'professional', contextTokens: 24000 },
    { model: 'phi-4-mini', minRamGB: 4, kvCacheGB: 1.0, tier: 'professional', contextTokens: 16000 },
    { model: 'bitnet-70b', minRamGB: 8, kvCacheGB: 2.0, tier: 'enterprise', contextTokens: 48000 },
    { model: 'bitnet-100b', minRamGB: 12, kvCacheGB: 4.0, tier: 'enterprise', contextTokens: 48000 },
  ],
  contextModes: {
    standard: { description: 'Default context window (~5 messages, 4K tokens)', multiplier: 1 },
    extended: { description: 'TurboQuant-enabled extended context (~20 messages, 16K tokens)', multiplier: 4 },
    maximum: { description: 'Maximum context with KV cache persistence (~30 messages, 24K tokens)', multiplier: 6 },
  },
  runtimes: ['webgpu', 'wasm', 'native-cpp'],
  benefits: {
    memoryReduction: '6x',
    inferenceSpeedup: 'up to 8x',
    mobileViable: 'Gemma 7B on 4GB+ devices',
    offlineParity: 'Cloud-equivalent reasoning without connectivity',
  },
};

// ── TurboQuant-Aware Input Schema Extensions ────────────────────────

const turboQuantParams = {
  context_mode: {
    type: 'string',
    enum: ['standard', 'extended', 'maximum'],
    description: 'TurboQuant context window mode. "standard" = ~4K tokens (default). "extended" = ~16K tokens (requires TQ-enabled runtime). "maximum" = ~24K tokens with KV cache persistence.',
  },
  kv_cache_hint: {
    type: 'string',
    enum: ['none', 'reuse', 'persist'],
    description: 'KV cache strategy. "none" = fresh inference (default). "reuse" = reuse cached KV state for follow-up queries (40-60% faster). "persist" = persist KV cache across sessions for continuous analysis.',
  },
  preferred_model_tier: {
    type: 'string',
    enum: ['starter', 'professional', 'enterprise'],
    description: 'Preferred local model tier for offline inference. Agents can hint at desired reasoning depth; server selects best available model for the tier.',
  },
};

// ── Tool Definitions ────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'county_lookup',
    description: 'Search for US counties by name, state, or FIPS code. Returns matching counties with FIPS codes, state names, and state codes. **Use when**: the user provides a place name, state, or partial location instead of a 5-digit FIPS code. Most other tools require a FIPS code, so call this first to resolve it. **Do NOT use** if you already have a valid 5-digit FIPS code. **Output**: JSON array of matches with `fips_code`, `county_name`, `state_name`, `state_code`.',
    keywords: ['county', 'FIPS', 'location', 'geocode', 'state', 'US geography', 'place name', 'county search', 'FIPS lookup', 'geolocation'],
    inputSchema: {
      type: 'object',
      properties: {
        term: {
          type: 'string',
          minLength: 2,
          maxLength: 100,
          description: 'Search term — county name, state name, or partial FIPS code (e.g., "Miami-Dade", "Georgia", "13")'
        }
      },
      required: ['term']
    }
  },
  {
    name: 'get_soil_data',
    description: 'Retrieve USDA soil composition for a US county. Returns pH, N-P-K nutrients, organic matter %, drainage class, and texture. **Use when**: user asks about soil quality, land suitability, nutrient levels, or soil type for a specific location. **Do NOT use** for crop recommendations (use `agricultural_intelligence`) or environmental assessments (use `environmental_impact_analysis`). **Requires**: 5-digit FIPS code — call `county_lookup` first if you only have a place name. **Output**: JSON with numeric soil properties suitable for cross-county comparison.',
    keywords: ['soil', 'USDA', 'pH', 'nitrogen', 'phosphorus', 'potassium', 'NPK', 'organic matter', 'drainage', 'texture', 'soil test', 'land suitability', 'soil health', 'nutrient analysis'],
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          description: '5-digit US county FIPS code (e.g., "13121" for Fulton County, GA)'
        }
      },
      required: ['county_fips']
    }
  },
  {
    name: 'agricultural_intelligence',
    description: 'AI-powered agricultural analysis combining soil data, climate factors, and crop science. Provides planting recommendations, yield predictions, risk assessments, and sustainability scores. Supports TurboQuant extended context for multi-season analysis. **Use when**: user asks what to plant, expected yields, farming risks, or crop suitability for a location. **Do NOT use** for raw soil composition (use `get_soil_data`) or water quality (use `territorial_water_quality`). **Pair with**: `get_soil_data` for underlying soil details, `generate_vrt_prescription` for application rates. **TurboQuant**: Set `context_mode: "extended"` for multi-field comparisons; use `kv_cache_hint: "reuse"` for follow-up questions about the same county. **Requires**: county_fips (required), crop_type and question (optional). **Output**: JSON with recommendations, confidence scores, and data sources.',
    keywords: ['agriculture', 'crop recommendation', 'yield prediction', 'farming', 'agronomy', 'crop science', 'planting advice', 'risk assessment', 'sustainability', 'precision agriculture', 'AI farming', 'TurboQuant'],
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          description: '5-digit US county FIPS code'
        },
        crop_type: {
          type: 'string',
          description: 'Crop to analyze (e.g., "corn", "soybeans", "wheat", "cotton")'
        },
        question: {
          type: 'string',
          description: 'Specific agricultural question to answer'
        },
        ...turboQuantParams,
      },
      required: ['county_fips']
    }
  },
  {
    name: 'territorial_water_quality',
    description: 'Retrieve EPA water quality data for a US county. Returns contamination risk levels, water body proximity analysis, and parameter readings (nitrates, phosphorus, turbidity, etc.). **Use when**: user asks about water contamination, irrigation safety, drinking water risk, or environmental compliance for a location. **Do NOT use** for soil data (use `get_soil_data`) or broad environmental assessments (use `environmental_impact_analysis`). **Pair with**: `environmental_impact_analysis` for a complete environmental picture. **Requires**: 5-digit FIPS code. **Output**: JSON with risk categories, parameter readings, and regulatory context.',
    keywords: ['water quality', 'EPA', 'contamination', 'nitrates', 'phosphorus', 'turbidity', 'irrigation', 'drinking water', 'runoff', 'water testing', 'environmental compliance', 'Clean Water Act'],
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          description: '5-digit US county FIPS code'
        }
      },
      required: ['county_fips']
    }
  },
  {
    name: 'safe_identification',
    description: 'Identify a plant and flag toxic lookalikes with environmental context. Returns safety warnings, confidence scores, and habitat information. **Use when**: user asks to identify a plant, check if something is edible, or needs foraging safety information. **Do NOT use** for crop planning (use `agricultural_intelligence`). **Requires**: plant_name (required), location (optional for regional context). **Output**: JSON with identification, toxicity warnings, lookalike species, and confidence scores.',
    keywords: ['plant identification', 'plant ID', 'toxic plants', 'edible plants', 'foraging', 'poisonous', 'lookalike species', 'botany', 'plant safety', 'mushroom identification', 'wild plants'],
    inputSchema: {
      type: 'object',
      properties: {
        plant_name: {
          type: 'string',
          description: 'Common or scientific plant name to identify'
        },
        location: {
          type: 'string',
          description: 'Geographic context (state, region, or coordinates)'
        }
      },
      required: ['plant_name']
    }
  },
  {
    name: 'carbon_credit_calculator',
    description: 'Calculate carbon credit potential for agricultural land based on field size, soil organic matter, and farming practices. Returns estimated credits (tonnes CO₂e), monetary value ($USD), verification timeline, and registry requirements. **Use when**: user asks about carbon credits, carbon offset revenue, sustainability incentives, or conservation practice ROI. **Do NOT use** for general environmental assessment (use `environmental_impact_analysis`). **Pair with**: `get_soil_data` to obtain current organic matter %. **Requires**: field_size_acres (required), soil_organic_matter and practice_type (optional). **Output**: JSON with credit estimates, dollar values, and verification steps.',
    keywords: ['carbon credits', 'carbon offset', 'CO2', 'greenhouse gas', 'sustainability', 'cover cropping', 'no-till', 'agroforestry', 'carbon sequestration', 'Verra', 'Gold Standard', 'climate finance', 'ESG'],
    inputSchema: {
      type: 'object',
      properties: {
        field_size_acres: {
          type: 'number',
          description: 'Field size in acres'
        },
        soil_organic_matter: {
          type: 'number',
          description: 'Current soil organic matter percentage (0-100)'
        },
        practice_type: {
          type: 'string',
          enum: ['cover_cropping', 'no_till', 'reduced_till', 'agroforestry', 'nutrient_management'],
          description: 'Conservation practice being implemented'
        }
      },
      required: ['field_size_acres']
    }
  },
  {
    name: 'generate_vrt_prescription',
    description: 'Generate a variable rate technology (VRT) prescription map for precision agriculture. Creates zone-based application rates for fertilizer, seed, water, or pesticide based on soil variability across a field. **Use when**: user asks about precision application, variable rate seeding/fertilizing, or zone-based field management. **Do NOT use** for general crop advice (use `agricultural_intelligence`). **Pair with**: `get_soil_data` for soil baseline, `agricultural_intelligence` for crop-specific context. **Requires**: county_fips + application_type (required), crop_type and field_size_acres (optional). **Output**: JSON with zone boundaries, per-zone rates, rate units, and estimated input savings.',
    keywords: ['VRT', 'variable rate', 'prescription map', 'precision agriculture', 'fertilizer rate', 'seeding rate', 'zone management', 'ISOBUS', 'site-specific management', 'input optimization'],
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: {
          type: 'string',
          description: '5-digit US county FIPS code'
        },
        application_type: {
          type: 'string',
          enum: ['fertilizer', 'seed', 'water', 'pesticide'],
          description: 'Type of variable rate application'
        },
        crop_type: {
          type: 'string',
          description: 'Target crop type'
        },
        field_size_acres: {
          type: 'number',
          description: 'Field size in acres'
        }
      },
      required: ['county_fips', 'application_type']
    }
  },
  {
    name: 'environmental_impact_analysis',
    description: 'Patent-pending multi-source environmental impact assessment. Fuses USDA soil data, EPA water quality, NOAA climate data, and Google AlphaEarth satellite embeddings (64-dim Geo Foundation Model vectors at 10m resolution) into Environmental Compatibility Scores unavailable from any single public data source. Supports TurboQuant extended context for full-season environmental history in a single pass. Returns: runoff_risk (0-100), contamination_risk (low/med/high), biodiversity_impact, carbon_footprint_score, and satellite-derived vegetation health. **Use when**: user needs environmental due diligence, land purchase evaluation, regulatory pre-screening, or comprehensive site assessment. **Do NOT use** for soil-only queries (use `get_soil_data`) or water-only queries (use `territorial_water_quality`). **TurboQuant**: Set `context_mode: "maximum"` for multi-year trend analysis; use `kv_cache_hint: "persist"` for ongoing monitoring sessions. **Pair with**: `get_soil_data` for raw soil inputs, `territorial_water_quality` for water-specific detail, `carbon_credit_calculator` for monetization. **Requires**: county_fips + lat + lng + soil_data (required). **Output**: JSON with composite scores, risk categories, satellite health indices, and eco-friendly alternatives.',
    keywords: ['environmental impact', 'EIA', 'due diligence', 'satellite', 'AlphaEarth', 'NDVI', 'runoff risk', 'biodiversity', 'contamination', 'land evaluation', 'site assessment', 'NEPA', 'sensor fusion', 'remote sensing', 'GIS', 'TurboQuant'],
    inputSchema: {
      type: 'object',
      properties: {
        analysis_id: {
          type: 'string',
          format: 'uuid',
          description: 'UUID for this analysis session'
        },
        county_fips: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          description: '5-digit US county FIPS code'
        },
        lat: {
          type: 'number',
          minimum: -90,
          maximum: 90,
          description: 'Latitude of the analysis point'
        },
        lng: {
          type: 'number',
          minimum: -180,
          maximum: 180,
          description: 'Longitude of the analysis point'
        },
        soil_data: {
          type: 'object',
          description: 'Soil composition data (drainage_class, slope_percentage, organic_matter_percentage, permeability)'
        },
        water_body_data: {
          type: 'object',
          description: 'Optional water body proximity data (proximity_km)'
        },
        ...turboQuantParams,
      },
      required: ['county_fips', 'lat', 'lng', 'soil_data']
    }
  },
  {
    name: 'planting_optimization',
    description: 'AI-powered multi-parameter planting calendar that fuses soil composition, historical climate patterns, frost date models, and crop-specific phenology to generate optimal planting windows, yield predictions, sustainability scores, and risk assessments. Supports TurboQuant extended context for full-season history analysis. Returns proprietary timing recommendations unavailable from standard agricultural extension data. **Use when**: user asks when to plant, optimal planting dates, growing season timing, or yield forecasts for a specific crop and location. **Do NOT use** for general crop advice without timing focus (use `agricultural_intelligence`) or soil-only queries (use `get_soil_data`). **TurboQuant**: Set `context_mode: "extended"` for multi-crop rotation analysis; use `kv_cache_hint: "reuse"` for iterative planting scenario modeling. **Pair with**: `get_soil_data` for soil context, `carbon_credit_calculator` for sustainability ROI. **Requires**: county_fips + crop_type (required), field_size_acres and planting_year (optional). **Output**: JSON with optimal_window (start/end dates), yield_prediction (bushels/acre), sustainability_score (0-100), risk_factors array, and alternative crop suggestions.',
    keywords: ['planting calendar', 'planting date', 'frost date', 'growing season', 'phenology', 'yield forecast', 'crop timing', 'GDD', 'growing degree days', 'season planning', 'climate adaptation', 'TurboQuant'],
    inputSchema: {
      type: 'object',
      properties: {
        county_fips: {
          type: 'string',
          pattern: '^[0-9]{5}$',
          description: '5-digit US county FIPS code'
        },
        crop_type: {
          type: 'string',
          description: 'Crop to optimize planting for (e.g., "corn", "soybeans", "wheat")'
        },
        field_size_acres: {
          type: 'number',
          description: 'Field size in acres for yield estimation'
        },
        planting_year: {
          type: 'integer',
          description: 'Target planting year'
        },
        ...turboQuantParams,
      },
      required: ['county_fips', 'crop_type']
    }
  },
  {
    name: 'turbo_quant_capabilities',
    description: 'Query TurboQuant runtime capabilities, supported model tiers, memory profiles, and context window configurations. Returns hardware requirements for each model tier, available context modes, and performance benchmarks. **Use when**: agent needs to determine which model tier or context mode to request for a given hardware profile, or to display TurboQuant availability to end users. **Do NOT use** for agricultural data queries. **No authentication required**. **Output**: JSON with supported models (RAM requirements, KV cache sizes, context token limits), context modes, runtime options, and performance benefits.',
    keywords: ['TurboQuant', 'capabilities', 'hardware', 'model tier', 'KV cache', 'context window', 'memory profile', 'runtime', 'WebGPU', 'WASM', 'offline', 'performance', 'benchmarks'],
    inputSchema: {
      type: 'object',
      properties: {
        device_ram_gb: {
          type: 'number',
          description: 'Available device RAM in GB. If provided, response filters to models that fit within this constraint.',
        },
        runtime: {
          type: 'string',
          enum: ['webgpu', 'wasm', 'native-cpp', 'all'],
          description: 'Filter capabilities by runtime environment. Default: "all".',
        },
      },
      required: []
    }
  }
];

// ── Tool Name Aliases (LLM hallucination patterns) ─────────────────
const TOOL_ALIASES: Record<string, string> = {
  analyze_soil: 'get_soil_data',
  soil_analysis: 'get_soil_data',
  soil_data: 'get_soil_data',
  soil_lookup: 'get_soil_data',
  water_quality: 'territorial_water_quality',
  plant_id: 'safe_identification',
  plant_identification: 'safe_identification',
  carbon_credits: 'carbon_credit_calculator',
  carbon_offset: 'carbon_credit_calculator',
  vrt_prescription: 'generate_vrt_prescription',
  environmental_impact: 'environmental_impact_analysis',
  environmental_assessment: 'environmental_impact_analysis',
  planting_calendar: 'planting_optimization',
  planting_date: 'planting_optimization',
};

// Normalize tool names (resolve aliases to canonical names)
function normalizeToolName(toolName: string): string {
  return TOOL_ALIASES[toolName] || toolName;
}

// ── Endpoint Mapping ────────────────────────────────────────────────

const TOOL_TO_ENDPOINT: Record<string, string> = {
  get_soil_data: 'get-soil-data',
  county_lookup: 'county-lookup',
  agricultural_intelligence: 'agricultural-intelligence',
  territorial_water_quality: 'territorial-water-quality',
  safe_identification: 'safe-identification',
  carbon_credit_calculator: 'carbon-credit-calculator',
  generate_vrt_prescription: 'generate-vrt-prescription',
  environmental_impact_analysis: 'alpha-earth-environmental-enhancement',
  planting_optimization: 'multi-parameter-planting-calendar',
};

// ── TurboQuant Capabilities Handler ─────────────────────────────────

function handleTurboQuantCapabilities(args: Record<string, unknown>) {
  const deviceRam = args.device_ram_gb as number | undefined;
  const runtime = (args.runtime as string) ?? 'all';

  let models = TURBOQUANT_CONFIG.supportedModels;

  // Filter by device RAM if provided
  if (deviceRam && deviceRam > 0) {
    models = models.filter(m => m.minRamGB <= deviceRam);
  }

  // Filter by runtime
  const runtimeCompatibility: Record<string, string[]> = {
    webgpu: ['gemma-2b-it-onnx', 'gemma-7b-it', 'phi-4-mini'],
    wasm: ['gemma-2b-it-onnx', 'gemma-7b-it', 'phi-4-mini'],
    'native-cpp': ['gemma-2b-it-onnx', 'gemma-7b-it', 'phi-4-mini', 'bitnet-70b', 'bitnet-100b'],
  };

  if (runtime !== 'all' && runtimeCompatibility[runtime]) {
    const compatibleModels = runtimeCompatibility[runtime];
    models = models.filter(m => compatibleModels.includes(m.model));
  }

  // Build recommended model
  const recommended = deviceRam
    ? models.reduce((best, m) => (m.minRamGB <= deviceRam && m.minRamGB > (best?.minRamGB ?? 0) ? m : best), models[0])
    : null;

  return {
    turboQuant: {
      version: TURBOQUANT_CONFIG.version,
      kvCacheBits: TURBOQUANT_CONFIG.kvCacheBits,
      compressionRatio: '16-bit → 3-bit (5.3x reduction)',
    },
    supportedModels: models.map(m => ({
      ...m,
      kvCacheDescription: `${m.kvCacheGB} GB with 3-bit TurboQuant (was ~${(m.kvCacheGB * 5.3).toFixed(1)} GB at 16-bit)`,
      runtimes: runtime === 'all'
        ? Object.entries(runtimeCompatibility)
            .filter(([, v]) => v.includes(m.model))
            .map(([k]) => k)
        : [runtime],
    })),
    contextModes: TURBOQUANT_CONFIG.contextModes,
    runtimes: runtime === 'all' ? TURBOQUANT_CONFIG.runtimes : [runtime],
    benefits: TURBOQUANT_CONFIG.benefits,
    recommendation: recommended
      ? {
          model: recommended.model,
          tier: recommended.tier,
          reason: `Best model for ${deviceRam}GB RAM: ${recommended.model} (${recommended.tier} tier, ${recommended.kvCacheGB}GB KV cache, ${recommended.contextTokens} token context)`,
        }
      : null,
    sdkVersion: '2.2.0+',
    documentation: 'https://soil-sidekick-pro-guide.lovable.app/api-docs',
  };
}

// ── Local Preview Handlers (free tier, no downstream auth) ──────────

function handleSafeIdentificationPreview(args: Record<string, unknown>) {
  const plantName = String(args.plant_name ?? '').toLowerCase();
  const location = String(args.location ?? '');

  // Local toxic lookalike database (6 plants)
  const toxicDatabase: Record<string, unknown> = {
    'poison ivy': {
      identification: 'Toxicodendron radicans',
      toxic: true,
      symptoms: 'Itchy rash, blisters, swelling. Urushiol oil causes contact dermatitis.',
      lookalikes: ['Boxelder maple (Acer negundo) seedlings', 'Virginia creeper (Parthenocissus quinquefolia)'],
      differentiators: 'Boxelder: opposite leaf arrangement (poison ivy is alternate). Virginia creeper: 5 leaflets (poison ivy: 3).',
      confidence: 0.95,
      safety_note: 'DO NOT TOUCH. Wash exposed skin with soap and cool water within 30 minutes.',
      habitat: 'Wood edges, fence rows, disturbed areas across eastern and central US.',
    },
    'poison oak': {
      identification: 'Toxicodendron diversilobum (western) / T. pubescens (eastern)',
      toxic: true,
      symptoms: 'Itchy rash, blisters. Same urushiol oil as poison ivy.',
      lookalikes: ['Young blackberry (Rubus) canes', 'Fragrant sumac (Rhus aromatica)'],
      differentiators: 'Blackberry: thorns present (poison oak has no thorns). Fragrant sumac: 3 leaflets with rounded teeth (poison oak: smooth or lobed edges).',
      confidence: 0.92,
      safety_note: 'DO NOT TOUCH. Same treatment as poison ivy.',
      habitat: 'Pacific coast (western variety) or southeastern US (eastern variety).',
    },
    'poison sumac': {
      identification: 'Toxicodendron vernix',
      toxic: true,
      symptoms: 'Severe contact dermatitis, more potent than poison ivy.',
      lookalikes: ['Staghorn sumac (Rhus typhina)', 'Smooth sumac (Rhus glabra)'],
      differentiators: 'Staghorn/smooth sumac: red fuzzy fruit clusters, toothed leaflets, non-toxic. Poison sumac: white/green berries, smooth leaflets.',
      confidence: 0.94,
      safety_note: 'DO NOT TOUCH. Most toxic of the three. Seek medical attention if exposed.',
      habitat: 'Swampy, wet areas in eastern US. Rare.',
    },
    'water hemlock': {
      identification: 'Cicuta maculata',
      toxic: true,
      symptoms: 'Convulsions, seizures, death within 15 minutes if ingested. Most toxic plant in North America.',
      lookalikes: ['Wild parsnip (Pastinaca sativa)', 'Wild carrot / Queen Anne\'s lace (Daucus carota)'],
      differentiators: 'Wild parsnip: yellow flowers, grooved stems. Wild carrot: hairy stems, white flower with dark center. Water hemlock: smooth hollow stems with purple spots.',
      confidence: 0.96,
      safety_note: 'LETHAL IF INGESTED. Call Poison Control immediately: 1-800-222-1222.',
      habitat: 'Wet meadows, stream banks across North America.',
    },
    'deadly nightshade': {
      identification: 'Atropa belladonna',
      toxic: true,
      symptoms: 'Dilated pupils, blurred vision, rapid heartbeat, hallucinations, death.',
      lookalikes: ['Black nightshade (Solanum nigrum)', 'Garden huckleberry (Solanum melanocerasum)'],
      differentiators: 'Black nightshade: smaller, duller berries, less glossy leaves. Deadly nightshade: large glossy black berries, purple-tinged flowers.',
      confidence: 0.91,
      safety_note: 'ALL PARTS TOXIC. 2-5 berries can kill a child. Call Poison Control immediately.',
      habitat: 'Woodland edges, disturbed ground. Introduced in eastern US, rare.',
    },
    'foxglove': {
      identification: 'Digitalis purpurea',
      toxic: true,
      symptoms: 'Nausea, vomiting, irregular heartbeat, cardiac arrest. Source of digitalis (heart medication).',
      lookalikes: ['Penstemon (Penstemon digitalis)', 'Mullein (Verbascum thapsus)'],
      differentiators: 'Penstemon: similar tubular flowers but 5 stamens (foxglove: 4). Mullein: fuzzy leaves, yellow flowers on tall spike.',
      confidence: 0.93,
      safety_note: 'ALL PARTS TOXIC. Ingestion requires immediate medical attention.',
      habitat: 'Woodland clearings, roadside banks across northern and western US.',
    },
  };

  const result = toxicDatabase[plantName] ?? {
    identification: plantName,
    toxic: 'unknown',
    safety_note: 'Plant not in local safety database. Exercise caution: do not consume any wild plant without expert identification. Consult a local extension service or certified forager.',
    confidence: 0.5,
    _free_preview: true,
    _upgrade_url: 'https://soilsidekick.com/api-keys',
    location_context: location || null,
  };

  return {
    ...result,
    _free_preview: true,
    _upgrade_url: 'https://soilsidekick.com/api-keys',
    location_context: location || null,
  };
}

function handleWaterQualityPreview(args: Record<string, unknown>) {
  const countyFips = String(args.county_fips ?? '');
  return {
    preview: true,
    county_fips: countyFips,
    message: 'EPA water quality data requires a valid API key for county-specific analysis.',
    general_guidance: {
      well_water: 'Test annually for bacteria, nitrates, and pH. Use a certified lab.',
      surface_water: 'Check EPA Surf Your Watershed: https://www.epa.gov/surf',
      agricultural_runoff: 'Monitor nitrate and phosphorus levels near fields.',
      regulatory_compliance: 'Contact your county health department for local water quality reports.',
    },
    epa_resources: {
      safe_drinking_water: 'https://www.epa.gov/ground-water-and-drinking-water',
      water_quality_standards: 'https://www.epa.gov/wqs-tech',
      local_reports: `https://www.epa.gov/surf/yourwatershed?fips=${countyFips}`,
    },
    _free_preview: true,
    _upgrade_url: 'https://soilsidekick.com/api-keys',
  };
}

function handleCarbonCreditsPreview(args: Record<string, unknown>) {
  const fieldSize = Number(args.field_size_acres ?? 0);
  const soilOm = Number(args.soil_organic_matter ?? 0);
  const practice = String(args.practice_type ?? 'unknown');

  // Defensible rough estimate: 0.6 tCO2e/acre/year national average for cover cropping
  // Range: 0.3-1.2 depending on practice, soil, climate
  const baseRate = 0.6;
  const omMultiplier = soilOm > 0 ? Math.min(2.0, 1 + (soilOm / 10)) : 1.0;
  const practiceMultiplier: Record<string, number> = {
    cover_cropping: 1.0,
    no_till: 0.8,
    reduced_till: 0.5,
    agroforestry: 1.5,
    nutrient_management: 0.3,
  };
  const pm = practiceMultiplier[practice] ?? 1.0;

  const annualTons = fieldSize > 0 ? fieldSize * baseRate * omMultiplier * pm : 0;
  const pricePerTonne = 15; // National average
  const annualValue = annualTons * pricePerTonne;

  return {
    preview: true,
    estimate_type: 'rough_order_of_magnitude',
    disclaimer: 'This is a free preview estimate for planning purposes only. Actual credits require third-party verification (Verra VCS, Gold Standard, or Climate Action Reserve).',
    calculation: {
      field_size_acres: fieldSize,
      soil_organic_matter_pct: soilOm,
      practice_type: practice,
      base_sequestration_rate_tco2e_acre_year: baseRate,
      om_multiplier: omMultiplier,
      practice_multiplier: pm,
      estimated_annual_credits_tco2e: Math.round(annualTons * 10) / 10,
      estimated_price_per_tonne_usd: pricePerTonne,
      estimated_annual_value_usd: Math.round(annualValue * 100) / 100,
    },
    ranges: {
      conservative: Math.round(annualTons * 0.5 * 10) / 10,
      optimistic: Math.round(annualTons * 1.5 * 10) / 10,
    },
    next_steps: [
      '1. Sign a contract with a carbon credit developer or aggregator.',
      '2. Implement conservation practice for minimum period (usually 1-3 years).',
      '3. Hire a third-party verifier to measure and verify sequestration.',
      '4. Register credits with Verra VCS, Gold Standard, or CAR.',
      '5. Sell credits on voluntary carbon market or to corporate buyers.',
    ],
    verification_timeline: '12-36 months from practice start to credit issuance',
    _free_preview: true,
    _upgrade_url: 'https://soilsidekick.com/api-keys',
  };
}

// ── JSON-RPC Handler ────────────────────────────────────────────────

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

function jsonRpcResponse(id: string | number | null, result: unknown) {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

interface ReqMeta { ip?: string; userAgent?: string; isBatch?: boolean; correlationId?: string; }

async function handleRpc(req: JsonRpcRequest, apiKey: string | null, reqMeta?: ReqMeta): Promise<unknown> {
  const { method, params, id } = req;

  // ── initialize ──
  if (method === 'initialize') {
    return jsonRpcResponse(id ?? null, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: { listChanged: false },
        turboQuant: {
          enabled: true,
          version: TURBOQUANT_CONFIG.version,
          kvCacheBits: TURBOQUANT_CONFIG.kvCacheBits,
          contextModes: Object.keys(TURBOQUANT_CONFIG.contextModes),
          supportedTiers: ['starter', 'professional', 'enterprise'],
          benefits: TURBOQUANT_CONFIG.benefits,
        },
      },
      serverInfo: {
        name: 'leafengines-mcp',
        version: '1.1.0',
        description: 'Agricultural intelligence API fusing USDA, EPA, NOAA, and satellite data — now with TurboQuant 3-bit KV cache quantization for extended context windows (up to 24K tokens) and 6x memory reduction in offline/edge inference. Supports soil analysis, crop planning, water quality, carbon credits, and environmental impact assessments across all US counties.',
        keywords: [
          'agriculture', 'soil', 'USDA', 'EPA', 'NOAA', 'water quality', 'carbon credits',
          'precision agriculture', 'VRT', 'crop recommendation', 'yield prediction',
          'environmental impact', 'satellite', 'AlphaEarth', 'FIPS', 'county',
          'plant identification', 'sustainability', 'agronomy', 'GIS', 'remote sensing',
          'planting calendar', 'phenology', 'ESG', 'land evaluation', 'MCP',
          'TurboQuant', 'KV cache', '3-bit quantization', 'offline AI', 'edge inference',
        ],
        categories: ['agriculture', 'environmental', 'geospatial', 'sustainability', 'data-analysis', 'ai-optimization'],
        provider: 'LeafEngines™ by Soil Sidekick Pro',
        homepage: 'https://soilsidekick.com',
        documentation: 'https://soil-sidekick-pro-guide.lovable.app/api-docs',
      },
    });
  }

  // ── tools/list ──
  if (method === 'tools/list') {
    return jsonRpcResponse(id ?? null, { tools: TOOLS });
  }

  // ── tools/call ──
  if (method === 'tools/call') {
    const callStart = Date.now();
    const toolName = normalizeToolName((params as Record<string, unknown>)?.name as string);
    const rawToolArgs = (params as Record<string, unknown>)?.arguments as Record<string, unknown> ?? {};

    // ── Permissive parameter normalization ──
    // Map common FIPS synonyms used by AI agents → canonical `county_fips`.
    // Then validate shape (5-digit numeric) BEFORE forwarding downstream so we
    // return a clear JSON-RPC -32602 instead of a raw HTTP 400 from the edge fn.
    const toolArgs: Record<string, unknown> = { ...rawToolArgs };
    const FIPS_ALIASES = ['fips', 'geoid', 'county_geoid', 'fips_code', 'countyFips', 'county_id'];
    if (!toolArgs.county_fips) {
      for (const alias of FIPS_ALIASES) {
        if (toolArgs[alias] != null && toolArgs[alias] !== '') {
          toolArgs.county_fips = toolArgs[alias];
          delete toolArgs[alias];
          break;
        }
      }
    }
    // Coerce to string; pad numeric 4-digit FIPS (some states drop leading zero).
    if (toolArgs.county_fips != null) {
      let f = String(toolArgs.county_fips).trim();
      if (/^\d{4}$/.test(f)) f = '0' + f;
      toolArgs.county_fips = f;
    }

    // Tools that require a valid 5-digit county_fips. county_lookup is exempt
    // (it accepts free-form `term`); turbo_quant_capabilities and safe_identification too.
    const FIPS_REQUIRED_TOOLS = new Set([
      'get_soil_data', 'territorial_water_quality', 'agricultural_intelligence',
      'environmental_impact_engine', 'multi_parameter_planting_calendar',
      'generate_vrt_prescription', 'carbon_credit_calculator', 'leafengines_query',
    ]);
    if (FIPS_REQUIRED_TOOLS.has(toolName)) {
      const fips = toolArgs.county_fips;
      if (!fips || typeof fips !== 'string' || !/^\d{5}$/.test(fips)) {
        const errMsg = `Invalid county_fips: expected 5-digit US FIPS code (e.g. "13067"), received ${JSON.stringify(fips ?? null)}. Use the \`county_lookup\` tool first to resolve a place name to a FIPS code.`;
        logToolCall({
          api_key_hash: apiKey ? hashKey(apiKey) : undefined,
          source_ip: reqMeta?.ip,
          user_agent: reqMeta?.userAgent,
          tool_name: toolName,
          tool_arguments: toolArgs,
          jsonrpc_id: id != null ? String(id) : undefined,
          is_batch: reqMeta?.isBatch ?? false,
          correlation_id: reqMeta?.correlationId,
          success: false,
          response_status: 400,
          error_message: errMsg,
          response_time_ms: Date.now() - callStart,
        });
        return jsonRpcError(id ?? null, -32602, errMsg);
      }
    }



    const auditBase = {
      api_key_hash: apiKey ? hashKey(apiKey) : undefined,
      source_ip: reqMeta?.ip,
      user_agent: reqMeta?.userAgent,
      tool_name: toolName,
      tool_arguments: toolArgs,
      jsonrpc_id: id != null ? String(id) : undefined,
      is_batch: reqMeta?.isBatch ?? false,
      correlation_id: reqMeta?.correlationId,
    };

    // Handle turbo_quant_capabilities locally (no edge function needed)
    if (toolName === 'turbo_quant_capabilities') {
      const result = handleTurboQuantCapabilities(toolArgs);
      // Fire-and-forget audit log
      logToolCall({ ...auditBase, success: true, response_time_ms: Date.now() - callStart, downstream_endpoint: 'local' });
      return jsonRpcResponse(id ?? null, {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      });
    }

    const endpoint = TOOL_TO_ENDPOINT[toolName];
    if (!endpoint) {
      logToolCall({ ...auditBase, success: false, error_message: `Unknown tool: ${toolName}`, response_time_ms: Date.now() - callStart });
      return jsonRpcError(id ?? null, -32602, `Unknown tool: ${toolName}`);
    }

    // Free-tier tools that work without an API key
    const FULLY_FREE_TOOLS = ['county_lookup', 'get_soil_data'];
    const PREVIEW_TOOLS = ['safe_identification', 'territorial_water_quality', 'carbon_credit_calculator'];
    const FREE_TOOLS = [...FULLY_FREE_TOOLS, ...PREVIEW_TOOLS];
    const isFreeTool = FREE_TOOLS.includes(toolName);
    const isPreviewTool = PREVIEW_TOOLS.includes(toolName);

    if (!apiKey && !isFreeTool) {
      logToolCall({ ...auditBase, success: false, error_message: 'Missing x-api-key', response_time_ms: Date.now() - callStart });
      return jsonRpcError(id ?? null, -32000, 
        'Missing x-api-key header. Free tools available: county_lookup, get_soil_data, safe_identification, territorial_water_quality, carbon_credit_calculator. ' +
        'Upgrade at https://soilsidekick.com/api-keys for full access to all tools.');
    }

    // Strip TurboQuant hint params before forwarding (they're metadata, not endpoint args)
    const { context_mode, kv_cache_hint, preferred_model_tier, ...endpointArgs } = toolArgs;

    // Auto-resolve county_fips → county_name + state_code for ANY tool that needs it
    // Applied generically to ALL tools that accept county_fips parameter
    if (endpointArgs.county_fips && (!endpointArgs.county_name || !endpointArgs.state_code)) {
      try {
        const { data: countyRows } = await auditClient
          .from('counties')
          .select('county_name, state_code')
          .eq('fips_code', endpointArgs.county_fips)
          .limit(1);
        if (countyRows && countyRows.length > 0) {
          const county = countyRows[0];
          // Strip the ", State" suffix if present (e.g., "Fulton County, Georgia" → "Fulton County")
          const rawName = county.county_name;
          endpointArgs.county_name = endpointArgs.county_name || rawName.split(',')[0].trim();
          endpointArgs.state_code = endpointArgs.state_code || county.state_code;
          console.log(`Resolved FIPS ${endpointArgs.county_fips} → ${endpointArgs.county_name}, ${endpointArgs.state_code}`);
        }
      } catch (lookupErr) {
        console.warn('County FIPS resolution failed, forwarding as-is:', lookupErr);
      }
    }

    // Local preview handlers (free tier, no downstream auth needed)
    if (isPreviewTool && !apiKey) {
      let result;
      if (toolName === 'safe_identification') {
        result = handleSafeIdentificationPreview(endpointArgs);
      } else if (toolName === 'territorial_water_quality') {
        result = handleWaterQualityPreview(endpointArgs);
      } else if (toolName === 'carbon_credit_calculator') {
        result = handleCarbonCreditsPreview(endpointArgs);
      }
      if (result) {
        logToolCall({ ...auditBase, success: true, response_time_ms: Date.now() - callStart, downstream_endpoint: 'local-preview' });
        return jsonRpcResponse(id ?? null, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        });
      }
    }

    // Build TurboQuant metadata header for downstream functions
    const tqMeta: Record<string, string> = {};
    if (context_mode) tqMeta['x-tq-context-mode'] = String(context_mode);
    if (kv_cache_hint) tqMeta['x-tq-kv-cache-hint'] = String(kv_cache_hint);
    if (preferred_model_tier) tqMeta['x-tq-model-tier'] = String(preferred_model_tier);

    try {
      const fnUrl = `${SUPABASE_URL}/functions/v1/${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        ...tqMeta,
      };
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }
      if (isFreeTool && !apiKey) {
        headers['x-free-tier'] = 'true';
      }
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(endpointArgs),
      });

      // Safe response parsing - check content-type before .json()
      const contentType = res.headers.get('content-type') ?? '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `HTTP ${res.status}` };
      }
      const elapsed = Date.now() - callStart;

      if (!res.ok) {
        // Capture downstream body (truncated) so we can distinguish auth/validation/upstream failures
        let bodySnippet: string;
        try {
          bodySnippet = typeof data === 'string' ? data : JSON.stringify(data);
        } catch {
          bodySnippet = '[unserializable]';
        }
        if (bodySnippet.length > 500) bodySnippet = bodySnippet.slice(0, 500) + '…';
        const usedFreeTier = isFreeTool && !apiKey;
        const errMsg = `HTTP ${res.status} from ${endpoint} (free_tier=${usedFreeTier}, api_key=${apiKey ? 'present' : 'none'}): ${bodySnippet}`;
        logToolCall({
          ...auditBase, success: false, error_message: errMsg,
          response_status: res.status, response_time_ms: elapsed,
          downstream_endpoint: endpoint,
          context_mode: context_mode as string, kv_cache_hint: kv_cache_hint as string,
          preferred_model_tier: preferred_model_tier as string,
        });
        return jsonRpcResponse(id ?? null, {
          content: [{ type: 'text', text: `Error ${res.status}: ${JSON.stringify(data)}` }],
          isError: true,
        });
      }

      // Fire-and-forget audit log for success
      logToolCall({
        ...auditBase, success: true,
        response_status: res.status, response_time_ms: elapsed,
        downstream_endpoint: endpoint,
        context_mode: context_mode as string, kv_cache_hint: kv_cache_hint as string,
        preferred_model_tier: preferred_model_tier as string,
      });

      // Enrich response with TurboQuant metadata if TQ params were used
      const responseData = context_mode || kv_cache_hint
        ? {
            ...data,
            _turboQuant: {
              contextMode: context_mode ?? 'standard',
              kvCacheHint: kv_cache_hint ?? 'none',
              modelTier: preferred_model_tier ?? 'auto',
            },
          }
        : data;

      return jsonRpcResponse(id ?? null, {
        content: [{ type: 'text', text: JSON.stringify(responseData, null, 2) }],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logToolCall({
        ...auditBase, success: false, error_message: msg,
        response_time_ms: Date.now() - callStart, downstream_endpoint: endpoint,
        context_mode: context_mode as string, kv_cache_hint: kv_cache_hint as string,
        preferred_model_tier: preferred_model_tier as string,
      });
      return jsonRpcResponse(id ?? null, {
        content: [{ type: 'text', text: `Internal error: ${msg}` }],
        isError: true,
      });
    }
  }

  // ── notifications (no response needed) ──
  if (method === 'notifications/initialized' || method.startsWith('notifications/')) {
    return null; // no response for notifications
  }

  return jsonRpcError(id ?? null, -32601, `Method not found: ${method}`);
}

// ── Rate-limit header helper ───────────────────────────────────────
function buildHeaders(base: Record<string, string>, rateLimit?: RateLimitStatus): Record<string, string> {
  const h = { ...base };
  if (rateLimit) {
    h['X-RateLimit-Limit'] = String(rateLimit.limit);
    h['X-RateLimit-Remaining'] = String(rateLimit.remaining);
    h['X-RateLimit-Reset'] = String(rateLimit.reset);
    h['X-RateLimit-Window'] = rateLimit.window;
  }
  return h;
}

// ── HTTP Handler ────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Extract auth early so rate-limiting works for all paths
  const apiKeyHeader = req.headers.get('x-api-key');
  const authHeader = req.headers.get('authorization');
  let apiKey = apiKeyHeader;

  // OAuth2 bearer token fallback (Composio marketplace flow)
  if (!apiKey && authHeader?.startsWith('Bearer ')) {
    const oauth = await validateBearerToken(authHeader);
    if (oauth.apiKey) {
      apiKey = oauth.apiKey;
    }
  }

  // Rate-limit check (only for authenticated requests; free tools skip)
  let rateLimit: RateLimitStatus | undefined;
  if (apiKey) {
    rateLimit = await checkRateLimit(hashKey(apiKey));
  }

  // Correlation ID: use client-provided header or generate one per request
  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();
  const meta: ReqMeta = {
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
    correlationId,
  };

  // ── /_health endpoint (Composio compatibility) ─────────────────────────
  const url = new URL(req.url);
  if (url.pathname.endsWith('/_health') || url.pathname.endsWith('/health')) {
    return new Response(JSON.stringify({
      status: 'healthy',
      version: 'v88-oauth2',
      timestamp: new Date().toISOString(),
      uptime: 'ok',
    }), {
      headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }),
    });
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, accept',
      },
    });
  }

  // Only POST for MCP Streamable HTTP
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
      status: 405,
      headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, rateLimit),
    });
  }

  // Validate Accept header per MCP spec
  const accept = req.headers.get('accept') ?? '';
  if (!accept.includes('application/json') && !accept.includes('*/*')) {
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Not Acceptable: Client must accept application/json' }, id: null }),
      { status: 406, headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, rateLimit) }
    );
  }

  try {
    const body = await req.json();

    // Handle batch requests
    if (Array.isArray(body)) {
      const results = await Promise.all(body.map((r: JsonRpcRequest) => handleRpc(r, apiKey, { ...meta, isBatch: true })));
      const filtered = results.filter((r) => r !== null);
      return new Response(JSON.stringify(filtered), {
        headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, rateLimit),
      });
    }

    // Single request
    const result = await handleRpc(body as JsonRpcRequest, apiKey, meta);
    if (result === null) {
      return new Response(null, { status: 204, headers: buildHeaders(corsHeaders, rateLimit) });
    }

    return new Response(JSON.stringify(result), {
      headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, rateLimit),
    });
  } catch {
    return new Response(
      JSON.stringify(jsonRpcError(null, -32700, 'Parse error: invalid JSON')),
      { status: 400, headers: buildHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, rateLimit) }
    );
  }
});
