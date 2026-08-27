/**
 * LLM Router — Unified OpenRouter client for all LeafEngines edge functions.
 *
 * Replaces per-function inline fetch logic + Lovable fallback.
 * Standardizes: auth headers, error handling, retry, model defaults, cost hook.
 *
 * Created: 2026-06-04 — Part of L2 AI Gateway → OpenRouter migration.
 */

import { logSafe, logError } from './logging-utils.ts';

// ── Config ──────────────────────────────────────────────────────────

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_REFERER = 'https://app.soilsidekickpro.com';
const DEFAULT_TITLE = 'Soil Sidekick Pro';

const DEFAULT_TEXT_MODEL = 'google/gemini-2.5-flash';
const DEFAULT_IMAGE_MODEL = 'google/gemini-2.5-flash-image';

// Retry config
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// ── Types ───────────────────────────────────────────────────────────

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface LLMRequestOptions {
  model?: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  modalities?: ('text' | 'image')[];
  stream?: boolean;
  featureName?: string; // for logging + cost tracking
  userId?: string;
}

export interface LLMResponse {
  content: string;
  modelUsed: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  images?: Array<{ image_url: { url: string } }>;
  raw: any;
}

export interface LLMStreamChunk {
  choices: Array<{ delta: { content?: string }; finish_reason?: string | null }>;
}

// ── Core ────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = Deno.env.get('OPENROUTER_API_KEY');
  if (!key) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  return key;
}

function buildHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': Deno.env.get('OPENROUTER_HTTP_REFERER') || DEFAULT_REFERER,
    'X-Title': Deno.env.get('OPENROUTER_X_TITLE') || DEFAULT_TITLE,
  };
}

/**
 * Call OpenRouter chat completions. Handles retries, errors, JSON parsing.
 */
export async function callLLM(options: LLMRequestOptions): Promise<LLMResponse> {
  const startTime = performance.now();
  const model = options.model || DEFAULT_TEXT_MODEL;

  const body: Record<string, any> = {
    model,
    messages: options.messages,
  };

  if (options.temperature !== undefined) body.temperature = options.temperature;
  if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens;
  if (options.modalities) body.modalities = options.modalities;
  if (options.stream) body.stream = true;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
        logSafe('LLM retry', { attempt, feature: options.featureName, model });
      }

      const response = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });

      const duration = performance.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        logError('LLM API error', {
          status: response.status,
          feature: options.featureName,
          model,
          attempt,
          error: errorText.substring(0, 500),
        });

        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`LLM ${response.status}: ${errorText}`);
          continue; // retry
        }

        // Non-retryable (4xx except 429)
        throw new Error(`LLM API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      const content = data.choices?.[0]?.message?.content || '';
      const images = data.choices?.[0]?.message?.images;
      const usage = data.usage;

      logSafe('LLM success', {
        feature: options.featureName,
        model,
        duration_ms: Math.round(duration),
        tokens: usage?.total_tokens,
      });

      return {
        content,
        modelUsed: model,
        usage,
        images,
        raw: data,
      };

    } catch (err: any) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        logSafe('LLM attempt failed, will retry', {
          feature: options.featureName,
          attempt,
          error: err.message,
        });
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error('LLM call failed after retries');
}

// ── Streaming variant (returns AsyncGenerator) ─────────────────────

export async function* streamLLM(options: LLMRequestOptions): AsyncGenerator<LLMStreamChunk> {
  const model = options.model || DEFAULT_TEXT_MODEL;

  const body: Record<string, any> = {
    model,
    messages: options.messages,
    stream: true,
  };
  if (options.temperature !== undefined) body.temperature = options.temperature;
  if (options.max_tokens !== undefined) body.max_tokens = options.max_tokens;

  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM stream error ${response.status}: ${errorText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

    for (const line of lines) {
      const data = line.replace(/^data:\s*/, '');
      if (data === '[DONE]') return;

      try {
        const parsed: LLMStreamChunk = JSON.parse(data);
        if (parsed.choices?.[0]?.delta?.content !== undefined) {
          yield parsed;
        }
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
}

// ── Convenience builders ────────────────────────────────────────────

/**
 * Build a text-only message array from system prompt + user prompt.
 */
export function buildTextMessages(systemPrompt: string, userPrompt: string): LLMMessage[] {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

/**
 * Build a vision message array (text + image URL).
 */
export function buildVisionMessages(
  systemPrompt: string,
  textPrompt: string,
  imageUrl: string,
  _detail: 'low' | 'high' = 'high'
): LLMMessage[] {
  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: [
        { type: 'text', text: textPrompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ];
}

/**
 * Extract JSON from an LLM response that may wrap it in markdown fences.
 * Returns null if no valid JSON object found.
 */
export function extractJson<T = any>(content: string): T | null {
  try {
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  } catch {
    return null;
  }
}

// ── Constants exports ───────────────────────────────────────────────

export { DEFAULT_TEXT_MODEL, DEFAULT_IMAGE_MODEL, OPENROUTER_BASE_URL };
