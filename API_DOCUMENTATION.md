# SoilSidekick Pro API Documentation
# LeafEngines™ B2B API Platform

## Version: 2.1
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

**1. API Key Authentication (B2B/SDK Access) - Recommended for External Integrations**

For external integrations and SDK usage, use the `x-api-key` header:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data \
     -H "x-api-key: ak_your_api_key_here" \
     -H "Content-Type: application/json" \
     -d '{"county_fips": "48453"}'
```

API keys are generated through the dashboard or via the `/api-key-management` endpoint and use the `ak_*` format.

**2. JWT Authentication (Internal/User Sessions)**

For authenticated user sessions within the application:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/agricultural-intelligence \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"county_fips": "48453"}'
```

### 1.4 Multi-Language SDK (December 2025)

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

## 2. Core API Endpoints

### 2.1 Agricultural Intelligence

#### Get Soil Analysis
```http
POST /agricultural-intelligence
```

**Description**: Retrieve comprehensive soil analysis for a specific county with AI-powered recommendations.

**Security**: User data isolated by authentication token, all requests logged for audit compliance.

**Request Body**:
```json
{
  "county_fips": "48453",
  "county_name": "Travis County",
  "state_code": "TX",
  "analysis_type": "comprehensive"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "county_name": "Travis County",
    "state_code": "TX",
    "ph_level": 6.8,
    "organic_matter": 3.2,
    "nitrogen_level": "medium",
    "phosphorus_level": "high",
    "potassium_level": "medium",
    "recommendations": "Soil pH is optimal for most crops...",
    "environmental_score": 7.5,
    "satellite_data": {
      "vegetation_health": 8.2,
      "soil_moisture": 65.3,
      "confidence": 89
    }
  },
  "metadata": {
    "analysis_id": "uuid",
    "timestamp": "2025-01-15T10:30:00Z",
    "compliance": "SOC2_TYPE1"
  }
}
```

### 2.2 Environmental Impact Assessment

#### Calculate Environmental Impact
```http
POST /environmental-impact-engine
```

**Description**: Assess environmental impact and runoff risk with eco-friendly recommendations.

**Security**: Environmental data protected under SOC 2 Type 1 compliance with secure processing.

**Request Body**:
```json
{
  "county_fips": "48453",
  "soil_data": {
    "ph_level": 6.8,
    "organic_matter": 3.2,
    "drainage": "moderate"
  },
  "fertilizer_plan": {
    "nitrogen": 150,
    "phosphorus": 50,
    "potassium": 100
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "runoff_risk_score": 4.2,
    "environmental_grade": "B+",
    "carbon_footprint": 2.1,
    "water_body_proximity": 3.5,
    "eco_alternatives": [
      {
        "type": "organic",
        "description": "Compost-based fertilizer",
        "reduction_percentage": 35
      }
    ],
    "sustainability_recommendations": [
      "Use buffer strips near water bodies",
      "Consider split application timing"
    ]
  }
}
```

### 2.3 Water Quality Assessment

#### Get Water Quality Data
```http
POST /territorial-water-quality
```

**Description**: Retrieve real-time EPA water quality data with contamination analysis.

**Security**: EPA data integration with secure caching and audit logging.

**Request Body**:
```json
{
  "county_fips": "48453",
  "parameters": ["nitrate", "phosphorus", "ph", "temperature"]
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

### 2.4 Satellite Intelligence

#### Get AlphaEarth Satellite Data
```http
POST /alpha-earth-environmental-enhancement
```

**Description**: Access Google Earth Engine satellite data for vegetation and environmental analysis.

**Security**: Satellite data processed securely with encrypted transmission and storage.

**Request Body**:
```json
{
  "latitude": 30.2672,
  "longitude": -97.7431,
  "analysis_type": "comprehensive",
  "date_range": "2025-01-01:2025-01-15"
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
      "acquisition_date": "2025-01-14",
      "cloud_cover": 5,
      "sensor": "Sentinel-2"
    }
  }
}
```

## 2.5 Consumer Plant Care APIs

These endpoints address the top pain points reported by users of commercial plant ID apps, including misidentification of toxic lookalikes, generic care advice, and intimidating community responses.

### 2.5.1 Safe Identification (Toxic Lookalike Protection)
```http
POST /safe-identification
```

**Description**: Environmentally-contextualized plant identification with toxic lookalike warnings. Unlike generic plant ID, this endpoint checks against a curated toxic lookalike database and uses environmental context to weight identification probability.

**Pain Point Solved**: Misidentification of dangerous plants (e.g., Poison Hemlock vs Wild Carrot)

**Security**: Requires JWT authentication. All identifications logged for audit compliance.

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
      "⚠️ HIGH-RISK LOOKALIKE: Poison Hemlock (Conium maculatum) is DEADLY and looks very similar. Check stem for purple blotches before consuming.",
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

### 2.5.2 Dynamic Care (Hyper-Localized Recommendations)
```http
POST /dynamic-care
```

**Description**: Real-time, environment-aware care recommendations that adjust based on current weather, container type, soil composition, and seasonal factors.

**Pain Point Solved**: Generic "water every 7 days" advice that leads to overwatering/underwatering

**Security**: Requires JWT authentication. Integrates with live weather APIs for real-time data.

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
  "last_watered": "2025-01-18"
}
```

