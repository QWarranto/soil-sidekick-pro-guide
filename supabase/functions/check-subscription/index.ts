/**
 * Check Subscription Status
 * Migrated: December 3, 2025 - Phase 2A.5
 * 
 * Uses standardized request handler with:
 * - Authentication required
 * - Input validation via subscriptionCheckSchema
 * - Service role for secure database operations
 * - Rate limiting: 200 requests/hour
 */

import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { subscriptionCheckSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false,
  validationSchema: subscriptionCheckSchema,
  useServiceRole: true, // Need service role for secure_upsert_subscriber
  rateLimit: {
    requests: 200,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ user, supabaseClient }) => {
    logSafe("check-subscription started", { userId: user.id });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logError("STRIPE_SECRET_KEY not configured");
      throw new Error("Payment system not configured");
    }

    if (!user.email) {
      throw new Error("User email not available");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Look up customer in Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logSafe("No Stripe customer found, setting unsubscribed state");
      
      // Use secure function to handle encrypted data
      const { error: upsertError } = await supabaseClient.rpc('secure_upsert_subscriber', {
        p_user_id: user.id,
        p_email: user.email,
        p_stripe_customer_id: null,
        p_subscribed: false,
        p_subscription_tier: null,
        p_subscription_interval: null,
        p_subscription_end: null
      });
      
      if (upsertError) {
        logError("Failed to update subscriber", upsertError);
        throw new Error(`Failed to update subscription status: ${upsertError.message}`);
      }
      
      return { 
        subscribed: false,
        subscription_tier: null,
        subscription_interval: null,
        subscription_end: null,
      };
    }

    const customerId = customers.data[0].id;
    logSafe("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier: string | null = null;
    let subscriptionInterval: string | null = null;
    let subscriptionEnd: string | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logSafe("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd 
      });
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      const interval = price.recurring?.interval;
      
      subscriptionInterval = interval || null;
      
      // Map price to tier
      if (amount >= 14900) {
        subscriptionTier = "Enterprise";
      } else if (amount >= 7900) {
        subscriptionTier = "Pro";
      } else if (amount >= 2900) {
        subscriptionTier = "Starter";
      } else {
        subscriptionTier = "Free";
      }
      
      logSafe("Determined subscription tier", { 
        priceId, 
        amount, 
        subscriptionTier, 
        interval 
      });
    } else {
      logSafe("No active subscription found");
    }

    // Update database with subscription info using secure function
    const { error: upsertError } = await supabaseClient.rpc('secure_upsert_subscriber', {
      p_user_id: user.id,
      p_email: user.email,
      p_stripe_customer_id: customerId,
      p_subscribed: hasActiveSub,
      p_subscription_tier: subscriptionTier,
      p_subscription_interval: subscriptionInterval,
      p_subscription_end: subscriptionEnd
    });
    
    if (upsertError) {
      logError("Failed to update subscriber", upsertError);
      throw new Error(`Failed to update subscription status: ${upsertError.message}`);
    }

    logSafe("Updated database with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier, 
      subscriptionInterval 
    });

    // Track API usage
    try {
      await supabaseClient.from('cost_tracking').insert({
        service_provider: 'stripe',
        service_type: 'subscription_check',
        feature_name: 'check-subscription',
        cost_usd: 0.00,
        usage_count: 1,
        user_id: user.id,
        request_details: {
          has_subscription: hasActiveSub,
          tier: subscriptionTier,
        },
      });
    } catch (costError) {
      logError('Cost tracking failed', costError);
    }
    
    return {
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_interval: subscriptionInterval,
      subscription_end: subscriptionEnd,
    };
  },
});
