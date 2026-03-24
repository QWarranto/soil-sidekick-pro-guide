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
    name: 'get_soil_data',
    description: 'Retrieve comprehensive USDA soil analysis for a US county by FIPS code. Returns pH, nutrients (N-P-K), organic matter, drainage class, and texture. Use when an agent needs soil composition data for agricultural planning, environmental assessment, or land evaluation.',
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
    name: 'county_lookup',
    description: 'Search for US counties by name, state, or FIPS code. Returns matching counties with FIPS codes, state names, and state codes. Use when an agent needs to resolve a location name to a FIPS code before calling other endpoints.',
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
    name: 'agricultural_intelligence',
    description: 'AI-powered agricultural analysis combining soil data, climate factors, and crop science. Provides planting recommendations, yield predictions, risk assessments, and sustainability scores for a given county and crop type.',
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
    description: 'Retrieve EPA water quality data for a US county. Returns contamination risk, water body proximity analysis, and parameter readings. Use for environmental impact assessments and regulatory compliance checks.',
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
    description: 'Identify a plant and flag toxic lookalikes with environmental context. Returns safety warnings, confidence scores, and habitat information. Critical for foraging safety and field identification workflows.',
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
    description: 'Calculate carbon credit potential for agricultural land based on field size, soil organic matter, and farming practices. Returns estimated credits, monetary value, and verification requirements.',
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
    description: 'Generate a variable rate technology (VRT) prescription map for precision agriculture. Creates zone-based application rates for fertilizer, seed, water, or pesticide based on soil variability across a field.',
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
