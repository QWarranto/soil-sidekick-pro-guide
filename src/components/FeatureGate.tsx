import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Crown, AlertTriangle } from 'lucide-react';
import { OneTimePurchaseModal } from './OneTimePurchaseModal';
import { useOneTimePurchase } from '@/hooks/useOneTimePurchase';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredTier?: 'pro' | 'enterprise';
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  title,
  description,
  requiredTier = 'pro'
}) => {
  const { checkFeatureAccess, showUpgradePrompt, subscription, usage } = useSubscription();
  const { trialUser } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [accessReason, setAccessReason] = useState<string>('');
  const navigate = useNavigate();
  const { 
    isModalOpen, 
    currentFeature, 
    showOneTimePurchaseModal, 
    closeModal, 
    getFeatureConfig,
    shouldShowOneTimePurchase 
  } = useOneTimePurchase();

  useEffect(() => {
    const checkAccess = async () => {
      // Trial users have access to all features
      if (trialUser) {
        setCanAccess(true);
        return;
      }
      
      const result = await checkFeatureAccess(feature);
      setCanAccess(result.canUse);
      setAccessReason(result.reason || '');
    };

    checkAccess();
  }, [feature, checkFeatureAccess, trialUser]);

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
      case 'pro': return <Crown className="h-5 w-5 text-primary" />;
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
            {requiredTier === 'pro' && (
              <>
                <div>✓ Unlimited county lookups</div>
                <div>✓ AI-powered soil analysis</div>
                <div>✓ Satellite crop monitoring</div>
                <div>✓ Carbon credit calculations</div>
                <div>✓ Priority support</div>
              </>
            )}
            {requiredTier === 'enterprise' && (
              <>
                <div>✓ All Pro features</div>
                <div>✓ Unlimited API access</div>
                <div>✓ Custom integrations</div>
                <div>✓ Dedicated support</div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {shouldShowOneTimePurchase(feature) && (
            <Button 
              onClick={() => showOneTimePurchaseModal(feature)}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Access - 3 Days for ${getFeatureConfig(feature).price}
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/pricing')}
            variant={shouldShowOneTimePurchase(feature) ? "outline" : "default"}
            className="w-full"
          >
            Upgrade to {requiredTier === 'pro' ? 'Pro' : 'Enterprise'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => showUpgradePrompt(feature, accessReason)}
          >
            Learn More
          </Button>
        </div>

        {currentFeature && (
          <OneTimePurchaseModal
            isOpen={isModalOpen}
            onClose={closeModal}
            feature={currentFeature}
            featureTitle={getFeatureConfig(currentFeature).title}
            featureDescription={getFeatureConfig(currentFeature).description}
            price={getFeatureConfig(currentFeature).price}
            originalPrice={getFeatureConfig(currentFeature).originalPrice}
            benefits={getFeatureConfig(currentFeature).benefits}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureGate;