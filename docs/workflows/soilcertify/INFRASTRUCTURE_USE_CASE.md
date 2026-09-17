# Accelerating Land Suitability Screening in QGIS Using the SoilSidekick Pro API

**A 2-page infrastructure use case for GIS consultants**
July 2026 · SoilCertify / LeafEngines™

> **Companion resources for QGIS visitors:**
> - [Technical Overview](./TECHNICAL_OVERVIEW.md) — methodology, data sources, endpoints
> - [Developer Reference](./DEVELOPER_LANDING.md) — query examples, JSON schema, Python snippet, annotated QGIS workflow
> - [QGIS Developer Landing (LeafEngines)](../15_QGIS_DEVELOPER_LANDING.md) — the SoilSidekick Pro / LeafEngines companion page

---

## The Problem

A regional GIS consultancy is asked to screen **120 candidate parcels** for a light-industrial siting study. Each parcel needs a preliminary read on soil suitability, vegetation cover, hydrological risk, and general infrastructure readiness — enough for the client to shortlist ~15 parcels for a paid geotechnical Phase 1.

Traditionally this is a slow, manual assembly job in QGIS: pulling Sentinel-2 composites, joining SoilGrids rasters, clipping DEM tiles, calculating NDVI, running proximity analyses, and hand-scoring each parcel in a spreadsheet.

---

## Before / After Workflow Comparison

| Step | Traditional QGIS Workflow | With SoilSidekick Pro API |
|---|---|---|
| 1. Source imagery | Download Sentinel-2 tiles, cloud-mask, composite | *(automatic — served pre-composited)* |
| 2. Pull soil data | Fetch SoilGrids rasters, reproject, clip | *(automatic — returned in JSON)* |
| 3. Terrain analysis | Load DEM tiles, mosaic, derive slope | *(automatic — slope + hydrology returned)* |
| 4. Compute indices | Raster calculator: NDVI, NDWI, variance | *(returned as scored fields with confidence)* |
| 5. Per-parcel scoring | Zonal stats + manual spreadsheet weighting | `POST /assess/parcel` per AOI |
| 6. Confidence handling | Manual QA of cloud coverage and source age | Per-field `confidence` value returned |
| 7. Deliverable | Screenshots + spreadsheet + written notes | GeoJSON / WFS layer, styled in QGIS in minutes |
| **Per-parcel time** | **~35–50 min** | **~30 sec of analyst attention** (API runs in ~12 s p50) |
| **120-parcel study** | **~80–100 hours** | **~4–6 hours** (mostly review + write-up) |

**Time reduction: roughly 90–95%** on the screening phase, freeing analyst hours for interpretation and client-facing work rather than data plumbing.

---

## Illustrative Parcel Screening Example

**Study:** 120 candidate parcels, Front Range corridor, Colorado.
**Objective:** Shortlist parcels with `site_readiness ≥ 70` **and** `overall_confidence ≥ 0.8`.

### Workflow (executed in a single afternoon)

1. Load the 120 parcel polygons into QGIS as a vector layer.
2. Run a short Python script (see [Developer Reference](./DEVELOPER_LANDING.md)) that iterates the layer and calls `POST /assess/parcel` for each geometry.
3. Write the returned `site_readiness`, `soil_suitability`, `hydrological_risk`, and `overall_confidence` fields back onto the parcel attribute table.
4. Add the SoilSidekick WFS endpoint via the **LeafEngines QGIS Plugin v1.0.10** to visualize live results as they populate.
5. Symbolize the parcel layer graduated by `site_readiness` (Red < 40 · Amber 40–70 · Green > 70).
6. Filter with a QGIS expression: `"site_readiness" >= 70 AND "overall_confidence" >= 0.8`.

### Illustrative Result

| Bucket | Parcel Count | Action |
|---|---:|---|
| Green — meets both thresholds | **17** | Advanced to Phase 1 geotechnical |
| Amber — meets score, low confidence | 9 | Flagged for a targeted field visit before Phase 1 |
| Amber — high confidence, score 40–70 | 41 | Held as backup pool |
| Red — score < 40 | 53 | Eliminated from consideration |

The consultancy delivered a defensible shortlist to the client in **~5 hours of chargeable time** instead of the ~80 hours the equivalent manual screening would have consumed — while producing a richer, confidence-scored artifact that the client's own GIS team could re-open in QGIS.

---

## ROI Summary for GIS Consultants

- **Analyst time reclaimed:** ~90% on the screening phase.
- **Higher-margin deliverable:** Same fee, dramatically less production time.
- **Defensibility:** Every measurement ships with a `confidence` value and a documented source tier — an auditable trail your client's reviewer can interrogate.
- **Client-portable output:** GeoJSON and OGC WFS mean the deliverable lives natively in the client's existing QGIS or ArcGIS stack. Nothing to install, nothing to license.
- **Break-even:** On a study of this size, the API cost is recovered within the first ~4 parcels of reclaimed analyst time.

---

*Companion documents: **[Technical Overview](./TECHNICAL_OVERVIEW.md)** (methodology and endpoints) and **[Developer Reference](./DEVELOPER_LANDING.md)** (query examples, JSON schema, Python snippet, annotated QGIS workflow).*
*Contact: consultants@soilcertify.com*
