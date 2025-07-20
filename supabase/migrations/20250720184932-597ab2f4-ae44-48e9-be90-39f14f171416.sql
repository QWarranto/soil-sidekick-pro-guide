-- Create hierarchical cache-optimised FIPS data broker tables
CREATE TABLE public.fips_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_fips TEXT NOT NULL,
  data_source TEXT NOT NULL, -- 'usda_soil', 'noaa_weather', 'epa_water', etc.
  cache_key TEXT NOT NULL,
  cached_data JSONB NOT NULL,
  cache_level INTEGER NOT NULL, -- 1=county, 2=state, 3=region, 4=national
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_fips_cache_lookup ON public.fips_data_cache(county_fips, data_source, cache_key);
CREATE INDEX idx_fips_cache_expiry ON public.fips_data_cache(expires_at);
CREATE INDEX idx_fips_cache_level ON public.fips_data_cache(cache_level);

-- Enable RLS
ALTER TABLE public.fips_data_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for cache access
CREATE POLICY "Cache data is publicly readable" 
ON public.fips_data_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Service can manage cache" 
ON public.fips_data_cache 
FOR ALL 
USING (true);

-- Create environmental impact scoring table
CREATE TABLE public.environmental_impact_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  county_fips TEXT NOT NULL,
  analysis_id UUID REFERENCES public.soil_analyses(id) ON DELETE CASCADE,
  runoff_risk_score NUMERIC(4,2) NOT NULL CHECK (runoff_risk_score >= 0 AND runoff_risk_score <= 100),
  water_body_proximity NUMERIC(10,2), -- distance in miles
  contamination_risk TEXT CHECK (contamination_risk IN ('low', 'medium', 'high', 'critical')),
  eco_friendly_alternatives JSONB,
  carbon_footprint_score NUMERIC(6,2),
  biodiversity_impact TEXT CHECK (biodiversity_impact IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.environmental_impact_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own impact scores" 
ON public.environmental_impact_scores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own impact scores" 
ON public.environmental_impact_scores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own impact scores" 
ON public.environmental_impact_scores 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create geo-indexed consumption analytics table
CREATE TABLE public.geo_consumption_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  county_fips TEXT NOT NULL,
  state_code TEXT NOT NULL,
  usage_pattern JSONB NOT NULL,
  consumption_frequency INTEGER DEFAULT 1,
  geographic_cluster TEXT, -- 'urban', 'rural', 'suburban'
  seasonal_pattern JSONB,
  tier_progression_score NUMERIC(4,2) DEFAULT 0,
  upgrade_probability NUMERIC(3,2) DEFAULT 0,
  month_year TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_geo_consumption_fips ON public.geo_consumption_analytics(county_fips);
CREATE INDEX idx_geo_consumption_user ON public.geo_consumption_analytics(user_id);
CREATE INDEX idx_geo_consumption_tier ON public.geo_consumption_analytics(tier_progression_score);

-- Enable RLS
ALTER TABLE public.geo_consumption_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own consumption analytics" 
ON public.geo_consumption_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage consumption analytics" 
ON public.geo_consumption_analytics 
FOR ALL 
USING (true);

-- Create multi-parameter planting optimization table
CREATE TABLE public.planting_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  county_fips TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  optimal_planting_window JSONB NOT NULL,
  soil_factors JSONB NOT NULL, -- pH, organic_matter, drainage, etc.
  climate_factors JSONB NOT NULL, -- frost dates, temperature, precipitation
  sustainability_score NUMERIC(4,2) DEFAULT 0,
  yield_prediction NUMERIC(8,2),
  risk_assessment JSONB,
  alternative_crops JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.planting_optimizations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own planting optimizations" 
ON public.planting_optimizations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own planting optimizations" 
ON public.planting_optimizations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user session state tracking for dual-mode county search
CREATE TABLE public.county_search_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  search_context JSONB NOT NULL,
  external_results JSONB,
  database_results JSONB,
  selected_county JSONB,
  state_transitions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '2 hours')
);

-- Create index for session lookup
CREATE INDEX idx_county_search_sessions_token ON public.county_search_sessions(session_token);
CREATE INDEX idx_county_search_sessions_expiry ON public.county_search_sessions(expires_at);

-- Enable RLS
ALTER TABLE public.county_search_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own search sessions" 
ON public.county_search_sessions 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for updating timestamps
CREATE TRIGGER update_environmental_impact_scores_updated_at
BEFORE UPDATE ON public.environmental_impact_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_geo_consumption_analytics_updated_at
BEFORE UPDATE ON public.geo_consumption_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planting_optimizations_updated_at
BEFORE UPDATE ON public.planting_optimizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();