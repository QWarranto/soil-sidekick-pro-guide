// services/llm-service.ts
// Integration of LLM Router with existing SoilSidekick codebase
// Replaces/augments localLLMService with the new router

import { llmRouter, LLMRequest, LLMResponse } from './llm-router';
import { CloudBackend } from './llm-router/backends';
import { SmartLLMRouter } from './llm-router/router';
import { modelRegistry } from './llm-router/registry';

/**
 * Configure the LLM service with cloud backend
 * Call this once on app initialization
 */
export function configureLLMService(options: {
  cloudApiKey?: string;
  cloudProvider?: 'openai' | 'anthropic' | 'cloudflare';
  cloudModel?: string;
  cloudAccountId?: string; // For Cloudflare
}) {
  // Create cloud backend if API key provided
  if (options.cloudApiKey) {
    const cloudBackend = new CloudBackend({
      provider: options.cloudProvider || 'openai',
      apiKey: options.cloudApiKey,
      model: options.cloudModel || 'gpt-4o-mini',
      baseUrl: options.cloudAccountId, // For Cloudflare
    });

    // Register with router
    (llmRouter as any).backends.set('cloud', cloudBackend);
  }
}

/**
 * Main LLM service interface for SoilSidekick
 * 
 * Usage:
 *   // First, configure (once):
 *   configureLLMService({ cloudApiKey: 'sk-xxx' });
 * 
 *   // Then use:
 *   const result = await llmService.generate({
 *     prompt: "Analyze this soil data...",
 *     maxLatencyMs: 200,
 *     priority: 'real-time',
 *   });
 * 
 * The router automatically:
 * - Uses Cloud API for real-time (<200ms guaranteed)
 * - Falls back to WebGPU for offline capability (~600ms)
 * - Falls back to WASM if WebGPU unavailable (~600ms)
 */
export const llmService = {
  /**
   * Generate text from LLM
   * 
   * @param request - Generation parameters
   * @returns Response with text and metadata
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    return llmRouter.generate(request);
  },

  /**
   * Preload models for faster first inference
   * Call on app startup or before anticipated use
   */
  async preload(): Promise<void> {
    return llmRouter.preload();
  },

  /**
   * Get system capabilities
   * Useful for UI indicators ("GPU Accelerated" badge)
   */
  async getCapabilities() {
    return llmRouter.getCapabilities();
  },

  /**
   * Check if real-time performance is available
   * Returns true if cloud backend is configured
   */
  async isRealTimeAvailable(): Promise<boolean> {
    const caps = await llmRouter.getCapabilities();
    const cloud = (llmRouter as any).backends.get('cloud');
    return cloud?.isAvailable() || caps.webgpu;
  },
};

// Backward compatibility alias
export const localLLMService = llmService;

// Default export
export default llmService;
