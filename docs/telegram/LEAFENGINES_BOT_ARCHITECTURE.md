# LeafEngines Telegram Bot — Technical Architecture

**Version:** 1.0 (Verified 2026-06-30)
**Date:** June 30, 2026
**Status:** Active — reflects deployed architecture

---

## 1. System Overview

```
PRIMARY CHANNELS (parallel, equal priority):

  MCP Users (Claude, Codex, desktop)       Telegram Users (mobile, instant)
       |                                         |
       v                                         v
  [MCP Server]                            [Telegram Bot API]
       |                                         |
       v                                         v (webhook POST)
  +---------------------------------------------------------------+
  | Supabase Edge Functions                                       |
  |                                                               |
  |  mcp-server            telegram-webhook                       |
  |       |                      |                                |
  |       +---- Channel Router --+                                |
  |              |                                                |
  |              v                                                |
  |       +-- Tool Executor --+                                   |
  |       |  route to function |                                  |
  |       |  transform args    |                                  |
  |       +--------+-----------+                                  |
  |                |                                               |
  |          +-----+------+                                        |
  |          |            |                                        |
  |          v            v                                        |
  |     [Data Tools]  [LLM Tools]                                 |
  |     get-soil-data  agricultural-intelligence                   |
  |     water-quality  safe-identification (FLAGSHIP)              |
  |     carbon-credit  environmental-impact                        |
  |          |            |                                        |
  |          v            v                                        |
  |     [USDA/EPA]   [Lovable AI Gateway]                         |
  |     [Supabase]   (Gemini for ag-intel)                         |
  |                  [OpenAI direct]                               |
  |                  (GPT-5 for chat/planning)                     |
  |          |            |                                        |
  |          +------+-----+                                        |
  |                 |                                               |
  |                 v                                               |
  |        +-- Response Formatter --+                              |
  |        | MCP: structured JSON    |                              |
  |        | Telegram: Markdown card |                              |
  |        +-----------+-------------+                              |
  |                    |                                            |
  |        +-- Telemetry Logger --+                                |
  |        | write to events table |                                |
  |        +-----------+-----------+                                |
  |                    |                                            |
  +--------------------|--------------------------------------------+
                       v
              Supabase PostgreSQL

SECONDARY CHANNEL:
  Skyline Instruments (OEM) ──→ Embedded hardware with LeafEngines intelligence
  Operates independently via same backend API

TERTIARY CHANNEL:
  Government Grants ──→ Institutional / research deployments
```

## 2. Component Details

### 2.1 Channel Layer

| Component | Endpoint | Auth | Deployed |
|-----------|----------|------|----------|
| telegram-webhook | /functions/v1/telegram-webhook | --no-verify-jwt | Yes |
| twilio-webhook | /functions/v1/twilio-webhook | --no-verify-jwt | No (Phase 2) |

Both webhooks share the same internal router logic. Channel-specific code handles:
- Input parsing (Telegram JSON vs Twilio form-encoded)
- Output formatting (Telegram Markdown vs WhatsApp text)
- Channel-specific features (Telegram inline mode, WhatsApp interactive buttons)

### 2.2 Channel Router

Responsibilities:
1. Parse incoming message into a normalized `ParsedCommand`
2. Look up or auto-create user in `telegram_link`
3. Check daily rate limit
4. Route to appropriate tool
5. Format and send response
6. Log telemetry event

```typescript
interface ParsedCommand {
  tool: string;          // 'get_soil_data', 'agricultural_intelligence', etc.
  args: Record<string, unknown>;
  raw: string;
  chatId: number;
  userId: number;        // telegram_id
  channel: 'telegram' | 'whatsapp';
}
```

### 2.3 Tool Executor

Maps tool names to Supabase edge functions with arg transformation:

