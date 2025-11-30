# Global Data Integration Technical Specification

## Executive Summary

This document outlines the technical architecture changes required to transform LeafEngines™ from a US-centric platform (USDA, EPA) to a globally-capable environmental intelligence system supporting international data sources (ISRIC, FAO, UNEP, NASA, UN).

---

## Current Architecture Limitations

### US-Centric Dependencies
- `get-soil-data`: Hardcoded to USDA SSURGO API (US-only)
- `territorial-water-quality`: EPA Water Quality Index (US-only)
- `county-lookup`: FIPS codes (US-only)
- `live-agricultural-data`: NOAA, USDA NASS, EPA AirNow (US-only)

### Geographic Constraints
- All location resolution relies on US county FIPS codes
- No support for international coordinate-based queries
- No regional data source routing

---

## Required Architecture Changes

## 1. Regional Data Source Router

### New Edge Function: `global-data-router`

**Purpose**: Detect user location and route to appropriate regional data sources

**Input**:
```typescript
interface LocationQuery {
  latitude: number;
  longitude: number;
  country_code?: string; // ISO 3166-1 alpha-2
  region_code?: string;  // ISO 3166-2
}
```

**Output**:
```typescript
interface DataSourceRouting {
  region: "north_america" | "europe" | "asia" | "africa" | "south_america" | "oceania";
  soil_data_sources: string[];      // ["isric", "fao_glosis", "usda_ssurgo"]
  water_data_sources: string[];     // ["un_water_portal", "epa", "local_agencies"]
  climate_data_sources: string[];   // ["nasa", "noaa", "copernicus"]
  coordinate_system: string;         // "wgs84", "etrs89", etc.
}
```

**Implementation Requirements**:
- Reverse geocoding to determine country/region
- Maintain data source priority matrix by region
- Fallback cascade when primary sources unavailable
- Cache routing decisions (24h TTL)

---

## 2. Global Soil Data Integration

### New Edge Function: `global-soil-data`

**Purpose**: Unified interface for international soil data sources

#### 2.1 ISRIC World Soil Information (SoilGrids)

**API Endpoint**: `https://rest.isric.org/soilgrids/v2.0/`

**Required Secrets**:
- None (open access)

**Data Points**:
- pH (0-30cm depth)
- Organic carbon content
- Bulk density
- Clay/Sand/Silt fractions
- Cation Exchange Capacity (CEC)

**Implementation**:
```typescript
async function fetchISRICSoilData(lat: number, lon: number) {
  const response = await fetch(
    `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}`,
    {
      headers: { 'Accept': 'application/json' }
    }
  );
  
  // Transform ISRIC format to LeafEngines standard format
  return transformISRICToStandard(await response.json());
}
```

#### 2.2 FAO Global Soil Partnership (GLOSIS)

**API Endpoint**: `https://api.glosis.org/v1/`

**Required Secrets**:
- `FAO_API_KEY` (registration required)

**Data Points**:
- Soil classification (WRB system)
- Land use history
- Soil degradation indicators
- Nutrient retention capacity

**Implementation Notes**:
- Requires WRB to USDA soil taxonomy translation layer
- Rate limit: 1000 requests/day
- Cache duration: 90 days (soil data changes slowly)

#### 2.3 NASA ISRIC-WISE Database

**API Endpoint**: `https://daac.ornl.gov/cgi-bin/dsviewer.pl?ds_id=546`

**Data Access Method**: Direct download + local processing

**Implementation Strategy**:
- Download WISE soil profile database (one-time)
- Store in Supabase as `global_soil_profiles` table
- Spatial query using PostGIS for nearest profile matching

---

## 3. Global Water Quality Integration

### New Edge Function: `global-water-quality`

#### 3.1 UN Global Water Data Portal

**API Endpoint**: `https://www.sdg6data.org/api/v1/`

**Required Secrets**:
- None (open access)

**Data Points**:
- Surface water quality indicators
- Groundwater stress levels
- Water scarcity indices
- Transboundary water risks

**Implementation**:
```typescript
async function fetchUNWaterData(lat: number, lon: number) {
  // UN data organized by basin/watershed
  const watershed = await identifyWatershed(lat, lon);
  
  const response = await fetch(
    `https://www.sdg6data.org/api/v1/water-quality?basin_id=${watershed.id}`
  );
  
  return response.json();
}
```

#### 3.2 UNEP World Environment Situation Room

**API Endpoint**: `https://wesr.unep.org/api/`

**Data Points**:
- Real-time pollution events
- Land degradation alerts
- Ecosystem stress indicators
- Climate vulnerability scores

---

## 4. Data Harmonization Layer

### New Shared Module: `_shared/data-harmonizer.ts`

**Purpose**: Transform heterogeneous international data into unified LeafEngines format

