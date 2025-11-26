/**
 * Aggressive Caching Manager for External API Responses
 * Reduces load on EPA, USDA, and Google Earth Engine APIs
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

export interface CacheOptions {
  provider: string;
  key: string;
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
  countyFips?: string;
}

export class APICacheManager {
  private supabase: any;
  private memoryCache: Map<string, {
    data: any;
    expiresAt: number;
    isStale: boolean;
  }> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.startCleanup();
  }

  /**
   * Get cached data or execute fetcher
   */
  async getOrFetch<T>(
    options: CacheOptions,
    fetcher: () => Promise<T>
  ): Promise<{ data: T; fromCache: boolean; cacheLevel: string }> {
    const cacheKey = this.generateCacheKey(options);

    // 1. Check memory cache first (fastest)
    const memCached = this.memoryCache.get(cacheKey);
    if (memCached) {
      if (memCached.expiresAt > Date.now()) {
        console.log(`[Cache] Memory HIT: ${options.provider}/${options.key}`);
        return { data: memCached.data, fromCache: true, cacheLevel: 'memory' };
      }

      // Stale data - return if stale-while-revalidate enabled
      if (options.staleWhileRevalidate && memCached.isStale) {
        console.log(`[Cache] Memory STALE: ${options.provider}/${options.key} - serving stale, revalidating in background`);
        
        // Revalidate in background
        this.revalidateInBackground(options, fetcher, cacheKey);
        
        return { data: memCached.data, fromCache: true, cacheLevel: 'memory-stale' };
      }

      // Expired - remove from memory
      this.memoryCache.delete(cacheKey);
    }

    // 2. Check database cache (persistent)
    try {
      const { data: dbCached, error } = await this.supabase
        .from('fips_data_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .eq('data_source', options.provider)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbCached && !error) {
        console.log(`[Cache] Database HIT: ${options.provider}/${options.key}`);
        
        // Store in memory for faster future access
        this.setMemoryCache(cacheKey, dbCached.cached_data, options.ttl);
        
        // Update access statistics
        await this.supabase
          .from('fips_data_cache')
          .update({
            access_count: (dbCached.access_count || 0) + 1,
            last_accessed: new Date().toISOString()
          })
          .eq('id', dbCached.id);

        return { data: dbCached.cached_data, fromCache: true, cacheLevel: 'database' };
      }
    } catch (error) {
      console.error('[Cache] Database lookup error:', error);
      // Continue to fetch fresh data
    }

    // 3. Cache MISS - fetch fresh data
    console.log(`[Cache] MISS: ${options.provider}/${options.key} - fetching fresh data`);
    
    try {
      const freshData = await fetcher();
      
      // Store in both caches
      await this.set(options, freshData);
      
      return { data: freshData, fromCache: false, cacheLevel: 'none' };
    } catch (error) {
      // If fetch fails, try to serve stale data as last resort
      const staleData = await this.getStaleData(cacheKey, options.provider);
      if (staleData) {
        console.warn(`[Cache] Fetch failed, serving STALE data:`, error);
        return { data: staleData, fromCache: true, cacheLevel: 'database-stale' };
      }
      throw error;
    }
  }

  /**
   * Store data in cache
   */
  async set(options: CacheOptions, data: any): Promise<void> {
    const cacheKey = this.generateCacheKey(options);
    
    // Store in memory cache
    this.setMemoryCache(cacheKey, data, options.ttl);

    // Store in database cache
    try {
      await this.supabase
        .from('fips_data_cache')
        .upsert({
          cache_key: cacheKey,
          data_source: options.provider,
          county_fips: options.countyFips || 'global',
          cached_data: data,
          cache_level: 1,
          expires_at: new Date(Date.now() + options.ttl).toISOString(),
          access_count: 1,
          last_accessed: new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'cache_key,data_source'
        });

      console.log(`[Cache] Stored: ${options.provider}/${options.key}`);
    } catch (error) {
      console.error('[Cache] Failed to store in database:', error);
    }
  }

  /**
   * Invalidate cache entry
   */
  async invalidate(options: CacheOptions): Promise<void> {
    const cacheKey = this.generateCacheKey(options);
    
    // Remove from memory
    this.memoryCache.delete(cacheKey);

    // Remove from database
    try {
      await this.supabase
        .from('fips_data_cache')
        .delete()
        .eq('cache_key', cacheKey)
        .eq('data_source', options.provider);

      console.log(`[Cache] Invalidated: ${options.provider}/${options.key}`);
    } catch (error) {
      console.error('[Cache] Failed to invalidate:', error);
    }
  }

  /**
   * Get statistics for monitoring
   */
  async getStats(): Promise<{
    memorySize: number;
    databaseSize: number;
    hitRate: number;
  }> {
    const { count } = await this.supabase
      .from('fips_data_cache')
      .select('*', { count: 'exact', head: true });

    return {
      memorySize: this.memoryCache.size,
      databaseSize: count || 0,
      hitRate: 0, // TODO: Implement hit rate tracking
    };
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(options: CacheOptions): string {
    return `${options.provider}:${options.key}:${options.countyFips || 'global'}`;
  }

  /**
   * Set memory cache with expiration
   */
  private setMemoryCache(key: string, data: any, ttl: number): void {
    const expiresAt = Date.now() + ttl;
    this.memoryCache.set(key, {
      data,
      expiresAt,
      isStale: false,
    });

    // Mark as stale after 80% of TTL
    const staleAt = Date.now() + (ttl * 0.8);
    setTimeout(() => {
      const entry = this.memoryCache.get(key);
      if (entry) {
        entry.isStale = true;
      }
    }, staleAt - Date.now());
  }

  /**
   * Get stale data from database as fallback
   */
  private async getStaleData(cacheKey: string, provider: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('fips_data_cache')
        .select('cached_data')
        .eq('cache_key', cacheKey)
        .eq('data_source', provider)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return data?.cached_data || null;
    } catch (error) {
      console.error('[Cache] Failed to get stale data:', error);
      return null;
    }
  }

  /**
   * Revalidate cache in background
   */
  private async revalidateInBackground<T>(
    options: CacheOptions,
    fetcher: () => Promise<T>,
    cacheKey: string
  ): Promise<void> {
    try {
      const freshData = await fetcher();
      await this.set(options, freshData);
      console.log(`[Cache] Background revalidation complete: ${options.provider}/${options.key}`);
    } catch (error) {
      console.error(`[Cache] Background revalidation failed:`, error);
    }
  }

  /**
   * Periodic cleanup of expired memory cache
   */
  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      this.memoryCache.forEach((value, key) => {
        if (value.expiresAt < now) {
          this.memoryCache.delete(key);
          cleaned++;
        }
      });

      if (cleaned > 0) {
        console.log(`[Cache] Cleaned ${cleaned} expired entries from memory`);
      }
    }, 60000); // Every minute
  }
}
