import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const FUNCTION_MAP: Record<string, string> = {
  'get-soil-data': 'get-soil-data',
  'county-lookup': 'county-lookup',
  'agricultural-intelligence': 'agricultural-intelligence',
  'get-water-quality': 'territorial-water-quality',
  'plant-identify': 'safe-identification',
  'carbon-credit-calculator': 'carbon-credit-calculator',
  'environmental-compatibility-score': 'alpha-earth-environmental-enhancement',
  'environmental-impact': 'environmental-impact-engine',
  'resolve-location': 'county-lookup',
  'multi-parameter-planting-calendar': 'multi-parameter-planting-calendar',
};

const SNIPPET_TEMPLATES: Record<string, (endpoint: string, method: string, params: string) => string> = {
  curl: (endpoint, method, params) => `curl -X ${method} https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint} \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ak_YOUR_KEY_HERE" \\\n  -d '${params}'`,
  javascript: (endpoint, method, params) => `const response = await fetch('https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint}', {\n  method: '${method}',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': 'ak_YOUR_KEY_HERE'\n  },\n  body: JSON.stringify(${params})\n});\nconst data = await response.json();`,
  typescript: (endpoint, method, params) => `const response = await fetch('https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint}', {\n  method: '${method}',\n  headers: {\n    'Content-Type': 'application/json',\n    'x-api-key': 'ak_YOUR_KEY_HERE'\n  },\n  body: JSON.stringify(${params})\n} as RequestInit);\nconst data = await response.json() as Record<string, unknown>;`,
  python: (endpoint, method, params) => `import requests\n\nresponse = requests.${method.toLowerCase()}(\n  'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint}',\n  headers={'Content-Type': 'application/json', 'x-api-key': 'ak_YOUR_KEY_HERE'},\n  json=${params}\n)\ndata = response.json()`,
  go: (endpoint, method, params) => `package main\n\nimport (\n  "bytes"\n  "encoding/json"\n  "net/http"\n)\n\nfunc main() {\n  payload := []byte(\`${params}\`)\n  req, _ := http.NewRequest("${method}", "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint}", bytes.NewBuffer(payload))\n  req.Header.Set("Content-Type", "application/json")\n  req.Header.Set("x-api-key", "ak_YOUR_KEY_HERE")\n  client := &http.Client{}\n  resp, _ := client.Do(req)\n  defer resp.Body.Close()\n}`,
  ruby: (endpoint, method, params) => `require 'net/http'\nrequire 'json'\n\nuri = URI('https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${endpoint}')\nreq = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(uri)\nreq['Content-Type'] = 'application/json'\nreq['x-api-key'] = 'ak_YOUR_KEY_HERE'\nreq.body = ${params}.to_json\n\nres = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|\n  http.request(req)\nend\nputs res.body`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'test';
    const body = req.method === 'POST' ? await req.json() : {};

    // Action: test_endpoint
    if (action === 'test' || body.action === 'test_endpoint') {
      const { endpoint_id, method = 'POST', params = {}, use_trial_key = true } = body;
      const functionName = FUNCTION_MAP[endpoint_id] || endpoint_id;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (use_trial_key) {
        headers['x-api-key'] = 'tk_trial_demo_key';
      }

      const response = await fetch(
        `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/${functionName}`,
        {
          method,
          headers,
          body: JSON.stringify(params),
        }
      );

      const data = await response.json().catch(() => ({}));

      return new Response(
        JSON.stringify({
          success: response.ok,
          status: response.status,
          function_called: functionName,
          data,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: generate_code_snippet
    if (action === 'snippet' || body.action === 'generate_code_snippet') {
      const { endpoint_id, language = 'curl', include_auth = true } = body;
      const functionName = FUNCTION_MAP[endpoint_id] || endpoint_id;
      const template = SNIPPET_TEMPLATES[language] || SNIPPET_TEMPLATES.curl;
      const params = JSON.stringify({ fips: '48453' });
      const snippet = template(functionName, 'POST', params);

      return new Response(
        JSON.stringify({
          endpoint: endpoint_id,
          language,
          snippet: include_auth ? snippet : snippet.replace(/ak_YOUR_KEY_HERE/g, 'YOUR_API_KEY'),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: compare_versions
    if (action === 'compare' || body.action === 'compare_versions') {
      const { from_version = 'v1', to_version = 'v2' } = body;
      return new Response(
        JSON.stringify({
          from_version,
          to_version,
          changes: [
            { type: 'added', endpoint: '/safe-identification', description: 'Consumer Plant Care API' },
            { type: 'added', endpoint: '/dynamic-care', description: 'Hyper-localized care recommendations' },
            { type: 'modified', endpoint: '/get-soil-data', description: 'Added VRT prescription support' },
            { type: 'deprecated', endpoint: '/legacy-soil-lookup', description: 'Use /get-soil-data instead' },
          ],
          breaking_changes: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: return usage info
    return new Response(
      JSON.stringify({
        ok: true,
        actions: ['test_endpoint', 'generate_code_snippet', 'compare_versions'],
        usage: {
          test_endpoint: { method: 'POST', body: { endpoint_id: 'get-soil-data', params: { fips: '48453' } } },
          generate_code_snippet: { method: 'POST', body: { endpoint_id: 'get-soil-data', language: 'curl' } },
          compare_versions: { method: 'POST', body: { from_version: 'v1', to_version: 'v2' } },
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('webmcp-api-docs error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
