/**
 * GPT-5 Chat Function
 * Migrated to requestHandler: December 7, 2025 (Phase 3A.2)
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requestHandler } from '../_shared/request-handler.ts';
import { gpt5ChatSchema } from '../_shared/validation.ts';
import { parseTQHeaders, hasTQHeaders } from '../_shared/turbo-quant.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

type ChatRequest = z.infer<typeof gpt5ChatSchema>;

requestHandler<ChatRequest>({
  requireAuth: true,
  requireSubscription: true,
  validationSchema: gpt5ChatSchema,
  rateLimit: {
    requests: 500,  // Professional tier: 500/hour
    windowMs: 60 * 60 * 1000,
  },
  handler: async ({ supabaseClient, user, validatedData, startTime, req }) => {
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { messages, temperature, max_tokens } = validatedData;

    console.log('GPT-5 Chat request from user:', user.id, 'messages:', messages.length);

    // Model chain: primary -> Gemini fallback (via Lovable AI Gateway).
    // Streaming disabled here; response is aggregated JSON for existing clients.
    const modelChain = ['openai/gpt-5.5', 'google/gemini-2.5-flash'];

    let response: Response | null = null;
    let modelUsed = '';
    let fallbackNote: string | undefined;
    let lastErrorText = '';

    for (let i = 0; i < modelChain.length; i++) {
      const model = modelChain[i];
      const isOpenAI = model.startsWith('openai/');
      const body: Record<string, unknown> = {
        model,
        messages,
        stream: false,
      };
      // GPT-5 family uses max_completion_tokens; Gemini uses max_tokens.
      if (max_tokens != null) {
        body[isOpenAI ? 'max_completion_tokens' : 'max_tokens'] = max_tokens;
      }
      // GPT-5 reasoning models only support default temperature; skip param for them.
      if (temperature != null && !isOpenAI) {
        body.temperature = temperature;
      }

      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Lovable-API-Key': lovableApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        modelUsed = model;
        if (i > 0) fallbackNote = `Primary model unavailable, used ${model}`;
        break;
      }

      lastErrorText = await response.text();
      console.error(`Gateway error for ${model}:`, response.status, lastErrorText);

      // Terminal (non-retryable) unless it's rate-limit/credits — surface those directly.
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again shortly.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits in workspace settings.');
      }
      // Otherwise, try next model in the chain.
    }

    if (!response || !response.ok) {
      console.error('All Gateway models failed. Final error:', lastErrorText);
      throw new Error('AI service temporarily unavailable. Please try again later.');
    }

    const data = await response.json();

    // Track cost via workspace credits (USD estimate). Gateway is billed in credits.
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const costRates: Record<string, { input: number; output: number }> = {
      'openai/gpt-5.5': { input: 1.25, output: 10.00 },
      'google/gemini-2.5-flash': { input: 0.30, output: 2.50 },
    };
    const rates = costRates[modelUsed] || { input: 0.30, output: 2.50 };
    const costUsd = (inputTokens / 1_000_000 * rates.input) + (outputTokens / 1_000_000 * rates.output);

    await supabaseClient.from('cost_tracking').insert({
      service_provider: 'lovable-ai-gateway',
      service_type: modelUsed,
      feature_name: 'gpt5-chat',
      user_id: user.id,
      cost_usd: costUsd,
      usage_count: 1,
      request_details: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: data.usage?.total_tokens || 0,
        duration_ms: Date.now() - startTime,
      },
    });

    console.log('Gateway chat response:', {
      userId: user.id,
      model: modelUsed,
      tokens: data.usage?.total_tokens || 0,
      cost_usd: costUsd.toFixed(6),
    });

    // Include TurboQuant metadata if client sent TQ headers
    const tqParams = parseTQHeaders(req);
    const tqActive = hasTQHeaders(req);

    return {
      ...data,
      model_used: modelUsed,
      note: fallbackNote,
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