**Response**:
```json
{
  "success": true,
  "plant": {
    "common_name": "Monstera deliciosa",
    "scientific_name": "Monstera deliciosa",
    "care_difficulty": "moderate"
  },
  "current_conditions": {
    "temperature_f": 72,
    "humidity_percent": 55,
    "recent_rainfall_inches": 0,
    "season": "winter",
    "days_since_watered": 3
  },
  "care_recommendations": {
    "watering": {
      "action": "check_soil",
      "reasoning": "Winter + terracotta pot = slower drying. Check top 2 inches of soil. Miami's 55% humidity helps reduce water needs.",
      "next_check_days": 2,
      "amount_guidance": "Water until it drains from bottom, then empty saucer"
    },
    "light": {
      "current_assessment": "adequate",
      "adjustment_needed": false,
      "recommendation": "Partial sun is perfect for Monstera. No changes needed."
    },
    "humidity": {
      "current_level": "adequate",
      "ideal_range": "50-70%",
      "adjustment_recommendation": "Your humidity is fine. No misting needed."
    },
    "seasonal_notes": "It's winter - your Monstera is growing slowly. Reduce watering and skip fertilizer until March."
  },
  "warnings": []
}
```

### 2.5.3 Beginner Guidance (No-Jargon Support)
```http
POST /beginner-guidance
```

**Description**: Judgment-free, accessible plant guidance that translates scientific jargon into plain language and provides encouraging, supportive responses.

**Pain Point Solved**: Community gatekeeping and intimidating technical responses that make beginners feel stupid

**Security**: Requires JWT authentication. AI responses filtered for appropriate tone.

**Request Body**:
```json
{
  "question": "My plant has yellow leaves, what's wrong?",
  "plant_context": {
    "plant_name": "pothos"
  },
  "location": {
    "county_fips": "36061",
    "indoor": true
  },
  "user_expertise": "complete_beginner"
}
```

**Response**:
```json
{
  "success": true,
  "simple_answer": "Yellow leaves on a Pothos usually mean it's getting too much water. It's one of the most common plant parent mistakes - you're not alone!",
  "what_to_do_now": "Let the soil dry out completely before watering again. Stick your finger 2 inches into the soil - if it's damp, wait a few more days.",
  "why_this_happens": "When roots sit in wet soil too long, they can't breathe and start to struggle. The plant shows this stress through yellow leaves.",
  "detailed_explanation": {
    "technical_term": "Overwatering / Root stress",
    "plain_english": "The roots are drowning because the soil stays wet too long",
    "common_causes": [
      "Watering on a schedule instead of when the plant needs it",
      "Pot doesn't have drainage holes",
      "Using soil that holds too much water"
    ],
    "prevention_tips": [
      "Only water when the top 2 inches of soil are dry",
      "Make sure your pot has drainage holes",
      "Use a well-draining potting mix"
    ]
  },
  "encouragement": "Pothos are super forgiving plants - this is totally fixable! Once you adjust your watering, new growth will come in green and healthy. You've got this! 🌱",
  "related_questions": [
    "How do I know when my Pothos needs water?",
    "Should I remove the yellow leaves?",
    "What's the best pot for a Pothos?"
  ],
  "confidence": 92
}
```

## 3. Subscription & Usage APIs

### 3.1 Check Subscription Status
```http
POST /check-subscription
```

