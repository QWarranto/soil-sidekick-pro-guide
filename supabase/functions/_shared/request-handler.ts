/**
 * Standardized Request Handler
 * Provides consistent error handling, logging, and security across all edge functions
 * 
 * Updated: December 3, 2025 - Phase 2A migration for payment functions
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { logSafe, logError, sanitizeError } from './logging-utils.ts';
import { logSecurityEvent, authenticateUser, getSecurityHeaders } from './security-utils.ts';
import { rateLimiter, loadMonitor } from './api-rate-limiter.ts';
import { withTimingHeaders, logResponseTime } from './response-timing.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface RequestHandlerConfig<T = any> {
  requireAuth?: boolean;
  requireSubscription?: boolean | 'starter' | 'professional' | 'enterprise';
  validationSchema?: z.ZodSchema<T>;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  tierAccess?: 'starter' | 'professional' | 'custom';
  useServiceRole?: boolean;
  endpointName?: string; // For response timing headers
  handler: (ctx: RequestContext<T>) => Promise<any>;
}

export interface RequestContext<T = any> {
  supabaseClient: any;
  user?: any;
  req: Request;
  validatedData: T;
  startTime: number;
}

/**
 * Main request handler that wraps Deno.serve
 * Handles auth, validation, rate limiting, error handling, and logging
 */
