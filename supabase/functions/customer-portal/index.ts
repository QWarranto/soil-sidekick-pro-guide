/**
 * Customer Portal Session
 * Migrated: December 3, 2025 - Phase 2A.4
 * 
 * Uses standardized request handler with:
 * - Authentication required
 * - Active subscription required
 * - Input validation via customerPortalSchema
 * - Rate limiting: 50 requests/hour
 */

import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { customerPortalSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: customerPortalSchema,
  rateLimit: {
    requests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ user, req, supabaseClient }) => {
    logSafe("customer-portal started", { userId: user.id });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logError("STRIPE_SECRET_KEY not configured");
      throw new Error("Payment system not configured");
    }

    if (!user.email) {
      throw new Error("User email not available");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Find the Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logError("No Stripe customer found", { email: user.email });
      throw new Error("No billing account found. Please contact support.");
    }
    
    const customerId = customers.data[0].id;
    logSafe("Found Stripe customer", { customerId });

    // Create portal session
    const origin = req.headers.get("origin") || "https://soilsidekick.com";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/pricing`,
    });
    
    logSafe("Customer portal session created", { sessionId: portalSession.id });

    // Track cost for this API call
    try {
      await supabaseClient.from('cost_tracking').insert({
        service_provider: 'stripe',
        service_type: 'portal_session',
        feature_name: 'customer-portal',
        cost_usd: 0.00,
        usage_count: 1,
        user_id: user.id,
        request_details: {
          customer_id: customerId,
          session_id: portalSession.id,
        },
      });
    } catch (costError) {
      logError('Cost tracking failed', costError);
    }

    return { url: portalSession.url };
  },
});
