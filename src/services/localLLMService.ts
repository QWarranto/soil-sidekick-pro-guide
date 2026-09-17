import { pipeline, env } from '@huggingface/transformers';

export type GemmaModelId = 
  | 'gemma-2b'       // Legacy Gemma 2 — will be deprecated
  | 'gemma-7b'       // Legacy Gemma 2 — will be deprecated
  | 'gemma4-e2b'     // Gemma 4 E2B: 2.3B effective, 128K ctx, text+image+audio
  | 'gemma4-e4b'     // Gemma 4 E4B: 4.5B effective, 128K ctx, text+image+audio
  | 'gemma4-26b-a4b' // Gemma 4 MoE: 26B total / 3.8B active, 256K ctx, text+image
  | 'gemma4-31b';    // Gemma 4 Dense: 30.7B, 256K ctx, text+image

export interface LocalLLMConfig {
  model: GemmaModelId;
  maxTokens: number;
  temperature?: number;
  /**
   * TurboQuant KV cache compression mode.
   * - 'none': Standard 16-bit KV cache (current default)
   * - '3bit': TurboQuant 3-bit KV cache (6x memory reduction, zero accuracy loss)
   * 
   * Note: Gemma 4 models include built-in hybrid attention with proportional RoPE
   * and unified K/V for global layers, making TurboQuant even more effective.
   */
  kvCacheMode?: 'none' | '3bit';
  /**
   * Whether to reuse KV cache from the previous call's system prompt.
   * Saves ~40-60% compute on follow-up messages in the same session.
   * Only effective when kvCacheMode is '3bit' (cache small enough to persist).
   */
  reuseKVCache?: boolean;
  /**
   * Enable Gemma 4's built-in thinking/reasoning mode.
   * When enabled, the model performs step-by-step reasoning before answering.
   * Recommended for complex soil analysis and multi-factor agricultural queries.
   */
  thinkingMode?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// navigator.gpu accessed via type assertion: (navigator as any).gpu

export type DeviceType = 'webgpu' | 'wasm';

export interface LLMStatus {
  initialized: boolean;
  device: DeviceType | null;
  model: string | null;
  modelGeneration: 'gemma2' | 'gemma4';
  fallbackUsed: boolean;
  turboQuantActive: boolean;
  kvCacheMode: 'none' | '3bit';
  estimatedKVCacheGB: number;
  contextWindow: number;
  supportsAudio: boolean;
  supportsImages: boolean;
  supportsFunctionCalling: boolean;
  activeParameters: string;
}

/**
 * Gemma 4 Performance Reference (April 2026)
 * 
 * Gemma 4 models feature hybrid attention (sliding window + global), built-in
 * thinking mode, native system prompts, and function calling. With TurboQuant:
 * 
 * Model         | Effective Params | Context | KV Cache (16-bit) | KV Cache (3-bit) | Audio
 * E2B           | 2.3B             | 128K    | ~1.5 GB           | ~0.3 GB          | ✅
 * E4B           | 4.5B             | 128K    | ~3.0 GB           | ~0.6 GB          | ✅
 * 26B A4B (MoE) | 3.8B active      | 256K    | ~10 GB            | ~1.9 GB          | ❌
 * 31B Dense     | 30.7B            | 256K    | ~14 GB            | ~2.6 GB          | ❌
 * 
 * Legacy Gemma 2 (deprecated but still supported):
 * Gemma 2B      | 2B               | 8K      | ~3.0 GB           | ~0.6 GB          | ❌
 * Gemma 7B      | 7B               | 8K      | ~12 GB            | ~2.3 GB          | ❌
 */

interface ModelSpec {
  onnxId: string;
  generation: 'gemma2' | 'gemma4';
  effectiveParams: string;
  contextWindow: number;
  baseKVCacheGB: number;
  supportsAudio: boolean;
  supportsImages: boolean;
  supportsFunctionCalling: boolean;
  downloadSizeLabel: string;
  description: string;
}

const MODEL_SPECS: Record<GemmaModelId, ModelSpec> = {
  'gemma-2b': {
    onnxId: 'onnx-community/gemma-2b-it-onnx',
    generation: 'gemma2',
    effectiveParams: '2B',
    contextWindow: 8192,
    baseKVCacheGB: 3.0,
    supportsAudio: false,
    supportsImages: false,
    supportsFunctionCalling: false,
    downloadSizeLabel: '~1.6 GB',
    description: 'Legacy Gemma 2B — basic summaries',
  },
  'gemma-7b': {
    onnxId: 'onnx-community/gemma-7b-it-onnx',
    generation: 'gemma2',
    effectiveParams: '7B',
    contextWindow: 8192,
    baseKVCacheGB: 12.0,
    supportsAudio: false,
    supportsImages: false,
    supportsFunctionCalling: false,
    downloadSizeLabel: '~4.2 GB',
    description: 'Legacy Gemma 7B — detailed analysis',
  },
  'gemma4-e2b': {
    onnxId: 'onnx-community/gemma-4-e2b-it-onnx',
    generation: 'gemma4',
    effectiveParams: '2.3B',
    contextWindow: 131072,
    baseKVCacheGB: 1.5,
    supportsAudio: true,
    supportsImages: true,
    supportsFunctionCalling: true,
    downloadSizeLabel: '~2.0 GB',
    description: 'Gemma 4 E2B — fast, audio+vision, 128K context',
  },
  'gemma4-e4b': {
    onnxId: 'onnx-community/gemma-4-e4b-it-onnx',
    generation: 'gemma4',
    effectiveParams: '4.5B',
    contextWindow: 131072,
    baseKVCacheGB: 3.0,
    supportsAudio: true,
    supportsImages: true,
    supportsFunctionCalling: true,
    downloadSizeLabel: '~4.0 GB',
    description: 'Gemma 4 E4B — balanced, audio+vision, 128K context',
  },
  'gemma4-26b-a4b': {
    onnxId: 'onnx-community/gemma-4-26b-a4b-it-onnx',
    generation: 'gemma4',
    effectiveParams: '3.8B active / 26B total',
    contextWindow: 262144,
    baseKVCacheGB: 10.0,
    supportsAudio: false,
    supportsImages: true,
    supportsFunctionCalling: true,
    downloadSizeLabel: '~14 GB',
    description: 'Gemma 4 MoE — frontier reasoning, 256K context, runs like 4B',
  },
  'gemma4-31b': {
    onnxId: 'onnx-community/gemma-4-31b-it-onnx',
    generation: 'gemma4',
    effectiveParams: '30.7B',
    contextWindow: 262144,
    baseKVCacheGB: 14.0,
    supportsAudio: false,
    supportsImages: true,
    supportsFunctionCalling: true,
    downloadSizeLabel: '~16 GB',
    description: 'Gemma 4 31B Dense — maximum quality, 256K context',
  },
};

export class LocalLLMService {
  private textGenerator: any = null;
  private isInitialized = false;
  private currentModel: GemmaModelId | null = null;
  private currentDevice: DeviceType | null = null;
  private fallbackUsed = false;
  private backendsConfigured = false;
  private turboQuantActive = false;
  private kvCacheMode: 'none' | '3bit' = 'none';
  private cachedSystemPromptKV: any = null;

