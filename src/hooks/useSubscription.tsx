import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface UsageData {
  [feature: string]: {
    current: number;
    limit: number;
    percentage: number;
  };
}

interface SubscriptionData {
  tier: SubscriptionTier;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData>({});

  const fetchSubscriptionData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get user's subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, trial_ends_at, subscription_ends_at')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const now = new Date();
      const trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      const subscriptionEnds = profile.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;

      setSubscription({
        tier: (profile.subscription_tier as SubscriptionTier) || 'free',
        trialEndsAt: profile.trial_ends_at,
        subscriptionEndsAt: profile.subscription_ends_at,
        isTrialActive: trialEnds ? trialEnds > now : false,
        isSubscriptionActive: subscriptionEnds ? subscriptionEnds > now : true,
      });

      // Fetch usage data
      await fetchUsageData((profile.subscription_tier as SubscriptionTier) || 'free');
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async (tier: SubscriptionTier) => {
    if (!user) return;

    try {
      // Get quotas for current tier
      const { data: quotas, error: quotasError } = await supabase
        .from('usage_quotas')
        .select('feature_name, monthly_limit')
        .eq('tier', tier);

      if (quotasError) {
        console.error('Error fetching quotas:', quotasError);
        return;
      }

      // Get current usage
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data: userUsage, error: usageError } = await supabase
        .from('user_usage')
        .select('feature_name, usage_count')
        .eq('user_id', user.id)
        .eq('month_year', currentMonth);

      if (usageError) {
        console.error('Error fetching usage:', usageError);
        return;
      }

      // Combine quota and usage data
      const usageData: UsageData = {};
      quotas?.forEach((quota) => {
        const currentUsage = userUsage?.find(u => u.feature_name === quota.feature_name)?.usage_count || 0;
        usageData[quota.feature_name] = {
          current: currentUsage,
          limit: quota.monthly_limit,
          percentage: quota.monthly_limit > 0 ? (currentUsage / quota.monthly_limit) * 100 : 0,
        };
      });

      setUsage(usageData);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  const canUseFeature = async (featureName: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('can_use_feature', {
        p_user_id: user.id,
        p_feature_name: featureName,
      });

      if (error) {
        console.error('Error checking feature access:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const incrementUsage = async (featureName: string, increment: number = 1): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature_name: featureName,
        p_increment: increment,
      });

      if (error) {
        console.error('Error incrementing usage:', error);
        return false;
      }

      // Refresh usage data
      if (subscription) {
        await fetchUsageData(subscription.tier);
      }

      return data || false;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const checkFeatureAccess = async (featureName: string): Promise<{ canUse: boolean; reason?: string }> => {
    const canUse = await canUseFeature(featureName);
    
    if (!canUse) {
      const featureUsage = usage[featureName];
      if (featureUsage && featureUsage.current >= featureUsage.limit) {
        return {
          canUse: false,
          reason: `You've reached your monthly limit for ${featureName}. Upgrade to continue.`,
        };
      }
      
      if (!subscription?.isSubscriptionActive && !subscription?.isTrialActive) {
        return {
          canUse: false,
          reason: 'Your trial has expired. Please upgrade to continue using this feature.',
        };
      }

      return {
        canUse: false,
        reason: 'This feature is not available in your current plan. Please upgrade.',
      };
    }

    return { canUse: true };
  };

  const showUpgradePrompt = (featureName: string, reason?: string) => {
    toast({
      title: "Upgrade Required",
      description: reason || `This feature requires a paid subscription.`,
      variant: "destructive",
      action: (
        <button
          onClick={() => window.open('/pricing', '_blank')}
          className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
        >
          Upgrade
        </button>
      ),
    });
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  return {
    subscription,
    usage,
    loading,
    canUseFeature,
    incrementUsage,
    checkFeatureAccess,
    showUpgradePrompt,
    refreshSubscription: fetchSubscriptionData,
  };
};