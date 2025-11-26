/**
 * Graceful Degradation Patterns
 * Provides fallback strategies when external APIs fail
 */

export interface FallbackOptions {
  primary: () => Promise<any>;
  fallback?: () => Promise<any>;
  defaultValue?: any;
  retries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

/**
 * Execute with automatic fallback
 */
export async function withFallback<T>(options: FallbackOptions): Promise<T> {
  const { primary, fallback, defaultValue, retries = 3, retryDelay = 1000, onError } = options;

  let lastError: Error | null = null;

  // Try primary with retries
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await primary();
    } catch (error) {
      lastError = error as Error;
      console.warn(`[FALLBACK] Primary attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  // Try fallback if available
  if (fallback) {
    try {
      console.log('[FALLBACK] Attempting fallback strategy');
      return await fallback();
    } catch (fallbackError) {
      console.error('[FALLBACK] Fallback failed:', fallbackError);
      if (onError) {
        onError(fallbackError as Error);
      }
    }
  }

  // Return default value if available
  if (defaultValue !== undefined) {
    console.log('[FALLBACK] Using default value');
    return defaultValue;
  }

  // No fallback or default - throw the original error
  if (onError && lastError) {
    onError(lastError);
  }
  throw lastError || new Error('Operation failed with no fallback');
}

/**
 * Circuit breaker pattern
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure > this.resetTimeout) {
        console.log('[CIRCUIT] Attempting half-open state');
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      
      if (this.state === 'half-open') {
        console.log('[CIRCUIT] Success in half-open, resetting to closed');
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      console.warn(`[CIRCUIT] Opening circuit breaker after ${this.failures} failures`);
      this.state = 'open';
    }
  }

  private reset() {
    this.failures = 0;
    this.state = 'closed';
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Global circuit breakers for external APIs
export const circuitBreakers = {
  epa: new CircuitBreaker(5, 60000, 30000),
  usda: new CircuitBreaker(5, 60000, 30000),
  googleEarth: new CircuitBreaker(3, 120000, 60000),
  noaa: new CircuitBreaker(5, 60000, 30000),
  openai: new CircuitBreaker(3, 60000, 30000),
};

/**
 * Safe external API call with circuit breaker
 */
export async function safeExternalCall<T>(
  provider: keyof typeof circuitBreakers,
  apiCall: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T> {
  const breaker = circuitBreakers[provider];

  try {
    return await breaker.execute(apiCall);
  } catch (error) {
    console.error(`[FALLBACK] ${provider} API failed:`, error);
    
    if (fallback) {
      console.log(`[FALLBACK] Using fallback for ${provider}`);
      return await fallback();
    }
    
    throw error;
  }
}
