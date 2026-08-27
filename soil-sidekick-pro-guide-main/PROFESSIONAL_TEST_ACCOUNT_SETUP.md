# Professional Test Account Setup Guide
# LeafEngines SDK v2.2 - Developer Testing

## Overview

This guide provides step-by-step instructions for creating and maintaining professional-tier test accounts for developers building integrations with the SoilSidekick Pro API. These accounts enable testing of subscription-gated features like the carbon credit calculator and advanced analytics.

## 🎯 Purpose

Professional test accounts solve the critical developer experience issue where authenticated endpoints like `/carbon-credit-calculator` were inaccessible for testing, blocking integration development and quality assurance.

## 📋 Prerequisites

- Supabase admin access
- Database migration tools
- Professional tier feature definitions
- Test environment access

## 🔧 Step-by-Step Setup

### Step 1: Create Professional Test User Profile

Execute this SQL in your Supabase test environment:

```sql
-- Create professional test user profile
INSERT INTO profiles (
  id, 
  email, 
  subscription_tier, 
  api_keys_limit, 
  api_calls_limit,
  features_enabled,
  billing_status,
  created_at,
  updated_at
) VALUES (
  'test-professional-user',
  'professional-test@soilsidekick.com',
  'professional',
  50,                    -- 50 API keys max
  10000,                 -- 10K API calls monthly
  ARRAY[
    'carbon-credit-calculator',
    'advanced-analytics',
    'priority-support',
    'bulk-operations',
    'export-reports',
    'historical-data'
  ],
  'active',
  NOW(),
  NOW()
);

-- Verify creation
SELECT * FROM profiles WHERE id = 'test-professional-user';
```

### Step 2: Create Associated API Key

```sql
-- Generate secure API key for testing
-- Note: In production, this would be hashed before storage
INSERT INTO api_keys (
  id,
  user_id,
  key_hash,
  key_prefix,
  name,
  subscription_tier,
  permissions,
  is_active,
  created_at,
  last_used_at
) VALUES (
  'test-professional-key-1',
  'test-professional-user',
  'test_key_hash_professional_123', -- Replace with actual hash in production
  'sk_test_professional_',
  'Professional Test Key #1',
  'professional',
  ARRAY['read', 'write', 'delete'],
  true,
  NOW(),
  NULL
);

-- Verify API key creation
SELECT * FROM api_keys WHERE user_id = 'test-professional-user';
```

### Step 3: Enable Professional Features

```sql
-- Enable carbon credit calculator feature flag
INSERT INTO feature_flags (
  feature_name,
  user_id,
  is_enabled,
  configuration,
  created_at
) VALUES 
('carbon-credit-calculator', 'test-professional-user', true, '{"max_calculations_per_day": 100}', NOW()),
('advanced-analytics', 'test-professional-user', true, '{"retention_days": 365}', NOW()),
('bulk-operations', 'test-professional-user', true, '{"max_batch_size": 1000}', NOW());

-- Verify feature flags
SELECT * FROM feature_flags WHERE user_id = 'test-professional-user';
```

### Step 4: Create Test Data for Professional Features

```sql
-- Insert test soil data for carbon credit calculations
INSERT INTO soil_data (
  county_fips,
  county_name,
  state_code,
  ph_level,
  organic_matter,
  nitrogen,
  phosphorus,
  potassium,
  carbon_sequestration_potential,
  last_updated
) VALUES 
('48453', 'Travis County', 'TX', 6.5, 2.3, 15.2, 8.5, 180, 2.1, NOW()),
('06037', 'Los Angeles County', 'CA', 7.1, 1.8, 12.4, 6.2, 145, 1.8, NOW()),
('17031', 'Cook County', 'IL', 6.8, 3.1, 18.7, 11.2, 210, 2.5, NOW());

-- Insert test carbon credit baseline data
INSERT INTO carbon_credit_baselines (
  county_fips,
  land_use_type,
  carbon_per_acre_tons,
  measurement_year,
  data_source
) VALUES
('48453', 'agricultural', 1.2, 2024, 'USDA_NRCS'),
('48453', 'rangeland', 0.8, 2024, 'USDA_NRCS'),
('06037', 'agricultural', 1.1, 2024, 'USDA_NRCS');
```

## 🔍 Verification Steps

### Test Account Validation

```bash
# 1. Test authentication with professional tier
curl -X POST https://api.soilsidekick.com/trial-auth \
  -H "Content-Type: application/json" \
  -d '{"email": "professional-test@soilsidekick.com"}'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "access_token": "eyJhbGc...",
#     "user": {
#       "subscription_tier": "professional",
#       "features": ["carbon-credit-calculator", "advanced-analytics", ...]
#     }
#   }
# }
```

### Carbon Credit Calculator Test

```bash
# 2. Test carbon credit calculator endpoint
curl -X POST https://api.soilsidekick.com/carbon-credit-calculator \
  -H "Authorization: Bearer YOUR_PROFESSIONAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "county_fips": "48453",
    "land_area_acres": 100,
    "land_use_type": "agricultural",
    "current_practice": "conventional_tillage",
    "proposed_practice": "no_till"
  }'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "carbon_sequestration_tons_per_year": 12.5,
#     "carbon_credit_value_usd": 625.00,
#     "practice_change": "conventional_tillage → no_till",
#     "county_fips": "48453"
#   }
# }
```

