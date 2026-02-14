# SoilSidekick Pro API Documentation
# LeafEngines™ B2B API Platform

## Version: 2.2
## Date: February 2026
## Security: SOC 2 Type 1 Compliant

---

## 1. API Overview

SoilSidekick Pro provides a comprehensive RESTful API for agricultural intelligence, soil analysis, environmental assessment, and satellite data integration. **LeafEngines™** extends this as a B2B API platform positioned as a "Botanical Truth Layer" for enterprise risk mitigation. All API endpoints are SOC 2 Type 1 compliant with enterprise-grade security.

### 1.1 SOC 2 Type 1 Security Standards

**Security Controls**: All API endpoints implement:
- **Authentication**: `x-api-key` header authentication for B2B/SDK access, JWT for user sessions
- **Authorization**: Role-based access control with user data isolation
- **Encryption**: TLS 1.3 encryption for all data transmission
- **Audit Logging**: Comprehensive logging of all API requests and responses
- **Input Validation**: Server-side validation and sanitization of all inputs
- **Service Resilience**: Automatic retry with exponential backoff for transient failures

### 1.2 Base URL
```
Production: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/
```

### 1.3 Authentication

SoilSidekick Pro API supports two authentication methods:

**1. API Key Authentication (B2B/SDK Access) — Recommended for External Integrations**

For external integrations and SDK usage, use the `x-api-key` header:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data \
     -H "x-api-key: ak_your_api_key_here" \
     -H "Content-Type: application/json" \
     -d '{"county_fips": "48453", "county_name": "Travis County", "state_code": "TX"}'
```

API keys are generated through the dashboard at [/api-keys](/api-keys) or via the `/api-key-management` endpoint and use the `ak_*` format.

**2. JWT Authentication (Internal/User Sessions)**

For authenticated user sessions within the application:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/agricultural-intelligence \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is the best crop for Travis County?", "context": {"county_fips": "48453"}}'
```

### 1.4 Getting Started

Follow these steps to go from zero to your first API call:

1. **Create an account** at [/auth](/auth)
2. **Get your API key** at [/api-keys](/api-keys) — a sandbox key (`ak_sandbox_*`) is auto-generated on signup
3. **Test in the sandbox** at [/developer-sandbox](/developer-sandbox) — no API key needed for sandbox endpoints
4. **Make your first production call** using your API key (see §1.3 above)

📋 **Quickstart Guide**: [SDK_QUICKSTART.md](./docs/SDK_QUICKSTART.md) — 5 minutes to first API call  
📋 **Full Integration Guide**: [SDK_INTEGRATION_GUIDE.md](./docs/SDK_INTEGRATION_GUIDE.md) — complete setup  
📋 **Enterprise Onboarding**: [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md) — 4-week plan

### 1.5 Multi-Language SDK

**Install via npm**:
```bash
npm install @soilsidekick/sdk
```

**Supported Languages** (auto-generated from OpenAPI specification):
- TypeScript/JavaScript
- Python
- Go
- Ruby
- Java
- PHP

---

## 2. Core API Endpoints

### Endpoint → SDK Method Mapping

| REST Endpoint | SDK Method | Purpose |
|---------------|-----------|---------|
| `POST /get-soil-data` | `api.getSoilData()` | County-level SSURGO soil analysis |
| `POST /agricultural-intelligence` | `api.getAgriculturalIntelligence()` | AI-powered agricultural Q&A (uses soil + satellite + weather data) |
| `POST /environmental-impact-engine` | `api.getEnvironmentalImpact()` | Runoff risk & environmental assessment |
| `POST /territorial-water-quality` | `api.getWaterQuality()` | EPA water quality data |
| `POST /alpha-earth-environmental-enhancement` | `api.getSatelliteData()` | Satellite vegetation indices |
| `POST /safe-identification` | `api.safeIdentify()` | Plant ID with toxic lookalike warnings |
| `POST /dynamic-care` | `api.getDynamicCare()` | Hyper-localized care recommendations |
| `POST /beginner-guidance` | `api.getBeginnerGuidance()` | Judgment-free plant help |
| `POST /carbon-credit-calculator` | `api.calculateCarbonCredits()` | Carbon credit estimation |
| `POST /isobus-task` | `api.convertToISOXML()` | ADAPT → ISO-XML v4.3 conversion |
| `GET /isobus-task/ddi-mappings` | `api.getDDIMappings()` | DDI code reference (public) |

