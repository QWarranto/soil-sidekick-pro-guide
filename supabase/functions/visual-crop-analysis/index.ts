import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { validateInput } from '../_shared/validation.ts';
import { trackOpenAICost } from '../_shared/cost-tracker.ts';
import { logComplianceAudit, logExternalAPICall } from '../_shared/compliance-logger.ts';
import { safeExternalCall } from '../_shared/graceful-degradation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analysisSchema = z.object({
  image: z.string().min(1),
  analysis_type: z.enum(['pest_detection', 'crop_health', 'disease_screening']),
  location: z.object({
    county_fips: z.string().optional(),
    county_name: z.string().optional(),
    state_code: z.string().optional(),
  }).optional(),
  crop_type: z.string().optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const body = await req.json();
    const { image, analysis_type, location, crop_type } = validateInput(analysisSchema, body);

    // Perform visual analysis with cost tracking
    const analysisStart = Date.now();
    const analysisResult = await safeExternalCall('openai', async () => {
      return await performVisualAnalysis(image, analysis_type, crop_type);
    });

    // Track OpenAI vision costs
    await trackOpenAICost(supabase, {
      model: 'vision-analysis',
      featureName: 'visual-crop-analysis',
      userId: user.id,
      inputTokens: 0,
      outputTokens: 800,
    });

    // Log compliance audit
    await logComplianceAudit(supabase, {
      table_name: 'visual_analysis',
      operation: 'VISION_ANALYSIS',
      user_id: user.id,
      risk_level: 'medium',
      compliance_tags: ['AI_VISION', 'CROP_ANALYSIS', analysis_type.toUpperCase()],
      metadata: { analysis_type, has_location: !!location, crop_type },
    });

    // Log external API call
    await logExternalAPICall(supabase, {
      provider: 'openai',
      endpoint: 'vision-gpt-4o',
      user_id: user.id,
      success: true,
      cost_usd: 0.50,
      response_time_ms: Date.now() - analysisStart,
    });

    // Store analysis result
    const { data: stored_analysis } = await supabase
      .from('visual_analysis_results')
      .insert({
        user_id: user.id,
        analysis_type,
        image_data: image.substring(0, 100) + '...',
        analysis_result: analysisResult,
        location_data: location,
        crop_type,
      })
      .select()
      .single();

    const duration = Date.now() - startTime;
    console.log(`[Visual Analysis] Completed in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResult,
        analysis_id: stored_analysis?.id,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in visual-crop-analysis:', error);

    await logComplianceAudit(supabase, {
      table_name: 'visual_analysis',
      operation: 'ANALYSIS_ERROR',
      user_id: user?.id,
      risk_level: 'high',
      compliance_tags: ['ERROR', 'VISION_FAILURE'],
      metadata: { error: error.message },
    });

    return new Response(
      JSON.stringify({
        error: 'Visual analysis service temporarily unavailable',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function performVisualAnalysis(
  image: string, 
  analysisType: string, 
  cropType?: string
): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompts = {
    pest_detection: `You are an agricultural pest detection expert. Analyze the image to identify any pests, insects, or pest damage. Provide:
    1. Pest identification (if any)
    2. Confidence level (0-100%)
    3. Severity assessment (low/medium/high)
    4. Basic treatment recommendations
    5. Risk level for crop damage`,
    
    crop_health: `You are a crop health specialist. Analyze the image to assess overall plant health. Provide:
    1. Health status (excellent/good/fair/poor)
    2. Visible symptoms or issues
    3. Potential causes
    4. Basic care recommendations
    5. Growth stage assessment`,
    
    disease_screening: `You are a plant pathology expert. Screen the image for plant diseases. Provide:
    1. Disease identification (if any)
    2. Confidence level (0-100%)
    3. Disease progression stage
    4. Treatment urgency (low/medium/high)
    5. Prevention recommendations`
  };

  const cropContext = cropType ? `The crop being analyzed is: ${cropType}. ` : '';
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompts[analysisType as keyof typeof systemPrompts] + 
                  cropContext + 
                  'Respond in JSON format with structured data.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze this agricultural image for ${analysisType.replace('_', ' ')}:`
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenAI API error:', errorData);
    throw new Error(`Vision analysis failed: ${response.status}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;
  
  // Try to parse as JSON, fallback to structured text
  try {
    return JSON.parse(analysisText);
  } catch {
    return {
      raw_analysis: analysisText,
      analysis_type: analysisType,
      timestamp: new Date().toISOString(),
      model_used: 'gpt-4o',
      format: 'text'
    };
  }
}

async function logAnalysisUsage(
  supabase: any,
  userId: string,
  analysisType: string,
  location?: any
) {
  try {
    await supabase
      .from('subscription_usages')
      .insert({
        user_id: userId,
        action_type: `visual_${analysisType}`,
        county_fips: location?.county_fips,
        used_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Failed to log usage:', error);
    // Don't throw - this is non-critical
  }
}