import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface SoilAnalysisData {
  id: string;
  county_name: string;
  state_code: string;
  county_fips: string;
  ph_level: number | null;
  organic_matter: number | null;
  nitrogen_level: string | null;
  phosphorus_level: string | null;
  potassium_level: string | null;
  recommendations: string | null;
  analysis_data: any;
}

interface AdaptSoilData {
  AnalysisMetadata: {
    Id: string;
    Name: string;
    TimeScope: {
      DateContext: string;
      Description: string;
    };
    Location: {
      County: string;
      State: string;
      FipsCode: string;
    };
  };
  SoilAnalysis: {
    SampleId: string;
    SampleDate: string;
    TestingLab: string;
    SoilProperties: {
      pH: number | null;
      OrganicMatter: {
        Value: number | null;
        Unit: "percent";
      };
      Nutrients: {
        Nitrogen: {
          Level: string | null;
          Classification: string;
        };
        Phosphorus: {
          Level: string | null;
          Classification: string;
        };
        Potassium: {
          Level: string | null;
          Classification: string;
        };
      };
    };
    Recommendations: {
      Description: string | null;
      FertilizerRecommendations: any[];
      LimingRecommendations: any[];
    };
  };
  ComplianceInfo: {
    Standard: "ADAPT-1.0";
    Version: "1.0.0";
    GeneratedBy: "SoilSidekick Pro";
    GeneratedAt: string;
  };
}

function transformToAdaptFormat(soilData: SoilAnalysisData): AdaptSoilData {
  const currentDate = new Date().toISOString();
  
  return {
    AnalysisMetadata: {
      Id: soilData.id,
      Name: `Soil Analysis - ${soilData.county_name}, ${soilData.state_code}`,
      TimeScope: {
        DateContext: currentDate,
        Description: `Soil analysis data for ${soilData.county_name} County`
      },
      Location: {
        County: soilData.county_name,
        State: soilData.state_code,
        FipsCode: soilData.county_fips
      }
    },
    SoilAnalysis: {
      SampleId: soilData.id,
      SampleDate: currentDate,
      TestingLab: "SoilSidekick Pro Analytics",
      SoilProperties: {
        pH: soilData.ph_level,
        OrganicMatter: {
          Value: soilData.organic_matter,
          Unit: "percent"
        },
        Nutrients: {
          Nitrogen: {
            Level: soilData.nitrogen_level,
            Classification: classifyNutrientLevel(soilData.nitrogen_level)
          },
          Phosphorus: {
            Level: soilData.phosphorus_level,
            Classification: classifyNutrientLevel(soilData.phosphorus_level)
          },
          Potassium: {
            Level: soilData.potassium_level,
            Classification: classifyNutrientLevel(soilData.potassium_level)
          }
        }
      },
      Recommendations: {
        Description: soilData.recommendations,
        FertilizerRecommendations: extractFertilizerRecommendations(soilData.analysis_data),
        LimingRecommendations: extractLimingRecommendations(soilData.analysis_data)
      }
    },
    ComplianceInfo: {
      Standard: "ADAPT-1.0",
      Version: "1.0.0",
      GeneratedBy: "SoilSidekick Pro",
      GeneratedAt: currentDate
    }
  };
}

function classifyNutrientLevel(level: string | null): string {
  if (!level) return "Unknown";
  
  const lowerLevel = level.toLowerCase();
  if (lowerLevel.includes('low')) return "Deficient";
  if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) return "Adequate";
  if (lowerLevel.includes('high')) return "Excessive";
  return "Unknown";
}

function extractFertilizerRecommendations(analysisData: any): any[] {
  if (!analysisData?.recommendations) return [];
  
  // Extract fertilizer recommendations from analysis data
  // This would be customized based on your specific data structure
  return [];
}

function extractLimingRecommendations(analysisData: any): any[] {
  if (!analysisData?.liming) return [];
  
  // Extract liming recommendations from analysis data
  return [];
}

async function validateSubscriptionTier(userId: string, requestType: string): Promise<{ valid: boolean; tier: string }> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('user_id', userId)
    .single();
  
  const tier = profile?.subscription_tier || 'free';
  
  // Tier validation logic
  const tierLimits = {
    free: ['export'], // Basic export only
    pro: ['export', 'import', 'sync'], // Full bidirectional
    api: ['export', 'import', 'sync', 'validate', 'batch'] // Full API access
  };
  
  const allowedActions = tierLimits[tier as keyof typeof tierLimits] || [];
  
  return {
    valid: allowedActions.includes(requestType),
    tier
  };
}

async function logApiUsage(
  userId: string,
  integrationId: string | null,
  endpoint: string,
  requestType: string,
  dataType: string,
  subscriptionTier: string,
  success: boolean,
  errorMessage?: string
) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  await supabase.from('adapt_api_usage').insert({
    user_id: userId,
    integration_id: integrationId,
    endpoint,
    request_type: requestType,
    data_type: dataType,
    subscription_tier: subscriptionTier,
    success,
    error_message: errorMessage
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { soilAnalysisIds, format = 'adapt_1.0', integrationId } = await req.json();
    
    if (!soilAnalysisIds || !Array.isArray(soilAnalysisIds)) {
      return new Response(
        JSON.stringify({ error: 'soilAnalysisIds array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate subscription tier
    const { valid: tierValid, tier } = await validateSubscriptionTier(user.id, 'export');
    
    if (!tierValid) {
      await logApiUsage(
        user.id,
        integrationId,
        '/adapt-soil-export',
        'export',
        'soil_analysis',
        tier,
        false,
        'Insufficient subscription tier'
      );
      
      return new Response(
        JSON.stringify({ 
          error: 'Upgrade required',
          message: `Your ${tier} subscription doesn't support ADAPT exports. Upgrade to Pro or API tier.`,
          requiredTier: 'pro'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get soil analysis data
    const { data: soilAnalyses, error: fetchError } = await supabase
      .from('soil_analyses')
      .select('*')
      .in('id', soilAnalysisIds)
      .eq('user_id', user.id);

    if (fetchError) {
      await logApiUsage(
        user.id,
        integrationId,
        '/adapt-soil-export',
        'export',
        'soil_analysis',
        tier,
        false,
        `Database error: ${fetchError.message}`
      );
      
      return new Response(
        JSON.stringify({ error: 'Failed to fetch soil analyses' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!soilAnalyses || soilAnalyses.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No soil analyses found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform to ADAPT format
    const adaptData = soilAnalyses.map(transformToAdaptFormat);

    // Create export records
    const exportPromises = soilAnalyses.map(async (analysis, index) => {
      const { error: exportError } = await supabase
        .from('adapt_soil_exports')
        .insert({
          user_id: user.id,
          integration_id: integrationId,
          soil_analysis_id: analysis.id,
          export_format: format,
          export_data: adaptData[index],
          export_status: 'completed'
        });

      return exportError;
    });

    await Promise.all(exportPromises);

    // Log successful API usage
    await logApiUsage(
      user.id,
      integrationId,
      '/adapt-soil-export',
      'export',
      'soil_analysis',
      tier,
      true
    );

    const response = {
      success: true,
      format: format,
      standard: "ADAPT-1.0",
      exportedCount: adaptData.length,
      data: adaptData,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: "SoilSidekick Pro",
        version: "1.0.0"
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-ADAPT-Standard': 'ADAPT-1.0',
          'X-Export-Count': adaptData.length.toString()
        } 
      }
    );

  } catch (error) {
    console.error('ADAPT export error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});