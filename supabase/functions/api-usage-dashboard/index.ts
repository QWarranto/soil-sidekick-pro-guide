import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { withTimingHeaders, logResponseTime } from '../_shared/response-timing.ts';

/**
 * API Usage Dashboard Endpoint
 * Provides usage transparency for SDK licensees
 * 
 * Phase 2 Implementation - Weeks 5-6
 */

interface UsageResponse {
  licensee_id: string;
  period: {
    start: string;
    end: string;
  };
  usage: {
    total_requests: number;
    by_endpoint: Record<string, number>;
    by_day: Array<{ date: string; count: number }>;
  };
  billing: {
    tier: string;
    included_requests: number;
    overage_requests: number;
    overage_cost: number;
  };
  rate_limits: {
    current_minute: number;
    limit_minute: number;
    remaining: number;
  };
}

const TIER_LIMITS: Record<string, { included: number; rate_per_minute: number; overage_cost: number }> = {
  starter: { included: 10000, rate_per_minute: 10, overage_cost: 0.001 },
  professional: { included: 100000, rate_per_minute: 100, overage_cost: 0.0005 },
  enterprise: { included: 1000000, rate_per_minute: 500, overage_cost: 0.0002 },
  partner: { included: 50000, rate_per_minute: 50, overage_cost: 0.0008 }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Authenticate via API key or JWT
    const apiKey = req.headers.get('x-api-key');
    const authHeader = req.headers.get('Authorization');
    
    let userId: string;
    let tier = 'starter';

    if (apiKey) {
      // API key authentication
      const { data: keyData, error: keyError } = await supabase
        .from('api_keys')
        .select('user_id, subscription_tier, is_active')
        .eq('key_hash', await hashApiKey(apiKey))
        .single();

      if (keyError || !keyData || !keyData.is_active) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      userId = keyData.user_id;
      tier = keyData.subscription_tier || 'starter';
    } else if (authHeader) {
      // JWT authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      userId = user.id;

      // Get tier from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('user_id', userId)
        .single();

      tier = profile?.subscription_tier || 'starter';
    } else {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const periodStart = url.searchParams.get('start') || getMonthStart();
    const periodEnd = url.searchParams.get('end') || new Date().toISOString().split('T')[0];

    // Get usage data
    const { data: usageData, error: usageError } = await supabase
      .from('cost_tracking')
      .select('feature_name, date_bucket, usage_count, cost_usd')
      .eq('user_id', userId)
      .gte('date_bucket', periodStart)
      .lte('date_bucket', periodEnd);

    if (usageError) {
      console.error('Usage query error:', usageError);
      throw new Error('Failed to fetch usage data');
    }

    // Aggregate usage by endpoint
    const byEndpoint: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    let totalRequests = 0;

    for (const record of usageData || []) {
      byEndpoint[record.feature_name] = (byEndpoint[record.feature_name] || 0) + record.usage_count;
      byDay[record.date_bucket] = (byDay[record.date_bucket] || 0) + record.usage_count;
      totalRequests += record.usage_count;
    }

    // Get current minute rate limit usage
    const { data: rateLimitData } = await supabase
      .from('rate_limit_tracking')
      .select('request_count')
      .eq('identifier', userId)
      .gte('window_start', new Date(Date.now() - 60000).toISOString())
      .single();

    const tierLimits = TIER_LIMITS[tier] || TIER_LIMITS.starter;
    const currentMinuteUsage = rateLimitData?.request_count || 0;
    const overageRequests = Math.max(0, totalRequests - tierLimits.included);
    const overageCost = overageRequests * tierLimits.overage_cost;

    const response: UsageResponse = {
      licensee_id: userId,
      period: {
        start: periodStart,
        end: periodEnd
      },
      usage: {
        total_requests: totalRequests,
        by_endpoint: byEndpoint,
        by_day: Object.entries(byDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
      },
      billing: {
        tier,
        included_requests: tierLimits.included,
        overage_requests: overageRequests,
        overage_cost: Math.round(overageCost * 100) / 100
      },
      rate_limits: {
        current_minute: currentMinuteUsage,
        limit_minute: tierLimits.rate_per_minute,
        remaining: Math.max(0, tierLimits.rate_per_minute - currentMinuteUsage)
      }
    };

    logResponseTime('api-usage-dashboard', startTime, true);

    return new Response(JSON.stringify(response), {
      headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, 'api-usage-dashboard')
    });

  } catch (error) {
    console.error('Usage dashboard error:', error);
    logResponseTime('api-usage-dashboard', startTime, false);

    return new Response(JSON.stringify({
      error: 'Failed to retrieve usage data',
      message: error.message
    }), {
      status: 500,
      headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, 'api-usage-dashboard')
    });
  }
});

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey + 'SS_API_' + apiKey.substring(3, 11) + '_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
