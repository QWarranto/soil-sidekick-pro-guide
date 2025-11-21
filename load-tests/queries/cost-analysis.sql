-- Cost Analysis Queries for Load Testing Results
-- Run these after load tests to analyze cost impact

-- 1. Total cost by service provider (last hour)
SELECT 
  service_provider,
  service_type,
  COUNT(*) as request_count,
  SUM(cost_usd) as total_cost_usd,
  AVG(cost_usd) as avg_cost_per_request,
  MIN(cost_usd) as min_cost,
  MAX(cost_usd) as max_cost,
  STDDEV(cost_usd) as cost_std_dev
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY service_provider, service_type
ORDER BY total_cost_usd DESC;

-- 2. Cost breakdown by feature
SELECT 
  feature_name,
  COUNT(*) as total_requests,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost,
  MAX(cost_usd) as max_cost,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cost_usd) as p95_cost
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY feature_name
ORDER BY total_cost DESC;

-- 3. Hourly cost trend during test
SELECT 
  DATE_TRUNC('minute', created_at) as minute_bucket,
  COUNT(*) as requests_per_minute,
  SUM(cost_usd) as cost_per_minute,
  AVG(cost_usd) as avg_cost
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY minute_bucket
ORDER BY minute_bucket;

-- 4. Identify cost spikes (anomalies)
SELECT 
  service_provider,
  feature_name,
  cost_usd,
  created_at,
  request_details
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND cost_usd > (
    SELECT AVG(cost_usd) + 3 * STDDEV(cost_usd)
    FROM cost_tracking
    WHERE created_at > NOW() - INTERVAL '1 hour'
  )
ORDER BY cost_usd DESC;

-- 5. Cost efficiency by user (if user_id populated)
SELECT 
  user_id,
  COUNT(*) as request_count,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost_per_request
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND user_id IS NOT NULL
GROUP BY user_id
ORDER BY total_cost DESC
LIMIT 20;

-- 6. Rate limit violations during test
SELECT 
  endpoint,
  COUNT(*) as violation_count,
  MIN(created_at) as first_violation,
  MAX(created_at) as last_violation,
  target_ip
FROM security_monitoring
WHERE monitoring_type = 'rate_limit'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint, target_ip
ORDER BY violation_count DESC;

-- 7. Cost alerts triggered
SELECT 
  alert_name,
  threshold_amount,
  current_amount,
  last_triggered_at,
  notification_emails
FROM cost_alerts
WHERE last_triggered_at > NOW() - INTERVAL '1 hour'
  AND is_active = true
ORDER BY current_amount DESC;

-- 8. Database query performance impact
SELECT 
  identifier,
  COUNT(*) as error_count,
  parsed.error_severity,
  MAX(timestamp) as last_error
FROM postgres_logs
CROSS JOIN UNNEST(metadata) as m
CROSS JOIN UNNEST(m.parsed) as parsed
WHERE timestamp > NOW() - INTERVAL '1 hour'
  AND parsed.error_severity IN ('ERROR', 'FATAL')
GROUP BY identifier, parsed.error_severity
ORDER BY error_count DESC;

-- 9. Edge function execution costs
SELECT 
  m.function_id,
  COUNT(*) as invocation_count,
  AVG(m.execution_time_ms) as avg_execution_ms,
  MAX(m.execution_time_ms) as max_execution_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY m.execution_time_ms) as p95_execution_ms,
  SUM(CASE WHEN response.status_code >= 400 THEN 1 ELSE 0 END) as error_count
FROM function_edge_logs
CROSS JOIN UNNEST(metadata) as m
CROSS JOIN UNNEST(m.response) as response
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY m.function_id
ORDER BY invocation_count DESC;

-- 10. Total test summary
SELECT 
  COUNT(*) as total_requests,
  COUNT(DISTINCT service_provider) as unique_services,
  COUNT(DISTINCT feature_name) as unique_features,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost_per_request,
  MIN(created_at) as test_start,
  MAX(created_at) as test_end,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 60 as test_duration_minutes
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour';

-- 11. Cost projection (hourly → daily → monthly)
WITH hourly_cost AS (
  SELECT SUM(cost_usd) as hour_cost
  FROM cost_tracking
  WHERE created_at > NOW() - INTERVAL '1 hour'
)
SELECT 
  hour_cost,
  hour_cost * 24 as projected_daily_cost,
  hour_cost * 24 * 30 as projected_monthly_cost
FROM hourly_cost;

-- 12. Most expensive request details
SELECT 
  service_provider,
  service_type,
  feature_name,
  cost_usd,
  request_details,
  created_at
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY cost_usd DESC
LIMIT 10;
