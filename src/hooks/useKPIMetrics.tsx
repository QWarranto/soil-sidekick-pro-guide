import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCostMonitoring } from './useCostMonitoring';
import { useSubscription } from './useSubscription';

export interface KPITarget {
  id: string;
  kpi_name: string;
  target_value: number;
  target_period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface KPIHistory {
  id: string;
  kpi_name: string;
  value: number;
  recorded_at: string;
  metadata?: any;
}

export const useKPIMetrics = () => {
  const { user } = useAuth();
  const { getCostSummary, getUsagePatterns } = useCostMonitoring();
  const { subscription, usage } = useSubscription();
  
  const [loading, setLoading] = useState(false);
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([]);
  const [kpiHistory, setKpiHistory] = useState<KPIHistory[]>([]);

  // Calculate real-time KPIs from existing data
  const calculateRealTimeKPIs = async () => {
    if (!user) return {};

    const costSummary = getCostSummary();
    const usagePatterns = getUsagePatterns();
    
    // Business KPIs
    const businessKPIs = {
      // Revenue metrics (would come from Stripe in real implementation)
      monthly_revenue: costSummary.monthlyTotal * 10, // Estimated based on costs
      cost_efficiency: costSummary.dailyTotal > 0 ? (costSummary.monthlyTotal / costSummary.dailyTotal) : 0,
      
      // Usage-based business metrics
      feature_utilization: Object.keys(usage).length > 0 ? 
        Object.values(usage).reduce((acc, u) => acc + u.percentage, 0) / Object.keys(usage).length : 0,
      
      // Customer metrics
      subscription_tier_value: getSubscriptionTierValue(subscription?.tier || 'free'),
    };

    // Product KPIs
    const productKPIs = {
      // Feature adoption
      ai_feature_usage: usagePatterns['ai_soil_analysis']?.total || 0,
      water_quality_usage: usagePatterns['water_quality_analysis']?.total || 0,
      carbon_credit_usage: usagePatterns['carbon_credit_calculation']?.total || 0,
      
      // Success rates
      avg_success_rate: Object.values(usagePatterns).length > 0 ?
        Object.values(usagePatterns).reduce((acc, p) => 
          acc + (p.successful / p.total), 0) / Object.values(usagePatterns).length * 100 : 0,
    };

    // Technical KPIs
    const technicalKPIs = {
      // Performance metrics
      avg_response_time: Object.values(usagePatterns).length > 0 ?
        Object.values(usagePatterns).reduce((acc, p) => acc + p.avgDuration, 0) / Object.values(usagePatterns).length : 0,
      
      // Cost efficiency
      cost_per_request: costSummary.totalRequests > 0 ? 
        costSummary.monthlyTotal / costSummary.totalRequests : 0,
      
      // Service reliability
      error_rate: 100 - (productKPIs.avg_success_rate || 95), // Inverse of success rate
    };

    return {
      business: businessKPIs,
      product: productKPIs,
      technical: technicalKPIs,
    };
  };

  const getSubscriptionTierValue = (tier: string): number => {
    const tierValues = {
      'free': 0,
      'starter': 29,
      'pro': 79,
      'enterprise': 199
    };
    return tierValues[tier as keyof typeof tierValues] || 0;
  };

  // Fetch KPI targets from database
  const fetchKPITargets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kpi_targets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKpiTargets(data || []);
    } catch (error) {
      console.error('Error fetching KPI targets:', error);
    }
  };

  // Save KPI target
  const saveKPITarget = async (
    kpiName: string,
    targetValue: number,
    targetPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kpi_targets')
        .upsert({
          user_id: user.id,
          kpi_name: kpiName,
          target_value: targetValue,
          target_period: targetPeriod,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,kpi_name,target_period'
        });

      if (error) throw error;
      await fetchKPITargets(); // Refresh targets
      return data;
    } catch (error) {
      console.error('Error saving KPI target:', error);
      throw error;
    }
  };

  // Record KPI history
  const recordKPIValue = async (kpiName: string, value: number, metadata?: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kpi_history')
        .insert({
          user_id: user.id,
          kpi_name: kpiName,
          value: value,
          metadata: metadata,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording KPI value:', error);
      throw error;
    }
  };

  // Fetch KPI history
  const fetchKPIHistory = async (
    kpiName?: string,
    startDate?: string,
    endDate?: string
  ) => {
    if (!user) return;

    try {
      let query = supabase
        .from('kpi_history')
        .select('*')
        .eq('user_id', user.id);

      if (kpiName) {
        query = query.eq('kpi_name', kpiName);
      }

      if (startDate) {
        query = query.gte('recorded_at', startDate);
      }

      if (endDate) {
        query = query.lte('recorded_at', endDate);
      }

      query = query.order('recorded_at', { ascending: false }).limit(100);

      const { data, error } = await query;
      if (error) throw error;
      
      setKpiHistory(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching KPI history:', error);
    }
  };

  // Calculate KPI trends
  const calculateKPITrend = (kpiName: string, days: number = 30) => {
    const kpiData = kpiHistory
      .filter(h => h.kpi_name === kpiName)
      .slice(0, days)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

    if (kpiData.length < 2) {
      return { trend: 'stable', change: 0, confidence: 'low' };
    }

    const firstValue = kpiData[0].value;
    const lastValue = kpiData[kpiData.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;

    const trend = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
    const confidence = kpiData.length > 10 ? 'high' : kpiData.length > 5 ? 'medium' : 'low';

    return { trend, change, confidence };
  };

  // Get KPI recommendations
  const getKPIRecommendations = async () => {
    const realTimeKPIs = await calculateRealTimeKPIs();
    const recommendations = [];

    // Business recommendations
    if (realTimeKPIs.business?.cost_efficiency < 5) {
      recommendations.push({
        category: 'business',
        priority: 'high',
        title: 'Optimize Cost Efficiency',
        description: 'Daily costs are too high relative to monthly costs. Consider implementing cost controls.',
        action: 'Review API usage patterns and implement rate limiting'
      });
    }

    // Product recommendations
    if (realTimeKPIs.product?.avg_success_rate < 90) {
      recommendations.push({
        category: 'product',
        priority: 'high',
        title: 'Improve Success Rates',
        description: 'Feature success rates are below 90%. Investigate common failure points.',
        action: 'Analyze error logs and improve API reliability'
      });
    }

    // Technical recommendations
    if (realTimeKPIs.technical?.avg_response_time > 2000) {
      recommendations.push({
        category: 'technical',
        priority: 'medium',
        title: 'Optimize Response Times',
        description: 'Average response time exceeds 2 seconds. Users may experience delays.',
        action: 'Implement caching and optimize database queries'
      });
    }

    return recommendations;
  };

  useEffect(() => {
    if (user) {
      fetchKPITargets();
      fetchKPIHistory();
    }
  }, [user]);

  return {
    loading,
    kpiTargets,
    kpiHistory,
    calculateRealTimeKPIs,
    saveKPITarget,
    recordKPIValue,
    fetchKPIHistory,
    calculateKPITrend,
    getKPIRecommendations,
  };
};