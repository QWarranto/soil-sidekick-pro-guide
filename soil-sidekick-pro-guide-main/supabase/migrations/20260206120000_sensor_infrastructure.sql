-- Migration: 20260206120000_sensor_infrastructure.sql
-- Phase 1: Critical Infrastructure - Sensor Data Pipeline
-- HiveMQ Cloud Integration for Skyline Instruments

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SENSOR DEVICES REGISTRY
-- ============================================
CREATE TABLE IF NOT EXISTS sensor_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('mmwave_radar', 'quantum_rf', 'precision_timing')),
  farm_id UUID REFERENCES fields(id),
  firmware_version TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'maintenance')),
  battery_level NUMERIC CHECK (battery_level >= 0 AND battery_level <= 100),
  signal_strength NUMERIC,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sensor_devices
CREATE INDEX IF NOT EXISTS idx_sensor_devices_farm ON sensor_devices(farm_id);
CREATE INDEX IF NOT EXISTS idx_sensor_devices_status ON sensor_devices(status);
CREATE INDEX IF NOT EXISTS idx_sensor_devices_last_seen ON sensor_devices(last_seen_at DESC);

-- Enable RLS
ALTER TABLE sensor_devices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view devices in their farms" ON sensor_devices;
DROP POLICY IF EXISTS "Users can update their devices" ON sensor_devices;

-- RLS Policies
CREATE POLICY "Users can view devices in their farms" ON sensor_devices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fields 
      WHERE fields.id = sensor_devices.farm_id 
      AND fields.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their devices" ON sensor_devices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM fields 
      WHERE fields.id = sensor_devices.farm_id 
      AND fields.user_id = auth.uid()
    )
  );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sensor_devices_updated_at ON sensor_devices;
CREATE TRIGGER update_sensor_devices_updated_at
  BEFORE UPDATE ON sensor_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. SENSOR READINGS (Time-Series Partitioned)
-- ============================================
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
  received_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB
) PARTITION BY RANGE (timestamp);

-- Create partitions for 2026
DO $$
BEGIN
  -- February 2026
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sensor_readings_2026_02'
  ) THEN
    CREATE TABLE sensor_readings_2026_02 PARTITION OF sensor_readings
      FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
  END IF;

  -- March 2026
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sensor_readings_2026_03'
  ) THEN
    CREATE TABLE sensor_readings_2026_03 PARTITION OF sensor_readings
      FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
  END IF;

  -- April 2026
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'sensor_readings_2026_04'
  ) THEN
    CREATE TABLE sensor_readings_2026_04 PARTITION OF sensor_readings
      FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
  END IF;
END $$;

