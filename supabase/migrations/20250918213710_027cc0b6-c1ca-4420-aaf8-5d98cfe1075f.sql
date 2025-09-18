-- Create KPI targets table
CREATE TABLE public.kpi_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kpi_name TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  target_period TEXT NOT NULL CHECK (target_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, kpi_name, target_period)
);

-- Create KPI history table
CREATE TABLE public.kpi_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kpi_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  date_bucket TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD')
);

-- Enable RLS
ALTER TABLE public.kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_history ENABLE ROW LEVEL SECURITY;

-- Create policies for kpi_targets
CREATE POLICY "Users can manage their own KPI targets" 
ON public.kpi_targets 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policies for kpi_history
CREATE POLICY "Users can view their own KPI history" 
ON public.kpi_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KPI history" 
ON public.kpi_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Service role can manage KPI data for analytics
CREATE POLICY "Service role can manage KPI data" 
ON public.kpi_targets 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage KPI history" 
ON public.kpi_history 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_kpi_targets_user_id ON public.kpi_targets(user_id);
CREATE INDEX idx_kpi_targets_kpi_name ON public.kpi_targets(kpi_name);
CREATE INDEX idx_kpi_history_user_id ON public.kpi_history(user_id);
CREATE INDEX idx_kpi_history_kpi_name ON public.kpi_history(kpi_name);
CREATE INDEX idx_kpi_history_recorded_at ON public.kpi_history(recorded_at);
CREATE INDEX idx_kpi_history_date_bucket ON public.kpi_history(date_bucket);