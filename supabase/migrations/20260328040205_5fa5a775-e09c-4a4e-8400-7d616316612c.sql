
-- Affiliate codes table
CREATE TABLE public.affiliate_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  commission_rate numeric NOT NULL DEFAULT 0.30,
  status text NOT NULL DEFAULT 'active',
  total_referrals integer NOT NULL DEFAULT 0,
  total_earnings numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Affiliate referrals table
CREATE TABLE public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_code_id uuid NOT NULL REFERENCES public.affiliate_codes(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL,
  subscription_tier text,
  subscription_amount numeric NOT NULL DEFAULT 0,
  commission_amount numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 0.30,
  status text NOT NULL DEFAULT 'pending',
  attribution_date timestamptz NOT NULL DEFAULT now(),
  last_commission_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payout_method text NOT NULL DEFAULT 'stripe',
  stripe_transfer_id text,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  referral_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.affiliate_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS: affiliate_codes
CREATE POLICY "Users can view own affiliate codes" ON public.affiliate_codes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own affiliate codes" ON public.affiliate_codes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own affiliate codes" ON public.affiliate_codes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Service role manages affiliate codes" ON public.affiliate_codes FOR ALL TO authenticated USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Public can read active affiliate codes" ON public.affiliate_codes FOR SELECT TO anon USING (status = 'active');

-- RLS: affiliate_referrals
CREATE POLICY "Affiliates can view own referrals" ON public.affiliate_referrals FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.affiliate_codes WHERE id = affiliate_code_id AND user_id = auth.uid())
);
CREATE POLICY "Service role manages referrals" ON public.affiliate_referrals FOR ALL TO authenticated USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- RLS: affiliate_payouts
CREATE POLICY "Users can view own payouts" ON public.affiliate_payouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can request payouts" ON public.affiliate_payouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role manages payouts" ON public.affiliate_payouts FOR ALL TO authenticated USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Index for fast code lookups
CREATE INDEX idx_affiliate_codes_code ON public.affiliate_codes(code);
CREATE INDEX idx_affiliate_referrals_code_id ON public.affiliate_referrals(affiliate_code_id);
CREATE INDEX idx_affiliate_payouts_user_id ON public.affiliate_payouts(user_id);
