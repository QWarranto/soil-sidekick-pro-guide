# LeafEngines™ Launch Regression Checklist

**Companion to:** `LEAFENGINES_LAUNCH_PLAN.md` v0.2 and `LEAFENGINES_BOT_ARCHITECTURE_v0.2.md`.
**Purpose:** One row per acceptance criterion, with the exact command, query, or manual step that proves it. Run top-to-bottom on the release candidate before flipping launch traffic.

**Legend**
- **Type** — `auto` (machine-executable) · `manual` (human verifies) · `tool` (Lovable agent tool)
- **Owner** — `eng`, `qa`, `ops`, `compliance`, `marketing`
- **Pass** — exact observable outcome that constitutes a green check

---

## Phase L0 — Pre-flight

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L0.1 | Linter clean (zero ERROR) | tool | eng | Run `supabase--linter` | `errors: []` in response |
| L0.2 | Security scan clean (no open CRITICAL/HIGH) | tool | eng | Run `security--run_security_scan`, then `security--get_scan_results` | All CRITICAL/HIGH in `ignored` or `resolved`; document each ignored in security memory |
| L0.3 | Baseline row counts recorded | auto | qa | `psql -c "select 'api_keys' t, count(*) from public.api_keys union all select 'subscribers', count(*) from public.subscribers union all select 'mcp_tool_call_log', count(*) from public.mcp_tool_call_log;"` | Output pasted into release ticket as `L0_BASELINE` |
| L0.4 | Required secrets present | tool | eng | `secrets--fetch_secrets` | Names returned include `LOVABLE_API_KEY`, `APP_ENCRYPTION_KEY`, `MAPBOX_TOKEN`, `TELEGRAM_API_KEY` (if L4 in scope), `SUPABASE_SERVICE_ROLE_KEY` |

---

## Phase L1 — Web surface readiness

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L1.1 | Every public page renders unique `<title>` | auto | qa | `for p in / /pricing-new /faq /features /api-docs /mcp-documentation /founders-program /affiliate-dashboard /privacy-policy /disclaimer; do curl -s "https://soil-sidekick-pro-guide.lovable.app$p" \| grep -oE '<title>[^<]+</title>' \| head -1; done \| sort -u \| wc -l` | Count equals number of pages tested (all titles unique) |
| L1.2 | Each page has `<meta name="description">` and `<link rel="canonical">` | auto | qa | Same loop, `grep -E 'name="description"\|rel="canonical"'`; assert two matches per page | Two matches per URL |
| L1.3 | Sitemap valid and reachable | auto | qa | `curl -fsS https://soil-sidekick-pro-guide.lovable.app/sitemap.xml \| xmllint --noout -` | Exit 0; no parse errors |
| L1.4 | robots.txt references sitemap | auto | qa | `curl -fsS https://soil-sidekick-pro-guide.lovable.app/robots.txt \| grep -i '^sitemap:'` | One non-empty match |
| L1.5 | `llms.txt` present | auto | qa | `curl -fsS -o /dev/null -w "%{http_code}" https://soil-sidekick-pro-guide.lovable.app/llms.txt` | `200` |
| L1.6 | Open Graph image resolves | auto | qa | `curl -fsS -o /dev/null -w "%{http_code}" https://soil-sidekick-pro-guide.lovable.app/og-image.jpg` | `200` |
| L1.7 | Organization + WebSite JSON-LD present on `/` | auto | qa | `curl -s https://soil-sidekick-pro-guide.lovable.app/ \| grep -c 'application/ld+json'` | `>= 2` |
| L1.8 | FAQPage JSON-LD present on `/faq` | auto | qa | `curl -s https://soil-sidekick-pro-guide.lovable.app/faq \| grep -c '"@type":"FAQPage"'` | `>= 1` |
| L1.9 | SEO scanner findings list resolved | tool | qa | `seo_chat--list_findings { states: ["failing"] }` | Only "GSC connection" + "Lighthouse rescore" remain; everything else resolved or ignored with rationale |
| L1.10 | Republish completed so Lighthouse rescans current build | manual | ops | Trigger Publish; record publish timestamp | New publish timestamp > release-candidate commit time |

---

