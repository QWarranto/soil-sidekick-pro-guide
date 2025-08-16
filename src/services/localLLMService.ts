import { pipeline } from '@huggingface/transformers';

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

export class LocalLLMService {
  private textGenerator: any = null;
  private isInitialized = false;
  private currentModel: string | null = null;

  async initialize(config: LocalLLMConfig): Promise<void> {
    if (this.isInitialized && this.currentModel === this.getModelName(config.model)) {
      return;
    }

    try {
      console.log(`Initializing local LLM: ${config.model}`);
      
      // Initialize the text generation pipeline with Gemma
      this.textGenerator = await pipeline(
        'text-generation',
        this.getModelName(config.model),
        { 
          device: 'webgpu',
          dtype: 'fp16'
        }
      ) as any;

      this.currentModel = this.getModelName(config.model);
      this.isInitialized = true;
      console.log('Local LLM initialized successfully');
    } catch (error) {
      console.error('Failed to initialize local LLM:', error);
      throw new Error('Local LLM initialization failed. Please check your browser supports WebGPU.');
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