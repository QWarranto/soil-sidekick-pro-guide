-- ADAPT Standard 1.0 Integration Tables

-- Table to track user integrations with external systems
CREATE TABLE public.adapt_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_name TEXT NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('john_deere', 'case_ih', 'agco', 'generic_fmis')),
  api_credentials JSONB, -- Encrypted credentials for external systems
  integration_status TEXT NOT NULL DEFAULT 'pending' CHECK (integration_status IN ('pending', 'active', 'error', 'disabled')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'manual' CHECK (sync_frequency IN ('manual', 'daily', 'weekly', 'real_time')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'api')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track ADAPT soil data exports/imports
CREATE TABLE public.adapt_soil_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_id UUID REFERENCES public.adapt_integrations(id) ON DELETE CASCADE,
  soil_analysis_id UUID REFERENCES public.soil_analyses(id) ON DELETE CASCADE,
  export_format TEXT NOT NULL DEFAULT 'adapt_1.0' CHECK (export_format IN ('adapt_1.0', 'efdi', 'custom')),
  export_data JSONB NOT NULL, -- ADAPT-formatted soil data
  export_status TEXT NOT NULL DEFAULT 'pending' CHECK (export_status IN ('pending', 'completed', 'failed')),
  file_path TEXT, -- Path to exported file if applicable
  external_reference TEXT, -- Reference ID in external system
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store field boundary data for ADAPT integration
CREATE TABLE public.adapt_field_boundaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_id UUID REFERENCES public.adapt_integrations(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_reference TEXT, -- External system field ID
  boundary_geometry JSONB NOT NULL, -- GeoJSON polygon data
  area_acres NUMERIC,
  crop_type TEXT,
  planting_year INTEGER,
  soil_type TEXT,
  adapt_field_id TEXT, -- ADAPT Standard field identifier
  last_updated_external TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL DEFAULT 'local' CHECK (sync_status IN ('local', 'synced', 'conflict', 'error')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track API usage for different tiers
CREATE TABLE public.adapt_api_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_id UUID REFERENCES public.adapt_integrations(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'import', 'sync', 'validate')),
  data_type TEXT NOT NULL CHECK (data_type IN ('soil_analysis', 'field_boundaries', 'recommendations')),
  subscription_tier TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  request_size_kb INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.adapt_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adapt_soil_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adapt_field_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adapt_api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for adapt_integrations
CREATE POLICY "Users can manage their own integrations"
ON public.adapt_integrations
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for adapt_soil_exports
CREATE POLICY "Users can manage their own soil exports"
ON public.adapt_soil_exports
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for adapt_field_boundaries
CREATE POLICY "Users can manage their own field boundaries"
ON public.adapt_field_boundaries
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for adapt_api_usage
CREATE POLICY "Users can view their own API usage"
ON public.adapt_api_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service can insert API usage"
ON public.adapt_api_usage
FOR INSERT
WITH CHECK (true);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_adapt_integrations_updated_at
  BEFORE UPDATE ON public.adapt_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_adapt_soil_exports_updated_at
  BEFORE UPDATE ON public.adapt_soil_exports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_adapt_field_boundaries_updated_at
  BEFORE UPDATE ON public.adapt_field_boundaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_adapt_integrations_user_id ON public.adapt_integrations(user_id);
CREATE INDEX idx_adapt_integrations_status ON public.adapt_integrations(integration_status);
CREATE INDEX idx_adapt_soil_exports_user_id ON public.adapt_soil_exports(user_id);
CREATE INDEX idx_adapt_soil_exports_integration_id ON public.adapt_soil_exports(integration_id);
CREATE INDEX idx_adapt_field_boundaries_user_id ON public.adapt_field_boundaries(user_id);
CREATE INDEX idx_adapt_field_boundaries_integration_id ON public.adapt_field_boundaries(integration_id);
CREATE INDEX idx_adapt_api_usage_user_id ON public.adapt_api_usage(user_id);
CREATE INDEX idx_adapt_api_usage_created_at ON public.adapt_api_usage(created_at);