import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';
import {
  authenticateUser,
  sanitizeError,
  logSecurityEvent,
  getSecurityHeaders,
  validateInput,
  advancedRateLimit,
  logSecurityIncident,
  type InputValidationRule
} from '../_shared/security-utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Advanced rate limiting
    const rateLimitResult = await advancedRateLimit(supabase, ip, '/api-key-management', 20, 60);
    if (!rateLimitResult.allowed) {
      await logSecurityIncident(supabase, {
        incident_type: 'rate_limit_exceeded',
        severity: 'medium',
        endpoint: '/api-key-management',
        incident_details: { limit: 20, window: 60 }
      }, req);

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: {
            ...getSecurityHeaders(corsHeaders),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Authenticate user
    const { user, error: authError } = await authenticateUser(supabase, req);
    if (authError || !user) {
      await logSecurityIncident(supabase, {
        incident_type: 'unauthorized_access',
        severity: 'medium',
        endpoint: '/api-key-management'
      }, req);

      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    // Log successful authentication
    await logSecurityEvent(supabase, {
      event_type: 'api_key_access',
      user_id: user.id,
      severity: 'low',
      details: { method: req.method, endpoint: '/api-key-management' }
    }, req);

    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case 'GET':
        return await handleGetApiKeys(user);
      case 'POST':
        return await handleCreateApiKey(user, req);
      case 'PUT':
        return await handleUpdateApiKey(user, req, url);
      case 'DELETE':
        return await handleDeleteApiKey(user, req, url);
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: getSecurityHeaders(corsHeaders)
          }
        );
    }
  } catch (error) {
    console.error('API key management error:', error);
    
    await logSecurityIncident(supabase, {
      incident_type: 'api_error',
      severity: 'high',
      endpoint: '/api-key-management',
      incident_details: { error: error.message }
    }, req);

    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      {
        status: 500,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  }
});

async function handleGetApiKeys(user: any) {
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, key_name, permissions, rate_limit, rate_window_minutes, last_used_at, expires_at, is_active, created_at, subscription_tier')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ apiKeys }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }
}

async function handleCreateApiKey(user: any, req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validationRules: InputValidationRule[] = [
      { field: 'key_name', type: 'string', required: true, minLength: 1, maxLength: 100 },
      { field: 'subscription_tier', type: 'string', required: false, maxLength: 50 },
      { field: 'permissions', type: 'json', required: false },
      { field: 'rate_limit', type: 'number', required: false },
      { field: 'rate_window_minutes', type: 'number', required: false },
      { field: 'expires_at', type: 'string', required: false }
    ];

    const validation = validateInput(body, validationRules);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        {
          status: 400,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    // Validate subscription tier
    const validTiers = ['free', 'starter', 'pro', 'enterprise'];
    const subscriptionTier = validation.sanitized.subscription_tier || 'free';
    if (!validTiers.includes(subscriptionTier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid subscription tier. Must be one of: free, starter, pro, enterprise' }),
        { status: 400, headers: getSecurityHeaders(corsHeaders) }
      );
    }

    // Get tier-specific rate limits
    const { data: tierLimits } = await supabase
      .from('api_tier_limits')
      .select('*')
      .eq('tier', subscriptionTier)
      .single();

    // Generate API key
    const apiKey = generateSecureApiKey();
    const keyHash = await hashApiKey(apiKey);

    // Insert API key with tier information
    const { data: newApiKey, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_name: validation.sanitized.key_name,
        key_hash: keyHash,
        subscription_tier: subscriptionTier,
        permissions: validation.sanitized.permissions || {},
        rate_limit: validation.sanitized.rate_limit || (tierLimits?.requests_per_hour || 1000),
        rate_window_minutes: validation.sanitized.rate_window_minutes || 60,
        expires_at: validation.sanitized.expires_at || null
      })
      .select('id, key_name, permissions, rate_limit, rate_window_minutes, expires_at, created_at, subscription_tier')
      .single();

    if (error) {
      throw error;
    }

    await logSecurityEvent(supabase, {
      event_type: 'api_key_created',
      user_id: user.id,
      severity: 'medium',
      details: { key_name: validation.sanitized.key_name }
    }, req);

    return new Response(
      JSON.stringify({ 
        apiKey: newApiKey,
        key: apiKey, // Only show the actual key once during creation
        warning: 'Store this API key securely. It will not be shown again.'
      }),
      {
        status: 201,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }
}

async function handleUpdateApiKey(user: any, req: Request, url: URL) {
  try {
    const keyId = url.searchParams.get('id');
    if (!keyId) {
      return new Response(
        JSON.stringify({ error: 'API key ID required' }),
        {
          status: 400,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validationRules: InputValidationRule[] = [
      { field: 'key_name', type: 'string', required: false, minLength: 1, maxLength: 100 },
      { field: 'permissions', type: 'json', required: false },
      { field: 'rate_limit', type: 'number', required: false },
      { field: 'rate_window_minutes', type: 'number', required: false },
      { field: 'is_active', type: 'string', required: false, allowedValues: ['true', 'false'] }
    ];

    const validation = validateInput(body, validationRules);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        {
          status: 400,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    const updateData: any = {};
    if (validation.sanitized.key_name) updateData.key_name = validation.sanitized.key_name;
    if (validation.sanitized.permissions) updateData.permissions = validation.sanitized.permissions;
    if (validation.sanitized.rate_limit) updateData.rate_limit = validation.sanitized.rate_limit;
    if (validation.sanitized.rate_window_minutes) updateData.rate_window_minutes = validation.sanitized.rate_window_minutes;
    if (validation.sanitized.is_active !== undefined) updateData.is_active = validation.sanitized.is_active === 'true';

    const { data: updatedKey, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', keyId)
      .eq('user_id', user.id)
      .select('id, key_name, permissions, rate_limit, rate_window_minutes, is_active, updated_at')
      .single();

    if (error) {
      throw error;
    }

    await logSecurityEvent(supabase, {
      event_type: 'api_key_updated',
      user_id: user.id,
      severity: 'medium',
      details: { key_id: keyId, changes: Object.keys(updateData) }
    }, req);

    return new Response(
      JSON.stringify({ apiKey: updatedKey }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to update API key: ${error.message}`);
  }
}

async function handleDeleteApiKey(user: any, req: Request, url: URL) {
  try {
    const keyId = url.searchParams.get('id');
    if (!keyId) {
      return new Response(
        JSON.stringify({ error: 'API key ID required' }),
        {
          status: 400,
          headers: getSecurityHeaders(corsHeaders)
        }
      );
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    await logSecurityEvent(supabase, {
      event_type: 'api_key_deleted',
      user_id: user.id,
      severity: 'medium',
      details: { key_id: keyId }
    }, req);

    return new Response(
      JSON.stringify({ message: 'API key deleted successfully' }),
      {
        status: 200,
        headers: getSecurityHeaders(corsHeaders)
      }
    );
  } catch (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }
}

function generateSecureApiKey(): string {
  const prefix = 'ak_';
  const length = 32;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  
  // Use cryptographically secure random values
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  
  return result;
}

async function hashApiKey(apiKey: string): Promise<string> {
  const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(apiKey));
  const hashArray = Array.from(new Uint8Array(keyHash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}