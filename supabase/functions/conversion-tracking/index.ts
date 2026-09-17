import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CONVERSION-TRACKING] ${step}${detailsStr}`);
};

/**
 * Conversion Funnel Tracking
 * 
 * Tracks the pipeline: GitHub Clone → API Key Request → First API Call → Paid Conversion
 * 
 * Actions:
 * - track_event: Record a conversion funnel event
 * - get_funnel: Get funnel metrics (admin only)
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    logStep('Function started', { action });

    switch (action) {
      case 'track_event': {
        const { event_type, source_channel, metadata, user_id } = body;

        if (!event_type) {
          return new Response(JSON.stringify({ error: 'event_type required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        const validEvents = [
          'github_clone',
          'npm_install',
          'docs_visit',
          'api_key_request',
          'api_key_approved',
          'first_api_call',
          'tenth_api_call',
          'hundredth_api_call',
          'checkout_started',
          'subscription_created',
          'first_payment',
        ];

        if (!validEvents.includes(event_type)) {
          return new Response(JSON.stringify({ error: `Invalid event_type. Valid: ${validEvents.join(', ')}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        const { error } = await supabase.from('conversion_funnel').insert({
          event_type,
          source_channel: source_channel || 'unknown',
          user_id: user_id || null,
          metadata: metadata || {},
        });

        if (error) throw new Error(`Insert error: ${error.message}`);

        logStep('Event tracked', { event_type, source_channel });

        return new Response(JSON.stringify({ success: true, event_type }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'get_funnel': {
        // Auth required for funnel metrics
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Authentication required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          });
        }

        // Check admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!roles?.some((r: any) => r.role === 'admin')) {
          return new Response(JSON.stringify({ error: 'Admin access required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403,
          });
        }

        const { start_date, end_date } = body;

        // Get funnel metrics
        const { data: funnelData, error: funnelError } = await supabase
          .from('conversion_funnel')
          .select('event_type, source_channel, created_at')
          .gte('created_at', start_date || '2024-01-01')
          .lte('created_at', end_date || new Date().toISOString())
          .order('created_at', { ascending: false });

        if (funnelError) throw new Error(`Funnel query error: ${funnelError.message}`);

        // Aggregate by event type
        const eventCounts: Record<string, number> = {};
        const channelCounts: Record<string, Record<string, number>> = {};

        for (const row of funnelData || []) {
          eventCounts[row.event_type] = (eventCounts[row.event_type] || 0) + 1;

          if (!channelCounts[row.source_channel]) channelCounts[row.source_channel] = {};
          channelCounts[row.source_channel][row.event_type] =
            (channelCounts[row.source_channel][row.event_type] || 0) + 1;
        }

        // Calculate conversion rates
        const funnelStages = [
          'github_clone',
          'api_key_request',
          'first_api_call',
          'checkout_started',
          'subscription_created',
        ];

        const conversionRates: Record<string, number> = {};
        for (let i = 1; i < funnelStages.length; i++) {
          const prev = eventCounts[funnelStages[i - 1]] || 0;
          const curr = eventCounts[funnelStages[i]] || 0;
          if (prev > 0) {
            conversionRates[`${funnelStages[i - 1]}_to_${funnelStages[i]}`] =
              Math.round((curr / prev) * 10000) / 100;
          }
        }

        logStep('Funnel data retrieved', { totalEvents: funnelData?.length });

        return new Response(JSON.stringify({
          success: true,
          event_counts: eventCounts,
          channel_breakdown: channelCounts,
          conversion_rates: conversionRates,
          total_events: funnelData?.length || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action. Use: track_event, get_funnel' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR', { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
