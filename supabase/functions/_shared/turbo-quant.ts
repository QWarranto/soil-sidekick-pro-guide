/**
 * TurboQuant Header Parser & Capability Resolver
 * Shared utility for edge functions that support TQ-enhanced inference.
 */

export interface TurboQuantParams {
  contextMode: number;
  kvCacheHint: 'none' | 'reuse' | 'persist';
  modelTier: 'auto' | 'gemma-2b' | 'gemma-7b' | 'gemma-7b-tq';
}

const VALID_CONTEXT_MODES = [4096, 8192, 16384, 24576];
const VALID_KV_HINTS = ['none', 'reuse', 'persist'] as const;
const VALID_MODEL_TIERS = ['auto', 'gemma-2b', 'gemma-7b', 'gemma-7b-tq'] as const;

/**
 * Extract and validate x-tq-* headers from an incoming request.
 * Returns defaults for any missing or invalid headers.
 */
export function parseTQHeaders(req: Request): TurboQuantParams {
  const contextRaw = req.headers.get('x-tq-context-mode');
  const kvRaw = req.headers.get('x-tq-kv-cache-hint');
  const modelRaw = req.headers.get('x-tq-model-tier');

  let contextMode = 4096;
  if (contextRaw) {
    const parsed = parseInt(contextRaw, 10);
    if (VALID_CONTEXT_MODES.includes(parsed)) contextMode = parsed;
  }

  let kvCacheHint: TurboQuantParams['kvCacheHint'] = 'none';
  if (kvRaw && (VALID_KV_HINTS as readonly string[]).includes(kvRaw)) {
    kvCacheHint = kvRaw as TurboQuantParams['kvCacheHint'];
  }

  let modelTier: TurboQuantParams['modelTier'] = 'auto';
  if (modelRaw && (VALID_MODEL_TIERS as readonly string[]).includes(modelRaw)) {
    modelTier = modelRaw as TurboQuantParams['modelTier'];
  }

  return { contextMode, kvCacheHint, modelTier };
}

/**
 * Check whether TQ headers are present (i.e. client is TQ-aware).
 */
export function hasTQHeaders(req: Request): boolean {
  return !!(
    req.headers.get('x-tq-context-mode') ||
    req.headers.get('x-tq-kv-cache-hint') ||
    req.headers.get('x-tq-model-tier')
  );
}

/**
 * Given device specs, recommend the optimal TQ configuration.
 */
export function resolveCapabilities(opts: {
  device_memory_gb?: number;
  has_webgpu?: boolean;
  platform?: string;
}): {
  supported: boolean;
  recommended_model: string;
  max_context_tokens: number;
  estimated_kv_cache_gb: number;
  kv_compression_ratio: string;
  estimated_latency_ms: { first_token: number; per_token: number };
  runtime_tier: string;
} {
  const mem = opts.device_memory_gb ?? 4;
  const gpu = opts.has_webgpu ?? false;

  if (mem >= 8) {
    return {
      supported: true,
      recommended_model: 'gemma-7b-tq',
      max_context_tokens: 24576,
      estimated_kv_cache_gb: 1.3,
      kv_compression_ratio: '5.3x',
      estimated_latency_ms: { first_token: gpu ? 120 : 280, per_token: gpu ? 8 : 22 },
      runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
    };
  }

  if (mem >= 4) {
    return {
      supported: true,
      recommended_model: 'gemma-7b-tq',
      max_context_tokens: 16384,
      estimated_kv_cache_gb: 1.3,
      kv_compression_ratio: '5.3x',
      estimated_latency_ms: { first_token: gpu ? 180 : 400, per_token: gpu ? 12 : 30 },
      runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
    };
  }

  if (mem >= 2) {
    return {
      supported: true,
      recommended_model: 'gemma-2b',
      max_context_tokens: 8192,
      estimated_kv_cache_gb: 0.5,
      kv_compression_ratio: '5.3x',
      estimated_latency_ms: { first_token: gpu ? 90 : 200, per_token: gpu ? 6 : 18 },
      runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
    };
  }

  return {
    supported: false,
    recommended_model: 'gemma-2b',
    max_context_tokens: 4096,
    estimated_kv_cache_gb: 0.5,
    kv_compression_ratio: '5.3x',
    estimated_latency_ms: { first_token: 500, per_token: 40 },
    runtime_tier: 'cloud_fallback',
  };
}
