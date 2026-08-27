// llm-router/cache/summary-cache.ts
// L1 cache for soil summaries to meet <100ms patent requirement
// Cache hits: <25ms | Cache misses: fall back to generation

interface SoilState {
  moisture: number;      // 0-100%
  temperature: number;   // Celsius
  ph?: number;          // 0-14
  nitrogen?: number;    // ppm
  phosphorus?: number;  // ppm
  potassium?: number;   // ppm
  [key: string]: number | undefined;
}

interface CachedSummary {
  text: string;
  timestamp: number;
  hitCount: number;
  soilHash: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  avgLatency: number;
}

/**
 * Summary Cache for <100ms patent compliance
 * 
 * Strategy:
 * 1. Normalize soil state to reduce variations
 * 2. Hash to create cache key
 * 3. Return cached summary (<25ms) if available
 * 4. Generate new summary if cache miss
 * 5. Pre-compute common patterns on startup
 */
export class SummaryCache {
  private cache: Map<string, CachedSummary> = new Map();
  private maxSize: number = 1000;  // Max cached summaries
  private ttlMs: number = 3600000; // 1 hour TTL
  private stats = { hits: 0, misses: 0, totalLatency: 0 };

  constructor(options?: { maxSize?: number; ttlMs?: number }) {
    if (options?.maxSize) this.maxSize = options.maxSize;
    if (options?.ttlMs) this.ttlMs = options.ttlMs;
    this.precomputeCommonPatterns();
  }

  /**
   * Get summary for soil state
   * Target: <25ms for cache hit, <100ms total
   */
  async getSummary(
    soilState: SoilState,
    generator: () => Promise<string>
  ): Promise<{ text: string; fromCache: boolean; latencyMs: number }> {
    const startTime = performance.now();
    
    // Normalize and hash soil state
    const normalized = this.normalizeSoilState(soilState);
    const hash = this.hashSoilState(normalized);
    
    // Check cache
    const cached = this.cache.get(hash);
    if (cached && !this.isExpired(cached)) {
      // Cache hit!
      cached.hitCount++;
      const latency = performance.now() - startTime;
      this.stats.hits++;
      this.stats.totalLatency += latency;
      
      return {
        text: cached.text,
        fromCache: true,
        latencyMs: Math.round(latency),
      };
    }
    
    // Cache miss - generate new summary
    this.stats.misses++;
    const generatedText = await generator();
    
    // Store in cache
    this.set(hash, generatedText, soilState);
    
    const latency = performance.now() - startTime;
    this.stats.totalLatency += latency;
    
    return {
      text: generatedText,
      fromCache: false,
      latencyMs: Math.round(latency),
    };
  }

  /**
   * Normalize soil state to reduce cache variations
   * Rounds values to create fewer unique combinations
   */
  private normalizeSoilState(state: SoilState): SoilState {
    return {
      // Round moisture to nearest 5% (0, 5, 10, 15...)
      moisture: Math.round(state.moisture / 5) * 5,
      
      // Round temperature to nearest 2°C
      temperature: Math.round(state.temperature / 2) * 2,
      
      // Round pH to nearest 0.5 if present
      ph: state.ph ? Math.round(state.ph * 2) / 2 : undefined,
      
      // Round NPK to nearest 10ppm if present
      nitrogen: state.nitrogen ? Math.round(state.nitrogen / 10) * 10 : undefined,
      phosphorus: state.phosphorus ? Math.round(state.phosphorus / 10) * 10 : undefined,
      potassium: state.potassium ? Math.round(state.potassium / 10) * 10 : undefined,
    };
  }

  /**
   * Create deterministic hash from soil state
   */
  private hashSoilState(state: SoilState): string {
    const key = `${state.moisture}|${state.temperature}|${state.ph || 'x'}|${state.nitrogen || 'x'}|${state.phosphorus || 'x'}|${state.potassium || 'x'}`;
    return this.simpleHash(key);
  }

