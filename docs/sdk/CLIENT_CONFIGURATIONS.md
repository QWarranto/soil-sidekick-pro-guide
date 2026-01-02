# LeafEngines™ SDK Client Configurations

**Phase 1 Week 4 Deliverable** - Client-specific API configurations

---

## Tier Overview

| Client | Tier | Rate Limit | Features | Pricing |
|--------|------|------------|----------|---------|
| **Plantum** | Starter | 10 req/min | Species ID, Environmental Compatibility, Dynamic Care | $8,900/year |
| **Plant Parent** | Professional | 100 req/min | Full suite + satellite integration | $24,900/year |
| **LeafSnap** | Academic | 50 req/min | Species ID, Historical comparison | Custom |
| **iNaturalist** | Community | 100 req/min | Species ID + community verification | Revenue share |

---

## Plantum Configuration (Priority #1)

**Target:** Mid-tier plant app looking to differentiate with environmental intelligence

### API Key Template
```json
{
  "tier": "starter",
  "permissions": {
    "endpoints": [
      "leafengines-query",
      "safe-identification",
      "dynamic-care",
      "beginner-guidance"
    ],
    "features": {
      "environmental_compatibility": true,
      "species_identification": true,
      "care_recommendations": true,
      "satellite_data": false
    }
  },
  "rate_limits": {
    "requests_per_minute": 10,
    "requests_per_hour": 500,
    "requests_per_day": 10000
  },
  "billing": {
    "included_requests": 10000,
    "overage_cost_per_request": 0.001
  }
}
```

### Upsell Triggers
- Usage > 80% of monthly limit → Professional tier notification
- Satellite data requests → Enterprise upgrade prompt
- User engagement metrics showing high retention

### Integration Priority
1. Environmental Compatibility Score (primary differentiator)
2. Dynamic Care notifications
3. Beginner guidance for new users

---

## Plant Parent Configuration (Priority #2)

**Target:** Premium plant app with death-prevention focus

### API Key Template
```json
{
  "tier": "professional",
  "permissions": {
    "endpoints": [
      "leafengines-query",
      "safe-identification",
      "dynamic-care",
      "beginner-guidance",
      "seasonal-planning-assistant",
      "alpha-earth-environmental-enhancement"
    ],
    "features": {
      "environmental_compatibility": true,
      "species_identification": true,
      "care_recommendations": true,
      "satellite_data": true,
      "seasonal_planning": true,
      "death_prevention_alerts": true
    }
  },
  "rate_limits": {
    "requests_per_minute": 100,
    "requests_per_hour": 5000,
    "requests_per_day": 100000
  },
  "billing": {
    "included_requests": 100000,
    "overage_cost_per_request": 0.0005
  }
}
```

### Death-Prevention Notification System
```typescript
// Recommended webhook integration
interface DeathPreventionAlert {
  plant_id: string;
  user_id: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  recommended_actions: string[];
  urgency_hours: number;
}
```

### Integration Priority
1. Death Prevention System (brand differentiator)
2. Satellite-enhanced monitoring
3. Seasonal planning calendar

---

## LeafSnap Configuration (Priority #3)

**Target:** Academic/research institution focused on species identification

### API Key Template
```json
{
  "tier": "academic",
  "permissions": {
    "endpoints": [
      "leafengines-query",
      "safe-identification",
      "plant-id-comparison"
    ],
    "features": {
      "species_identification": true,
      "historical_comparison": true,
      "research_export": true,
      "bulk_identification": true
    }
  },
  "rate_limits": {
    "requests_per_minute": 50,
    "requests_per_hour": 2500,
    "requests_per_day": 50000
  },
  "billing": {
    "pricing_model": "institutional",
    "annual_site_license": true
  }
}
```

### Research-Specific Features
- Bulk identification API for batch processing
- CSV/JSON export with confidence scores
- Historical comparison dataset access
- Citation-ready data formatting

### Integration Priority
1. High-accuracy species identification
2. Bulk processing capabilities
3. Research export formats

---

## iNaturalist Configuration (Priority #4)

**Target:** Community science platform with citizen verification

### API Key Template
```json
{
  "tier": "community",
  "permissions": {
    "endpoints": [
      "leafengines-query",
      "safe-identification"
    ],
    "features": {
      "species_identification": true,
      "community_verification_hook": true,
      "open_data_reciprocity": true
    }
  },
  "rate_limits": {
    "requests_per_minute": 100,
    "requests_per_hour": 5000,
    "requests_per_day": 100000
  },
  "billing": {
    "pricing_model": "revenue_share",
    "data_reciprocity": true
  }
}
```

### Community Integration
```typescript
// Verification webhook integration
interface CommunityVerification {
  identification_id: string;
  leafengines_confidence: number;
  community_consensus: number;
  verification_count: number;
  final_species: string;
}
```

### Data Reciprocity Agreement
- LeafEngines provides: Species identification AI
- iNaturalist provides: Community-verified training data
- Mutual benefit: Improved accuracy for both platforms

### Integration Priority
1. Species identification with community hooks
2. Verification data exchange
3. Open data reciprocity

---

## API Key Generation Template

```sql
-- Generate client-specific API key
INSERT INTO api_keys (
  user_id,
  key_name,
  key_hash,
  subscription_tier,
  permissions,
  rate_limit,
  rate_window_minutes,
  expires_at,
  allowed_ips
) VALUES (
  :client_user_id,
  :client_name || ' SDK Key',
  :hashed_key,
  :tier,
  :permissions_json,
  :rate_per_minute,
  1,
  :expiration_date,
  :allowed_ip_array
);
```

---

## Quick Start for Each Client

### Plantum
```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/leafengines-query \
  -H "x-api-key: plantum_sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "location": { "county_fips": "06037" },
    "plant": { "common_name": "Monstera" }
  }'
```

### Plant Parent
```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/leafengines-query \
  -H "x-api-key: plantparent_sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "location": { "latitude": 34.0522, "longitude": -118.2437 },
    "plant": { "common_name": "Fiddle Leaf Fig" },
    "options": { "include_satellite_data": true }
  }'
```

---

## Support Contacts

| Client | Account Manager | Technical Support |
|--------|-----------------|-------------------|
| Plantum | sales@leafengines.com | sdk-support@leafengines.com |
| Plant Parent | enterprise@leafengines.com | sdk-support@leafengines.com |
| LeafSnap | academic@leafengines.com | sdk-support@leafengines.com |
| iNaturalist | partnerships@leafengines.com | sdk-support@leafengines.com |

---

*Last Updated: Phase 1 Week 4 - SDK Readiness Schedule*
