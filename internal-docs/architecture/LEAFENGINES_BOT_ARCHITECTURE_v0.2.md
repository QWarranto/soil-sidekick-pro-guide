# LeafEngines™ Telegram & Bot Channel Architecture — v0.2

**Status:** Addendum to v0.1, rewritten with the current codebase as the reference.
**Posture:** Minimize disruption. Reuse existing primitives. Defer net-new infrastructure unless an existing primitive cannot stretch.

> **Reading rule:** Every section starts with **What exists today**, then **What v0.2 adds**, then **What v0.1 proposed and why we are deferring or replacing it**. If a v0.1 idea is not mentioned, it is dropped from the critical path and parked in §12.

---

## 0. Guiding principles (changed from v0.1)

1. **The codebase is the spec.** v0.1 read like greenfield. v0.2 treats `supabase/functions/*`, the Core memory rules, and `src/integrations/supabase/types.ts` as immovable until a migration is approved.
2. **No new cross-cutting contracts in Phase 1.** Dual-meter, LLM router rewrite, SDK v3, and tier rename are explicitly out of scope for the Telegram launch. Each gets its own addendum.
3. **Telegram is a channel, not a platform.** It is a *thin adapter* over the MCP server and existing edge functions. It does not invent a parallel tool registry, prompt store, or auth model.
4. **One trust boundary, not three.** Telegram → `mcp-server` → existing tools. No direct fan-out from a Telegram handler to `safe-identification`, `agricultural-intelligence`, etc.
5. **Lovable AI Gateway is the sanctioned LLM path** (Core memory). Groq / AI Studio / Together failover from v0.1 is moved to §12 (deferred) pending a separate decision.

---

## 1. Scope of v0.2

**In scope (Phase T1 — Telegram MVP):**
- `telegram-webhook` edge function (`verify_jwt = false`, secret-token validated).
- Telegram-as-MCP-client: webhook handler resolves intent → calls `mcp-server` over HTTP with a synthesized `x-api-key` minted per Telegram user.
- Free-tier discovery commands: `/county`, `/soil`, `/help`.
- Authenticated commands (require linked account): `/identify` (photo), `/recommend`, `/water`.
- Per-Telegram-user daily quota using the **existing** `api_keys.daily_call_count` (single meter — no schema change).

**Out of scope (deferred, see §12):**
- WhatsApp / multi-channel router
- Dual metering (data vs. AI)
- Direct-provider LLM failover
- SDK v3 / `ak_` prefix migration
- SSP tier rename rollout
- Operator console / MFA
- Captcha on free-tier auto-creation (rate-limit only in T1)

---

## 2. Reuse map (the most important table in this doc)

| Capability the bot needs | What v0.1 proposed | What already exists | v0.2 decision |
|---|---|---|---|
| Tool routing | New `tool-router` module | `supabase/functions/mcp-server/` already routes 10 tools | **Reuse mcp-server**. Telegram handler is a JSON-RPC client. |
| Auth for tools | New `telegram_users.tier` column as source of truth | `api_keys` table with `SS_API_{prefix}_2025` hash, tier on row | **Mint an api_key per Telegram user** on first `/start`. Tier lives on `api_keys`, not on a Telegram table. |
| Rate limiting | New per-user counter, dual meter | `api_keys.daily_call_count` + `rate_limit_tracking` table | **Reuse both**. Single meter in T1. |
| LLM calls | Groq → AI Studio → Together failover | Lovable AI Gateway via existing `gpt5-chat` / `agricultural-intelligence` | **Reuse Lovable AI Gateway through existing functions.** No new provider keys. |
| Prompt versioning | New `prompt_versions` table | Prompts live in the tool functions today | **Defer.** Add a `prompt_version` string constant in each function; promote to a table only when a second channel needs the same prompts. |
| Telemetry | New `telegram:{tool}` events | `mcp_tool_call_log` already records `access_source` | **Add `access_source = 'telegram'`.** No new table. |
| Photo upload | Inline base64 in webhook payload | `safe-identification` accepts a URL; 2MB edge limit applies | **Stream Telegram `getFile` → Supabase Storage signed URL → pass URL to tool.** No inline base64. |
| Health check | New `system_health` table + loop | `api-health-monitor` already runs | **Reuse `api-health-monitor`**, add a `telegram` probe. |
| Audit / PII redaction | Mentioned, not designed | `mcp-audit-governance` memory + `mcp_tool_call_log` redaction | **Reuse existing redaction**; add photo-URL stripping to the same path. |
| Error triage | Implicit | `/api-error-triage` admin queue exists | **Reuse**. Add `provider: 'telegram'` tag. |