| MCP Tool Name | Edge Function | Arg Transform | LLM Required | Notes |
|---------------|--------------|---------------|--------------|-------|
| get_soil_data | get-soil-data | Pass through | No | USDA SSURGO lookup |
| territorial_water_quality | territorial-water-quality | Pass through | No | EPA WQX lookup |
| carbon_credit_calculator | carbon-credit-calculator | Pass through | No | Formula-based |
| agricultural_intelligence | agricultural-intelligence | {county_fips, question} -> {query, context} | Yes (Lovable + Gemini) | |
| safe_identification | safe-identification | {plant_name,location} -> {image,location_obj,use_case} | Yes (Lovable + Gemini, multimodal) | **FLAGSHIP** — toxic lookalike DB, pet safety, photo support |
| environmental_impact_analysis | environmental-impact-engine | {county_fips, ...} -> {analysis_id, county_fips, soil_data, proposed_treatments} | Yes (Lovable + Gemini) | |

### 2.4 LLM Integration

> **NOTE — June 26, 2026:** This section originally described a Gemma 4-based architecture. The deployed system has evolved to use multiple providers:
> - **Lovable AI Gateway** + Google Gemini (agricultural-intelligence)
> - **OpenAI direct** (gpt5-chat, seasonal-planning-assistant)
> - **OpenRouter** was planned but not deployed

#### Deployed Model Selection

| Function | Primary Model | Provider | Fallback |
|----------|--------------|----------|----------|
| agricultural-intelligence | google/gemini-2.5-pro | Lovable AI Gateway | google/gemini-3-flash-preview |
| safe-identification | google/gemini-2.5-flash | Lovable AI Gateway | Template response |
| gpt5-chat | gpt-5-mini | OpenAI direct | gpt-4o → gpt-4o-mini |
| seasonal-planning-assistant | gpt-5-turbo | OpenAI direct | gpt-4o |

#### Provider Architecture

```
Lovable AI Gateway (agricultural-intelligence, safe-identification)
  |
  +---> google/gemini-2.5-pro (primary)
  +---> google/gemini-3-flash-preview (fallback)
  +---> Template response (circuit breaker open)

OpenAI direct (gpt5-chat, seasonal-planning-assistant)
  |
  +---> gpt-5-mini (primary)
  +---> gpt-4o (fallback)
  +---> gpt-4o-mini (last resort)
```

#### Prompt Management

System prompts are stored in a `prompt_versions` table, not hardcoded:

```sql
CREATE TABLE prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  version integer NOT NULL,
  system_prompt text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tool_name, version)
);
```

Edge functions fetch the active prompt on each call:

```sql
SELECT system_prompt FROM prompt_versions
WHERE tool_name = 'agricultural_intelligence' AND is_active = true
ORDER BY version DESC LIMIT 1;
```

This allows prompt iteration without redeploying edge functions.

### 2.5 Data Layer

#### telegram_link

```sql
CREATE TABLE telegram_link (
  telegram_id bigint PRIMARY KEY,         -- Telegram user ID
  api_key_id uuid REFERENCES api_keys(id),
  tier text DEFAULT 'free',               -- free, pro, enterprise
  daily_ai_count integer DEFAULT 0,
  daily_data_count integer DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  first_name text,
  language_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

|-- Row Level Security
ALTER TABLE telegram_link ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON telegram_link
  FOR SELECT USING (telegram_id = current_setting('request.telegram_id')::bigint);
```

#### Daily Reset (pg_cron)

```sql
SELECT cron.schedule(
  'reset-daily-telegram-usage',
  '0 0 * * *',  -- midnight UTC
  $$
  UPDATE telegram_link
  SET daily_ai_count = 0,
      daily_data_count = 0,
      last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
  $$
);
```

#### Rate Limit Logic (in edge function)

