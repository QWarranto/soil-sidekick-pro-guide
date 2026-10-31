# API Documentation

**Last updated:** 2026-10-31
**Documentation revision:** October 31, 2026

**OpenAPI version in checkout:** 3.1.0  
**Declared function base URL:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1`

## 1. Scope and authentication

Use the declared function base URL plus the function name. The authenticated application/dashboard is `https://app.soilsidekickpro.com`. Do not assume an `/api/soil` gateway or sandbox alias is equivalent without checking its configuration.

| Method | Header | Scope |
|---|---|---|
| API key | `x-api-key: <issued key>` | Endpoint/key-specific entitlements |
| Public discovery | `x-free-tier: true` | Explicitly enabled endpoints; not all API operations |
| App session | `Authorization: Bearer <session token>` | Endpoints accepting user sessions |

`get-soil-data` and `county-lookup` support keyless discovery. Other public modes are endpoint-specific. Invalid credentials must not be assumed to fall back to public access. Use issued keys rather than relying on one historical key prefix. Confirm quota/auth behavior for the exact endpoint and account.

## 2. Core function names

| Function | Method | Purpose |
|---|---|---|
| `get-soil-data` | POST | County soil information |
| `county-lookup` | POST | County/FIPS discovery |
| `territorial-water-quality` | POST | Water observations and analysis |
| `multi-parameter-planting-calendar` | POST | Crop planting guidance |
| `agricultural-intelligence` | POST | Agricultural AI questions |
| `environmental-impact-engine` | POST | Environmental context |
| `seasonal-planning-assistant` | POST | Seasonal guidance |
| `smart-report-summary` | POST | Report summary |
| `generate-vrt-prescription` | POST | Review-required prescription draft |
| `assets-crud` | GET / POST / PATCH / DELETE | Managed records |
| `wfs-export` | GET | GIS feature export |
| `mcp-server` | POST | JSON-RPC MCP |

Additional endpoints and schemas are in the checked-in OpenAPI specification and interactive reference. Model/provider names and package versions are not API stability guarantees.

## 3. Soil example

```bash
curl \
  'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data' \
  -H 'Content-Type: application/json' \
  -H 'x-free-tier: true' \
  --data '{"county_fips":"48453","county_name":"Travis County","state_code":"TX"}'
```

FIPS is a five-character string; do not drop leading zeroes. Territorial-water inputs include `fips_code`, `state_code` and `admin_unit_name`; planting-calendar inputs use `county_fips` and `crop_type`, not `crop`. Inspect each function's current contract rather than copying unrelated examples.

## 4. Responses and errors

Responses are endpoint-specific. Soil can return `soilAnalysis` and `cache_info`; assets return `{ "data": ... }`; WFS returns GeoJSON/XML. A universal `{data, meta}` or structured error envelope is not guaranteed. Consume returned provenance/fallback indicators when available; do not manufacture missing confidence values.

Treat 401/403 as authentication/authorization failures, 429 as quota/rate limiting, and retry transient upstream errors only with bounded backoff. Some advisory endpoints return degraded data successfully. A successful response is not proof of agronomic or operational correctness.

## 5. Managed assets — current behavior

- GET returns non-deleted owner records, capped at 1000; `id` selects a record. No cursor contract is established here.
- POST may accept `Idempotency-Key`. An existing owner/key record returns 200 with `idempotent: true`; new creation returns 201. Do not rely on a documented 24-hour dedup window or atomic concurrent-create protection.
- PATCH requires `id`. Supplied `If-Match` mismatch currently returns 409, not 412; the header is optional in the handler. No guaranteed atomic compare-and-swap.
- DELETE soft-deletes; history records are attempted. No guaranteed 30-day restore service follows.
- Key-validation compatibility and server-side integrity controls require environment verification before critical use.

## 6. WFS

```text
GET /wfs-export?request=GetCapabilities
GET /wfs-export?request=GetFeature&limit=1000&outputFormat=geojson
```

Capabilities are public; features require an authorized key. Prefer the `x-api-key` header, not credentials in URLs. Maximum source cap is 5000. Bbox filtering is coordinate-based after retrieval; do not assume complete polygon-intersection queries. GML output is point-oriented. OGC format support does not establish certification or interoperability with every GIS workflow.

## 7. Quotas

Current client configuration (not proof of server enforcement):

| Tier | Requests/min | Requests/hour | Requests/day | Concurrent |
|---|---:|---:|---:|---:|
| Free | 10 | 100 | 1000 | 2 |
| Starter | 60 | 1500 | 15000 | 5 |
| Pro | 250 | 6000 | 65000 | 15 |
| Enterprise | 800 | 20000 | 290000 | 50 |

Monthly category allocations in that configuration:

| Tier | Commoditized | Enhanced | Proprietary | Exclusive |
|---|---:|---:|---:|---:|
| Free | 1000 | 0 | 0 | 0 |
| Starter | 20000 | 15000 | 7500 | 4000 |
| Pro | 80000 | 60000 | 30000 | 17000 |
| Enterprise | 400000 | 250000 | 120000 | 80000 |

Allocations do not by themselves grant endpoint access. Server, issued-key, partner, sandbox and browser-tool limits can differ; rely on enforced account entitlements and returned headers where present. Old OpenAPI quota prose may lag these client values.

## 8. Data and operational limitations

EPA information represents available monitoring observations, potentially cached or historical, not continuous real-time site measurements. Station proximity and regional estimates are not verified shoreline distance. Missing nutrient results do not establish uncontaminated water; unit/source completeness needs review.

Satellite pixel dimensions are not site-report accuracy. Generated crop guidance and VRT drafts require agronomic review; illustrative/fallback zones and exports are not equipment-operation approval. Local AI depends on initialized device/model support; cloud APIs require connectivity.

## 9. Integration references

Use [Developer Specifications](/docs/sdk/developer-specifications), [MCP reference](/docs/mcp-server-specification), [User Documentation](/docs/user/user-documentation) and the application's `/api-docs` reference. The October 31 date is this documentation revision, not a new API deployment or universal live contract test.
