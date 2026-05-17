# LeafEngines™ — Conflict Resolution Summary (v0.2 / v0.2.1)

**Scope:** Reconciliation between the existing codebase (Core memory rules, `supabase/functions/*`, `api_keys` contract, `mcp-server`, Lovable AI Gateway path) and the two submitted drafts (v0.1 Telegram/Bot architecture + v0.1 Launch Plan).
**Reference point:** Current code. Drafts are addendums.

---

## 1. Original conflicts between base code and submitted drafts

| # | Draft proposal (v0.1) | Conflict with base code | Severity |
|---|---|---|---|
| C1 | New `tool-router` module | `supabase/functions/mcp-server/` already routes 10 tools | High (duplication) |
| C2 | `telegram_users.tier` as auth source | `api_keys` is the canonical tier carrier (Core: `SS_API_{prefix}_2025`) | Critical (third source of truth) |
| C3 | Inline base64 photos in webhook | 2 MB edge function payload ceiling | Critical (hard fail) |
| C4 | `mcp-server` re-issues `x-free-tier` downstream | Core invariant: `x-free-tier` is **inbound-only** bypass for `get-soil-data` / `county-lookup` | Critical (breaks public API tier) |
| C5 | Groq → AI Studio → Together LLM failover | Core: Lovable AI Gateway is sanctioned LLM path | High (compliance + sub-processor surface) |
| C6 | Dual metering (data vs AI) on `api_keys` | Cascades into Stripe SKUs, Founders 500/5k/25k thresholds, dashboards, SDK response shape | High (cross-cutting) |
| C7 | `ak_` API key prefix | Hash format `SS_API_{prefix}_2025` is referenced across SDK, MCP audit, Founders registry | High (migration sprawl) |
| C8 | New `prompt_versions` table | Prompts colocated in tool functions; no second consumer exists | Medium (YAGNI) |
| C9 | New `system_health` table + loop | `api-health-monitor` already runs | Medium (duplication) |
| C10 | New telemetry events `telegram:{tool}` | `mcp_tool_call_log.access_source` already exists | Low (naming) |
| C11 | Captcha on free-tier auto-create | No captcha primitive in stack; `rate_limit_tracking` exists | Medium |
| C12 | Operator console + MFA in MVP | No operator role table; `user_roles` pattern not extended | Medium (scope) |
| C13 | SSP tier rename rolled into launch | `create-checkout` aliases legacy keys; rename is its own initiative | Medium |
| C14 | Subdomain auth ignored for Telegram path | Core: `app.` prefix required for authenticated routes | Critical if Telegram hit `app.` |
| C15 | No webhook secret-token derivation owner | Telegram requires `X-Telegram-Bot-Api-Secret-Token` validation | High |
| C16 | ROPA / DPIA not amended for Telegram sub-processor | GDPR controller obligation | High (compliance) |
| C17 | No `search_path = ''` discipline on new SECURITY DEFINER | Core hardening rule | High (security) |
| C18 | Per-channel breaker scope undefined | Existing `api-rate-limiter` is global per provider | Medium |
| C19 | `/link` one-time-code flow undefined in UI | Web app has no issuance page | Medium |
| C20 | `telegram-uploads` Storage RLS unwritten | Default-public buckets would leak PII | Critical if unaddressed |
| C21 | Founders thresholds could fire on unlinked Telegram keys | Would auto-upgrade ghost identities | High |
| C22 | No `channel` backfill on existing `api_keys` rows | Channel-filtered dashboards under-count web | Medium |
| C23 | No GDPR SAR amendment for Telegram-only users | SAR procedure predates channel | Medium |
| C24 | No rollback runbook for webhook cutover | Operational risk | Medium |
| C25 | No cost ceiling alert on Lovable AI Gateway for Telegram class | Risk register flagged it | Medium |

---

## 2. Conflicts resolved in v0.2 / v0.2.1 — with technical & performance impact

