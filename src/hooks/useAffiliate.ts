import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface AffiliateCode {
  id: string;
  code: string;
  commission_rate: number;
  status: string;
  total_referrals: number;
  total_earnings: number;
  created_at: string;
}

interface AffiliateReferral {
  id: string;
  affiliate_code_id: string;
  referred_user_id: string;
  subscription_tier: string;
  subscription_amount: number;
  commission_amount: number;
  commission_rate: number;
  status: string;
  attribution_date: string;
  created_at: string;
}

interface AffiliatePayout {
  id: string;
  amount: number;
  status: string;
  period_start: string;
  period_end: string;
  referral_count: number;
  created_at: string;
  processed_at: string | null;
}

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidOut: number;
  availableForPayout: number;
  canRequestPayout: boolean;
}

interface AffiliateDashboardData {
  registered: boolean;
  codes: AffiliateCode[];
  referrals: AffiliateReferral[];
  payouts: AffiliatePayout[];
  stats: AffiliateStats;
}

export const useAffiliate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AffiliateDashboardData | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/affiliate-management?action=dashboard`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      setData(json);
    } catch (err) {
      console.error('Failed to fetch affiliate dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const register = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/affiliate-management?action=register`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      toast({ title: 'Affiliate account created!', description: `Your code: ${json.affiliate.code}` });
      await fetchDashboard();
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    }
  };

  const requestPayout = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/affiliate-management?action=request-payout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      toast({ title: 'Payout requested!', description: `$${json.payout.amount} payout is being processed.` });
      await fetchDashboard();
    } catch (err: any) {
      toast({ title: 'Payout failed', description: err.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    loading,
    data,
    register,
    requestPayout,
    refresh: fetchDashboard,
  };
};

// Utility: Store referral code from URL params
export const captureReferralCode = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    localStorage.setItem('affiliate_ref_code', ref.toUpperCase());
  }
};

export const getStoredReferralCode = (): string | null => {
  return localStorage.getItem('affiliate_ref_code');
};

export const clearStoredReferralCode = () => {
  localStorage.removeItem('affiliate_ref_code');
};
