import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CostData {
  service_provider: string;
  service_type: string;
  cost_usd: number;
  usage_count: number;
  feature_name: string;
  created_at: string;
}

interface UsageEvent {
  feature_name: string;
  action_type: string;
  duration_seconds?: number;
  success_rate?: number;
  created_at: string;
}

interface CostAlert {
  alert_id: string;
  alert_name: string;
  current_amount: number;
  threshold_amount: number;
  percentage_used: number;
}

export const useCostMonitoring = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [costData, setCostData] = useState<CostData[]>([]);
  const [usageData, setUsageData] = useState<UsageEvent[]>([]);
  const [alerts, setAlerts] = useState<CostAlert[]>([]);

  // Track API cost usage
  const trackCost = async (
    serviceProvider: string,
    serviceType: string,
    usageAmount: number,
    featureName: string,
    requestDetails?: any
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('cost-monitoring', {
        body: {
          action: 'track_cost',
          service_provider: serviceProvider,
          service_type: serviceType,
          usage_amount: usageAmount,
          feature_name: featureName,
          request_details: requestDetails
        }
      });

      if (error) throw error;

      // Show alerts if any are triggered
      if (data.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts);
        data.alerts.forEach((alert: CostAlert) => {
          if (alert.percentage_used >= 80) {
            toast({
              title: `Cost Alert: ${alert.alert_name}`,
              description: `${alert.percentage_used.toFixed(1)}% of budget used ($${alert.current_amount}/$${alert.threshold_amount})`,
              variant: alert.percentage_used >= 100 ? "destructive" : "default",
            });
          }
        });
      }

      return data.cost_usd;
    } catch (error) {
      console.error('Cost tracking error:', error);
      return 0;
    }
  };

  // Track usage analytics
  const trackUsage = async (
    featureName: string,
    actionType: string,
    subscriptionTier: string,
    sessionId?: string,
    duration?: number,
    successRate?: number,
    errorDetails?: any,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('cost-monitoring', {
        body: {
          action: 'track_usage',
          session_id: sessionId || crypto.randomUUID(),
          feature_name: featureName,
          action_type: actionType,
          subscription_tier: subscriptionTier,
          duration_seconds: duration,
          success_rate: successRate,
          error_details: errorDetails,
          metadata: metadata
        }
      });

      if (error) throw error;
      return data.analytics_id;
    } catch (error) {
      console.error('Usage tracking error:', error);
    }
  };

  // Get user's cost data
  const fetchUserCosts = async (startDate?: string, endDate?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cost-monitoring', {
        body: {
          action: 'get_user_costs',
          start_date: startDate,
          end_date: endDate
        }
      });

      if (error) throw error;
      setCostData(data.data || []);
    } catch (error) {
      console.error('Error fetching user costs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cost data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user's usage analytics
  const fetchUserUsage = async (startDate?: string, endDate?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('usage_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date_bucket', startDate || '2024-01-01')
        .lte('date_bucket', endDate || new Date().toISOString().slice(0, 10))
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsageData(data || []);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  // Calculate cost summaries
  const getCostSummary = () => {
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    const todayCosts = costData.filter(c => c.created_at.startsWith(today));
    const monthCosts = costData.filter(c => c.created_at.startsWith(thisMonth));
    
    const dailyTotal = todayCosts.reduce((sum, c) => sum + Number(c.cost_usd), 0);
    const monthlyTotal = monthCosts.reduce((sum, c) => sum + Number(c.cost_usd), 0);
    
    const serviceBreakdown = costData.reduce((acc, c) => {
      if (!acc[c.service_provider]) acc[c.service_provider] = 0;
      acc[c.service_provider] += Number(c.cost_usd);
      return acc;
    }, {} as Record<string, number>);

    return {
      dailyTotal,
      monthlyTotal,
      serviceBreakdown,
      totalRequests: costData.length
    };
  };

  // Get usage patterns
  const getUsagePatterns = () => {
    const featureUsage = usageData.reduce((acc, u) => {
      if (!acc[u.feature_name]) {
        acc[u.feature_name] = { total: 0, successful: 0, avgDuration: 0 };
      }
      acc[u.feature_name].total++;
      if (u.success_rate && u.success_rate > 80) {
        acc[u.feature_name].successful++;
      }
      if (u.duration_seconds) {
        acc[u.feature_name].avgDuration += u.duration_seconds;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number; avgDuration: number }>);

    // Calculate averages
    Object.keys(featureUsage).forEach(feature => {
      if (featureUsage[feature].total > 0) {
        featureUsage[feature].avgDuration /= featureUsage[feature].total;
      }
    });

    return featureUsage;
  };

  useEffect(() => {
    if (user) {
      fetchUserCosts();
      fetchUserUsage();
    }
  }, [user]);

  return {
    loading,
    costData,
    usageData,
    alerts,
    trackCost,
    trackUsage,
    fetchUserCosts,
    fetchUserUsage,
    getCostSummary,
    getUsagePatterns,
  };
};