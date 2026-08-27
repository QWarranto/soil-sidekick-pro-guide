// llm-router/types.ts
// Core interfaces for the LLM Router abstraction layer

/**
 * Request to generate text from an LLM
 */
export interface LLMRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  priority?: 'real-time' | 'background';
  maxLatencyMs?: number; // SLA requirement, default 100ms
}

/**
 * Response from LLM generation
 */
export interface LLMResponse {
  text: string;
  model: string;
  backend: 'webgpu' | 'wasm' | 'cloud';
  latencyMs: number;
  confidence: number;
  degraded?: boolean; // True if using fallback
  note?: string; // Human-readable explanation
}

/**
 * Backend capability report
 */
export interface BackendCapabilities {
  available: boolean;
  webgpuSupported: boolean;
  maxMemoryGB: number;
  estimatedLatency: number;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  id: string;
  name: string;
  source: string; // e.g., "Xenova/LaMini-Flan-T5-248M"
  size: string; // e.g., "248MB"
  quantization: string; // e.g., "q4f16"
  latencyProfile: {
    webgpu: number;
    wasm: number;
    cloud?: number;
  };
  requirements: {
    minMemoryGB: number;
    webgpuRequired: boolean;
  };
}

/**
 * Routing strategy selected by the router
 */
export interface RoutingStrategy {
  backend: InferenceBackend;
  model: ModelConfig;
  confidence: number;
  degraded?: boolean;
  note?: string;
}

/**
 * Inference backend interface
 * All backends (WebGPU, WASM, Cloud) implement this
 */
export interface InferenceBackend {
  name: string;
  getCapabilities(): Promise<BackendCapabilities>;
  generate(request: LLMRequest, model: ModelConfig): Promise<LLMResponse>;
  isAvailable(): boolean;
}

/**
 * Health status of a backend
 */
export interface BackendHealth {
  backend: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastCheck: Date;
  consecutiveFailures: number;
}
