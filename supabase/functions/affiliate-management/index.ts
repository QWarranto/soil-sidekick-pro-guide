import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const COMMISSION_RATES: Record<string, number> = {
  free: 0,
  starter: 0.30,
  pro: 0.30,
  enterprise: 0.15,
};

const PAYOUT_THRESHOLD = 50; // $50 minimum

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    switch (action) {
      case 'register': {
        // Generate unique affiliate code
        const codeBase = user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'affiliate';
        const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `${codeBase.substring(0, 10).toUpperCase()}_${suffix}`;

        const { data, error } = await supabase
          .from('affiliate_codes')
          .insert({ user_id: user.id, code, commission_rate: 0.30 })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') throw new Error('You already have an affiliate code');
          throw error;
        }

        return new Response(JSON.stringify({ affiliate: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'dashboard': {
        // Get affiliate codes
        const { data: codes } = await supabase
          .from('affiliate_codes')
          .select('*')
          .eq('user_id', user.id);

        if (!codes?.length) {
          return new Response(JSON.stringify({ registered: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const codeIds = codes.map(c => c.id);

        // Get referrals
        const { data: referrals } = await supabase
          .from('affiliate_referrals')
          .select('*')
          .in('affiliate_code_id', codeIds)
          .order('created_at', { ascending: false })
          .limit(50);

        // Get payouts
        const { data: payouts } = await supabase
          .from('affiliate_payouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Calculate stats
        const totalEarnings = referrals?.reduce((sum, r) => sum + Number(r.commission_amount), 0) || 0;
        const pendingEarnings = referrals
          ?.filter(r => r.status === 'active')
          .reduce((sum, r) => sum + Number(r.commission_amount), 0) || 0;
        const paidOut = payouts
          ?.filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        return new Response(JSON.stringify({
          registered: true,
          codes,
          referrals: referrals || [],
          payouts: payouts || [],
          stats: {
            totalReferrals: referrals?.length || 0,
            activeReferrals: referrals?.filter(r => r.status === 'active').length || 0,
            totalEarnings,
            pendingEarnings,
            paidOut,
            availableForPayout: totalEarnings - paidOut,
            canRequestPayout: (totalEarnings - paidOut) >= PAYOUT_THRESHOLD,
          },
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'validate-code': {
        const body = await req.json();
        const { code } = body;
        if (!code) throw new Error('Code is required');

        const { data } = await supabase
          .from('affiliate_codes')
          .select('id, code, commission_rate')
          .eq('code', code.toUpperCase())
          .eq('status', 'active')
          .single();

        return new Response(JSON.stringify({ valid: !!data, affiliate: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'track-referral': {
        // Called after a successful subscription checkout
        const body = await req.json();
        const { affiliate_code_id, referred_user_id, subscription_tier, subscription_amount } = body;

        const commissionRate = COMMISSION_RATES[subscription_tier] || 0.30;
        const commissionAmount = subscription_amount * commissionRate;

        const { data, error } = await supabase
          .from('affiliate_referrals')
          .insert({
            affiliate_code_id,
            referred_user_id,
            subscription_tier,
            subscription_amount,
            commission_amount: commissionAmount,
            commission_rate: commissionRate,
            status: 'active',
          })
          .select()
          .single();

        if (error) throw error;

        // Update affiliate totals
        await supabase.rpc('increment_affiliate_stats', {
          p_code_id: affiliate_code_id,
          p_earnings: commissionAmount,
        }).catch(() => {
          // Fallback: manual update
          console.log('RPC not available, skipping stats update');
        });

        return new Response(JSON.stringify({ referral: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'request-payout': {
        // Get available balance
        const { data: codes } = await supabase
          .from('affiliate_codes')
          .select('id')
          .eq('user_id', user.id);

        if (!codes?.length) throw new Error('No affiliate account found');

        const codeIds = codes.map(c => c.id);

        const { data: referrals } = await supabase
          .from('affiliate_referrals')
          .select('commission_amount')
          .in('affiliate_code_id', codeIds)
          .eq('status', 'active');

        const { data: completedPayouts } = await supabase
          .from('affiliate_payouts')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        const totalEarnings = referrals?.reduce((s, r) => s + Number(r.commission_amount), 0) || 0;
        const totalPaid = completedPayouts?.reduce((s, p) => s + Number(p.amount), 0) || 0;
        const available = totalEarnings - totalPaid;

        if (available < PAYOUT_THRESHOLD) {
          throw new Error(`Minimum payout is $${PAYOUT_THRESHOLD}. Available: $${available.toFixed(2)}`);
        }

        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const { data: payout, error } = await supabase
          .from('affiliate_payouts')
          .insert({
            user_id: user.id,
            amount: available,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
            referral_count: referrals?.length || 0,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ payout }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