## Phase L2 — Public MCP hardening

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L2.1 | `ai-plugin.json` tool list matches `mcp-server` handlers 1:1 | auto | eng | `bunx tsx scripts/check-mcp-tools.ts` (compare `public/.well-known/ai-plugin.json` keywords/MCP tool list vs. handler switch in `supabase/functions/mcp-server/index.ts`) | Diff empty |
| L2.2 | `x-free-tier` invariant test (only `get-soil-data`, `county-lookup` honor it) | auto | eng | `bunx vitest run src/test/freeTierInvariant.test.ts` | Test green |
| L2.3 | Authenticated tool soft-degrades on downstream failure, logs to `/api-error-triage` | auto | eng | `supabase--curl_edge_functions { path: "/agricultural-intelligence", method: "POST", headers: { "x-api-key": "<test-key>", "x-force-upstream-fail": "1" }, body: "{}" }`; then `psql -c "select count(*) from public.api_error_triage where created_at > now() - interval '2 minutes';"` | Response is 200 with `confidence:"low"` and `source:"estimated"`; triage count `>= 1` |
| L2.4 | Anonymous caller without key still rejected on protected tool | auto | eng | `supabase--curl_edge_functions { path: "/agricultural-intelligence", method: "POST", body: "{}" }` | Status `401` |
| L2.5 | Free-tier discovery works on `get-soil-data` via header | auto | eng | `supabase--curl_edge_functions { path: "/get-soil-data", method: "POST", headers: { "x-free-tier": "true" }, body: '{"fips":"19169"}' }` | Status `200`, body has `data.envelope` |
| L2.6 | MCP audit log redaction strips `image_url`, `signed_url`, high-precision lat/lon | auto | qa | After L4.3 photo run: `psql -c "select tool_arguments from public.mcp_tool_call_log where tool_name='safe_identification' order by created_at desc limit 1;"` | No `image_url`, no `signed_url`, lat/lon ≤ 4 decimals |
| L2.7 | All SECURITY DEFINER functions declare `search_path = ''` | auto | eng | `psql -c "select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and not coalesce(p.proconfig::text,'') like '%search_path=%';"` | Zero rows |
| L2.8 | Per-channel circuit-breaker scope (OEM/Skyline not tripped by LLM slowness) | auto | eng | `bunx vitest run src/test/breakerChannelScope.test.ts` | Test green |
| L2.9 | No new ERROR-level linter findings introduced | tool | eng | `supabase--linter` | Diff vs. L0.1 = ∅ |

---

## Phase L3 — QGIS plugin polish

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L3.1 | `plugin-ping` accepts a valid ping | auto | qa | `supabase--curl_edge_functions { path: "/plugin-ping", method: "POST", headers: { "x-plugin-ping": "true" }, body: '{"version":"RC","qgis_version":"3.34","python_version":"3.11","os":"linux","machine":"x86_64"}' }` | `{ ok: true }` |
| L3.2 | Ping recorded in `mcp_tool_call_log` | auto | qa | `psql -c "select 1 from public.mcp_tool_call_log where tool_name='qgis_plugin_ping' and tool_arguments->>'plugin_version'='RC' order by created_at desc limit 1;"` | One row |
| L3.3 | Plugin runs free-tier `county_lookup` end-to-end | manual | qa | Install plugin, paste free-tier key, query "Story County, Iowa" | Returns FIPS `19169` |
| L3.4 | Plugin README points to launch URL + key-issuance flow | manual | eng | Open `plugins/qgis-leafengines/README.md` | Contains `https://app.soilsidekickpro.com/api-keys` |
| L3.5 | API response shape unchanged (no SDK regen needed) | auto | eng | `bunx vitest run sdks/test-sdk.ts` | Test green |

---

## Phase L4 — Telegram bot (per addendum §13)

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L4.1 | `/start` creates `telegram_link` + `api_keys` row atomically; duplicate `update_id` is no-op | auto | qa | Send `/start` twice with same `update_id` via `supabase--curl_edge_functions { path:"/telegram-webhook", method:"POST", headers:{ "X-Telegram-Bot-Api-Secret-Token":"<derived>" }, body: <update json> }`; then `psql -c "select count(*) from public.telegram_link where telegram_user_id=<id>; select count(*) from public.api_keys where channel='telegram' and id=(select api_key_id from public.telegram_link where telegram_user_id=<id>);"` | Both counts = `1` |
| L4.2 | `/county Story County, Iowa` returns FIPS in < 2 s P95 | auto | qa | Loop 20 invocations through webhook fixture; record durations | P95 < `2000 ms`; response text contains `19169` |
| L4.3 | `/identify` with 4 MB photo succeeds via Storage signed URL | manual | qa | Send Telegram photo (4 MB) → check Storage bucket `telegram-uploads` for object → check Telegram reply contains identification result | Object created with TTL; reply received < 10 s; no 413/`payload too large` |
| L4.4 | `mcp_tool_call_log` rows show `access_source='telegram'` and no `image_url` in args | auto | qa | `psql -c "select access_source, tool_arguments ? 'image_url' has_url from public.mcp_tool_call_log where created_at > now() - interval '15 minutes' and access_source='telegram';"` | Every row: `access_source='telegram'`, `has_url=false` |
| L4.5 | `api-health-monitor` reports `telegram: ok` | auto | ops | `supabase--curl_edge_functions { path: "/api-health-monitor", method: "GET" }` | JSON contains `"telegram":"ok"` |
| L4.6 | Webhook rejects missing/mismatched `X-Telegram-Bot-Api-Secret-Token` | auto | qa | Two calls: (a) header omitted, (b) header = `"wrong"` | Both return `401` |
| L4.7 | No regression to existing MCP tool contracts | auto | eng | `bunx vitest run` (full suite) | All previously-passing tests still green |
| L4.8 | ROPA includes Telegram sub-processor row | manual | compliance | Open `GDPR_ROPA_CONTROLLER.md` | Row with `processor=Telegram`, `purpose=message transport`, `data=user id, chat id, text, photo URL` |

