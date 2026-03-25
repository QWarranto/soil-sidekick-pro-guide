import { corsHeaders } from '../_shared/cors.ts';

/**
 * LeafEngines™ MCP Server — Streamable HTTP Transport
 * 
 * Exposes core LeafEngines API endpoints as MCP-callable tools
 * for AI agents (Claude, GPT, Gemini, open-source models).
 * 
 * Protocol: MCP Streamable HTTP (JSON-RPC 2.0)
 * Auth: x-api-key header (same as regular API)
 */

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

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
    description: 'AI-powered agricultural analysis combining soil data, climate factors, and crop science. Provides planting recommendations, yield predictions, risk assessments, and sustainability scores. **Use when**: user asks what to plant, expected yields, farming risks, or crop suitability for a location. **Do NOT use** for raw soil composition (use `get_soil_data`) or water quality (use `territorial_water_quality`). **Pair with**: `get_soil_data` for underlying soil details, `generate_vrt_prescription` for application rates. **Requires**: county_fips (required), crop_type and question (optional). **Output**: JSON with recommendations, confidence scores, and data sources.',
    keywords: ['agriculture', 'crop recommendation', 'yield prediction', 'farming', 'agronomy', 'crop science', 'planting advice', 'risk assessment', 'sustainability', 'precision agriculture', 'AI farming'],
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
        }
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
    description: 'Patent-pending multi-source environmental impact assessment. Fuses USDA soil data, EPA water quality, NOAA climate data, and Google AlphaEarth satellite embeddings (64-dim Geo Foundation Model vectors at 10m resolution) into Environmental Compatibility Scores unavailable from any single public data source. Returns: runoff_risk (0-100), contamination_risk (low/med/high), biodiversity_impact, carbon_footprint_score, and satellite-derived vegetation health. **Use when**: user needs environmental due diligence, land purchase evaluation, regulatory pre-screening, or comprehensive site assessment. **Do NOT use** for soil-only queries (use `get_soil_data`) or water-only queries (use `territorial_water_quality`). **Pair with**: `get_soil_data` for raw soil inputs, `territorial_water_quality` for water-specific detail, `carbon_credit_calculator` for monetization. **Requires**: county_fips + lat + lng + soil_data (required). **Output**: JSON with composite scores, risk categories, satellite health indices, and eco-friendly alternatives.',
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
        }
      },
      required: ['county_fips', 'lat', 'lng', 'soil_data']
    }
  },
  {
    name: 'planting_optimization',
    description: 'AI-powered multi-parameter planting calendar that fuses soil composition, historical climate patterns, frost date models, and crop-specific phenology to generate optimal planting windows, yield predictions, sustainability scores, and risk assessments. Returns proprietary timing recommendations unavailable from standard agricultural extension data. **Use when**: user asks when to plant, optimal planting dates, growing season timing, or yield forecasts for a specific crop and location. **Do NOT use** for general crop advice without timing focus (use `agricultural_intelligence`) or soil-only queries (use `get_soil_data`). **Pair with**: `get_soil_data` for soil context, `carbon_credit_calculator` for sustainability ROI. **Requires**: county_fips + crop_type (required), field_size_acres and planting_year (optional). **Output**: JSON with optimal_window (start/end dates), yield_prediction (bushels/acre), sustainability_score (0-100), risk_factors array, and alternative crop suggestions.',
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
        }
      },
      required: ['county_fips', 'crop_type']
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
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: 'leafengines-mcp',
        version: '1.0.0',
      },
    });
  }

  // ── tools/list ──
  if (method === 'tools/list') {
    return jsonRpcResponse(id ?? null, { tools: TOOLS });
  }

  // ── tools/call ──
  if (method === 'tools/call') {
    const toolName = (params as Record<string, unknown>)?.name as string;
    const toolArgs = (params as Record<string, unknown>)?.arguments as Record<string, unknown> ?? {};

    const endpoint = TOOL_TO_ENDPOINT[toolName];
    if (!endpoint) {
      return jsonRpcError(id ?? null, -32602, `Unknown tool: ${toolName}`);
    }

    if (!apiKey) {
      return jsonRpcError(id ?? null, -32000, 'Missing x-api-key header. Obtain one at https://soilsidekick.com/api-keys');
    }

    try {
      const fnUrl = `${SUPABASE_URL}/functions/v1/${endpoint}`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-api-key': apiKey,
        },
        body: JSON.stringify(toolArgs),
      });

      const data = await res.json();

      if (!res.ok) {
        return jsonRpcResponse(id ?? null, {
          content: [{ type: 'text', text: `Error ${res.status}: ${JSON.stringify(data)}` }],
          isError: true,
        });
      }

      return jsonRpcResponse(id ?? null, {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
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
