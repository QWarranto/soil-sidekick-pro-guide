import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { checkoutSchema } from '../_shared/validation.ts';
import { logSafe } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false,
  validationSchema: checkoutSchema,
  handler: async ({ user, validatedData, supabaseClient, req }) => {
    logSafe("create-checkout started", { userId: user.id });

    const { plan, interval } = validatedData;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    if (!user.email) {
      throw new Error("User email not available");
    }

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logSafe("Found existing customer", { customerId });
    } else {
      logSafe("Creating new customer");
    }

    // Define pricing - Updated prices
    const prices = {
      starter: {
        month: 2900, // $29.00
        year: 29000, // $290.00
      },
      pro: {
        month: 7900, // $79.00
        year: 79000, // $790.00
      },
      enterprise: {
        month: 14900, // $149.00
        year: 149000, // $1490.00
      }
    };

    const amount = prices[plan as keyof typeof prices]?.[interval as keyof typeof prices['pro']];
    if (!amount) throw new Error("Invalid plan or interval");
    logSafe("Price calculated", { plan, interval, amount });

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
      success_url: `${req.headers.get("origin")}/pricing?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
    });

    logSafe("Checkout session created", { sessionId: session.id });

    return { url: session.url };
  },
});