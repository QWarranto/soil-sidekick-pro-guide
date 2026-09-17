/**
 * Secure logging utilities for edge functions
 * Sanitizes PII and sensitive data before logging
 */

interface LogData {
  [key: string]: any;
}

/**
 * Sanitizes sensitive data for safe logging
 */
export function sanitizeLogData(data?: LogData): LogData | undefined {
  if (!data) return undefined;

  const sanitized: LogData = {};
  
  for (const [key, value] of Object.entries(data)) {
    switch (key.toLowerCase()) {
      case 'email':
        // Show first 3 chars + domain
        sanitized[key] = value ? `${value.substring(0, 3)}***@${value.split('@')[1] || 'domain.com'}` : undefined;
        break;
      
      case 'userid':
      case 'user_id':
        // Show last 4 characters only
        sanitized[key] = value ? `***${value.slice(-4)}` : undefined;
        break;
      
      case 'customerid':
      case 'customer_id':
      case 'stripecustomerid':
        // Mask completely
        sanitized[key] = value ? 'cus_***' : undefined;
        break;
      
      case 'apikey':
      case 'api_key':
      case 'token':
      case 'secret':
      case 'password':
        // Never log these
        sanitized[key] = '[REDACTED]';
        break;
      
      default:
        // Pass through other values
        sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Safe logging function with environment awareness
 */
export function logSafe(step: string, data?: LogData) {
  const env = Deno.env.get('DENO_DEPLOYMENT_ID') ? 'PROD' : 'DEV';
  const sanitized = sanitizeLogData(data);
  console.log(`[${env}] ${step}`, sanitized || '');
}

/**
 * Sanitizes error objects before logging
 */
export function sanitizeError(error: any): object {
  return {
    message: error?.message || 'Unknown error',
    code: error?.code,
    type: error?.type,
    // NEVER include: error.raw, error.headers, stack traces, environment variables
  };
}

/**
 * Safe error logging
 */
export function logError(context: string, error: any) {
  const env = Deno.env.get('DENO_DEPLOYMENT_ID') ? 'PROD' : 'DEV';
  const sanitized = sanitizeError(error);
  console.error(`[${env}] ERROR in ${context}:`, sanitized);
}
