# API Documentation

**API Version:** 3.1.0
**OpenAPI Spec:** `openapi-spec.yaml`
**Base URL (prod):** `https://app.soilsidekickpro.com/api`
**Base URL (sandbox):** `https://sandbox.leafengines.com/api`
**Last updated:** 2026-07-03

---

## 1. Authentication

| Method | Header | Use |
|---|---|---|
| API Key | `x-api-key: <key>` | SDK, MCP, QGIS, integrations |
| Free Tier | `x-free-tier: true` | Whitelisted endpoints only |
| JWT | `Authorization: Bearer <token>` | Web app users |

Test key: `leaf-test-370df0a2e62e`.
Authenticated endpoints require the `app.` subdomain.

## 2. Envelope

Successful responses:
```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_01H...",
    "source": "USDA-SSURGO-2025",
    "freshness_hours": 12,
    "confidence": 0.94,
    "cached": false
  }
}
```

Errors:
```json
{ "error": { "code": "...", "message": "...", "hint": "...", "request_id": "..." } }
```

## 3. Common Headers

**Request**
- `x-api-key`, `x-free-tier`, `x-request-id`
- `Idempotency-Key` (POST /assets)
- `If-Match` (PATCH /assets)
- `x-tq-context-mode`, `x-tq-kv-cache-hint`, `x-tq-model-tier`

**Response**
- `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`
- `x-response-time-ms`
- `Sunset` (deprecation)

## 4. Endpoints

### 4.1 Soil Analysis
```
GET  /soil?fips=48113&depth=30
GET  /planting-calendar?fips=48113&crop=corn
GET  /live-ag?lat=&lon=
```

### 4.2 Water Quality
```
GET /water-quality?lat=&lon=&radius_km=
GET /territorial-water?state=TX
```

### 4.3 AI Services
```
POST /chat            { messages: [...] }
POST /seasonal        { field_id: "..." }
POST /summary         { report_id: "..." }
POST /visual          multipart/form-data image
```

### 4.4 Environmental
```
GET  /impact?lat=&lon=
POST /alpha-earth     { bbox, date_range }
```

### 4.5 Carbon
```
POST /carbon-credits  { field_id, practice }
```

### 4.6 Geographic
```
GET /county-lookup?q=Travis&state=TX     # free tier
GET /reverse-geocode?lat=&lon=
```

### 4.7 Satellite / VRT
```
POST /vrt   { field_id, target_yield }
```

### 4.8 TurboQuant
```
GET /turboquant-check    # device capability probe
```

### 4.9 Consumer Plant Care
```
POST /plant/id       multipart image
GET  /plant/care?species=&region=
```

### 4.10 Managed Assets (NEW 3.1.0)
```
GET    /assets?id=&type=&limit=&cursor=
POST   /assets                     Idempotency-Key
PATCH  /assets?id=                 If-Match: <version>
DELETE /assets?id=                 (soft delete)
```

**ManagedAsset schema (abridged)**
```json
{
  "id": "uuid",
  "asset_type": "point|polygon|sensor",
  "name": "string",
  "geometry": { /* GeoJSON */ },
  "properties": { },
  "version": 1,
  "is_deleted": false,
  "created_at": "...",
  "updated_at": "..."
}
```

### 4.11 WFS Export (NEW 3.1.0)
```
GET /wfs?request=GetCapabilities                    # public
GET /wfs?request=GetFeature
        &typeName=leafengines:managed_assets
        &bbox=minLon,minLat,maxLon,maxLat
        &limit=1000
        &outputFormat=application/json|gml
```

### 4.12 MCP JSON-RPC 2.0
```
POST /mcp    { "jsonrpc":"2.0","method":"tools/call","params":{...},"id":1 }
```

## 5. Rate Limits

| Tier | RPS | Monthly |
|---|---|---|
| Free | 2 | 500 |
| Starter | 20 | 10k |
| Pro | 100 | 35k |
| Enterprise | 500+ | 175k+ |

429 responses include `Retry-After`.

## 6. Errors

| Code | HTTP | Meaning |
|---|---|---|
| `AUTH_MISSING` | 401 | No credential |
| `AUTH_INVALID` | 403 | Bad key/JWT |
| `SUBDOMAIN_REQUIRED` | 403 | Use `app.` |
| `RATE_LIMITED` | 429 | Slow down |
| `IDEMPOTENCY_CONFLICT` | 409 | Same key, different payload |
| `ASSET_VERSION_MISMATCH` | 412 | Stale `If-Match` |
| `POSITION_UNCERTAIN` | 422 | > 500 m; write inhibited |
| `PAYLOAD_TOO_LARGE` | 413 | > 2 MB edge limit |
| `UPSTREAM_UNAVAILABLE` | 503 | External data source |

## 7. Idempotency

Include `Idempotency-Key: <uuid v4>` on `POST /assets`. Duplicate requests within 24 h return the original 201.

## 8. Optimistic Locking
`PATCH /assets` requires `If-Match: <version>` matching the current version. Mismatch → 412; refetch and retry.

## 9. Pagination
Cursor-based: `?cursor=<opaque>&limit=<n>`; `meta.next_cursor` in response when more pages exist.

## 10. Webhooks (Enterprise)
- HMAC-signed with `x-le-signature`
- 5 s replay window
- Retry with exponential backoff up to 24 h

## 11. Deprecation Policy
- Announce via `Sunset` header 6 months ahead
- Major bumps use `/v4` prefix
- Non-breaking additions land in minor releases

## 12. Versioned Change Log
See root `CHANGELOG.md`; 3.1.0 adds Managed Assets and WFS Export.

## 13. Try It Out
- Interactive docs: `https://app.soilsidekickpro.com/api-docs`
- Postman collection: `https://docs.leafengines.com/postman`
- OpenAPI JSON: `https://app.soilsidekickpro.com/api/openapi.json`

## 14. Support
- Developer forum: GitHub Discussions
- Email: `support@soilsidekickpro.com`
- Enterprise: `enterprise@soilsidekickpro.com`
