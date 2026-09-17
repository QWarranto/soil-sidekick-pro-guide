# Validation Schemas Reference

**Version**: 1.0  
**Date**: December 2025  
**Location**: `supabase/functions/_shared/validation.ts`

---

## 1. Overview

All SoilSidekick Pro edge functions use **Zod** schemas for server-side input validation. This document provides complete documentation for all validation schemas.

---

## 2. Common Schemas

### 2.1 Primitive Schemas

| Schema | Pattern | Example |
|--------|---------|---------|
| `emailSchema` | Valid email, max 255 chars | `user@example.com` |
| `fipsCodeSchema` | Exactly 5 digits | `48453` |
| `stateCodeSchema` | 2 uppercase letters | `TX` |
| `uuidSchema` | Valid UUID v4 | `550e8400-e29b-41d4-a716-446655440000` |
| `urlSchema` | Valid URL, max 2048 chars | `https://example.com` |

### 2.2 Example Valid/Invalid

```typescript
// fipsCodeSchema
✅ Valid: "48453", "06037", "00001"
❌ Invalid: "4845", "484530", "ABCDE", "48-453"

// stateCodeSchema
✅ Valid: "TX", "CA", "NY"
❌ Invalid: "tx", "Texas", "T", "TXA"

// emailSchema
✅ Valid: "user@example.com", "a@b.co"
❌ Invalid: "not-an-email", "@example.com", ""
```

---

## 3. Geographic Schemas

### 3.1 countyLookupSchema

**Used by**: `county-lookup`, `get-soil-data`

```typescript
{
  county_fips: string,      // Required: 5-digit FIPS code
  county_name: string,      // Required: 1-100 chars
  state_code: string,       // Required: 2 uppercase letters
  property_address?: string, // Optional: 1-500 chars
  force_refresh?: boolean    // Optional: bypass cache
}
```

**Example Request**:
```json
{
  "county_fips": "48453",
  "county_name": "Travis County",
  "state_code": "TX",
  "property_address": "123 Main St, Austin"
}
```

### 3.2 locationSchema

**Used by**: Multiple agricultural endpoints

```typescript
{
  county_fips: string,      // Required: 5-digit FIPS code
  state_code?: string,      // Optional: 2 uppercase letters
  county_name?: string,     // Optional: max 100 chars
  latitude?: number,        // Optional: -90 to 90
  longitude?: number        // Optional: -180 to 180
}
```

---

## 4. API Endpoint Schemas

### 4.1 agriculturalIntelligenceSchema

**Endpoint**: `POST /agricultural-intelligence`

```typescript
{
  query: string,            // Required: 1-5000 chars
  context?: {
    county_fips?: string,   // 5-digit FIPS
    soil_data?: any,        // Soil analysis data
    user_location?: string  // Max 200 chars
  },
  useGPT5?: boolean         // Use GPT-5 model
}
```

### 4.2 soilDataSchema

**Endpoint**: `POST /get-soil-data`

```typescript
{
  county_fips: string,      // Required: 5-digit FIPS
  county_name: string,      // Required: 1-100 chars
  state_code: string,       // Required: 2 uppercase letters
  property_address: string, // Required: 1-500 chars
  force_refresh?: boolean   // Optional: bypass cache
}
```

### 4.3 waterQualitySchema

**Endpoint**: `POST /territorial-water-quality`

```typescript
{
  county_fips: string,      // Required: 5-digit FIPS
  state_code?: string,      // Optional: 2 uppercase letters
  force_refresh?: boolean   // Optional: bypass cache
}
```

### 4.4 environmentalImpactSchema

**Endpoint**: `POST /environmental-impact-engine`

```typescript
{
  analysis_id: string,      // Required: 1-100 chars
  county_fips: string,      // Required: 5-digit FIPS
  soil_data: Record<string, any>,  // Required: soil analysis
  proposed_treatments?: Array<Record<string, any>>  // Optional
}
```

### 4.5 plantingCalendarSchema

**Endpoint**: `POST /multi-parameter-planting-calendar`

```typescript
{
  county_fips: string,      // Required: 5-digit FIPS
  crop_type: string,        // Required: 1-100 chars
  soil_data?: Record<string, any>,
  climate_preferences?: Record<string, any>,
  sustainability_goals?: string[]
}
```

---

## 5. AI/ML Schemas

### 5.1 gpt5ChatSchema

**Endpoint**: `POST /gpt5-chat`

```typescript
{
  messages: Array<{
    role: 'system' | 'user' | 'assistant',
    content: string        // 1-50000 chars
  }>,                      // 1-100 messages
  temperature?: number,    // 0-2, default 0.7
  max_tokens?: number,     // 1-8000, default 2000
  stream?: boolean         // Default false
}
```

