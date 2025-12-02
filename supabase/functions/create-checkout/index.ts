/**
 * Create Checkout Session
 * Migrated: December 3, 2025 - Phase 2A.2
 * 
 * Uses standardized request handler with:
 * - Authentication required
 * - Input validation via checkoutSchema
 * - Rate limiting: 100 requests/hour
 */

import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { checkoutSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false,
  validationSchema: checkoutSchema,
  rateLimit: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ user, validatedData, supabaseClient, req }) => {
    logSafe("create-checkout started", { userId: user.id });

    const { plan, interval } = validatedData;

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logError("STRIPE_SECRET_KEY not configured");
      throw new Error("Payment system not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    if (!user.email) {
      throw new Error("User email not available");
    }

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logSafe("Found existing customer", { customerId });
    } else {
      logSafe("Creating new customer for checkout");
    }

    // Define pricing structure
    const prices: Record<string, Record<string, number>> = {
      starter: {
        month: 2900,  // $29.00
        year: 29000,  // $290.00 (2 months free)
      },
      pro: {
        month: 7900,  // $79.00
        year: 79000,  // $790.00 (2 months free)
      },
      enterprise: {
        month: 14900,  // $149.00
        year: 149000,  // $1490.00 (2 months free)
      }
    };

    const amount = prices[plan]?.[interval];
    if (!amount) {
      logError("Invalid plan or interval", { plan, interval });
      throw new Error("Invalid plan or billing interval");
    }
    
    logSafe("Price calculated", { plan, interval, amount });

    // Create Stripe checkout session
    const origin = req.headers.get("origin") || "https://soilsidekick.com";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan ${interval === 'year' ? '(Annual)' : '(Monthly)'}`,
              description: interval === 'year' ? 'Get 2 months free with annual billing' : undefined
            },
            unit_amount: amount,
            recurring: { interval: interval === 'year' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan: plan,
        interval: interval,
      },
    });

    logSafe("Checkout session created", { sessionId: session.id });

    // Track cost for this API call
    try {
      await supabaseClient.from('cost_tracking').insert({
        service_provider: 'stripe',
        service_type: 'checkout_session',
        feature_name: 'create-checkout',
        cost_usd: 0.00, // Stripe doesn't charge for session creation
        usage_count: 1,
        user_id: user.id,
        request_details: {
          plan,
          interval,
          session_id: session.id,
        },
      });
    } catch (costError) {
      logError('Cost tracking failed', costError);
      // Don't fail the request if cost tracking fails
    }

    return { url: session.url };
  },
});
