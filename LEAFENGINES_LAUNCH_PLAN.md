# LeafEngines™ Launch Plan — v0.2

**Status:** Redraft. Supersedes the v0.1 draft reviewed earlier in chat.
**Companion doc:** `LEAFENGINES_BOT_ARCHITECTURE_v0.2.md` (Telegram channel addendum).
**Posture:** Current codebase is the reference. Every phase is sized to what already exists; net-new contracts are isolated into addendums so they cannot block the launch.

> **How to read this plan:** Each phase declares **Reuses**, **Adds**, and **Does NOT touch**. If a v0.1 line item is not here, it was moved to §10 (Addendums) and is not on the launch critical path.

---

## 0. What changed from v0.1

| v0.1 assumption | v0.2 correction | Source of truth |
|---|---|---|
| Greenfield architecture | Treat `supabase/functions/*` and Core memory as immovable | Codebase + `mem://index.md` |
| `mcp-server` re-issues `x-free-tier` downstream | `x-free-tier` is inbound-only for `get-soil-data` / `county-lookup` | Core memory |
| Dual meter on `api_keys` in Phase 1 | Single meter (`daily_call_count`) in launch; dual meter is Addendum A | `api_keys` schema |
| Direct-provider LLM failover (Groq/AI Studio/Together) | Lovable AI Gateway is the sanctioned LLM path | Core memory |
| New `ak_` key prefix | Keep `SS_API_{prefix}_2025` hash format; `ak_` is Addendum C | Core memory + `tiered-api-key-automation` |
| Telemetry → `service_role` rewrite | Reuse existing `mcp_tool_call_log` + `access_source` column | `mcp_tool_call_log` |
| New `prompt_versions` table | Inline `PROMPT_VERSION` constant per function; promote later | YAGNI |
| Tier rename rollout inside launch | Launch uses current legacy keys + `create-checkout` aliases | `ssp-tier-renaming-option-a` |
| SDK v3 jump inside launch | Stay on v2.x; v3 is Addendum C with regen of all 6 SDKs | `multi-language-sdk-generation` |
| Photos as inline base64 | Storage signed URL pattern (2 MB inbound limit) | `edge-function-payload-and-concurrency-limits` |

**Net effect:** the launch ships behind the same contracts the codebase already enforces. None of the 25 cross-cutting gaps from the prior review are gates on shipping.

---

## 1. Launch scope (what "launched" means)

A user, an AI agent, or a partner can reach LeafEngines through **four channels**, all backed by the existing `mcp-server` and existing tool functions:

1. **Web app** (`app.soilsidekickpro.com`) — already shipped; SEO + structured data hardening in Phase L1.
2. **Public MCP** (`mcp-server` edge function) — already shipped; tightened auth, rate, and audit in Phase L2.
3. **QGIS plugin** — already shipped; ping telemetry + key onboarding polish in Phase L3.
4. **Telegram bot** — new in Phase L4, per the v0.2 bot architecture addendum.

Anything not in these four channels is parked in §10.

---

## 2. Invariants the launch must not break

Pulled directly from Core memory and existing code. Any phase that would violate one of these stops at design review.

- API keys stored as SHA-256 with format `SS_API_{prefix}_2025`.
- `APP_ENCRYPTION_KEY` (Supabase Secrets) is the only source for envelope encryption.
- 500 m positional-uncertainty write-inhibition lock stays in force.
- Edge function payloads ≤ 2 MB, concurrency ≤ 50 → use pagination and signed URLs.
- Authenticated routes require the `app.` subdomain; public discovery uses the `x-free-tier` header on `get-soil-data` and `county-lookup` only.
- All Edge Function PII uses V3 AES-256 encryption.
- Every SECURITY DEFINER function declares `search_path = ''`.
- Permissive API rule: do not block validly authenticated requests on downstream failure; log to `/api-error-triage`.
- Lovable AI Gateway is the sanctioned LLM path.
- Marketing copy never exposes algorithmic specifics.

These appear as a checklist on each phase's exit criteria.

---

## 3. Phase L0 — Pre-flight (codebase truthing)

**Reuses:** existing test suites, `supabase--linter`, `security--get_scan_results`.
**Adds:** nothing.
**Does NOT touch:** schema, functions, secrets.

Tasks:
1. Run `supabase--linter` → zero ERROR-level findings before any phase opens.
2. Run `security--run_security_scan` → resolve or document every CRITICAL/HIGH.
3. Snapshot current `api_keys`, `subscribers`, and `mcp_tool_call_log` row counts as launch baseline.
4. Confirm `LOVABLE_API_KEY`, `APP_ENCRYPTION_KEY`, `MAPBOX_TOKEN`, `TELEGRAM_API_KEY` (if Telegram in scope) are present in Supabase Secrets.