> **Note**: `/get-soil-data` and `/agricultural-intelligence` are **different endpoints** with different purposes:
> - `/get-soil-data` returns structured SSURGO soil analysis (pH, organic matter, nutrients, drainage)
> - `/agricultural-intelligence` is an AI chat interface that can *internally* call `/get-soil-data` and other endpoints to answer natural-language agricultural questions

### 2.1 Get Soil Data

```http
POST /get-soil-data
```

**Description**: Retrieve structured SSURGO soil analysis for a specific county. Returns pH, organic matter, nutrient levels, drainage class, and recommendations. This is the primary data endpoint for soil analysis.

**Authentication**: API Key (`x-api-key`) or JWT (`Authorization: Bearer`)

**Request Body**:
```json
{
  "county_fips": "48453",
  "county_name": "Travis County",
  "state_code": "TX",
  "property_address": "123 Farm Rd, Austin, TX",
  "force_refresh": false
}
```

**Required fields**: `county_fips`, `county_name`, `state_code`  
**Optional fields**: `property_address`, `force_refresh`

**Response**:
```json
{
  "soilAnalysis": {
    "id": "uuid",
    "county_name": "Travis County",
    "state_code": "TX",
    "county_fips": "48453",
    "ph_level": 6.8,
    "organic_matter": 3.2,
    "nitrogen_level": "medium",
    "phosphorus_level": "high",
    "potassium_level": "medium",
    "drainage": "good",
    "recommendations": "Soil pH is within optimal range...",
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

### 2.2 Agricultural Intelligence

```http
POST /agricultural-intelligence
```

**Description**: AI-powered agricultural Q&A. Accepts a natural-language `query` and optional `context` (including `county_fips`). Internally orchestrates calls to soil, water, satellite, and weather endpoints to generate a comprehensive answer.

**Authentication**: JWT (`Authorization: Bearer`) required.

**Request Body**:
```json
{
  "query": "What cover crops should I plant in Travis County this spring?",
  "context": {
    "county_fips": "48453",
    "soil_data": {
      "ph_level": 6.8,
      "organic_matter": 3.2,
      "drainage": "good"
    }
  },
  "useGPT5": false
}
```

**Required fields**: `query`  
**Optional fields**: `context` (with optional `county_fips`, `soil_data`, `user_location`), `useGPT5`

**Response**:
```json
{
  "success": true,
  "response": "For Travis County (FIPS 48453), excellent spring cover crop options include...",
  "intent": "planting_calendar",
  "confidence": 0.92,
  "data_sources": ["USDA Soil Data", "Planting Calendar Analytics", "AlphaEarth Satellite Intelligence"]
}
```

### 2.3 Environmental Impact Assessment

```http
POST /environmental-impact-engine
```

**Description**: Assess environmental impact including runoff risk, contamination analysis, carbon footprint, and biodiversity impact. Generates eco-friendly alternatives.

**Authentication**: JWT required. Requires active subscription.

**Composability**: Use the output of `/get-soil-data` as the `soil_data` input for this endpoint. The `drainage` field from soil data is used for runoff risk calculation.

**Request Body**:
```json
{
  "analysis_id": "uuid-from-soil-analysis",
  "county_fips": "48453",
  "soil_data": {
    "ph_level": 6.8,
    "organic_matter": 3.2,
    "drainage": "good",
    "nitrogen_level": "medium",
    "phosphorus_level": "high"
  },
  "proposed_treatments": [
    { "type": "nitrogen_fertilizer", "rate_lbs_acre": 150 }
  ]
}
```

**Required fields**: `analysis_id`, `county_fips`, `soil_data`  
**Optional fields**: `proposed_treatments` (defaults to `[]`)

**Response**:
```json
{
  "impact_assessment": {
    "id": "uuid",
    "runoff_risk_score": 35.0,
    "water_body_proximity": 6.5,
    "contamination_risk": "medium",
    "carbon_footprint_score": 94.8,
    "biodiversity_impact": "neutral"
  },
  "detailed_analysis": {
    "runoff_risk": {
      "score": 35.0,
      "risk_level": "low",
      "contributing_factors": {
        "ph_impact": false,
        "low_organic_matter": false,
        "slope_concern": false,
        "drainage_issue": false,
        "water_proximity": false
      }
    },
    "contamination_assessment": {
      "level": "medium",
      "score": 25.0,
      "risk_factors": ["nitrogen_fertilizer_application"]
    },
    "eco_alternatives": {
      "alternatives": [
        {
          "category": "fertilizer_replacement",
          "alternative": "precision_application",
          "description": "Use precision agriculture for targeted nutrient application",
          "environmental_benefit": "Reduces fertilizer use by 30-40%, minimizes runoff",
          "effectiveness_score": 94
        }
      ],
      "total_alternatives": 1,
      "average_effectiveness": 94.0
    },
    "carbon_analysis": {
      "conventional_footprint": 5.2,
      "alternative_footprint": 1.56,
      "net_reduction": 3.64,
      "percent_reduction": 70.0
    },
    "biodiversity_assessment": {
      "overall": "neutral",
      "pollinator_support": false,
      "soil_health_benefit": false
    }
  },
  "recommendations": [
    "Prioritize precision_application: Use precision agriculture for targeted nutrient application",
    "Monitor environmental impact scores to track improvement over time"
  ]
}
```

### 2.4 Water Quality Assessment

```http
POST /territorial-water-quality
```

**Description**: Retrieve EPA water quality data with contamination analysis for a county.

**Authentication**: JWT or API Key required.

**Request Body**:
```json
{
  "county_fips": "48453",
  "state_code": "TX"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "monitoring_stations": 12,
    "water_grade": "A-",
    "recent_measurements": [
      {
        "parameter": "Nitrate",
        "value": 2.3,
        "unit": "mg/L",
        "mcl_status": "within_limits",
        "risk_level": "low"
      }
    ],
    "contamination_alerts": [],
    "environmental_summary": "Water quality meets EPA standards"
  }
}
```

### 2.5 Satellite Intelligence

```http
POST /alpha-earth-environmental-enhancement
```

**Description**: Access satellite-enhanced environmental data including NDVI, soil moisture, and vegetation health indices.

**Authentication**: JWT required. Requires active subscription.

**Request Body**:
```json
{
  "analysis_id": "uuid",
  "county_fips": "48453",
  "lat": 30.2672,
  "lng": -97.7431,
  "soil_data": { "ph_level": 6.8, "organic_matter": 3.2 }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "vegetation_health": 8.2,
    "soil_moisture": 65.3,
    "environmental_risk": 3.1,
    "ndvi_score": 0.82,
    "confidence": 89,
    "satellite_metadata": {
      "acquisition_date": "2026-02-10",
      "cloud_cover": 5,
      "sensor": "Sentinel-2"
    }
  }
}
```

---

## 3. Consumer Plant Care APIs

These endpoints address the top pain points reported by users of commercial plant ID apps, including misidentification of toxic lookalikes, generic care advice, and intimidating community responses.

### 3.1 Safe Identification (Toxic Lookalike Protection)

```http
POST /safe-identification
```

**Description**: Environmentally-contextualized plant identification with toxic lookalike warnings. Unlike generic plant ID, this endpoint checks against a curated toxic lookalike database and uses environmental context to weight identification probability.

**Pain Point Solved**: Misidentification of dangerous plants (e.g., Poison Hemlock vs Wild Carrot)

**Authentication**: JWT required.

**Request Body**:
```json
{
  "image": "base64_encoded_image_or_url",
  "location": {
    "county_fips": "48453",
    "state_code": "TX",
    "coordinates": { "latitude": 30.2672, "longitude": -97.7431 }
  },
  "context": {
    "environment": "wild",
    "purpose": "foraging",
    "growth_stage": "mature"
  }
}
```

**Response**:
```json
{
  "success": true,
  "identification": {
    "primary_match": {
      "common_name": "Wild Carrot (Queen Anne's Lace)",
      "scientific_name": "Daucus carota",
      "confidence": 78,
      "family": "Apiaceae"
    },
    "environmental_probability": 92,
    "growth_stage_detected": "flowering"
  },
  "safety_analysis": {
    "toxicity_level": "safe",
    "toxic_to": [],
    "lookalikes": [
      {
        "plant_name": "Poison Hemlock",
        "visual_similarity": 85,
        "toxicity_level": "highly_toxic",
        "distinguishing_features": [
          "Purple blotches on smooth stem (vs hairy stem)",
          "Musty smell when crushed (vs carrot smell)",
          "Leaves are more finely divided"
        ]
      }
    ],
    "warnings": [
      "⚠️ HIGH-RISK LOOKALIKE: Poison Hemlock is DEADLY. Check stem for purple blotches.",
      "Always verify with multiple sources before foraging"
    ]
  },
  "confidence_breakdown": {
    "visual_match": 78,
    "environmental_context": 92,
    "regional_prevalence": 88,
    "growth_stage_alignment": 95
  }
}
```

### 3.2 Dynamic Care (Hyper-Localized Recommendations)

```http
POST /dynamic-care
```

**Description**: Real-time, environment-aware care recommendations adjusted for current weather, container type, soil composition, and seasonal factors.

**Pain Point Solved**: Generic "water every 7 days" advice

**Authentication**: JWT required.

**Request Body**:
```json
{
  "plant_species": "Monstera deliciosa",
  "location": {
    "county_fips": "12086",
    "state_code": "FL",
    "indoor": true
  },
  "environment": {
    "light_exposure": "partial_sun",
    "humidity_level": "medium"
  },
  "container_details": {
    "type": "terracotta",
    "size_inches": 10,
    "has_drainage": true
  },
  "soil_type": "potting_mix",
  "last_watered": "2026-02-11"
}
```

**Response**:
```json
{
  "success": true,
  "plant": {
    "common_name": "Monstera deliciosa",
    "care_difficulty": "moderate"
  },
  "current_conditions": {
    "temperature_f": 72,
    "humidity_percent": 55,
    "season": "winter",
    "days_since_watered": 3
  },
  "care_recommendations": {
    "watering": {
      "action": "check_soil",
      "reasoning": "Winter + terracotta pot = slower drying. Check top 2 inches.",
      "next_check_days": 2
    },
    "light": {
      "current_assessment": "adequate",
      "adjustment_needed": false
    },
    "seasonal_notes": "Winter — reduce watering and skip fertilizer until March."
  }
}
```

### 3.3 Beginner Guidance (No-Jargon Support)

```http
POST /beginner-guidance
```

**Description**: Judgment-free, accessible plant guidance in plain language.

**Pain Point Solved**: Community gatekeeping and intimidating technical responses

**Authentication**: JWT required.

**Request Body**:
```json
{
  "question": "My plant has yellow leaves, what's wrong?",
  "plant_context": { "plant_name": "pothos" },
  "location": { "county_fips": "36061", "indoor": true },
  "user_expertise": "complete_beginner"
}
```

**Response**:
```json
{
  "success": true,
  "simple_answer": "Yellow leaves on a Pothos usually mean it's getting too much water.",
  "what_to_do_now": "Let the soil dry out completely before watering again.",
  "why_this_happens": "Roots sitting in wet soil can't breathe and start to struggle.",
  "encouragement": "Pothos are super forgiving — this is totally fixable! 🌱",
  "confidence": 92
}
```

---

## 4. Precision Agriculture APIs

### 4.1 ISOBUS Task Controller ✅ DEPLOYED

#### Convert ADAPT → ISO-XML
```http
POST /isobus-task
POST /isobus-task?format=json
```

**Authentication**: JWT required.

**Request Body (ADAPT 1.0 format)**:
```json
{
  "grower": { "id": "GRW-1", "name": "Smith Farms" },
  "farm": { "id": "FRM-1", "name": "Main Farm" },
  "field": {
    "id": "FLD-001",
    "name": "North 40",
    "area_acres": 40,
    "boundary": {
      "type": "Polygon",
      "coordinates": [[[-89.5, 40.0], [-89.5, 40.01], [-89.49, 40.01], [-89.49, 40.0], [-89.5, 40.0]]]
    }
  },
  "operation": {
    "type": "fertilizer_application",
    "description": "Spring nitrogen application",
    "product": { "name": "UAN-32", "rate": 150, "rateUnit": "lbs/acre", "ddiKey": "NitrogenRate" },
    "prescriptionZones": [
      { "zoneId": "Z1", "rate": 120, "rateUnit": "lbs/acre" },
      { "zoneId": "Z2", "rate": 180, "rateUnit": "lbs/acre" }
    ]
  },
  "equipment": { "id": "EQ-1", "name": "Case IH Patriot 4440", "workingWidth_m": 27.4 }
}
```

**Response (default)**: Raw ISO-XML v4.3 `TASKDATA.XML` (`Content-Type: application/xml`)

**Response (`?format=json`)**:
```json
{
  "success": true,
  "standard": "ISO 11783",
  "version": "4.3",
  "format": "TASKDATA.XML",
  "xml": "<?xml version=\"1.0\"?><ISO11783_TaskData ...>",
  "warnings": [],
  "generatedAt": "2026-02-13T21:16:00.000Z"
}
```

**Supported Operation Types**: `fertilizer_application`, `seeding`, `spraying`, `harvest`, `tillage`, `custom`

#### Validate Input
```http
POST /isobus-task/validate
```
Returns `{ valid: true/false, errors: [], warnings: [] }` before conversion.

#### DDI Mappings Reference
```http
GET /isobus-task/ddi-mappings
```
**Authentication**: Public (no auth required). Returns all DDI code mappings.

**ISO-XML v4.3 Element Mapping:**

| ADAPT Concept | ISO-XML Element |
|---------------|----------------|
| Grower | CUS (Customer) |
| Farm | FRM |
| Field | PFD + PLN (Partfield + Polygon) |
| Operation | TSK + TLG (Task + Time Log) |
| Product | PDT |
| Equipment | DVC + DPD (Device + Property) |
| Prescription Zones | GRD + TZN + PDV (Grid + Treatment Zone + Process Data) |

### 4.2 Carbon Credit Calculator

```http
POST /carbon-credit-calculator
```

**Authentication**: JWT required. Pro tier or above.

**Request Body**:
```json
{
  "field_name": "North 40",
  "field_size_acres": 40,
  "soil_organic_matter": 3.2,
  "verification_type": "satellite"
}
```

### 4.3 VRT Prescription Generator

```http
POST /generate-vrt-prescription
```

**Authentication**: JWT required. Pro tier or above.

**Request Body**:
```json
{
  "fieldId": "uuid",
  "applicationType": "nitrogen",
  "cropType": "corn",
  "baseRate": 150,
  "rateUnit": "lbs/acre",
  "targetYield": 200
}
```

---

## 5. Subscription & Usage APIs

### 5.1 Check Subscription Status
```http
POST /check-subscription
```

**Authentication**: JWT required.

**Response**:
```json
{
  "success": true,
  "data": {
    "subscription_tier": "premium",
    "subscription_status": "active",
    "usage_remaining": {
      "county_lookups": 45,
      "api_calls": 8500
    },
    "subscription_end": "2026-12-31T23:59:59Z"
  }
}
```

### 5.2 API Key Management
```http
POST /api-key-management
```

**Authentication**: JWT required.

Manage API keys: create, list, revoke, and rotate keys for B2B/SDK access.

---

## 6. OEM & Embedded Device APIs

### 6.1 Device Registration
```http
POST /oem-device-register
```

**Authentication**: OEM Development License API key (`x-api-key: ak_oem_*`).

### 6.2 Telemetry Ingestion
```http
POST /oem-telemetry
```

**Authentication**: Device registration token (`x-device-token: drt_*`). Supports batch ingestion up to 1000 readings per request.

### 6.3 5G Edge Coordination
```http
POST /edge-coordinate
```

**Authentication**: Device registration token with fleet coordination permission. Sub-10ms latency via Private 5G URLLC slice.

---

## 7. API Security & Compliance

### 7.1 Rate Limiting

**Tier-based Limits**:

| Tier | Per Minute | Per Hour | Per Day | Support |
|------|------------|----------|---------|---------|
| Free | 10 | 100 | 1,000 | Community |
| Starter | 30 | 500 | 5,000 | Email (48hr) |
| Pro | 100 | 2,000 | 25,000 | Priority (24hr) |
| Enterprise | 500 | 10,000 | 100,000 | 24/7 Dedicated |
| OEM | 1,000 | 50,000 | 500,000 | Dedicated + On-Site |

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
X-Tier: pro
```

