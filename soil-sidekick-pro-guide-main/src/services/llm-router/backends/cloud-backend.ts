// llm-router/backends/cloud-backend.ts
// Cloud API backend for guaranteed low latency
// Falls back to OpenAI, Anthropic, or Cloudflare Workers AI

import {
  LLMRequest,
  LLMResponse,
  ModelConfig,
  InferenceBackend,
  BackendCapabilities,
} from '../types';

interface CloudBackendConfig {
  provider: 'openai' | 'anthropic' | 'cloudflare';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

/**
 * Cloud Backend for guaranteed <200ms latency
 * Uses OpenAI/Anthropic/Cloudflare API
 * Network-dependent but reliable
 */
export class CloudBackend implements InferenceBackend {
  name = 'cloud';
  private config: CloudBackendConfig;

  constructor(config: CloudBackendConfig) {
    this.config = config;
  }

  /**
   * Cloud is available if we have network
   */
  isAvailable(): boolean {
    return navigator.onLine && !!this.config.apiKey;
  }

  /**
   * Get capabilities
   */
  async getCapabilities(): Promise<BackendCapabilities> {
    return {
      available: this.isAvailable(),
      webgpuSupported: false,
      maxMemoryGB: Infinity, // Cloud has unlimited memory
      estimatedLatency: 150, // Typical API response time
    };
  }

  /**
   * Generate via cloud API
   */
  async generate(request: LLMRequest, model: ModelConfig): Promise<LLMResponse> {
    const startTime = performance.now();

    if (!this.isAvailable()) {
      throw new Error('Cloud backend unavailable: no network or API key');
    }

    try {
      let response;

      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(request);
          break;
        case 'anthropic':
          response = await this.callAnthropic(request);
          break;
        case 'cloudflare':
          response = await this.callCloudflare(request);
          break;
        default:
          throw new Error(`Unknown provider: ${this.config.provider}`);
      }

      const latency = performance.now() - startTime;

      return {
        text: response.text,
        model: this.config.model,
        backend: 'cloud',
        latencyMs: Math.round(latency),
        confidence: 0.98, // Cloud APIs very reliable
        note: `${this.config.provider} API`,
      };

    } catch (error) {
      console.error('[Cloud] API call failed:', error);
      throw error;
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(request: LLMRequest): Promise<{text: string}> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages: [
          ...(request.systemPrompt ? [{role: 'system', content: request.systemPrompt}] : []),
          {role: 'user', content: request.prompt},
        ],
        max_tokens: request.maxTokens || 256,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.choices[0]?.message?.content || '' };
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(request: LLMRequest): Promise<{text: string}> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: request.maxTokens || 256,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt,
        messages: [
          {role: 'user', content: request.prompt},
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.content[0]?.text || '' };
  }

  /**
   * Call Cloudflare Workers AI
   * Fastest option: ~50-100ms
   */
  private async callCloudflare(request: LLMRequest): Promise<{text: string}> {
    const accountId = this.config.baseUrl; // Store account ID here
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...(request.systemPrompt ? [{role: 'system', content: request.systemPrompt}] : []),
            {role: 'user', content: request.prompt},
          ],
          max_tokens: request.maxTokens || 256,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.result?.response || '' };
  }

  /**
   * Preload doesn't apply to cloud (stateless)
   */
  async preload(): Promise<void> {
    // No-op for cloud
  }
}

export default CloudBackend;
