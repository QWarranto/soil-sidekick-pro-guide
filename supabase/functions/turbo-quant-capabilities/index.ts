import { requestHandler } from '../_shared/request-handler.ts';
import { resolveCapabilities } from '../_shared/turbo-quant.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: 'professional',
  handler: async (ctx) => {
    const body = ctx.validatedData || {};
    const capabilities = resolveCapabilities({
      device_memory_gb: body.device_memory_gb,
      has_webgpu: body.has_webgpu,
      platform: body.platform,
    });

    return capabilities;
  },
});
