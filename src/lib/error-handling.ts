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

export interface ErrorResult {
  category: ErrorCategory;
  message: string;
  actionHint: string;   // Short imperative instruction for the user
  retryable: boolean;
  retryDelay?: number;
}

/**
 * Classify an error into a category with a user-friendly message AND an actionable hint.
 * Uses HTTP status codes when available, falls back to message heuristics.
 */
export function classifyError(error: any): ErrorResult {
  const status = error?.status ?? error?.statusCode;
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const lower = raw.toLowerCase();

  // Edge function non-2xx catch-all — most common user-facing failure
  if (
    lower.includes('non-2xx') ||
    lower.includes('edge function') ||
    status === 500
  ) {
    return {
      category: 'transient',
      message: 'The AI service returned an unexpected response.',
      actionHint: 'Click "Retry" below. If the problem continues, sign out and sign back in, then try again.',
      retryable: true,
      retryDelay: 2000,
    };
  }

  // Rate limit / server overload = transient (auto-retry)
  if (
    status === 503 || status === 502 || status === 504 || status === 429 ||
    error?.code === 'timeout' ||
    lower.includes('timeout') ||
    lower.includes('econnrefused') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests')
  ) {
    return {
      category: 'transient',
      message: 'The server is busy or temporarily unavailable.',
      actionHint: 'Wait a moment, then click "Retry". No changes to your selections are needed.',
      retryable: true,
      retryDelay: 2000,
    };
  }

  // Network failure
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed to fetch')) {
    return {
      category: 'transient',
      message: 'Your internet connection may have dropped.',
      actionHint: 'Check your connection, then click "Retry".',
      retryable: true,
      retryDelay: 1500,
    };
  }

  // Auth errors
  if (
    status === 401 ||
    lower.includes('no session') ||
    lower.includes('authentication required') ||
    lower.includes('unauthorized') ||
    lower.includes('sign in') ||
    lower.includes('jwt')
  ) {
    return {
      category: 'auth',
      message: 'Your session has expired or you are not signed in.',
      actionHint: 'Sign out using the menu at the top, then sign back in with Google and try again.',
      retryable: false,
    };
  }

  // Subscription / access denied
  if (status === 403 || lower.includes('subscription') || lower.includes('upgrade')) {
    return {
      category: 'fatal',
      message: 'This feature requires an active subscription.',
      actionHint: 'Visit the Pricing page to upgrade your plan, then return here.',
      retryable: false,
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
      message: raw || 'One or more fields are missing or invalid.',
      actionHint: 'Make sure a county is selected and both Planning Focus and Timeframe are chosen, then try again.',
      retryable: false,
    };
  }

  // Everything else = fatal
  return {
    category: 'fatal',
    message: 'An unexpected error occurred.',
    actionHint: 'Refresh the page and try again. If the issue persists, sign out and sign back in.',
    retryable: true,
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
