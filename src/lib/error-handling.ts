/**
 * Reusable error classification and smart retry utilities.
 * 
 * Provides consistent error handling across all edge function calls
 * and async operations in the application.
 */

export type ErrorCategory = 'transient' | 'auth' | 'validation' | 'fatal';

export interface ErrorResult {
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  retryDelay?: number;
}

/**
 * Classify an error into a category with a user-friendly message.
 * Uses HTTP status codes when available, falls back to message heuristics.
 */
export function classifyError(error: any): ErrorResult {
  const status = error?.status ?? error?.statusCode;
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const lower = raw.toLowerCase();

  // Network timeouts, 503s, 429s = transient (auto-retry)
  if (
    status === 503 || status === 502 || status === 504 || status === 429 ||
    error?.code === 'timeout' ||
    lower.includes('network') ||
    lower.includes('timeout') ||
    lower.includes('fetch') ||
    lower.includes('econnrefused') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests')
  ) {
    return {
      category: 'transient',
      message: 'Working on it… Retrying automatically',
      retryable: true,
      retryDelay: 2000,
    };
  }

  // Auth errors — retryable once (session refresh)
  if (
    status === 401 ||
    lower.includes('no session') ||
    lower.includes('auth') ||
    lower.includes('unauthorized') ||
    lower.includes('sign in') ||
    lower.includes('jwt')
  ) {
    return {
      category: 'auth',
      message: 'Re-authenticating…',
      retryable: true,
      retryDelay: 1000,
    };
  }

  // Validation errors — not retryable without user changes
  if (
    status === 400 || status === 422 ||
    lower.includes('required') ||
    lower.includes('invalid') ||
    lower.includes('missing') ||
    lower.includes('validation')
  ) {
    return {
      category: 'validation',
      message: raw || 'Please check your inputs and try again.',
      retryable: false,
    };
  }

  // Everything else = fatal
  return {
    category: 'fatal',
    message: 'Something went wrong. Try refreshing.',
    retryable: false,
  };
}

/**
 * Execute an async function with automatic retries for transient errors.
 * 
 * @param operation - The async function to execute
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param onStatusUpdate - Optional callback for retry status messages
 * @returns The result of the async function
 * @throws The last error if all retries are exhausted
 */
export async function withSmartRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  onStatusUpdate?: (status: string) => void
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const classified = classifyError(error);

      // Don't retry if not retryable or on last attempt
      if (!classified.retryable || attempt === maxRetries) {
        throw error;
      }

      // Notify of retry attempt
      onStatusUpdate?.(
        `${classified.message} (Attempt ${attempt}/${maxRetries})`
      );

      // Wait before retry with exponential backoff
      const delayMs = classified.retryDelay ?? Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await delay(delayMs);
    }
  }

  throw lastError;
}

/** Simple delay helper */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
