import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
}

function logToolCall(entry: ToolCallAudit) {
  auditClient.from('mcp_tool_call_log').insert(entry).then(
    () => {},
    (e: unknown) => console.error('[MCP-AUDIT]', e),
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

async function handleRpc(req: JsonRpcRequest, apiKey: string | null): Promise<unknown> {
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
    const toolName = (params as Record<string, unknown>)?.name as string;
    const toolArgs = (params as Record<string, unknown>)?.arguments as Record<string, unknown> ?? {};

    const auditBase = {
      api_key_hash: apiKey ? hashKey(apiKey) : undefined,
      source_ip: reqMeta?.ip,
      user_agent: reqMeta?.userAgent,
      tool_name: toolName,
      tool_arguments: toolArgs,
      jsonrpc_id: id != null ? String(id) : undefined,
      is_batch: reqMeta?.isBatch ?? false,
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

    if (!apiKey) {
      logToolCall({ ...auditBase, success: false, error_message: 'Missing x-api-key', response_time_ms: Date.now() - callStart });
      return jsonRpcError(id ?? null, -32000, 'Missing x-api-key header. Obtain one at https://soilsidekick.com/api-keys');
    }

    // Strip TurboQuant hint params before forwarding (they're metadata, not endpoint args)
    const { context_mode, kv_cache_hint, preferred_model_tier, ...endpointArgs } = toolArgs;

    // Build TurboQuant metadata header for downstream functions
    const tqMeta: Record<string, string> = {};
    if (context_mode) tqMeta['x-tq-context-mode'] = String(context_mode);
    if (kv_cache_hint) tqMeta['x-tq-kv-cache-hint'] = String(kv_cache_hint);
    if (preferred_model_tier) tqMeta['x-tq-model-tier'] = String(preferred_model_tier);

    try {
      const fnUrl = `${SUPABASE_URL}/functions/v1/${endpoint}`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-api-key': apiKey,
          ...tqMeta,
        },
        body: JSON.stringify(endpointArgs),
      });

      const data = await res.json();
      const elapsed = Date.now() - callStart;

      if (!res.ok) {
        logToolCall({
          ...auditBase, success: false, error_message: `HTTP ${res.status}`,
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

// ── HTTP Handler ────────────────────────────────────────────────────

Deno.serve(async (req) => {
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Validate Accept header per MCP spec
  const accept = req.headers.get('accept') ?? '';
  if (!accept.includes('application/json') && !accept.includes('*/*')) {
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Not Acceptable: Client must accept application/json' }, id: null }),
      { status: 406, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = req.headers.get('x-api-key');

  try {
    const body = await req.json();

    // Handle batch requests
    if (Array.isArray(body)) {
      const results = await Promise.all(body.map((r: JsonRpcRequest) => handleRpc(r, apiKey)));
      const filtered = results.filter((r) => r !== null);
      return new Response(JSON.stringify(filtered), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Single request
    const result = await handleRpc(body as JsonRpcRequest, apiKey);
    if (result === null) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify(jsonRpcError(null, -32700, 'Parse error: invalid JSON')),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
