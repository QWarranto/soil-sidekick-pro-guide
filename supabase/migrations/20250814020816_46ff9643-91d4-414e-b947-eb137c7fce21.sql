-- Create cost tracking table
CREATE TABLE public.cost_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_provider TEXT NOT NULL, -- 'openai', 'supabase', 'usda', 'google_earth', etc.
  service_type TEXT NOT NULL, -- 'gpt4_analysis', 'vision_api', 'database_query', etc.
  cost_usd NUMERIC(10,4) NOT NULL DEFAULT 0,
  usage_count INTEGER NOT NULL DEFAULT 1,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  request_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_bucket TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'), -- Daily aggregation
  hour_bucket TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24') -- Hourly aggregation
);

-- Create usage analytics table
CREATE TABLE public.usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'started', 'completed', 'failed', 'cancelled'
  subscription_tier TEXT NOT NULL,
  duration_seconds INTEGER,
  success_rate NUMERIC(5,2), -- percentage
  error_details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_bucket TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  hour_bucket TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24')
);

-- Create cost alerts table
CREATE TABLE public.cost_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_name TEXT NOT NULL,
  service_provider TEXT, -- null means all services
  threshold_type TEXT NOT NULL, -- 'daily', 'monthly', 'per_user'
  threshold_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  threshold_percentage NUMERIC(5,2) NOT NULL DEFAULT 80, -- Alert at 80% of threshold
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  alert_frequency TEXT NOT NULL DEFAULT 'once', -- 'once', 'hourly', 'daily'
  notification_emails TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cost summary materialized view for fast queries
CREATE MATERIALIZED VIEW public.cost_summary AS
SELECT 
  date_bucket,
  service_provider,
  service_type,
  SUM(cost_usd) as total_cost,
  SUM(usage_count) as total_usage,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(cost_usd) as avg_cost_per_request
FROM public.cost_tracking
GROUP BY date_bucket, service_provider, service_type;

-- Create usage summary materialized view
CREATE MATERIALIZED VIEW public.usage_summary AS
SELECT 
  date_bucket,
  subscription_tier,
  feature_name,
  action_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(duration_seconds) as avg_duration,
  AVG(success_rate) as avg_success_rate
FROM public.usage_analytics
GROUP BY date_bucket, subscription_tier, feature_name, action_type;

-- Enable RLS
ALTER TABLE public.cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cost_tracking
CREATE POLICY "Service can insert cost tracking" 
ON public.cost_tracking 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can read cost tracking" 
ON public.cost_tracking 
FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own cost data" 
ON public.cost_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for usage_analytics
CREATE POLICY "Service can manage usage analytics" 
ON public.usage_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own analytics" 
ON public.usage_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for cost_alerts (admin only)
CREATE POLICY "Admins can manage cost alerts" 
ON public.cost_alerts 
FOR ALL 
USING (public.is_admin());

-- Create indexes for performance
CREATE INDEX idx_cost_tracking_date_bucket ON public.cost_tracking(date_bucket);
CREATE INDEX idx_cost_tracking_service ON public.cost_tracking(service_provider, service_type);
CREATE INDEX idx_cost_tracking_user_feature ON public.cost_tracking(user_id, feature_name);
CREATE INDEX idx_usage_analytics_date_bucket ON public.usage_analytics(date_bucket);
CREATE INDEX idx_usage_analytics_user_feature ON public.usage_analytics(user_id, feature_name);

-- Create functions to refresh materialized views
CREATE OR REPLACE FUNCTION public.refresh_cost_summaries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.cost_summary;
  REFRESH MATERIALIZED VIEW public.usage_summary;
END;
$$;

