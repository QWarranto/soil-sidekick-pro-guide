import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const MCP_TOOLS = [
  { name: 'get-soil-data', tier: 'commoditized', price: 0.001, category: 'soil', description: 'USDA SSURGO soil analysis for any US county' },
  { name: 'county-lookup', tier: 'commoditized', price: 0.001, category: 'location', description: 'Resolve US location names to FIPS codes' },
  { name: 'agricultural-intelligence', tier: 'enhanced', price: 0.003, category: 'analytics', description: 'AI-powered agricultural insights' },
  { name: 'get-water-quality', tier: 'commoditized', price: 0.001, category: 'water', description: 'EPA water quality data for US counties' },
  { name: 'safe-identification', tier: 'enhanced', price: 0.003, category: 'plant', description: 'Identify plants with toxic lookalike warnings' },
  { name: 'carbon-credit-calculator', tier: 'proprietary', price: 0.01, category: 'carbon', description: 'Calculate carbon credit potential' },
  { name: 'generate-vrt-prescription', tier: 'proprietary', price: 0.01, category: 'soil', description: 'Create VRT prescription maps' },
  { name: 'environmental-compatibility-score', tier: 'exclusive', price: 0.02, category: 'analytics', description: 'Environmental Compatibility Score with satellite data' },
  { name: 'multi-parameter-planting-calendar', tier: 'exclusive', price: 0.02, category: 'analytics', description: 'Multi-parameter phenology model' },
];

const TIER_PRICING: Record<string, { monthly: number; included_calls: number; overage_price: number }> = {
  commoditized: { monthly: 0, included_calls: 1000, overage_price: 0.001 },
  enhanced: { monthly: 29, included_calls: 5000, overage_price: 0.003 },
  proprietary: { monthly: 199, included_calls: 25000, overage_price: 0.01 },
  exclusive: { monthly: 999, included_calls: 100000, overage_price: 0.02 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    const body = req.method === 'POST' ? await req.json() : {};

    // list_mcp_tools
    if (action === 'list' || body.action === 'list_mcp_tools') {
      const { tier = 'all', category = 'all' } = body;
      let tools = MCP_TOOLS;
      if (tier !== 'all') tools = tools.filter(t => t.tier === tier);
      if (category !== 'all') tools = tools.filter(t => t.category === category);
      return new Response(
        JSON.stringify({ tools, count: tools.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // get_tool_schema
    if (action === 'schema' || body.action === 'get_tool_schema') {
      const { tool_name } = body;
      const tool = MCP_TOOLS.find(t => t.name === tool_name);
      if (!tool) {
        return new Response(
          JSON.stringify({ error: `Tool not found: ${tool_name}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({
          ...tool,
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'County name or FIPS code' },
              fips: { type: 'string', description: 'FIPS code (e.g. 48453)' },
            }
          },
          example: { location: 'Travis County, TX' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // test_mcp_tool
    if (action === 'test' || body.action === 'test_mcp_tool') {
      const { tool_name, arguments: args = {}, show_pricing = true } = body;
      const tool = MCP_TOOLS.find(t => t.name === tool_name);
      if (!tool) {
        return new Response(
          JSON.stringify({ error: `Tool not found: ${tool_name}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Proxy to actual function
      const functionName = tool_name;
      const response = await fetch(
        `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${functionName}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': 'tk_trial_demo_key' },
          body: JSON.stringify(args),
        }
      );
      const data = await response.json().catch(() => ({}));

      return new Response(
        JSON.stringify({
          success: response.ok,
          status: response.status,
          tool: tool_name,
          cost: show_pricing ? tool.price : undefined,
          data,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // get_connection_string
    if (action === 'connect' || body.action === 'get_connection_string') {
      const { transport = 'sse' } = body;
      return new Response(
        JSON.stringify({
          transport,
          url: transport === 'sse'
            ? 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server/sse'
            : 'npx -y @ancientwhispers54/leafengines-mcp-server',
          auth_required: true,
          auth_header: 'x-api-key',
          documentation: 'https://app.soilsidekickpro.com/mcp',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // estimate_usage_cost
    if (action === 'estimate' || body.action === 'estimate_usage_cost') {
      const { calls = [] } = body;
      let total = 0;
      const breakdown = calls.map((c: { tool_name: string; count: number }) => {
        const tool = MCP_TOOLS.find(t => t.name === c.tool_name);
        const cost = tool ? tool.price * c.count : 0;
        total += cost;
        return { tool: c.tool_name, count: c.count, unit_price: tool?.price || 0, cost };
      });
      return new Response(
        JSON.stringify({ total_cost: total, breakdown, currency: 'USD' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        actions: ['list_mcp_tools', 'get_tool_schema', 'test_mcp_tool', 'get_connection_string', 'estimate_usage_cost'],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('webmcp-mcp-page error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