```typescript
async function checkRateLimit(supabase: any, telegramId: number): Promise<{ allowed: boolean; remaining: number; tier: string }> {
  const TIER_LIMITS = { free: { ai: 5, data: 20 }, pro: { ai: 100, data: 200 }, enterprise: { ai: 99999, data: 99999 } };

  const { data: user } = await supabase
    .from('telegram_link')
    .select('tier, daily_ai_count, daily_data_count, last_reset_date')
    .eq('telegram_id', telegramId)
    .single();

  if (!user) return { allowed: false, remaining: 0, tier: 'none' };

  // Auto-reset if new day
  const today = new Date().toISOString().split('T')[0];
  if (user.last_reset_date !== today) {
    await supabase
      .from('telegram_link')
      .update({ daily_ai_count: 0, daily_data_count: 0, last_reset_date: today })
      .eq('telegram_id', telegramId);
    user.daily_ai_count = 0;
    user.daily_data_count = 0;
  }

  const limits = TIER_LIMITS[user.tier] || TIER_LIMITS.free;
  const remaining = Math.max(0, limits.ai - user.daily_ai_count) + Math.max(0, limits.data - user.daily_data_count);

  return { allowed: remaining > 0, remaining, tier: user.tier };
}
```

### 2.6 Telemetry

Every tool call through the Telegram bot is logged to `client_telemetry_events` with:

| Field | Value |
|-------|-------|
| event_type | 'tool_call' |
| event_name | 'telegram:{tool_name}' |
| properties.tool_name | e.g. 'agricultural_intelligence' |
| properties.duration_ms | end-to-end latency |
| properties.success | boolean |
| properties.channel | 'telegram' |
| properties.tier | 'free' / 'pro' |
| session_id | telegram chat_id |
| user_id | telegram_id (hashed if privacy mode) |
| platform | 'telegram' |

## 3. Secrets Configuration

| Secret | Purpose | Set |
|--------|---------|-----|
| TELEGRAM_BOT_TOKEN | Bot authentication | Yes |
| TELEGRAM_WEBHOOK_SECRET | Webhook verification (disabled, re-enable later) | Yes |
| LEAFENGINES_API_KEY | Internal API key for tool calls | Yes |
| LOVABLE_API_KEY | Lovable AI Gateway for ag-intel and safe-identification | Yes |
| OPENAI_API_KEY | OpenAI direct for GPT-5 chat and seasonal planning | Yes |
| GEMMA_API_KEY | Google AI Studio or Groq (planned, not deployed) | No |
| GEMMA_PROVIDER | 'aistudio', 'groq', or 'together' (planned, not deployed) | No |
| TWILIO_ACCOUNT_SID | WhatsApp channel (Phase 2) | No |
| TWILIO_AUTH_TOKEN | WhatsApp channel (Phase 2) | No |
| STRIPE_WEBHOOK_SECRET | Subscription management (Phase 2) | No |

## 4. Deployment Architecture

```
Supabase Project: wzgnxkoeqzvueypwzvyn
Region: us-east-1

Edge Functions (Deno):
  - telegram-webhook (deployed --no-verify-jwt)
  - twilio-webhook (Phase 2, --no-verify-jwt)
  - mcp-server (standard)
  - agricultural-intelligence (standard)
  - safe-identification (standard)
  - environmental-impact-engine (standard)
  - get-soil-data (standard)
  - telemetry-ingest (standard)
  - send-transactional-email (standard)

PostgreSQL:
  - telegram_link
  - api_keys
  - client_telemetry_events
  - telemetry_daily_summary
  - prompt_versions
  - cron.job (pg_cron: daily-reset, daily-rollup, top-tools)

External APIs:
  - Telegram Bot API (webhook receiver)
  - Lovable AI Gateway (Gemini inference for ag-intel, safe-identification)
  - OpenAI API (GPT-5 inference for gpt5-chat, seasonal-planning)
  - USDA SDA (soil data)
  - EPA WQX (water quality)
  - Stripe (subscriptions, Phase 2)
  - Twilio (WhatsApp, Phase 2)

Static Assets:
  - npm: @ancientwhispers54/leafengines-mcp-server
  - npm: @ancientwhispers54/leafengines-telemetry
  - npm: n8n-nodes-leafengines
  - npm: node-red-contrib-leafengines
```

