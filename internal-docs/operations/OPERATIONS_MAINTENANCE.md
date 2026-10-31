# Operational and Maintenance Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Platform / Operations
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Service inventory

React/Vite hosted web application; Supabase Postgres/Auth/Storage and Deno edge functions; Lovable AI Gateway; Stripe; upstream USDA/EPA/weather/satellite services. PHP is a distributed client SDK, not a server-side component of this application.

Application entry: app.soilsidekickpro.com. Public docs: docs.leafengines.com. Sandbox and direct function URLs are separate surfaces. Staging, monitoring integrations, on-call staffing and provider configuration must be verified rather than inferred from prior runbook examples.

## 2. Change and deployment runbook

1. Scope the affected source/contracts, secrets, risks and rollback limitations.
2. Run relevant tests and docs exposure checks; record skipped credential-dependent tests.
3. Apply approved function/web/database changes through their respective deployment paths.
4. Verify the deployed central flow using a real authorized account/input and read the result back.
5. Inspect runtime/network errors and measured latency; update docs and change records.

A docs-only refresh does not deploy functions or prove the published site changed. Do not use fictional SQL helpers, scheduled jobs or one-click database rollback as established procedures.

## 3. Water/cache incident runbook

Inspect the provider, cache key, stored expires_at, actual observation/retrieval times, cache level and volatility/ttl logs without PII. Confirm whether the path is fixed-window or adaptive. Cache MISS refresh is request-driven; background refresh and stale fallback can retain old data. Validate persisted expiration separately from a successful-looking log.

For empty stations/results or source failure, report missing coverage, station/density distance method, failed nutrient retrieval and regional fallback distinctly. Do not infer clean water from absent readings. Escalate unit inconsistencies and unbounded stale use; these controls are corrective work, not already fixed.

## 4. AI/controller incident runbook

For local failure, inspect browser/device/model availability; cloud fallback requires network and applicable privacy approval. Do not promise full offline cloud-data access. For VRT failures, inspect method (AI, rule-based, uniform) and geometry; treat generated exports as review-required, not equipment-ready. Do not load placeholder zones or demo identities into operational controllers. Require agronomist review, independent validation, vendor import and HIL before operation.

## 5. Offline and positional incidents

Preserve queued entries and inspect replay errors/table identity. Do not repeatedly replay creates assuming exactly-once delivery. The >500m write prohibition is mandatory; inspected sync and asset entry points lack explicit enforcement, so treat this as an open high-priority integrity gap. A UI warning alone is not a persistence control.

## 6. Security, billing and dependencies

Keep APP_ENCRYPTION_KEY/provider keys in Supabase Secrets and rotate with an approved migration/re-encryption procedure. Confirm field coverage, successful rotation and grants in the actual environment. Never print secrets or store private keys in source. Reconcile usage and Stripe events with bounded replay/idempotency rather than blindly repeating charges.

PHP client dependency floors are Guzzle ^7.9, PSR-7 ^2.7, PHPUnit ^10.5 (development) and PHP ^8.1. Composer/PHP execution is not validated here; dependency floors alone do not certify the SDK safe or published.

## 7. SLOs, backups and incident communications

99.9% availability, <300ms general API p95 aspiration and recovery objectives are targets/contract-dependent, not current measured facts. Confirm backup/PITR retention, regions, restore procedures and actual incident escalation contacts from provider settings and contracts. Do not infer PagerDuty, Slack, Sentry, WORM storage, automatic failover or restore-drill execution from this document.

Breach notification timing depends on jurisdiction, awareness and risk; legal must determine authority/customer notices. Preserve evidence and use approved communication channels. Maintenance windows, freeze exceptions and personnel approvals require an actual change record.

## 8. Routine review

Review dependency advisories, live RLS/grants, redaction, source freshness, cache behavior, quotas/billing and restore evidence. Public document publication requires allowlist and content review. Keep internal procedures/internal IP out of public docs.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
