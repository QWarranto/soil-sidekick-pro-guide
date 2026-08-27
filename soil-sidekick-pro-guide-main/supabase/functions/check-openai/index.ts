import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openaiKey = Deno.env.get('GPT5_API_KEY') || Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'No API key found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const results: Record<string, any> = {};

  for (const model of ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini']) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5
        })
      });
      const data = await res.json();
      results[model] = {
        status: res.status,
        ok: res.ok,
        error: data.error?.code || null,
        usage: data.usage || null
      };
    } catch (e) {
      results[model] = { error: e.message };
    }
  }

  return new Response(JSON.stringify({
    key_prefix: openaiKey.substring(0, 8),
    key_length: openaiKey.length,
    results
  }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
