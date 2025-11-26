-- Add subscription_tier to api_keys table for SDK tier-based access
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise'));

-- Add index for tier-based queries
CREATE INDEX IF NOT EXISTS idx_api_keys_tier ON public.api_keys(subscription_tier);

-- Update validate_api_key function to return subscription tier
CREATE OR REPLACE FUNCTION public.validate_api_key_with_tier(
    key_hash text,
    client_ip inet DEFAULT NULL
)
RETURNS TABLE(
    user_id uuid,
    permissions jsonb,
    rate_limit integer,
    rate_window_minutes integer,
    is_valid boolean,
    api_key_id uuid,
    access_count integer,
    is_locked boolean,
    lock_reason text,
    subscription_tier text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    key_record RECORD;
    ip_allowed BOOLEAN := TRUE;
BEGIN
    -- Get API key record with tier
    SELECT 
        ak.id,
        ak.user_id,
        ak.permissions,
        ak.rate_limit,
        ak.rate_window_minutes,
        ak.is_active,
        ak.expires_at,
        ak.access_count,
        ak.is_locked,
        ak.lock_reason,
        ak.allowed_ips,
        ak.max_uses,
        COALESCE(ak.subscription_tier, 'free') as tier
    INTO key_record
    FROM public.api_keys ak
    WHERE ak.key_hash = validate_api_key_with_tier.key_hash;
    
    -- Return invalid if key not found
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            NULL::uuid, 
            NULL::jsonb, 
            NULL::integer, 
            NULL::integer, 
            FALSE,
            NULL::uuid,
            NULL::integer,
            NULL::boolean,
            'API key not found'::text,
            NULL::text;
        RETURN;
    END IF;
    
    -- Check IP restrictions if specified
    IF key_record.allowed_ips IS NOT NULL AND array_length(key_record.allowed_ips, 1) > 0 THEN
        ip_allowed := client_ip::text = ANY(key_record.allowed_ips);
    END IF;
    
    -- Determine if key is valid
    DECLARE
        key_is_valid BOOLEAN := (
            key_record.is_active AND 
            NOT key_record.is_locked AND
            (key_record.expires_at IS NULL OR key_record.expires_at > now()) AND
            (key_record.max_uses IS NULL OR key_record.access_count < key_record.max_uses) AND
            ip_allowed
        );
    BEGIN
        -- Update access statistics
        UPDATE public.api_keys 
        SET 
            last_used_at = now(),
            access_count = access_count + 1,
            last_access_ip = client_ip
        WHERE id = key_record.id;
        
        -- Return validation result with tier
        RETURN QUERY SELECT 
            key_record.user_id,
            key_record.permissions,
            key_record.rate_limit,
            key_record.rate_window_minutes,
            key_is_valid,
            key_record.id,
            key_record.access_count + 1,
            key_record.is_locked,
            CASE 
                WHEN key_record.is_locked THEN key_record.lock_reason
                WHEN NOT key_record.is_active THEN 'API key is inactive'
                WHEN key_record.expires_at IS NOT NULL AND key_record.expires_at <= now() THEN 'API key has expired'
                WHEN key_record.max_uses IS NOT NULL AND key_record.access_count >= key_record.max_uses THEN 'Usage limit exceeded'
                WHEN NOT ip_allowed THEN 'IP address not allowed'
                ELSE NULL
            END,
            key_record.tier;
    END;
END;
$$;

-- Create tier rate limit configurations table
CREATE TABLE IF NOT EXISTS public.api_tier_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tier text NOT NULL UNIQUE CHECK (tier IN ('free', 'starter', 'pro', 'enterprise')),
    requests_per_minute integer NOT NULL,
    requests_per_hour integer NOT NULL,
    requests_per_day integer NOT NULL,
    max_concurrent_requests integer NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default tier configurations
INSERT INTO public.api_tier_limits (tier, requests_per_minute, requests_per_hour, requests_per_day, max_concurrent_requests, features)
VALUES 
    ('free', 10, 100, 1000, 2, '["soil_analysis", "county_lookup"]'::jsonb),
    ('starter', 30, 500, 5000, 5, '["soil_analysis", "county_lookup", "water_quality", "planting_calendar"]'::jsonb),
    ('pro', 100, 2000, 25000, 15, '["soil_analysis", "county_lookup", "water_quality", "planting_calendar", "satellite_data", "ai_recommendations", "vrt_maps"]'::jsonb),
    ('enterprise', 500, 10000, 100000, 50, '["all"]'::jsonb)
ON CONFLICT (tier) DO UPDATE SET
    requests_per_minute = EXCLUDED.requests_per_minute,
    requests_per_hour = EXCLUDED.requests_per_hour,
    requests_per_day = EXCLUDED.requests_per_day,
    max_concurrent_requests = EXCLUDED.max_concurrent_requests,
    features = EXCLUDED.features,
    updated_at = now();

-- Enable RLS on tier limits
ALTER TABLE public.api_tier_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read tier limits (for SDK documentation)
CREATE POLICY "Anyone can view tier limits"
ON public.api_tier_limits
FOR SELECT
TO public
USING (true);

-- Policy: Only admins can modify tier limits
CREATE POLICY "Admins can manage tier limits"
ON public.api_tier_limits
FOR ALL
TO authenticated
USING (public.is_admin());

COMMENT ON TABLE public.api_tier_limits IS 'Rate limit configurations for different API subscription tiers';
COMMENT ON COLUMN public.api_keys.subscription_tier IS 'SDK subscription tier: free, starter, pro, or enterprise';