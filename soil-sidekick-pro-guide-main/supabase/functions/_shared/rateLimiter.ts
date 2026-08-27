import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
  /** If true, deny requests when rate limiter errors occur (fail-closed). Default: false (fail-open) */
  failClosed?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
}

/**
 * Rate limiter using Supabase database for distributed rate limiting
 * @param identifier - Unique identifier (user_id or IP hash)
 * @param endpoint - Endpoint name for tracking
 * @param config - Rate limit configuration (use failClosed: true for critical endpoints)
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - config.windowMinutes);

  try {
    // Clean up old records for this identifier/endpoint
    await supabase
      .from('rate_limits')
      .delete()
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .lt('window_start', windowStart.toISOString());

    // Get current count for this window
    const { data: existingRecords, error: selectError } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1);

    if (selectError) {
      console.error('Rate limit select error:', selectError);
      // Fail-closed for critical endpoints, fail-open otherwise
      if (config.failClosed) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000),
          error: 'Rate limiter unavailable'
        };
      }
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000)
      };
    }

    const now = new Date();
    const currentCount = existingRecords?.[0]?.request_count || 0;

    if (currentCount >= config.maxRequests) {
      // Rate limit exceeded
      const oldestWindow = existingRecords?.[0]?.window_start 
        ? new Date(existingRecords[0].window_start)
        : now;
      const resetAt = new Date(oldestWindow.getTime() + config.windowMinutes * 60 * 1000);

      return {
        allowed: false,
        remaining: 0,
        resetAt
      };
    }

    // Increment counter
    if (existingRecords && existingRecords.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('rate_limits')
        .update({ 
          request_count: currentCount + 1,
          created_at: now.toISOString()
        })
        .eq('identifier', identifier)
        .eq('endpoint', endpoint)
        .eq('window_start', existingRecords[0].window_start);

      if (updateError) {
        console.error('Rate limit update error:', updateError);
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: now.toISOString()
        });

      if (insertError) {
        console.error('Rate limit insert error:', insertError);
      }
    }

    const resetAt = new Date(now.getTime() + config.windowMinutes * 60 * 1000);

    return {
      allowed: true,
      remaining: config.maxRequests - currentCount - 1,
      resetAt
    };
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Fail-closed for critical endpoints, fail-open otherwise
    if (config.failClosed) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000),
        error: 'Rate limiter unavailable'
      };
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000)
    };
  }
}

/**
 * Hash an IP address for privacy
 */
export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || req.headers.get('x-real-ip') 
    || 'unknown';
}