**Exit criteria:** linter clean, scan clean, baseline recorded.

---

## 4. Phase L1 — Web surface readiness

**Reuses:** `src/components/SEO.tsx`, `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`, existing JSON-LD blocks, `react-helmet-async` provider.
**Adds:** route-level metadata for the 12 pages that currently fall back to the index `<title>`. One JSON-LD `FAQPage` per existing FAQ-style page (FAQ, Pricing, MCP Documentation).
**Does NOT touch:** routing, business logic, design tokens.

Tasks:
1. Audit pages in `src/pages/` — every page renders `<SEO />` with unique `title`, `description`, `canonical`.
2. Confirm sitemap covers public routes; private routes stay out.
3. Verify `og-image.jpg` references resolve on the published domain.
4. Republish so the Lovable Lighthouse scanner sees the current build (the lingering "Lighthouse score" finding is build-version, not code).
5. Optional: connect Google Search Console via the Lovable connector and verify ownership.

**Exit criteria:** SEO findings list shows 0 remaining structural items; only "GSC connection" and "Lighthouse rescore" remain, both user-action.

---

## 5. Phase L2 — Public MCP hardening

**Reuses:** `supabase/functions/mcp-server/`, `api_keys`, `rate_limit_tracking`, `mcp_tool_call_log`, `api-error-triage`.
**Adds:** small, scoped patches inside `mcp-server` and `_shared/request-handler.ts`.
**Does NOT touch:** tool function signatures, tier model, key hash format, LLM path.

Tasks:
1. **Audit redaction:** extend `mcp_tool_call_log` redaction list to strip `image_url`, `signed_url`, `lat`/`lon` rounded > 4 decimals.
2. **Per-channel breaker scope:** introduce a `channel` key in the existing circuit-breaker registry so OEM/Skyline sub-100 ms paths cannot trip on a Groq-style upstream slowness (defensive — protects existing SLAs from later addendums).
3. **`x-free-tier` invariant test:** add a Deno test that fails if any function other than `get-soil-data` / `county-lookup` honors the header.
4. **`ai-plugin.json` truthing:** the file advertises 10 tools; reconcile with `mcp-server`'s actual handler list. If a tool is unimplemented, remove from `ai-plugin.json` rather than stub it.
5. **Permissive-growth audit:** any tool that currently throws on downstream failure for an *authenticated* caller is rewritten to soft-degrade and post to `/api-error-triage`. Anonymous callers keep current behavior.
6. **`search_path = ''` sweep:** confirm every SECURITY DEFINER function declares it. The migration that adds them is one ALTER FUNCTION batch.

**Exit criteria:** Deno test green, `ai-plugin.json` matches handler list, redaction sample log shows no PII, linter still clean.

---

## 6. Phase L3 — QGIS plugin polish

**Reuses:** `plugins/qgis-leafengines/*`, `plugin-ping` edge function, `mcp_tool_call_log`.
**Adds:** README updates, an in-plugin "paste your key" tour that links to `app.soilsidekickpro.com/api-keys`, version bump to track the launch.
**Does NOT touch:** API response shape (so plugin keeps working without a new SDK).

Tasks:
1. Confirm `plugin-ping` is recording version, OS, QGIS version (it does).
2. Verify the plugin works against a free-tier key (single meter, current quota).
3. Update `plugins/qgis-leafengines/README.md` with launch URL and key-issuance flow.
4. No SDK regen — the response shape is unchanged.

**Exit criteria:** plugin install → ping → free-tier `county_lookup` succeeds end-to-end.

---

## 7. Phase L4 — Telegram bot (per addendum)

Driven entirely by `LEAFENGINES_BOT_ARCHITECTURE_v0.2.md`. Summary inside the launch plan:

**Reuses:** `mcp-server`, `api_keys`, `rate_limit_tracking`, `mcp_tool_call_log`, `api-health-monitor`, Lovable AI Gateway via existing tools, Telegram connector gateway.
**Adds:** `telegram-webhook` edge function, `telegram_link` table, `api_keys.channel` column, Storage bucket `telegram-uploads`.
**Does NOT touch:** tool function signatures, tier model, LLM provider chain, `x-free-tier` contract, SDK shape.

Phase order (T0 → T1.7) is documented in the bot architecture addendum §10. The launch plan tracks it as a single milestone with one acceptance gate (addendum §13).

---

## 8. Phase L5 — Observability & support readiness

