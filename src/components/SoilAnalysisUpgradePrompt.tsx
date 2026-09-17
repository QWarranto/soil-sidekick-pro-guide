import { useEffect } from 'react';
import { OneTimePurchaseModal } from './OneTimePurchaseModal';
import { useOneTimePurchase } from '@/hooks/useOneTimePurchase';
import { useSubscription } from '@/hooks/useSubscription';

interface SoilAnalysisUpgradePromptProps {
  onPurchaseSuccess?: () => void;
}

export function SoilAnalysisUpgradePrompt({ onPurchaseSuccess }: SoilAnalysisUpgradePromptProps) {
  const { 
    isModalOpen, 
    currentFeature, 
    showOneTimePurchaseModal, 
    closeModal, 
    getFeatureConfig 
  } = useOneTimePurchase();
  const { checkFeatureAccess } = useSubscription();

  const checkAndShowPrompt = async () => {
    const accessResult = await checkFeatureAccess('soil_analysis');
    if (!accessResult.canUse) {
      showOneTimePurchaseModal('soil_analysis');
    }
  };

  useEffect(() => {
    // Auto-show prompt when component mounts for soil analysis access
    checkAndShowPrompt();
  }, []);

  if (!currentFeature) return null;

  return (
    <OneTimePurchaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      feature={currentFeature}
      featureTitle={getFeatureConfig(currentFeature).title}
      featureDescription={getFeatureConfig(currentFeature).description}
      price={getFeatureConfig(currentFeature).price}
      originalPrice={getFeatureConfig(currentFeature).originalPrice}
      benefits={getFeatureConfig(currentFeature).benefits}
      onPurchaseSuccess={onPurchaseSuccess}
    />
  );
}