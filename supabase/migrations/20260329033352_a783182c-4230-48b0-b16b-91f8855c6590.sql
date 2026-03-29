
-- Sensor calibration tracking
CREATE TABLE public.sensor_calibration_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sensor_id TEXT NOT NULL,
  field_id TEXT,
  sensor_type TEXT NOT NULL DEFAULT 'soil_moisture',
  last_calibrated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  calibration_interval_days INTEGER NOT NULL DEFAULT 180,
  calibration_method TEXT,
  baseline_values JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_calibration_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sensor calibrations"
  ON public.sensor_calibration_log
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sensor data quality assessments
CREATE TABLE public.sensor_data_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sensor_id TEXT NOT NULL,
  field_id TEXT,
  reading_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_values JSONB NOT NULL DEFAULT '{}',
  drift_detected BOOLEAN NOT NULL DEFAULT false,
  drift_percentage NUMERIC(5,2),
  drift_details JSONB,
  staleness_warning BOOLEAN NOT NULL DEFAULT false,
  days_since_calibration INTEGER,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 100.0,
  confidence_factors JSONB DEFAULT '[]',
  quality_grade TEXT NOT NULL DEFAULT 'A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_data_quality ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sensor quality data"
  ON public.sensor_data_quality
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert sensor quality data"
  ON public.sensor_data_quality
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Index for efficient queries
CREATE INDEX idx_sensor_quality_sensor_id ON public.sensor_data_quality(sensor_id, reading_timestamp DESC);
CREATE INDEX idx_sensor_calibration_sensor_id ON public.sensor_calibration_log(sensor_id);
