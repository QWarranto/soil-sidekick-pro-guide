# SoilSidekick Pro API — Developer Reference

**Audience:** Developers evaluating whether the API fits their stack.
**Base URL:** `https://api.soilcertify.com/v1`
**Auth:** `Authorization: Bearer <ANON_KEY>` (publishable) + per-request signed token for paid tiers.

> **See also (QGIS visitors):**
> - [Technical Overview](./TECHNICAL_OVERVIEW.md) — data sources, scoring, latency
> - [Infrastructure Use Case](./INFRASTRUCTURE_USE_CASE.md) — 120-parcel screening walkthrough
> - [QGIS Developer Landing (LeafEngines)](../15_QGIS_DEVELOPER_LANDING.md)

---

## 1. Working Query Example

Assess a single coordinate (Preliminary tier — raw data, no AI narrative):

```bash
curl -X POST https://api.soilcertify.com/v1/assess/point \
  -H "Authorization: Bearer $SOILCERTIFY_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 40.014984,
    "lng": -105.270546,
    "tier": "preliminary",
    "crs": "EPSG:4326"
  }'
```

---

## 2. JSON Response Structure (abridged)

```json
{
  "report_id": "5f2a1c9a-1f21-4e6b-9b7c-1c5a5f6e0a11",
  "generated_at": "2026-07-04T14:22:11Z",
  "aoi": { "type": "Point", "coordinates": [-105.270546, 40.014984] },
  "crs": "EPSG:4326",
  "overall_confidence": 0.87,
  "scores": {
    "site_readiness": 78,
    "soil_suitability":  { "value": 82, "confidence": 0.91 },
    "vegetation_health": { "value": 74, "confidence": 0.88 },
    "hydrological_risk": { "value": 21, "confidence": 0.83 },
    "infrastructure_readiness": null
  },
  "soil": {
    "texture_class": "loam",
    "ph_h2o":       { "value": 6.7, "confidence": 0.79, "source": "SoilGrids-250m" },
    "organic_carbon_pct": { "value": 2.4, "confidence": 0.81 }
  },
  "vegetation": {
    "ndvi_mean_12mo":     { "value": 0.62, "confidence": 0.92, "source": "Sentinel-2" },
    "ndvi_variance_12mo": { "value": 0.04, "confidence": 0.90 }
  },
  "hydrology": {
    "distance_to_surface_water_m": 412,
    "seasonal_inundation_frequency": 0.02
  },
  "flags": [],
  "links": {
    "self":    "/v1/reports/5f2a1c9a-...",
    "geojson": "/v1/reports/5f2a1c9a-.../geojson",
    "wfs":     "/v1/reports/5f2a1c9a-.../wfs"
  }
}
```

Every measured field is an object of `{ value, confidence, source }` — never a bare number — so downstream code can apply its own confidence gate.

---

## 3. Python Integration Snippet

```python
import os
import requests

API = "https://api.soilcertify.com/v1"
HEADERS = {"Authorization": f"Bearer {os.environ['SOILCERTIFY_ANON_KEY']}"}

def assess_parcel(geojson_polygon: dict, tier: str = "full") -> dict:
    """Submit a GeoJSON Polygon AOI and return the parsed report."""
    r = requests.post(
        f"{API}/assess/parcel",
        headers=HEADERS,
        json={"aoi": geojson_polygon, "tier": tier, "crs": "EPSG:4326"},
        timeout=45,
    )
    r.raise_for_status()
    return r.json()


def high_confidence_only(report: dict, threshold: float = 0.8) -> dict:
    """Filter out any measurement below the confidence threshold."""
    return {
        k: v for k, v in report["scores"].items()
        if isinstance(v, dict) and v.get("confidence", 0) >= threshold
    }


if __name__ == "__main__":
    parcel = {
        "type": "Polygon",
        "coordinates": [[
            [-105.2710, 40.0148], [-105.2701, 40.0148],
            [-105.2701, 40.0155], [-105.2710, 40.0155],
            [-105.2710, 40.0148],
        ]],
    }
    report = assess_parcel(parcel)
    print("Site readiness:", report["scores"]["site_readiness"])
    print("Trusted scores:", high_confidence_only(report))
```

---

## 4. Annotated QGIS Workflow

Drop-in workflow using the **LeafEngines QGIS Plugin v1.0.10** (Plugin ID 4987, A-Grade):

```text
┌─────────────────────────────────────────────────────────────────────┐
│  QGIS 4.x                                                           │
│                                                                     │
│  ┌───────────────┐   1. Add WFS layer                               │
│  │  Browser      │──────────────► https://api.soilcertify.com/v1/wfs│
│  │  Panel        │      (GetCapabilities auto-discovers layers)     │
│  └───────────────┘                                                  │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────┐   2. BBOX + CQL filter in plugin dialog          │
│  │  LeafEngines  │      asset_type='tree' AND condition='good'      │
│  │  Plugin  ▼    │                                                  │
│  └───────────────┘                                                  │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────┐   3. Reproject on the fly                        │
│  │ CRS selector  │      EPSG:4326  →  EPSG:3857 / EPSG:27700        │
│  └───────────────┘                                                  │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────┐   4. Style by `site_readiness` (graduated)       │
│  │  Map Canvas   │      Red < 40  •  Amber 40–70  •  Green > 70     │
│  └───────────────┘                                                  │
│         │                                                           │
│         ▼                                                           │
│  ┌───────────────┐   5. Export → GeoPackage or Shapefile            │
│  │  Export       │      (round-trips cleanly back into the API)     │
│  └───────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

Install: **QGIS → Plugins → Manage and Install → search "LeafEngines"**. The plugin ships anonymous opt-out telemetry and is compatible with QGIS 4.x.

---

## 5. Rate Limits & Errors

- Per-key rate limit: 60 req/min on Preliminary, 20 req/min on Full Site Scan.
- All errors return `{ "error": { "code", "message", "request_id" } }` with an HTTP status matching the class of failure (400 / 401 / 409 / 429 / 5xx).
- `request_id` is safe to share with support.

---

*Questions: developers@soilcertify.com — Changelog: `/v1/changelog`*
