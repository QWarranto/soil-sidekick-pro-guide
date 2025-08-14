-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');

-- Update profiles table to include subscription information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier public.subscription_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '14 days'),
ADD COLUMN IF NOT EXISTS subscription_starts_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Create usage quotas table to track limits per tier
CREATE TABLE public.usage_quotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier public.subscription_tier NOT NULL,
  feature_name TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tier, feature_name)
);

-- Create user usage tracking table
CREATE TABLE public.user_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  month_year TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name, month_year)
);

-- Enable RLS on new tables
ALTER TABLE public.usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_quotas (public read, admin write)
CREATE POLICY "Anyone can view usage quotas" 
ON public.usage_quotas 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage usage quotas" 
ON public.usage_quotas 
FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for user_usage 
CREATE POLICY "Users can view their own usage" 
ON public.user_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user usage" 
ON public.user_usage 
FOR ALL 
USING (auth.role() = 'service_role');

-- Insert default usage quotas for each tier
INSERT INTO public.usage_quotas (tier, feature_name, monthly_limit) VALUES
-- Free tier limits
('free', 'soil_analyses', 0),
('free', 'visual_analysis', 0),
('free', 'county_lookups', 50),
('free', 'pdf_reports', 2),
('free', 'carbon_calculations', 0),
('free', 'water_quality_tests', 0),

-- Starter tier limits
('starter', 'soil_analyses', 5),
('starter', 'visual_analysis', 0),
('starter', 'county_lookups', 200),
('starter', 'pdf_reports', 10),
('starter', 'carbon_calculations', 3),
('starter', 'water_quality_tests', 2),

-- Pro tier limits (generous)
('pro', 'soil_analyses', 100),
('pro', 'visual_analysis', 50),
('pro', 'county_lookups', 1000),
('pro', 'pdf_reports', 100),
('pro', 'carbon_calculations', 50),
('pro', 'water_quality_tests', 25),

-- Enterprise tier (unlimited = very high limit)
('enterprise', 'soil_analyses', 9999),
('enterprise', 'visual_analysis', 9999),
('enterprise', 'county_lookups', 9999),
('enterprise', 'pdf_reports', 9999),
('enterprise', 'carbon_calculations', 9999),
('enterprise', 'water_quality_tests', 9999);

-- Create function to check if user can use a feature
CREATE OR REPLACE FUNCTION public.can_use_feature(
  p_user_id UUID,
  p_feature_name TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tier public.subscription_tier;
  quota_limit INTEGER;
  current_usage INTEGER;
  trial_ends TIMESTAMPTZ;
  subscription_active BOOLEAN := true;
BEGIN
  -- Get user's subscription tier and trial status
  SELECT 
    subscription_tier,
    trial_ends_at,
    CASE 
      WHEN subscription_ends_at IS NULL THEN true
      WHEN subscription_ends_at > now() THEN true
      ELSE false
    END
  INTO user_tier, trial_ends, subscription_active
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- If user not found, default to free
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;
  
  -- Check if trial has expired for free users
  IF user_tier = 'free' AND trial_ends IS NOT NULL AND trial_ends < now() THEN
    -- Trial expired, very limited access
    SELECT CASE 
      WHEN p_feature_name = 'county_lookups' THEN 10
      WHEN p_feature_name = 'pdf_reports' THEN 1
      ELSE 0
    END INTO quota_limit;
  ELSE
    -- Get the quota limit for this tier and feature
    SELECT monthly_limit INTO quota_limit
    FROM public.usage_quotas
    WHERE tier = user_tier AND feature_name = p_feature_name;
  END IF;
  
  -- If no quota found, assume unlimited for paid users
  IF quota_limit IS NULL THEN
    RETURN subscription_active;
  END IF;
  
  -- Get current usage for this month
  SELECT COALESCE(usage_count, 0) INTO current_usage
  FROM public.user_usage
  WHERE user_id = p_user_id 
    AND feature_name = p_feature_name 
    AND month_year = to_char(now(), 'YYYY-MM');
  
  -- Check if under limit and subscription is active
  RETURN (current_usage < quota_limit) AND subscription_active;
END;
$$;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_feature_name TEXT,
  p_increment INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
BEGIN
  -- Insert or update usage count
  INSERT INTO public.user_usage (user_id, feature_name, usage_count, month_year)
  VALUES (p_user_id, p_feature_name, p_increment, current_month)
  ON CONFLICT (user_id, feature_name, month_year)
  DO UPDATE SET 
    usage_count = user_usage.usage_count + p_increment,
    updated_at = now();
    
  RETURN true;
END;
$$;

-- Create trigger to update updated_at on user_usage
CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at on usage_quotas  
CREATE TRIGGER update_usage_quotas_updated_at
  BEFORE UPDATE ON public.usage_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();