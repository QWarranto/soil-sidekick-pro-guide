/**
 * Response Timing Utility
 * Adds X-Response-Time headers for SDK performance monitoring
 * 
 * Created: December 23, 2025 - Week 1 SDK Readiness
 */

/**
 * Response time targets by endpoint category (in milliseconds)
 * These are SLA targets for SDK clients
 */
export const RESPONSE_TIME_TARGETS = {
  // Fast endpoints - simple lookups
  fast: {
    target_ms: 200,
    max_ms: 500,
    endpoints: ['county-lookup', 'get-mapbox-token', 'check-subscription']
  },
  // Standard endpoints - database queries with caching
  standard: {
    target_ms: 500,
    max_ms: 1500,
    endpoints: ['get-soil-data', 'territorial-water-quality', 'hierarchical-fips-cache']
  },
  // Complex endpoints - AI/ML processing or external API calls
  complex: {
    target_ms: 2000,
    max_ms: 5000,
    endpoints: ['agricultural-intelligence', 'gpt5-chat', 'visual-crop-analysis', 'seasonal-planning-assistant']
  },
  // Heavy endpoints - multiple external API calls or batch processing
  heavy: {
    target_ms: 5000,
    max_ms: 15000,
    endpoints: ['live-agricultural-data', 'generate-vrt-prescription', 'smart-report-summary']
  }
} as const;

export type ResponseTimeCategory = keyof typeof RESPONSE_TIME_TARGETS;

/**
 * Get the response time category for an endpoint
 */
export function getResponseTimeCategory(endpoint: string): ResponseTimeCategory {
  for (const [category, config] of Object.entries(RESPONSE_TIME_TARGETS)) {
    if (config.endpoints.includes(endpoint)) {
      return category as ResponseTimeCategory;
    }
  }
  return 'standard'; // Default category
}

/**
 * Get response time targets for an endpoint
 */
export function getResponseTimeTargets(endpoint: string): { target_ms: number; max_ms: number } {
  const category = getResponseTimeCategory(endpoint);
  return {
    target_ms: RESPONSE_TIME_TARGETS[category].target_ms,
    max_ms: RESPONSE_TIME_TARGETS[category].max_ms
  };
}

/**
 * Create response timing headers
 */
export function createTimingHeaders(startTime: number, endpoint?: string): Record<string, string> {
  const responseTime = Date.now() - startTime;
  
  const headers: Record<string, string> = {
    'X-Response-Time': `${responseTime}ms`,
    'X-Response-Time-Ms': String(responseTime)
  };

  // Add target info if endpoint is provided
  if (endpoint) {
    const targets = getResponseTimeTargets(endpoint);
    headers['X-Response-Time-Target'] = `${targets.target_ms}ms`;
    headers['X-Response-Time-Max'] = `${targets.max_ms}ms`;
    
    // Add performance status
    if (responseTime <= targets.target_ms) {
      headers['X-Response-Time-Status'] = 'optimal';
    } else if (responseTime <= targets.max_ms) {
      headers['X-Response-Time-Status'] = 'acceptable';
    } else {
      headers['X-Response-Time-Status'] = 'exceeded';
    }
  }

  return headers;
}

/**
 * Wrap headers with timing information
 */
export function withTimingHeaders(
  baseHeaders: Record<string, string>,
  startTime: number,
  endpoint?: string
): Record<string, string> {
  const timingHeaders = createTimingHeaders(startTime, endpoint);
  return { ...baseHeaders, ...timingHeaders };
}

/**
 * Log response time for monitoring
 */
export function logResponseTime(
  endpoint: string,
  startTime: number,
  success: boolean = true
): void {
  const responseTime = Date.now() - startTime;
  const targets = getResponseTimeTargets(endpoint);
  const status = responseTime <= targets.target_ms 
    ? 'OPTIMAL' 
    : responseTime <= targets.max_ms 
      ? 'ACCEPTABLE' 
      : 'EXCEEDED';
  
  console.log(`[TIMING] ${endpoint}: ${responseTime}ms (target: ${targets.target_ms}ms, max: ${targets.max_ms}ms) - ${status} - ${success ? 'SUCCESS' : 'ERROR'}`);
}