```typescript
interface StandardizedSoilData {
  location: { lat: number; lon: number };
  ph: { value: number; unit: string; depth_cm: number };
  organic_matter: { value: number; unit: "percent" | "g/kg" };
  texture: {
    clay: number;  // percent
    silt: number;
    sand: number;
  };
  nutrients: {
    nitrogen: { value: number; unit: string };
    phosphorus: { value: number; unit: string };
    potassium: { value: number; unit: string };
  };
  source: string;           // "isric", "fao", "usda", etc.
  confidence: number;       // 0-100
  last_updated: string;
}

export class DataHarmonizer {
  // Convert ISRIC format to standard
  static fromISRIC(data: any): StandardizedSoilData { }
  
  // Convert FAO GLOSIS format to standard
  static fromFAO(data: any): StandardizedSoilData { }
  
  // Convert USDA SSURGO format to standard
  static fromUSDA(data: any): StandardizedSoilData { }
  
  // Merge multiple sources with confidence weighting
  static mergeSources(sources: StandardizedSoilData[]): StandardizedSoilData { }
}
```

---

## 5. Database Schema Changes

### New Tables

#### 5.1 `global_soil_profiles`
```sql
CREATE TABLE global_soil_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location GEOGRAPHY(POINT),
  country_code VARCHAR(2),
  region_code VARCHAR(10),
  data_source VARCHAR(50),
  soil_data JSONB,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_global_soil_location ON global_soil_profiles USING GIST(location);
CREATE INDEX idx_global_soil_country ON global_soil_profiles(country_code);
```

#### 5.2 `global_water_quality`
```sql
CREATE TABLE global_water_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location GEOGRAPHY(POINT),
  watershed_id VARCHAR(50),
  country_code VARCHAR(2),
  water_data JSONB,
  data_source VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_global_water_location ON global_water_quality USING GIST(location);
```

#### 5.3 `data_source_registry`
```sql
CREATE TABLE data_source_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name VARCHAR(100) UNIQUE NOT NULL,
  source_type VARCHAR(50), -- 'soil', 'water', 'climate'
  api_endpoint TEXT,
  coverage_regions TEXT[], -- ['EU', 'AS', 'AF']
  requires_auth BOOLEAN DEFAULT FALSE,
  rate_limit_per_hour INTEGER,
  cache_ttl_hours INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Modified Edge Functions

### 6.1 Update `leafengines-query`

**Changes Required**:
```typescript
// Before location-based data fetching
const routingInfo = await supabase.functions.invoke('global-data-router', {
  body: { 
    latitude: query.location.latitude,
    longitude: query.location.longitude 
  }
});

// Route to appropriate data sources based on region
let soilData;
if (routingInfo.data.region === 'north_america' && query.location.county_fips) {
  // Use existing US-based logic
  soilData = await supabase.functions.invoke('get-soil-data', { ... });
} else {
  // Use new global data sources
  soilData = await supabase.functions.invoke('global-soil-data', {
    body: {
      latitude: query.location.latitude,
      longitude: query.location.longitude,
      preferred_sources: routingInfo.data.soil_data_sources
    }
  });
}
```

### 6.2 Create `get-soil-data-v2`

**Purpose**: Backwards-compatible version that supports both US and global queries

**Logic Flow**:
1. Detect if query includes `county_fips` → Use US pipeline
2. Detect if query includes only `lat/lon` → Use global pipeline
3. Merge results if both available

---

## 7. Configuration Management

### New File: `supabase/functions/_shared/region-config.ts`

```typescript
export const REGIONAL_DATA_SOURCES = {
  north_america: {
    soil: ['usda_ssurgo', 'isric'],
    water: ['epa', 'un_water_portal'],
    priority: 'us_first' // Use US sources first, then global
  },
  europe: {
    soil: ['isric', 'fao_glosis', 'inspire_eu'],
    water: ['un_water_portal', 'eea'], // European Environment Agency
    priority: 'global_first'
  },
  asia: {
    soil: ['isric', 'fao_glosis'],
    water: ['un_water_portal'],
    priority: 'global_only'
  },
  africa: {
    soil: ['isric', 'fao_glosis'],
    water: ['un_water_portal'],
    priority: 'global_only'
  },
  south_america: {
    soil: ['isric', 'fao_glosis'],
    water: ['un_water_portal'],
    priority: 'global_only'
  },
  oceania: {
    soil: ['isric', 'fao_glosis'],
    water: ['un_water_portal'],
    priority: 'global_only'
  }
};

