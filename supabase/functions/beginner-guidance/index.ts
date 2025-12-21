/**
 * Beginner Guidance API - /api/v2/beginner-guidance
 * Beginner-friendly, judgment-free plant guidance with progressive disclosure
 * 
 * Created: December 21, 2025
 * Consumer Pain Point Solution: Community Gatekeeping and Snobbery
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { trackOpenAICost } from '../_shared/cost-tracker.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

// Validation schema
const beginnerGuidanceSchema = z.object({
  plant_identification: z.string().min(1, 'Plant name or image is required'),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    county_fips: z.string().optional(),
    zip_code: z.string().optional(),
  }),
  user_expertise: z.enum(['beginner', 'intermediate', 'expert']).default('beginner'),
  intent: z.enum(['identification', 'care', 'problem_solving', 'landscaping', 'foraging_safety']),
  question: z.string().max(500).optional(),
  conversation_history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

// Jargon translations for beginners
const JARGON_TRANSLATIONS: Record<string, string> = {
  'perennial': 'comes back every year',
  'annual': 'lasts one growing season',
  'biennial': 'takes two years to complete its life cycle',
  'deciduous': 'loses its leaves in winter',
  'evergreen': 'keeps its leaves year-round',
  'hardiness zone': 'climate zone based on winter temperatures',
  'pH': 'soil acidity level',
  'NPK': 'the main nutrients plants need (nitrogen, phosphorus, potassium)',
  'chlorosis': 'yellowing of leaves',
  'necrosis': 'dead brown patches',
  'etiolation': 'stretched, leggy growth from lack of light',
  'dormancy': 'resting period, usually in winter',
  'cultivar': 'variety bred for specific traits',
  'genus': 'plant family group',
  'species': 'specific type within a family',
  'propagation': 'making new plants from an existing one',
  'deadheading': 'removing spent flowers',
  'mulching': 'covering soil to retain moisture and prevent weeds',
  'aeration': 'adding air to soil to help roots breathe',
  'photosynthesis': 'how plants make food from sunlight',
  'transpiration': 'how plants release water through leaves',
};

// Encouragement phrases
const ENCOURAGEMENTS = [
  "You're doing great paying attention to your plants!",
  "Great question! Every gardener wonders about this.",
  "The fact that you noticed this means you're becoming a better plant parent.",
  "Don't worry - this is totally fixable!",
  "Every experienced gardener started exactly where you are now.",
  "Your curiosity is the first step to having a thriving garden!",
  "You've got a good eye for detail - that's an important gardening skill!",
];

requestHandler({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: beginnerGuidanceSchema,
  rateLimit: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  handler: async ({ supabaseClient, user, validatedData }) => {
    const { 
      plant_identification, location, user_expertise, 
      intent, question, conversation_history 
    } = validatedData;
    const startTime = Date.now();

    logSafe('Generating beginner guidance', { intent, expertise: user_expertise });

    // Fetch location context
    const locationContext = await fetchLocationContext(supabaseClient, location);

    // Generate AI response with beginner-friendly tone
    const aiResponse = await generateBeginnerFriendlyResponse(
      plant_identification,
      intent,
      question,
      user_expertise,
      locationContext,
      conversation_history
    );

    // Transform response for beginner readability
    const transformedResponse = transformForExpertise(aiResponse, user_expertise);

    // Generate actionable tasks
    const actionableTasks = generateActionableTasks(transformedResponse, locationContext);

    // Generate follow-up prompts
    const followUpPrompts = generateFollowUpPrompts(intent, plant_identification);

    // Select random encouragement
    const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

    // Track cost
    await trackOpenAICost(supabaseClient, {
      model: 'gemini-2.5-flash',
      featureName: 'beginner-guidance',
      userId: user?.id,
      inputTokens: 500,
      outputTokens: 800,
    });

    // Calculate readability metrics
    const toneMetadata = {
      jargon_terms_simplified: countJargonSimplified(transformedResponse),
      reading_level: user_expertise === 'beginner' ? '6th grade' : '10th grade',
      estimated_read_time_seconds: Math.ceil(transformedResponse.full_content?.length / 200 * 60) || 30,
    };

    logSafe('Beginner guidance complete', { duration_ms: Date.now() - startTime });

    return {
      friendly_name: transformedResponse.friendly_name,
      one_sentence_summary: transformedResponse.one_sentence_summary,
      quick_facts: transformedResponse.quick_facts,
      local_relevance: {
        for_your_area: locationContext.zone_description || `Zone ${locationContext.hardiness_zone}`,
        current_status: transformedResponse.current_status,
        upcoming: transformedResponse.upcoming,
      },
      actionable_tasks: actionableTasks,
      potential_problems: transformedResponse.potential_problems,
      expandable_sections: transformedResponse.expandable_sections,
      follow_up_prompts: followUpPrompts,
      encouragement,
      tone_metadata: toneMetadata,
    };
  },
});

// Fetch location context
async function fetchLocationContext(supabase: any, location: any) {
  try {
    if (location.county_fips) {
      const { data: cached } = await supabase
        .from('fips_data_cache')
        .select('cached_data')
        .eq('county_fips', location.county_fips)
        .eq('data_source', 'environmental')
        .maybeSingle();

      if (cached?.cached_data) {
        return {
          hardiness_zone: cached.cached_data.hardiness_zone || '7a',
          zone_description: cached.cached_data.zone_description,
          climate_type: cached.cached_data.climate_type,
          current_season: getCurrentSeason(),
        };
      }
    }
  } catch (error) {
    logError('Failed to fetch location context', error);
  }

  return {
    hardiness_zone: '7a',
    zone_description: 'Moderate climate zone',
    climate_type: 'Temperate',
    current_season: getCurrentSeason(),
  };
}

// Generate beginner-friendly AI response
async function generateBeginnerFriendlyResponse(
  plant: string,
  intent: string,
  question: string | undefined,
  expertise: string,
  location: any,
  history?: any[]
) {
  const apiKey = Deno.env.get('LOVABLE_API_KEY') || Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('AI API key not configured');
  }

  const systemPrompt = `You are a friendly, patient gardening mentor who NEVER makes users feel stupid.

CRITICAL RULES:
1. NEVER say "obviously," "everyone knows," "simply," or "just"
2. NEVER assume prior knowledge - explain everything in plain language
3. ALWAYS validate the user's question as worthwhile
4. ALWAYS provide context for WHY something matters
5. Use everyday comparisons and analogies
6. End with encouragement
7. Keep answers concise but complete

USER EXPERTISE LEVEL: ${expertise}
${expertise === 'beginner' ? `
For beginners:
- Use 6th-grade reading level
- Replace ALL technical terms with simple explanations
- Use emojis sparingly for visual breaks
- Focus on the ONE most important thing first
- Provide step-by-step instructions when relevant
` : ''}

USER'S LOCATION:
- Hardiness Zone: ${location.hardiness_zone}
- Climate: ${location.climate_type}
- Current Season: ${location.current_season}

RESPOND IN THIS JSON FORMAT:
{
  "friendly_name": "Common name (simple description)",
  "one_sentence_summary": "What this plant is in one encouraging sentence",
  "quick_facts": [
    {"emoji": "🌿", "fact": "Simple fact 1"},
    {"emoji": "💧", "fact": "Simple fact 2"},
    {"emoji": "☀️", "fact": "Simple fact 3"}
  ],
  "current_status": "What the plant is doing right now based on season",
  "upcoming": "What to expect in the coming weeks",
  "main_answer": "Detailed but friendly answer to their question or intent",
  "potential_problems": [
    {
      "problem": "Common issue name",
      "likelihood": "low/medium/high",
      "prevention": "How to prevent it",
      "signs_to_watch": "What to look for"
    }
  ],
  "expandable_sections": [
    {
      "title": "Section title",
      "preview": "Brief preview text...",
      "full_content": "Complete detailed content",
      "complexity": "beginner/intermediate/advanced"
    }
  ]
}`;

  const userPrompt = question 
    ? `About ${plant}: ${question}`
    : `Tell me about ${plant} for ${intent} purposes.`;

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (history?.length) {
    messages.push(...history);
  }

  messages.push({ role: 'user', content: userPrompt });

  const isLovableAI = !!Deno.env.get('LOVABLE_API_KEY');
  const apiUrl = isLovableAI
    ? 'https://ai.gateway.lovable.dev/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: isLovableAI ? 'google/gemini-2.5-flash' : 'gpt-4o-mini',
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError('AI API error', { status: response.status, error: errorText });
    throw new Error(`AI guidance generation failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    logError('Failed to parse AI response', e);
  }

  // Fallback response
  return {
    friendly_name: plant,
    one_sentence_summary: `${plant} is a wonderful addition to any garden!`,
    quick_facts: [
      { emoji: '🌿', fact: 'Great choice for your garden' },
      { emoji: '💧', fact: 'Water when soil feels dry' },
      { emoji: '☀️', fact: 'Most plants love good light' },
    ],
    current_status: 'Healthy and growing',
    upcoming: 'Keep caring for it and watch it thrive!',
    main_answer: content,
    potential_problems: [],
    expandable_sections: [],
  };
}

// Transform response based on expertise level
function transformForExpertise(response: any, expertise: string) {
  if (expertise === 'expert') {
    return response;
  }

  // Replace jargon in all text fields
  const transformed = { ...response };

  if (response.main_answer) {
    transformed.full_content = replaceJargon(response.main_answer);
  }

  if (response.one_sentence_summary) {
    transformed.one_sentence_summary = replaceJargon(response.one_sentence_summary);
  }

  if (response.expandable_sections) {
    transformed.expandable_sections = response.expandable_sections.map((section: any) => ({
      ...section,
      full_content: replaceJargon(section.full_content || ''),
      preview: replaceJargon(section.preview || ''),
    }));
  }

  return transformed;
}

// Replace jargon with simple terms
function replaceJargon(text: string): string {
  let result = text;
  for (const [jargon, simple] of Object.entries(JARGON_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
    result = result.replace(regex, `${jargon} (${simple})`);
  }
  return result;
}

// Count jargon terms that were simplified
function countJargonSimplified(response: any): number {
  const text = JSON.stringify(response);
  let count = 0;
  for (const jargon of Object.keys(JARGON_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

// Generate actionable tasks
function generateActionableTasks(response: any, location: any) {
  const immediate: any[] = [];
  const upcoming: any[] = [];

  const season = location.current_season;
  const month = new Date().getMonth();

  // Add seasonal tasks
  if (season === 'spring') {
    upcoming.push({
      task: 'Begin fertilizing',
      when: 'When new growth appears',
      reason: 'Plants need nutrients to support spring growth',
    });
  } else if (season === 'fall') {
    upcoming.push({
      task: 'Reduce watering',
      when: 'As temperatures drop',
      reason: 'Plants slow down and need less water',
    });
  } else if (season === 'winter') {
    immediate.push({
      task: 'Check for dry soil',
      reason: 'Indoor heating dries out plants faster',
      how_to: 'Stick your finger 1 inch into soil - if dry, water thoroughly',
    });
  }

  // Add problem-based tasks
  if (response.potential_problems?.length) {
    for (const problem of response.potential_problems.slice(0, 2)) {
      if (problem.likelihood === 'high') {
        immediate.push({
          task: `Check for ${problem.problem}`,
          reason: problem.prevention,
          how_to: problem.signs_to_watch,
        });
      }
    }
  }

  return {
    immediate: immediate.slice(0, 3),
    upcoming: upcoming.slice(0, 3),
    create_reminders: true,
  };
}

// Generate follow-up prompts
function generateFollowUpPrompts(intent: string, plant: string): string[] {
  const basePrompts: Record<string, string[]> = {
    identification: [
      `What plants look good next to ${plant}?`,
      `Is ${plant} safe for pets?`,
      `How fast does ${plant} grow?`,
      `Can I grow ${plant} indoors?`,
    ],
    care: [
      `Why are my ${plant}'s leaves turning yellow?`,
      `How do I know when to repot my ${plant}?`,
      `What's the best fertilizer for ${plant}?`,
      `How do I propagate ${plant}?`,
    ],
    problem_solving: [
      `What pests commonly affect ${plant}?`,
      `How do I treat root rot?`,
      `Why is my ${plant} not flowering?`,
      `How can I revive a dying ${plant}?`,
    ],
    landscaping: [
      `What grows well with ${plant}?`,
      `How far apart should I plant ${plant}?`,
      `When is the best time to plant ${plant}?`,
      `How do I prepare soil for ${plant}?`,
    ],
    foraging_safety: [
      `Are there any poisonous lookalikes?`,
      `What parts of ${plant} are edible?`,
      `When is the best time to harvest ${plant}?`,
      `How do I store harvested ${plant}?`,
    ],
  };

  return basePrompts[intent] || basePrompts.care;
}

// Helper function
function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}