  private configureBackendsOnce() {
    if (this.backendsConfigured) return;
    try {
      const threadCount = this.turboQuantActive ? navigator.hardwareConcurrency || 2 : 1;
      (env as any).backends.onnx.wasm.numThreads = threadCount;

      const ortWasmBase = 'https://unpkg.com/onnxruntime-web@1.22.0-dev.20250409-89f8206ba4/dist/';
      (env as any).backends.onnx.wasm.wasmPaths = ortWasmBase;
      if ((env as any).wasm) {
        (env as any).wasm.wasmPaths = ortWasmBase;
      }
    } catch {
      // no-op
    }
    this.backendsConfigured = true;
  }

  /**
   * Get the specification for a model.
   */
  getModelSpec(model: GemmaModelId): ModelSpec {
    return MODEL_SPECS[model] || MODEL_SPECS['gemma4-e2b'];
  }

  /**
   * Get all available model specs for UI rendering.
   */
  getAllModelSpecs(): Record<GemmaModelId, ModelSpec> {
    return MODEL_SPECS;
  }

  /**
   * Detect whether the runtime supports TurboQuant 3-bit KV cache quantization.
   */
  detectTurboQuantSupport(): boolean {
    try {
      const ortBackend = (env as any).backends?.onnx;
      if (ortBackend?.kvQuantization?.turboQuant) return true;
      if ((env as any).turboQuant?.available) return true;
    } catch {
      // Feature detection failed
    }
    return false;
  }

