import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useAuth } from '@/hooks/useAuth';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  RefreshCw,
  BarChart3,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const CostMonitoringDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    loading, 
    costData, 
    usageData, 
    alerts, 
    fetchUserCosts, 
    fetchUserUsage,
    getCostSummary,
    getUsagePatterns 
  } = useCostMonitoring();
  
  const [timeRange, setTimeRange] = useState('7d');

  const costSummary = getCostSummary();
  const usagePatterns = getUsagePatterns();

  const handleRefresh = () => {
    const days = parseInt(timeRange.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    fetchUserCosts(startDate.toISOString().slice(0, 10));
    fetchUserUsage(startDate.toISOString().slice(0, 10));
  };

  useEffect(() => {
    handleRefresh();
  }, [timeRange]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Monitoring</CardTitle>
          <CardDescription>Please sign in to view your cost data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(4)}`;
  
  const getAlertColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600 bg-red-50';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cost Monitoring Dashboard</h2>
          <p className="text-muted-foreground">
            Track your API usage costs and optimize spending
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Active Cost Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-medium">{alert.alert_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(alert.current_amount)} / {formatCurrency(alert.threshold_amount)}
                    </p>
                  </div>
                  <Badge className={getAlertColor(alert.percentage_used)}>
                    {alert.percentage_used.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(costSummary.dailyTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Today's API costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Costs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(costSummary.monthlyTotal)}</div>
            <p className="text-xs text-muted-foreground">
              This month's total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{costSummary.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              API requests made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Request</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {costSummary.totalRequests > 0 
                ? formatCurrency(costSummary.monthlyTotal / costSummary.totalRequests)
                : formatCurrency(0)
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Per API call
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Costs by Service
            </CardTitle>
            <CardDescription>
              API costs breakdown by service provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(costSummary.serviceBreakdown).map(([service, cost]) => {
                const percentage = costSummary.monthlyTotal > 0 
                  ? (cost / costSummary.monthlyTotal) * 100 
                  : 0;
                
                return (
                  <div key={service} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {service.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(cost)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {Object.keys(costSummary.serviceBreakdown).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No cost data available for the selected period
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Feature Usage
            </CardTitle>
            <CardDescription>
              Usage patterns by feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(usagePatterns).map(([feature, stats]) => {
                const successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;
                
                return (
                  <div key={feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {feature.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {stats.total} uses
                        </span>
                        <Badge variant={successRate >= 80 ? "default" : "destructive"} className="text-xs">
                          {successRate.toFixed(0)}% success
                        </Badge>
                      </div>
                    </div>
                    <Progress value={successRate} className="h-2" />
                    {stats.avgDuration > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Avg duration: {stats.avgDuration.toFixed(1)}s
                      </p>
                    )}
                  </div>
                );
              })}
              {Object.keys(usagePatterns).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No usage data available for the selected period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent API Costs
          </CardTitle>
          <CardDescription>
            Latest API usage and associated costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costData.slice(0, 10).map((cost, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {cost.service_provider}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{cost.feature_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cost.service_type} • {new Date(cost.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(Number(cost.cost_usd))}</p>
                  <p className="text-xs text-muted-foreground">{cost.usage_count} units</p>
                </div>
              </div>
            ))}
            {costData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No cost data available. Start using features to see cost tracking.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostMonitoringDashboard;