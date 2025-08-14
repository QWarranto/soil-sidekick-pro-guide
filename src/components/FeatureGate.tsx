import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Crown, AlertTriangle } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredTier?: 'starter' | 'pro' | 'enterprise';
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  title,
  description,
  requiredTier = 'starter'
}) => {
  const { checkFeatureAccess, showUpgradePrompt, subscription, usage } = useSubscription();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [accessReason, setAccessReason] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const result = await checkFeatureAccess(feature);
      setCanAccess(result.canUse);
      setAccessReason(result.reason || '');
    };

    checkAccess();
  }, [feature, checkFeatureAccess]);

  if (canAccess === null) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (canAccess) {
    return <>{children}</>;
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Zap className="h-5 w-5 text-blue-600" />;
      case 'pro': return <Crown className="h-5 w-5 text-green-600" />;
      case 'enterprise': return <Crown className="h-5 w-5 text-purple-600" />;
      default: return <Lock className="h-5 w-5" />;
    }
  };

  const getTierPrice = (tier: string) => {
    switch (tier) {
      case 'starter': return '$29';
      case 'pro': return '$79';
      case 'enterprise': return '$149';
      default: return '';
    }
  };

  const featureUsage = usage[feature];
  const isUsageLimitReached = featureUsage && featureUsage.current >= featureUsage.limit;

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            {getTierIcon(requiredTier)}
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-gray-500" />
          {title || 'Premium Feature'}
        </CardTitle>
        <CardDescription className="text-center">
          {description || accessReason}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {isUsageLimitReached && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              Monthly limit reached: {featureUsage.current}/{featureUsage.limit}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Upgrade to {requiredTier} plan to unlock this feature
          </div>
          
          <Badge variant="outline" className="text-lg font-bold">
            {getTierPrice(requiredTier)}/month
          </Badge>

          <div className="grid grid-cols-1 gap-2 text-sm text-left">
            {requiredTier === 'starter' && (
              <>
                <div>✓ 5 AI soil analyses</div>
                <div>✓ 3 carbon calculations</div>
                <div>✓ 200 county lookups</div>
                <div>✓ Email support</div>
              </>
            )}
            {requiredTier === 'pro' && (
              <>
                <div>✓ Unlimited AI soil analyses</div>
                <div>✓ Visual crop analysis</div>
                <div>✓ Advanced water quality testing</div>
                <div>✓ Priority support</div>
              </>
            )}
            {requiredTier === 'enterprise' && (
              <>
                <div>✓ All Pro features</div>
                <div>✓ ADAPT integration</div>
                <div>✓ Custom features</div>
                <div>✓ Dedicated support</div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => navigate('/pricing')}
            className="w-full"
          >
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => showUpgradePrompt(feature, accessReason)}
          >
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;