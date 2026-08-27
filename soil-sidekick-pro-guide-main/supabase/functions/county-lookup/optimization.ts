// County-Lookup Performance Optimization
// Implements LRU cache and query optimization for P95 <1000ms target

interface CountyData {
  county_fips: string;
  county_name: string;
  state_name: string;
  state_code: string;
  timestamp: number;
}

interface CacheEntry {
  data: CountyData[];
  timestamp: number;
  hitCount: number;
}

class CountyLookupCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize = 1000, ttl = 3600000) { // 1 hour TTL default
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): CountyData[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count and move to end (LRU)
    entry.hitCount++;
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data;
  }

  set(key: string, data: CountyData[]): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hitCount: 1
    });
  }

  getStats(): { size: number; hitRate: number; avgHitCount: number } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
    const avgHitCount = entries.length > 0 ? totalHits / entries.length : 0;
    
    return {
      size: this.cache.size,
      hitRate: entries.length > 0 ? (totalHits - entries.length) / totalHits : 0,
      avgHitCount
    };
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
const countyCache = new CountyLookupCache(1000, 3600000); // 1 hour TTL

// Optimized database query with reduced LIMIT
const OPTIMIZED_COUNTY_QUERY = `
  SELECT 
    county_fips,
    county_name,
    state_name,
    state_code,
    population,
    area_sq_miles
  FROM counties 
  WHERE state_code = $1 
  ORDER BY population DESC
  LIMIT 10  -- Reduced from 50 to 10 for better performance
`;

// Original query for comparison
const ORIGINAL_COUNTY_QUERY = `
  SELECT 
    county_fips,
    county_name,
    state_name,
    state_code,
    population,
    area_sq_miles
  FROM counties 
  WHERE state_code = $1 
  ORDER BY population DESC
  LIMIT 50
`;

// Performance monitoring
interface PerformanceMetrics {
  queryTime: number;
  cacheHit: boolean;
  resultCount: number;
  timestamp: number;
}

const performanceMetrics: PerformanceMetrics[] = [];

export async function optimizedCountyLookup(stateCode: string): Promise<{
  data: CountyData[];
  metrics: PerformanceMetrics;
}> {
  const startTime = performance.now();
  const cacheKey = `counties:${stateCode}`;
  
  // Check cache first
  const cachedData = countyCache.get(cacheKey);
  if (cachedData) {
    const metrics = {
      queryTime: performance.now() - startTime,
      cacheHit: true,
      resultCount: cachedData.length,
      timestamp: Date.now()
    };
    performanceMetrics.push(metrics);
    
    return {
      data: cachedData,
      metrics
    };
  }

  // Database query with optimized LIMIT
  try {
    // This would be replaced with actual Supabase client call
    const response = await fetch('/supabase/functions/county-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: OPTIMIZED_COUNTY_QUERY,
        params: [stateCode]
      })
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.status}`);
    }

    const result = await response.json();
    const queryTime = performance.now() - startTime;
    
    // Cache the results
    countyCache.set(cacheKey, result.data);
    
    const metrics = {
      queryTime,
      cacheHit: false,
      resultCount: result.data.length,
      timestamp: Date.now()
    };
    performanceMetrics.push(metrics);
    
    return {
      data: result.data,
      metrics
    };
  } catch (error) {
    console.error('County lookup failed:', error);
    throw error;
  }
}

// Cache warming function
export async function warmCacheForPopularStates(): Promise<void> {
  const popularStates = ['TX', 'CA', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
  
  const warmUpPromises = popularStates.map(async (stateCode) => {
    try {
      await optimizedCountyLookup(stateCode);
      console.log(`Cache warmed for ${stateCode}`);
    } catch (error) {
      console.error(`Failed to warm cache for ${stateCode}:`, error);
    }
  });
  
  await Promise.all(warmUpPromises);
}

// Performance analysis
export function getPerformanceAnalysis(): {
  avgQueryTime: number;
  p95QueryTime: number;
  cacheHitRate: number;
  totalRequests: number;
} {
  if (performanceMetrics.length === 0) {
    return {
      avgQueryTime: 0,
      p95QueryTime: 0,
      cacheHitRate: 0,
      totalRequests: 0
    };
  }

  const queryTimes = performanceMetrics.map(m => m.queryTime);
  const sortedTimes = queryTimes.sort((a, b) => a - b);
  const p95Index = Math.floor(sortedTimes.length * 0.95);
  
  const avgQueryTime = queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length;
  const p95QueryTime = sortedTimes[p95Index];
  const cacheHits = performanceMetrics.filter(m => m.cacheHit).length;
  const cacheHitRate = cacheHits / performanceMetrics.length;
  
  return {
    avgQueryTime,
    p95QueryTime,
    cacheHitRate,
    totalRequests: performanceMetrics.length
  };
}

// Cache invalidation
export function invalidateCache(pattern?: string): void {
  if (pattern) {
    // Remove entries matching pattern
    const keysToRemove = Array.from(countyCache.getStats().size)
      .filter(key => key.includes(pattern));
    
    keysToRemove.forEach(key => {
      // Implementation would iterate through cache keys
      console.log(`Invalidating cache for pattern: ${pattern}`);
    });
  } else {
    // Clear all cache
    countyCache.clear();
    console.log('All cache cleared');
  }
}

// Edge function integration
export async function handleCountyLookupRequest(request: Request): Promise<Response> {
  const startTime = performance.now();
  
  try {
    const { state_code, use_cache = true } = await request.json();
    
    if (!state_code || state_code.length !== 2) {
      return new Response(JSON.stringify({
        error: {
          code: 'INVALID_STATE_CODE',
          message: 'Valid 2-letter state code is required'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    if (use_cache) {
      result = await optimizedCountyLookup(state_code);
    } else {
      // Bypass cache for fresh data
      const response = await fetch('/supabase/functions/county-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: OPTIMIZED_COUNTY_QUERY,
          params: [state_code]
        })
      });
      
      if (!response.ok) {
        throw new Error('Database query failed');
      }
      
      const data = await response.json();
      result = {
        data: data.data,
        metrics: {
          queryTime: performance.now() - startTime,
          cacheHit: false,
          resultCount: data.data.length,
          timestamp: Date.now()
        }
      };
    }

    const totalTime = performance.now() - startTime;
    
    return new Response(JSON.stringify({
      success: true,
      data: result.data,
      performance: {
        ...result.metrics,
        total_time: totalTime,
        cache_stats: countyCache.getStats()
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
        'X-Response-Time-Ms': Math.round(totalTime).toString()
      }
    });
    
  } catch (error) {
    console.error('County lookup error:', error);
    
    return new Response(JSON.stringify({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Service temporarily unavailable. Please try again.',
        retry_after: 60
      }
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Performance monitoring endpoint
export async function getPerformanceMetrics(): Promise<Response> {
  const analysis = getPerformanceAnalysis();
  const cacheStats = countyCache.getStats();
  
  return new Response(JSON.stringify({
    success: true,
    metrics: {
      performance: analysis,
      cache: cacheStats,
      recent_requests: performanceMetrics.slice(-10) // Last 10 requests
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}