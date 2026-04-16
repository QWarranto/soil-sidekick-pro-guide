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

    const { plan, interval, referral_code } = validatedData;

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

    // Define pricing structure (Option A renaming, Dec 2025)
    // Legacy keys (starter/pro/enterprise) remain accepted for backward compatibility
    // and are aliased to the new consumer-tier names: hobby/grower/pro.
    const planAliases: Record<string, string> = {
      starter: 'hobby',     // legacy → new
      pro: 'grower',        // legacy → new (NOTE: old "pro" === new "grower" at $79)
      enterprise: 'pro',    // legacy → new (old "enterprise" === new "pro" at $149)
      // New canonical keys pass through:
      hobby: 'hobby',
      grower: 'grower',
    };

    // Resolve incoming plan key to canonical new-name key.
    // If a client sends "pro" we treat it as the legacy mid-tier ($79 grower).
    // New clients should send hobby/grower/pro explicitly.
    const canonicalPlan = planAliases[plan] ?? plan;

    const prices: Record<string, Record<string, number>> = {
      hobby: {
        month: 2900,   // $29.00
        year: 29000,   // $290.00 (2 months free)
      },
      grower: {
        month: 7900,   // $79.00
        year: 79000,   // $790.00 (2 months free)
      },
      pro: {
        month: 14900,  // $149.00
        year: 149000,  // $1,490.00 (2 months free)
      },
    };

    const planDisplayNames: Record<string, string> = {
      hobby: 'Hobby',
      grower: 'Grower',
      pro: 'Pro',
    };

    const amount = prices[canonicalPlan]?.[interval];
    if (!amount) {
      logError("Invalid plan or interval", { plan, interval });
      throw new Error("Invalid plan or billing interval");
    }
    
    logSafe("Price calculated", { plan, canonicalPlan, interval, amount });

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
              name: `${planDisplayNames[canonicalPlan] ?? canonicalPlan} Plan ${interval === 'year' ? '(Annual)' : '(Monthly)'}`,
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
        plan: canonicalPlan,        // new canonical name (hobby/grower/pro)
        plan_legacy: plan,          // original key sent by client (for audit)
        interval: interval,
        referral_code: referral_code || '',
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
