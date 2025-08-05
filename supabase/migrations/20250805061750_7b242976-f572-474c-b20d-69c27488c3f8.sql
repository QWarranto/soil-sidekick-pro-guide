-- Phase 4: Enhanced Security Measures
-- Create API key management table for secure external API access
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000,
  rate_window_minutes INTEGER DEFAULT 60,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on api_keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- API key policies - users can only manage their own keys
CREATE POLICY "Users can view their own API keys" 
ON public.api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" 
ON public.api_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" 
ON public.api_keys 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" 
ON public.api_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create security incidents table for advanced monitoring
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip TEXT,
  user_id UUID,
  user_agent TEXT,
  endpoint TEXT,
  request_payload JSONB,
  response_status INTEGER,
  incident_details JSONB,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_incidents (admin only access)
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- Only service role can access security incidents
CREATE POLICY "Only service role can access security incidents" 
ON public.security_incidents 
FOR ALL 
USING (public.is_service_role());

-- Create rate limiting tracking table
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  window_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '1 hour'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking_identifier_endpoint 
ON public.rate_limit_tracking (identifier, endpoint, window_end);

-- Enable RLS on rate_limit_tracking (service role only)
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access rate limit tracking" 
ON public.rate_limit_tracking 
FOR ALL 
USING (public.is_service_role());

-- Create function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.rate_limit_tracking 
  WHERE window_end < now() - interval '24 hours';
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for API key validation
CREATE OR REPLACE FUNCTION public.validate_api_key(key_hash text)
RETURNS TABLE(
  user_id uuid,
  permissions jsonb,
  rate_limit integer,
  rate_window_minutes integer,
  is_valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ak.user_id,
    ak.permissions,
    ak.rate_limit,
    ak.rate_window_minutes,
    (ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > now())) as is_valid
  FROM public.api_keys ak
  WHERE ak.key_hash = validate_api_key.key_hash;
  
  -- Update last_used_at
  UPDATE public.api_keys 
  SET last_used_at = now() 
  WHERE api_keys.key_hash = validate_api_key.key_hash;
END;
$$;