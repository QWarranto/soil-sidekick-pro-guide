-- Create prescription maps table for VRT
CREATE TABLE IF NOT EXISTS public.prescription_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
  soil_analysis_id UUID,
  map_name TEXT NOT NULL,
  crop_type TEXT,
  application_type TEXT NOT NULL, -- 'fertilizer', 'seed', 'water', 'pesticide'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Zone-based prescription data
  zones JSONB NOT NULL, -- Array of zones with geometry and application rates
  total_zones INTEGER NOT NULL DEFAULT 1,
  
  -- Application details
  target_yield NUMERIC,
  base_rate NUMERIC NOT NULL, -- Base application rate
  rate_unit TEXT NOT NULL, -- 'lbs/acre', 'seeds/acre', 'gallons/acre'
  
  -- Metadata
  analysis_method TEXT DEFAULT 'ai_generated', -- 'ai_generated', 'manual', 'imported'
  confidence_score NUMERIC,
  estimated_savings NUMERIC, -- Estimated cost/input savings vs uniform application
  
  -- Export tracking
  exported_at TIMESTAMPTZ,
  export_format TEXT, -- 'adapt', 'shapefile', 'iso_xml'
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'applied', 'archived'
  applied_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.prescription_maps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own prescription maps"
  ON public.prescription_maps
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prescription maps"
  ON public.prescription_maps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescription maps"
  ON public.prescription_maps
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescription maps"
  ON public.prescription_maps
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_prescription_maps_user_id ON public.prescription_maps(user_id);
CREATE INDEX idx_prescription_maps_field_id ON public.prescription_maps(field_id);
CREATE INDEX idx_prescription_maps_status ON public.prescription_maps(status);

-- Trigger for updated_at
CREATE TRIGGER update_prescription_maps_updated_at
  BEFORE UPDATE ON public.prescription_maps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();