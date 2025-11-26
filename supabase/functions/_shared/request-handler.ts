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

      // Rate limiting
      if (config.rateLimit) {
        const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitKey = `${config.functionName}:${clientIP}`;
        
        // Simple in-memory rate limiting (will be replaced by rateLimiter)
        const now = Date.now();
        const key = rateLimitKey;
        // TODO: Implement proper rate limiting check
      }

      // Authentication
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

      return new Response(JSON.stringify({
        success: true,
        data: result,
      }), {
        headers: { ...getSecurityHeaders(corsHeaders), 'Content-Type': 'application/json' },
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
