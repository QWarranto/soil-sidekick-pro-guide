/**
 * Territorial Water Analytics Function - Migrated to requestHandler
 * Updated: December 9, 2025 - Phase 3B.5 QC Migration
 * 
 * Features:
 * - Unified requestHandler with auth and subscription checks
 * - Zod validation for inputs
 * - Rate limiting: 50 requests/hour
 * - Graceful degradation for EPA water metrics
 * - Cost tracking for EPA API calls
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { waterAnalyticsSchema } from '../_shared/validation.ts';
import { trackExternalAPICost } from '../_shared/cost-tracker.ts';
import { withFallback } from '../_shared/graceful-degradation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: waterAnalyticsSchema,
  rateLimit: {
    requests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  useServiceRole: true,
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { territory_type, epa_region, date_range } = validatedData;

    logSafe('Processing territorial water analytics request', { territory_type, epa_region, date_range });

    // Generate territorial water quality analytics
    const analytics = await generateTerritorialAnalytics(
      supabaseClient,
      user.id,
      territory_type,
      epa_region,
      date_range
    );

    // Track EPA API cost for analytics
    await trackExternalAPICost(supabaseClient, {
      provider: 'epa',
      endpoint: 'water-quality',
      featureName: 'territorial-water-analytics',
      userId: user.id,
    });

    logSafe('Successfully generated territorial water analytics');

    return {
      analytics,
      generated_at: new Date().toISOString(),
    };
  },
});

// ============================================
// Analytics Generation
// ============================================

async function generateTerritorialAnalytics(
  supabase: any,
  userId: string,
  territory_type?: string,
  epa_region?: string,
  date_range?: any
) {
  // Get usage statistics for territorial water quality requests
  let query = supabase
    .from('subscription_usages')
    .select('*')
    .eq('action_type', 'territorial_water_quality');

  if (date_range) {
    query = query
      .gte('used_at', date_range.start_date)
      .lte('used_at', date_range.end_date);
  }

  const { data: usageData, error } = await query;

  if (error) {
    logError('Error fetching usage data', error);
  }

  // Generate analytics with graceful degradation
  const territorialCoverage = await withFallback(
    () => generateTerritorialCoverage(supabase),
    () => ({ error: 'Coverage data unavailable', total_territories: 0 }),
    'Territorial Coverage'
  );
  
  const waterQualityMetrics = generateWaterQualityMetrics(territory_type);
  const regionalInsights = generateRegionalInsights(epa_region);

  return {
    territorial_coverage: territorialCoverage,
    water_quality_metrics: waterQualityMetrics,
    regional_insights: regionalInsights,
    usage_statistics: {
      total_requests: usageData?.length || 0,
      recent_activity: usageData?.slice(-10) || [],
      territory_breakdown: generateTerritoryBreakdown(usageData || []),
    },
  };
}

async function generateTerritorialCoverage(supabase: any) {
  const { data: counties, error } = await supabase
    .from('counties')
    .select('state_code, state_name')
    .in('state_code', ['PR', 'VI', 'AS', 'GU', 'MP', 'MH', 'FM', 'PW']);

  if (error) {
    logError('Error fetching territorial data', error);
    throw new Error('Failed to fetch territorial coverage');
  }

  const territoryStats = counties.reduce((acc: any, county: any) => {
    if (!acc[county.state_code]) {
      acc[county.state_code] = {
        state_name: county.state_name,
        admin_units: 0,
      };
    }
    acc[county.state_code].admin_units++;
    return acc;
  }, {});

  return {
    total_territories: Object.keys(territoryStats).length,
    total_admin_units: counties.length,
    territory_details: territoryStats,
    coverage_percentage: (Object.keys(territoryStats).length / 8) * 100,
  };
}

// ============================================
// Water Quality Metrics
// ============================================

function generateWaterQualityMetrics(territory_type?: string) {
  const baseMetrics = {
    average_grade: 'B+',
    violation_rate: 0.05,
    common_contaminants: [
      'Chlorine',
      'Lead',
      'Total Trihalomethanes',
      'Nitrates',
    ],
    source_types: {
      'Surface Water': 30,
      'Groundwater': 25,
      'Desalination': 20,
      'Rainwater Collection': 15,
      'Mixed Sources': 10,
    },
  };

  if (territory_type === 'territory') {
    return {
      ...baseMetrics,
      unique_challenges: [
        'Limited infrastructure',
        'Saltwater intrusion',
        'Remote location logistics',
        'Climate vulnerability',
      ],
      regulatory_framework: 'Federal oversight with local implementation',
    };
  }

  if (territory_type === 'compact_state') {
    return {
      ...baseMetrics,
      average_grade: 'B',
      violation_rate: 0.08,
      unique_challenges: [
        'Very limited infrastructure',
        'Resource constraints',
        'Technical expertise shortages',
        'Geographic isolation',
      ],
      regulatory_framework: 'Self-governance with US assistance',
    };
  }

  return baseMetrics;
}

// ============================================
// Regional Insights
// ============================================

function generateRegionalInsights(epa_region?: string) {
  const regionalData: Record<string, any> = {
    'Region 2': {
      territories: ['Puerto Rico', 'US Virgin Islands'],
      primary_challenges: ['Hurricane resilience', 'Aging infrastructure'],
      water_sources: 'Surface water, groundwater, desalination',
      climate_impact: 'High - tropical storms and sea level rise',
    },
    'Region 9': {
      territories: ['Guam', 'American Samoa', 'Northern Mariana Islands'],
      primary_challenges: ['Remote logistics', 'Coral reef protection'],
      water_sources: 'Groundwater aquifers, rainwater, limited desalination',
      climate_impact: 'Very High - typhoons and sea level rise',
    },
    'Pacific Partnership': {
      territories: ['Marshall Islands', 'FSM', 'Palau'],
      primary_challenges: ['Extreme isolation', 'Limited technical resources'],
      water_sources: 'Rainwater catchment, small groundwater lenses',
      climate_impact: 'Critical - sea level rise threatens freshwater',
    },
  };

  return regionalData[epa_region || 'Region 2'] || {
    note: 'Regional data not available for specified region',
  };
}

function generateTerritoryBreakdown(usageData: any[]) {
  return usageData.reduce((breakdown: any, usage: any) => {
    const stateCode = usage.county_fips?.slice(0, 2);
    if (!breakdown[stateCode]) {
      breakdown[stateCode] = 0;
    }
    breakdown[stateCode]++;
    return breakdown;
  }, {});
}
