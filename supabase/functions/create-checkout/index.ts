import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logSafe, logError } from '../_shared/logging-utils.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logSafe("create-checkout started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logSafe("User authenticated", { userId: user.id, email: user.email });

    const { plan, interval } = await req.json();
    if (!plan || !interval) throw new Error("Plan and interval are required");
    logSafe("Request details", { plan, interval });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

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

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logError("create-checkout", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});