**Description**: Validate user subscription and usage limits.

**Security**: Payment data encrypted under SOC 2 Type 1 compliance with PCI DSS standards.

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
    "subscription_end": "2025-12-31T23:59:59Z"
  }
}
```

### 3.2 Usage Analytics
```http
GET /usage-analytics
```

**Description**: Retrieve usage statistics and analytics (Admin only).

**Security**: Administrative access required with enhanced audit logging.

## 4. API Security & Compliance

### 4.1 Rate Limiting

**Tier-based Limits** (December 2025):

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

### 4.2 Input Validation (Zod Schemas)

All API endpoints use **Zod** schemas for server-side validation. Invalid requests return `400 Bad Request` with descriptive error messages.

**Common Validation Patterns**:
- `county_fips`: Exactly 5 digits (regex: `/^\d{5}$/`)
- `state_code`: 2 uppercase letters (regex: `/^[A-Z]{2}$/`)
- `email`: Valid email format, max 255 characters
- `uuid`: Valid UUID v4 format

**Example Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed: county_fips: County FIPS must be exactly 5 digits",
    "request_id": "req_abc123"
  }
}
```

📋 **Reference**: See [VALIDATION_SCHEMAS.md](./VALIDATION_SCHEMAS.md) for complete schema documentation.

### 4.3 Graceful Degradation

All external API integrations implement **graceful degradation** with fallback chains:

| Service | Primary | Fallback 1 | Fallback 2 |
|---------|---------|------------|------------|
| AI Chat | GPT-5 | GPT-4o | GPT-4o-mini |
| Water Quality | EPA Real-time | Cached Data | Simulated Data |
| Soil Data | SSURGO | NRCS Soil Mart | Cached Data |
| Satellite | Google Earth | Sentinel-2 | Historical Data |
| Weather | NOAA Real-time | Historical Avg | Estimated |

**Degradation Response**:
```json
{
  "success": true,
  "data": { /* response data */ },
  "metadata": {
    "source": "fallback",
    "degraded": true,
    "degradation_reason": "Primary API timeout"
  }
}
```

### 4.4 Circuit Breakers

External services are protected by **circuit breakers** to prevent cascade failures:

| Circuit | Threshold | Open Duration | Half-Open |
|---------|-----------|---------------|-----------|
| EPA | 5 failures | 60 seconds | 30 seconds |
| USDA | 5 failures | 60 seconds | 30 seconds |
| Google Earth | 5 failures | 60 seconds | 30 seconds |
| NOAA | 5 failures | 60 seconds | 30 seconds |
| OpenAI | 5 failures | 60 seconds | 30 seconds |

**Circuit States**:
- **Closed**: Normal operation
- **Open**: All requests return fallback immediately
- **Half-Open**: Single test request allowed; success closes circuit

📋 **Reference**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for implementation details.

### 4.2 Error Handling

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

**Error Message Sanitization** (December 2025):
- Internal errors (OpenAI, database) return generic "Service temporarily unavailable" messages
- Detailed error information logged server-side only for debugging
- No API keys, internal paths, or third-party service names exposed to clients

**Automatic Retry Logic**:
- Client SDKs implement exponential backoff (1s, 2s, 4s delays)
- Maximum 3 retry attempts for transient errors (502, 503, timeout)
- User-friendly status messages during retry attempts

**Common Error Codes**:
- `AUTHENTICATION_REQUIRED`: Missing or invalid API key/JWT token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests - check X-RateLimit-Reset header
- `INVALID_INPUT`: Request validation failed
- `SUBSCRIPTION_REQUIRED`: Feature requires paid subscription
- `SERVICE_UNAVAILABLE`: Temporary service issue - retry with backoff

### 4.3 SOC 2 Type 1 Compliance Features

**Audit Logging**: All API requests logged with:
- Request timestamp and duration
- User ID and IP address
- Request/response data (sanitized)
- Security events and access attempts

**Data Protection**:
- TLS 1.3 encryption for all data transmission
- Input validation and sanitization
- Output encoding to prevent XSS
- SQL injection protection

**Access Controls**:
- JWT token validation on all endpoints
- Role-based access control
- User data isolation
- Administrative function separation

## 5. OEM & Embedded Device APIs (February 2026)

### 5.1 Device Registration
```http
POST /oem-device-register
```

