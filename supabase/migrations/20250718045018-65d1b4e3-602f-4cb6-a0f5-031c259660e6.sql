-- Create soil_analyses table to store analysis results
CREATE TABLE public.soil_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  county_name TEXT NOT NULL,
  county_fips TEXT NOT NULL,
  state_code TEXT NOT NULL,
  analysis_data JSONB,
  ph_level DECIMAL(3,1),
  organic_matter DECIMAL(5,2),
  nitrogen_level TEXT,
  phosphorus_level TEXT,
  potassium_level TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.soil_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own soil analyses" 
ON public.soil_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own soil analyses" 
ON public.soil_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soil analyses" 
ON public.soil_analyses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own soil analyses" 
ON public.soil_analyses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_soil_analyses_updated_at
BEFORE UPDATE ON public.soil_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create counties reference table for faster lookups
CREATE TABLE public.counties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  county_name TEXT NOT NULL,
  state_name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  fips_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on counties table (public read access)
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read county data
CREATE POLICY "Counties are publicly readable" 
ON public.counties 
FOR SELECT 
USING (true);

-- Create index for faster county searches
CREATE INDEX idx_counties_name_state ON public.counties(county_name, state_code);
CREATE INDEX idx_counties_fips ON public.counties(fips_code);