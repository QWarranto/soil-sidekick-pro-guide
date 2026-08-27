// llm-router/backends/webgpu-backend.ts
// WebGPU backend using Transformers.js
// Primary path for <100ms latency

import { pipeline, env } from '@xenova/transformers';
import {
  LLMRequest,
  LLMResponse,
  ModelConfig,
  InferenceBackend,
  BackendCapabilities,
} from '../types';

/**
 * WebGPU Backend for fast local inference
 * Target: <100ms latency on supported devices
 */
export class WebGPUBackend implements InferenceBackend {
  name = 'webgpu';
  private pipelines: Map<string, any> = new Map();
  private gpuAdapter: GPUAdapter | null = null;

  constructor() {
    this.detectGPU();
  }

  /**
   * Detect WebGPU availability
   */
  private async detectGPU(): Promise<void> {
    if (typeof navigator === 'undefined') {
      return; // Server-side, no WebGPU
    }

    if (!navigator.gpu) {
      console.log('[WebGPU] Not available in this browser');
      return;
    }

    try {
      this.gpuAdapter = await navigator.gpu.requestAdapter();
      if (this.gpuAdapter) {
        console.log('[WebGPU] Adapter detected:', this.gpuAdapter);
      }
    } catch (error) {
      console.error('[WebGPU] Detection failed:', error);
    }
  }

  /**
   * Check if WebGPU is available
   */
  isAvailable(): boolean {
    return this.gpuAdapter !== null;
  }

  /**
   * Get backend capabilities
   */
  async getCapabilities(): Promise<BackendCapabilities> {
    const available = this.isAvailable();
    
    // Estimate memory (rough approximation)
    const memory = navigator.deviceMemory || 4;
    
    return {
      available,
      webgpuSupported: available,
      maxMemoryGB: memory,
      estimatedLatency: available ? 50 : Infinity,
    };
  }

  /**
   * Generate text using WebGPU
   */
  async generate(request: LLMRequest, model: ModelConfig): Promise<LLMResponse> {
    const startTime = performance.now();

    if (!this.isAvailable()) {
      throw new Error('WebGPU not available on this device');
    }

    try {
      // Get or create pipeline
      let generator = this.pipelines.get(model.id);
      
      if (!generator) {
        console.log(`[WebGPU] Loading model: ${model.source}`);
        
        // Configure Transformers.js
        env.allowLocalModels = true;
        env.allowRemoteModels = true;
        
        generator = await pipeline(
          'text-generation',
          model.source,
          {
            dtype: model.quantization as any,
            device: 'webgpu',
          }
        );
        
        this.pipelines.set(model.id, generator);
        console.log(`[WebGPU] Model loaded: ${model.name}`);
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

      // Clean up the response (remove prompt echo)
      const cleanText = text.replace(fullPrompt, '').trim();

      return {
        text: cleanText,
        model: model.name,
        backend: 'webgpu',
        latencyMs: Math.round(latency),
        confidence: 0.95,
      };

    } catch (error) {
      console.error('[WebGPU] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Preload a model (for warmup)
   */
  async preload(model: ModelConfig): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    if (!this.pipelines.has(model.id)) {
      console.log(`[WebGPU] Preloading: ${model.name}`);
      await this.generate(
        { prompt: 'warmup', maxTokens: 1 },
        model
      );
    }
  }
}

// Singleton instance
export const webgpuBackend = new WebGPUBackend();