**The net change to the database in Phase T1 is one new table (`telegram_link`) plus one nullable column on `api_keys`.** Everything else is reuse.

---

## 3. Data model (minimum viable)

```sql
-- One new table. RLS on. service_role writes from edge function.
create table public.telegram_link (
  telegram_user_id bigint primary key,
  chat_id          bigint not null,
  api_key_id       uuid not null references public.api_keys(id) on delete cascade,
  linked_user_id   uuid references auth.users(id),  -- null until /link is completed
  language_code    text,
  created_at       timestamptz not null default now(),
  last_seen_at     timestamptz not null default now()
);
alter table public.telegram_link enable row level security;
-- No SELECT policy for anon. Service role only. Linked users can read their own row:
create policy "telegram_link self read"
  on public.telegram_link for select to authenticated
  using (linked_user_id = auth.uid());

-- One nullable column on the existing api_keys table.
alter table public.api_keys
  add column if not exists channel text;  -- 'web' | 'telegram' | 'qgis' | null
```

**Why this minimum:**
- No `telegram_users.tier` — would be a third source of truth. Tier lives on `api_keys`.
- No `prompt_versions` table — premature.
- No `support_tickets` / `user_feedback` / `system_health` — not on the Telegram critical path.
- `channel` column lets the existing dashboards (`api-usage-dashboard`, Founders thresholds) attribute traffic without a meter rewrite.

**Migration order is linear**, no circular dependency with v0.1 Phase 2.1.

---

## 4. Request flow

```text
Telegram → telegram-webhook (verify_jwt=false, secret_token check)
        → resolve chat_id → telegram_link row (auto-create on /start)
        → translate command → MCP JSON-RPC tool call
        → fetch(mcp-server, { x-api-key: <minted key>, x-channel: 'telegram' })
        → mcp-server runs existing tool with existing RLS, rate limit, redaction
        → format result → sendMessage via Telegram connector gateway
```

**Trust boundary:** the webhook is the only thing that mints the api-key header. `mcp-server` continues to treat `x-api-key` as the sole auth. No `x-free-tier` header propagation between Telegram and downstream — the api-key carries the tier.

**Why this matters:** v0.1 wanted `mcp-server` to issue `x-free-tier` to downstream functions. That collides with the Core memory rule that `x-free-tier` is the *inbound* bypass for `get-soil-data` / `county-lookup` only. v0.2 leaves that contract alone.

---

## 5. Auth & account linking

- `/start` creates `telegram_link` row + provisions an `api_keys` row with `channel='telegram'`, tier `free`, hash `SS_API_{prefix}_2025` (Core format preserved). No `ak_` prefix in T1.
- `/link <one-time-code>` associates the Telegram user with an existing `auth.users` account. Code is issued from the web app (`app.soilsidekickpro.com`) and stored in a short-TTL row in `rate_limit_tracking` (reuse, no new table).
- Subdomain auth rule (`app.` prefix) is unaffected: Telegram never touches authenticated web endpoints; it only talks to `mcp-server` (which is correctly on the bare functions domain).

---

## 6. Photo handling (`/identify`)

v0.1's inline base64 dies at the 2 MB inbound edge limit. v0.2:

