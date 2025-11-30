/**
 * Standardized Request Handler
 * Provides consistent error handling, logging, and security across all edge functions
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { logSafe, logError, sanitizeError } from './logging-utils.ts';
import { logSecurityEvent, authenticateUser, getSecurityHeaders } from './security-utils.ts';
import { rateLimiter, loadMonitor } from './api-rate-limiter.ts';

export interface RequestHandlerConfig {
  functionName: string;
  requireAuth?: boolean;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  tierAccess?: 'starter' | 'professional' | 'custom';
  logCost?: {
    provider: string;
    serviceType: string;
  };
}

export interface RequestContext {
  supabase: any;
  user?: any;
  request: Request;
  startTime: number;
}

/**
 * Standardized request handler wrapper
 * Handles auth, rate limiting, error handling, logging, and cost tracking
 */
export async function handleRequest<T>(
  config: RequestHandlerConfig,
  handler: (ctx: RequestContext) => Promise<T>
): Promise<Response> {
  const startTime = Date.now();
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  return async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    try {
      logSafe(`${config.functionName} request started`);

      // Check system load if tier access is specified
      if (config.tierAccess) {
        const loadCheck = loadMonitor.canAcceptRequest(config.tierAccess);
        if (!loadCheck.allowed) {
          await logSecurityEvent(supabase, {
            event_type: 'load_shedding',
            severity: 'medium',
            details: {
              function: config.functionName,
              reason: loadCheck.reason,
              suggested_action: loadCheck.suggestedAction,
            },
          }, req);

          return new Response(JSON.stringify({
            success: false,
            error: loadCheck.reason,
            suggested_action: loadCheck.suggestedAction,
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // Authentication (must happen before rate limiting to get user ID)
      let user = null;
      if (config.requireAuth) {
        const authResult = await authenticateUser(supabase, req);
        if (authResult.error || !authResult.user) {
          await logSecurityEvent(supabase, {
            event_type: 'authentication_failure',
            severity: 'medium',
            details: {
              function: config.functionName,
              error: authResult.error,
            },
          }, req);

          return new Response(JSON.stringify({
            success: false,
            error: 'Authentication required',
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        user = authResult.user;
      }

      // Database-backed rate limiting with sliding window
      if (config.rateLimit) {
        const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
        const identifier = user?.id || clientIP; // Use user ID if authenticated, otherwise IP
        const endpoint = config.functionName;
        
        const rateLimitResult = await checkDatabaseRateLimit(
          supabase,
          identifier,
          endpoint,
          config.rateLimit.requests,
          config.rateLimit.windowMs
        );

        if (!rateLimitResult.allowed) {
          await logSecurityEvent(supabase, {
            event_type: 'rate_limit_exceeded',
            severity: 'medium',
            user_id: user?.id,
            details: {
              function: config.functionName,
              identifier,
              current_count: rateLimitResult.currentCount,
              limit: config.rateLimit.requests,
            },
          }, req);

          return new Response(JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
          }), {
            status: 429,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': String(config.rateLimit.requests),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(rateLimitResult.resetTime),
            },
          });
        }
      }

      // Execute handler
      const context: RequestContext = {
        supabase,
        user,
        request: req,
        startTime,
      };

      const result = await handler(context);

      // Log successful request
      const duration = Date.now() - startTime;
      await logSecurityEvent(supabase, {
        event_type: 'successful_request',
        severity: 'low',
        user_id: user?.id,
        details: {
          function: config.functionName,
          duration_ms: duration,
        },
      }, req);

      // Track cost if configured
      if (config.logCost) {
        try {
          await supabase.from('cost_tracking').insert({
            service_provider: config.logCost.provider,
            service_type: config.logCost.serviceType,
            feature_name: config.functionName,
            cost_usd: 0.001, // Minimal tracking cost
            usage_count: 1,
            user_id: user?.id,
            request_details: {
              duration_ms: duration,
              timestamp: new Date().toISOString(),
            },
          });
        } catch (costError) {
          logError('Cost tracking failed', costError);
        }
      }

      // Add rate limit headers to response
      const responseHeaders = { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' };
      
      if (config.rateLimit) {
        const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
        const identifier = user?.id || clientIP;
        const rateLimitInfo = await getRateLimitInfo(supabase, identifier, config.functionName);
        
        responseHeaders['X-RateLimit-Limit'] = String(config.rateLimit.requests);
        responseHeaders['X-RateLimit-Remaining'] = String(Math.max(0, config.rateLimit.requests - rateLimitInfo.currentCount));
        responseHeaders['X-RateLimit-Reset'] = String(rateLimitInfo.resetTime);
      }

      return new Response(JSON.stringify({
        success: true,
        data: result,
      }), {
        headers: responseHeaders,
      });

    } catch (error) {
      logError(config.functionName, error);

      // Log security incident
      await logSecurityEvent(supabase, {
        event_type: 'function_error',
        severity: 'high',
        details: {
          function: config.functionName,
          sanitized_error: sanitizeError(error),
          duration_ms: Date.now() - startTime,
        },
      }, req);

      return new Response(JSON.stringify({
        success: false,
        error: sanitizeError(error),
      }), {
        status: 500,
        headers: { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' },
      });
    }
  };
}

/**
 * Check rate limit using database-backed sliding window algorithm
 */
async function checkDatabaseRateLimit(
  supabase: any,
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; currentCount: number; resetTime: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);
  
  try {
    // Get or create rate limit tracking record
    const { data: existing, error: fetchError } = await supabase
      .from('rate_limit_tracking')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_end', now.toISOString())
      .maybeSingle();

    if (fetchError) {
      console.error('[Rate Limit] Database fetch error:', fetchError);
      return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) }; // Fail open
    }

    if (existing) {
      // Check if limit exceeded
      if (existing.request_count >= limit) {
        const resetTime = Math.floor(new Date(existing.window_end).getTime() / 1000);
        console.log(`[Rate Limit] Limit exceeded for ${identifier} on ${endpoint}: ${existing.request_count}/${limit}`);
        return { allowed: false, currentCount: existing.request_count, resetTime };
      }

      // Increment counter
      const { error: updateError } = await supabase
        .from('rate_limit_tracking')
        .update({ 
          request_count: existing.request_count + 1,
          window_end: new Date(now.getTime() + windowMs).toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[Rate Limit] Update error:', updateError);
        return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) }; // Fail open
      }

      console.log(`[Rate Limit] Request counted: ${existing.request_count + 1}/${limit} for ${identifier}`);
      const resetTime = Math.floor(new Date(existing.window_end).getTime() / 1000);
      return { allowed: true, currentCount: existing.request_count + 1, resetTime };
    } else {
      // Create new tracking record
      const windowEnd = new Date(now.getTime() + windowMs);
      const { error: insertError } = await supabase
        .from('rate_limit_tracking')
        .insert({
          identifier,
          endpoint,
          window_start: windowStart.toISOString(),
          window_end: windowEnd.toISOString(),
          request_count: 1,
        });

      if (insertError) {
        console.error('[Rate Limit] Insert error:', insertError);
        return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) }; // Fail open
      }

      console.log(`[Rate Limit] New window started for ${identifier} on ${endpoint}`);
      const resetTime = Math.floor(windowEnd.getTime() / 1000);
      return { allowed: true, currentCount: 1, resetTime };
    }
  } catch (error) {
    console.error('[Rate Limit] Unexpected error:', error);
    return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) }; // Fail open
  }
}

/**
 * Get current rate limit information for an identifier
 */
async function getRateLimitInfo(
  supabase: any,
  identifier: string,
  endpoint: string
): Promise<{ currentCount: number; resetTime: number }> {
  const now = new Date();
  
  try {
    const { data, error } = await supabase
      .from('rate_limit_tracking')
      .select('request_count, window_end')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_end', now.toISOString())
      .maybeSingle();

    if (error) {
      console.error('[Rate Limit Info] Database error:', error);
      return { currentCount: 0, resetTime: Math.floor(Date.now() / 1000) + 3600 };
    }

    if (data) {
      return {
        currentCount: data.request_count,
        resetTime: Math.floor(new Date(data.window_end).getTime() / 1000),
      };
    }

    return { currentCount: 0, resetTime: Math.floor(Date.now() / 1000) + 3600 };
  } catch (error) {
    console.error('[Rate Limit Info] Unexpected error:', error);
    return { currentCount: 0, resetTime: Math.floor(Date.now() / 1000) + 3600 };
  }
}