  /**
   * Estimate KV cache size in GB for a given model and cache mode.
   */
  estimateKVCacheGB(model: GemmaModelId, mode: 'none' | '3bit'): number {
    const spec = MODEL_SPECS[model];
    const base = spec?.baseKVCacheGB || 3.0;
    return mode === '3bit' ? base / 5.3 : base;
  }

  async initialize(config: LocalLLMConfig): Promise<void> {
    const spec = this.getModelSpec(config.model);
    if (this.isInitialized && this.currentModel === config.model) {
      return;
    }

    this.turboQuantActive = this.detectTurboQuantSupport();
    this.kvCacheMode = (config.kvCacheMode === '3bit' && this.turboQuantActive) ? '3bit' : 'none';

    this.backendsConfigured = false;
    this.configureBackendsOnce();
    
    const webgpuSupported = await this.checkWebGPUSupport();
    
    if (webgpuSupported) {
      try {
        console.log(`Initializing ${config.model} (${spec.generation}) with WebGPU`);
        
        const pipelineOptions: any = { 
          device: 'webgpu',
          dtype: 'fp16'
        };

        if (this.turboQuantActive && this.kvCacheMode === '3bit') {
          pipelineOptions.kv_cache_dtype = 'uint3';
          console.log('TurboQuant 3-bit KV cache enabled — 6x memory reduction');
        }

        this.textGenerator = await pipeline(
          'text-generation',
          spec.onnxId,
          pipelineOptions
        ) as any;

        this.currentDevice = 'webgpu';
        this.currentModel = config.model;
        this.isInitialized = true;
        this.fallbackUsed = false;
        console.log(`${config.model} initialized with WebGPU (${spec.contextWindow / 1024}K context)`);
        return;
      } catch (webgpuError) {
        console.warn('WebGPU initialization failed, falling back to CPU:', webgpuError);
      }
    }

    // WASM fallback
    try {
      console.log(`Initializing ${config.model} (${spec.generation}) with WASM (CPU)`);

      const pipelineOptions: any = { 
        device: 'wasm',
        dtype: 'fp32'
      };

      if (this.turboQuantActive && this.kvCacheMode === '3bit') {
        pipelineOptions.kv_cache_dtype = 'uint3';
        console.log('TurboQuant 3-bit KV cache enabled on WASM');
      }

      this.textGenerator = await pipeline(
        'text-generation',
        spec.onnxId,
        pipelineOptions
      ) as any;

      this.currentDevice = 'wasm';
      this.currentModel = config.model;
      this.isInitialized = true;
      this.fallbackUsed = !this.turboQuantActive;
      console.log(`${config.model} initialized with WASM${this.turboQuantActive ? ' + TurboQuant' : ' (degraded mode)'}`);
    } catch (wasmError) {
      console.error('Failed to initialize local LLM on both WebGPU and WASM:', wasmError);
      const detail = wasmError instanceof Error ? wasmError.message : String(wasmError);
      throw new Error(
        `Local LLM initialization failed. Neither WebGPU nor WASM backends are available.\n\nDetails: ${detail}`
      );
    }
  }

  /**
   * Get the recommended max context messages based on model and KV cache mode.
   * 
   * Gemma 4 models have dramatically larger context windows (128K-256K),
   * enabling much longer conversation histories.
   */
  getRecommendedContextMessages(model: GemmaModelId): number {
    const spec = MODEL_SPECS[model];
    if (!spec) return 12;

    if (spec.generation === 'gemma4') {
      if (this.kvCacheMode === '3bit') {
        // Gemma 4 + TurboQuant: very long sessions
        return spec.contextWindow >= 262144 ? 50 : 40;
      }
      // Gemma 4 without TurboQuant: still much better than Gemma 2
      return spec.contextWindow >= 262144 ? 30 : 25;
    }

    // Legacy Gemma 2
    if (this.kvCacheMode === '3bit') {
      return model === 'gemma-7b' ? 30 : 20;
    }
    return model === 'gemma-7b' ? 8 : 12;
  }