1. `telegram-webhook` receives the `photo` array → picks largest → calls Telegram `getFile` through the connector gateway.
2. Streams the bytes into a private Supabase Storage bucket `telegram-uploads/{telegram_user_id}/{update_id}.jpg`.
3. Generates a signed URL (TTL 10 min).
4. Calls `safe-identification` via `mcp-server` with `{ image_url, signed: true }`.
5. After tool returns, **photo URL is stripped from `mcp_tool_call_log.tool_arguments`** by the existing redaction (extend the redaction list — one constant).
6. Storage lifecycle policy deletes objects after 24 h.

**V3 encryption envelope:** photos in Storage are subject to bucket-level encryption-at-rest (Supabase default). PII envelope encryption is *not* triggered because the photo never lands in a PII table. This is the same posture as `safe-identification` when called from the web app — no regression.

**Offline / WebGPU brand promise:** unchanged. Telegram is by definition online. The marketing memory (`leafengines-market-positioning` "survival layer") applies to the *app*, not to the bot. We just need to not advertise Telegram as the offline path.

---

## 7. LLM calls

- All LLM-backed tools (`agricultural-intelligence`, `safe-identification`, `dynamic-care`, `beginner-guidance`) are invoked **as-is** through `mcp-server`. They already use Lovable AI Gateway.
- No new `_shared/llm-client.ts`. No new provider keys (`GROQ_API_KEY`, etc.) added in T1.
- Streaming/progress events: T1 returns final response only. If MCP timeout becomes an issue, add `sendChatAction("typing")` heartbeat in the webhook handler — not a new transport.

---

## 8. Quotas & metering

- Single meter (`daily_call_count` on `api_keys`) continues. Telegram free-tier keys default to 20/day, mirroring the public `x-free-tier` budget.
- Founders auto-upgrade thresholds (500 / 5 k / 25 k) keep their current semantics: total calls per key. A Telegram-only key cannot trigger upgrades until linked to a user (linked = `linked_user_id IS NOT NULL`).
- Stripe metered billing emits one event per call, unchanged.
- **Dual-meter is explicitly a Phase T3 concern**, not T1. v0.1 conflated the two.

---

## 9. Compliance deltas

- **GDPR ROPA** (`GDPR_ROPA_CONTROLLER.md`): add **Telegram** as a sub-processor (message transport). No new LLM sub-processors because we did not adopt direct-provider failover. One-line ROPA amendment, not a rewrite.
- **DPIA**: photo uploads from Telegram are the same processing activity as from the web app; reference the existing `safe-identification` entry, add channel = telegram.
- `search_path = ''` on any new SECURITY DEFINER — none introduced in T1 (no new functions touch `telegram_link` from SQL; the edge function uses service role).
- 500 m write-inhibition lock is irrelevant to T1 (no field-location writes from the bot).
- Data Quality Envelope: bot responses pass through unchanged from the tool — envelope is preserved.

---

## 10. Phase plan (revised, linear, no circular deps)

| Phase | Scope | Depends on | Risk |
|---|---|---|---|
| **T0** | Migration: `telegram_link` table + `api_keys.channel` column + Storage bucket `telegram-uploads` + lifecycle rule | — | Low |
| **T1.1** | `telegram-webhook` edge function (secret-token, idempotent on `update_id`, mints api-key on `/start`) | T0 | Low |
| **T1.2** | Command parser + MCP client wrapper (5 commands: `/start`, `/help`, `/county`, `/soil`, `/link`) | T1.1 | Low |
| **T1.3** | Photo flow: `getFile` → Storage → signed URL → `safe-identification` | T1.2 | Medium (storage + size guards) |
| **T1.4** | Extend `mcp_tool_call_log` redaction list with `image_url`; add `access_source='telegram'` | T1.3 | Low |
| **T1.5** | Extend `api-health-monitor` with a Telegram `getMe` probe | T1.4 | Low |
| **T1.6** | Register webhook via connector gateway with derived secret_token | T1.5 | Low |
| **T1.7** | Update ROPA + add Telegram row to `ai-plugin.json` keywords (no MCP tool changes) | T1.6 | Low |

**Total surface area:** 1 new function, 1 new table, 1 new column, 1 new bucket. Compare to v0.1's ~6 new tables, new router, new LLM client, new prompt store.

---

