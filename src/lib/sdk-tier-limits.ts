/**
 * SDK Tier Limit Configurations
 * Defines rate limits, pricing, and feature access for each subscription tier.
 *
 * Endpoint categories:
 *   Commoditized – publicly available data (soil, county lookup)
 *   Enhanced     – value-added integrations (water quality, planting calendar, consumer plant care)
 *   Proprietary  – AI-powered intelligence (ag-intelligence, carbon, VRT, LeafEngines)
 *   Exclusive    – premium AI services (GPT-5 chat, visual crop analysis, geo-analytics)
 */

export type SDKTier = 'free' | 'starter' | 'pro' | 'enterprise';

export type EndpointCategory = 'commoditized' | 'enhanced' | 'proprietary' | 'exclusive';

export interface CategoryQuota {
  commoditized: number;
  enhanced: number;
  proprietary: number;
  exclusive: number;
}

export interface TierLimits {
  tier: SDKTier;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  maxConcurrentRequests: number;
  monthlyQuotas: CategoryQuota;
  features: string[];
  displayName: string;
  price: string;
  monthlyPrice: number;
}

/**
 * Maps each API endpoint to its category for quota enforcement.
 */
export const ENDPOINT_CATEGORIES: Record<string, EndpointCategory> = {
  // Commoditized – publicly available data
  'get-soil-data': 'commoditized',
  'county-lookup': 'commoditized',

  // Enhanced – value-added integrations
  'territorial-water-quality': 'enhanced',
  'territorial-water-analytics': 'enhanced',
  'multi-parameter-planting-calendar': 'enhanced',
  'live-agricultural-data': 'enhanced',
  'environmental-impact-engine': 'enhanced',
  'safe-identification': 'enhanced',
  'dynamic-care': 'enhanced',
  'beginner-guidance': 'enhanced',

  // Proprietary – AI-powered intelligence
  'agricultural-intelligence': 'proprietary',
  'seasonal-planning-assistant': 'proprietary',
  'smart-report-summary': 'proprietary',
  'carbon-credit-calculator': 'proprietary',
  'generate-vrt-prescription': 'proprietary',
  'leafengines-query': 'proprietary',
  'alpha-earth-environmental-enhancement': 'proprietary',

  // Exclusive – premium AI services
  'gpt5-chat': 'exclusive',
  'visual-crop-analysis': 'exclusive',
  'geo-consumption-analytics': 'exclusive',
};

export const SDK_TIER_LIMITS: Record<SDKTier, TierLimits> = {
  free: {
    tier: 'free',
    displayName: 'Free',
    price: '$0/month',
    monthlyPrice: 0,
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 1000,
    maxConcurrentRequests: 2,
    monthlyQuotas: {
      commoditized: 1000,
      enhanced: 0,
      proprietary: 0,
      exclusive: 0,
    },
    features: ['soil_analysis', 'county_lookup'],
  },
  starter: {
    tier: 'starter',
    displayName: 'Starter',
    price: '$149/month',
    monthlyPrice: 149,
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    maxConcurrentRequests: 5,
    monthlyQuotas: {
      commoditized: 5000,
      enhanced: 3000,
      proprietary: 1500,
      exclusive: 500,
    },
    features: [
      'soil_analysis', 'county_lookup',
      'water_quality', 'planting_calendar',
      'safe_identification', 'dynamic_care', 'beginner_guidance',
    ],
  },
  pro: {
    tier: 'pro',
    displayName: 'Pro',
    price: '$499/month',
    monthlyPrice: 499,
    requestsPerMinute: 200,
    requestsPerHour: 3000,
    requestsPerDay: 37000,
    maxConcurrentRequests: 15,
    monthlyQuotas: {
      commoditized: 20000,
      enhanced: 10000,
      proprietary: 5000,
      exclusive: 2000,
    },
    features: [
      'soil_analysis', 'county_lookup',
      'water_quality', 'planting_calendar',
      'safe_identification', 'dynamic_care', 'beginner_guidance',
      'satellite_data', 'ai_recommendations', 'vrt_maps', 'turbo_quant',
    ],
  },
  enterprise: {
    tier: 'enterprise',
    displayName: 'Enterprise',
    price: '$1,999/month',
    monthlyPrice: 1999,
    requestsPerMinute: 500,
    requestsPerHour: 10000,
    requestsPerDay: 185000,
    maxConcurrentRequests: 50,
    monthlyQuotas: {
      commoditized: 100000,
      enhanced: 50000,
      proprietary: 25000,
      exclusive: 10000,
    },
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

export function getEndpointCategory(endpoint: string): EndpointCategory {
  return ENDPOINT_CATEGORIES[endpoint] ?? 'commoditized';
}

export function getMonthlyQuota(tier: SDKTier, category: EndpointCategory): number {
  return SDK_TIER_LIMITS[tier].monthlyQuotas[category];
}

export function getTotalMonthlyQuota(tier: SDKTier): number {
  const q = SDK_TIER_LIMITS[tier].monthlyQuotas;
  return q.commoditized + q.enhanced + q.proprietary + q.exclusive;
}

export function getTierByFeatureRequirement(requiredFeatures: string[]): SDKTier {
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
