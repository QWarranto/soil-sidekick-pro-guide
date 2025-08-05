import { createClient } from 'jsr:@supabase/supabase-js@2'

// Security utilities (inline for now since imports from _shared don't work in edge functions)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function sanitizeError(error: any): string {
  if (error.message?.includes('JWT') || error.message?.includes('auth')) {
    return 'Authentication failed';
  }
  if (error.message?.includes('database') || error.message?.includes('SQL')) {
    return 'Database operation failed';
  }
  if (error.message?.includes('API key') || error.message?.includes('secret')) {
    return 'External service unavailable';
  }
  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return 'Service temporarily unavailable';
  }
  return 'An unexpected error occurred';
}

function checkRateLimit(identifier: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
}

async function logSecurityEvent(supabase: any, event: any, request?: Request): Promise<void> {
  try {
    const ip_address = request?.headers.get('x-forwarded-for') || 'unknown';
    const user_agent = request?.headers.get('user-agent') || 'unknown';
    
    await supabase.from('security_audit_log').insert({
      event_type: event.event_type,
      user_id: event.user_id,
      ip_address,
      user_agent,
      details: event.details
    });
  } catch (logError) {
    console.error('Failed to log security event:', logError);
  }
}

async function authenticateUser(supabase: any, request: Request): Promise<{ user: any; error?: string }> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authentication required' };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { user: null, error: 'Invalid authentication' };
    }
    
    return { user };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IntelligenceRequest {
  query: string;
  context?: {
    county_fips?: string;
    soil_data?: any;
    user_location?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 30, 60000)) {
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      await logSecurityEvent(supabase, {
        event_type: 'rate_limit_exceeded',
        details: { endpoint: 'agricultural-intelligence', ip: clientIP },
        severity: 'medium'
      }, req);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Too many requests' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate user
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { user, error: authError } = await authenticateUser(supabase, req);
    
    if (!user) {
      await logSecurityEvent(supabase, {
        event_type: 'authentication_failure',
        details: { endpoint: 'agricultural-intelligence', error: authError },
        severity: 'medium'
      }, req);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { query, context }: IntelligenceRequest = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze the query to determine intent and extract parameters
    const intentAnalysis = await analyzeIntent(query, openAIApiKey);
    console.log('Intent analysis:', intentAnalysis);

    // Based on intent, call appropriate analytics functions and gather data
    const analyticsData = await gatherRelevantData(intentAnalysis, context, supabase);
    console.log('Analytics data gathered:', analyticsData);

    // Generate natural language response using analytics data
    const response = await generateIntelligentResponse(
      query,
      intentAnalysis,
      analyticsData,
      openAIApiKey
    );

    // Log successful request
    await logSecurityEvent(supabase, {
      event_type: 'successful_query',
      user_id: user.id,
      details: { 
        endpoint: 'agricultural-intelligence',
        intent: intentAnalysis.intent,
        confidence: intentAnalysis.confidence 
      },
      severity: 'low'
    }, req);

    return new Response(JSON.stringify({
      success: true,
      response: response.content,
      intent: intentAnalysis.intent,
      confidence: intentAnalysis.confidence,
      data_sources: analyticsData.sources
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      },
    });

  } catch (error) {
    console.error('Error in agricultural intelligence:', error);
    
    // Log security event for errors
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await logSecurityEvent(supabase, {
      event_type: 'function_error',
      details: { 
        endpoint: 'agricultural-intelligence', 
        sanitized_error: sanitizeError(error),
        timestamp: new Date().toISOString()
      },
      severity: 'high'
    }, req);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: sanitizeError(error)
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
    });
  }
});

async function analyzeIntent(query: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an agricultural AI assistant that analyzes user queries to determine intent and extract parameters. 
          
          Analyze the user's query and return a JSON object with:
          - intent: one of ["soil_analysis", "environmental_assessment", "planting_calendar", "water_quality", "fertilizer_recommendation", "general_question"]
          - confidence: number between 0-1
          - parameters: object with extracted parameters like county_fips, crop_type, etc.
          - requires_data: boolean indicating if specific data lookup is needed
          
          Focus on agricultural and farming-related queries. Be specific about the intent.`
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      intent: 'general_question',
      confidence: 0.5,
      parameters: {},
      requires_data: false
    };
  }
}

async function gatherRelevantData(intentAnalysis: any, context: any, supabase: any) {
  const data: any = { sources: [] };
  
  try {
    // Based on intent, call relevant edge functions
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

    // Always try to get enhanced satellite data if location available
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

    // Get live agricultural data for enhanced insights
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

async function generateIntelligentResponse(query: string, intent: any, analyticsData: any, apiKey: string) {
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

If asked about technical capabilities, explain how you combine satellite data with federal agricultural databases to provide comprehensive insights.`;

  // Prepare context with available data
  const dataContext = analyticsData ? `Available agricultural data:
${JSON.stringify(analyticsData, null, 2)}

Data sources used: ${analyticsData.sources?.length > 0 ? analyticsData.sources.join(', ') : 'General agricultural knowledge'}

IMPORTANT: ${analyticsData.live_agricultural_data?.sources ? 'This includes LIVE data from: ' + analyticsData.live_agricultural_data.sources.join(', ') : 'This uses cached or simulated data'}. Please indicate the data source and freshness in your response.` : 'No specific data available for this query.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: 'gpt-4o-mini'
  };
}