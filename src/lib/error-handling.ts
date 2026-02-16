/**
 * Reusable error classification and smart retry utilities.
 * 
 * Provides consistent error handling across all edge function calls
 * and async operations in the application.
 */

export type ErrorCategory = 'transient' | 'auth' | 'validation' | 'fatal';

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  originalError: unknown;
}

/**
 * Classify an error into a category with a user-friendly message.
 * Determines whether the error is retryable and what feedback to show.
 */
export function classifyError(error: unknown): ClassifiedError {
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const lower = raw.toLowerCase();

  // Auth errors — not retryable, user must act
  if (
    lower.includes('no session') ||
    lower.includes('auth') ||
    lower.includes('unauthorized') ||
    lower.includes('401') ||
    lower.includes('sign in') ||
    lower.includes('jwt')
  ) {
    return {
      category: 'auth',
      message: 'Please sign in to continue.',
      retryable: false,
      originalError: error,
    };
  }

  // Validation errors — not retryable without user changes
  if (
    lower.includes('required') ||
    lower.includes('invalid') ||
    lower.includes('missing') ||
    lower.includes('validation')
  ) {
    return {
      category: 'validation',
      message: raw,
      retryable: false,
      originalError: error,
    };
  }

  // Transient / network errors — retryable
  if (
    lower.includes('network') ||
    lower.includes('timeout') ||
    lower.includes('fetch') ||
    lower.includes('econnrefused') ||
    lower.includes('503') ||
    lower.includes('502') ||
    lower.includes('504') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests') ||
    lower.includes('429')
  ) {
    return {
      category: 'transient',
      message: 'Temporary issue — retrying automatically.',
      retryable: true,
      originalError: error,
    };
  }

  // Default to fatal — unknown errors are not retried
  return {
    category: 'fatal',
    message: raw || 'Something went wrong. Please try again later.',
    retryable: false,
    originalError: error,
  };
}

/**
 * Execute an async function with automatic retries for transient errors.
 * 
 * @param fn - The async function to execute
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param onRetryStatus - Optional callback for retry status messages
 * @returns The result of the async function
 * @throws The last error if all retries are exhausted
 */
export async function withSmartRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  onRetryStatus?: (message: string) => void
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const classified = classifyError(err);

      // Only retry transient errors
      if (!classified.retryable || attempt >= maxRetries) {
        throw err;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      
      onRetryStatus?.(
        `Retrying (${attempt + 1}/${maxRetries})… next attempt in ${Math.round(delay / 1000)}s`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should not reach here, but satisfy TS
  throw lastError;
}