export const API_ENDPOINTS = {
  isric_soilgrids: 'https://rest.isric.org/soilgrids/v2.0',
  fao_glosis: 'https://api.glosis.org/v1',
  un_water_portal: 'https://www.sdg6data.org/api/v1',
  unep_wesr: 'https://wesr.unep.org/api',
  nasa_earthdata: 'https://daac.ornl.gov/api'
};
```

---

## 8. Caching Strategy

### Multi-Tiered Cache for Global Data

#### Level 1: In-Memory (Edge Function)
- Duration: 5 minutes
- Scope: Identical requests within same function execution

#### Level 2: Supabase Cache Table (Existing `fips_data_cache`)
- Rename to: `environmental_data_cache`
- Add columns:
  - `cache_type`: 'soil' | 'water' | 'climate'
  - `location_geog`: Geography point
  - `region`: Regional identifier
  
#### Level 3: CDN Cache (Future Enhancement)
- Use Cloudflare Workers KV
- TTL: 30 days for soil, 7 days for water

---

## 9. Testing Requirements

### Integration Tests Required

1. **Multi-Region Soil Data Fetching**
   - Test coordinates in EU, Asia, Africa
   - Verify data harmonization
   - Check fallback logic

2. **Data Source Failover**
   - Simulate ISRIC API downtime
   - Verify automatic fallback to FAO
   - Check error reporting

3. **Performance Benchmarks**
   - Target: <2s response time globally
   - Cache hit ratio: >80%
   - API cost per query: <$0.01

---

## 10. Deployment Phases

### Phase 1: Data Source Integration (Weeks 1-2)
- [ ] Add secrets: `FAO_API_KEY`
- [ ] Create `global-soil-data` edge function
- [ ] Create `global-water-quality` edge function
- [ ] Create `_shared/data-harmonizer.ts`
- [ ] Add database schema for global data

### Phase 2: Routing Logic (Week 3)
- [ ] Create `global-data-router` edge function
- [ ] Implement region detection
- [ ] Configure data source priorities

### Phase 3: Backwards Compatibility (Week 4)
- [ ] Create `get-soil-data-v2` 
- [ ] Update `leafengines-query` with routing
- [ ] Migration path for existing US clients

### Phase 4: Testing & Optimization (Week 5)
- [ ] Integration testing across regions
- [ ] Performance optimization
- [ ] Cache tuning

### Phase 5: Documentation & Launch (Week 6)
- [ ] API documentation for global endpoints
- [ ] Client migration guide
- [ ] Regional support matrix

---

## 11. Cost Analysis

### API Cost Estimates (per 1000 queries)

| Data Source | Cost per 1000 | Cache Hit Savings |
|------------|---------------|-------------------|
| ISRIC SoilGrids | $0 (free) | N/A |
| FAO GLOSIS | $0 (free with key) | N/A |
| UN Water Portal | $0 (open access) | N/A |
| UNEP WESR | $0 (open access) | N/A |
| NASA EarthData | $0 (open access) | N/A |

**Total Infrastructure Cost**: Minimal (only Supabase storage for cache)

**Key Advantage**: All global data sources are free/open-access, unlike US commercial APIs

---

## 12. Security Considerations

### Data Source Authentication
- Store API keys in Supabase secrets (not env vars)
- Rotate keys quarterly
- Log all API access for compliance

### Privacy Compliance
- No PII transmitted to external APIs
- On-device processing for plant images (existing)
- GDPR-compliant caching (no user identification)

### Rate Limiting
- Implement per-source rate limits
- Exponential backoff on failures
- Circuit breaker pattern for degraded services

---

## 13. Monitoring & Observability

### New Metrics to Track

1. **Data Source Health**
   - API response times by source
   - Error rates per region
   - Cache hit ratios

2. **Regional Performance**
   - Query response times by continent
   - Data quality scores by region
   - Fallback invocation frequency

3. **Business Metrics**
   - Queries by country (for sales targeting)
   - Data source utilization rates
   - Cost savings from caching

### Dashboard Requirements
- Real-time data source status
- Regional query heatmap
- API cost tracking

---

## 14. Client-Side Changes

### Updated API Request Format

**Before (US-only)**:
```typescript
const result = await fetch('/functions/v1/leafengines-query', {
  body: JSON.stringify({
    location: { county_fips: "06037" },
    plant: { common_name: "Tomato" }
  })
});
```

**After (Global-capable)**:
```typescript
const result = await fetch('/functions/v1/leafengines-query', {
  body: JSON.stringify({
    location: { 
      latitude: 48.8566, 
      longitude: 2.3522,
      // Optional: county_fips still supported for US
    },
    plant: { common_name: "Tomato" }
  })
});
```

### Breaking Changes
- **NONE** - Backwards compatible
- US clients can continue using `county_fips`
- New global clients use `latitude/longitude`

---

## 15. Documentation Updates Required

1. **API Documentation**
   - Add global endpoints section
   - Document regional routing logic
   - Add example requests for each continent

2. **Integration Guide**
   - Update LeafEngines integration examples
   - Add regional configuration guide
   - Document data source priorities

3. **Marketing Materials**
   - Update B2B landing page (DONE)
   - Create regional sales collateral
   - Develop case studies for European clients

---

## Conclusion

This architecture transformation enables LeafEngines™ to serve global markets while maintaining backwards compatibility with existing US-based clients. The open-access nature of international data sources (ISRIC, FAO, UN) provides a cost advantage over US commercial APIs, making global expansion economically viable.

**Key Success Metrics**:
- Support queries from 150+ countries
- <2s response time globally
- >95% uptime for all data sources
- Zero incremental API costs for global data

**Next Steps**:
1. Review and approve this specification
2. Set up required API accounts (FAO GLOSIS)
3. Begin Phase 1 implementation
4. Target European launch in Q2 2025