| # | Resolution | Technical impact | Performance impact |
|---|---|---|---|
| C1 | Telegram handler is JSON-RPC client to `mcp-server` | -1 module, single trust boundary | +1 hop (~5–15 ms intra-region); acceptable |
| C2 | Tier stays on `api_keys`; new `telegram_link` only maps identity → key | No schema fork; RLS unchanged | Neutral |
| C3 | Telegram `getFile` → Supabase Storage signed URL (10 min TTL) → tool consumes URL | Bypasses 2 MB edge limit; reuses `safe-identification` contract | +1 storage round-trip per `/identify` (~100–300 ms); acceptable for photo path |
| C4 | `x-free-tier` left inbound-only; api-key carries tier downstream | Preserves public free-tier bypass invariant | Neutral |
| C5 | Reuse Lovable AI Gateway via existing tools | No new sub-processors; Core compliance preserved | Neutral; avoids cold-provider latency variance |
| C8 | `prompt_version` constant per function (not table) | Zero migration | Neutral |
| C9 | Extend `api-health-monitor` with `telegram` probe | Reuses load monitor + circuit breakers | +1 lightweight `getMe` per cycle |
| C10 | Set `access_source='telegram'` on `mcp_tool_call_log` | Reuses redaction + dashboards | Neutral |
| C11 | Replace captcha with 1 `/start` per IP/hour via `rate_limit_tracking` (L4.7) | Zero new dependency | Neutral; abuse-bounded |
| C14 | Telegram targets `mcp-server` on bare functions domain, never `app.` | Subdomain auth invariant preserved | Neutral |
| C15 | Secret token derived SHA-256 from `TELEGRAM_API_KEY` (T1.6) | No manual secret; rotatable | Neutral |
| C16 | One-line ROPA Telegram sub-processor row (L6) | Minimum-viable compliance | N/A |
| C17 | T1 introduces no new SECURITY DEFINER; sweep added to L2 | Hardening preserved | N/A |
| C18 | Per-channel breaker scope defined in L2 acceptance | Telegram outage cannot brown out web | Improves isolation |
| C19 | `/link-telegram` page added at L1.7 | Closes UX gap | Neutral |
| C20 | `telegram-uploads` RLS: service_role write, no public read, signed URLs only, 24h lifecycle (L4.6) | Closes PII leak vector | Neutral |
| C21 | Founders auto-upgrade skips `channel='telegram' AND linked_user_id IS NULL` (L2.8) | Prevents ghost upgrades | Neutral |
| C22 | `channel='web'` backfill migration (L2.7) | Dashboard accuracy restored | One-time migration |
| C23 | One-paragraph SAR amendment for Telegram-only users (L4.8) | Compliance closed | N/A |
| C24 | Rollback runbook in `OPERATIONAL_MAINTENANCE.md` (L4.9) | RTO improved | N/A |
| C25 | Lovable AI Gateway cost-ceiling alert per Telegram traffic class (L5.5) | Cost guardrail | Alerting, not runtime |

**Net resolved code surface:** 1 new edge function (`telegram-webhook`), 1 new table (`telegram_link`), 1 new nullable column (`api_keys.channel`), 1 new bucket (`telegram-uploads`), 1 new page (`/link-telegram`), and a redaction-list addition. No SDK regen, no Stripe SKU change, no RLS rewrite on `api_keys`.

---

## 3. Remaining conflicts (consciously parked) and expected secondary conflicts within proposed alternatives

These are *not* settled. Each carries a downstream conflict surface that must be re-examined when the trigger fires.

