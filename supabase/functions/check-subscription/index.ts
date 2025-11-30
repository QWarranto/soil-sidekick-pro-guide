import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { subscriptionCheckSchema } from '../_shared/validation.ts';
import { logSafe } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false,
  validationSchema: subscriptionCheckSchema,
  useServiceRole: true, // Need service role for secure_upsert_subscriber
  handler: async ({ user, supabaseClient }) => {
    logSafe("check-subscription started", { userId: user.id });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    if (!user.email) {
      throw new Error("User email not available");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logSafe("No customer found, updating unsubscribed state");
      
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
        throw new Error(`Failed to update subscriber: ${upsertError.message}`);
      }
      
      return { subscribed: false };
    }

    const customerId = customers.data[0].id;
    logSafe("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionInterval = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logSafe("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determine subscription tier and interval from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      const interval = price.recurring?.interval;
      
      subscriptionInterval = interval;
      
      if (amount >= 14900) {
        subscriptionTier = "Enterprise";
      } else if (amount >= 7900) {
        subscriptionTier = "Pro";
      } else if (amount >= 2900) {
        subscriptionTier = "Starter";
      } else {
        subscriptionTier = "Free";
      }
      logSafe("Determined subscription tier", { priceId, amount, subscriptionTier, interval });
    } else {
      logSafe("No active subscription found");
    }

    // Use secure function to handle encrypted data
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
      throw new Error(`Failed to update subscriber: ${upsertError.message}`);
    }

    logSafe("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier, subscriptionInterval });
    
    return {
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_interval: subscriptionInterval,
      subscription_end: subscriptionEnd
    };
  },
});