### Advanced Analytics Test

```bash
# 3. Test advanced analytics endpoint
curl -X POST https://api.soilsidekick.com/advanced-analytics \
  -H "Authorization: Bearer YOUR_PROFESSIONAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "analysis_type": "soil_health_trends",
    "county_fips": "48453",
    "time_range": "2020-2024",
    "metrics": ["ph_level", "organic_matter", "carbon_sequestration"]
  }'

# Expected response includes historical trends and predictions
```

## 📊 Test Account Configuration

### Account Details
- **Email**: `professional-test@soilsidekick.com`
- **Subscription Tier**: `professional`
- **API Keys Limit**: 50
- **Monthly API Calls**: 10,000
- **Features**: All professional features enabled

### Available Professional Features
```javascript
const PROFESSIONAL_FEATURES = [
  'carbon-credit-calculator',    // Calculate carbon credits for practices
  'advanced-analytics',          // Historical trends and predictions
  'priority-support',            // Priority customer support
  'bulk-operations',             // Process multiple counties
  'export-reports',              // Export detailed reports
  'historical-data'              // Access historical data
];
```

### API Rate Limits
```
Professional Tier Limits:
- API Calls: 10,000/month
- API Keys: 50 maximum
- Rate Limit: 100 requests/minute
- Bulk Operations: 1,000 records/batch
- Concurrent Requests: 10
```

## 🔒 Security Considerations

### Test Account Security
- Test account is isolated from production data
- API keys are regularly rotated (quarterly)
- Access is logged for audit compliance
- Account is monitored for unusual activity

### Data Isolation
```sql
-- Ensure test data is clearly marked
UPDATE profiles 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'), 
  '{test_account}', 
  'true'
) 
WHERE id = 'test-professional-user';

-- Query to identify test data
SELECT * FROM profiles WHERE metadata->>'test_account' = 'true';
```

## 🔄 Maintenance Procedures

### Monthly Maintenance
```sql
-- Reset usage counters monthly
UPDATE profiles 
SET 
  api_calls_count = 0,
  updated_at = NOW()
WHERE id = 'test-professional-user';

-- Audit test account usage
SELECT 
  COUNT(*) as total_calls,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  MAX(created_at) as last_used
FROM audit_logs 
WHERE user_id = 'test-professional-user' 
  AND created_at >= DATE_TRUNC('month', NOW());
```

### Quarterly Maintenance
```sql
-- Rotate test API key (quarterly security practice)
UPDATE api_keys 
SET 
  key_hash = 'new_test_key_hash_' || EXTRACT(QUARTER FROM NOW()),
  updated_at = NOW()
WHERE id = 'test-professional-key-1';

-- Verify all professional features are enabled
SELECT feature_name, is_enabled 
FROM feature_flags 
WHERE user_id = 'test-professional-user' 
ORDER BY feature_name;
```

## 🚨 Troubleshooting

### Common Issues

**Issue**: `403 Forbidden` when accessing professional endpoints
**Solution**: 
```sql
-- Check subscription tier
SELECT subscription_tier, billing_status 
FROM profiles 
WHERE id = 'test-professional-user';

-- Verify feature flags
SELECT feature_name, is_enabled 
FROM feature_flags 
WHERE user_id = 'test-professional-user';
```

**Issue**: `401 Unauthorized` with test API key
**Solution**:
```sql
-- Check API key status
SELECT is_active, last_used_at 
FROM api_keys 
WHERE user_id = 'test-professional-user';

-- Verify key hasn't expired
SELECT created_at, is_active 
FROM api_keys 
WHERE id = 'test-professional-key-1';
```

**Issue**: Carbon credit calculator returns no data
**Solution**:
```sql
-- Check if test data exists
SELECT COUNT(*) as record_count
FROM carbon_credit_baselines 
WHERE county_fips = '48453';

-- Verify soil data availability
SELECT COUNT(*) as soil_records
FROM soil_data 
WHERE county_fips = '48453';
```

## 📞 Support and Escalation

### Internal Team Contacts
- **QA Team**: qa@soilsidekick.com
- **DevOps Team**: devops@soilsidekick.com
- **Security Team**: security@soilsidekick.com

### Documentation Links
- [API Documentation](https://docs.soilsidekick.com/api)
- [Error Code Reference](https://docs.soilsidekick.com/errors)
- [Professional Features Guide](https://docs.soilsidekick.com/professional)
- [SOC 2 Compliance](https://docs.soilsidekick.com/compliance)

## 🎯 Success Metrics

### Test Account Effectiveness
- **Uptime**: 99.9% availability target
- **Response Time**: <500ms for professional endpoints
- **Data Freshness**: Test data updated monthly
- **Security**: Zero unauthorized access incidents

### Developer Experience
- **Onboarding Time**: <5 minutes to first successful API call
- **Documentation Accuracy**: 100% of error scenarios documented
- **Feature Coverage**: All professional features testable
- **Support Response**: <2 hours for test account issues

This setup ensures developers have reliable access to professional-tier features for integration testing, directly addressing the UX observation that blocked development progress.