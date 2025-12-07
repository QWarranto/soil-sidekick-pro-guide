/**
 * GPT-5 Chat Function
 * Migrated to requestHandler: December 7, 2025 (Phase 3A.2)
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requestHandler } from '../_shared/request-handler.ts';
import { gpt5ChatSchema } from '../_shared/validation.ts';
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
  handler: async ({ supabaseClient, user, validatedData, startTime }) => {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { messages, temperature, max_tokens, stream } = validatedData;

    console.log('GPT-5 Chat request from user:', user.id);
    console.log('Messages:', messages.length);

    // Try GPT-5 first
    let response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens,
        stream: stream,
      }),
    });

    let modelUsed = 'gpt-5-mini';
    let fallbackNote: string | undefined;

    // Fallback to GPT-4o if GPT-5 is not available
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 404 || errorData.includes('model')) {
        console.log('GPT-5 not available, falling back to GPT-4o');
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
            temperature: temperature,
            max_tokens: max_tokens,
            stream: stream,
          }),
        });

        if (!response.ok) {
          // Try GPT-4o-mini as final fallback
          console.log('GPT-4o failed, falling back to GPT-4o-mini');
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: messages,
              temperature: temperature,
              max_tokens: max_tokens,
              stream: stream,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${await response.text()}`);
          }
          modelUsed = 'gpt-4o-mini';
          fallbackNote = 'GPT-5 and GPT-4o not available, used GPT-4o-mini';
        } else {
          modelUsed = 'gpt-4o';
          fallbackNote = 'GPT-5 not available, used GPT-4o instead';
        }
      } else {
        throw new Error(`OpenAI API error: ${errorData}`);
      }
    }

    const data = await response.json();
    
    // Track cost in cost_tracking table
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    
    // Cost rates per 1M tokens (approximate)
    const costRates: Record<string, { input: number; output: number }> = {
      'gpt-5-mini': { input: 0.15, output: 0.60 },
      'gpt-4o': { input: 2.50, output: 10.00 },
      'gpt-4o-mini': { input: 0.15, output: 0.60 },
    };
    
    const rates = costRates[modelUsed] || costRates['gpt-4o-mini'];
    const costUsd = (inputTokens / 1_000_000 * rates.input) + (outputTokens / 1_000_000 * rates.output);

    await supabaseClient.from('cost_tracking').insert({
      service_provider: 'openai',
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

    // Log usage for analytics
    console.log('GPT-5 response generated:', {
      userId: user.id,
      model: modelUsed,
      tokens: data.usage?.total_tokens || 0,
      cost_usd: costUsd.toFixed(6),
    });

    return {
      ...data,
      model_used: modelUsed,
      note: fallbackNote,
    };
  },
});
