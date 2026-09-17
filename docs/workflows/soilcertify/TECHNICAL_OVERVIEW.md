# SoilSidekick Pro — Technical Overview

**Audience:** Technical evaluators, GIS leads, and engineering managers asking "what exactly does it do?"
**Version:** 1.0 — July 2026

> **See also (QGIS visitors):**
> - [Developer Reference](./DEVELOPER_LANDING.md) — curl, JSON schema, Python, annotated QGIS workflow
> - [Infrastructure Use Case](./INFRASTRUCTURE_USE_CASE.md) — GIS-consultant ROI walkthrough
> - [QGIS Developer Landing (LeafEngines)](../15_QGIS_DEVELOPER_LANDING.md)

---

## 1. What It Is

SoilSidekick Pro (delivered under the **SoilCertify** brand and powered by the **LeafEngines™** analytics platform) is an API-first Phase 0 site-assessment engine. It takes a coordinate or parcel geometry and returns a structured, confidence-scored assessment of soil, vegetation, hydrology, and infrastructure-readiness signals derived primarily from 10-meter satellite imagery.

It is designed to be embedded into GIS workflows (QGIS, ArcGIS, custom web maps) as a preliminary screening layer that runs in seconds instead of the days required for traditional desktop-plus-field workflows.

---

## 2. Data Sources

| Layer | Primary Source | Resolution | Refresh |
|---|---|---|---|
| Optical / NDVI / vegetation indices | Sentinel-2 via Google Earth Engine | 10 m | ~5 days |
| Land cover / land use | ESA WorldCover + Dynamic World | 10 m | Annual / near-real-time |
| Elevation & slope | SRTM / Copernicus DEM | 30 m | Static |
| Soil physical & chemical properties | ISRIC SoilGrids (fallback) + regional overlays | 250 m | Versioned |
| Precipitation / climate normals | ERA5 / CHIRPS | ~9 km | Monthly |
| Hydrology / surface water | JRC Global Surface Water | 30 m | Annual |
| Parcel / address resolution | Multi-tier geocoder with fallback chain | Address-level | On demand |

Earth Engine is the primary satellite compute layer. When a source is unavailable for a given AOI, the platform gracefully degrades and flags the substitution in the confidence field rather than failing the request.

---

## 3. Scoring Methodology

Each report produces a set of normalized 0–100 sub-scores that roll up into a composite **Site Readiness Score**:

- **Soil Suitability** — texture class, drainage, organic carbon, pH band
- **Vegetation Health** — NDVI mean + variance over trailing 12 months
- **Hydrological Risk** — proximity to surface water, seasonal inundation frequency, slope-weighted runoff
- **Infrastructure Readiness** *(Full Site Scan tier)* — access, proximity to utilities corridors, terrain workability

Weights are transparent and documented per report. The composite is a weighted linear combination; individual sub-scores are always exposed so downstream consumers can re-weight for their own use case.

---

## 4. Confidence Scoring Logic

Every returned field carries a companion `confidence` value on a 0–1 scale, computed from:

1. **Source tier** — direct 10 m observation > 30 m derived > 250 m modeled > fallback
2. **Temporal freshness** — penalized as the newest usable observation ages
3. **Cloud / QA masking** — % of AOI pixels that passed QA in the composite window
4. **Cross-source agreement** — variance between independent sources for the same variable
5. **AOI size vs. native pixel size** — sub-pixel AOIs are down-weighted

A report-level `overall_confidence` is emitted, and any field below the configured threshold is flagged rather than silently returned.

---

## 5. API Endpoints

Base URL: `https://api.soilcertify.com/v1` *(gateway-routed; anon key required)*

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/assess/point` | Assess a single lat/lng coordinate |
| `POST` | `/assess/parcel` | Assess a GeoJSON Polygon / MultiPolygon AOI |
| `GET`  | `/reports/{id}` | Retrieve a completed report |
| `GET`  | `/reports/{id}/geojson` | RFC 7946 FeatureCollection export |
| `GET`  | `/reports/{id}/wfs` | OGC WFS 2.0 GML representation |
| `GET`  | `/managed-assets` | List managed landscape assets (CRUD-backed) |
| `POST` | `/managed-assets` | Create / upsert a managed asset |

All endpoints accept and return JSON; geometry follows GeoJSON (RFC 7946) with WGS84 (EPSG:4326) as the canonical CRS. Reprojection to EPSG:3857 and EPSG:27700 is supported via the QGIS plugin.

---

## 6. Latency Expectations

| Operation | p50 | p95 | Notes |
|---|---|---|---|
| `POST /assess/point` (Preliminary tier) | ~2.5 s | ~6 s | Raw data, no AI narrative |
| `POST /assess/parcel` (Full Site Scan) | ~12 s | ~28 s | Includes Gemini 2.5 Flash narrative |
| `GET /reports/{id}` | < 250 ms | < 600 ms | Cached response |
| GeoJSON / WFS export | < 800 ms | < 2 s | Streamed for large AOIs |

Latency is dominated by Earth Engine compute for parcel-scale AOIs. Requests are queued fairly per API key.

---

## 7. Interoperability

- **GeoJSON** export (RFC 7946) — QGIS, ArcGIS, Mapbox, Leaflet
- **OGC WFS 2.0** endpoint with GetCapabilities, BBOX and CQL filtering
- **LeafEngines QGIS Plugin v1.0.10** (Plugin ID 4987, A-Grade) — multi-CRS reprojection, GeoPackage + Shapefile export, QGIS 4.x compatible
- **SDK v3.0** — hardware-ready hooks for direct sensor ingestion

---

## 8. Support & SLAs

- Status page and changelog published at the developer landing.
- Breaking API changes are versioned; `/v1` is stable.
- Enterprise SLA available on the Professional Pro tier.

*Contact: developers@soilcertify.com*
