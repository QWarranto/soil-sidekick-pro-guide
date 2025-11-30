import Stripe from "https://esm.sh/stripe@14.21.0";
import { requestHandler } from '../_shared/request-handler.ts';
import { customerPortalSchema } from '../_shared/validation.ts';
import { logSafe } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: customerPortalSchema,
  handler: async ({ user, req }) => {
    logSafe("customer-portal started", { userId: user.id });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    if (!user.email) {
      throw new Error("User email not available");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logSafe("Found Stripe customer", { customerId });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/pricing`,
    });
    logSafe("Customer portal session created", { sessionId: portalSession.id });

    return { url: portalSession.url };
  },
});