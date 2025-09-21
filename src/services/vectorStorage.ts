import { DocumentEmbedding } from './embeddingService';

export interface StorageStats {
  totalDocuments: number;
  totalSize: number;
  lastUpdated: Date;
  indexVersions: string[];
}

export class VectorStorage {
  private dbName = 'soilsidekick-vectors';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    if (this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Vector storage initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create document embeddings store
        if (!db.objectStoreNames.contains('embeddings')) {
          const embeddingStore = db.createObjectStore('embeddings', { keyPath: 'id' });
          embeddingStore.createIndex('userId', 'metadata.userId', { unique: false });
          embeddingStore.createIndex('type', 'metadata.type', { unique: false });
          embeddingStore.createIndex('countyFips', 'metadata.countyFips', { unique: false });
          embeddingStore.createIndex('cropType', 'metadata.cropType', { unique: false });
          embeddingStore.createIndex('createdAt', 'metadata.createdAt', { unique: false });
        }

        // Create metadata store for indexing info
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }

        console.log('Vector storage schema upgraded');
      };
    });
  }

  async storeEmbedding(embedding: DocumentEmbedding): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readwrite');
      const store = transaction.objectStore('embeddings');

      const request = store.put(embedding);

      request.onsuccess = () => {
        console.log(`Stored embedding for document: ${embedding.id}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to store embedding'));
      };
    });
  }

  async storeMultipleEmbeddings(embeddings: DocumentEmbedding[]): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readwrite');
      const store = transaction.objectStore('embeddings');

      let completed = 0;
      const total = embeddings.length;

      if (total === 0) {
        resolve();
        return;
      }

      for (const embedding of embeddings) {
        const request = store.put(embedding);

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            console.log(`Stored ${total} embeddings successfully`);
            resolve();
          }
        };

        request.onerror = () => {
          reject(new Error(`Failed to store embedding: ${embedding.id}`));
        };
      }
    });
  }

  async getEmbedding(id: string): Promise<DocumentEmbedding | null> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readonly');
      const store = transaction.objectStore('embeddings');

      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve embedding'));
      };
    });
  }

  async getAllEmbeddings(): Promise<DocumentEmbedding[]> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readonly');
      const store = transaction.objectStore('embeddings');

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve embeddings'));
      };
    });
  }

  async getEmbeddingsByUser(userId: string): Promise<DocumentEmbedding[]> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readonly');
      const store = transaction.objectStore('embeddings');
      const index = store.index('userId');

      const request = index.getAll(userId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve user embeddings'));
      };
    });
  }

  async getEmbeddingsByType(
    type: DocumentEmbedding['metadata']['type'], 
    userId?: string
  ): Promise<DocumentEmbedding[]> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readonly');
      const store = transaction.objectStore('embeddings');
      const index = store.index('type');

      const request = index.getAll(type);

      request.onsuccess = () => {
        let results = request.result;
        
        // Filter by userId if provided
        if (userId) {
          results = results.filter(doc => doc.metadata.userId === userId);
        }
        
        resolve(results);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve embeddings by type'));
      };
    });
  }

  async deleteEmbedding(id: string): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readwrite');
      const store = transaction.objectStore('embeddings');

      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`Deleted embedding: ${id}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete embedding'));
      };
    });
  }

  async deleteUserEmbeddings(userId: string): Promise<void> {
    const userEmbeddings = await this.getEmbeddingsByUser(userId);
    
    for (const embedding of userEmbeddings) {
      await this.deleteEmbedding(embedding.id);
    }
  }

  async clearAllEmbeddings(): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['embeddings'], 'readwrite');
      const store = transaction.objectStore('embeddings');

      const request = store.clear();

      request.onsuccess = () => {
        console.log('All embeddings cleared');
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear embeddings'));
      };
    });
  }

  async getStorageStats(): Promise<StorageStats> {
    const allEmbeddings = await this.getAllEmbeddings();
    
    const totalSize = allEmbeddings.reduce((size, doc) => {
      // Estimate size: text length + embedding array length * 8 bytes (float64)
      return size + doc.text.length + (doc.embedding.length * 8);
    }, 0);

    const lastUpdated = allEmbeddings.length > 0 
      ? new Date(Math.max(...allEmbeddings.map(doc => new Date(doc.metadata.createdAt).getTime())))
      : new Date();

    return {
      totalDocuments: allEmbeddings.length,
      totalSize,
      lastUpdated,
      indexVersions: ['v1.0'] // For future versioning
    };
  }

  async exportEmbeddings(): Promise<string> {
    const allEmbeddings = await this.getAllEmbeddings();
    const exportData = {
      version: '1.0',
      exported: new Date().toISOString(),
      embeddings: allEmbeddings
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async importEmbeddings(jsonData: string): Promise<number> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.embeddings || !Array.isArray(importData.embeddings)) {
        throw new Error('Invalid import data format');
      }

      await this.storeMultipleEmbeddings(importData.embeddings);
      
      console.log(`Imported ${importData.embeddings.length} embeddings`);
      return importData.embeddings.length;
    } catch (error) {
      console.error('Failed to import embeddings:', error);
      throw new Error('Failed to import embeddings');
    }
  }
}

export const vectorStorage = new VectorStorage();