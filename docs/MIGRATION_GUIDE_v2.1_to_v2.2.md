# Migration Guide: v2.1 → v2.2

**Date:** February 2026  
**Audience:** Developers upgrading existing LeafEngines SDK integrations

---

## Summary of Breaking Changes

Version 2.2 includes **5 breaking changes** to response/request structures. All changes improve data composability and consistency but require client-side updates.

---

## 1. `/get-soil-data` — Response Wrapped in Object

### What Changed
The flat response is now wrapped in a `soilAnalysis` object with additional `analysis_data` and `cache_info` sub-objects. A new `drainage` field is included.

### v2.1 Response (Old)
```json
{
  "id": "uuid",
  "county_name": "Travis County",
  "ph_level": 6.8,
  "organic_matter": 3.2,
  "nitrogen_level": "medium",
  "recommendations": "..."
}
```

### v2.2 Response (New)
```json
{
  "soilAnalysis": {
    "id": "uuid",
    "county_name": "Travis County",
    "ph_level": 6.8,
    "organic_matter": 3.2,
    "nitrogen_level": "medium",
    "drainage": "good",
    "recommendations": "...",
    "analysis_data": {
      "soil_type": "Austin, Lewisville",
      "analysis_method": "USDA SSURGO - Soil Data Access",
      "confidence_level": "high"
    }
  },
  "cache_info": {
    "cached": false,
    "cache_level": 0
  }
}
```

### Migration
```typescript
// v2.1
const soil = await api.getSoilData({ county_fips: '48453', ... });
console.log(soil.ph_level);

// v2.2
const result = await api.getSoilData({ county_fips: '48453', ... });
console.log(result.soilAnalysis.ph_level);
console.log(result.soilAnalysis.drainage); // NEW field
```

---

## 2. `/agricultural-intelligence` — Request Body Restructured

### What Changed
The request now uses a `query` string with an optional `context` object, replacing the previous flat parameter structure.

### v2.1 Request (Old)
```json
{
  "county_fips": "48453",
  "question": "What crops grow best here?"
}
```

### v2.2 Request (New)
```json
{
  "query": "What crops grow best here?",
  "context": {
    "county_fips": "48453"
  }
}
```

### Migration
```typescript
// v2.1
const result = await api.getAgriculturalIntelligence({
  county_fips: '48453',
  question: 'What crops grow best here?'
});

// v2.2
const result = await api.getAgriculturalIntelligence({
  query: 'What crops grow best here?',
  context: { county_fips: '48453' }
});
```

---

## 3. `/environmental-impact-engine` — Response Restructured

### What Changed
The response now uses nested `impact_assessment` and `detailed_analysis` objects instead of a flat structure.

### v2.2 Response Structure
```json
{
  "impact_assessment": {
    "overall_risk": "moderate",
    "score": 65
  },
  "detailed_analysis": {
    "runoff_risk": {
      "risk_level": "moderate",
      "score": 55,
      "contributing_factors": ["slope", "soil_type"]
    },
    "contamination_risk": { ... },
    "biodiversity_impact": { ... }
  },
  "recommendations": [ ... ]
}
```

### Migration
```typescript
// v2.1
console.log(result.runoff_risk_score);

// v2.2
console.log(result.detailed_analysis.runoff_risk.score);
```

---

## 4. `/alpha-earth-environmental-enhancement` — Coordinate Parameters Renamed

### What Changed
`latitude` / `longitude` parameters renamed to `lat` / `lng`.

### Migration
```typescript
// v2.1
api.getSatelliteData({ latitude: 30.27, longitude: -97.74 });

// v2.2
api.getSatelliteData({ lat: 30.27, lng: -97.74 });
```

---

## 5. `/api-key-management` — Replaces `/usage-analytics`

### What Changed
The deprecated `/usage-analytics` endpoint has been removed. API key management (create, list, revoke) is now handled by `/api-key-management`. Usage analytics are available via `/api-usage-dashboard`.

### Migration
```typescript
// v2.1 — usage analytics
const stats = await api.getUsageAnalytics();

// v2.2 — key management
const keys = await api.manageApiKey({ action: 'list' });

// v2.2 — usage data (separate endpoint)
const usage = await api.getUsageDashboard();
```

---

## New Endpoints in v2.2

These are additive (non-breaking) and available immediately:

| Endpoint | SDK Method | Tier |
|----------|-----------|------|
| `POST /generate-vrt-prescription` | `api.generateVrtPrescription()` | Pro |
| `POST /isobus-task/validate` | `api.validateIsobusTask()` | Pro |

---

## Checklist

- [ ] Update `/get-soil-data` response parsing to use `result.soilAnalysis.*`
- [ ] Update `/agricultural-intelligence` request to use `query` + `context`
- [ ] Update `/environmental-impact-engine` response parsing for nested structure
- [ ] Rename `latitude`/`longitude` to `lat`/`lng` for satellite endpoint
- [ ] Replace `/usage-analytics` calls with `/api-key-management` and `/api-usage-dashboard`
- [ ] Update SDK package: `npm install @soilsidekick/sdk@latest`

---

*Questions? Contact partnerships@leafengines.com*
