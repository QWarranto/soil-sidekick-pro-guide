# SoilSidekick Pro Load Testing Suite

Stress testing suite for identifying performance bottlenecks and cost optimization opportunities.

## Prerequisites

Install k6:
```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo gpkg install k6
```

## Quick Start

### 1. Set Environment Variables

```bash
export SUPABASE_URL="https://wzgnxkoeqzvueypwzvyn.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z254a29lcXp2dWV5cHd6dnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzIzMTksImV4cCI6MjA2ODM0ODMxOX0.RZt9dzpH6Tw-t_eG6vlj_V7AtSz3Sg6wrAEcgF9oSN4"
```

### 2. Run Individual Tests

Start with the safest/fastest endpoint:
```bash
k6 run scripts/test-county-lookup.js
```

Gradually test more expensive endpoints:
```bash
k6 run scripts/test-soil-data.js
k6 run scripts/test-cost-monitoring.js
k6 run scripts/test-visual-crop-analysis.js  # Image processing - expensive
k6 run scripts/test-agricultural-intelligence.js  # GPT-4 - most expensive
```

### 3. Custom Load Profiles

Edit the `options` object in each script:

**Smoke Test** (2-5 users):
```javascript
export const options = {
  vus: 2,
  duration: '1m',
};
```

**Load Test** (gradual ramp):
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};
```

**Spike Test** (sudden traffic):
```javascript
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 500 },  // Spike!
    { duration: '3m', target: 500 },
    { duration: '10s', target: 10 },
  ],
};
```

**Soak Test** (extended duration):
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '4h', target: 50 },  // Sustained load
    { duration: '2m', target: 0 },
  ],
};
```

## Test Scenarios

### 1. County Lookup (Safest First Test)
- Fast response times
- Database + caching heavy
- Low cost per request
```bash
k6 run scripts/test-county-lookup.js
```

### 2. Soil Data Retrieval
- Database queries
- Multiple table joins
- Medium cost
```bash
k6 run scripts/test-soil-data.js
```

### 3. Cost Monitoring
- High-frequency writes
- Tests database write performance
```bash
k6 run scripts/test-cost-monitoring.js
```

### 4. Visual Crop Analysis (⚠️ Expensive)
- OpenAI Vision API calls
- Image processing
- **HIGH COST** - start with 5 users max
```bash
k6 run scripts/test-visual-crop-analysis.js --vus 5 --duration 30s
```

### 5. Agricultural Intelligence (⚠️ Most Expensive)
- GPT-4 API calls
- Complex reasoning
- **HIGHEST COST** - start with 2 users max
```bash
k6 run scripts/test-agricultural-intelligence.js --vus 2 --duration 30s
```

## Monitoring During Tests

### 1. Real-time Supabase Dashboard
- Functions: https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions
- Database: https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/database/tables

### 2. Cost Tracking (Automatic)
```sql
-- Run during/after tests
SELECT 
  service_provider,
  service_type,
  COUNT(*) as request_count,
  SUM(cost_usd) as total_cost,
  AVG(cost_usd) as avg_cost_per_request,
  MAX(created_at) as last_request
FROM cost_tracking
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY service_provider, service_type
ORDER BY total_cost DESC;
```

### 3. Edge Function Logs
View logs in real-time:
```bash
# Replace {function-name} with actual function
https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/functions/{function-name}/logs
```

### 4. Rate Limit Violations
```sql
SELECT 
  endpoint,
  COUNT(*) as violation_count,
  MAX(created_at) as last_violation
FROM security_monitoring
WHERE monitoring_type = 'rate_limit'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint;
```

## Analyzing Results

### K6 Output Metrics
- `http_req_duration`: Response time (p50, p95, p99)
- `http_req_failed`: Error rate
- `http_reqs`: Requests per second
- `vus`: Virtual users

### Success Criteria
| Metric | Target | Critical |
|--------|--------|----------|
| p95 response time | < 2s | < 5s |
| Error rate | < 1% | < 5% |
| Availability | > 99% | > 95% |

### Cost Analysis
```bash
# Run after tests
psql $DATABASE_URL -f queries/cost-analysis.sql
```

## Safety Guidelines

### 🚨 Important Warnings

1. **Start Small**: Always begin with 2-5 users for expensive endpoints
2. **Monitor Costs**: Watch `cost_tracking` table in real-time
3. **Rate Limits**: Expect 429 errors - they're protecting your costs
4. **Test Environment**: Consider using a separate Supabase project for load tests
5. **Budget Alerts**: Your `cost_alerts` table will trigger if thresholds are exceeded

### Cost Estimates (Approximate)

| Function | Cost per 1000 Requests | Notes |
|----------|------------------------|-------|
| county-lookup | $0.10 - $0.50 | Mostly database |
| soil-data | $0.20 - $1.00 | Complex queries |
| cost-monitoring | $0.05 - $0.20 | Simple writes |
| visual-crop-analysis | $50 - $200 | OpenAI Vision |
| agricultural-intelligence | $30 - $150 | GPT-4 |

### Recommended Test Progression

**Week 1: Baseline**
- Day 1: County lookup (100 users)
- Day 2: Soil data (50 users)
- Day 3: Cost monitoring (100 users)

**Week 2: Expensive Functions**
- Day 1: Visual analysis (5 users, 1 min)
- Day 2: Visual analysis (10 users, 2 min)
- Day 3: AI intelligence (2 users, 30s)

**Week 3: Full Load**
- Day 1: Combined test (50 users, all endpoints)
- Day 2: Spike test (100 → 500 users)
- Day 3: Soak test (25 users, 4 hours)

## Troubleshooting

### High Error Rates
1. Check edge function logs for specific errors
2. Verify authentication tokens
3. Confirm database connection pool isn't exhausted

### Slow Response Times
1. Check database query performance
2. Review indexes on frequently queried tables
3. Consider caching strategies

### Cost Overruns
1. Implement request throttling in app
2. Add caching layers
3. Optimize prompts to reduce token usage
4. Consider model downgrade (GPT-4 → GPT-3.5)

### Rate Limiting (429 Errors)
- Expected behavior - protects your costs
- Implement exponential backoff in production
- Consider distributed rate limiting for scale

## Next Steps

1. **Establish Baselines**: Run smoke tests and record metrics in `BASELINE_METRICS.md`
2. **Identify Bottlenecks**: Focus optimization on slowest/most expensive endpoints
3. **Optimize**: Implement caching, query optimization, prompt engineering
4. **Re-test**: Verify improvements with load tests
5. **Production Monitoring**: Set up alerting for performance degradation

## Support

- Supabase Logs: https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn/logs
- k6 Documentation: https://k6.io/docs/
- Performance Troubleshooting: See `TROUBLESHOOTING.md`