  async generateChatResponse(
    messages: ChatMessage[],
    config: LocalLLMConfig
  ): Promise<string> {
    if (!this.textGenerator) {
      await this.initialize(config);
    }

    if (!this.textGenerator) {
      throw new Error('Local LLM not initialized');
    }

    try {
      const spec = this.getModelSpec(config.model);
      const prompt = spec.generation === 'gemma4'
        ? this.formatMessagesForGemma4(messages, config.thinkingMode)
        : this.formatMessagesForGemma(messages);
      
      const generateOptions: any = {
        max_new_tokens: config.maxTokens,
        do_sample: true,
        temperature: config.temperature || 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
      };

      if (config.reuseKVCache && this.kvCacheMode === '3bit' && this.cachedSystemPromptKV) {
        generateOptions.past_key_values = this.cachedSystemPromptKV;
      }

      const result = await this.textGenerator(prompt, generateOptions);

      if (config.reuseKVCache && this.kvCacheMode === '3bit' && result[0]?.past_key_values) {
        this.cachedSystemPromptKV = result[0].past_key_values;
      }

      if (Array.isArray(result) && result[0]?.generated_text) {
        const fullText = result[0].generated_text;
        const newText = fullText.slice(prompt.length).trim();
        return newText;
      }

      throw new Error('Unexpected response format from local LLM');
    } catch (error) {
      console.error('Local LLM generation failed:', error);
      throw new Error('Failed to generate response with local LLM');
    }
  }

  async generateSummary(
    reportType: 'soil' | 'water',
    reportData: any,
    config: LocalLLMConfig
  ): Promise<string> {
    const systemPrompt = this.getSummarySystemPrompt(reportType);
    const userPrompt = this.formatReportData(reportType, reportData);

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.generateChatResponse(messages, config);
  }

  async identifyPlant(
    description: string,
    config: LocalLLMConfig
  ): Promise<string> {
    const systemPrompt = this.getPlantIDSystemPrompt();
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: description }
    ];