**Description**: Register an OEM embedded device with the LeafEngines platform. Required for runtime royalty metering and OTA update management.

**Authentication**: Requires OEM Development License API key (`x-api-key: ak_oem_*`).

**Request Body**:
```json
{
  "device_id": "jd-tractor-8r-00142",
  "hardware_platform": "arm_cortex_a72",
  "firmware_version": "2.1.0",
  "licensee_id": "lic_deere_2026",
  "capabilities": {
    "gpu_available": false,
    "protocols": ["can_bus", "j1939", "isobus"],
    "storage_gb": 32
  },
  "location": {
    "county_fips": "19153",
    "state_code": "IA"
  }
}
```

**Response**:
```json
{
  "success": true,
  "device": {
    "device_id": "jd-tractor-8r-00142",
    "registration_token": "drt_abc123",
    "assigned_edge_node": "mec-iowa-central-01",
    "mqtt_broker": "mqtt://edge-ia-01.leafengines.io:8883",
    "ota_channel": "stable",
    "royalty_tier": "standard"
  },
  "protocols_configured": {
    "can_bus": { "baud_rate": 250000, "filters": ["0x18FEF100-0x18FEF1FF"] },
    "j1939": { "source_address": 128, "pgn_whitelist": ["EEC1", "CCVS", "ET1"] },
    "isobus": { "tc_client_enabled": true, "iso_xml_version": "4.3" }
  }
}
```

### 5.2 Telemetry Ingestion
```http
POST /oem-telemetry
```

**Description**: Ingest real-time sensor telemetry from OEM devices via CAN Bus / J1939 protocols. Supports batch ingestion up to 1000 readings per request.

**Authentication**: Device registration token (`x-device-token: drt_*`).

**Request Body**:
```json
{
  "device_id": "jd-tractor-8r-00142",
  "readings": [
    {
      "timestamp": "2026-02-10T14:30:00Z",
      "protocol": "j1939",
      "pgn": "EEC1",
      "data": {
        "engine_speed_rpm": 1800,
        "engine_torque_pct": 72
      }
    },
    {
      "timestamp": "2026-02-10T14:30:00Z",
      "protocol": "can_bus",
      "arbitration_id": "0x18FEF128",
      "data": {
        "soil_moisture_pct": 34.2,
        "soil_temperature_c": 18.5
      }
    }
  ],
  "batch_id": "batch_20260210_143000"
}
```

**Response**:
```json
{
  "success": true,
  "accepted": 2,
  "rejected": 0,
  "batch_id": "batch_20260210_143000",
  "processing_latency_ms": 12
}
```

### 5.3 5G Edge Coordination
```http
POST /edge-coordinate
```

**Description**: Real-time autonomous fleet coordination via Private 5G URLLC slice. Requires sub-10ms latency for safety-critical operations.

**Authentication**: Device registration token with fleet coordination permission.

**Request Body**:
```json
{
  "fleet_id": "fleet-ia-central-042",
  "device_id": "jd-tractor-8r-00142",
  "coordination_type": "path_planning",
  "position": {
    "latitude": 41.8780,
    "longitude": -93.0977,
    "heading_deg": 270,
    "speed_kph": 8.5
  },
  "nearby_vehicles": ["jd-tractor-8r-00143", "jd-sprayer-4940-007"],
  "field_context": {
    "operation": "planting",
    "row_spacing_cm": 76,
    "swath_width_m": 12
  }
}
```

**Response**:
```json
{
  "success": true,
  "coordination": {
    "recommended_path": [
      { "lat": 41.8781, "lng": -93.0978, "speed_kph": 8.5 },
      { "lat": 41.8782, "lng": -93.0979, "speed_kph": 8.0 }
    ],
    "collision_risk": "none",
    "overlap_pct": 1.2,
    "next_update_ms": 500
  },
  "latency_ms": 7,
  "slice": "urllc"
}
```

### 5.4 ISOBUS Task Controller ✅ DEPLOYED

**Status:** ✅ Live — Supabase edge function `isobus-task`

#### Convert ADAPT → ISO-XML
```http
POST /functions/v1/isobus-task
POST /functions/v1/isobus-task?format=json
```

