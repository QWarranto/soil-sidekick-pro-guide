// Security utilities for edge functions

export interface SecurityLogEntry {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Rate limiting store (in-memory for basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Sanitizes error messages to prevent information disclosure
 */
export function sanitizeError(error: any): string {
  // Never expose internal error details in production
  if (error.message?.includes('JWT') || error.message?.includes('auth')) {
    return 'Authentication failed';
  }
  
  if (error.message?.includes('database') || error.message?.includes('SQL')) {
    return 'Database operation failed';
  }
  
  if (error.message?.includes('API key') || error.message?.includes('secret')) {
    return 'External service unavailable';
  }
  
  // For network/timeout errors
  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return 'Service temporarily unavailable';
  }
  
  // Generic fallback - never expose original error message
  return 'An unexpected error occurred';
}

/**
 * Logs security events to audit table
 */
export async function logSecurityEvent(
  supabase: any,
  event: SecurityLogEntry,
  request?: Request
): Promise<void> {
  try {
    const ip_address = request?.headers.get('x-forwarded-for') || 
                      request?.headers.get('x-real-ip') || 
                      'unknown';
    
    const user_agent = request?.headers.get('user-agent') || 'unknown';
    
    await supabase
      .from('security_audit_log')
      .insert({
        event_type: event.event_type,
        user_id: event.user_id,
        ip_address,
        user_agent,
        details: event.details,
        severity: event.severity
      });
  } catch (logError) {
    // Don't throw on logging errors, just console log
    console.error('Failed to log security event:', logError);
  }
}

/**
 * Basic rate limiting implementation
 * @param identifier - Usually IP address or user ID
 * @param limit - Number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string, 
  limit: number = 100, 
  windowMs: number = 60000 // 1 minute default
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (entry.count >= limit) {
    return false; // Rate limit exceeded
  }
  
  entry.count++;
  return true;
}

/**
 * Validates and sanitizes request parameters
 */
export function validateRequestParams(params: any, allowedFields: string[]): any {
  const sanitized: any = {};
  
  for (const field of allowedFields) {
    if (params[field] !== undefined) {
      // Basic sanitization
      if (typeof params[field] === 'string') {
        sanitized[field] = params[field].trim().slice(0, 1000); // Limit length
      } else {
        sanitized[field] = params[field];
      }
    }
  }
  
  return sanitized;
}

/**
 * Creates a secure response with consistent error format
 */
export function createSecureResponse(
  data: any,
  status: number = 200,
  corsHeaders: any
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    }
  );
}

/**
 * Handles authentication and extracts user info
 */
export async function authenticateUser(supabase: any, request: Request): Promise<{ user: any; error?: string }> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authentication required' };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { user: null, error: 'Invalid authentication' };
    }
    
    return { user };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}