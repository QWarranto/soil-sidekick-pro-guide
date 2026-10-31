# Developer Specifications

**Last updated:** 2026-10-31
**Documentation revision:** October 31, 2026

## 1. Contract and distribution

Generated SDKs target TypeScript/JavaScript, Python, Go, Ruby, Java and PHP. The checked-in OpenAPI and generated TypeScript package declare 3.1.0; some Java/PHP artifacts still declare 3.0.0. Generator-tooling versions are not SDK versions. Registry publication, package identity and each language's actual API surface must be checked before installation.

The checked-in TypeScript package is `@soilsidekick/sdk` with Node >=18. Do not assume previously documented `@leafengines/sdk` classes, language adapters or runtime floors match every generated client.

## 2. Configure the correct endpoint

Declared production function base: `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1`. Use the function names and methods in [API Documentation](/docs/api/api-documentation), not invented `/soil` aliases. The app. domain is the authenticated dashboard entry, separate from direct function invocation.

Pass an issued `x-api-key` for supported integration endpoints. Keyless discovery uses `x-free-tier: true` only where permitted, including soil and county lookup. JWT access is endpoint-specific. Do not log keys, embed private credentials in browser bundles or assume a key prefix determines its entitlements.

## 3. Request/response handling

FIPS strings retain leading zeroes. Send JSON for JSON endpoints. Water requests use `fips_code`, `state_code`, `admin_unit_name`; planting requests use `crop_type`. Responses and errors are not globally uniform: inspect the endpoint shape. Preserve source/freshness/fallback metadata supplied, and treat absent confidence as unknown.

Honor returned quota headers/Retry-After where present. Retry bounded transient failures; do not retry invalid credentials or unsafe operation without correction. Client quotas, partner allowances and server/key entitlements are different layers; see the client configuration tables in the API reference, not old RPS/monthly totals.

## 4. Assets and GIS integration

Current assets behavior is owner-scoped GET (cap 1000), POST with optional idempotency, PATCH by id with optional If-Match and soft-delete. Repeated idempotency returns 200; supplied version mismatch returns 409. A 24h expiry, required 412 precondition, atomic concurrency protection or cursor paging is not established by the handler.

WFS offers public capabilities and authorized features, GeoJSON/point-oriented GML and a 5000 cap. Coordinate bbox filtering is not proven polygon intersection. Validate exact GIS/controller imports; format availability does not imply universal compatibility. Use API-key headers rather than query strings when possible.

## 5. Local and hosted AI

Browser-local text generation requires model/runtime initialization and supported device resources. WebGPU may fall back to WASM or fail initialization; cloud fallback requires connectivity. Local generation stays on-device, while selected hosted AI paths transmit context to the hosted service. Do not claim all reasoning is local or all cloud data available offline.

An implemented local schema-constrained agronomic-controller generation API is not established in this release. Function-calling flags are not strict output validation. Generated VRT drafts and exports require independent geometry, unit, rate, freshness and agronomic review before operation.

## 6. PHP client hardening

The current PHP manifest requires PHP ^8.1; Guzzle ^7.9; PSR-7 ^2.7; PHPUnit ^10.5 for development. Application runtime is React/Supabase edge functions, not PHP. Manifest floors do not establish installed lockfile safety, Composer compatibility, registry release or completed PHP execution tests.

## 7. Testing and version changes

Validate your installed SDK against the exact endpoint, credential mode and real response. Sandbox/demo responses are not production proof. Examples and source are not registry confirmation or automatic upgrade guarantees. API/SDK versions, docs review date and live deployment dates are independent.

For support, use the application's support channel and include endpoint, timestamp, request identifier, sanitized input and response—not tokens or sensitive customer data.