export function requestHandler<T>(config: RequestHandlerConfig<T>) {
  Deno.serve(async (req: Request) => {
    const startTime = Date.now();

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Create Supabase client - use service role if needed
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      config.useServiceRole 
        ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        : Deno.env.get('SUPABASE_ANON_KEY')!
    );

    try {
      // Authentication check
      let user = null;
      if (config.requireAuth) {
        const authResult = await authenticateUser(supabaseClient, req);
        if (authResult.error || !authResult.user) {
          logError('Authentication failed', authResult.error);
          await logSecurityEvent(supabaseClient, {
            event_type: 'authentication_failure',
            severity: 'medium',
            details: {
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
        logSafe('User authenticated', { userId: user.id });
      }

      // Subscription check if required
      if (config.requireSubscription && user) {
        const { data: subscriber } = await supabaseClient
          .from('subscribers')
          .select('subscribed, subscription_tier')
          .eq('user_id', user.id)
          .maybeSingle();

        const isSubscribed = subscriber?.subscribed === true;
        const tier = subscriber?.subscription_tier?.toLowerCase();

        if (config.requireSubscription === true && !isSubscribed) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Active subscription required',
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check specific tier requirements
        if (typeof config.requireSubscription === 'string') {
          const tierHierarchy = ['starter', 'professional', 'enterprise'];
          const requiredTierIndex = tierHierarchy.indexOf(config.requireSubscription);
          const userTierIndex = tierHierarchy.indexOf(tier || '');

          if (!isSubscribed || userTierIndex < requiredTierIndex) {
            return new Response(JSON.stringify({
              success: false,
              error: `${config.requireSubscription} subscription or higher required`,
            }), {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }

      // Parse and validate request body
      let validatedData: T = {} as T;
      if (config.validationSchema) {
        try {
          const body = await req.json().catch(() => ({}));
          validatedData = config.validationSchema.parse(body);
          logSafe('Input validation passed');
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            const errorMessages = validationError.errors.map(err => 
              `${err.path.join('.')}: ${err.message}`
            ).join('; ');
            
            logError('Validation failed', errorMessages);
            return new Response(JSON.stringify({
              success: false,
              error: `Validation failed: ${errorMessages}`,
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          throw validationError;
        }
      }

      // Rate limiting check
      if (config.rateLimit) {
        const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                        req.headers.get('x-real-ip') || 'unknown';
        const identifier = user?.id || clientIP;
        
        const rateLimitResult = await checkDatabaseRateLimit(
          supabaseClient,
          identifier,
          'payment-function',
          config.rateLimit.requests,
          config.rateLimit.windowMs
        );

        if (!rateLimitResult.allowed) {
          await logSecurityEvent(supabaseClient, {
            event_type: 'rate_limit_exceeded',
            severity: 'medium',
            user_id: user?.id,
            details: {
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

      // Execute the handler
      const context: RequestContext<T> = {
        supabaseClient,
        user,
        req,
        validatedData,
        startTime,
      };

      const result = await config.handler(context);

      // Log successful request with timing
      const duration = Date.now() - startTime;
      logSafe('Request completed successfully', { duration_ms: duration });
      
      if (config.endpointName) {
        logResponseTime(config.endpointName, startTime, true);
      }

      await logSecurityEvent(supabaseClient, {
        event_type: 'successful_request',
        severity: 'low',
        user_id: user?.id,
        details: {
          duration_ms: duration,
        },
      }, req);

      // Build response headers with timing
      const responseHeaders = withTimingHeaders(
        { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' },
        startTime,
        config.endpointName
      );

      return new Response(JSON.stringify({
        success: true,
        ...result,
      }), {
        headers: responseHeaders,
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logError('Request failed', error);
      
      if (config.endpointName) {
        logResponseTime(config.endpointName, startTime, false);
      }

      await logSecurityEvent(supabaseClient, {
        event_type: 'function_error',
        severity: 'high',
        details: {
          sanitized_error: sanitizeError(error),
          duration_ms: duration,
        },
      }, req);

      // Build error response headers with timing
      const responseHeaders = withTimingHeaders(
        { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' },
        startTime,
        config.endpointName
      );

      return new Response(JSON.stringify({
        success: false,
        error: sanitizeError(error),
      }), {
        status: 500,
        headers: responseHeaders,
      });
    }
  });

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
      return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) };
    }

    if (existing) {
      if (existing.request_count >= limit) {
        const resetTime = Math.floor(new Date(existing.window_end).getTime() / 1000);
        console.log(`[Rate Limit] Limit exceeded for ${identifier}: ${existing.request_count}/${limit}`);
        return { allowed: false, currentCount: existing.request_count, resetTime };
      }

      const { error: updateError } = await supabase
        .from('rate_limit_tracking')
        .update({ 
          request_count: existing.request_count + 1,
          window_end: new Date(now.getTime() + windowMs).toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[Rate Limit] Update error:', updateError);
        return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) };
      }

      const resetTime = Math.floor(new Date(existing.window_end).getTime() / 1000);
      return { allowed: true, currentCount: existing.request_count + 1, resetTime };
    } else {
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
        return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) };
      }

      const resetTime = Math.floor(windowEnd.getTime() / 1000);
      return { allowed: true, currentCount: 1, resetTime };
    }
  } catch (error) {
    console.error('[Rate Limit] Unexpected error:', error);
    return { allowed: true, currentCount: 0, resetTime: Math.floor((now.getTime() + windowMs) / 1000) };
  }
}

// Legacy export for backward compatibility
export interface LegacyRequestHandlerConfig {
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

export interface LegacyRequestContext {
  supabase: any;
  user?: any;
  request: Request;
  startTime: number;
}

/**
 * Legacy handleRequest for backward compatibility
 * @deprecated Use requestHandler instead
 */
export async function handleRequest<T>(
  config: LegacyRequestHandlerConfig,
  handler: (ctx: LegacyRequestContext) => Promise<T>
): Promise<(req: Request) => Promise<Response>> {
  return async (req: Request) => {
    const startTime = Date.now();

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    try {
      let user = null;
      if (config.requireAuth) {
        const authResult = await authenticateUser(supabase, req);
        if (authResult.error || !authResult.user) {
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

      const context: LegacyRequestContext = {
        supabase,
        user,
        request: req,
        startTime,
      };

      const result = await handler(context);

      return new Response(JSON.stringify({
        success: true,
        data: result,
      }), {
        headers: { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' },
      });

    } catch (error) {
      logError(config.functionName, error);

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
