-- Create plant_query_history table to track user plant interactions
CREATE TABLE public.plant_query_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_name TEXT NOT NULL,
  query_type TEXT NOT NULL CHECK (query_type IN ('identify', 'health', 'care')),
  query_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_plant_query_user ON public.plant_query_history(user_id, created_at DESC);
CREATE INDEX idx_plant_query_name ON public.plant_query_history(user_id, plant_name);

-- Enable Row Level Security
ALTER TABLE public.plant_query_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own plant queries"
  ON public.plant_query_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plant queries"
  ON public.plant_query_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plant queries"
  ON public.plant_query_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plant queries"
  ON public.plant_query_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get user's most searched plants
CREATE OR REPLACE FUNCTION public.get_user_frequent_plants(target_user_id UUID DEFAULT auth.uid(), limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  plant_name TEXT,
  query_count BIGINT,
  last_queried TIMESTAMP WITH TIME ZONE,
  query_types TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Security check
  IF target_user_id != auth.uid() AND NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Can only view own plant history';
  END IF;

  RETURN QUERY
  SELECT 
    pqh.plant_name,
    COUNT(*)::BIGINT as query_count,
    MAX(pqh.created_at) as last_queried,
    ARRAY_AGG(DISTINCT pqh.query_type) as query_types
  FROM public.plant_query_history pqh
  WHERE pqh.user_id = target_user_id
  GROUP BY pqh.plant_name
  ORDER BY query_count DESC, last_queried DESC
  LIMIT limit_count;
END;
$$;

-- Function to get recent plant queries
CREATE OR REPLACE FUNCTION public.get_recent_plant_queries(target_user_id UUID DEFAULT auth.uid(), limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
  id UUID,
  plant_name TEXT,
  query_type TEXT,
  query_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Security check
  IF target_user_id != auth.uid() AND NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Can only view own plant history';
  END IF;

  RETURN QUERY
  SELECT 
    pqh.id,
    pqh.plant_name,
    pqh.query_type,
    pqh.query_details,
    pqh.created_at
  FROM public.plant_query_history pqh
  WHERE pqh.user_id = target_user_id
  ORDER BY pqh.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_plant_query_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_plant_query_updated_at
  BEFORE UPDATE ON public.plant_query_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_plant_query_timestamp();