**Authentication**: JWT Bearer token required.

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
  "xml": "<?xml version=\"1.0\"?><ISO11783_TaskData VersionMajor=\"4\" VersionMinor=\"3\"...>",
  "warnings": [],
  "generatedAt": "2026-02-13T21:16:00.000Z",
  "generatedBy": "SoilSidekick Pro"
}
```

**Supported Operation Types**: `fertilizer_application`, `seeding`, `spraying`, `harvest`, `tillage`, `custom`

#### Validate Input
```http
POST /functions/v1/isobus-task/validate
```
Returns validation result with `errors[]` and `warnings[]` before conversion.

#### DDI Mappings Reference
```http
GET /functions/v1/isobus-task/ddi-mappings
```
**Authentication**: Public (no auth required). Returns all 11 DDI code mappings (ApplicationRate, SeedRate, Yield, WorkingWidth, FuelConsumption, NitrogenRate, PhosphorusRate, PotassiumRate, SprayPressure, GroundSpeed, WorkState).

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

## 6. SDK and Integration

### 5.1 SDK Client Onboarding

**New Enterprise Clients**: Follow our comprehensive 4-week onboarding plan for seamless SDK/API integration.

📋 **Reference**: See [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md) for:
- Pre-implementation requirements
- Week-by-week implementation schedule
- Technical setup and authentication
- Core feature integration
- Production deployment procedures
- Success metrics and support

**Quick Start Timeline**:
- **Week 1**: Setup & Authentication
- **Week 2**: Core Feature Integration
- **Week 3**: Advanced Features & Optimization
- **Week 4**: Testing, Documentation & Go-Live

### 5.2 Multi-Language SDK Installation (December 2025)

**TypeScript/JavaScript (npm)**:
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
const soil = await api.getSoilData({ county_fips: '12086' });
console.log(soil.ph_level, soil.organic_matter);
```

**Python**:
```python
from soilsidekick import Configuration, DefaultApi

config = Configuration()
config.api_key['x-api-key'] = 'ak_your_api_key_here'
config.host = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'

api = DefaultApi(config)
soil = api.get_soil_data(county_fips='12086')
print(f"pH: {soil.ph_level}")
```

**Also Available**: Go, Ruby, Java, PHP (auto-generated from OpenAPI specification)

### 5.3 Webhook Integration

**Webhook Endpoints**: Configure webhooks for real-time notifications:
- Soil analysis completion
- Environmental alerts
- Subscription changes
- Security events

**Webhook Security**:
- HTTPS endpoints required
- Signature verification using HMAC-SHA256
- Retry logic with exponential backoff (1s, 2s, 4s)
- Idempotency for duplicate handling

### 5.4 Enterprise Add-On Services (December 2025)

| Add-On | Pricing | Implementation |
|--------|---------|----------------|
| Private Cloud Deployment | $150K-300K/year | 12-16 weeks |
| Custom Model Fine-Tuning | $50K-100K/engagement | 8-12 weeks |
| Compliance Package (GMP/FDA/ISA) | $75K-150K/year | 6-8 weeks |
| Real-Time Event Streaming | $35K-75K/year | 4-6 weeks |
| OEM Embedded Licensing | $24,900/year + runtime royalties | 8-12 weeks |
| Private 5G Edge Computing | $500K+/year (partner platform fee) | 16-24 weeks |

## 6. Compliance & Governance

### 6.1 SOC 2 Type 1 Audit Trail

All API interactions maintain comprehensive audit trails including:
- User authentication and authorization events
- Data access and modification logs
- Security incident detection and response
- System performance and availability metrics

### 6.2 Data Retention & Privacy

**Data Retention**:
- API logs: 7 years for compliance
- User data: As per subscription terms
- Audit trails: Permanent retention for SOC 2 compliance

**Privacy Protection**:
- User consent tracking for data processing
- Data anonymization for analytics
- Right to deletion compliance (GDPR)
- Cross-border data transfer protection

---

## Support & Resources

**API Support**: support@soilsidekickpro.com
**Security Issues**: admin@soilsidekickpro.com
**Documentation**: https://docs.soilsidekickpro.com
**Status Page**: https://status.soilsidekickpro.com

**SDK Client Onboarding**: See [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md) for enterprise integration guide

**Compliance Certifications**:
- SOC 2 Type 1 Certified (Type II targeted Q2 2026)
- PCI DSS Compliant (Payment Processing)
- GDPR Compliant (Data Privacy)
- ISO 11783 (ISOBUS) Compatible
- SAE J1939 Compatible