## 11. What v0.2 explicitly does NOT change (and why)

| v0.1 proposal | v0.2 verdict | Reason |
|---|---|---|
| Make `mcp-server` issue `x-free-tier` to downstream | **Reject** | Inverts the inbound-only Core contract; breaks the `get-soil-data` / `county-lookup` bypass invariant. |
| Add dual-meter columns to `api_keys` | **Defer to T3** | Cascades into Stripe SKU split, Founders thresholds, analytics dashboards, SDK response shape. None are required for Telegram MVP. |
| New `prompt_versions` table | **Defer** | YAGNI until a second channel needs the same prompt. |
| Groq / AI Studio / Together failover | **Defer** | Violates Lovable AI Gateway Core rule; triples sub-processor surface. |
| `ak_` API key prefix | **Defer to SDK v3 addendum** | Current hash format `SS_API_{prefix}_2025` is referenced in too many places to migrate inside a channel launch. |
| Separate `telegram_users` tier column | **Reject** | Third source of truth. Tier stays on `api_keys`. |
| Operator commands + MFA | **Defer** | Not on MVP critical path; revisit after Telegram traffic > 1k DAU. |
| Captcha on free-tier auto-create | **Defer** | Replace with rate-limit (1 `/start` per IP per hour via `rate_limit_tracking`). Captcha if abuse observed. |
| Telegram `secret_token` re-enable owner / date | **Owned in T1.6** | Derived from `TELEGRAM_API_KEY` via SHA-256, no manual secret. |

---

## 12. Parked items (future addendums, each gets its own doc)

- **Addendum A — Dual Metering & Stripe SKU split.** Triggered by: pricing change that charges differently for AI vs. data calls.
- **Addendum B — LLM Router & Cost Caps.** Triggered by: Lovable AI Gateway cost ceiling or provider outage SLA breach.
- **Addendum C — SDK v3 / `ak_` prefix migration.** Triggered by: external SDK consumers needing the new prefix; needs OpenAPI regen for all 6 languages.
- **Addendum D — Multi-channel router (WhatsApp, SMS).** Triggered by: confirmed second channel demand. Promotes Telegram handler into a shared dispatcher.
- **Addendum E — Prompt Versioning Store.** Triggered by: Addendum D.
- **Addendum F — Operator Console + MFA.** Triggered by: support volume or compliance audit.

Each addendum is independently shippable and does not block Telegram MVP.

---

## 13. Acceptance criteria for T1

1. `/start` from a new Telegram user creates a `telegram_link` + `api_keys` row in one transaction; duplicate `update_id` is a no-op.
2. `/county Story County, Iowa` returns a FIPS code in < 2 s P95.
3. `/identify` with a 4 MB photo succeeds (proves Storage path, not inline base64).
4. `mcp_tool_call_log` shows `access_source='telegram'` and no `image_url` in `tool_arguments`.
5. `api-health-monitor` reports `telegram: ok`.
6. Webhook rejects requests missing or mismatching `X-Telegram-Bot-Api-Secret-Token`.
7. No change to existing `mcp-server` tool contracts, no change to RLS on `api_keys`, no change to Lovable AI Gateway calls in any tool.
8. ROPA contains a Telegram row; no other GDPR documents require edits.

---

## 14. Diff summary against v0.1

- **Removed:** 6 of 9 proposed tables, the direct-provider LLM chain, the `x-free-tier` re-issuing model, the `ak_` migration, dual metering, prompt store, operator console.
- **Replaced:** "new tool router" with "reuse `mcp-server`"; "new LLM client" with "reuse Lovable AI Gateway via existing tools"; "inline base64 photos" with "Storage signed URL".
- **Preserved:** the goal (Telegram users get LeafEngines tools), the secret-token webhook pattern, the per-user quota concept, telemetry intent.
- **Net new code surface:** ~1 edge function + 1 migration. The rest is configuration and a redaction-list addition.

This is the path that ships Telegram without forcing any of the 25 cross-cutting decisions from the v0.1 review. Each of those decisions remains available as an addendum, and none of them are gated by the Telegram launch.
