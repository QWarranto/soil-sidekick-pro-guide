import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { location, soilData, planningType, cropPreferences, timeframe } = await req.json();

    if (!location || !planningType) {
      throw new Error('Missing required parameters: location and planningType');
    }

    // Try GPT-5 first, fall back to GPT-4o
    const openaiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('GPT5_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get weather data for the location
    const weatherData = await getWeatherData(location);
    
    let recommendations;
    try {
      recommendations = await generatePlanWithGPT5(
        location, soilData, planningType, cropPreferences, timeframe, weatherData, openaiKey
      );
    } catch (gpt5Error) {
      console.log('GPT-5 failed, falling back to GPT-4o:', gpt5Error);
      recommendations = await generatePlanWithGPT4(
        location, soilData, planningType, cropPreferences, timeframe, weatherData, openaiKey
      );
    }

    return new Response(JSON.stringify({ 
      success: true, 
      recommendations,
      weatherData: weatherData.summary,
      modelUsed: recommendations.modelUsed || 'gpt-4o' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in seasonal-planning-assistant:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getWeatherData(location: any) {
  // Mock weather data - in production, integrate with weather API
  const currentMonth = new Date().getMonth();
  const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
  const currentSeason = seasons[Math.floor(currentMonth / 3)];
  
  return {
    summary: {
      currentSeason,
      temperature: `${45 + Math.floor(Math.random() * 40)}°F average`,
      rainfall: `${20 + Math.floor(Math.random() * 15)} inches annually`,
      frostDates: {
        lastSpring: 'April 15',
        firstFall: 'October 15'
      },
      growingSeason: '180 days',
      zone: `USDA Zone ${5 + Math.floor(Math.random() * 4)}`
    },
    monthly: generateMonthlyData()
  };
}

function generateMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    avgTemp: 30 + Math.floor(Math.random() * 50),
    rainfall: Math.floor(Math.random() * 5) + 1,
    plantingWindow: Math.random() > 0.5
  }));
}

async function generatePlanWithGPT5(
  location: any, soilData: any, planningType: string, 
  cropPreferences: any, timeframe: string, weatherData: any, apiKey: string
) {
  const systemPrompt = getSeasonalPlanningSystemPrompt();
  const userPrompt = formatPlanningRequest(location, soilData, planningType, cropPreferences, timeframe, weatherData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1200
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT-5 API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: 'gpt-5-turbo'
  };
}

async function generatePlanWithGPT4(
  location: any, soilData: any, planningType: string, 
  cropPreferences: any, timeframe: string, weatherData: any, apiKey: string
) {
  const systemPrompt = getSeasonalPlanningSystemPrompt();
  const userPrompt = formatPlanningRequest(location, soilData, planningType, cropPreferences, timeframe, weatherData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1200
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT-4o API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: 'gpt-4o'
  };
}

function getSeasonalPlanningSystemPrompt(): string {
  return `You are an expert agricultural consultant specializing in seasonal crop planning and rotation strategies.

Generate comprehensive seasonal planning recommendations that include:

1. **Crop Rotation Plan** (specific 3-4 year rotation sequence)
2. **Seasonal Timeline** (month-by-month planting/harvesting schedule)
3. **Soil Management** (cover crops, amendments, rest periods)
4. **Weather Considerations** (frost protection, irrigation planning)
5. **Economic Optimization** (market timing, input costs)
6. **Sustainability Practices** (biodiversity, soil health, water conservation)

Format your response with clear sections using markdown headers. Include specific dates, crop varieties, and actionable steps. Consider regional growing conditions, soil health, and market factors.

Focus on practical, implementable advice that maximizes both yield and soil health while managing risk through diversification.`;
}

function formatPlanningRequest(
  location: any, soilData: any, planningType: string, 
  cropPreferences: any, timeframe: string, weatherData: any
): string {
  return `
LOCATION DETAILS:
- County: ${location.county_name}, ${location.state_code}
- FIPS: ${location.fips_code}
- USDA Zone: ${weatherData.summary.zone}
- Growing Season: ${weatherData.summary.growingSeason}
- Last Spring Frost: ${weatherData.summary.frostDates.lastSpring}
- First Fall Frost: ${weatherData.summary.frostDates.firstFall}

SOIL CONDITIONS:
${soilData ? `
- pH Level: ${soilData.ph_level || 'Unknown'}
- Organic Matter: ${soilData.organic_matter || 'Unknown'}%
- Nitrogen: ${soilData.nitrogen_level || 'Unknown'}
- Phosphorus: ${soilData.phosphorus_level || 'Unknown'}
- Potassium: ${soilData.potassium_level || 'Unknown'}
- Current Recommendations: ${soilData.recommendations || 'None'}
` : 'No soil data available - provide general recommendations'}

PLANNING REQUEST:
- Planning Type: ${planningType}
- Timeframe: ${timeframe}
- Crop Preferences: ${JSON.stringify(cropPreferences || {})}

WEATHER CONTEXT:
- Current Season: ${weatherData.summary.currentSeason}
- Average Temperature: ${weatherData.summary.temperature}
- Annual Rainfall: ${weatherData.summary.rainfall}

Please provide a detailed seasonal planning strategy that maximizes productivity while maintaining soil health.
`;
}