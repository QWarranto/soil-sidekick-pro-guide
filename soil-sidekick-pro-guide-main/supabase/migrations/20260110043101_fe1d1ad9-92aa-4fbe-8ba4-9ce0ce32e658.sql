-- Create managed_assets table for GIS asset management
CREATE TABLE public.managed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('tree', 'shrub', 'turf', 'hardscape', 'other')),
  species TEXT,
  common_name TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geometry JSONB, -- GeoJSON geometry
  dbh_inches DECIMAL(5, 2), -- Diameter at Breast Height
  height_feet DECIMAL(6, 2),
  canopy_spread_feet DECIMAL(6, 2),
  condition_rating TEXT CHECK (condition_rating IN ('excellent', 'good', 'fair', 'poor', 'dead')),
  risk_rating TEXT CHECK (risk_rating IN ('low', 'moderate', 'high', 'extreme')),
  maintenance_priority INTEGER CHECK (maintenance_priority BETWEEN 1 AND 5),
  last_inspection_date DATE,
  next_inspection_due DATE,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.managed_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own assets
CREATE POLICY "Users can view their own assets"
  ON public.managed_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
  ON public.managed_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON public.managed_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.managed_assets FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_managed_assets_updated_at
  BEFORE UPDATE ON public.managed_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for spatial queries
CREATE INDEX idx_managed_assets_user_id ON public.managed_assets(user_id);
CREATE INDEX idx_managed_assets_asset_type ON public.managed_assets(asset_type);
CREATE INDEX idx_managed_assets_location ON public.managed_assets(latitude, longitude);