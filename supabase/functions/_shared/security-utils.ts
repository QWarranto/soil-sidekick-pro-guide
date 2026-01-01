// Enhanced security utilities for edge functions

export interface SecurityLogEntry {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityIncident {
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip?: string;
  user_id?: string;
  user_agent?: string;
  endpoint?: string;
  request_payload?: any;
  response_status?: number;
  incident_details?: any;
}

export interface InputValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'uuid' | 'json' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: string[];
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

/**
 * Advanced input validation with comprehensive rules
 */
export function validateInput(data: any, rules: InputValidationRule[]): { isValid: boolean; errors: string[]; sanitized: any } {
  const errors: string[] = [];
  const sanitized: any = {};

  for (const rule of rules) {
    const value = data[rule.field];

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} is required`);
      continue;
    }

    // Skip validation for optional empty fields
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${rule.field} must be a string`);
          continue;
        }
        let sanitizedString = value.trim();
        
        // Length validation
        if (rule.minLength && sanitizedString.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
          continue;
        }
        if (rule.maxLength && sanitizedString.length > rule.maxLength) {
          sanitizedString = sanitizedString.slice(0, rule.maxLength);
        }
        
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(sanitizedString)) {
          errors.push(`${rule.field} format is invalid`);
          continue;
        }
        
        // Allowed values validation
        if (rule.allowedValues && !rule.allowedValues.includes(sanitizedString)) {
          errors.push(`${rule.field} must be one of: ${rule.allowedValues.join(', ')}`);
          continue;
        }
        
        sanitized[rule.field] = sanitizedString;
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${rule.field} must be a valid number`);
          continue;
        }
        sanitized[rule.field] = num;
        break;

      case 'email':
        if (typeof value !== 'string') {
          errors.push(`${rule.field} must be a string`);
          continue;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) {
          errors.push(`${rule.field} must be a valid email address`);
          continue;
        }
        sanitized[rule.field] = value.trim().toLowerCase();
        break;

      case 'uuid':
        if (typeof value !== 'string') {
          errors.push(`${rule.field} must be a string`);
          continue;
        }
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(value.trim())) {
          errors.push(`${rule.field} must be a valid UUID`);
          continue;
        }
        sanitized[rule.field] = value.trim().toLowerCase();
        break;

      case 'json':
        try {
          if (typeof value === 'object') {
            sanitized[rule.field] = value;
          } else if (typeof value === 'string') {
            sanitized[rule.field] = JSON.parse(value);
          } else {
            errors.push(`${rule.field} must be valid JSON`);
            continue;
          }
        } catch {
          errors.push(`${rule.field} must be valid JSON`);
          continue;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${rule.field} must be an array`);
          continue;
        }
        sanitized[rule.field] = value;
        break;

      default:
        sanitized[rule.field] = value;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Advanced rate limiting with database persistence
 */
export async function advancedRateLimit(
  supabase: any,
  identifier: string,
  endpoint: string,
  limit: number = 100,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const windowStart = new Date();
    const windowEnd = new Date(windowStart.getTime() + (windowMinutes * 60 * 1000));

    // Check existing rate limit record
    const { data: existing } = await supabase
      .from('rate_limit_tracking')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gt('window_end', new Date().toISOString())
      .single();

    if (existing) {
      // Update existing record
      if (existing.request_count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: new Date(existing.window_end).getTime()
        };
      }

      const { error } = await supabase
        .from('rate_limit_tracking')
        .update({ request_count: existing.request_count + 1 })
        .eq('id', existing.id);

      if (error) {
        console.error('Rate limit update error:', error);
        return { allowed: true, remaining: limit - 1, resetTime: windowEnd.getTime() };
      }

      return {
        allowed: true,
        remaining: limit - (existing.request_count + 1),
        resetTime: new Date(existing.window_end).getTime()
      };
    } else {
      // Create new rate limit record
      const { error } = await supabase
        .from('rate_limit_tracking')
        .insert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: windowStart.toISOString(),
          window_end: windowEnd.toISOString()
        });

      if (error) {
        console.error('Rate limit insert error:', error);
        return { allowed: true, remaining: limit - 1, resetTime: windowEnd.getTime() };
      }

      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: windowEnd.getTime()
      };
    }
  } catch (error) {
    console.error('Advanced rate limit error:', error);
    // Fallback to in-memory rate limiting
    return {
      allowed: checkRateLimit(identifier + endpoint, limit, windowMinutes * 60 * 1000),
      remaining: limit - 1,
      resetTime: Date.now() + (windowMinutes * 60 * 1000)
    };
  }
}