---

## Phase L5 — Observability & support readiness

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L5.1 | Channel-filtered dashboard renders | manual | ops | Open API Usage Analytics page, filter by `access_source` for web / mcp / qgis / telegram | Each filter returns ≥ 1 row from L1–L4 test traffic |
| L5.2 | Triage queue-depth alert fires on synthetic error | auto | ops | Insert one synthetic row: `psql -c "insert into public.api_error_triage(provider, error_class, payload) values ('synthetic','provider-cascade-exhausted','{}'::jsonb);"`; wait for alert | Alert delivered within 5 minutes |
| L5.3 | `api-health-monitor` covers web / mcp / Lovable AI Gateway / Mapbox / Telegram | auto | ops | `supabase--curl_edge_functions { path:"/api-health-monitor", method:"GET" }` | All five keys present with status |
| L5.4 | Stripe test metering event reconciles | auto | ops | Trigger `stripe-usage-sync` against test key with 1 known call; query Stripe dashboard or API for event count | Event count delta = `1` |
| L5.5 | Founders thresholds (500 / 5 k / 25 k) still trigger on total `daily_call_count` | auto | eng | `bunx vitest run src/test/foundersThresholds.test.ts` | Test green; Telegram-only key (unlinked) excluded |
| L5.6 | Single meter unchanged on `api_keys` | auto | eng | `psql -c "select column_name from information_schema.columns where table_name='api_keys' and column_name in ('daily_ai_count','daily_data_count');"` | Zero rows (dual meter not introduced) |

---

## Phase L6 — Documentation & compliance final pass

| # | Acceptance criterion | Type | Owner | Exact step | Pass |
|---|---|---|---|---|---|
| L6.1 | ROPA Telegram row merged | manual | compliance | `git log -1 --format=%H -- GDPR_ROPA_CONTROLLER.md` | Commit hash present in release branch |
| L6.2 | `SDK_CHANGELOG.md` records "channel launch, SDK unchanged" | manual | eng | Open `SDK_CHANGELOG.md` | New entry with launch date, "no SDK changes" |
| L6.3 | API docs note `access_source` column | manual | eng | Open `API_DOCUMENTATION.md` | Section references the new column and channel values |
| L6.4 | Marketing copy free of algorithmic specifics | manual | marketing | Diff marketing pages vs. previous release | No mention of model names, KV-cache details, provider chain, encryption internals |

---

## Invariant spot-checks (run alongside any phase, not gated to one)

These map to §2 of the launch plan. Each must remain true at launch cutover.

| # | Invariant | Exact step | Pass |
|---|---|---|---|
| I.1 | API key hash format `SS_API_{prefix}_2025` | `psql -c "select count(*) from public.api_keys where key_hash !~ '^[a-f0-9]{64}$';"` | Zero (all hashes are 64-hex SHA-256) |
| I.2 | `APP_ENCRYPTION_KEY` sourced from Supabase Secrets | `secrets--fetch_secrets` | Name listed; not present in any committed file (`rg -n 'APP_ENCRYPTION_KEY\\s*=' \| grep -v 'Deno.env.get'` returns nothing) |
| I.3 | 500 m write-inhibition lock active | `bunx vitest run src/test/writeInhibition.test.ts` | Test green |
| I.4 | Edge function payload ≤ 2 MB enforced upstream of base64 inline | `supabase--curl_edge_functions` with 3 MB body to `/safe-identification` | Response `413` or rejection before reaching tool |
| I.5 | `app.` subdomain enforced for authenticated routes | `curl -sS -o /dev/null -w "%{http_code}" https://web.soilsidekickpro.com/dashboard` vs. `https://app.soilsidekickpro.com/dashboard` | `web` redirects or 401; `app` returns 200 when authenticated |
| I.6 | V3 AES-256 encryption used on PII columns | `psql -c "select count(*) from public.user_secure_data where encryption_version <> 'v3';"` (or equivalent table per Encryption Hardening memory) | Zero |
| I.7 | Lovable AI Gateway is the only LLM path | `rg -n 'api.openai.com\|api.groq.com\|generativelanguage.googleapis.com\|api.together.xyz' supabase/functions/` | Zero matches |
| I.8 | Permissive-Growth: authenticated 5xx writes a triage row | Re-use L2.3 evidence | Same as L2.3 |
| I.9 | Marketing Secrecy | Re-use L6.4 evidence | Same as L6.4 |

---

## Go / No-Go gate

Launch is **GO** only when:
- Every row in L0–L6 has a pass observation linked in the release ticket.
- Every invariant I.1–I.9 spot-check is green within 24 h of cutover.
- No new CRITICAL/HIGH security findings since L0.2.
- `bunx vitest run` and `supabase--linter` re-run on the cutover commit are both clean.

Any single red row blocks launch until remediated or formally accepted (with a security-memory update if the acceptance touches a security finding).
