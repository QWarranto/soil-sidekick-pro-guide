import { pipeline, env } from '@huggingface/transformers';

export interface LocalLLMConfig {
  model: 'gemma-2b' | 'gemma-7b';
  maxTokens: number;
  temperature?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<any>;
    };
  }
}

export type DeviceType = 'webgpu' | 'wasm';

export interface LLMStatus {
  initialized: boolean;
  device: DeviceType | null;
  model: string | null;
  fallbackUsed: boolean;
}

export class LocalLLMService {
  private textGenerator: any = null;
  private isInitialized = false;
  private currentModel: string | null = null;
  private currentDevice: DeviceType | null = null;
  private fallbackUsed = false;
  private backendsConfigured = false;

  private configureBackendsOnce() {
    if (this.backendsConfigured) return;
    try {
      // In embedded/preview environments, crossOriginIsolated is often false.
      // Force single-threaded WASM so ORT can still initialize.
      (env as any).backends.onnx.wasm.numThreads = 1;

      // Point ORT to CDN-hosted WASM artifacts (too large to bundle into repo)
      const ortWasmBase = 'https://unpkg.com/onnxruntime-web@1.22.0-dev.20250409-89f8206ba4/dist/';
      (env as any).backends.onnx.wasm.wasmPaths = ortWasmBase;
      // Some versions also look under env.wasm
      if ((env as any).wasm) {
        (env as any).wasm.wasmPaths = ortWasmBase;
      }
    } catch {
      // no-op: env/backends may differ across transformers.js versions
    }
    this.backendsConfigured = true;
  }

  async initialize(config: LocalLLMConfig): Promise<void> {
    if (this.isInitialized && this.currentModel === this.getModelName(config.model)) {
      return;
    }

    const modelName = this.getModelName(config.model);

    // Configure ORT backends for embedded/browser environments
    this.configureBackendsOnce();
    
    // Try WebGPU first, then fallback to WASM (CPU)
    const webgpuSupported = await this.checkWebGPUSupport();
    
    if (webgpuSupported) {
      try {
        console.log(`Initializing local LLM with WebGPU: ${config.model}`);
        this.textGenerator = await pipeline(
          'text-generation',
          modelName,
          { 
            device: 'webgpu',
            dtype: 'fp16'
          }
        ) as any;

        this.currentDevice = 'webgpu';
        this.currentModel = modelName;
        this.isInitialized = true;
        this.fallbackUsed = false;
        console.log('Local LLM initialized successfully with WebGPU');
        return;
      } catch (webgpuError) {
        console.warn('WebGPU initialization failed, falling back to CPU:', webgpuError);
      }
    }

    // Fallback to WASM (CPU)
    try {
      console.log(`Initializing local LLM with WASM (CPU) fallback: ${config.model}`);
      this.textGenerator = await pipeline(
        'text-generation',
        modelName,
        { 
          device: 'wasm',
          dtype: 'fp32'
        }
      ) as any;

      this.currentDevice = 'wasm';
      this.currentModel = modelName;
      this.isInitialized = true;
      this.fallbackUsed = true;
      console.log('Local LLM initialized successfully with WASM (CPU fallback mode)');
    } catch (wasmError) {
      console.error('Failed to initialize local LLM on both WebGPU and WASM:', wasmError);
      const detail = wasmError instanceof Error ? wasmError.message : String(wasmError);
      throw new Error(
        `Local LLM initialization failed. Neither WebGPU nor WASM backends are available.\n\nDetails: ${detail}`
      );
    }
  }

  private getModelName(model: 'gemma-2b' | 'gemma-7b'): string {
    switch (model) {
      case 'gemma-2b':
        return 'onnx-community/gemma-2b-it-onnx';
      case 'gemma-7b':
        return 'onnx-community/gemma-7b-it-onnx';
      default:
        return 'onnx-community/gemma-2b-it-onnx';
    }
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
      // Format messages for Gemma chat format
      const prompt = this.formatMessagesForGemma(messages);
      
      const result = await this.textGenerator(prompt, {
        max_new_tokens: config.maxTokens,
        do_sample: true,
        temperature: config.temperature || 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
      });

      if (Array.isArray(result) && result[0]?.generated_text) {
        // Extract only the new generated text (remove the prompt)
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
    
    // Add the model turn start for generation
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
    return {
      initialized: this.isInitialized,
      device: this.currentDevice,
      model: this.currentModel,
      fallbackUsed: this.fallbackUsed
    };
  }

  getDeviceType(): DeviceType | null {
    return this.currentDevice;
  }

  isFallbackMode(): boolean {
    return this.fallbackUsed;
  }

  async checkWebGPUSupport(): Promise<boolean> {
    if (!navigator.gpu) {
      return false;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  }
}

export const localLLMService = new LocalLLMService();