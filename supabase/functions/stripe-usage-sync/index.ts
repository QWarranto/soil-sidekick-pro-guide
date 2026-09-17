import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@18.5.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-USAGE-SYNC] ${step}${detailsStr}`);
};

/**
 * Stripe Usage Sync Edge Function
 * 
 * Reads from cost_tracking table and reports usage to Stripe Billing Meters.
 * Can be triggered:
 * - Periodically via cron (recommended: every hour)
 * - Manually via POST request
 * - After each API call (real-time mode)
 * 
 * Modes:
 * - "batch": Sync all unsynced records (default)
 * - "realtime": Sync a single usage event immediately
 * - "setup": Create the Stripe Billing Meter (one-time)
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY not configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2025-08-27.basil' });

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'batch';

    logStep('Function started', { mode });

    // Optional auth check for manual triggers
    const authHeader = req.headers.get('Authorization');
    if (authHeader && mode !== 'batch') {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        });
      }
    }

    switch (mode) {
      case 'setup': {
        return await handleSetup(stripe);
      }

      case 'realtime': {
        return await handleRealtime(stripe, supabase, body);
      }

      case 'batch':
      default: {
        return await handleBatchSync(stripe, supabase);
      }
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

/**
 * One-time setup: Create Stripe Billing Meter
 */
async function handleSetup(stripe: Stripe) {
  logStep('Creating Stripe Billing Meter');

  try {
    // Check if meter already exists
    const existingMeters = await stripe.billing.meters.list({ limit: 10 });
    const existing = existingMeters.data.find(m => m.event_name === 'leafengines_api_call');

    if (existing) {
      logStep('Meter already exists', { meterId: existing.id });
      return new Response(JSON.stringify({
        success: true,
        message: 'Billing meter already exists',
        meter_id: existing.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const meter = await stripe.billing.meters.create({
      display_name: 'LeafEngines API Calls',
      event_name: 'leafengines_api_call',
      default_aggregation: { formula: 'sum' },
      value_settings: { event_payload_key: 'api_calls' },
      customer_mapping: {
        event_payload_key: 'stripe_customer_id',
        type: 'by_id',
      },
    });

    logStep('Billing meter created', { meterId: meter.id });

    return new Response(JSON.stringify({
      success: true,
      message: 'Billing meter created successfully',
      meter_id: meter.id,
      event_name: meter.event_name,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('Setup error', { message: errorMessage });
    return new Response(JSON.stringify({ error: `Setup failed: ${errorMessage}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

/**
 * Real-time: Report a single usage event immediately
 */
async function handleRealtime(stripe: Stripe, supabase: any, body: any) {
  const { user_id, service_provider, service_type, usage_count, feature_name } = body;

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'user_id required for realtime mode' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Look up Stripe customer for this user
  const stripeCustomerId = await getStripeCustomerId(stripe, supabase, user_id);
  if (!stripeCustomerId) {
    logStep('No Stripe customer found, skipping meter event', { user_id });
    return new Response(JSON.stringify({
      success: true,
      message: 'No Stripe customer found — usage tracked locally only',
      synced: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  // Report to Stripe Billing Meter
  await stripe.billing.meterEvents.create({
    event_name: 'leafengines_api_call',
    payload: {
      stripe_customer_id: stripeCustomerId,
      api_calls: String(usage_count || 1),
    },
  });

  logStep('Realtime meter event reported', {
    user_id,
    stripe_customer_id: stripeCustomerId,
    usage_count: usage_count || 1,
    feature_name,
  });

  return new Response(JSON.stringify({
    success: true,
    synced: true,
    stripe_customer_id: stripeCustomerId,
    usage_count: usage_count || 1,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

/**
 * Batch: Sync all unsynced cost_tracking records to Stripe
 */
async function handleBatchSync(stripe: Stripe, supabase: any) {
  logStep('Starting batch sync');

  // Get unsynced cost_tracking records (those without stripe_synced flag)
  const { data: unsyncedRecords, error: fetchError } = await supabase
    .from('cost_tracking')
    .select('*')
    .is('request_details->stripe_synced', null)
    .not('user_id', 'is', null)
    .order('created_at', { ascending: true })
    .limit(500);

  if (fetchError) {
    logStep('Error fetching unsynced records', { error: fetchError.message });
    return new Response(JSON.stringify({ error: fetchError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (!unsyncedRecords || unsyncedRecords.length === 0) {
    logStep('No unsynced records found');
    return new Response(JSON.stringify({
      success: true,
      message: 'No records to sync',
      synced_count: 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  logStep('Found unsynced records', { count: unsyncedRecords.length });

  // Group records by user_id for efficient Stripe customer lookups
  const byUser: Record<string, any[]> = {};
  for (const record of unsyncedRecords) {
    if (!byUser[record.user_id]) byUser[record.user_id] = [];
    byUser[record.user_id].push(record);
  }

  let syncedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const [userId, records] of Object.entries(byUser)) {
    try {
      const stripeCustomerId = await getStripeCustomerId(stripe, supabase, userId);

      if (!stripeCustomerId) {
        logStep('No Stripe customer for user, skipping', { userId, recordCount: records.length });
        skippedCount += records.length;
        continue;
      }

      // Aggregate usage per user for this batch
      const totalUsage = records.reduce((sum, r) => sum + (r.usage_count || 1), 0);

      // Report aggregated meter event
      await stripe.billing.meterEvents.create({
        event_name: 'leafengines_api_call',
        payload: {
          stripe_customer_id: stripeCustomerId,
          api_calls: String(totalUsage),
        },
      });

      logStep('Meter event reported', {
        userId,
        stripeCustomerId,
        totalUsage,
        recordCount: records.length,
      });

      // Mark records as synced
      for (const record of records) {
        const updatedDetails = {
          ...(record.request_details || {}),
          stripe_synced: true,
          stripe_synced_at: new Date().toISOString(),
          stripe_customer_id: stripeCustomerId,
        };

        await supabase
          .from('cost_tracking')
          .update({ request_details: updatedDetails })
          .eq('id', record.id);
      }

      syncedCount += records.length;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      logStep('Error syncing user records', { userId, error: msg });
      errors.push(`User ${userId}: ${msg}`);
      errorCount += records.length;
    }
  }

  const result = {
    success: true,
    synced_count: syncedCount,
    skipped_count: skippedCount,
    error_count: errorCount,
    total_processed: unsyncedRecords.length,
    errors: errors.length > 0 ? errors : undefined,
  };

  logStep('Batch sync complete', result);

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

/**
 * Look up Stripe customer ID for a Supabase user
 * Checks subscribers table first, then falls back to Stripe API lookup by email
 */
async function getStripeCustomerId(
  stripe: Stripe,
  supabase: any,
  userId: string
): Promise<string | null> {
  // Try subscribers table first
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (subscriber?.stripe_customer_id) {
    return subscriber.stripe_customer_id;
  }

  // Fall back to email lookup via auth
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (!user?.email) return null;

  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  return customers.data.length > 0 ? customers.data[0].id : null;
}