-- Create function to track API costs
CREATE OR REPLACE FUNCTION public.track_api_cost(
  p_service_provider TEXT,
  p_service_type TEXT,
  p_cost_usd NUMERIC,
  p_user_id UUID,
  p_feature_name TEXT,
  p_request_details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tracking_id UUID;
BEGIN
  INSERT INTO public.cost_tracking (
    service_provider,
    service_type,
    cost_usd,
    user_id,
    feature_name,
    request_details
  ) VALUES (
    p_service_provider,
    p_service_type,
    p_cost_usd,
    p_user_id,
    p_feature_name,
    p_request_details
  ) RETURNING id INTO tracking_id;
  
  RETURN tracking_id;
END;
$$;

-- Create function to track usage analytics
CREATE OR REPLACE FUNCTION public.track_usage_event(
  p_user_id UUID,
  p_session_id TEXT,
  p_feature_name TEXT,
  p_action_type TEXT,
  p_subscription_tier TEXT,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_success_rate NUMERIC DEFAULT NULL,
  p_error_details JSONB DEFAULT '{}',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  analytics_id UUID;
BEGIN
  INSERT INTO public.usage_analytics (
    user_id,
    session_id,
    feature_name,
    action_type,
    subscription_tier,
    duration_seconds,
    success_rate,
    error_details,
    metadata
  ) VALUES (
    p_user_id,
    p_session_id,
    p_feature_name,
    p_action_type,
    p_subscription_tier,
    p_duration_seconds,
    p_success_rate,
    p_error_details,
    p_metadata
  ) RETURNING id INTO analytics_id;
  
  RETURN analytics_id;
END;
$$;

-- Create function to check cost alerts
CREATE OR REPLACE FUNCTION public.check_cost_alerts()
RETURNS TABLE(alert_id UUID, alert_name TEXT, current_amount NUMERIC, threshold_amount NUMERIC, percentage_used NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update current amounts for daily alerts
  UPDATE public.cost_alerts 
  SET current_amount = (
    SELECT COALESCE(SUM(ct.cost_usd), 0)
    FROM public.cost_tracking ct
    WHERE ct.date_bucket = to_char(now(), 'YYYY-MM-DD')
    AND (cost_alerts.service_provider IS NULL OR ct.service_provider = cost_alerts.service_provider)
  ),
  updated_at = now()
  WHERE threshold_type = 'daily';
  
  -- Update current amounts for monthly alerts
  UPDATE public.cost_alerts 
  SET current_amount = (
    SELECT COALESCE(SUM(ct.cost_usd), 0)
    FROM public.cost_tracking ct
    WHERE ct.date_bucket >= to_char(date_trunc('month', now()), 'YYYY-MM-DD')
    AND (cost_alerts.service_provider IS NULL OR ct.service_provider = cost_alerts.service_provider)
  ),
  updated_at = now()
  WHERE threshold_type = 'monthly';
  
  -- Return alerts that have exceeded their threshold percentage
  RETURN QUERY
  SELECT 
    ca.id,
    ca.alert_name,
    ca.current_amount,
    ca.threshold_amount,
    (ca.current_amount / ca.threshold_amount * 100) as percentage_used
  FROM public.cost_alerts ca
  WHERE ca.is_active = true
    AND ca.current_amount >= (ca.threshold_amount * ca.threshold_percentage / 100)
    AND (ca.last_triggered_at IS NULL 
         OR ca.last_triggered_at < CASE 
           WHEN ca.alert_frequency = 'hourly' THEN now() - interval '1 hour'
           WHEN ca.alert_frequency = 'daily' THEN now() - interval '1 day'
           ELSE now() - interval '1 month'
         END);
END;
$$;

-- Insert default cost alerts
INSERT INTO public.cost_alerts (alert_name, service_provider, threshold_type, threshold_amount, threshold_percentage) VALUES
('Daily OpenAI Cost Alert', 'openai', 'daily', 100.00, 80),
('Monthly Total Cost Alert', NULL, 'monthly', 2000.00, 85),
('Daily Supabase Cost Alert', 'supabase', 'daily', 50.00, 90);

-- Create triggers to update updated_at
CREATE TRIGGER update_cost_alerts_updated_at
  BEFORE UPDATE ON public.cost_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();