| # | Parked item | Trigger to reopen | Secondary conflicts the alternative paths will create |
|---|---|---|---|
| C6 | Dual metering | Pricing change splitting AI vs data | (a) `daily_call_count` becomes ambiguous; (b) Founders thresholds (500/5k/25k) must be redefined per meter; (c) Stripe metered-billing event shape changes → SDK response delta; (d) `api-usage-dashboard` queries break |
| C7 | `ak_` prefix migration | External SDK consumers demand it | (a) `SS_API_{prefix}_2025` hash registry rotation; (b) OpenAPI regen across 6 languages; (c) MCP audit governance regex updates; (d) Founders registry dual-format lookup window |
| C5b | Direct-provider LLM failover (Groq/AI Studio/Together) | Lovable AI Gateway SLA breach or cost ceiling | (a) Triples sub-processor list → DPIA rewrite; (b) prompt drift between providers; (c) cost telemetry split; (d) violates current Core rule until rule is amended |
| C8b | `prompt_versions` table | Second channel (WhatsApp/SMS) needs identical prompts | (a) Edge function read path on every call adds latency; (b) cache invalidation strategy; (c) version pinning per tier |
| C12 | Operator console + MFA | Support volume or audit | (a) New `operator_roles` table conflicts with `user_roles` pattern; (b) MFA enrollment UX competes with consumer auth; (c) RLS expansion |
| C13 | SSP tier rename (Hobby/Grower/Pro) | Marketing decision | (a) `create-checkout` alias surface grows; (b) Founders registry copy; (c) memory rule rewrite |
| — | Multi-channel router | Confirmed 2nd channel demand | (a) Promotes Telegram handler into shared dispatcher → forces C8b; (b) per-channel idempotency model; (c) per-channel breaker matrix |
| — | Offline plant-ID GA on Telegram | Survival-layer narrative extension | Conflicts with online-only nature of Telegram; would require false marketing — keep parked |
| — | OEM / Skyline / HIL contracts | Partnership signature | Out of consumer channel scope; safety-critical governance (mTLS, HMAC, 5s TTL) does not map to chat surface |
| — | Captcha (vs rate-limit) | Observed abuse beyond rate-limit | (a) Vendor dependency; (b) Telegram has no native captcha render — would need `/link`-style web bounce |

---

## 4. Recommended best alternatives

Ranked by reopen-readiness and lowest secondary-conflict surface.

1. **C6 Dual metering — recommend: defer until concrete pricing decision; when reopened, add a *derived* `ai_call_count` view rather than a second column.** Avoids Stripe SKU split until billing actually diverges. Preserves Founders thresholds on total calls; introduces AI-only threshold as a second, additive rule.

2. **C7 `ak_` prefix — recommend: dual-accept window, not migration.** Issue new keys with `ak_` prefix while continuing to accept `SS_API_{prefix}_2025`. Hash registry stores both; MCP audit regex becomes `(SS_API_|ak_)`. Avoids the OpenAPI regen blast radius until a major SDK version.

3. **C5b LLM failover — recommend: stay on Lovable AI Gateway; add Gateway-level cost ceiling (already L5.5) and a *degraded mode* that returns cached/canned responses on 429/402, not a second provider.** Preserves Core rule and DPIA. Reopen only if Gateway uptime breaches SLA over a rolling 30-day window.

4. **C8b Prompt versioning — recommend: file-based versioning checked into git (`prompts/{tool}/v{n}.txt`), loaded at function cold-start.** Zero DB latency, full audit via git history, sufficient for ≤3 channels. Promote to table only at channel #4.

5. **C12 Operator console — recommend: extend `user_roles` with `operator` enum value + reuse Supabase Auth MFA; do not build a parallel role system.** Aligns with existing RLS patterns; MFA via Supabase's TOTP factor avoids new vendor.

6. **C13 SSP tier rename — recommend: ship as a labels-only PR (UI strings + Stripe lookup aliases already in place) decoupled from any technical change.** Lowest possible blast radius; revert is a string change.

7. **Multi-channel router — recommend: defer until WhatsApp or SMS has a signed pilot.** Premature abstraction would force C8b and a per-channel breaker matrix without a second consumer to validate the shape.

8. **Captcha — recommend: keep rate-limit (L4.7); add adaptive throttle (5 min cool-down after 3 abuse hits) before considering a captcha bounce page.** Captcha-via-web-bounce hurts conversion more than abuse hurts cost at current volume.

---

## 5. Go/No-Go posture

All **resolved** conflicts (Section 2) are gated by the Go/No-Go rows in `LEAFENGINES_LAUNCH_REGRESSION_CHECKLIST.md` (L0–L6 + I.1–I.9 + v0.2.1 rows L1.7, L2.7, L2.8, L4.6–L4.9, L5.5). Any red row blocks launch.

All **parked** conflicts (Section 3) are documented as Addendums A–I in v0.2 §12 and the launch plan §10. None gate the Telegram MVP.

**Recommendation:** Proceed with v0.2.1 as the cutover spec. Re-open the parked items only on their stated triggers, using the Section 4 alternatives as the default path of least secondary conflict.
