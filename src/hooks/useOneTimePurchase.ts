import { useState } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';

interface FeatureConfig {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  benefits: string[];
}

const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  'soil_analysis': {
    title: 'AI Soil Analysis',
    description: 'Get detailed AI-powered soil recommendations and insights',
    price: 14.50,
    originalPrice: 29,
    benefits: [
      'Unlimited soil analysis reports',
      'AI-powered fertilizer recommendations',
      'Soil health scoring and trends',
      'Custom improvement suggestions'
    ]
  },
  'carbon_credits': {
    title: 'Carbon Credit Calculator',
    description: 'Calculate and track your farm\'s carbon sequestration potential',
    price: 14.50,
    originalPrice: 29,
    benefits: [
      'Unlimited carbon credit calculations',
      'Soil organic matter tracking',
      'Environmental impact scoring',
      'Verification support guidance'
    ]
  },
  'satellite_monitoring': {
    title: 'Satellite Crop Monitoring',
    description: 'Monitor your crops with satellite imagery and AI analysis',
    price: 39.50,
    originalPrice: 79,
    benefits: [
      'Real-time satellite imagery',
      'Crop health analysis',
      'Growth pattern tracking',
      'Yield prediction models'
    ]
  },
  'environmental_impact': {
    title: 'Environmental Impact Assessment',
    description: 'Comprehensive environmental impact analysis for your operations',
    price: 14.50,
    originalPrice: 29,
    benefits: [
      'Water quality impact analysis',
      'Biodiversity impact scoring',
      'Eco-friendly alternatives',
      'Sustainability recommendations'
    ]
  },
  'county_lookup': {
    title: 'Advanced County Data',
    description: 'Access detailed county-specific agricultural data and insights',
    price: 14.50,
    originalPrice: 29,
    benefits: [
      'Unlimited county lookups',
      'Historical weather data',
      'Soil type distributions',
      'Regional best practices'
    ]
  }
};

export const useOneTimePurchase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const shouldShowOneTimePurchase = (feature: string): boolean => {
    // Don't show if user is already subscribed to a paid plan
    if (subscription?.tier !== 'free') return false;
    
    // Don't show if user is in trial
    if (subscription?.isTrialActive) return false;
    
    // Only show for free users who hit limits
    return subscription?.tier === 'free' && !!user;
  };

  const showOneTimePurchaseModal = (feature: string) => {
    if (!shouldShowOneTimePurchase(feature)) return false;
    
    setCurrentFeature(feature);
    setIsModalOpen(true);
    return true;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFeature(null);
  };

  const getFeatureConfig = (feature: string): FeatureConfig => {
    return FEATURE_CONFIGS[feature] || {
      title: 'Premium Feature',
      description: 'Access premium features with temporary access',
      price: 14.50,
      originalPrice: 29,
      benefits: ['Full feature access', 'No usage limits', '10-day duration']
    };
  };

  return {
    isModalOpen,
    currentFeature,
    shouldShowOneTimePurchase,
    showOneTimePurchaseModal,
    closeModal,
    getFeatureConfig: (feature: string) => currentFeature ? getFeatureConfig(currentFeature) : getFeatureConfig(feature)
  };
};