**Example Request**:
```json
{
  "messages": [
    { "role": "system", "content": "You are an agricultural expert." },
    { "role": "user", "content": "What soil amendments improve clay drainage?" }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### 5.2 reportSummarySchema

**Endpoint**: `POST /smart-report-summary`

```typescript
{
  reportType: 'soil' | 'water' | 'environmental',
  reportData: Record<string, any>,  // Required: report data
  maxLength?: number                 // 100-5000 chars
}
```

### 5.3 seasonalPlanningSchema

**Endpoint**: `POST /seasonal-planning-assistant`

```typescript
{
  location: {
    county_fips?: string,   // 5-digit FIPS
    county_name: string,    // Max 100 chars
    state_code: string,     // 2 uppercase letters
    fips_code?: string      // Alternative FIPS field
  },
  soilData?: Record<string, any>,
  planningType: 'rotation' | 'planting' | 'harvest' | 'cover-crop' | 'general',
  cropPreferences?: Record<string, any>,
  timeframe?: 'season' | 'year' | 'multi-year'  // Default 'year'
}
```

### 5.4 satelliteAnalysisSchema

**Endpoint**: `POST /alpha-earth-environmental-enhancement`

```typescript
{
  analysis_id: string,      // Required: 1-100 chars
  county_fips: string,      // Required: 5-digit FIPS
  lat: number,              // Required: -90 to 90
  lng: number,              // Required: -180 to 180
  soil_data: Record<string, any>,  // Required
  water_body_data?: Record<string, any>  // Optional
}
```

---

## 6. Payment Schemas

### 6.1 checkoutSchema

**Endpoint**: `POST /create-checkout`

```typescript
{
  plan: 'starter' | 'pro' | 'enterprise',
  interval: 'month' | 'year'
}
```

### 6.2 customerPortalSchema

**Endpoint**: `POST /customer-portal`

```typescript
{
  returnUrl?: string        // Valid URL, max 2048 chars
}
```

### 6.3 subscriptionCheckSchema

**Endpoint**: `POST /check-subscription`

```typescript
{
  forceRefresh?: boolean    // Bypass cache
}
```

---

## 7. Authentication Schemas

### 7.1 trialAuthSchema

**Endpoint**: `POST /trial-auth`

```typescript
{
  email: string,            // Required: valid email
  action: 'create_trial' | 'verify_trial',
  trialDuration?: number    // 1-30 days
}
```

### 7.2 externalAuthSchema

**Endpoint**: `POST /validate-external-auth`

```typescript
{
  token: string,            // Required: 1-1000 chars
  email: string,            // Required: valid email
  provider?: 'soilcertify' | 'partner_api' | 'oauth',  // Default 'soilcertify'
  metadata?: Record<string, any>
}
```

### 7.3 signinNotificationSchema

**Endpoint**: `POST /send-signin-notification`

```typescript
{
  email: string,            // Required: valid email
  userName?: string,        // Max 200 chars
  ipAddress?: string,       // Max 45 chars (IPv6)
  userAgent?: string,       // Max 500 chars
  timestamp?: string        // ISO datetime
}
```

---

## 8. Specialized Schemas

### 8.1 carbonCreditSchema

**Endpoint**: `POST /carbon-credit-calculator`

```typescript
{
  field_name: string,       // Required: 1-200 chars
  field_size_acres: number, // Required: positive, max 100000
  soil_organic_matter?: number,  // 0-100
  soil_analysis_id?: string,     // Valid UUID
  verification_type?: 'self_reported' | 'third_party' | 'satellite'
}
```

### 8.2 vrtPrescriptionSchema

**Endpoint**: `POST /generate-vrt-prescription`

```typescript
{
  fieldId: string,          // Required: valid UUID
  soilAnalysisId?: string,  // Valid UUID
  applicationType: 'nitrogen' | 'phosphorus' | 'potassium' | 'lime' | 'herbicide' | 'fungicide' | 'insecticide',
  cropType: string,         // Required: 1-100 chars
  baseRate: number,         // Required: positive
  rateUnit: string,         // Required: 1-50 chars
  targetYield?: number      // Positive
}
```

### 8.3 threatDetectionSchema

**Endpoint**: `POST /enhanced-threat-detection`

```typescript
{
  event_type: string,       // Required: 1-100 chars
  source_ip?: string,       // Max 45 chars
  user_agent?: string,      // Max 500 chars
  metadata?: Record<string, any>,
  severity_override?: 'low' | 'medium' | 'high' | 'critical'
}
```

### 8.4 soc2ComplianceSchema

**Endpoint**: `POST /soc2-compliance-monitor`

```typescript
{
  action: 'run_compliance_check' | 'get_compliance_history' | 'create_compliance_audit_entry' | 'schedule_compliance_monitoring',
  check_type?: 'automated' | 'manual' | 'scheduled',
  details?: Record<string, any>
}
```

---

## 9. Validation Functions

### 9.1 validateInput

Validates data and throws on error:

```typescript
import { validateInput, soilDataSchema } from '../_shared/validation.ts';

const data = validateInput(soilDataSchema, requestBody);
// Throws: "Validation failed: county_fips: County FIPS must be exactly 5 digits"
```

### 9.2 safeValidateInput

Validates data without throwing:

```typescript
import { safeValidateInput, soilDataSchema } from '../_shared/validation.ts';

const result = safeValidateInput(soilDataSchema, requestBody);
if (!result.success) {
  console.log(result.error); // "Validation failed: ..."
} else {
  const data = result.data; // Type-safe validated data
}
```

---

## 10. Error Messages

Standard validation error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed: county_fips: County FIPS must be exactly 5 digits; state_code: State code must be 2 uppercase letters",
    "request_id": "req_abc123"
  }
}
```

---

## 11. References

- [Zod Documentation](https://zod.dev)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
