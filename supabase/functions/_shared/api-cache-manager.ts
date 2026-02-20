/**
 * Aggressive Caching Manager for External API Responses
 * Reduces load on EPA, USDA, and Google Earth Engine APIs
 *
 * Public API:
 *   get(cacheKey, countyFips, provider)           → { data, cache_level } | null
 *   set(cacheKey, data, countyFips, provider, ttl) → void
 *   getOrFetch(options, fetcher)                   → { data, fromCache, cacheLevel }
 *   invalidate(options)                            → void
 *   getStats()                                     → { memorySize, databaseSize, hitRate }
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

  // ---------------------------------------------------------------------------
  // Simple positional get/set — for callers that manage their own cache keys
  // ---------------------------------------------------------------------------

  /**
   * Look up a cached value by plain key + provider.
   * Returns { data, cache_level } on hit, null on miss.
   */
  async get(
    cacheKey: string,
    countyFips: string,
    provider: string
  ): Promise<{ data: any; cache_level: number } | null> {
    const key = this.buildKey(provider, cacheKey, countyFips);

    // 1. Memory cache first (fastest)
    const mem = this.memoryCache.get(key);
    if (mem && mem.expiresAt > Date.now()) {
      console.log(`[Cache] Memory HIT: ${provider}/${cacheKey}`);
      return { data: mem.data, cache_level: 0 };
    }

    // 2. Database cache
    try {
      const { data: row, error } = await this.supabase
        .from('fips_data_cache')
        .select('cached_data, cache_level')
        .eq('cache_key', key)
        .eq('data_source', provider)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && row?.cached_data) {
        console.log(`[Cache] DB HIT: ${provider}/${cacheKey}`);
        this.setMemoryCache(key, row.cached_data, 3_600_000);
        return { data: row.cached_data, cache_level: row.cache_level };
      }
    } catch (err) {
      console.error('[Cache] get() DB error:', err);
    }
    return null;
  }

  /**
   * Store a value by plain key + provider.
   * Defaults to a 24-hour TTL.
   */
  async set(
    cacheKey: string,
    data: any,
    countyFips: string,
    provider: string,
    ttlMs = 86_400_000
  ): Promise<void> {
    const key = this.buildKey(provider, cacheKey, countyFips);
    this.setMemoryCache(key, data, ttlMs);
    try {
      await this.supabase.from('fips_data_cache').upsert(
        {
          cache_key: key,
          data_source: provider,
          county_fips: countyFips || 'global',
          cached_data: data,
          cache_level: 1,
          expires_at: new Date(Date.now() + ttlMs).toISOString(),
          access_count: 1,
          last_accessed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'cache_key,data_source' }
      );
      console.log(`[Cache] SET: ${provider}/${cacheKey}`);
    } catch (err) {
      console.error('[Cache] set() DB error:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // Options-based getOrFetch — for callers that want automatic fetch + cache
  // ---------------------------------------------------------------------------

  /**
   * Get cached data or execute fetcher if not cached.
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

      // Stale data — return if stale-while-revalidate enabled
      if (options.staleWhileRevalidate && memCached.isStale) {
        console.log(`[Cache] Memory STALE: ${options.provider}/${options.key} — revalidating`);
        this.revalidateInBackground(options, fetcher, cacheKey);
        return { data: memCached.data, fromCache: true, cacheLevel: 'memory-stale' };
      }

      // Expired — remove from memory
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
        this.setMemoryCache(cacheKey, dbCached.cached_data, options.ttl);

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
    }

    // 3. Cache MISS — fetch fresh data
    console.log(`[Cache] MISS: ${options.provider}/${options.key} — fetching`);
    try {
      const freshData = await fetcher();
      await this.setWithOptions(options, freshData);
      return { data: freshData, fromCache: false, cacheLevel: 'none' };
    } catch (error) {
      const staleData = await this.getStaleData(cacheKey, options.provider);
      if (staleData) {
        console.warn('[Cache] Fetch failed, serving STALE data:', error);
        return { data: staleData, fromCache: true, cacheLevel: 'database-stale' };
      }
      throw error;
    }
  }

  /**
   * Invalidate a cache entry (options-based).
   */
  async invalidate(options: CacheOptions): Promise<void> {
    const cacheKey = this.generateCacheKey(options);
    this.memoryCache.delete(cacheKey);
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
   * Get statistics for monitoring.
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

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /** Build the canonical cache key used by positional get/set. */
  private buildKey(provider: string, cacheKey: string, countyFips: string): string {
    return `${provider}:${cacheKey}:${countyFips || 'global'}`;
  }

  /** Build the cache key used by the options-based API. */
  private generateCacheKey(options: CacheOptions): string {
    return `${options.provider}:${options.key}:${options.countyFips || 'global'}`;
  }

  /** Options-based upsert (used internally by getOrFetch). */
  private async setWithOptions(options: CacheOptions, data: any): Promise<void> {
    const cacheKey = this.generateCacheKey(options);
    this.setMemoryCache(cacheKey, data, options.ttl);
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
        }, { onConflict: 'cache_key,data_source' });
      console.log(`[Cache] Stored: ${options.provider}/${options.key}`);
    } catch (error) {
      console.error('[Cache] Failed to store in database:', error);
    }
  }

  private setMemoryCache(key: string, data: any, ttl: number): void {
    const expiresAt = Date.now() + ttl;
    this.memoryCache.set(key, { data, expiresAt, isStale: false });

    // Mark as stale after 80% of TTL
    setTimeout(() => {
      const entry = this.memoryCache.get(key);
      if (entry) entry.isStale = true;
    }, ttl * 0.8);
  }

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

  private async revalidateInBackground<T>(
    options: CacheOptions,
    fetcher: () => Promise<T>,
    cacheKey: string
  ): Promise<void> {
    try {
      const freshData = await fetcher();
      await this.setWithOptions(options, freshData);
      console.log(`[Cache] Background revalidation complete: ${options.provider}/${options.key}`);
    } catch (error) {
      console.error('[Cache] Background revalidation failed:', error);
    }
  }

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
    }, 60_000);
  }
}
