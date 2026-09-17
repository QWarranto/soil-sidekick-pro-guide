import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { embeddingService, EmbeddingConfig, DocumentEmbedding, SearchResult } from '../services/embeddingService';
import { vectorStorage } from '../services/vectorStorage';
import { useToast } from '../components/ui/use-toast';

export interface SemanticSearchState {
  isInitialized: boolean;
  isIndexing: boolean;
  isSearching: boolean;
  indexingProgress: number;
  totalDocuments: number;
  error: string | null;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  documentTypes?: DocumentEmbedding['metadata']['type'][];
  countyFips?: string;
  cropType?: string;
}

export interface IndexingProgress {
  current: number;
  total: number;
  currentDocument: string;
}

export const useSemanticSearch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<SemanticSearchState>({
    isInitialized: false,
    isIndexing: false,
    isSearching: false,
    indexingProgress: 0,
    totalDocuments: 0,
    error: null
  });

  const [embeddingConfig] = useState<EmbeddingConfig>({
    model: 'mixedbread-ai/mxbai-embed-xsmall-v1',
    device: 'webgpu'
  });

  // Initialize services
  const initializeSearch = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      console.log('Initializing semantic search...');
      await Promise.all([
        embeddingService.initialize(embeddingConfig),
        vectorStorage.initialize()
      ]);

      const stats = await vectorStorage.getStorageStats();
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        totalDocuments: stats.totalDocuments
      }));

      console.log('Semantic search initialized successfully');
      
      toast({
        title: "Search Ready",
        description: `Semantic search initialized with ${stats.totalDocuments} documents`,
      });

    } catch (error) {
      console.error('Failed to initialize semantic search:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Initialization failed',
        isInitialized: false 
      }));
      
      toast({
        title: "Search Initialization Failed",
        description: "Could not initialize semantic search. Try refreshing the page.",
        variant: "destructive"
      });
    }
  }, [embeddingConfig, toast]);

  // Index agricultural documents
  const indexDocuments = useCallback(async (documents: Array<{
    id: string;
    text: string;
    metadata: DocumentEmbedding['metadata'];
  }>) => {
    if (!user) {
      throw new Error('User must be authenticated to index documents');
    }

    try {
      setState(prev => ({ ...prev, isIndexing: true, indexingProgress: 0 }));

      const embeddings: DocumentEmbedding[] = [];
      
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        
        setState(prev => ({ 
          ...prev, 
          indexingProgress: Math.round((i / documents.length) * 100)
        }));

        console.log(`Indexing document ${i + 1}/${documents.length}: ${doc.id}`);

        const embedding = await embeddingService.generateDocumentEmbedding(
          doc.id,
          doc.text,
          {
            ...doc.metadata,
            userId: user.id
          },
          embeddingConfig
        );

        embeddings.push(embedding);
      }

      // Store all embeddings in batch
      await vectorStorage.storeMultipleEmbeddings(embeddings);

      const stats = await vectorStorage.getStorageStats();
      
      setState(prev => ({
        ...prev,
        isIndexing: false,
        indexingProgress: 100,
        totalDocuments: stats.totalDocuments
      }));

      toast({
        title: "Documents Indexed",
        description: `Successfully indexed ${documents.length} documents`,
      });

      console.log(`Successfully indexed ${documents.length} documents`);
      return embeddings.length;

    } catch (error) {
      console.error('Failed to index documents:', error);
      setState(prev => ({ 
        ...prev, 
        isIndexing: false,
        error: error instanceof Error ? error.message : 'Indexing failed'
      }));
      
      toast({
        title: "Indexing Failed",
        description: "Could not index documents. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [user, embeddingConfig, toast]);

  // Search for similar documents
  const searchSimilar = useCallback(async (
    query: string, 
    options: SearchOptions = {}
  ): Promise<SearchResult[]> => {
    if (!user) {
      throw new Error('User must be authenticated to search');
    }

    try {
      setState(prev => ({ ...prev, isSearching: true, error: null }));

      // Generate query embedding
      const queryEmbedding = await embeddingService.generateEmbedding(query, embeddingConfig);

      // Get relevant documents based on filters
      let documents: DocumentEmbedding[];
      
      if (options.documentTypes && options.documentTypes.length > 0) {
        documents = [];
        for (const type of options.documentTypes) {
          const typeDocuments = await vectorStorage.getEmbeddingsByType(type, user.id);
          documents.push(...typeDocuments);
        }
      } else {
        documents = await vectorStorage.getEmbeddingsByUser(user.id);
      }

      // Apply additional filters
      if (options.countyFips) {
        documents = documents.filter(doc => doc.metadata.countyFips === options.countyFips);
      }
      
      if (options.cropType) {
        documents = documents.filter(doc => doc.metadata.cropType === options.cropType);
      }

      // Perform similarity search
      const results = embeddingService.searchSimilarDocuments(
        queryEmbedding,
        documents,
        options.limit || 10,
        options.threshold || 0.5
      );

      setState(prev => ({ ...prev, isSearching: false }));
      
      console.log(`Found ${results.length} similar documents for query: "${query}"`);
      return results;

    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({ 
        ...prev, 
        isSearching: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }));
      
      toast({
        title: "Search Failed",
        description: "Could not perform search. Please try again.",
        variant: "destructive"
      });
      
      return [];
    }
  }, [user, embeddingConfig, toast]);

  // Get storage statistics
  const getStorageInfo = useCallback(async () => {
    try {
      return await vectorStorage.getStorageStats();
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }, []);

  // Clear all user embeddings
  const clearUserIndex = useCallback(async () => {
    if (!user) return;

    try {
      await vectorStorage.deleteUserEmbeddings(user.id);
      
      const stats = await vectorStorage.getStorageStats();
      setState(prev => ({ 
        ...prev, 
        totalDocuments: stats.totalDocuments 
      }));

      toast({
        title: "Index Cleared",
        description: "All your indexed documents have been removed",
      });

    } catch (error) {
      console.error('Failed to clear index:', error);
      toast({
        title: "Clear Failed",
        description: "Could not clear document index",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Auto-initialize when user is available
  useEffect(() => {
    if (user && !state.isInitialized && !state.error) {
      initializeSearch();
    }
  }, [user, state.isInitialized, state.error, initializeSearch]);

  return {
    state,
    initializeSearch,
    indexDocuments,
    searchSimilar,
    getStorageInfo,
    clearUserIndex,
    embeddingConfig,
    isReady: state.isInitialized && embeddingService.isAvailable()
  };
};