## 5. Data Flow — Typical Request

```
1. User sends "/soil 01001" in Telegram
2. Telegram POSTs to /functions/v1/telegram-webhook
3. telegram-webhook:
   a. Parse message -> { tool: 'get_soil_data', args: { county_fips: '01001' } }
   b. Lookup telegram_id 8734401874 in telegram_link
   c. Auto-create if not exists (free tier, generate API key)
   d. Check rate limit (daily_data_count < 20)
   e. Increment daily_data_count
   f. Call supabase.functions.invoke('get-soil-data', { body: { county_fips: '01001' } })
   g. get-soil-data calls USDA SDA API, returns soil data
   h. Format as Telegram Markdown
   i. POST to Telegram sendMessage API
   j. Log telemetry event to client_telemetry_events
4. User sees formatted soil card in Telegram (2-4 seconds)
```

## 6. Data Flow — LLM Request

```
1. User sends "/ag 01001" in Telegram
2-3e. [same as above]
3f. Call supabase.functions.invoke('agricultural-intelligence', { body: { query: '...', context: { county_fips: '01001' } } })
3g. agricultural-intelligence:
   a. Fetch active system prompt from prompt_versions table
   b. Build messages array with system prompt + user query
   c. Call Lovable AI Gateway with google/gemini-2.5-pro (or 3-flash-preview fallback)
   d. Parse structured JSON response
   e. Return to telegram-webhook
3h-i. [same as above]
3j. Log telemetry with duration_ms, success, token_count
4. User sees formatted ag intelligence card (3-6 seconds)
```

## 7. Cost Model

### Per-Request Cost Breakdown (Deployed Providers)

| Component | Cost |
|-----------|------|
| Supabase edge function invocation | $0.000002 (free tier) |
| Supabase DB read (user lookup) | $0.000001 (free tier) |
| Lovable AI Gateway + Gemini (~1,300 tokens) | ~$0.001 |
| OpenAI GPT-5-mini (~1,300 tokens) | ~$0.003 |
| Telegram sendMessage API | $0 |
| **Total per LLM call (agricultural-intelligence)** | **~$0.001** |
| **Total per LLM call (gpt5-chat)** | **~$0.003** |
| **Total per data-only call** (soil, water, carbon) | **~$0.000003** |

### Monthly Cost at Scale

| Users | LLM calls/day | Data calls/day | LLM cost | Supabase cost | Total |
|-------|--------------|----------------|----------|---------------|-------|
| 20 | 100 | 100 | $3/mo | Free | $3/mo |
| 200 | 1,000 | 1,000 | $30/mo | $25/mo (Pro) | $55/mo |
| 1,000 | 5,000 | 5,000 | $150/mo | $25/mo | $175/mo |

### Break-Even

| Tier | Revenue/mo | Cost/mo | Margin |
|------|-----------|---------|--------|
| 200 free users | $0 | $55 | -$55 |
| 10 pro users ($5/mo) | $50 | +$15 (their usage) | -$20 net |
| 30 pro users | $150 | +$45 | +$50 net |
| 100 pro users | $500 | +$150 | +$200 net |

**Break-even: ~30 pro users** (15% conversion from 200 DAU)

## 8. Security Model

| Layer | Threat | Control |
|-------|--------|---------|
| Webhook | Spoofed requests | Re-enable Telegram secret_token header verification after trial |
| Auth | Unauthorized tool access | Every call uses per-user API key from telegram_link |
| Rate limit | Abuse / cost explosion | Daily hard cap per user + global daily cap + per-second throttle |
| Data | Cross-user leakage | RLS on telegram_link; API keys scoped to user |
| PII | Telegram user data exposure | Store only telegram_id (numeric); no names/usernames in DB |
| Secrets | Bot token / API key leak | All in Supabase secrets, never in code or logs |
| Input | Prompt injection | Sanitize input (max 500 chars); structured args only |
| LLM | Hallucinated dangerous advice | System prompt constrains domain; never recommend chemicals/actions without disclaimer |

