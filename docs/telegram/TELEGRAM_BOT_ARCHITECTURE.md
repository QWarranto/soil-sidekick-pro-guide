# Telegram Bot Architecture

**Version:** v0.2
**Date:** May 2026
**Author:** LeafEngines / Soil Sidekick Pro
**Status:** Active

---

## Overview

The LeafEngines Telegram bot is a thin adapter over the MCP server and existing Supabase edge functions. It does not invent a parallel tool registry, prompt store, or auth model. Telegram is a **channel**, not a platform — it routes user intent through the same execution spine that serves MCP, QGIS, and the REST API.

---

## Design Principles

1. **The codebase is the spec.** `supabase/functions/*`, the Core memory rules, and `src/integrations/supabase/types.ts` are immovable until a migration is approved.
2. **No new cross-cutting contracts in Phase 1.** Dual-meter, LLM router rewrite, SDK v3, and tier rename are out of scope for the Telegram launch.
3. **Telegram is a channel, not a platform.** It is a thin adapter over the MCP server. No parallel tool registry.
4. **One trust boundary.** Telegram → `mcp-server` → existing tools. No direct fan-out from a Telegram handler to `safe-identification`, `agricultural-intelligence`, etc.
5. **Lovable AI Gateway is the sanctioned LLM path.** No direct Groq / AI Studio / Together calls from the webhook.

---

## Request Flow

```text
Telegram → telegram-webhook (verify_jwt=false, secret_token check)
  → resolve chat_id → telegram_link row (auto-create on /start)
  → translate command → MCP JSON-RPC tool call
  → fetch(mcp-server, { x-api-key: <minted key>, x-channel: 'telegram' })
  → mcp-server runs existing tool with existing RLS, rate limit, redaction
  → format result → sendMessage via Telegram Bot API
```

**Trust boundary:** the webhook is the only thing that mints the api-key header. `mcp-server` continues to treat `x-api-key` as the sole auth token.

---

## Data Model

### `telegram_link` table (new)

```sql
create table public.telegram_link (
  telegram_user_id bigint primary key,
  chat_id bigint not null,
  api_key_id uuid not null references public.api_keys(id) on delete cascade,
  linked_user_id uuid references auth.users(id), -- null until /link is completed
  language_code text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
alter table public.telegram_link enable row level security;

create policy "telegram_link self read"
  on public.telegram_link for select to authenticated
  using (linked_user_id = auth.uid());
```

### `api_keys` additions (existing table)

```sql
alter table public.api_keys
  add column if not exists channel text; -- 'web' | 'telegram' | 'qgis' | null

-- Dual-meter columns (from L1 migration):
-- daily_ai_count, daily_data_count, monthly_alert_count, last_reset_date
-- trial_crop_used boolean (for /crop free taste mechanic)
```

**Why this minimum:**

- No `telegram_users.tier` — would be a third source of truth. Tier lives on `api_keys`.
- No `prompt_versions` table — premature.
- `channel` column lets existing dashboards (`api-usage-dashboard`, Founders thresholds) attribute traffic without a meter rewrite.

---

## Reuse Map

| Capability the bot needs | What already exists | Decision |
|---|---|---|
| Tool routing | `supabase/functions/mcp-server/` routes 10 tools | **Reuse mcp-server**. Telegram handler is a JSON-RPC client. |
| Auth for tools | `api_keys` table with tier on row | **Mint an api_key per Telegram user** on first `/start`. |
| Rate limiting | `api_keys.daily_call_count` + `rate_limit_tracking` | **Reuse both.** Dual-meter in L1. |
| LLM calls | Lovable AI Gateway via `gpt5-chat` / `agricultural-intelligence` | **Reuse.** No new provider keys. |
| Telemetry | `mcp_tool_call_log` with `access_source` | **Add `access_source = 'telegram'`.** No new table. |
| Photo upload | `safe-identification` accepts a URL | **Stream Telegram `getFile` → Supabase Storage signed URL → pass URL.** |
| Health check | `api-health-monitor` | **Reuse.** Add a `telegram` probe. |
| Error triage | `/api-error-triage` admin queue | **Reuse.** Add `provider: 'telegram'` tag. |

---

## Auth & Account Linking

- `/start` creates `telegram_link` row + provisions an `api_keys` row with `channel='telegram'`, tier `free`.
- `/link <one-time-code>` associates the Telegram user with an existing `auth.users` account. Code is issued from the web app and stored in a short-TTL row in `rate_limit_tracking`.
- Subdomain auth rule (`app.` prefix) is unaffected — Telegram never touches authenticated web endpoints directly; it only talks to `mcp-server`.

---

## Photo Handling (`/identify`)

1. `telegram-webhook` receives the `photo` array → picks largest → calls Telegram `getFile`.
2. Streams bytes into a private Supabase Storage bucket `telegram-uploads/{telegram_user_id}/{update_id}.jpg`.
3. Generates a signed URL (TTL 10 min).
4. Calls `safe-identification` via `mcp-server` with `{ image_url, signed: true }`.
5. After tool returns, **photo URL is stripped from `mcp_tool_call_log.tool_arguments`** by the existing redaction.
6. Storage lifecycle policy deletes objects after 24 h.

---

## LLM Calls

All LLM-backed tools (`agricultural-intelligence`, `safe-identification`, `dynamic-care`, `beginner-guidance`) are invoked **as-is** through `mcp-server`. They already use the Lovable AI Gateway. The webhook never calls an LLM provider directly.

---

## Webhook Security

- `verify_jwt = false` on the edge function — Telegram sends webhook payloads, not JWTs.
- **Secret-token validation:** Telegram's `X-Telegram-Bot-Api-Secret-Token` header is checked against the stored secret.
- **IP allowlist:** Cloudflare-sourced IPs only (same as other edge functions).
- Rate limiting on the webhook entry point prevents abuse before it reaches `mcp-server`.

---

## Telemetry

All tool calls from Telegram are logged in `mcp_tool_call_log` with:

- `access_source = 'telegram'`
- `channel = 'telegram'` on the `api_keys` row
- `tool_name`, `response_status`, `latency_ms` as usual

This integrates with the existing `api-usage-dashboard` and Founders alert thresholds without modification.

---

## Edge Functions Involved

| Function | Role |
|---|---|
| `telegram-webhook` | Entry point. Parses commands, routes to MCP server, formats responses. |
| `mcp-server` | Shared tool execution spine. 10 tools, rate limiting, RLS. |
| `safe-identification` | Plant ID with toxic lookalike warnings (photo URL input). |
| `agricultural-intelligence` | AI farming/gardening advice. |
| `county-lookup` | FIPS code resolution. |
| `get-soil-data` | County soil analysis. |
| `territorial-water-quality` | EPA water quality data. |
| `api-health-monitor` | System health checks (adds Telegram probe). |
| `telemetry-ingest` | Usage logging (adds `access_source='telegram'`). |

---

## Deployment

The webhook URL is registered with Telegram via `setWebhook`:

```text
POST https://api.telegram.org/bot{TOKEN}/setWebhook
{
  "url": "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/telegram-webhook",
  "secret_token": "<stored-secret>"
}
```

BotFather `setMyCommands` registers the command list for the `/` autocomplete menu. See [Telegram Command Reference](./TELEGRAM_COMMAND_REFERENCE.md) for the full list.