**Reuses:** `api-health-monitor`, `mcp_tool_call_log`, `api-error-triage`, Stripe metered billing, Founders auto-upgrade thresholds.
**Adds:** one launch-week dashboard view that filters `mcp_tool_call_log` by `access_source` (web | mcp | qgis | telegram) and one alert on error-triage queue depth.
**Does NOT touch:** Stripe SKU model, metering shape, Founders thresholds.

Tasks:
1. Confirm `api-health-monitor` covers: web origin, `mcp-server`, Lovable AI Gateway probe, Mapbox token probe, Telegram `getMe` probe (added in L4).
2. Confirm `/api-error-triage` is reachable and admin-only; add the queue-depth alert.
3. Confirm Stripe metered billing event handler runs against `api_keys.daily_call_count` (single meter).
4. Founders auto-upgrade thresholds (500 / 5 k / 25 k) stay on total calls; a Telegram-only key is excluded until linked (per addendum §8).

**Exit criteria:** dashboard renders, alert fires on synthetic error, Stripe test event reconciles.

---

## 9. Phase L6 — Documentation & compliance final pass

**Reuses:** existing `GDPR_ROPA_CONTROLLER.md`, `GDPR_DPIA_TEMPLATE.md`, `API_DOCUMENTATION.md`, `docs/MCP_SERVER_SPECIFICATION.md`.
**Adds:** Telegram sub-processor row in ROPA; channel column in the API usage docs; launch entry in `SDK_CHANGELOG.md` noting "no SDK changes, channel launch only."
**Does NOT touch:** OEM HIL validation docs, ISA TRAQ/GMP/FDA compliance corpus, marketing pages (per Marketing Secrecy rule).

**Exit criteria:** ROPA delta merged, changelog reflects "channel launch, SDK unchanged."

---

## 10. Addendums (parked, each independently shippable)

Each addendum is a full design + migration in its own document. None block launch.

| ID | Title | Triggered by |
|---|---|---|
| A | Dual metering & Stripe SKU split | Pricing change that charges differently for AI vs. data calls |
| B | LLM router & cost caps (multi-provider) | Lovable AI Gateway cost ceiling or provider outage SLA breach |
| C | SDK v3 / `ak_` key prefix migration | External SDK consumers requiring new prefix; needs 6-language regen |
| D | Multi-channel router (WhatsApp, SMS) | Confirmed second messaging channel demand |
| E | Prompt versioning store | Addendum D |
| F | Operator console + MFA | Support volume or compliance audit |
| G | SSP tier rename rollout (Hobby/Grower/Pro) | Marketing-led cutover window |
| H | Telemetry scale-out (Protobuf/Redis Streams, 100 k msg/min) | Sustained > 10 k msg/min sustained on `mcp_tool_call_log` |
| I | Offline plant-ID GA on WebGPU | Hardware coverage report + battery-impact study |

---

## 11. Sequencing & dependencies

```text
L0 (pre-flight)
 ├── L1 (web SEO)            ── independent
 ├── L2 (MCP hardening)      ── independent
 ├── L3 (QGIS polish)        ── depends on L2 (ai-plugin.json truthing)
 ├── L4 (Telegram)           ── depends on L2 (redaction extension)
 └── L5 (observability)      ── depends on L1..L4 endpoints existing
        └── L6 (docs/compliance) ── depends on L5
```

L1, L2, L3 can ship in parallel. L4 follows L2. L5 is the consolidation gate. L6 closes the launch.