  /**
   * Simple hash function (faster than crypto for this use case)
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Store summary in cache
   */
  private set(hash: string, text: string, soilState: SoilState): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(hash, {
      text,
      timestamp: Date.now(),
      hitCount: 1,
      soilHash: hash,
    });
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CachedSummary): boolean {
    return Date.now() - entry.timestamp > this.ttlMs;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldest: [string, CachedSummary] | null = null;
    
    for (const [hash, entry] of this.cache) {
      if (!oldest || entry.timestamp < oldest[1].timestamp) {
        oldest = [hash, entry];
      }
    }
    
    if (oldest) {
      this.cache.delete(oldest[0]);
    }
  }

  /**
   * Pre-compute common soil state patterns
   * Ensures popular combinations are always cached
   */
  private precomputeCommonPatterns(): void {
    const commonPatterns: SoilState[] = [
      // Optimal conditions
      { moisture: 30, temperature: 20, ph: 6.5, nitrogen: 50, phosphorus: 30, potassium: 40 },
      { moisture: 35, temperature: 22, ph: 6.8, nitrogen: 60, phosphorus: 35, potassium: 45 },
      
      // Dry conditions
      { moisture: 15, temperature: 25, ph: 6.5, nitrogen: 40, phosphorus: 25, potassium: 35 },
      { moisture: 10, temperature: 28, ph: 7.0, nitrogen: 35, phosphorus: 20, potassium: 30 },
      
      // Wet conditions
      { moisture: 50, temperature: 18, ph: 6.2, nitrogen: 45, phosphorus: 28, potassium: 38 },
      { moisture: 60, temperature: 16, ph: 6.0, nitrogen: 40, phosphorus: 25, potassium: 35 },
      
      // Cold conditions
      { moisture: 25, temperature: 10, ph: 6.5, nitrogen: 45, phosphorus: 30, potassium: 40 },
      { moisture: 20, temperature: 5, ph: 6.8, nitrogen: 40, phosphorus: 25, potassium: 35 },
      
      // Hot conditions
      { moisture: 20, temperature: 30, ph: 6.5, nitrogen: 35, phosphorus: 20, potassium: 30 },
      { moisture: 15, temperature: 35, ph: 7.0, nitrogen: 30, phosphorus: 15, potassium: 25 },
    ];
    
    // Pre-generate summaries for common patterns
    // (Would be done async in real implementation)
    console.log(`[SummaryCache] Pre-computing ${commonPatterns.length} common patterns...`);
    
    // Store placeholder summaries (would call LLM in real implementation)
    for (const pattern of commonPatterns) {
      const normalized = this.normalizeSoilState(pattern);
      const hash = this.hashSoilState(normalized);
      
      this.cache.set(hash, {
        text: this.generatePlaceholderSummary(pattern),
        timestamp: Date.now(),
        hitCount: 0,
        soilHash: hash,
      });
    }
    
    console.log(`[SummaryCache] Pre-computed ${this.cache.size} summaries`);
  }

  /**
   * Generate placeholder summary (would call LLM in production)
   */
  private generatePlaceholderSummary(state: SoilState): string {
    const conditions = [];
    
    if (state.moisture < 20) conditions.push("dry");
    else if (state.moisture > 50) conditions.push("wet");
    else conditions.push("optimal moisture");
    
    if (state.temperature < 10) conditions.push("cold");
    else if (state.temperature > 30) conditions.push("hot");
    else conditions.push("moderate temperature");
    
    return `Soil shows ${conditions.join(", ")}. Monitor ${state.moisture < 20 ? "irrigation" : state.moisture > 50 ? "drainage" : "nutrients"}.`;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? Math.round((this.stats.hits / total) * 100) : 0,
      avgLatency: total > 0 ? Math.round(this.stats.totalLatency / total) : 0,
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, totalLatency: 0 };
  }
}

// Singleton instance
export const summaryCache = new SummaryCache();

export default SummaryCache;
