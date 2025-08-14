import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Shield, Zap, Crown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsageDashboard: React.FC = () => {
  const { subscription, usage, loading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading subscription data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free': return <Shield className="h-5 w-5" />;
      case 'starter': return <Zap className="h-5 w-5" />;
      case 'pro': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Crown className="h-5 w-5 text-purple-600" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFeatureName = (feature: string) => {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isTrialExpiring = subscription?.isTrialActive && subscription?.trialEndsAt && 
    new Date(subscription.trialEndsAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierIcon(subscription?.tier || 'free')}
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Plan: 
                  <Badge className={getTierColor(subscription?.tier || 'free')}>
                    {subscription?.tier?.toUpperCase() || 'FREE'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {subscription?.isTrialActive 
                    ? `Trial expires ${new Date(subscription.trialEndsAt!).toLocaleDateString()}`
                    : subscription?.isSubscriptionActive 
                      ? 'Active subscription'
                      : 'No active subscription'
                  }
                </CardDescription>
              </div>
            </div>
            {(subscription?.tier === 'free' || isTrialExpiring) && (
              <Button onClick={() => navigate('/pricing')}>
                Upgrade Plan
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Trial Warning */}
        {isTrialExpiring && (
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Trial ending soon!</p>
                <p className="text-yellow-700">
                  Your trial expires on {new Date(subscription.trialEndsAt!).toLocaleDateString()}. 
                  Upgrade now to continue using premium features.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Usage
          </CardTitle>
          <CardDescription>
            Your feature usage for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(usage).map(([feature, data]) => (
              <div key={feature} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatFeatureName(feature)}</span>
                  <span className="text-sm text-muted-foreground">
                    {data.current} / {data.limit === 9999 ? '∞' : data.limit}
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(data.percentage, 100)} 
                    className="h-2"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded ${getProgressColor(data.percentage)}`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                  />
                </div>
                {data.percentage >= 80 && data.limit !== 9999 && (
                  <p className="text-xs text-yellow-600">
                    You're approaching your limit for this feature
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Suggestions */}
      {subscription?.tier === 'free' && (
        <Card>
          <CardHeader>
            <CardTitle>Unlock More Features</CardTitle>
            <CardDescription>
              Upgrade to access AI-powered analysis and advanced tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-700">Starter Plan - $29/month</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• 5 AI soil analyses</li>
                  <li>• 3 carbon calculations</li>
                  <li>• 200 county lookups</li>
                  <li>• 10 PDF reports</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-700">Pro Plan - $79/month</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Unlimited AI features</li>
                  <li>• Visual crop analysis</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => navigate('/pricing')}>
              View All Plans
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsageDashboard;