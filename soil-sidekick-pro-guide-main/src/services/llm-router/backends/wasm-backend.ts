// llm-router/backends/wasm-backend.ts
// WASM/CPU backend using Transformers.js
// Fallback path (slower but works everywhere)

import { pipeline, env } from '@xenova/transformers';
import {
  LLMRequest,
  LLMResponse,
  ModelConfig,
  InferenceBackend,
  BackendCapabilities,
} from '../types';

/**
 * WASM Backend for CPU-based inference
 * Fallback when WebGPU unavailable
 * Warning: 3-10x slower than WebGPU
 */
export class WASMBackend implements InferenceBackend {
  name = 'wasm';
  private pipelines: Map<string, any> = new Map();

  /**
   * WASM is always available (runs on CPU)
   */
  isAvailable(): boolean {
    return true;
  }

  /**
   * Get backend capabilities
   */
  async getCapabilities(): Promise<BackendCapabilities> {
    const memory = navigator.deviceMemory || 4;
    
    return {
      available: true,
      webgpuSupported: false,
      maxMemoryGB: memory,
      estimatedLatency: 200, // Slower than WebGPU
    };
  }

  /**
   * Generate text using WASM/CPU
   */
  async generate(request: LLMRequest, model: ModelConfig): Promise<LLMResponse> {
    const startTime = performance.now();

    try {
      // Get or create pipeline
      let generator = this.pipelines.get(model.id);
      
      if (!generator) {
        console.log(`[WASM] Loading model: ${model.source}`);
        
        // Configure Transformers.js for CPU
        env.allowLocalModels = true;
        env.allowRemoteModels = true;
        
        generator = await pipeline(
          'text-generation',
          model.source,
          {
            dtype: model.quantization as any,
            device: 'cpu', // Force CPU/WASM
          }
        );
        
        this.pipelines.set(model.id, generator);
        console.log(`[WASM] Model loaded: ${model.name}`);
      }

      // Prepare prompt
      const fullPrompt = request.systemPrompt 
        ? `${request.systemPrompt}\n\n${request.prompt}`
        : request.prompt;

      // Generate
      const output = await generator(fullPrompt, {
        max_new_tokens: request.maxTokens || 256,
        temperature: request.temperature || 0.7,
        do_sample: true,
      });

      const latency = performance.now() - startTime;
      const text = output[0]?.generated_text || '';

      // Clean up response
      const cleanText = text.replace(fullPrompt, '').trim();

      return {
        text: cleanText,
        model: model.name,
        backend: 'wasm',
        latencyMs: Math.round(latency),
        confidence: 0.70,
        degraded: true, // Flag as degraded performance
        note: 'Using CPU fallback (WebGPU unavailable)',
      };

    } catch (error) {
      console.error('[WASM] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Preload a model
   */
  async preload(model: ModelConfig): Promise<void> {
    if (!this.pipelines.has(model.id)) {
      console.log(`[WASM] Preloading: ${model.name}`);
      await this.generate(
        { prompt: 'warmup', maxTokens: 1 },
        model
      );
    }
  }
}

// Singleton instance
export const wasmBackend = new WASMBackend();
