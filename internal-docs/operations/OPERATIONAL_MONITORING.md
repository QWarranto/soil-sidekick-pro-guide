# Operational Monitoring Guide

**Last Updated:** February 10, 2026  
**Version:** 2.1.0

---

## Table of Contents
1. [Dashboard Configuration](#1-dashboard-configuration)
2. [Alert Configuration](#2-alert-configuration)
3. [Analytics Verification](#3-analytics-verification)
4. [Monitoring Queries](#4-monitoring-queries)
5. [Incident Response](#5-incident-response)

---

## 1. Dashboard Configuration

### 1.1 Supabase Analytics Dashboard Panels

Configure the following panels in the Supabase Dashboard under **Analytics > Edge Functions**:

#### Panel 1: Edge Function Error Rates
```sql
SELECT 
  function_id,
  COUNT(CASE WHEN response.status_code >= 400 THEN 1 END) as errors,
  COUNT(*) as total_requests,
  ROUND(
    COUNT(CASE WHEN response.status_code >= 400 THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as error_rate_percent
FROM function_edge_logs
  CROSS JOIN UNNEST(metadata) as m
  CROSS JOIN UNNEST(m.response) as response
WHERE timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY function_id
ORDER BY error_rate_percent DESC
```

#### Panel 2: Response Time Percentiles
```sql
SELECT 
  function_id,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY m.execution_time_ms) as p50_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY m.execution_time_ms) as p95_ms,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY m.execution_time_ms) as p99_ms,
  AVG(m.execution_time_ms) as avg_ms
FROM function_edge_logs
  CROSS JOIN UNNEST(metadata) as m
WHERE timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY function_id
ORDER BY p95_ms DESC
```

#### Panel 3: Rate Limit Activation Frequency
```sql
SELECT 
  endpoint,
  COUNT(*) as rate_limit_hits,
  COUNT(DISTINCT identifier) as unique_users_limited
FROM rate_limit_tracking
WHERE request_count >= 
  CASE 
    WHEN endpoint LIKE '%checkout%' THEN 100
    WHEN endpoint LIKE '%auth%' THEN 20
    WHEN endpoint LIKE '%gpt%' THEN 500
    ELSE 200
  END
  AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY rate_limit_hits DESC
```

#### Panel 4: Cost Tracking Totals
```sql
SELECT 
  date_bucket::date as date,
  service_provider,
  SUM(cost_usd) as daily_cost,
  SUM(usage_count) as total_requests
FROM cost_tracking
WHERE date_bucket::date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date_bucket::date, service_provider
ORDER BY date DESC, daily_cost DESC
```

#### Panel 5: Circuit Breaker Status
Monitor circuit breaker states via edge function logs:
```sql
SELECT 
  event_message,
  timestamp,
  function_id
FROM function_edge_logs
WHERE event_message LIKE '%[CIRCUIT]%'
  AND timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC
LIMIT 50
```

---

## 2. Alert Configuration

### 2.1 Alert Thresholds

Configure the following alerts in Supabase or external monitoring (e.g., PagerDuty, Opsgenie):

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| High Error Rate | Error rate > 5% for any function (5 min window) | Warning | Email notification |
| Critical Error Rate | Error rate > 15% for any function (5 min window) | Critical | PagerDuty alert |
| Slow Response Time | p95 response time > 3s for any function | Warning | Email notification |
| Very Slow Response | p95 response time > 10s for any function | Critical | PagerDuty alert |
| Daily Cost Exceeded | Daily cost > $100 | Warning | Email notification |
| Cost Spike | Hourly cost > 5x normal average | Critical | PagerDuty alert |
| Circuit Breakers Open | > 5 circuit breakers open simultaneously | Critical | PagerDuty alert |
| Rate Limit Storm | > 100 rate limit hits/hour | Warning | Email notification |
| Auth Failures Spike | > 50 failed auth attempts/hour | Critical | Security team alert |

### 2.2 Current Cost Alerts (Active)

| Alert Name | Threshold | Type | Status |
|------------|-----------|------|--------|
| Daily OpenAI Cost Alert | $100.00/day | daily | ✅ Active |
| Daily Supabase Cost Alert | $50.00/day | daily | ✅ Active |
| Monthly Total Cost Alert | $2,000.00/month | monthly | ✅ Active |

### 2.3 Alert SQL Queries

**Error Rate Alert Query:**
```sql
SELECT 
  function_id,
  COUNT(CASE WHEN status_code >= 400 THEN 1 END)::float / 
  NULLIF(COUNT(*), 0) * 100 as error_rate
FROM (
  SELECT 
    m.function_id,
    response.status_code
  FROM function_edge_logs
    CROSS JOIN UNNEST(metadata) as m
    CROSS JOIN UNNEST(m.response) as response
  WHERE timestamp >= NOW() - INTERVAL '5 minutes'
) sub
GROUP BY function_id
HAVING COUNT(CASE WHEN status_code >= 400 THEN 1 END)::float / 
       NULLIF(COUNT(*), 0) * 100 > 5
```

**Cost Spike Detection Query:**
```sql
WITH hourly_costs AS (
  SELECT 
    hour_bucket,
    SUM(cost_usd) as hourly_cost
  FROM cost_tracking
  WHERE date_bucket::date >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY hour_bucket
),
avg_cost AS (
  SELECT AVG(hourly_cost) as avg_hourly_cost
  FROM hourly_costs
)
SELECT 
  hc.hour_bucket,
  hc.hourly_cost,
  ac.avg_hourly_cost,
  hc.hourly_cost / NULLIF(ac.avg_hourly_cost, 0) as multiplier
FROM hourly_costs hc, avg_cost ac
WHERE hc.hourly_cost > ac.avg_hourly_cost * 5
ORDER BY hc.hour_bucket DESC
```

---

## 3. Analytics Verification

### 3.1 Function Coverage Check

Verify all 31 migrated functions are logging correctly:

```sql
SELECT 
  function_id,
  COUNT(*) as request_count,
  MIN(timestamp) as first_request,
  MAX(timestamp) as last_request
FROM function_edge_logs
  CROSS JOIN UNNEST(metadata) as m
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY function_id
ORDER BY function_id
```

### 3.2 Expected Functions List

| Category | Function Name | Expected Rate Limit |
|----------|---------------|---------------------|
| **Payment (3)** | create-checkout | 100/hr |
| | customer-portal | 50/hr |
| | check-subscription | 200/hr |
| **Auth (4)** | trial-auth | 20/hr/IP |
| | validate-external-auth | 10/min/IP |
| | send-signin-notification | 5/hr/user |
| | security-monitoring | 20/min |
| **Core Agricultural (4)** | get-soil-data | 100/hr |
| | territorial-water-quality | 100/hr |
| | environmental-impact-engine | 100/hr |
| | multi-parameter-planting-calendar | 100/hr |
| **AI/ML (4)** | gpt5-chat | 500/hr |
| | smart-report-summary | 100/hr |
| | seasonal-planning-assistant | 50/hr |
| | alpha-earth-environmental-enhancement | 50/hr |
| **Data Services (5)** | live-agricultural-data | 100/hr |
| | hierarchical-fips-cache | 500/hr |
| | geo-consumption-analytics | 50/hr (admin) |
| | territorial-water-analytics | 100/hr |
| | leafengines-query | 100/hr |
| **Utility (3)** | populate-counties | 10/hr (admin) |
| | api-key-management | 50/hr (admin) |
| | api-health-monitor | No limit |
| **Specialized (6)** | carbon-credit-calculator | 100/hr |
| | generate-vrt-prescription | 50/hr |
| | adapt-soil-export | 50/hr |
| | enhanced-threat-detection | 100/min |
| | soc2-compliance-monitor | 20/hr (admin) |
| | agricultural-intelligence | 200/hr |

### 3.3 Log Structure Verification

Each edge function log should contain:

```json
{
  "timestamp": "2025-12-19T10:00:00Z",
  "function_id": "gpt5-chat",
  "execution_time_ms": 1234,
  "response": {
    "status_code": 200
  },
  "request": {
    "method": "POST"
  }
}
```

---

## 4. Monitoring Queries

### 4.1 Daily Health Check Queries

**Request Volume by Function:**
```sql
SELECT 
  function_id,
  COUNT(*) as requests_today,
  COUNT(CASE WHEN response.status_code = 200 THEN 1 END) as successful,
  COUNT(CASE WHEN response.status_code >= 400 THEN 1 END) as failed
FROM function_edge_logs
  CROSS JOIN UNNEST(metadata) as m
  CROSS JOIN UNNEST(m.response) as response
WHERE timestamp >= CURRENT_DATE
GROUP BY function_id
ORDER BY requests_today DESC
```

**Cost Summary by Provider:**
```sql
SELECT 
  service_provider,
  SUM(cost_usd) as total_cost,
  SUM(usage_count) as total_requests,
  ROUND(SUM(cost_usd) / NULLIF(SUM(usage_count), 0), 4) as avg_cost_per_request
FROM cost_tracking
WHERE date_bucket::date = CURRENT_DATE
GROUP BY service_provider
ORDER BY total_cost DESC
```

**Rate Limit Summary:**
```sql
SELECT 
  endpoint,
  SUM(request_count) as total_requests,
  COUNT(DISTINCT identifier) as unique_identifiers,
  MAX(request_count) as max_requests_single_window
FROM rate_limit_tracking
WHERE created_at >= CURRENT_DATE
GROUP BY endpoint
ORDER BY total_requests DESC
```

### 4.2 Weekly Review Queries

**Cost Trend Analysis:**
```sql
SELECT 
  date_bucket::date as date,
  SUM(cost_usd) as daily_cost,
  SUM(usage_count) as daily_requests,
  LAG(SUM(cost_usd)) OVER (ORDER BY date_bucket::date) as prev_day_cost,
  ROUND(
    (SUM(cost_usd) - LAG(SUM(cost_usd)) OVER (ORDER BY date_bucket::date)) /
    NULLIF(LAG(SUM(cost_usd)) OVER (ORDER BY date_bucket::date), 0) * 100, 2
  ) as cost_change_percent
FROM cost_tracking
WHERE date_bucket::date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date_bucket::date
ORDER BY date DESC
```

**Security Events Summary:**
```sql
SELECT 
  event_type,
  success,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM auth_security_log
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY event_type, success
ORDER BY event_count DESC
```

---

## 5. Incident Response

### 5.1 High Error Rate Response

1. **Identify the function:** Check which function has elevated errors
2. **Check logs:** View function logs for error details
   ```
   Supabase Dashboard > Edge Functions > [function_name] > Logs
   ```
3. **Check dependencies:** Verify external APIs (USDA, EPA, OpenAI) are available
4. **Check circuit breakers:** Look for `[CIRCUIT]` messages in logs
5. **Rollback if needed:** Follow rollback procedure in MIGRATION_GUIDE.md

### 5.2 Cost Spike Response

1. **Identify source:** Query cost_tracking by feature_name and service_provider
2. **Check for abuse:** Review rate_limit_tracking for unusual patterns
3. **Check for loops:** Look for functions calling themselves repeatedly
4. **Implement emergency rate limit:** Reduce limits temporarily if needed
5. **Investigate user:** Check if specific user_id is causing spike

### 5.3 Circuit Breaker Open Response

1. **Identify affected service:** EPA, USDA, NOAA, OpenAI, Google Earth
2. **Check external service status:** Visit status pages
3. **Wait for half-open:** Circuit breaker will retry after 30s
4. **Monitor recovery:** Watch for `[CIRCUIT] Closing` messages
5. **Escalate if persistent:** Contact external service support

---

## Appendix: Supabase Dashboard Links

- **Edge Functions:** https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions
- **Edge Function Logs:** https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions/{function_name}/logs
- **SQL Editor:** https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/sql/new
- **Function Secrets:** https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/settings/functions

---

## 6. OEM Device Fleet Monitoring

### 6.1 Device Health Dashboard

Monitor registered OEM devices across all deployment tiers:

```sql
SELECT 
  device_id,
  manufacturer,
  firmware_version,
  last_heartbeat_at,
  royalty_tier,
  CASE 
    WHEN last_heartbeat_at < NOW() - INTERVAL '1 hour' THEN 'OFFLINE'
    WHEN last_heartbeat_at < NOW() - INTERVAL '15 minutes' THEN 'DEGRADED'
    ELSE 'HEALTHY'
  END as device_status,
  cumulative_api_calls,
  certificate_expires_at
FROM oem_device_registry
ORDER BY last_heartbeat_at DESC
```

### 6.2 OEM Alert Thresholds

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| Device Offline | No heartbeat > 1 hour | Warning | Email OEM partner |
| Fleet Offline | >10% devices offline | Critical | PagerDuty + OEM escalation |
| Certificate Expiry | Certificate expires < 7 days | Warning | Auto-renewal trigger |
| Certificate Expired | Certificate expired | Critical | Block device + notify OEM |
| Royalty Metering Drift | Heartbeat count diverges >5% from API logs | Warning | Audit reconciliation |
| Firmware Mismatch | Device running EOL firmware | Warning | OTA update push |
| CAN Bus Anomaly | HMAC validation failures > 10/min | Critical | Isolate device + security alert |
| Telemetry Flood | >1000 msg/min from single device | Warning | Rate limit + investigate |

### 6.3 OTA Update Monitoring

```sql
SELECT 
  ota_batch_id,
  firmware_version_target,
  COUNT(*) as total_devices,
  COUNT(CASE WHEN update_status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN update_status = 'failed' THEN 1 END) as failed,
  COUNT(CASE WHEN update_status = 'rollback' THEN 1 END) as rolled_back,
  AVG(update_duration_seconds) as avg_update_time
FROM ota_update_log
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY ota_batch_id, firmware_version_target
ORDER BY created_at DESC
```

### 6.4 Royalty Metering Verification

```sql
-- Compare heartbeat-reported calls vs actual API logs
WITH device_reported AS (
  SELECT device_id, SUM(reported_api_calls) as reported
  FROM oem_heartbeats
  WHERE timestamp >= DATE_TRUNC('month', NOW())
  GROUP BY device_id
),
actual_usage AS (
  SELECT device_id, COUNT(*) as actual
  FROM api_key_access_log
  WHERE access_time >= DATE_TRUNC('month', NOW())
    AND api_key_id IN (SELECT id FROM api_keys WHERE subscription_tier = 'oem')
  GROUP BY device_id
)
SELECT 
  d.device_id,
  d.reported,
  a.actual,
  ABS(d.reported - a.actual)::float / NULLIF(a.actual, 0) * 100 as drift_percent
FROM device_reported d
JOIN actual_usage a ON d.device_id = a.device_id
WHERE ABS(d.reported - a.actual)::float / NULLIF(a.actual, 0) * 100 > 5
ORDER BY drift_percent DESC
```

---

## 7. Private 5G / MEC Edge Monitoring

### 7.1 Edge Node Health

Monitor Multi-Access Edge Computing (MEC) nodes for URLLC compliance:

```sql
SELECT 
  edge_node_id,
  region,
  network_slice,
  active_connections,
  avg_latency_ms,
  p99_latency_ms,
  CASE 
    WHEN p99_latency_ms > 10 THEN 'SLA_BREACH'
    WHEN p99_latency_ms > 7 THEN 'WARNING'
    ELSE 'OPTIMAL'
  END as latency_status,
  uptime_percent,
  last_attestation_at
FROM edge_node_metrics
WHERE timestamp >= NOW() - INTERVAL '5 minutes'
ORDER BY p99_latency_ms DESC
```

### 7.2 5G/MEC Alert Thresholds

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| URLLC Latency Breach | p99 > 10ms | Critical | Failover + Safety Officer alert |
| Edge Node Down | No metrics > 30s | Critical | Automatic failover + PagerDuty |
| Network Slice Degraded | Reliability < 99.999% (5-min window) | Critical | Telecom partner escalation |
| Attestation Expired | Node attestation > 24hrs old | Warning | Re-attestation trigger |
| Sequence Gap | Monotonic sequence gap detected | Critical | Anti-replay investigation |
| Coordination Timeout | Equipment sync response > 5s TTL | Warning | Graceful degradation mode |
| Vital Signs Alert | Worker vital sign anomaly | Critical | Immediate safety protocol |

### 7.3 Safety-Critical Metrics

```sql
-- Real-time safety monitoring for autonomous operations
SELECT 
  operation_id,
  equipment_type,
  coordination_latency_ms,
  vital_signs_status,
  geofence_compliance,
  emergency_stop_available,
  CASE 
    WHEN coordination_latency_ms > 10 THEN 'HALT_REQUIRED'
    WHEN vital_signs_status = 'anomaly' THEN 'HALT_REQUIRED'
    WHEN geofence_compliance = false THEN 'HALT_REQUIRED'
    ELSE 'OPERATIONAL'
  END as safety_status
FROM safety_critical_operations
WHERE timestamp >= NOW() - INTERVAL '1 minute'
  AND safety_status != 'OPERATIONAL'
ORDER BY timestamp DESC
```

### 7.4 Incident Response: 5G Safety Events

1. **URLLC Latency Breach:**
   - Immediately trigger graceful degradation for all autonomous equipment
   - Switch to local-only inference mode
   - Notify Safety Officer within 60 seconds
   - Log event in safety incident register

2. **Equipment Coordination Failure:**
   - Issue emergency stop to affected equipment
   - Verify worker vital signs are nominal
   - Engage manual override protocols
   - Root cause analysis within 4 hours

3. **Network Slice Failure:**
   - Failover to backup slice or local mesh
   - Reduce autonomous operations to minimum safe state
   - Coordinate with telecom partner for restoration
   - Post-incident review with dual sign-off (Engineering + Safety Officer)
