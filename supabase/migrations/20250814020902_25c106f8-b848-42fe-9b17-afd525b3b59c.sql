-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.refresh_cost_summaries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.cost_summary;
  REFRESH MATERIALIZED VIEW public.usage_summary;
END;
$$;

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
SET search_path = public
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
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.check_cost_alerts()
RETURNS TABLE(alert_id UUID, alert_name TEXT, current_amount NUMERIC, threshold_amount NUMERIC, percentage_used NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Remove materialized views from API access (RLS block)
ALTER MATERIALIZED VIEW public.cost_summary OWNER TO postgres;
ALTER MATERIALIZED VIEW public.usage_summary OWNER TO postgres;

-- Create secure access functions instead of direct materialized view access
CREATE OR REPLACE FUNCTION public.get_cost_summary(
  p_start_date TEXT DEFAULT NULL,
  p_end_date TEXT DEFAULT NULL,
  p_service_provider TEXT DEFAULT NULL
)
RETURNS TABLE(
  date_bucket TEXT,
  service_provider TEXT,
  service_type TEXT,
  total_cost NUMERIC,
  total_usage BIGINT,
  unique_users BIGINT,
  avg_cost_per_request NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow access to admins
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  REFRESH MATERIALIZED VIEW public.cost_summary;
  
  RETURN QUERY
  SELECT 
    cs.date_bucket,
    cs.service_provider,
    cs.service_type,
    cs.total_cost,
    cs.total_usage,
    cs.unique_users,
    cs.avg_cost_per_request
  FROM public.cost_summary cs
  WHERE (p_start_date IS NULL OR cs.date_bucket >= p_start_date)
    AND (p_end_date IS NULL OR cs.date_bucket <= p_end_date)
    AND (p_service_provider IS NULL OR cs.service_provider = p_service_provider)
  ORDER BY cs.date_bucket DESC, cs.service_provider, cs.service_type;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_usage_summary(
  p_start_date TEXT DEFAULT NULL,
  p_end_date TEXT DEFAULT NULL,
  p_subscription_tier TEXT DEFAULT NULL
)
RETURNS TABLE(
  date_bucket TEXT,
  subscription_tier TEXT,
  feature_name TEXT,
  action_type TEXT,
  event_count BIGINT,
  unique_users BIGINT,
  avg_duration NUMERIC,
  avg_success_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow access to admins
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  REFRESH MATERIALIZED VIEW public.usage_summary;
  
  RETURN QUERY
  SELECT 
    us.date_bucket,
    us.subscription_tier,
    us.feature_name,
    us.action_type,
    us.event_count,
    us.unique_users,
    us.avg_duration,
    us.avg_success_rate
  FROM public.usage_summary us
  WHERE (p_start_date IS NULL OR us.date_bucket >= p_start_date)
    AND (p_end_date IS NULL OR us.date_bucket <= p_end_date)
    AND (p_subscription_tier IS NULL OR us.subscription_tier = p_subscription_tier)
  ORDER BY us.date_bucket DESC, us.subscription_tier, us.feature_name;
END;
$$;