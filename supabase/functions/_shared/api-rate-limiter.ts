/**
 * External API Rate Limiter with Circuit Breaker
 * Protects against overwhelming external providers (EPA, USDA, Google Earth Engine)
 */

interface ProviderConfig {
  name: string;
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  circuitBreakerThreshold: number; // failures before opening circuit
  circuitBreakerTimeout: number; // ms to wait before retry
}

interface RateLimitState {
  requestsLastMinute: number[];
  requestsLastHour: number[];
  requestsLastDay: number[];
  failures: number;
  circuitOpen: boolean;
  circuitOpenedAt: number;
  lastRequestAt: number;
}

// External API provider configurations
export const API_PROVIDERS: Record<string, ProviderConfig> = {
  EPA_WQP: {
    name: 'EPA Water Quality Portal',
    maxRequestsPerMinute: 10, // Conservative to avoid EPA rate limits
    maxRequestsPerHour: 300,
    maxRequestsPerDay: 5000,
    circuitBreakerThreshold: 5,
    circuitBreakerTimeout: 60000, // 1 minute
  },
  USDA_SDA: {
    name: 'USDA Soil Data Access',
    maxRequestsPerMinute: 5, // Very conservative - SDA has strict limits
    maxRequestsPerHour: 100,
    maxRequestsPerDay: 1000,
    circuitBreakerThreshold: 3,
    circuitBreakerTimeout: 120000, // 2 minutes
  },
  GOOGLE_EE: {
    name: 'Google Earth Engine',
    maxRequestsPerMinute: 20, // GEE has quotas per project
    maxRequestsPerHour: 500,
    maxRequestsPerDay: 10000,
    circuitBreakerThreshold: 5,
    circuitBreakerTimeout: 300000, // 5 minutes
  },
};

class APIRateLimiter {
  private state: Map<string, RateLimitState> = new Map();
  private requestQueue: Map<string, Array<{
    resolve: (value: boolean) => void;
    reject: (reason: any) => void;
    priority: number;
    enqueuedAt: number;
  }>> = new Map();