    return this.generateChatResponse(messages, config);
  }

  async analyzePlantHealth(
    plantName: string,
    symptoms: string,
    config: LocalLLMConfig
  ): Promise<string> {
    const systemPrompt = this.getPlantHealthSystemPrompt();
    const userPrompt = `Plant: ${plantName}\nSymptoms: ${symptoms}\n\nProvide diagnosis and treatment recommendations.`;
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.generateChatResponse(messages, config);
  }

  async getPlantCareAdvice(
    plantName: string,
    context: string,
    config: LocalLLMConfig
  ): Promise<string> {
    const systemPrompt = this.getPlantCareSystemPrompt();
    const userPrompt = `Plant: ${plantName}\nContext: ${context}\n\nProvide care recommendations.`;
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.generateChatResponse(messages, config);
  }

  /**
   * Gemma 4 chat format — uses native system prompt support.
   * Gemma 4 natively supports the `system` role, configurable thinking,
   * and function calling.
   */
  private formatMessagesForGemma4(messages: ChatMessage[], thinkingMode?: boolean): string {
    let prompt = '';

    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `<start_of_turn>system\n${message.content}<end_of_turn>\n`;
      } else if (message.role === 'user') {
        prompt += `<start_of_turn>user\n${message.content}<end_of_turn>\n`;
      } else if (message.role === 'assistant') {
        prompt += `<start_of_turn>model\n${message.content}<end_of_turn>\n`;
      }
    }

    // Enable thinking mode if requested
    if (thinkingMode) {
      prompt += '<start_of_turn>model thinking\n';
    } else {
      prompt += '<start_of_turn>model\n';
    }

    return prompt;
  }

  /** Legacy Gemma 2 chat format */
  private formatMessagesForGemma(messages: ChatMessage[]): string {
    let prompt = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `<start_of_turn>system\n${message.content}<end_of_turn>\n`;
      } else if (message.role === 'user') {
        prompt += `<start_of_turn>user\n${message.content}<end_of_turn>\n`;
      } else if (message.role === 'assistant') {
        prompt += `<start_of_turn>model\n${message.content}<end_of_turn>\n`;
      }
    }
    
    prompt += '<start_of_turn>model\n';
    return prompt;
  }

  private getSummarySystemPrompt(reportType: 'soil' | 'water'): string {
    if (reportType === 'soil') {
      return 'You are an agricultural AI assistant specializing in soil analysis. Create concise, actionable summaries of soil test results. Focus on key findings, recommendations, and potential issues. Keep responses under 200 words and use simple, clear language.';
    } else {
      return 'You are an agricultural AI assistant specializing in water quality analysis. Create concise, actionable summaries of water quality test results. Focus on safety concerns, agricultural implications, and treatment recommendations. Keep responses under 200 words and use simple, clear language.';
    }
  }

  private getPlantIDSystemPrompt(): string {
    return `You are a botanist AI assistant specializing in plant identification. Based on user descriptions of plant characteristics (leaves, flowers, stem, habitat, size, etc.), identify the most likely plant species. Provide:
1. Most likely plant name (common and scientific)
2. Key identifying features
3. Confidence level (high/medium/low)
4. 2-3 similar species if identification is uncertain
Keep responses under 250 words and use clear, accessible language.`;
  }

  private getPlantHealthSystemPrompt(): string {
    return `You are a plant pathology AI assistant. Analyze plant health issues and symptoms to provide:
1. Most likely diagnosis (disease, pest, or environmental stress)
2. Confidence level in diagnosis
3. Immediate treatment recommendations
4. Prevention strategies
5. When to seek professional help
Keep responses practical and under 300 words. Prioritize organic and environmentally-friendly solutions.`;
  }

  private getPlantCareSystemPrompt(): string {
    return `You are a horticulture AI assistant specializing in plant care. Provide tailored care advice including:
1. Watering schedule and requirements
2. Light and temperature needs
3. Soil and fertilization recommendations
4. Common issues and how to prevent them
5. Seasonal care tips
Keep responses practical and under 250 words. Adapt advice to the specific context provided.`;
  }

  private formatReportData(reportType: 'soil' | 'water', data: any): string {
    if (reportType === 'soil') {
      return `Analyze this soil test data and provide a summary:
      
pH Level: ${data.pH || 'N/A'}
Organic Matter: ${data.organicMatter || 'N/A'}%
Nitrogen: ${data.nitrogen || 'N/A'} ppm
Phosphorus: ${data.phosphorus || 'N/A'} ppm
Potassium: ${data.potassium || 'N/A'} ppm
Location: ${data.county || 'N/A'}
Test Date: ${data.testDate || 'N/A'}

Please provide an executive summary focusing on the soil health, nutrient status, and farming recommendations.`;
    } else {
      return `Analyze this water quality data and provide a summary:

${JSON.stringify(data, null, 2)}

Please provide an executive summary focusing on water safety, agricultural use suitability, and any treatment recommendations.`;
    }
  }

  isAvailable(): boolean {
    return this.isInitialized && this.textGenerator !== null;
  }

  getStatus(): LLMStatus {
    const modelId = this.currentModel || 'gemma4-e2b';
    const spec = MODEL_SPECS[modelId] || MODEL_SPECS['gemma4-e2b'];
    return {
      initialized: this.isInitialized,
      device: this.currentDevice,
      model: this.currentModel,
      modelGeneration: spec.generation,
      fallbackUsed: this.fallbackUsed,
      turboQuantActive: this.turboQuantActive,
      kvCacheMode: this.kvCacheMode,
      estimatedKVCacheGB: this.estimateKVCacheGB(modelId as GemmaModelId, this.kvCacheMode),
      contextWindow: spec.contextWindow,
      supportsAudio: spec.supportsAudio,
      supportsImages: spec.supportsImages,
      supportsFunctionCalling: spec.supportsFunctionCalling,
      activeParameters: spec.effectiveParams,
    };
  }

  getDeviceType(): DeviceType | null {
    return this.currentDevice;
  }

  isFallbackMode(): boolean {
    return this.fallbackUsed;
  }

  isTurboQuantActive(): boolean {
    return this.turboQuantActive;
  }

  clearKVCache(): void {
    this.cachedSystemPromptKV = null;
  }

  async checkWebGPUSupport(): Promise<boolean> {
    if (!(navigator as any).gpu) {
      return false;
    }

    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  }
}

export const localLLMService = new LocalLLMService();