No circular dependencies (v0.1's Phase 2.1 ↔ 1.7 loop is dissolved because dual-meter is removed from launch scope).

---

## 12. Acceptance criteria for "launched"

All of the following true on the same day:

1. **L0:** linter and security scan clean, no new ERROR-level findings.
2. **L1:** every public page returns unique title + description + canonical; sitemap valid.
3. **L2:** `mcp-server` matches `ai-plugin.json` 1:1; redaction test green; `x-free-tier` invariant test green; `search_path = ''` sweep complete.
4. **L3:** QGIS plugin installs and runs a free-tier query against current API.
5. **L4:** Telegram MVP meets the eight acceptance points in bot architecture §13.
6. **L5:** dashboard live with channel filter; health probes green; Stripe test event reconciles.
7. **L6:** ROPA includes Telegram sub-processor row; `SDK_CHANGELOG.md` reflects channel-only launch.
8. **Invariants:** every item in §2 verified by spot-check or test.

---

## 13. Risk register (launch-scoped only)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Telegram photo flow hits 2 MB inbound limit | Medium | Medium | Signed-URL Storage pattern (addendum §6); reject inline base64 |
| `ai-plugin.json` drift causes agent calls to non-existent tools | Medium | High | L2 task 4 reconciles before launch; Deno test guards |
| Lovable AI Gateway quota saturation under launch traffic | Low | High | L5 dashboard + Permissive-Growth soft-degrade; Addendum B if sustained |
| Free-tier abuse on Telegram `/start` auto-key creation | Medium | Low | Per-IP rate limit in `rate_limit_tracking`; captcha promoted from Addendum F if observed |
| Stripe metering event drift after channel additions | Low | Medium | L5 test event reconciliation; single-meter model preserved in launch |
| Compliance auditor flags new Telegram sub-processor | Low | Medium | L6 ROPA delta done before launch announcement |

---

## 14. Out-of-scope statement (explicit)

The launch does **not** ship: dual metering, direct-provider LLM failover, `ak_` key prefix, SSP tier rename, SDK v3, operator console, WhatsApp, prompt-version store, offline plant-ID GA, or any change to OEM/Skyline/HIL contracts. Each is independently planned in §10.

---

## 15. Diff summary against v0.1

- **Removed from launch:** dual meter, LLM router rewrite, SDK v3, `ak_` migration, tier rename, prompt store, operator console.
- **Reframed as addendums (§10):** all of the above, plus telemetry scale-out and offline-GA.
- **Preserved:** the goal (four-channel public launch), web SEO hardening, MCP audit hardening, QGIS readiness, Telegram MVP, observability, compliance close-out.
- **Net new code surface introduced by the launch itself:** Phase L4's one edge function + one table + one column + one bucket. Everything else is configuration, tests, docs, and small patches inside existing files.

This is the launch the current codebase can support without forcing any of the cross-cutting decisions deferred to the addendums.

---

## 16. v0.2.1 Patch — Gap Closures

Folds eight previously unaccounted-for gaps into the launch. Each is small, scoped, and does not reopen any addendum. Phase letter suffixes (`.x`) keep numbering stable.

### L1.x — Web

- **L1.7 `/link` one-time-code issuance UI.** New authenticated page at `app.soilsidekickpro.com/link-telegram`. Generates a 6-char code, writes to `rate_limit_tracking` with `kind='telegram_link_code'`, TTL 10 min, displays the code + a `t.me/<bot>?start=<code>` deep link. Owner: eng. Depends on L4.0.

### L2.x — MCP / Backend

- **L2.7 `channel` column backfill.** Migration sets `api_keys.channel = 'web'` where null at cutover. One-line SQL in the L4.0 migration. Owner: eng.
- **L2.8 Founders auto-upgrade constraint for unlinked Telegram keys.** Update `founders-auto-upgrade` function (or trigger) to skip rows where `channel = 'telegram' AND linked_user_id IS NULL` (joined via `telegram_link`). Owner: eng.

### L4.x — Telegram

- **L4.6 Storage RLS policy text for `telegram-uploads`.** Bucket private. Policies: `service_role` full access; no anon/authenticated SELECT (signed URLs only). Lifecycle: 24 h object expiry. Specified in the L4.0 migration body. Owner: eng.
- **L4.7 Inbound `/start` rate-limit.** 1 `/start` per source IP per hour via `rate_limit_tracking` (`kind='telegram_start'`). Webhook returns a polite throttle reply on breach. Owner: eng.
- **L4.8 Telegram-only SAR amendment.** Append one paragraph to `GDPR_SAR_PROCEDURE.md` describing how a Telegram-only user (no `auth.users` row) proves identity via `telegram_user_id` + a fresh `/start` code, and how erasure deletes `telegram_link` + cascades the `api_keys` row + purges `telegram-uploads/{telegram_user_id}/`. Owner: compliance.
- **L4.9 Rollback runbook.** New section in `OPERATIONAL_MAINTENANCE.md`: (a) `deleteWebhook` via connector gateway, (b) `UPDATE api_keys SET is_active=false WHERE channel='telegram'`, (c) flip feature flag `TELEGRAM_BOT_ENABLED=false`, (d) post status page note. Owner: ops.

### L5.x — Observability

- **L5.5 Lovable AI Gateway cost-ceiling alert for Telegram traffic class.** Threshold: `channel='telegram'` daily LLM-call cost > $X (X set by ops at cutover). Alert fires to the same channel as the triage-queue alert (L5.2). Owner: ops.

### Dependency delta

- L1.7 depends on L4.0 (needs `telegram_link` table to exist).
- L2.7, L2.8, L4.6, L4.7 fold into the existing L4.0 migration — no new migration file.
- L4.8, L4.9, L5.5 are doc/config only.

### Acceptance gate addition

All 8 items must show pass evidence in the regression checklist v0.2.1 rows before Go/No-Go.

### Out-of-scope reaffirmed

This patch does **not** introduce: a new auth provider, a second meter, a new LLM route, an SDK regen, or any change to existing `mcp-server` tool contracts.