  constructor() {
    // Initialize state for each provider
    Object.keys(API_PROVIDERS).forEach(provider => {
      this.state.set(provider, {
        requestsLastMinute: [],
        requestsLastHour: [],
        requestsLastDay: [],
        failures: 0,
        circuitOpen: false,
        circuitOpenedAt: 0,
        lastRequestAt: 0,
      });
      this.requestQueue.set(provider, []);
    });

    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Check if we can make a request to the provider
   */
  async canMakeRequest(provider: string, priority: number = 0): Promise<boolean> {
    const config = API_PROVIDERS[provider];
    if (!config) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const state = this.state.get(provider)!;
    const now = Date.now();

    // Check circuit breaker
    if (state.circuitOpen) {
      if (now - state.circuitOpenedAt < config.circuitBreakerTimeout) {
        console.warn(`[${provider}] Circuit breaker OPEN - blocking request`);
        return false;
      }
      // Try to close circuit (half-open state)
      console.log(`[${provider}] Circuit breaker timeout expired - attempting half-open state`);
      state.circuitOpen = false;
      state.failures = 0;
    }

    // Clean old timestamps
    this.cleanTimestamps(state, now);

    // Check rate limits
    if (state.requestsLastMinute.length >= config.maxRequestsPerMinute) {
      console.warn(`[${provider}] Per-minute rate limit exceeded: ${state.requestsLastMinute.length}/${config.maxRequestsPerMinute}`);
      return this.enqueueRequest(provider, priority);
    }

    if (state.requestsLastHour.length >= config.maxRequestsPerHour) {
      console.warn(`[${provider}] Per-hour rate limit exceeded: ${state.requestsLastHour.length}/${config.maxRequestsPerHour}`);
      return false;
    }

    if (state.requestsLastDay.length >= config.maxRequestsPerDay) {
      console.warn(`[${provider}] Per-day rate limit exceeded: ${state.requestsLastDay.length}/${config.maxRequestsPerDay}`);
      return false;
    }

    // Add minimum spacing between requests (100ms)
    const timeSinceLastRequest = now - state.lastRequestAt;
    if (timeSinceLastRequest < 100) {
      await new Promise(resolve => setTimeout(resolve, 100 - timeSinceLastRequest));
    }

    // Record request
    state.requestsLastMinute.push(now);
    state.requestsLastHour.push(now);
    state.requestsLastDay.push(now);
    state.lastRequestAt = now;

    console.log(`[${provider}] Request approved - Current: ${state.requestsLastMinute.length}/min, ${state.requestsLastHour.length}/hr, ${state.requestsLastDay.length}/day`);
    return true;
  }

  /**
   * Record a successful API call
   */
  recordSuccess(provider: string): void {
    const state = this.state.get(provider);
    if (state) {
      state.failures = 0; // Reset failure count on success
      if (state.circuitOpen) {
        console.log(`[${provider}] Circuit breaker CLOSED after successful request`);
        state.circuitOpen = false;
      }
    }
  }

  /**
   * Record a failed API call
   */
  recordFailure(provider: string, error: Error): void {
    const config = API_PROVIDERS[provider];
    const state = this.state.get(provider);
    
    if (!config || !state) return;

    state.failures++;
    console.error(`[${provider}] Request failed (${state.failures}/${config.circuitBreakerThreshold}):`, error.message);

    if (state.failures >= config.circuitBreakerThreshold) {
      state.circuitOpen = true;
      state.circuitOpenedAt = Date.now();
      console.error(`[${provider}] Circuit breaker OPENED after ${state.failures} failures`);
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(provider: string): {
    requestsLastMinute: number;
    requestsLastHour: number;
    requestsLastDay: number;
    circuitOpen: boolean;
    failures: number;
    queueLength: number;
  } {
    const state = this.state.get(provider);
    const queue = this.requestQueue.get(provider);
    
    if (!state || !queue) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      requestsLastMinute: state.requestsLastMinute.length,
      requestsLastHour: state.requestsLastHour.length,
      requestsLastDay: state.requestsLastDay.length,
      circuitOpen: state.circuitOpen,
      failures: state.failures,
      queueLength: queue.length,
    };
  }

  /**
   * Enqueue request for later processing
   */
  private async enqueueRequest(provider: string, priority: number): Promise<boolean> {
    const queue = this.requestQueue.get(provider)!;
    
    // Reject if queue is too long (prevent memory issues)
    if (queue.length >= 100) {
      console.error(`[${provider}] Request queue full (${queue.length} requests)`);
      return false;
    }

    return new Promise((resolve, reject) => {
      queue.push({
        resolve,
        reject,
        priority,
        enqueuedAt: Date.now(),
      });

      // Sort by priority (higher first)
      queue.sort((a, b) => b.priority - a.priority);

      console.log(`[${provider}] Request queued (position: ${queue.length}, priority: ${priority})`);

      // Set timeout for queued request
      setTimeout(() => {
        const index = queue.findIndex(item => item.resolve === resolve);
        if (index !== -1) {
          queue.splice(index, 1);
          reject(new Error('Request timeout in queue'));
        }
      }, 30000); // 30 second timeout
    });
  }

  /**
   * Process queued requests
   */
  private processQueue(): void {
    Object.keys(API_PROVIDERS).forEach(provider => {
      const queue = this.requestQueue.get(provider)!;
      if (queue.length === 0) return;

      const config = API_PROVIDERS[provider];
      const state = this.state.get(provider)!;
      const now = Date.now();

      // Check if we can process queue
      if (state.circuitOpen) return;
      if (state.requestsLastMinute.length >= config.maxRequestsPerMinute) return;

      // Process highest priority request
      const request = queue.shift();
      if (request) {
        const waitTime = now - request.enqueuedAt;
        console.log(`[${provider}] Processing queued request (waited ${waitTime}ms)`);
        
        state.requestsLastMinute.push(now);
        state.requestsLastHour.push(now);
        state.requestsLastDay.push(now);
        state.lastRequestAt = now;
        
        request.resolve(true);
      }
    });
  }

  /**
   * Clean old timestamps
   */
  private cleanTimestamps(state: RateLimitState, now: number): void {
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    state.requestsLastMinute = state.requestsLastMinute.filter(t => t > oneMinuteAgo);
    state.requestsLastHour = state.requestsLastHour.filter(t => t > oneHourAgo);
    state.requestsLastDay = state.requestsLastDay.filter(t => t > oneDayAgo);
  }

  /**
   * Start periodic cleanup and queue processing
   */
  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      this.state.forEach((state, provider) => {
        this.cleanTimestamps(state, now);
      });
      this.processQueue();
    }, 5000); // Every 5 seconds
  }
}

// Global singleton instance
export const rateLimiter = new APIRateLimiter();

/**
 * Exponential backoff with jitter
 */
export async function exponentialBackoff(
  fn: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<any> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * exponentialDelay * 0.3; // 30% jitter
      const delay = exponentialDelay + jitter;

      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay.toFixed(0)}ms:`, lastError.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
