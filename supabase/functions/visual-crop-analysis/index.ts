import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  image: string; // base64 encoded image
  analysis_type: 'pest_detection' | 'crop_health' | 'disease_screening';
  location?: {
    county_fips?: string;
    county_name?: string;
    state_code?: string;
  };
  crop_type?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { image, analysis_type, location, crop_type }: AnalysisRequest = await req.json();

    if (!image || !analysis_type) {
      throw new Error('Missing required fields: image and analysis_type');
    }

    // Call OpenAI Vision API for basic analysis
    const analysisResult = await performVisualAnalysis(image, analysis_type, crop_type);

    // Log usage for analytics
    await logAnalysisUsage(supabase, user.id, analysis_type, location);

    // Store analysis result
    const { data: stored_analysis, error: storageError } = await supabase
      .from('visual_analysis_results')
      .insert({
        user_id: user.id,
        analysis_type,
        image_data: image.substring(0, 100) + '...', // Store truncated for reference
        analysis_result: analysisResult,
        location_data: location,
        crop_type,
      })
      .select()
      .single();

    if (storageError) {
      console.error('Storage error:', storageError);
      // Continue even if storage fails
    }

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
    return new Response(
      JSON.stringify({ 
        error: error.message,
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