import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TerritorialWaterAnalyticsRequest {
  territory_type?: 'state' | 'territory' | 'compact_state';
  epa_region?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Verify user with anon key first
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role for data operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { territory_type, epa_region, date_range }: TerritorialWaterAnalyticsRequest = await req.json();

    console.log('Processing territorial water analytics request:', {
      user_id: user.id,
      territory_type,
      epa_region,
      date_range
    });

    // Generate territorial water quality analytics
    const analytics = await generateTerritorialAnalytics(
      supabase,
      territory_type,
      epa_region,
      date_range
    );

    console.log('Successfully generated territorial water analytics');

    return new Response(
      JSON.stringify({
        success: true,
        analytics,
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in territorial-water-analytics function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate territorial water analytics'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateTerritorialAnalytics(
  supabase: any,
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
    console.error('Error fetching usage data:', error);
  }

  // Generate analytics based on territorial coverage
  const territorialCoverage = await generateTerritorialCoverage(supabase);
  const waterQualityMetrics = generateWaterQualityMetrics(territory_type);
  const regionalInsights = generateRegionalInsights(epa_region);

  return {
    territorial_coverage: territorialCoverage,
    water_quality_metrics: waterQualityMetrics,
    regional_insights: regionalInsights,
    usage_statistics: {
      total_requests: usageData?.length || 0,
      recent_activity: usageData?.slice(-10) || [],
      territory_breakdown: generateTerritoryBreakdown(usageData || [])
    }
  };
}

async function generateTerritorialCoverage(supabase: any) {
  try {
    const { data: counties, error } = await supabase
      .from('counties')
      .select('state_code, state_name')
      .in('state_code', ['PR', 'VI', 'AS', 'GU', 'MP', 'MH', 'FM', 'PW']);

    if (error) {
      console.error('Error fetching territorial data:', error);
      return { error: 'Failed to fetch territorial coverage' };
    }

    const territoryStats = counties.reduce((acc: any, county: any) => {
      if (!acc[county.state_code]) {
        acc[county.state_code] = {
          state_name: county.state_name,
          admin_units: 0
        };
      }
      acc[county.state_code].admin_units++;
      return acc;
    }, {});

    return {
      total_territories: Object.keys(territoryStats).length,
      total_admin_units: counties.length,
      territory_details: territoryStats,
      coverage_percentage: (Object.keys(territoryStats).length / 8) * 100 // 8 total territories
    };
  } catch (error) {
    console.error('Error generating territorial coverage:', error);
    return { error: 'Failed to generate coverage data' };
  }
}

function generateWaterQualityMetrics(territory_type?: string) {
  const baseMetrics = {
    average_grade: 'B+',
    violation_rate: 0.05,
    common_contaminants: [
      'Chlorine',
      'Lead',
      'Total Trihalomethanes',
      'Nitrates'
    ],
    source_types: {
      'Surface Water': 30,
      'Groundwater': 25,
      'Desalination': 20,
      'Rainwater Collection': 15,
      'Mixed Sources': 10
    }
  };

  // Territory-specific adjustments
  if (territory_type === 'territory') {
    return {
      ...baseMetrics,
      unique_challenges: [
        'Limited infrastructure',
        'Saltwater intrusion',
        'Remote location logistics',
        'Climate vulnerability'
      ],
      regulatory_framework: 'Federal oversight with local implementation'
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
        'Geographic isolation'
      ],
      regulatory_framework: 'Self-governance with US assistance'
    };
  }

  return baseMetrics;
}

function generateRegionalInsights(epa_region?: string) {
  const regionalData: Record<string, any> = {
    'Region 2': {
      territories: ['Puerto Rico', 'US Virgin Islands'],
      primary_challenges: ['Hurricane resilience', 'Aging infrastructure'],
      water_sources: 'Surface water, groundwater, desalination',
      climate_impact: 'High - tropical storms and sea level rise'
    },
    'Region 9': {
      territories: ['Guam', 'American Samoa', 'Northern Mariana Islands'],
      primary_challenges: ['Remote logistics', 'Coral reef protection'],
      water_sources: 'Groundwater aquifers, rainwater, limited desalination',
      climate_impact: 'Very High - typhoons and sea level rise'
    },
    'Pacific Partnership': {
      territories: ['Marshall Islands', 'FSM', 'Palau'],
      primary_challenges: ['Extreme isolation', 'Limited technical resources'],
      water_sources: 'Rainwater catchment, small groundwater lenses',
      climate_impact: 'Critical - sea level rise threatens freshwater'
    }
  };

  return regionalData[epa_region || 'Region 2'] || {
    note: 'Regional data not available for specified region'
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