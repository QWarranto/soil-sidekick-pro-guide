# Phase 1 Deployment Guide

## Quick Start

### 1. Set Environment Variable

```bash
supabase secrets set HIVEMQ_PASSWORD=Golden_Mysteries_2026
```

### 2. Deploy Everything

```bash
./deploy-phase1.sh
```

Or manually:

```bash
# Run database migrations
supabase db reset

# Deploy edge functions
supabase functions deploy sensor-data-ingestion
supabase functions deploy mqtt-bridge
```

### 3. Verify Deployment

```bash
# Check functions are deployed
supabase functions list

# Test health endpoint
curl https://your-project.supabase.co/functions/v1/mqtt-bridge
```

---

## Testing

### Test 1: Direct HTTP Ingestion

```bash
curl -X POST https://your-project.supabase.co/functions/v1/sensor-data-ingestion \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{
    "device_id": "skyline-test-001",
    "device_type": "mmwave_radar",
    "timestamp": "2026-02-06T12:00:00Z",
    "readings": [
      {
        "metric": "reflectivity",
        "value": 0.85,
        "unit": "ratio",
        "confidence": 0.95,
        "timestamp": "2026-02-06T12:00:00Z"
      }
    ],
    "metadata": {
      "firmware_version": "1.0.0",
      "battery_level": 87,
      "signal_strength": -45
    }
  }'
```

Expected response:
```json
{
  "ingestion_id": "uuid-here",
  "queued_at": "2026-02-06T12:00:00Z",
  "processed_readings": 1,
  "estimated_processing_ms": 45,
  "status": "success"
}
```

### Test 2: Verify Database

```sql
-- Check device was created
SELECT * FROM sensor_devices WHERE device_id = 'skyline-test-001';

-- Check readings were stored
SELECT * FROM sensor_readings WHERE device_id = 'skyline-test-001';

-- Check audit log
SELECT * FROM sensor_audit_log ORDER BY created_at DESC LIMIT 5;
```

---

## HiveMQ Cloud Test

### Using MQTT.fx or similar client:

**Connection Settings:**
- Broker: `5b63a89881fd46d9af394bf11bb4206b.s1.eu.hivemq.cloud`
- Port: `8883`
- Username: `Vallc200`
- Password: `Golden_Mysteries_2026`
- TLS: Enabled

**Publish Test Message:**
- Topic: `skyline/test-device-001/readings`
- Payload:
```json
{
  "device_id": "test-device-001",
  "device_type": "mmwave_radar",
  "timestamp": "2026-02-06T12:00:00Z",
  "readings": [
    {
      "metric": "reflectivity",
      "value": 0.92,
      "unit": "ratio",
      "confidence": 0.94,
      "timestamp": "2026-02-06T12:00:00Z"
    }
  ],
  "metadata": {
    "firmware_version": "1.0.0",
    "battery_level": 92
  }
}
```

---

## Troubleshooting

### Issue: "HIVEMQ_PASSWORD not set"
```bash
supabase secrets set HIVEMQ_PASSWORD=Golden_Mysteries_2026
```

### Issue: Database migration fails
```bash
# Check connection
supabase status

# Reset and retry
supabase db reset
```

### Issue: Function deployment fails
```bash
# Check syntax
deno check supabase/functions/sensor-data-ingestion/index.ts

# Try deploying individually
supabase functions deploy sensor-data-ingestion --debug
```

### Issue: MQTT connection fails
- Verify HiveMQ cluster is running (console.hivemq.cloud)
- Check credentials are correct
- Ensure TLS/SSL is enabled on port 8883

---

## Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/20260206120000_sensor_infrastructure.sql` | Database schema |
| `supabase/functions/sensor-data-ingestion/index.ts` | HTTP ingestion endpoint |
| `supabase/functions/mqtt-bridge/index.ts` | MQTT to REST bridge |
| `deploy-phase1.sh` | Automated deployment script |
| `PHASE1_DEPLOYMENT.md` | This guide |

---

## Next Steps

After successful deployment:
1. Connect first physical Skyline device
2. Verify data flow: Device → HiveMQ → SSKP → Database
3. Begin Phase 2: Correlation Engine development

**Status:** Ready for device connection testing
