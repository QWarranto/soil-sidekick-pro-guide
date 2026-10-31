# Security Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Security / Platform
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Objectives and assurance limits

Protect identity, customer data and field-record integrity. Source controls and migrations are evidence of implementation intent; deployed settings, least privilege, penetration results and independent audit attestations require their own verification. Do not claim all tables protected, SOC 2 certified, admin MFA enforced, immutable logs or universal mTLS from repository text alone.

## 2. Authentication and trust boundaries

Supabase Auth sessions use preview-aware persistent storage; localStorage can store sessions outside/within preview handling. XSS and session theft remain relevant risks. Do not claim all app authentication uses HttpOnly cookies. Public CORS is not authentication. Verify hosted signup, MFA/session and security-header settings independently.

API keys should be SHA-256 hashed and owner/tier scoped. Shared validation is separate from assets-crud/wfs-export, which compare incoming values directly to key_hash/key_hash_v2 columns. Their hashing interoperability and injection-safe query construction need investigation. Do not assume consistent revocation, expiry or tier enforcement across handlers.

Roles belong in separate user_roles, not editable profile metadata. SECURITY DEFINER functions must use search_path = ''. Inventory deployed functions/grants to prove compliance. Service-role handlers bypass RLS; explicit owner checks and allowed-field restrictions are essential.

## 3. Data protection and secrets

V3 AES-256 PII protection uses APP_ENCRYPTION_KEY from Supabase Secrets, supplied explicitly to encryption helpers. No private keys/default keys may be hardcoded. Legacy migration/rotation compatibility remains in source; verify removal/migration coverage and rotation results before declaring all legacy data eliminated. Transport versions, field coverage, storage encryption and retention require hosted evidence.

## 4. Known safety/security gaps

- >500m uncertainty must STRICTLY inhibit persistence, but no uncertainty check is present in inspected offline create/update or assets-crud paths. Model reliability flags do not prove universal enforcement.
- Hosted VRT JSON parsing is not schema/domain validation; placeholder/overlapping geometry and demo controller context cannot establish safe operation.
- MCP parameter inference and auditing do not establish enforced OAuth scopes or safe autonomous tool permissions.
- Shared stale-cache fallback lacks a confirmed age ceiling. WQP units/completeness and station-distance semantics require validation.
- Input validation, sanitized errors, quotas and response envelopes vary by endpoint; avoid blanket guarantees.

Permissive resilience applies to validly authenticated advisory requests with non-critical upstream errors. It must never override authentication, least privilege, positional persistence inhibition or safety-critical operational validation.

## 5. Logging and response

Audit helpers/tables and compliance monitors exist; verify effective grants, redaction, completeness, retention and immutable export separately. Protect PII and tokens in prompts/logs. User-supplied documents, external observations and model/tool output are untrusted data. Independent validation and human approval are required for operational output.

Incident phases: detect, contain, preserve evidence, assess, remediate, recover and review. On-call staffing, timing and regulatory duties require actual procedures/legal confirmation, not invented contacts or fixed universal notification promises.

## 6. Dependency and development controls

PHP is only a client SDK; its floors now require PHP ^8.1, Guzzle ^7.9, PSR-7 ^2.7 and PHPUnit ^10.5. Java/PHP artifact versions can remain 3.0.0 despite TypeScript/OpenAPI 3.1.0. Composer, registry releases and current vulnerability scans are not validated in this revision.

Use code review, concrete regression tests, dependency scanning and live policy/grant checks. Public docs are allowlist-only and must not expose internal patent/security methodology. OEM operational use additionally requires applicable HMAC/mTLS/replay controls, manufacturer validation, HIL and dual safety sign-off; deployed certification is not inferred.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
