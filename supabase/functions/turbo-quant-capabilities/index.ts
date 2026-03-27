import { requestHandler } from '../_shared/request-handler.ts';
import { resolveCapabilities } from '../_shared/turbo-quant.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tq-context-mode, x-tq-kv-cache-hint, x-tq-model-tier',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return requestHandler({
    functionName: 'turbo-quant-capabilities',
    requireAuth: true,
    requireSubscription: 'professional',
    rateLimitPerHour: 200,
  }, async (ctx) => {
    const body = ctx.validatedData || {};
    const capabilities = resolveCapabilities({
      device_memory_gb: body.device_memory_gb,
      has_webgpu: body.has_webgpu,
      platform: body.platform,
    });

    return new Response(JSON.stringify(capabilities), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  })(req);
});