-- Indexes for sensor_readings
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time ON sensor_readings(device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_metric ON sensor_readings(metric, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_received ON sensor_readings(received_at DESC);

-- Enable RLS
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view readings from their devices" ON sensor_readings;

-- RLS Policy
CREATE POLICY "Users can view readings from their devices" ON sensor_readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sensor_devices sd
      JOIN fields f ON sd.farm_id = f.id
      WHERE sd.device_id = sensor_readings.device_id
      AND f.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add foreign key constraint (after RLS to avoid issues)
ALTER TABLE sensor_readings 
  DROP CONSTRAINT IF EXISTS fk_sensor_readings_device;

-- Note: We can't add FK to partitioned table directly, handled in application layer

-- ============================================
-- 3. SENSOR AUDIT LOG (SOC 2 Compliance)
-- ============================================
CREATE TABLE IF NOT EXISTS sensor_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingestion_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('success', 'failed', 'error')),
  error_message TEXT,
  readings_count INTEGER,
  processing_time_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sensor_audit_log
CREATE INDEX IF NOT EXISTS idx_sensor_audit_device ON sensor_audit_log(device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_audit_status ON sensor_audit_log(validation_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_audit_ingestion ON sensor_audit_log(ingestion_id);
CREATE INDEX IF NOT EXISTS idx_sensor_audit_created ON sensor_audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE sensor_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all audit logs" ON sensor_audit_log;

-- RLS Policy (admin only for SOC 2 compliance)
CREATE POLICY "Admins can view all audit logs" ON sensor_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- 4. SENSOR ALERTS (Real-time Hazard Detection)
-- ============================================
CREATE TABLE IF NOT EXISTS sensor_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  details JSONB,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sensor_alerts
CREATE INDEX IF NOT EXISTS idx_sensor_alerts_device ON sensor_alerts(device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_alerts_unack ON sensor_alerts(acknowledged) WHERE acknowledged = FALSE;
CREATE INDEX IF NOT EXISTS idx_sensor_alerts_severity ON sensor_alerts(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_alerts_timestamp ON sensor_alerts(timestamp DESC);

-- Enable RLS
ALTER TABLE sensor_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view alerts from their devices" ON sensor_alerts;
DROP POLICY IF EXISTS "Users can acknowledge their alerts" ON sensor_alerts;

-- RLS Policies
CREATE POLICY "Users can view alerts from their devices" ON sensor_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sensor_devices sd
      JOIN fields f ON sd.farm_id = f.id
      WHERE sd.device_id = sensor_alerts.device_id
      AND f.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can acknowledge their alerts" ON sensor_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sensor_devices sd
      JOIN fields f ON sd.farm_id = f.id
      WHERE sd.device_id = sensor_alerts.device_id
      AND f.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. AUTOMATED PARTITION MANAGEMENT
-- ============================================
-- Function to create future partitions automatically
CREATE OR REPLACE FUNCTION create_sensor_readings_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE;
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  -- Create partitions for next 3 months
  FOR i IN 1..3 LOOP
    partition_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
    partition_name := 'sensor_readings_' || TO_CHAR(partition_date, 'YYYY_MM');
    start_date := partition_date;
    end_date := partition_date + INTERVAL '1 month';
    
    -- Check if partition exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = partition_name
    ) THEN
      EXECUTE format(
        'CREATE TABLE %I PARTITION OF sensor_readings FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        start_date,
        end_date
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run partition creation for next 3 months
SELECT create_sensor_readings_partition();

-- ============================================
-- 6. METRICS AND MONITORING VIEWS
-- ============================================

-- View: Recent device activity
CREATE OR REPLACE VIEW sensor_device_activity AS
SELECT 
  sd.device_id,
  sd.device_type,
  sd.status,
  sd.last_seen_at,
  COUNT(sr.id) as reading_count_24h,
  MAX(sr.timestamp) as last_reading_at
FROM sensor_devices sd
LEFT JOIN sensor_readings sr ON sd.device_id = sr.device_id
  AND sr.timestamp > NOW() - INTERVAL '24 hours'
GROUP BY sd.device_id, sd.device_type, sd.status, sd.last_seen_at;

-- View: Unacknowledged critical alerts
CREATE OR REPLACE VIEW sensor_critical_alerts AS
SELECT 
  sa.*,
  sd.device_type,
  sd.farm_id
FROM sensor_alerts sa
JOIN sensor_devices sd ON sa.device_id = sd.device_id
WHERE sa.severity = 'critical'
  AND sa.acknowledged = FALSE
ORDER BY sa.created_at DESC;

-- ============================================
-- 7. CLEANUP FUNCTION (GDPR/SOC 2 Compliance)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_sensor_data()
RETURNS void AS $$
BEGIN
  -- Archive old data (implement based on retention policy)
  -- Default: Keep 90 days of readings in hot storage
  
  -- Delete old audit logs (keep 1 year)
  DELETE FROM sensor_audit_log
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete old acknowledged alerts (keep 90 days)
  DELETE FROM sensor_alerts
  WHERE acknowledged = TRUE
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables were created
SELECT 
  'sensor_devices' as table_name, 
  COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'sensor_devices'
UNION ALL
SELECT 
  'sensor_readings' as table_name, 
  COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'sensor_readings'
UNION ALL
SELECT 
  'sensor_audit_log' as table_name, 
  COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'sensor_audit_log'
UNION ALL
SELECT 
  'sensor_alerts' as table_name, 
  COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'sensor_alerts';
