/**
 * Seasonal Planning Assistant Function
 * Migrated to requestHandler: December 7, 2025 (Phase 3A.4)
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requestHandler } from '../_shared/request-handler.ts';
import { seasonalPlanningSchema } from '../_shared/validation.ts';
import { parseTQHeaders, hasTQHeaders } from '../_shared/turbo-quant.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

type SeasonalPlanningRequest = z.infer<typeof seasonalPlanningSchema>;

requestHandler<SeasonalPlanningRequest>({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: seasonalPlanningSchema,
  rateLimit: {
    requests: 50,  // 50 plans per hour
    windowMs: 60 * 60 * 1000,
  },
  handler: async ({ supabaseClient, user, validatedData, startTime, req }) => {
    const { location, soilData, planningType, cropPreferences, timeframe } = validatedData;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get weather data for the location
    const weatherData = await getWeatherData(location);

    const systemPrompt = getSeasonalPlanningSystemPrompt();
    const userPrompt = formatPlanningRequest(
      location, soilData, planningType, cropPreferences, timeframe, weatherData
    );

    // Model chain via Lovable AI Gateway: GPT-5.5 (primary) -> Gemini 2.5 Flash (fallback)
    const modelChain = ['openai/gpt-5.5', 'google/gemini-2.5-flash'];
    let planContent = '';
    let modelUsed = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let lastErrorText = '';

    for (let i = 0; i < modelChain.length; i++) {
      const model = modelChain[i];
      const isOpenAI = model.startsWith('openai/');
      const body: Record<string, unknown> = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      };
      // GPT-5 uses max_completion_tokens and only default temperature.
      if (isOpenAI) {
        body.max_completion_tokens = 1200;
      } else {
        body.max_tokens = 1200;
        body.temperature = 0.3;
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Lovable-API-Key': lovableApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        planContent = data.choices?.[0]?.message?.content ?? '';
        inputTokens = data.usage?.prompt_tokens || 0;
        outputTokens = data.usage?.completion_tokens || 0;
        modelUsed = model;
        break;
      }

      lastErrorText = await response.text();
      console.error(`Gateway error for ${model}:`, response.status, lastErrorText);

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again shortly.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits in workspace settings.');
      }
      // else fall through to next model
    }

    if (!modelUsed) {
      console.error('All Gateway models failed. Final error:', lastErrorText);
      throw new Error('AI service temporarily unavailable. Please try again later.');
    }

    const recommendations = { content: planContent, modelUsed };

    // Track cost via workspace credits (USD estimate).
    const costRates: Record<string, { input: number; output: number }> = {
      'openai/gpt-5.5': { input: 1.25, output: 10.00 },
      'google/gemini-2.5-flash': { input: 0.30, output: 2.50 },
    };
    const rates = costRates[modelUsed] || { input: 0.30, output: 2.50 };
    const costUsd = (inputTokens / 1_000_000 * rates.input) + (outputTokens / 1_000_000 * rates.output);

    await supabaseClient.from('cost_tracking').insert({
      service_provider: 'lovable-ai-gateway',
      service_type: modelUsed,
      feature_name: 'seasonal-planning-assistant',
      user_id: user.id,
      cost_usd: costUsd,
      usage_count: 1,
      request_details: {
        planning_type: planningType,
        timeframe: timeframe,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        duration_ms: Date.now() - startTime,
      },
    });


    const tqParams = parseTQHeaders(req);
    const tqActive = hasTQHeaders(req);

    return { 
      recommendations,
      weatherData: weatherData.summary,
      modelUsed,
      ...(tqActive && {
        turbo_quant: {
          active: true,
          context_mode: tqParams.contextMode,
          kv_cache_hint: tqParams.kvCacheHint,
          model_tier: tqParams.modelTier,
        },
      }),
    };
  },
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
- FIPS: ${location.fips_code || location.county_fips || 'Unknown'}
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
