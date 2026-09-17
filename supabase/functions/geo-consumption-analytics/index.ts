/**
 * Geo Consumption Analytics Function - Migrated to requestHandler
 * Updated: December 9, 2025 - Phase 3B.4 QC Migration
 * 
 * Features:
 * - Unified requestHandler with auth checks
 * - Zod validation for inputs
 * - Rate limiting: 50 requests/hour
 * - Geographic pattern analysis
 * - Tier progression scoring
 * - Patent-protected geo-indexed consumption analysis
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { geoAnalyticsSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: false, // Internal analytics endpoint
  validationSchema: geoAnalyticsSchema,
  rateLimit: {
    requests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  useServiceRole: true,
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { action_type, county_fips, usage_metadata, session_data } = validatedData;
    
    logSafe('Geo-consumption analytics for action', { action_type, county_fips });

    const stateCode = county_fips.substring(0, 2);
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    // Get existing analytics record for this user/month/county
    const { data: existingRecord } = await supabaseClient
      .from('geo_consumption_analytics')
      .select('*')
      .eq('user_id', user.id)
      .eq('county_fips', county_fips)
      .eq('month_year', currentMonth)
      .maybeSingle();

    // Analyze user's geographic consumption pattern
    const geoPattern = await analyzeGeographicPattern(supabaseClient, user.id, county_fips, stateCode);
    
    // Calculate tier progression score
    const tierScore = calculateTierProgression(existingRecord, geoPattern, usage_metadata);
    
    // Determine upgrade probability
    const upgradeProb = calculateUpgradeProbability(tierScore, geoPattern, usage_metadata);
    
    // Build usage pattern object
    const usagePattern = {
      action_type,
      timestamp: new Date().toISOString(),
      session_duration: session_data.duration || 0,
      features_used: session_data.features || [],
      search_terms: session_data.search_terms || [],
      export_attempted: session_data.export_attempted || false,
      metadata: usage_metadata,
    };

    // Get seasonal pattern
    const seasonalPattern = await getSeasonalPattern(supabaseClient, user.id, county_fips);

    if (existingRecord) {
      // Update existing record
      const updatedUsagePattern = [
        ...(existingRecord.usage_pattern || []),
        usagePattern,
      ];

      const { data: updatedRecord, error: updateError } = await supabaseClient
        .from('geo_consumption_analytics')
        .update({
          usage_pattern: updatedUsagePattern,
          consumption_frequency: existingRecord.consumption_frequency + 1,
          geographic_cluster: geoPattern.cluster,
          seasonal_pattern: seasonalPattern,
          tier_progression_score: tierScore,
          upgrade_probability: upgradeProb,
        })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (updateError) {
        logError('Error updating analytics', updateError);
        throw new Error('Failed to update analytics');
      }

      const recommendations = generateRecommendations(updatedRecord, geoPattern);
      const tierTriggers = checkTierUpgradeTriggers(updatedRecord, geoPattern);

      return {
        analytics_updated: true,
        record: updatedRecord,
        geographic_insights: geoPattern,
        recommendations,
        tier_upgrade_triggers: tierTriggers,
        patent_protected_features: {
          geo_indexed_consumption: true,
          adaptive_tier_progression: true,
          seasonal_usage_prediction: true,
        },
      };
    } else {
      // Create new record
      const { data: newRecord, error: insertError } = await supabaseClient
        .from('geo_consumption_analytics')
        .insert({
          user_id: user.id,
          county_fips,
          state_code: stateCode,
          usage_pattern: [usagePattern],
          consumption_frequency: 1,
          geographic_cluster: geoPattern.cluster,
          seasonal_pattern: seasonalPattern,
          tier_progression_score: tierScore,
          upgrade_probability: upgradeProb,
          month_year: currentMonth,
        })
        .select()
        .single();

      if (insertError) {
        logError('Error creating analytics', insertError);
        throw new Error('Failed to create analytics record');
      }

      const recommendations = generateRecommendations(newRecord, geoPattern);

      return {
        analytics_created: true,
        record: newRecord,
        geographic_insights: geoPattern,
        recommendations,
        patent_protected_features: {
          geo_indexed_consumption: true,
          first_time_user_analysis: true,
        },
      };
    }
  },
});

// ============================================
// Geographic Pattern Analysis
// ============================================

async function analyzeGeographicPattern(
  supabase: any,
  userId: string,
  countyFips: string,
  stateCode: string
): Promise<any> {
  const { data: historicalUsage } = await supabase
    .from('subscription_usages')
    .select('county_fips, used_at')
    .eq('user_id', userId)
    .order('used_at', { ascending: false })
    .limit(50);

  const uniqueCounties = new Set(historicalUsage?.map((u: any) => u.county_fips) || []);
  const uniqueStates = new Set(historicalUsage?.map((u: any) => u.county_fips.substring(0, 2)) || []);

  // Determine geographic cluster
  let cluster = 'single_county';
  if (uniqueCounties.size > 10) {
    cluster = uniqueStates.size > 3 ? 'multi_state' : 'regional';
  } else if (uniqueCounties.size > 1) {
    cluster = uniqueStates.size > 1 ? 'multi_state' : 'local_area';
  }

  // Calculate geographic diversity score
  const diversityScore = Math.min((uniqueCounties.size * 2 + uniqueStates.size * 5), 100);

  // Determine operation type based on usage pattern
  let operationType = 'hobbyist';
  if (uniqueCounties.size > 20) operationType = 'commercial';
  else if (uniqueCounties.size > 5) operationType = 'small_farm';

  return {
    cluster,
    unique_counties: uniqueCounties.size,
    unique_states: uniqueStates.size,
    diversity_score: diversityScore,
    operation_type: operationType,
    primary_state: stateCode,
    geographic_focus: calculateGeographicFocus(historicalUsage || []),
  };
}

function calculateGeographicFocus(usage: any[]): any {
  const stateFrequency: Record<string, number> = {};
  const regionFrequency: Record<string, number> = {};

  usage.forEach(u => {
    const state = u.county_fips.substring(0, 2);
    const region = getRegionFromState(state);
    
    stateFrequency[state] = (stateFrequency[state] || 0) + 1;
    regionFrequency[region] = (regionFrequency[region] || 0) + 1;
  });

  const topState = Object.entries(stateFrequency).sort(([,a], [,b]) => b - a)[0];
  const topRegion = Object.entries(regionFrequency).sort(([,a], [,b]) => b - a)[0];

  return {
    primary_state: topState?.[0] || 'unknown',
    primary_state_usage: topState?.[1] || 0,
    primary_region: topRegion?.[0] || 'unknown',
    state_concentration: topState ? (topState[1] / usage.length * 100).toFixed(1) : 0,
  };
}

function getRegionFromState(stateCode: string): string {
  const regionMap: Record<string, string> = {
    '01': 'southeast', '04': 'southwest', '06': 'west', '08': 'west',
    '09': 'northeast', '10': 'northeast', '12': 'southeast', '13': 'southeast',
    '17': 'midwest', '19': 'midwest', '20': 'midwest', '48': 'south',
  };
  return regionMap[stateCode] || 'other';
}

// ============================================
// Tier Progression & Upgrade Probability
// ============================================

function calculateTierProgression(existingRecord: any, geoPattern: any, metadata: any): number {
  let score = 0;

  // Base score from usage frequency
  const frequency = existingRecord?.consumption_frequency || 1;
  score += Math.min(frequency * 2, 30);

  // Geographic diversity bonus
  score += Math.min(geoPattern.diversity_score * 0.2, 20);

  // Operation type bonus
  const operationBonus: Record<string, number> = {
    'hobbyist': 0,
    'small_farm': 15,
    'commercial': 30,
  };
  score += operationBonus[geoPattern.operation_type] || 0;

  // Feature usage bonus
  if (metadata.export_requested) score += 10;
  if (metadata.premium_features_viewed) score += 15;
  if (metadata.multiple_analyses) score += 8;

  // Seasonal activity bonus
  if (frequency > 5) score += 5;

  return Number(Math.min(score, 100).toFixed(2));
}

function calculateUpgradeProbability(tierScore: number, geoPattern: any, metadata: any): number {
  let probability = tierScore * 0.3;

  // Strong indicators
  if (metadata.export_requested) probability += 25;
  if (metadata.premium_features_viewed) probability += 20;
  if (geoPattern.operation_type === 'commercial') probability += 30;
  if (geoPattern.operation_type === 'small_farm') probability += 15;

  // Usage intensity
  if (geoPattern.unique_counties > 10) probability += 20;
  if (geoPattern.unique_states > 2) probability += 15;

  // Frequency bonus
  const frequency = metadata.session_frequency || 1;
  if (frequency > 10) probability += 10;
  else if (frequency > 5) probability += 5;

  return Number(Math.min(probability, 99).toFixed(2));
}

// ============================================
// Seasonal Pattern Analysis
// ============================================

async function getSeasonalPattern(supabase: any, userId: string, countyFips: string): Promise<any> {
  const { data: yearlyUsage } = await supabase
    .from('subscription_usages')
    .select('used_at')
    .eq('user_id', userId)
    .gte('used_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  const monthlyUsage: Record<string, number> = {};
  
  yearlyUsage?.forEach((usage: any) => {
    const month = new Date(usage.used_at).getMonth();
    const monthName = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month];
    monthlyUsage[monthName] = (monthlyUsage[monthName] || 0) + 1;
  });

  const sortedMonths = Object.entries(monthlyUsage).sort(([,a], [,b]) => b - a);
  const peakSeason = sortedMonths[0]?.[0] || 'spring';
  
  return {
    monthly_distribution: monthlyUsage,
    peak_season: peakSeason,
    total_sessions: yearlyUsage?.length || 0,
    seasonal_preference: determinePeakSeason(monthlyUsage),
  };
}

function determinePeakSeason(monthlyUsage: Record<string, number>): string {
  const seasons: Record<string, string[]> = {
    spring: ['mar', 'apr', 'may'],
    summer: ['jun', 'jul', 'aug'],
    fall: ['sep', 'oct', 'nov'],
    winter: ['dec', 'jan', 'feb'],
  };

  const seasonTotals: Record<string, number> = {};
  
  Object.entries(seasons).forEach(([season, months]) => {
    seasonTotals[season] = months.reduce((sum, month) => sum + (monthlyUsage[month] || 0), 0);
  });

  return Object.entries(seasonTotals).sort(([,a], [,b]) => b - a)[0]?.[0] || 'spring';
}

// ============================================
// Recommendations & Tier Triggers
// ============================================

function generateRecommendations(record: any, geoPattern: any): string[] {
  const recommendations = [];

  if (record.tier_progression_score > 60) {
    recommendations.push("Consider upgrading to Premium for advanced analytics and unlimited exports");
  }

  if (geoPattern.operation_type === 'commercial') {
    recommendations.push("Explore bulk analysis features for managing multiple properties");
  }

  if (geoPattern.unique_states > 2) {
    recommendations.push("Multi-state operations benefit from regional trend analysis");
  }

  if (record.upgrade_probability > 50) {
    recommendations.push("You're using many premium features - upgrade to unlock full potential");
  }

  if (geoPattern.cluster === 'single_county') {
    recommendations.push("Explore neighboring counties for expanded agricultural insights");
  }

  return recommendations;
}

function checkTierUpgradeTriggers(record: any, geoPattern: any): any {
  const triggers = [];

  if (record.consumption_frequency > 15) {
    triggers.push({
      type: 'high_usage',
      message: 'Heavy usage detected - upgrade for better value',
      urgency: 'medium',
    });
  }

  if (geoPattern.operation_type === 'commercial') {
    triggers.push({
      type: 'commercial_operation',
      message: 'Commercial operations benefit from Premium features',
      urgency: 'high',
    });
  }

  if (record.upgrade_probability > 70) {
    triggers.push({
      type: 'high_conversion_probability',
      message: 'Perfect candidate for Premium upgrade',
      urgency: 'high',
    });
  }

  return {
    triggers,
    show_upgrade_banner: triggers.some(t => t.urgency === 'high'),
    personalized_offer: generatePersonalizedOffer(record, geoPattern),
  };
}

function generatePersonalizedOffer(record: any, geoPattern: any): any {
  let discount = 0;
  let offerType = 'standard';

  if (geoPattern.operation_type === 'commercial') {
    discount = 20;
    offerType = 'commercial';
  } else if (record.consumption_frequency > 20) {
    discount = 15;
    offerType = 'power_user';
  } else if (geoPattern.unique_states > 1) {
    discount = 10;
    offerType = 'multi_state';
  }

  return {
    discount_percent: discount,
    offer_type: offerType,
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    features_highlighted: getRelevantFeatures(geoPattern, record),
  };
}

function getRelevantFeatures(geoPattern: any, record: any): string[] {
  const features = [];

  if (geoPattern.operation_type === 'commercial') {
    features.push('Bulk analysis tools', 'Advanced reporting', 'API access');
  }

  if (geoPattern.unique_states > 1) {
    features.push('Multi-state comparisons', 'Regional trends');
  }

  if (record.consumption_frequency > 10) {
    features.push('Unlimited exports', 'Priority support', 'Historical data');
  }

  return features;
}
