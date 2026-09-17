# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2026-07-02

### Added

- **Asset Management API** (`assetsCrud`)
  - `listAssets(query?)` — List or get a single managed asset scoped to the API key owner.
  - `createAsset(data)` — Create a new managed asset (point, polygon, or sensor). Supports idempotency via `Idempotency-Key` header.
  - `updateAsset(query, data)` — Update an existing asset. Supports optimistic locking via `If-Match` header matching the current `version`.
  - `deleteAsset(query)` — Soft-delete an asset (`is_deleted = true`). Record and audit history are preserved.

- **WFS Export API** (`wfsExport`)
  - `wfsExport(query?)` — OGC WFS-compatible read-only export of managed assets.
  - `request=GetCapabilities` requires no authentication.
  - `request=GetFeature` returns GeoJSON (default) or GML via `outputFormat`.
  - Supports `bbox` filtering (`minLon,minLat,maxLon,maxLat`) and `limit` (max 5000).

- **New schemas**
  - `ManagedAsset` — Full asset record with geometry, versioning, soft-delete, and audit fields.
  - `ManagedAssetInput` — Create/update payload.
  - `FeatureCollection` / `GeoJSONFeature` — Standard GeoJSON output for GIS consumers.

### Changed

- OpenAPI spec updated to include Asset Management and WFS Export endpoints.
- README refreshed with GSA 2026 nominee banner and v3.1.0 API coverage.

### Notes

- Requires Node.js >= 18.
- Auth continues via `x-api-key` header on all endpoints except WFS `GetCapabilities`.

## [3.0.0] - 2026-06-25

### Added

- Initial stable release of the SoilSidekick Pro SDK.
- Full OpenAPI-generated TypeScript client with the following API groups:
  - `SoilAnalysisApi` — USDA soil data, live agricultural data, planting calendars.
  - `WaterQualityApi` — EPA water quality, territorial water analytics.
  - `AIServicesApi` — Agricultural intelligence, GPT-5 chat, seasonal planning, smart report summaries, visual crop analysis.
  - `EnvironmentalApi` — Environmental impact engine, Alpha Earth enhancement.
  - `CarbonApi` — Carbon credit calculator.
  - `GeographicApi` — County lookup.
  - `LeafEnginesApi` — General query endpoint.
  - `SatelliteDataApi` — VRT prescription generation.
  - `TurboQuantApi` — Device capability detection for local inference.
  - `ConsumerPlantCareApi` — Safe identification, dynamic care, beginner guidance.
- `Configuration` class for `apiKey` and `basePath` setup.
- Response time SLA headers and rate-limit headers on all endpoints.