## 9. LLM Provider State (Current)

### Current State (Deployed)

```
agricultural-intelligence --calls--> Lovable AI Gateway (Gemini 2.5-pro / 3-flash-preview)
safe-identification --------calls--> Lovable AI Gateway (Gemini 2.5-flash)
gpt5-chat ------------------calls--> OpenAI direct (GPT-5-mini → GPT-4o → GPT-4o-mini)
seasonal-planning-assistant --calls--> OpenAI direct (GPT-5-turbo → GPT-4o)
```

### Secrets Required

| Secret | Purpose | Set |
|--------|---------|-----|
| LOVABLE_API_KEY | Lovable AI Gateway for ag-intel and safe-identification | Yes |
| OPENAI_API_KEY | OpenAI direct for GPT-5 chat and seasonal planning | Yes |
| GEMMA_API_KEY | Google AI Studio or Groq (planned, not deployed) | No |
| GEMMA_PROVIDER | 'aistudio', 'groq', or 'together' (planned, not deployed) | No |

### Planned Evolution

1. Evaluate OpenRouter for unified routing across all LLM providers
2. Create `_shared/llm-router.ts` with per-function model selection and cost caps
3. Gradually migrate Lovable-only functions to OpenRouter for cost optimization
4. Maintain OpenAI direct path for GPT-5 features where model availability matters

## 10. Support Infrastructure (Day One)

### Support Tables

```sql
-- support_tickets: created by /support command
CREATE TABLE support_tickets (
  id text PRIMARY KEY,
  telegram_id bigint NOT NULL,
  chat_id bigint NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'untriaged',
  status text DEFAULT 'open',
  assigned_to text,
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- user_feedback: created by /feedback command
CREATE TABLE user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL,
  feedback_text text NOT NULL,
  reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- system_health: populated by health-check edge function every 60s
CREATE TABLE system_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  status text NOT NULL,
  latency_ms integer,
  error_message text,
  checked_at timestamptz DEFAULT now()
);
```

### Health Check Pipeline

```
pg_cron (every 60s)
  -> health-check edge function
     -> pings Lovable AI Gateway, OpenAI, USDA, EPA, Telegram APIs
     -> writes to system_health
     -> if 3 consecutive failures: Telegram DM alert to operator
```

### Operator Commands

| Command | Auth | Description |
|---------|------|-------------|
| /admin tickets | operator telegram_id | List open tickets |
| /admin resolve <id> <text> | operator telegram_id | Resolve ticket + notify user |
| /admin stats | operator telegram_id | User count, volume, error rate |
| /admin health | operator telegram_id | Force health check |
| /admin block <id> | operator telegram_id | Block abusive user |
| /admin broadcast <msg> | operator telegram_id | Message all users |

Full details: ~/operations/PRODUCT/LEAFENGINES_BOT_SUPPORT.md

## 11. File Locations

| Artifact | Path |
|----------|------|
| PRD | ~/operations/PRODUCT/LEAFENGINES_BOT_PRD.md |
| Architecture | ~/operations/INFRA/LEAFENGINES_BOT_ARCHITECTURE.md |
| Telemetry schema | ~/operations/INFRA/TELEMETRY_SCHEMA.md |
| Edge functions | ~/clawd/soil-sidekick-pro-guide-main/supabase/functions/ |
| Telemetry SDK | ~/clawd/soil-sidekick-pro-guide-main/sdks/telemetry/ |
| SQL migrations | ~/operations/sql/ |
| Crontab docs | ~/operations/crontab.telemetry.txt |