/**
 * Logs security incidents for monitoring
 */
export async function logSecurityIncident(
  supabase: any,
  incident: SecurityIncident,
  request?: Request
): Promise<void> {
  try {
    const ip_address = request?.headers.get('x-forwarded-for') || 
                      request?.headers.get('x-real-ip') || 
                      'unknown';
    
    const user_agent = request?.headers.get('user-agent') || 'unknown';

    await supabase
      .from('security_incidents')
      .insert({
        incident_type: incident.incident_type,
        severity: incident.severity,
        source_ip: incident.source_ip || ip_address,
        user_id: incident.user_id,
        user_agent: incident.user_agent || user_agent,
        endpoint: incident.endpoint,
        request_payload: incident.request_payload,
        response_status: incident.response_status,
        incident_details: incident.incident_details
      });
  } catch (error) {
    console.error('Failed to log security incident:', error);
  }
}

/**
 * Enhanced security headers for all responses
 */
export function getSecurityHeaders(corsHeaders: any): any {
  return {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.supabase.co;"
  };
}

/**
 * API key authentication for enhanced security
 */
export async function authenticateApiKey(
  supabase: any,
  request: Request
): Promise<{ user: any; permissions: any; error?: string }> {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return { user: null, permissions: null, error: 'API key required' };
    }

    console.log('API key received (first 10 chars):', apiKey.substring(0, 10) + '...');

    // Hash the API key for lookup
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
    const hashArray = Array.from(new Uint8Array(keyHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('Generated hash:', hashHex);

    const { data: keyData, error } = await supabase.rpc('validate_api_key', { key_hash: hashHex, client_ip: null });
    
    console.log('RPC result - error:', error);
    console.log('RPC result - keyData:', JSON.stringify(keyData));

    if (error || !keyData || keyData.length === 0) {
      console.log('Validation failed - error:', error, 'keyData empty:', !keyData || keyData.length === 0);
      return { user: null, permissions: null, error: 'Invalid API key' };
    }

    const keyInfo = keyData[0];
    if (!keyInfo.is_valid) {
      return { user: null, permissions: null, error: 'API key expired or inactive' };
    }

    return {
      user: { id: keyInfo.user_id },
      permissions: keyInfo.permissions,
      error: undefined
    };
  } catch (error) {
    console.error('API key authentication error:', error);
    return { user: null, permissions: null, error: 'Authentication failed' };
  }
}

// ========================
// Encryption utilities using secret-based key
// ========================

/**
 * Get the encryption key from environment (edge function secret)
 */
export function getEncryptionKey(): string {
  const key = Deno.env.get('APP_ENCRYPTION_KEY');
  if (!key) {
    throw new Error('APP_ENCRYPTION_KEY secret is not configured');
  }
  return key;
}

/**
 * Simple XOR-based encryption for edge function use
 * For production use with highly sensitive data consider Web Crypto API
 */
export function encryptValue(plaintext: string, key: string): string {
  if (!plaintext) return '';
  const keyBytes = new TextEncoder().encode(key);
  const textBytes = new TextEncoder().encode(plaintext);
  const encrypted = new Uint8Array(textBytes.length);
  
  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return btoa(String.fromCharCode(...encrypted));
}

/**
 * Simple XOR-based decryption
 */
export function decryptValue(ciphertext: string, key: string): string {
  if (!ciphertext) return '';
  try {
    const keyBytes = new TextEncoder().encode(key);
    const encrypted = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const decrypted = new Uint8Array(encrypted.length);
    
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

/**
 * Encrypt using AES-GCM via Web Crypto API (stronger encryption)
 */
export async function encryptAES(plaintext: string, keyBase64: string): Promise<string> {
  if (!plaintext) return '';
  
  // Derive a 256-bit key from the provided base64 key
  const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData.slice(0, 32), // Use first 32 bytes for AES-256
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );
  
  // Combine IV + ciphertext and encode as base64
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt using AES-GCM via Web Crypto API
 */
export async function decryptAES(ciphertext: string, keyBase64: string): Promise<string> {
  if (!ciphertext) return '';
  
  try {
    // Derive key
    const keyData = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData.slice(0, 32),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decode and extract IV + ciphertext
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('AES decryption failed:', error);
    return '';
  }
}