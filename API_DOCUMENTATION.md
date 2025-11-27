# SoilSidekick Pro API Documentation

## Version: 1.0
## Date: January 2025
## Security: SOC 2 Type 1 Compliant

---

## 1. API Overview

SoilSidekick Pro provides a comprehensive RESTful API for agricultural intelligence, soil analysis, environmental assessment, and satellite data integration. All API endpoints are SOC 2 Type 1 compliant with enterprise-grade security.

### 1.1 SOC 2 Type 1 Security Standards

**Security Controls**: All API endpoints implement:
- **Authentication**: JWT token-based authentication with rate limiting
- **Authorization**: Role-based access control with user data isolation
- **Encryption**: TLS 1.3 encryption for all data transmission
- **Audit Logging**: Comprehensive logging of all API requests and responses
- **Input Validation**: Server-side validation and sanitization of all inputs

### 1.2 Base URL
```
Production: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/
Development: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/
```

### 1.3 Authentication
All API requests require authentication using JWT tokens:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/endpoint
```

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

**Tier-based Limits**:
- **Starter**: 50,000 calls/month, 1,000 req/min - Email support (48hr response)
- **Professional**: 250,000 calls/month, 2,500 req/min - Priority support (24hr response)
- **Custom**: Unlimited calls, custom rate limits - 24/7 dedicated support

**Response Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1642694400
X-Tier: starter
```

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

**Common Error Codes**:
- `AUTHENTICATION_REQUIRED`: Missing or invalid JWT token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_INPUT`: Request validation failed
- `SUBSCRIPTION_REQUIRED`: Feature requires paid subscription

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

## 5. SDK and Integration

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

### 5.2 JavaScript/TypeScript SDK

```typescript
import { SoilSidekickAPI } from '@soilsidekick/api-client';

const client = new SoilSidekickAPI({
  token: 'your-jwt-token',
  baseUrl: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/'
});

const soilAnalysis = await client.soil.analyze({
  county_fips: '48453',
  county_name: 'Travis County',
  state_code: 'TX'
});
```

### 5.3 Webhook Integration

**Webhook Endpoints**: Configure webhooks for real-time notifications:
- Soil analysis completion
- Environmental alerts
- Subscription changes
- Security events

**Webhook Security**:
- HTTPS endpoints required
- Signature verification using HMAC-SHA256
- Retry logic with exponential backoff
- Idempotency for duplicate handling

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
- SOC 2 Type 1 Certified
- PCI DSS Compliant (Payment Processing)
- GDPR Compliant (Data Privacy)