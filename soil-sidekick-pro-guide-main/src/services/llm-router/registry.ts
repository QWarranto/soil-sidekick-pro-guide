// llm-router/registry.ts
// Simple in-memory model registry (MVP version)
// Future: Load from YAML file with hot reload

import { ModelConfig } from './types';

/**
 * Model registry - defines available models and their characteristics
 * MVP: Hardcoded configs
 * Phase 3: Load from YAML with hot reload
 */
export class ModelRegistry {
  private models: Map<string, ModelConfig> = new Map();

  constructor() {
    this.initializeDefaultModels();
  }

  /**
   * Get the primary model (default for most requests)
   */
  getPrimary(): ModelConfig {
    return this.models.get('flan-t5-248m')!;
  }

  /**
   * Get fastest model for latency-critical requests
   */
  getFastest(): ModelConfig {
    return this.models.get('flan-t5-248m')!;
  }

  /**
   * Get model by ID
   */
  getModel(id: string): ModelConfig | undefined {
    return this.models.get(id);
  }

  /**
   * List all available models
   */
  listModels(): ModelConfig[] {
    return Array.from(this.models.values());
  }

  /**
   * Add a model (for dynamic registration)
   */
  registerModel(config: ModelConfig): void {
    this.models.set(config.id, config);
  }

  /**
   * Initialize default models for MVP
   */
  private initializeDefaultModels(): void {
    // Primary model: LaMini-Flan-T5-248M
    // Fast, open, no auth required, good for agriculture tasks
    this.models.set('flan-t5-248m', {
      id: 'flan-t5-248m',
      name: 'LaMini Flan-T5 248M',
      source: 'Xenova/LaMini-Flan-T5-248M',
      size: '248MB',
      quantization: 'q4f16',
      latencyProfile: {
        webgpu: 25,  // 25ms on WebGPU
        wasm: 150,   // 150ms on WASM CPU
      },
      requirements: {
        minMemoryGB: 0.5,
        webgpuRequired: false, // Can run on CPU if needed
      },
    });

    // Future: Gemma 2B (gated, requires auth)
    // Commented out until auth issues resolved
    /*
    this.models.set('gemma-2b', {
      id: 'gemma-2b',
      name: 'Gemma 2B Instruct',
      source: 'Xenova/gemma-2b-it',
      size: '1.2GB',
      quantization: 'q4f16',
      latencyProfile: {
        webgpu: 80,
        wasm: 600,
      },
      requirements: {
        minMemoryGB: 2,
        webgpuRequired: true, // Too slow on WASM
      },
    });
    */

    // Future: BitNet (Phase 3)
    // Will add when BitNet support available
  }
}

// Singleton instance
export const modelRegistry = new ModelRegistry();
