import { createClient } from 'jsr:@supabase/supabase-js@2';
import { rateLimiter, API_PROVIDERS } from '../_shared/api-rate-limiter.ts';
import { loadMonitor } from '../_shared/load-monitor.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user (optional - can be public for status page)
    const authHeader = req.headers.get('Authorization');
    let userTier: 'starter' | 'professional' | 'custom' = 'starter';

    if (authHeader) {
      const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      
      if (user) {
        // Get user's subscription tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile?.subscription_tier === 'professional' || profile?.subscription_tier === 'pro') {
          userTier = 'professional';
        } else if (profile?.subscription_tier === 'enterprise') {
          userTier = 'custom';
        }
      }
    }

    // Get system health
    const systemHealth = loadMonitor.getSystemHealth();
    const trends = loadMonitor.getTrends(5);

    // Get rate limiter status for each provider
    const providerStatus: Record<string, any> = {};
    Object.entries(API_PROVIDERS).forEach(([key, config]) => {
      const status = rateLimiter.getStatus(key);
      providerStatus[key] = {
        name: config.name,
        available: !status.circuitOpen,
        limits: {
          perMinute: `${status.requestsLastMinute}/${config.maxRequestsPerMinute}`,
          perHour: `${status.requestsLastHour}/${config.maxRequestsPerHour}`,
          perDay: `${status.requestsLastDay}/${config.maxRequestsPerDay}`,
        },
        circuit: {
          open: status.circuitOpen,
          failures: status.failures,
        },
        queue: {
          size: status.queueLength,
          status: status.queueLength === 0 ? 'empty' : 
                  status.queueLength < 10 ? 'normal' : 
                  status.queueLength < 50 ? 'elevated' : 'critical'
        }
      };
    });

    // Check if user can make request
    const loadCheck = loadMonitor.canAcceptRequest(userTier);

    return new Response(JSON.stringify({
      success: true,
      system: {
        health_score: systemHealth.systemHealthScore,
        status: systemHealth.systemHealthScore >= 80 ? 'healthy' : 
                systemHealth.systemHealthScore >= 60 ? 'degraded' : 
                systemHealth.systemHealthScore >= 40 ? 'impaired' : 'critical',
        active_requests: systemHealth.activeRequests,
        queued_requests: systemHealth.queuedRequests,
        circuit_breakers_open: systemHealth.circuitBreakersOpen,
      },
      trends: {
        last_5_minutes: trends,
      },
      providers: providerStatus,
      user_access: {
        tier: userTier,
        can_make_request: loadCheck.allowed,
        reason: loadCheck.reason,
        suggested_action: loadCheck.suggestedAction,
      },
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in api-health-monitor:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to retrieve health status' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
