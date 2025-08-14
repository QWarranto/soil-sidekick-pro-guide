import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cost calculation constants (updated rates as of 2024)
const COST_RATES = {
  openai: {
    'gpt-4-analysis': { input: 0.03, output: 0.06 }, // per 1K tokens
    'vision-analysis': 0.50, // per image
    'embeddings': 0.0001, // per 1K tokens
  },
  supabase: {
    'database-query': 0.0001, // per query
    'function-invocation': 0.00002, // per invocation
    'storage-gb': 0.021, // per GB/month
  },
  usda: {
    'api-request': 0.005, // per request
  },
  google_earth: {
    'processing-unit': 0.08, // per processing unit
    'api-request': 0.01, // per request
  },
  census: {
    'api-request': 0.003, // per request
  }
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[COST-MONITORING] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    logStep('Cost monitoring request started');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error('User not authenticated');

    const { action, ...body } = await req.json();
    logStep('Processing action', { action, userId: user.id });

    switch (action) {
      case 'track_cost': {
        const { service_provider, service_type, usage_amount, feature_name, request_details } = body;
        
        // Calculate cost based on service type and usage
        let cost_usd = 0;
        const serviceRates = COST_RATES[service_provider as keyof typeof COST_RATES];
        
        if (serviceRates) {
          const rate = serviceRates[service_type as keyof typeof serviceRates];
          if (typeof rate === 'number') {
            cost_usd = rate * usage_amount;
          } else if (typeof rate === 'object' && rate.input) {
            // For OpenAI models with input/output pricing
            const inputTokens = request_details?.input_tokens || usage_amount;
            const outputTokens = request_details?.output_tokens || 0;
            cost_usd = (inputTokens / 1000 * rate.input) + (outputTokens / 1000 * rate.output);
          }
        }

        logStep('Calculated cost', { service_provider, service_type, usage_amount, cost_usd });

        // Track the cost
        const { data: trackingData, error: trackingError } = await supabaseClient.rpc('track_api_cost', {
          p_service_provider: service_provider,
          p_service_type: service_type,
          p_cost_usd: cost_usd,
          p_user_id: user.id,
          p_feature_name: feature_name,
          p_request_details: request_details || {}
        });

        if (trackingError) throw new Error(`Cost tracking error: ${trackingError.message}`);

        // Check for cost alerts
        const { data: alerts, error: alertsError } = await supabaseClient.rpc('check_cost_alerts');
        if (alertsError) {
          logStep('Alert check error', alertsError);
        } else if (alerts && alerts.length > 0) {
          logStep('Cost alerts triggered', { alertCount: alerts.length });
          // TODO: Send notifications for triggered alerts
        }

        return new Response(JSON.stringify({ 
          success: true, 
          tracking_id: trackingData,
          cost_usd,
          alerts: alerts || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'track_usage': {
        const { session_id, feature_name, action_type, subscription_tier, duration_seconds, success_rate, error_details, metadata } = body;
        
        const { data: analyticsData, error: analyticsError } = await supabaseClient.rpc('track_usage_event', {
          p_user_id: user.id,
          p_session_id: session_id,
          p_feature_name: feature_name,
          p_action_type: action_type,
          p_subscription_tier: subscription_tier,
          p_duration_seconds: duration_seconds,
          p_success_rate: success_rate,
          p_error_details: error_details || {},
          p_metadata: metadata || {}
        });

        if (analyticsError) throw new Error(`Analytics tracking error: ${analyticsError.message}`);

        return new Response(JSON.stringify({ 
          success: true, 
          analytics_id: analyticsData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'get_cost_summary': {
        const { start_date, end_date, service_provider } = body;
        
        // Only admins can access cost summaries
        const { data: userRoles, error: rolesError } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError || !userRoles.some(r => r.role === 'admin')) {
          throw new Error('Access denied. Admin privileges required.');
        }

        const { data: costSummary, error: summaryError } = await supabaseClient.rpc('get_cost_summary', {
          p_start_date: start_date,
          p_end_date: end_date,
          p_service_provider: service_provider
        });

        if (summaryError) throw new Error(`Cost summary error: ${summaryError.message}`);

        return new Response(JSON.stringify({ 
          success: true, 
          data: costSummary 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'get_user_costs': {
        // Users can view their own cost data
        const { start_date, end_date } = body;
        
        const { data: userCosts, error: costsError } = await supabaseClient
          .from('cost_tracking')
          .select('*')
          .eq('user_id', user.id)
          .gte('date_bucket', start_date || '2024-01-01')
          .lte('date_bucket', end_date || new Date().toISOString().slice(0, 10))
          .order('created_at', { ascending: false });

        if (costsError) throw new Error(`User costs error: ${costsError.message}`);

        return new Response(JSON.stringify({ 
          success: true, 
          data: userCosts 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR in cost-monitoring', { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});