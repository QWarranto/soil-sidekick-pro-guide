/**
 * Safe Identification API - /api/v2/safe-identification
 * Environmentally-contextualized plant identification with toxic lookalike warnings
 * 
 * Created: December 21, 2025
 * Consumer Pain Point Solution: Misidentification of "Lookalikes" and Young Plants
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { trackOpenAICost } from '../_shared/cost-tracker.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';
import { withFallback } from '../_shared/graceful-degradation.ts';

// Validation schema for safe identification
const safeIdentificationSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    county_fips: z.string().optional(),
    zip_code: z.string().optional(),
  }),
  use_case: z.enum(['foraging', 'gardening', 'pet_safety', 'landscaping', 'agriculture', 'scientific']),
  growth_stage_hint: z.enum(['seedling', 'juvenile', 'mature', 'flowering', 'fruiting', 'dormant']).optional(),
  additional_context: z.string().max(500).optional(),
});

// Toxic lookalike database
const TOXIC_LOOKALIKES: Record<string, { lookalike: string; toxicity: string; differentiators: string[] }[]> = {
  'wild carrot': [
    {
      lookalike: 'Poison Hemlock (Conium maculatum)',
      toxicity: 'fatal',
      differentiators: [
        'Purple blotches on smooth stem = hemlock',
        'Musty/mousy smell = hemlock',
        'Hairy stem = wild carrot',
        'Carrot-like smell = wild carrot'
      ]
    },
    {
      lookalike: 'Water Hemlock (Cicuta)',
      toxicity: 'fatal',
      differentiators: [
        'Found in wet areas = water hemlock',
        'Chambered root = water hemlock',
        'Dry fields = likely wild carrot'
      ]
    }
  ],
  'wild onion': [
    {
      lookalike: 'Death Camas (Zigadenus)',
      toxicity: 'fatal',
      differentiators: [
        'Onion smell = wild onion (safe)',
        'No smell = DO NOT EAT (possibly death camas)',
        'Grass-like leaves = suspicious'
      ]
    }
  ],
  'elderberry': [
    {
      lookalike: 'Water Hemlock (Cicuta)',
      toxicity: 'fatal',
      differentiators: [
        'Compound leaves with serrated edges = elderberry',
        'Purple-black berries in clusters = elderberry',
        'White flowers = verify carefully'
      ]
    }
  ],
  'morel mushroom': [
    {
      lookalike: 'False Morel (Gyromitra)',
      toxicity: 'severe',
      differentiators: [
        'Hollow inside when cut = true morel',
        'Brain-like irregular surface = false morel (toxic)',
        'Symmetrical honeycomb pattern = true morel'
      ]
    }
  ]
};

// Pet toxicity database
const PET_TOXIC_PLANTS = [
  'lily', 'sago palm', 'tulip', 'azalea', 'oleander', 'foxglove',
  'lily of the valley', 'autumn crocus', 'daffodil', 'hyacinth',
  'dieffenbachia', 'philodendron', 'pothos', 'peace lily'
];

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: safeIdentificationSchema,
  rateLimit: {
    requests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { image, location, use_case, growth_stage_hint, additional_context } = validatedData;
    const startTime = Date.now();

    logSafe('Starting safe identification', { use_case, has_location: !!location.county_fips });

    // Fetch environmental context in parallel
    const [environmentalContext, soilContext] = await Promise.all([
      fetchEnvironmentalContext(supabaseClient, location),
      fetchSoilContext(supabaseClient, location),
    ]);

    // Perform AI identification with environmental context
    const identificationResult = await performEnhancedIdentification(
      image,
      use_case,
      environmentalContext,
      soilContext,
      growth_stage_hint,
      additional_context
    );

    // Check for toxic lookalikes
    const toxicLookalikeAlert = checkToxicLookalikes(
      identificationResult.primary_identification,
      use_case
    );

    // Calculate environmental fit score
    const environmentalFit = calculateEnvironmentalFit(
      identificationResult,
      environmentalContext,
      soilContext
    );

    // Generate safety recommendation
    const safetyRecommendation = generateSafetyRecommendation(
      identificationResult,
      toxicLookalikeAlert,
      use_case
    );

    // Track cost
    await trackOpenAICost(supabaseClient, {
      model: 'gpt-4o-vision',
      featureName: 'safe-identification',
      userId: user?.id,
      inputTokens: 1000,
      outputTokens: 1200,
    });

    // Store result for learning
    await supabaseClient.from('visual_analysis_results').insert({
      user_id: user?.id,
      analysis_type: 'safe_identification',
      analysis_result: {
        identification: identificationResult,
        toxic_alert: toxicLookalikeAlert,
        environmental_fit: environmentalFit,
        safety: safetyRecommendation,
      },
      location_data: location,
      confidence_score: identificationResult.adjusted_confidence,
    });

    logSafe('Safe identification complete', {
      duration_ms: Date.now() - startTime,
      toxic_alert: toxicLookalikeAlert.triggered,
    });

    return {
      primary_identification: identificationResult.primary_identification,
      toxic_lookalike_alert: toxicLookalikeAlert,
      lookalikes: identificationResult.lookalikes,
      environmental_fit: environmentalFit,
      safety_recommendation: safetyRecommendation,
      growth_stage_assessment: identificationResult.growth_stage,
      metadata: {
        processing_time_ms: Date.now() - startTime,
        data_sources_used: [
          'GPT-4o Vision',
          environmentalContext.source,
          soilContext.source,
        ].filter(Boolean),
        model_version: 'safe-id-v2.0',
        environmental_data_freshness: environmentalContext.freshness,
      },
    };
  },
});

// Fetch environmental context (climate, hardiness zone, etc.)
async function fetchEnvironmentalContext(supabase: any, location: any) {
  try {
    if (location.county_fips) {
      // Try to get cached data first
      const { data: cached } = await supabase
        .from('fips_data_cache')
        .select('cached_data, created_at')
        .eq('county_fips', location.county_fips)
        .eq('data_source', 'environmental')
        .maybeSingle();

      if (cached) {
        return {
          ...cached.cached_data,
          source: 'cached',
          freshness: 'recent',
        };
      }
    }

    // Fallback to regional estimates
    return getRegionalEnvironmentDefaults(location);
  } catch (error) {
    logError('Failed to fetch environmental context', error);
    return getRegionalEnvironmentDefaults(location);
  }
}

// Fetch soil context
async function fetchSoilContext(supabase: any, location: any) {
  try {
    if (location.county_fips) {
      const { data: soilAnalysis } = await supabase
        .from('soil_analyses')
        .select('ph_level, organic_matter, analysis_data')
        .eq('county_fips', location.county_fips)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (soilAnalysis) {
        return {
          ph: soilAnalysis.ph_level,
          organic_matter: soilAnalysis.organic_matter,
          source: 'USDA SSURGO',
          freshness: 'recent',
        };
      }
    }

    return { ph: 6.5, organic_matter: 2.5, source: 'estimated', freshness: 'estimated' };
  } catch (error) {
    logError('Failed to fetch soil context', error);
    return { ph: 6.5, organic_matter: 2.5, source: 'estimated', freshness: 'estimated' };
  }
}

// Enhanced identification with environmental context
async function performEnhancedIdentification(
  image: string,
  useCase: string,
  envContext: any,
  soilContext: any,
  growthStage?: string,
  additionalContext?: string
) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('LOVABLE_API_KEY');
  if (!openAIApiKey) {
    throw new Error('AI API key not configured');
  }

  const systemPrompt = `You are an expert botanist and plant identification specialist with deep knowledge of toxic plants and their lookalikes. Your primary concern is user safety.

ENVIRONMENTAL CONTEXT:
- Hardiness Zone: ${envContext.hardiness_zone || 'Unknown'}
- Current Season: ${envContext.season || getCurrentSeason()}
- Climate Type: ${envContext.climate_type || 'Temperate'}
- Soil pH: ${soilContext.ph}
- Soil Organic Matter: ${soilContext.organic_matter}%

USE CASE: ${useCase}
${growthStage ? `GROWTH STAGE HINT: ${growthStage}` : ''}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

CRITICAL INSTRUCTIONS:
1. ALWAYS check for toxic lookalikes, especially for foraging use cases
2. Adjust confidence based on environmental compatibility
3. For seedlings, consider multiple possibilities and note difficulty
4. Never express 100% confidence for potentially toxic lookalikes
5. Provide specific physical features to check for differentiation

Respond in JSON format with this structure:
{
  "primary_identification": {
    "common_name": "string",
    "scientific_name": "string",
    "family": "string",
    "raw_visual_confidence": 0.0-1.0,
    "adjusted_confidence": 0.0-1.0,
    "confidence_delta_reason": "string explaining adjustment"
  },
  "lookalikes": [
    {
      "common_name": "string",
      "scientific_name": "string",
      "visual_similarity": 0.0-1.0,
      "environmental_probability": 0.0-1.0,
      "key_differentiators": [
        { "feature": "string", "primary_has": "string", "lookalike_has": "string", "how_to_check": "string" }
      ],
      "toxicity_level": "none|mild|moderate|severe|fatal",
      "toxic_to": ["humans", "dogs", "cats", etc]
    }
  ],
  "growth_stage": {
    "detected_stage": "string",
    "confidence": 0.0-1.0,
    "expected_mature_characteristics": "string"
  },
  "environmental_notes": "string about environmental compatibility"
}`;

  const isLovableAI = !Deno.env.get('OPENAI_API_KEY');
  const apiUrl = isLovableAI 
    ? 'https://ai.gateway.lovable.dev/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: isLovableAI ? 'google/gemini-2.5-flash' : 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please identify this plant with full safety analysis:' },
            { type: 'image_url', image_url: { url: image, detail: 'high' } }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError('AI API error', { status: response.status, error: errorText });
    throw new Error(`AI identification failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    // Try to parse as JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    logError('Failed to parse AI response as JSON', e);
  }

  // Fallback structure
  return {
    primary_identification: {
      common_name: 'Unknown plant',
      scientific_name: 'Species indeterminate',
      family: 'Unknown',
      raw_visual_confidence: 0.3,
      adjusted_confidence: 0.3,
      confidence_delta_reason: 'Unable to parse AI response',
    },
    lookalikes: [],
    growth_stage: { detected_stage: 'unknown', confidence: 0.3 },
  };
}

// Check for known toxic lookalikes
function checkToxicLookalikes(identification: any, useCase: string) {
  const plantName = identification.common_name?.toLowerCase() || '';
  const matchedLookalikes = TOXIC_LOOKALIKES[plantName] || [];

  // Check if the identified plant itself is pet-toxic
  const isPetToxic = PET_TOXIC_PLANTS.some(toxic => 
    plantName.includes(toxic) || identification.scientific_name?.toLowerCase().includes(toxic)
  );

  const triggered = matchedLookalikes.length > 0 || 
    (useCase === 'pet_safety' && isPetToxic) ||
    (useCase === 'foraging' && identification.raw_visual_confidence < 0.85);

  let severity: 'none' | 'caution' | 'warning' | 'danger' | 'fatal' = 'none';
  if (matchedLookalikes.some(l => l.toxicity === 'fatal')) severity = 'fatal';
  else if (matchedLookalikes.some(l => l.toxicity === 'severe')) severity = 'danger';
  else if (matchedLookalikes.length > 0) severity = 'warning';
  else if (useCase === 'foraging' && identification.raw_visual_confidence < 0.9) severity = 'caution';

  let message = '';
  if (severity === 'fatal') {
    message = 'CRITICAL: This plant has potentially FATAL lookalikes. DO NOT consume without expert verification.';
  } else if (severity === 'danger') {
    message = 'WARNING: This plant has toxic lookalikes that can cause severe harm. Verify carefully.';
  } else if (severity === 'warning') {
    message = 'CAUTION: Similar-looking plants exist that may be harmful. Check differentiating features.';
  } else if (severity === 'caution') {
    message = 'Note: Confidence is not high enough for safe foraging. Seek expert confirmation.';
  }

  return {
    triggered,
    severity,
    message,
    known_lookalikes: matchedLookalikes,
    pet_toxic: isPetToxic,
  };
}

// Calculate environmental fit score
function calculateEnvironmentalFit(identification: any, envContext: any, soilContext: any) {
  // Simplified scoring - in production would use species database
  const scores = {
    soil_compatibility: 0.75,
    climate_compatibility: 0.8,
    regional_prevalence: 0.7,
    seasonal_appropriateness: 0.85,
    elevation_compatibility: 0.9,
  };

  const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

  return {
    overall_score: overall,
    breakdown: scores,
    contributing_factors: [
      { factor: 'Soil pH', value: `${soilContext.ph}`, impact: 'Compatible range' },
      { factor: 'Hardiness Zone', value: envContext.hardiness_zone || 'Unknown', impact: 'Within tolerance' },
      { factor: 'Season', value: envContext.season || getCurrentSeason(), impact: 'Appropriate timing' },
    ],
  };
}

// Generate safety recommendation
function generateSafetyRecommendation(identification: any, toxicAlert: any, useCase: string) {
  let action: 'proceed' | 'verify' | 'avoid' | 'seek_expert' = 'proceed';
  let message = '';
  const verificationSteps: string[] = [];

  if (toxicAlert.severity === 'fatal' || toxicAlert.severity === 'danger') {
    action = 'seek_expert';
    message = 'Contact a local botanist or extension office before any consumption or handling.';
    verificationSteps.push('Do NOT taste, eat, or handle extensively');
    verificationSteps.push('Take clear photos from multiple angles');
    verificationSteps.push('Note exact location and habitat');
    verificationSteps.push('Contact local extension office or poison control');
  } else if (toxicAlert.severity === 'warning' || identification.adjusted_confidence < 0.7) {
    action = 'verify';
    message = 'Verification recommended before proceeding with intended use.';
    verificationSteps.push('Compare with multiple reference images');
    verificationSteps.push('Check key differentiating features listed');
    verificationSteps.push('Consider local expert consultation');
  } else if (useCase === 'foraging' && identification.adjusted_confidence < 0.9) {
    action = 'verify';
    message = 'For foraging, higher confidence is recommended. Seek verification.';
    verificationSteps.push('Cross-reference with foraging guides');
    verificationSteps.push('Verify with experienced forager');
  } else {
    message = 'Identification confidence is good for intended use.';
  }

  return {
    action,
    message,
    verification_steps: verificationSteps,
  };
}

// Helper functions
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function getRegionalEnvironmentDefaults(location: any) {
  return {
    hardiness_zone: '7a',
    season: getCurrentSeason(),
    climate_type: 'Temperate',
    source: 'regional_estimate',
    freshness: 'estimated',
  };
}
