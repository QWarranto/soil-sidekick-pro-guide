import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useSubscription } from '@/hooks/useSubscription';

interface KPIMetric {
  id: string;
  name: string;
  value: number | string;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  type: 'leading' | 'lagging';
  category: 'business' | 'product' | 'technical' | 'customer';
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

const KPIDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCostSummary, getUsagePatterns } = useCostMonitoring();
  const { subscription, usage } = useSubscription();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Current KPIs - these would be calculated from real data
  const [kpis, setKpis] = useState<KPIMetric[]>([
    // Business KPIs (Lagging)
    {
      id: 'mrr',
      name: 'Monthly Recurring Revenue',
      value: '$12,450',
      target: 15000,
      trend: 'up',
      trendValue: 23.5,
      type: 'lagging',
      category: 'business',
      status: 'healthy',
      description: 'Total monthly subscription revenue'
    },
    {
      id: 'customer_ltv',
      name: 'Customer LTV',
      value: '$1,250',
      target: 1500,
      trend: 'up',
      trendValue: 12.3,
      type: 'lagging',
      category: 'business',
      status: 'warning',
      description: 'Average customer lifetime value'
    },
    {
      id: 'cac',
      name: 'Customer Acquisition Cost',
      value: '$85',
      target: 75,
      trend: 'down',
      trendValue: -8.2,
      type: 'lagging',
      category: 'business',
      status: 'warning',
      description: 'Cost to acquire new customers'
    },
    
    // Product KPIs (Leading)
    {
      id: 'dau',
      name: 'Daily Active Users',
      value: 342,
      target: 400,
      trend: 'up',
      trendValue: 15.7,
      type: 'leading',
      category: 'product',
      status: 'healthy',
      description: 'Users active in the last 24 hours'
    },
    {
      id: 'feature_adoption',
      name: 'AI Feature Adoption Rate',
      value: '68%',
      target: 75,
      trend: 'up',
      trendValue: 5.2,
      type: 'leading',
      category: 'product',
      status: 'healthy',
      description: 'Percentage of users using AI features'
    },
    {
      id: 'trial_conversion',
      name: 'Trial to Paid Conversion',
      value: '24%',
      target: 30,
      trend: 'up',
      trendValue: 3.1,
      type: 'leading',
      category: 'customer',
      status: 'warning',
      description: 'Trial users converting to paid plans'
    },
    
    // Technical KPIs (Leading)
    {
      id: 'api_uptime',
      name: 'API Uptime',
      value: '99.8%',
      target: 99.9,
      trend: 'stable',
      trendValue: 0.1,
      type: 'leading',
      category: 'technical',
      status: 'healthy',
      description: 'API availability percentage'
    },
    {
      id: 'response_time',
      name: 'Avg Response Time',
      value: '245ms',
      target: 200,
      trend: 'down',
      trendValue: -12.5,
      type: 'leading',
      category: 'technical',
      status: 'warning',
      description: 'Average API response time'
    },
    {
      id: 'error_rate',
      name: 'Error Rate',
      value: '0.3%',
      target: 0.5,
      trend: 'down',
      trendValue: -40.2,
      type: 'leading',
      category: 'technical',
      status: 'healthy',
      description: 'Percentage of failed requests'
    },
    
    // Customer KPIs (Leading & Lagging)
    {
      id: 'nps',
      name: 'Net Promoter Score',
      value: 67,
      target: 70,
      trend: 'up',
      trendValue: 8.5,
      type: 'lagging',
      category: 'customer',
      status: 'healthy',
      description: 'Customer satisfaction metric'
    },
    {
      id: 'engagement_score',
      name: 'Engagement Score',
      value: 78,
      target: 80,
      trend: 'up',
      trendValue: 4.2,
      type: 'leading',
      category: 'customer',
      status: 'healthy',
      description: 'User engagement with platform features'
    },
    {
      id: 'support_tickets',
      name: 'Avg Support Resolution',
      value: '4.2h',
      target: 4,
      trend: 'down',
      trendValue: -15.3,
      type: 'leading',
      category: 'customer',
      status: 'warning',
      description: 'Average time to resolve support tickets'
    }
  ]);

  const filteredKPIs = selectedCategory === 'all' 
    ? kpis 
    : kpis.filter(kpi => kpi.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'leading' 
      ? <Zap className="h-4 w-4 text-blue-500" />
      : <Target className="h-4 w-4 text-purple-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return 'bg-green-100 text-green-800';
      case 'product': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (value: any, target?: number) => {
    if (!target) return 0;
    const numValue = typeof value === 'string' ? 
      parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    return Math.min((numValue / target) * 100, 100);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Required</CardTitle>
          <CardDescription>Please sign in to view KPI dashboard</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">KPI Dashboard</h2>
          <p className="text-muted-foreground">
            Track key performance indicators across business, product, and technical metrics
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.map((kpi) => (
          <Card key={kpi.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(kpi.status)}
                    <Badge className={getCategoryColor(kpi.category)} variant="outline">
                      {kpi.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getTypeIcon(kpi.type)}
                      <span className="ml-1">{kpi.type}</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getTrendIcon(kpi.trend)}
                  <span>{kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: {kpi.target}</span>
                      <span>{calculateProgress(kpi.value, kpi.target).toFixed(1)}%</span>
                    </div>
                    <Progress value={calculateProgress(kpi.value, kpi.target)} />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Summary by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['business', 'product', 'technical', 'customer'].map(category => {
                    const categoryKPIs = kpis.filter(k => k.category === category);
                    const healthyCount = categoryKPIs.filter(k => k.status === 'healthy').length;
                    const totalCount = categoryKPIs.length;
                    const healthPercentage = (healthyCount / totalCount) * 100;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getCategoryColor(category)}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {healthyCount}/{totalCount} healthy
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={healthPercentage} className="w-20" />
                          <span className="text-sm font-medium">{healthPercentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leading vs Lagging Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['leading', 'lagging'].map(type => {
                    const typeKPIs = kpis.filter(k => k.type === type);
                    const improvingCount = typeKPIs.filter(k => k.trendValue > 0).length;
                    const totalCount = typeKPIs.length;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(type)}
                            <span className="font-medium capitalize">{type} Indicators</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {improvingCount}/{totalCount} improving
                          </span>
                        </div>
                        <Progress value={(improvingCount / totalCount) * 100} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>KPI Alerts & Recommendations</CardTitle>
              <CardDescription>
                Automated alerts and suggested actions for KPIs requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.filter(k => k.status !== 'healthy').map(kpi => (
                  <div key={kpi.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(kpi.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{kpi.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{kpi.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Current: {kpi.value}</span>
                        {kpi.target && (
                          <span className="text-muted-foreground"> | Target: {kpi.target}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts">
          <Card>
            <CardHeader>
              <CardTitle>KPI Forecasts & Future Targets</CardTitle>
              <CardDescription>
                Projected values and recommended targets for upcoming periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced forecasting features coming soon</p>
                <p className="text-sm">ML-powered predictions and target recommendations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KPIDashboard;