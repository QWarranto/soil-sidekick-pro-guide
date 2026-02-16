import { createClient } from 'jsr:@supabase/supabase-js@2';
import { validateInput, agriculturalIntelligenceSchema } from '../_shared/validation.ts';
import { trackOpenAICost, trackExternalAPICost } from '../_shared/cost-tracker.ts';
import { logComplianceAudit, logExternalAPICall } from '../_shared/compliance-logger.ts';
import { withFallback, safeExternalCall } from '../_shared/graceful-degradation.ts';
import { withTimingHeaders, logResponseTime } from '../_shared/response-timing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface IntelligenceRequest {
  query: string;
  context?: {
    county_fips?: string;
    soil_data?: any;
    user_location?: string;
  };
  useGPT5?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let userId: string | undefined;

  try {
    // Authenticate
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

    userId = user.id;

    // Validate input
    const body = await req.json();
    const validatedInput = validateInput(agriculturalIntelligenceSchema, body);
    const { query, context, useGPT5 = false } = validatedInput;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Enhanced intent analysis with fallback
    const intentAnalysis = await safeExternalCall('lovable-ai', async () => {
      return await analyzeIntent(query, lovableApiKey);
    });

    console.log('Intent analysis:', intentAnalysis);

    // Log compliance audit for AI query
    await logComplianceAudit(supabase, {
      table_name: 'ai_queries',
      operation: 'ANALYZE_INTENT',
      user_id: user.id,
      risk_level: 'low',
      compliance_tags: ['AI_USAGE', 'AGRICULTURAL_INTELLIGENCE'],
      metadata: { intent: intentAnalysis.intent, confidence: intentAnalysis.confidence },
    });

    // Gather relevant data
    const analyticsData = await gatherRelevantData(intentAnalysis, context, supabase);

    // Generate response with cost tracking
    const responseStart = Date.now();
    const response = await safeExternalCall('lovable-ai', async () => {
      return await generateIntelligentResponse(
        query,
        intentAnalysis,
        analyticsData,
        lovableApiKey,
        useGPT5
      );
    });

    // Track costs
    const model = useGPT5 ? 'google/gemini-2.5-pro' : 'google/gemini-3-flash-preview';
    await trackOpenAICost(supabase, {
      model,
      featureName: 'agricultural-intelligence',
      userId: user.id,
      inputTokens: response.usage?.input_tokens || 0,
      outputTokens: response.usage?.output_tokens || 0,
    });

    // Log API call for compliance
    await logExternalAPICall(supabase, {
      provider: 'lovable-ai',
      endpoint: model,
      user_id: user.id,
      success: true,
      response_time_ms: Date.now() - responseStart,
    });

    logResponseTime('agricultural-intelligence', startTime, true);

    return new Response(JSON.stringify({
      success: true,
      response: response.content,
      intent: intentAnalysis.intent,
      confidence: intentAnalysis.confidence,
      data_sources: analyticsData.sources
    }), {
      headers: withTimingHeaders({ ...corsHeaders, 'Content-Type': 'application/json' }, startTime, 'agricultural-intelligence'),
    });

  } catch (error) {
    console.error('Error in agricultural intelligence:', error);

    // Log compliance audit for error
    try {
      await logComplianceAudit(supabase, {
        table_name: 'ai_queries',
        operation: 'QUERY_ERROR',
        user_id: userId,
        risk_level: 'high',
        compliance_tags: ['ERROR', 'AI_FAILURE'],
        metadata: { error: error.message, timestamp: new Date().toISOString() },
      });
    } catch (_auditErr) {
      // Don't fail on audit logging errors
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Agricultural intelligence service temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeIntent(query: string, apiKey: string) {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        {
          role: 'system',
          content: `You are SoilSidekick Pro's agricultural intelligence system. Analyze user queries to determine intent and extract parameters.
          
          Return a JSON object with:
          - intent: one of ["soil_analysis", "environmental_assessment", "planting_calendar", "water_quality", "fertilizer_recommendation", "crop_management", "sustainability_planning", "risk_assessment", "general_question"]
          - confidence: number between 0-1
          - parameters: object with extracted parameters like county_fips, crop_type, season, etc.
          - requires_data: boolean indicating if specific data lookup is needed
          - reasoning_depth: "basic" or "enhanced"
          - priority_factors: array of most critical factors`
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Lovable AI intent analysis error:', response.status, errorData);
    // Return fallback intent
    return {
      intent: 'general_question',
      confidence: 0.5,
      parameters: {},
      requires_data: false,
      reasoning_depth: 'basic',
      priority_factors: []
    };
  }

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return {
      intent: 'general_question',
      confidence: 0.5,
      parameters: {},
      requires_data: false,
      reasoning_depth: 'basic',
      priority_factors: []
    };
  }
}

async function gatherRelevantData(intentAnalysis: any, context: any, supabase: any) {
  const data: any = { sources: [] };
  
  try {
    switch (intentAnalysis.intent) {
      case 'soil_analysis':
        if (context?.county_fips || intentAnalysis.parameters?.county_fips) {
          const soilResponse = await supabase.functions.invoke('get-soil-data', {
            body: { 
              county_fips: context?.county_fips || intentAnalysis.parameters?.county_fips 
            }
          });
          if (soilResponse.data) {
            data.soil_analysis = soilResponse.data;
            data.sources.push('USDA Soil Data');
          }
        }
        break;

      case 'environmental_assessment':
        if (context?.soil_data || context?.county_fips) {
          const envResponse = await supabase.functions.invoke('environmental-impact-engine', {
            body: {
              analysis_id: 'temp',
              county_fips: context?.county_fips || intentAnalysis.parameters?.county_fips,
              soil_data: context?.soil_data || {},
              proposed_treatments: intentAnalysis.parameters?.treatments || []
            }
          });
          if (envResponse.data) {
            data.environmental_assessment = envResponse.data;
            data.sources.push('Environmental Impact Analysis');
          }
        }
        break;

      case 'planting_calendar':
        if (intentAnalysis.parameters?.crop_type || context?.county_fips) {
          const plantingResponse = await supabase.functions.invoke('multi-parameter-planting-calendar', {
            body: {
              county_fips: context?.county_fips || intentAnalysis.parameters?.county_fips,
              crop_type: intentAnalysis.parameters?.crop_type || 'corn',
              soil_data: context?.soil_data || {},
              climate_preferences: intentAnalysis.parameters?.climate_preferences || {},
              sustainability_goals: intentAnalysis.parameters?.sustainability_goals || []
            }
          });
          if (plantingResponse.data) {
            data.planting_calendar = plantingResponse.data;
            data.sources.push('Planting Calendar Analytics');
          }
        }
        break;

      case 'water_quality':
        if (context?.county_fips) {
          const waterResponse = await supabase.functions.invoke('territorial-water-quality', {
            body: { 
              county_fips: context?.county_fips 
            }
          });
          if (waterResponse.data) {
            data.water_quality = waterResponse.data;
            data.sources.push('Water Quality Portal');
          }
        }
        break;
    }

    if (context?.county_fips && intentAnalysis.intent !== 'general_question') {
      try {
        const enhancedResponse = await supabase.functions.invoke('alpha-earth-environmental-enhancement', {
          body: {
            analysis_details: {
              type: intentAnalysis.intent,
              parameters: intentAnalysis.parameters
            },
            location: {
              county_fips: context.county_fips
            },
            soil_data: context?.soil_data || {},
            environmental_data: data.environmental_assessment || {}
          }
        });
        if (enhancedResponse.data) {
          data.satellite_enhancement = enhancedResponse.data;
          data.sources.push('AlphaEarth Satellite Intelligence');
        }
      } catch (e) {
        console.log('Satellite enhancement not available:', e.message);
      }
    }

    if (context?.county_fips) {
      try {
        const liveDataResponse = await supabase.functions.invoke('live-agricultural-data', {
          body: {
            county_fips: context.county_fips,
            data_types: ['weather', 'soil', 'crop', 'environmental'],
            state_code: context?.state_code || 'US',
            county_name: context?.county_name || 'Unknown County'
          }
        });

        if (liveDataResponse.data && !liveDataResponse.error) {
          data.live_agricultural_data = liveDataResponse.data;
          const liveSources = liveDataResponse.data.sources || [];
          data.sources.push(...liveSources);
          console.log(`Live agricultural data integrated from: ${liveSources.join(', ')}`);
        }
      } catch (e) {
        console.log('Live agricultural data not available:', e.message);
      }
    }

  } catch (error) {
    console.error('Error gathering data:', error);
  }

  return data;
}

async function generateIntelligentResponse(query: string, intent: any, analyticsData: any, apiKey: string, useGPT5: boolean = false) {
  const model = useGPT5 ? 'google/gemini-2.5-pro' : 'google/gemini-3-flash-preview';
  
  const systemPrompt = `You are SoilSidekick Pro's agricultural intelligence assistant. You have access to advanced agricultural analytics including:

- USDA soil composition and health data
- Environmental impact assessments with contamination and runoff risk scores
- Satellite-enhanced agricultural insights from AlphaEarth technology
- Multi-parameter planting calendar optimizations
- Water quality assessments from EPA data sources
- FIPS-based hierarchical geographic analytics

Provide helpful, specific, and actionable agricultural advice based on the available data. Always:
1. Reference specific data points when available
2. Explain the agricultural significance
3. Provide actionable recommendations
4. Mention the data sources you're using
5. Be conversational but professional

${useGPT5 ? 'Apply advanced reasoning to identify complex patterns and provide sophisticated agricultural insights that consider multi-factor interactions and long-term implications.' : ''}`;

  const dataContext = analyticsData ? `Available agricultural data:
${JSON.stringify(analyticsData, null, 2)}

Data sources used: ${analyticsData.sources?.length > 0 ? analyticsData.sources.join(', ') : 'General agricultural knowledge'}

Intent analysis: ${JSON.stringify(intent, null, 2)}

IMPORTANT: ${analyticsData.live_agricultural_data?.sources ? 'This includes LIVE data from: ' + analyticsData.live_agricultural_data.sources.join(', ') : 'This uses cached or simulated data'}. Please indicate the data source and freshness in your response.` : 'No specific data available for this query.';

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User Query: "${query}"

${dataContext}

Please provide a helpful agricultural response based on the available data and your agricultural expertise.`
        }
      ],
      temperature: useGPT5 ? 0.3 : 0.7,
      max_tokens: useGPT5 ? 1500 : 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI response error:', response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    if (response.status === 402) {
      throw new Error('AI service credits exhausted. Please add funds.');
    }
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Invalid AI response structure:', data);
    throw new Error('Invalid response from AI gateway');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model,
    enhanced: useGPT5
  };
}
