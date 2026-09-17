/**
 * Cost Tracking Utilities
 * Integrates cost tracking for all external API calls
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

// Cost rates per provider (updated as of 2025)
export const COST_RATES = {
  openai: {
    'gpt-5-mini': { input: 0.0001, output: 0.0002 }, // per 1K tokens
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'vision-analysis': 0.50,
    'embeddings': 0.0001,
  },
  usda: {
    'soil-data-access': 0, // Free API
    'nass-api': 0, // Free with key
  },
  epa: {
    'water-quality': 0, // Free API
    'air-quality': 0,
  },
  google_earth: {
    'earth-engine': 0.08, // per processing unit
    'api-request': 0.01,
  },
  noaa: {
    'weather-api': 0, // Free API
  },
  census: {
    'api-request': 0, // Free API
  },
  supabase: {
    'database-query': 0.0001,
    'function-invocation': 0.00002,
    'storage-gb': 0.021,
  },
};

export interface CostTrackingOptions {
  provider: keyof typeof COST_RATES;
  serviceType: string;
  featureName: string;
  userId?: string;
  inputTokens?: number;
  outputTokens?: number;
  usageAmount?: number;
  requestDetails?: any;
}

/**
 * Track cost for an external API call
 */
export async function trackCost(
  supabase: any,
  options: CostTrackingOptions
): Promise<{ success: boolean; cost_usd: number }> {
  try {
    const { provider, serviceType, featureName, userId, inputTokens, outputTokens, usageAmount, requestDetails } = options;

    // Calculate cost
    let cost_usd = 0;
    const serviceRates = COST_RATES[provider];

    if (serviceRates) {
      const rate = serviceRates[serviceType as keyof typeof serviceRates];
      
      if (typeof rate === 'number') {
        // Simple per-request pricing
        cost_usd = rate * (usageAmount || 1);
      } else if (typeof rate === 'object' && 'input' in rate) {
        // Token-based pricing (OpenAI models)
        const inputCost = (inputTokens || 0) / 1000 * rate.input;
        const outputCost = (outputTokens || 0) / 1000 * rate.output;
        cost_usd = inputCost + outputCost;
      }
    }

    // Track in database
    const { error } = await supabase.from('cost_tracking').insert({
      service_provider: provider,
      service_type: serviceType,
      feature_name: featureName,
      cost_usd,
      usage_count: 1,
      user_id: userId,
      request_details: {
        ...requestDetails,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        usage_amount: usageAmount,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('[COST] Failed to track cost:', error);
      return { success: false, cost_usd };
    }

    console.log(`[COST] Tracked $${cost_usd.toFixed(6)} for ${provider}/${serviceType}`);
    return { success: true, cost_usd };
  } catch (error) {
    console.error('[COST] Cost tracking error:', error);
    return { success: false, cost_usd: 0 };
  }
}

/**
 * Track OpenAI API call with token counts
 */
export async function trackOpenAICost(
  supabase: any,
  {
    model,
    featureName,
    userId,
    inputTokens,
    outputTokens,
  }: {
    model: string;
    featureName: string;
    userId?: string;
    inputTokens: number;
    outputTokens: number;
  }
): Promise<{ success: boolean; cost_usd: number }> {
  return trackCost(supabase, {
    provider: 'openai',
    serviceType: model,
    featureName,
    userId,
    inputTokens,
    outputTokens,
  });
}

/**
 * Track external API call (EPA, USDA, etc.)
 */
export async function trackExternalAPICost(
  supabase: any,
  {
    provider,
    endpoint,
    featureName,
    userId,
    usageAmount = 1,
  }: {
    provider: 'epa' | 'usda' | 'google_earth' | 'noaa' | 'census';
    endpoint: string;
    featureName: string;
    userId?: string;
    usageAmount?: number;
  }
): Promise<{ success: boolean; cost_usd: number }> {
  return trackCost(supabase, {
    provider,
    serviceType: endpoint,
    featureName,
    userId,
    usageAmount,
  });
}

/**
 * Get cost summary for a user
 */
export async function getUserCostSummary(
  supabase: any,
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  total_cost: number;
  by_provider: Record<string, number>;
  by_feature: Record<string, number>;
}> {
  try {
    const query = supabase
      .from('cost_tracking')
      .select('service_provider, feature_name, cost_usd')
      .eq('user_id', userId);

    if (startDate) {
      query.gte('date_bucket', startDate);
    }
    if (endDate) {
      query.lte('date_bucket', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const summary = {
      total_cost: 0,
      by_provider: {} as Record<string, number>,
      by_feature: {} as Record<string, number>,
    };

    for (const row of data || []) {
      summary.total_cost += row.cost_usd;
      summary.by_provider[row.service_provider] = (summary.by_provider[row.service_provider] || 0) + row.cost_usd;
      summary.by_feature[row.feature_name] = (summary.by_feature[row.feature_name] || 0) + row.cost_usd;
    }

    return summary;
  } catch (error) {
    console.error('[COST] Failed to get cost summary:', error);
    return { total_cost: 0, by_provider: {}, by_feature: {} };
  }
}