### 7.2 Input Validation (Zod Schemas)

All API endpoints use **Zod** schemas for server-side validation. Invalid requests return `400 Bad Request` with descriptive error messages.

**Common Validation Rules**:
- `county_fips`: Exactly 5 digits (regex: `/^\d{5}$/`)
- `state_code`: 2 uppercase letters (regex: `/^[A-Z]{2}$/`)
- `email`: Valid email format, max 255 characters
- `uuid`: Valid UUID v4 format

**Example Validation Error**:
```json
{
  "success": false,
  "error": "Validation failed: county_fips: County FIPS must be exactly 5 digits",
  "request_id": "req_abc123"
}
```

📋 **Reference**: See [VALIDATION_SCHEMAS.md](./VALIDATION_SCHEMAS.md) for complete schema documentation.

### 7.3 Error Handling

**Standard Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_COUNTY_FIPS",
    "message": "The provided FIPS code is invalid",
    "details": "FIPS code must be exactly 5 digits",
    "request_id": "req_abc123"
  }
}
```

All error responses include the `details` field for programmatic handling.

**Error Message Sanitization**:
- Internal errors (OpenAI, database) return generic "Service temporarily unavailable" messages
- Detailed error information logged server-side only
- No API keys, internal paths, or third-party service names exposed to clients

**Common Error Codes**:

| Code | HTTP Status | Description |
|------|------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid API key/JWT |
| `INSUFFICIENT_PERMISSIONS` | 403 | Feature requires higher tier |
| `RATE_LIMIT_EXCEEDED` | 429 | Check `X-RateLimit-Reset` header |
| `INVALID_INPUT` | 400 | Request validation failed |
| `SUBSCRIPTION_REQUIRED` | 402 | Feature requires paid subscription |
| `SERVICE_UNAVAILABLE` | 503 | Temporary issue — retry with backoff |

### 7.4 Graceful Degradation

All external API integrations implement **graceful degradation** with fallback chains:

| Service | Primary | Fallback 1 | Fallback 2 |
|---------|---------|------------|------------|
| AI Chat | GPT-5 | GPT-4o | GPT-4o-mini |
| Water Quality | EPA Real-time | Cached Data | Simulated Data |
| Soil Data | SSURGO | NRCS Soil Mart | Cached Data |
| Satellite | Google Earth | Sentinel-2 | Historical Data |
| Weather | NOAA Real-time | Historical Avg | Estimated |

**Degradation Response** (metadata field):
```json
{
  "metadata": {
    "source": "fallback",
    "degraded": true,
    "degradation_reason": "Primary API timeout"
  }
}
```

### 7.5 SOC 2 Type 1 Compliance

**Audit Logging**: All API requests logged with:
- Request timestamp and duration
- User ID and IP address
- Request/response data (sanitized)
- Security events and access attempts

**Data Protection**: TLS 1.3, input validation, output encoding, SQL injection protection.

**Data Retention**: API logs 7 years, audit trails permanent.

---

## 8. SDK Installation & Usage

### 8.1 TypeScript/JavaScript

```bash
npm install @soilsidekick/sdk
```

```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

