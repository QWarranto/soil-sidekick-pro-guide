// llm-router/router.ts
// Smart router - selects optimal backend based on capabilities and SLA

import {
  LLMRequest,
  LLMResponse,
  RoutingStrategy,
  InferenceBackend,
  BackendHealth,
} from './types';
import { ModelRegistry } from './registry';
import { webgpuBackend, wasmBackend, CloudBackend } from './backends';

/**
 * Smart LLM Router
 * 
 * Automatically selects the best backend based on:
 * 1. Request requirements (latency SLA)
 * 2. Backend availability (WebGPU present?)
 * 3. Model requirements (memory, WebGPU required?)
 * 4. Health status (degraded? failing?)
 */
export class SmartLLMRouter {
  private registry: ModelRegistry;
  private backends: Map<string, InferenceBackend>;
  private healthStatus: Map<string, BackendHealth>;

  constructor(registry: ModelRegistry = new ModelRegistry()) {
    this.registry = registry;
    this.backends = new Map();
    this.healthStatus = new Map();

    // Register backends
    this.backends.set('webgpu', webgpuBackend);
    this.backends.set('wasm', wasmBackend);

    // Initialize health
    this.initializeHealth();
  }

  /**
   * Main generation method
   * Automatically selects optimal backend
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const slaMs = request.maxLatencyMs || 100;
    
    try {
      // Select best strategy
      const strategy = await this.selectStrategy(request, slaMs);
      
      console.log(`[Router] Selected: ${strategy.backend.name} + ${strategy.model.name}`);
      if (strategy.note) {
        console.log(`[Router] Note: ${strategy.note}`);
      }

      // Execute generation
      const response = await strategy.backend.generate(request, strategy.model);
      
      // Mark degraded if applicable
      if (strategy.degraded) {
        response.degraded = true;
        response.note = strategy.note;
      }

      // Update health (success)
      this.updateHealth(strategy.backend.name, response.latencyMs, true);

      return response;

    } catch (error) {
      // Update health (failure)
      const failedBackend = this.backends.get('webgpu')?.isAvailable() ? 'webgpu' : 'wasm';
      this.updateHealth(failedBackend, 0, false);

      // Attempt fallback
      console.warn('[Router] Primary failed, attempting fallback:', error);
      return this.fallbackGenerate(request);
    }
  }

  /**
   * Select optimal routing strategy
   */
  private async selectStrategy(
    request: LLMRequest, 
    slaMs: number
  ): Promise<RoutingStrategy> {
    
    const webgpu = this.backends.get('webgpu')!;
    const wasm = this.backends.get('wasm')!;
    const cloud = this.backends.get('cloud');

    // Priority 1: Real-time with tight SLA - try Cloud API first
    // Cloud is ~150-200ms, guaranteed performance
    if (request.priority === 'real-time' && slaMs <= 200 && cloud?.isAvailable()) {
      const primaryModel = this.registry.getPrimary();
      return {
        backend: cloud,
        model: primaryModel,
        confidence: 0.95,
        note: 'Using cloud API for guaranteed low latency',
      };
    }

    // Priority 2: Try WebGPU for local inference
    if (webgpu.isAvailable()) {
      const primaryModel = this.registry.getPrimary();
      
      if (primaryModel.latencyProfile.webgpu <= slaMs) {
        return {
          backend: webgpu,
          model: primaryModel,
          confidence: 0.90,
        };
      }

      // Primary too slow, try fastest model
      const fastModel = this.registry.getFastest();
      if (fastModel.latencyProfile.webgpu <= slaMs) {
        return {
          backend: webgpu,
          model: fastModel,
          confidence: 0.80,
          note: 'Using smaller model for speed',
        };
      }
    }

    // Priority 3: Relaxed requirements - use local anyway
    if (slaMs >= 1000 || request.priority === 'background') {
      const fallbackModel = this.registry.getFastest();
      return {
        backend: webgpu.isAvailable() ? webgpu : wasm,
        model: fallbackModel,
        confidence: 0.70,
        degraded: true,
        note: `Using local inference (~${webgpu.isAvailable() ? '600' : '600'}ms)`,
      };
    }

    // Priority 4: Cannot meet SLA - throw error
    throw new Error(
      `Cannot meet ${slaMs}ms SLA. ` +
      `Cloud: ${cloud?.isAvailable() ? 'available' : 'not configured'}, ` +
      `WebGPU: ${webgpu.isAvailable() ? '~600ms' : 'not available'}, ` +
      `WASM: ~600ms.`
    );
  }

  /**
   * Fallback generation when primary fails
   */
  private async fallbackGenerate(request: LLMRequest): Promise<LLMResponse> {
    const wasm = this.backends.get('wasm')!;
    const model = this.registry.getFastest();

    console.log('[Router] Fallback to WASM backend');

    const response = await wasm.generate(request, model);
    response.degraded = true;
    response.note = 'Used fallback backend after primary failure';
    
    return response;
  }

  /**
   * Preload models for faster first inference
   */
  async preload(): Promise<void> {
    const webgpu = this.backends.get('webgpu');
    const model = this.registry.getPrimary();

    if (webgpu?.isAvailable()) {
      console.log('[Router] Preloading model for WebGPU...');
      await webgpu.preload(model);
    }
  }

  /**
   * Get system capabilities report
   */
  async getCapabilities(): Promise<{
    webgpu: boolean;
    wasm: boolean;
    recommended: string;
  }> {
    const webgpuAvailable = webgpuBackend.isAvailable();
    
    return {
      webgpu: webgpuAvailable,
      wasm: true, // Always available
      recommended: webgpuAvailable ? 'webgpu' : 'wasm',
    };
  }

  /**
   * Initialize health tracking
   */
  private initializeHealth(): void {
    for (const [name, backend] of this.backends) {
      this.healthStatus.set(name, {
        backend: name,
        status: 'healthy',
        latency: 0,
        lastCheck: new Date(),
        consecutiveFailures: 0,
      });
    }
  }

  /**
   * Update backend health status
   */
  private updateHealth(backend: string, latency: number, success: boolean): void {
    const current = this.healthStatus.get(backend);
    if (!current) return;

    if (success) {
      current.status = 'healthy';
      current.latency = latency;
      current.consecutiveFailures = 0;
    } else {
      current.consecutiveFailures++;
      if (current.consecutiveFailures > 3) {
        current.status = 'degraded';
      }
    }

    current.lastCheck = new Date();
    this.healthStatus.set(backend, current);
  }

  /**
   * Get health status of all backends
   */
  getHealth(): BackendHealth[] {
    return Array.from(this.healthStatus.values());
  }
}

// Singleton instance
export const llmRouter = new SmartLLMRouter();
