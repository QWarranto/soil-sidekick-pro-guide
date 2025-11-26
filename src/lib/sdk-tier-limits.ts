/**
 * SDK Tier Limit Configurations
 * Defines rate limits and feature access for each subscription tier
 */

export type SDKTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface TierLimits {
  tier: SDKTier;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  maxConcurrentRequests: number;
  features: string[];
  displayName: string;
  price: string;
}

export const SDK_TIER_LIMITS: Record<SDKTier, TierLimits> = {
  free: {
    tier: 'free',
    displayName: 'Free',
    price: '$0/month',
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 1000,
    maxConcurrentRequests: 2,
    features: ['soil_analysis', 'county_lookup'],
  },
  starter: {
    tier: 'starter',
    displayName: 'Starter',
    price: '$29/month',
    requestsPerMinute: 30,
    requestsPerHour: 500,
    requestsPerDay: 5000,
    maxConcurrentRequests: 5,
    features: ['soil_analysis', 'county_lookup', 'water_quality', 'planting_calendar'],
  },
  pro: {
    tier: 'pro',
    displayName: 'Pro',
    price: '$99/month',
    requestsPerMinute: 100,
    requestsPerHour: 2000,
    requestsPerDay: 25000,
    maxConcurrentRequests: 15,
    features: [
      'soil_analysis',
      'county_lookup',
      'water_quality',
      'planting_calendar',
      'satellite_data',
      'ai_recommendations',
      'vrt_maps',
    ],
  },
  enterprise: {
    tier: 'enterprise',
    displayName: 'Enterprise',
    price: 'Custom pricing',
    requestsPerMinute: 500,
    requestsPerHour: 10000,
    requestsPerDay: 100000,
    maxConcurrentRequests: 50,
    features: ['all'],
  },
};

export function getTierLimits(tier: SDKTier): TierLimits {
  return SDK_TIER_LIMITS[tier];
}

export function canAccessFeature(tier: SDKTier, feature: string): boolean {
  const limits = SDK_TIER_LIMITS[tier];
  return limits.features.includes('all') || limits.features.includes(feature);
}

export function getTierByFeatureRequirement(requiredFeatures: string[]): SDKTier {
  // Find the minimum tier that supports all required features
  const tiers: SDKTier[] = ['free', 'starter', 'pro', 'enterprise'];
  
  for (const tier of tiers) {
    const limits = SDK_TIER_LIMITS[tier];
    const hasAllFeatures = requiredFeatures.every(
      feature => limits.features.includes('all') || limits.features.includes(feature)
    );
    
    if (hasAllFeatures) {
      return tier;
    }
  }
  
  return 'enterprise';
}