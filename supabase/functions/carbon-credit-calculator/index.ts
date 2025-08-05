import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CarbonCreditRequest {
  field_name: string
  field_size_acres: number
  soil_organic_matter?: number
  soil_analysis_id?: string
  verification_type?: 'self_reported' | 'third_party' | 'satellite'
}

interface CarbonCreditCalculation {
  credits_earned: number
  calculation_method: string
  baseline_carbon: number
  enhanced_carbon: number
  verification_confidence: number
  metadata: {
    calculation_factors: any
    data_sources: string[]
    confidence_score: number
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Processing carbon credit calculation for user:', user.id);

    const requestData: CarbonCreditRequest = await req.json();
    
    // Validate required fields
    if (!requestData.field_name || !requestData.field_size_acres) {
      throw new Error('Field name and size are required');
    }

    // Calculate carbon credits
    const calculation = await calculateCarbonCredits(supabase, user.id, requestData);
    
    // Store the calculation in database
    const { data: creditRecord, error: insertError } = await supabase
      .from('carbon_credits')
      .insert({
        user_id: user.id,
        field_name: requestData.field_name,
        field_size_acres: requestData.field_size_acres,
        soil_organic_matter: requestData.soil_organic_matter,
        credits_earned: calculation.credits_earned,
        verification_status: requestData.verification_type === 'third_party' ? 'verified' : 'pending',
        metadata: calculation.metadata
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting carbon credit record:', insertError);
      throw insertError;
    }

    console.log('Carbon credit calculation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        credit_record: creditRecord,
        calculation_details: calculation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in carbon credit calculator:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to calculate carbon credits',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculateCarbonCredits(
  supabase: any, 
  userId: string, 
  request: CarbonCreditRequest
): Promise<CarbonCreditCalculation> {
  
  let soilOrganicMatter = request.soil_organic_matter;
  let confidenceScore = 0.7; // Default confidence
  const dataSources: string[] = [];

  // Try to get soil data from existing analysis if not provided
  if (!soilOrganicMatter && request.soil_analysis_id) {
    const { data: soilData } = await supabase
      .from('soil_analyses')
      .select('organic_matter, analysis_data')
      .eq('id', request.soil_analysis_id)
      .eq('user_id', userId)
      .single();
    
    if (soilData?.organic_matter) {
      soilOrganicMatter = soilData.organic_matter;
      confidenceScore = 0.85; // Higher confidence with lab data
      dataSources.push('soil_lab_analysis');
    }
  }

  // Default soil organic matter if not available (regional average)
  if (!soilOrganicMatter) {
    soilOrganicMatter = 2.5; // US agricultural average
    confidenceScore = 0.5; // Lower confidence
    dataSources.push('regional_average');
  } else {
    dataSources.push('field_measurement');
  }

  // Carbon sequestration calculation based on improved soil management
  // Formula: Credits = (Enhanced_SOM - Baseline_SOM) * Bulk_Density * Field_Size * CO2_Conversion
  
  const baselineSOM = Math.max(soilOrganicMatter - 0.5, 1.0); // Assume 0.5% improvement
  const enhancedSOM = soilOrganicMatter;
  const bulkDensity = 1.3; // g/cm³ typical for agricultural soil
  const depthCm = 30; // Top 30cm of soil
  const carbonFraction = 0.58; // Carbon is ~58% of organic matter
  const co2ConversionFactor = 3.67; // CO2/C molecular weight ratio
  const acreToHectare = 0.404686; // Conversion factor
  const kgToTonne = 0.001;
  
  // Calculate carbon sequestration per hectare
  const carbonIncrease = (enhancedSOM - baselineSOM) / 100; // Convert percentage to decimal
  const carbonPerHectare = carbonIncrease * bulkDensity * depthCm * 10000 * carbonFraction * kgToTonne; // tonnes C/ha
  const co2PerHectare = carbonPerHectare * co2ConversionFactor; // tonnes CO2/ha
  
  // Calculate total credits for the field
  const fieldHectares = request.field_size_acres * acreToHectare;
  const totalCredits = co2PerHectare * fieldHectares;
  
  // Apply verification confidence factor
  const verifiedCredits = totalCredits * confidenceScore;

  const calculationFactors = {
    baseline_som_percent: baselineSOM,
    enhanced_som_percent: enhancedSOM,
    bulk_density: bulkDensity,
    soil_depth_cm: depthCm,
    carbon_fraction: carbonFraction,
    co2_conversion_factor: co2ConversionFactor,
    field_hectares: fieldHectares,
    carbon_per_hectare: carbonPerHectare,
    co2_per_hectare: co2PerHectare
  };

  return {
    credits_earned: Math.round(verifiedCredits * 100) / 100, // Round to 2 decimal places
    calculation_method: 'soil_organic_matter_enhancement',
    baseline_carbon: baselineSOM,
    enhanced_carbon: enhancedSOM,
    verification_confidence: confidenceScore,
    metadata: {
      calculation_factors: calculationFactors,
      data_sources: dataSources,
      confidence_score: confidenceScore
    }
  };
}