const api = new DefaultApi(new Configuration({
  apiKey: 'ak_your_api_key_here',
  basePath: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
}));

// Get soil data
const soil = await api.getSoilData({
  county_fips: '12086',
  county_name: 'Miami-Dade',
  state_code: 'FL'
});
console.log(soil.soilAnalysis.ph_level);
console.log(soil.soilAnalysis.drainage); // "good"

// Chain into environmental impact
const impact = await api.getEnvironmentalImpact({
  analysis_id: soil.soilAnalysis.id,
  county_fips: '12086',
  soil_data: {
    ph_level: soil.soilAnalysis.ph_level,
    organic_matter: soil.soilAnalysis.organic_matter,
    drainage: soil.soilAnalysis.drainage,
    nitrogen_level: soil.soilAnalysis.nitrogen_level,
    phosphorus_level: soil.soilAnalysis.phosphorus_level
  }
});
console.log(impact.impact_assessment.runoff_risk_score);
```

### 8.2 Python

```python
from soilsidekick import Configuration, DefaultApi

config = Configuration()
config.api_key['x-api-key'] = 'ak_your_api_key_here'
config.host = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'

api = DefaultApi(config)
soil = api.get_soil_data(
    county_fips='12086',
    county_name='Miami-Dade',
    state_code='FL'
)
print(f"pH: {soil.soil_analysis.ph_level}")
print(f"Drainage: {soil.soil_analysis.drainage}")
```

**Also Available**: Go, Ruby, Java, PHP (auto-generated from OpenAPI specification)

### 8.3 Webhook Integration

Configure webhooks for real-time notifications (soil analysis completion, environmental alerts, subscription changes, security events). Webhooks use HMAC-SHA256 signature verification and retry with exponential backoff.

---

## 9. Enterprise Add-On Services

| Add-On | Pricing | Implementation |
|--------|---------|----------------|
| Private Cloud Deployment | $150K–300K/year | 12–16 weeks |
| Custom Model Fine-Tuning | $50K–100K/engagement | 8–12 weeks |
| Compliance Package (GMP/FDA/ISA) | $75K–150K/year | 6–8 weeks |
| Real-Time Event Streaming | $35K–75K/year | 4–6 weeks |
| OEM Embedded Licensing | $24,900/year + runtime royalties | 8–12 weeks |
| Private 5G Edge Computing | $500K+/year | 16–24 weeks |

---

## Support & Resources

| Resource | URL |
|----------|-----|
| **Developer Sandbox** | [/developer-sandbox](/developer-sandbox) |
| **Swagger UI** | [/swagger-ui](/swagger-ui) |
| **Postman Collection** | [/postman/leafengines-collection.json](/postman/leafengines-collection.json) |
| **API Keys** | [/api-keys](/api-keys) |
| **Quickstart** | [SDK_QUICKSTART.md](./docs/SDK_QUICKSTART.md) |
| **Integration Guide** | [SDK_INTEGRATION_GUIDE.md](./docs/SDK_INTEGRATION_GUIDE.md) |
| **Onboarding Plan** | [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md) |

**API Support**: support@soilsidekickpro.com  
**Security Issues**: admin@soilsidekickpro.com  
**Partnerships**: partnerships@leafengines.com

**Compliance Certifications**:
- SOC 2 Type 1 Certified (Type II targeted Q2 2026)
- PCI DSS Compliant (Payment Processing)
- GDPR Compliant (Data Privacy)
- ISO 11783 (ISOBUS) Compatible
- SAE J1939 Compatible
