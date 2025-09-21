import { pipeline } from '@huggingface/transformers';

export interface EmbeddingConfig {
  model: 'mixedbread-ai/mxbai-embed-xsmall-v1' | 'sentence-transformers/all-MiniLM-L6-v2';
  device: 'webgpu' | 'wasm';
}

export interface DocumentEmbedding {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    type: 'soil_analysis' | 'water_quality' | 'field_data' | 'planting_optimization';
    userId: string;
    countyFips?: string;
    cropType?: string;
    createdAt: string;
    title?: string;
  };
}

export interface SearchResult {
  document: DocumentEmbedding;
  similarity: number;
}

declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<any>;
    };
  }
}

export class EmbeddingService {
  private embedder: any = null;
  private isInitialized = false;
  private currentModel: string | null = null;

  async initialize(config: EmbeddingConfig): Promise<void> {
    if (this.isInitialized && this.currentModel === config.model) {
      return;
    }

    try {
      console.log(`Initializing embedding model: ${config.model}`);
      
      // Check WebGPU support
      const supportsWebGPU = await this.checkWebGPUSupport();
      const device = supportsWebGPU && config.device === 'webgpu' ? 'webgpu' : 'wasm';
      
      console.log(`Using device: ${device}`);

      // Initialize the embedding pipeline
      this.embedder = await pipeline(
        'feature-extraction',
        config.model,
        { 
          device,
          dtype: device === 'webgpu' ? 'fp16' : 'fp32'
        }
      ) as any;

      this.currentModel = config.model;
      this.isInitialized = true;
      console.log('Embedding service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize embedding service:', error);
      throw new Error('Embedding service initialization failed');
    }
  }

  async generateEmbedding(text: string, config: EmbeddingConfig): Promise<number[]> {
    if (!this.embedder) {
      await this.initialize(config);
    }

    if (!this.embedder) {
      throw new Error('Embedding service not initialized');
    }

    try {
      // Clean and normalize text
      const cleanText = this.preprocessText(text);
      
      // Generate embedding
      const result = await this.embedder(cleanText, { 
        pooling: 'mean', 
        normalize: true 
      });

      // Convert to regular array with proper type casting
      const embedding = Array.from(result.data) as number[];
      console.log(`Generated embedding of dimension: ${embedding.length}`);
      
      return embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw new Error('Failed to generate text embedding');
    }
  }

  async generateDocumentEmbedding(
    id: string,
    text: string,
    metadata: DocumentEmbedding['metadata'],
    config: EmbeddingConfig
  ): Promise<DocumentEmbedding> {
    const embedding = await this.generateEmbedding(text, config);
    
    return {
      id,
      text,
      embedding,
      metadata
    };
  }

  private preprocessText(text: string): string {
    // Clean and normalize text for better embeddings
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\-.,!?]/g, '') // Remove special characters
      .trim()
      .substring(0, 512); // Limit length for efficiency
  }

  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    
    if (magnitude === 0) {
      return 0;
    }

    return dotProduct / magnitude;
  }

  searchSimilarDocuments(
    queryEmbedding: number[],
    documents: DocumentEmbedding[],
    limit: number = 10,
    threshold: number = 0.5
  ): SearchResult[] {
    const results: SearchResult[] = [];

    for (const doc of documents) {
      const similarity = this.calculateCosineSimilarity(queryEmbedding, doc.embedding);
      
      if (similarity >= threshold) {
        results.push({
          document: doc,
          similarity
        });
      }
    }

    // Sort by similarity (highest first) and limit results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
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

  isAvailable(): boolean {
    return this.isInitialized && this.embedder !== null;
  }

  getDefaultConfig(): EmbeddingConfig {
    return {
      model: 'mixedbread-ai/mxbai-embed-xsmall-v1',
      device: 'webgpu'
    };
  }
}

export const embeddingService = new EmbeddingService();