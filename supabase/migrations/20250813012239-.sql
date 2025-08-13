-- Add enhanced security columns to api_keys table
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS last_access_ip INET,
ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_failed_attempt TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lock_reason TEXT,
ADD COLUMN IF NOT EXISTS rotation_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS max_uses INTEGER,
ADD COLUMN IF NOT EXISTS allowed_ips TEXT[];

-- Create API key access log table for detailed monitoring
CREATE TABLE IF NOT EXISTS public.api_key_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
    user_id UUID,
    access_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    endpoint TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    request_size_bytes INTEGER,
    response_time_ms INTEGER,
    rate_limited BOOLEAN DEFAULT FALSE
);

-- Enable RLS on API key access log
ALTER TABLE public.api_key_access_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for API key access log
CREATE POLICY "Users can view their own API key access logs" ON public.api_key_access_log
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Service can insert API key access logs" ON public.api_key_access_log
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all API key access logs" ON public.api_key_access_log
FOR SELECT
USING (public.is_admin());

-- Create function to automatically lock API keys after failed attempts
CREATE OR REPLACE FUNCTION public.check_api_key_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Lock API key if too many failed attempts (5 in 10 minutes)
    IF NEW.failed_attempts >= 5 AND 
       (NEW.last_failed_attempt IS NULL OR 
        NEW.last_failed_attempt > now() - interval '10 minutes') THEN
        NEW.is_locked = TRUE;
        NEW.lock_reason = 'Too many failed attempts';
    END IF;
    
    -- Mark for rotation if key is old (90 days)
    IF NEW.created_at < now() - interval '90 days' AND 
       NEW.rotation_required = FALSE THEN
        NEW.rotation_required = TRUE;
    END IF;
    
    -- Lock if expired
    IF NEW.expires_at IS NOT NULL AND NEW.expires_at < now() THEN
        NEW.is_active = FALSE;
        NEW.is_locked = TRUE;
        NEW.lock_reason = 'API key expired';
    END IF;
    
    -- Lock if max uses exceeded
    IF NEW.max_uses IS NOT NULL AND NEW.access_count >= NEW.max_uses THEN
        NEW.is_active = FALSE;
        NEW.is_locked = TRUE;
        NEW.lock_reason = 'Maximum usage limit reached';
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger for API key security checks
DROP TRIGGER IF EXISTS api_key_security_check ON public.api_keys;
CREATE TRIGGER api_key_security_check
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.check_api_key_security();

-- Update the validate_api_key function with enhanced security
CREATE OR REPLACE FUNCTION public.validate_api_key(key_hash text, client_ip inet DEFAULT NULL)
RETURNS TABLE(
    user_id uuid, 
    permissions jsonb, 
    rate_limit integer, 
    rate_window_minutes integer, 
    is_valid boolean,
    api_key_id uuid,
    access_count integer,
    is_locked boolean,
    lock_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    key_record RECORD;
    ip_allowed BOOLEAN := TRUE;
BEGIN
    -- Get API key record
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
        ak.max_uses
    INTO key_record
    FROM public.api_keys ak
    WHERE ak.key_hash = validate_api_key.key_hash;
    
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
            'API key not found'::text;
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
        
        -- Return validation result
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
            END;
    END;
END;
$$;

-- Create function to rotate API keys
CREATE OR REPLACE FUNCTION public.rotate_api_key(old_key_id uuid, new_key_hash text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    old_key RECORD;
    new_key_id uuid;
BEGIN
    -- Get old key details
    SELECT * INTO old_key
    FROM public.api_keys
    WHERE id = old_key_id AND user_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'API key not found or access denied';
    END IF;
    
    -- Create new key with same settings
    INSERT INTO public.api_keys (
        user_id,
        key_name,
        key_hash,
        permissions,
        rate_limit,
        rate_window_minutes,
        expires_at,
        max_uses,
        allowed_ips
    ) VALUES (
        old_key.user_id,
        old_key.key_name || ' (Rotated)',
        new_key_hash,
        old_key.permissions,
        old_key.rate_limit,
        old_key.rate_window_minutes,
        old_key.expires_at,
        old_key.max_uses,
        old_key.allowed_ips
    ) RETURNING id INTO new_key_id;
    
    -- Deactivate old key
    UPDATE public.api_keys
    SET 
        is_active = FALSE,
        rotation_required = FALSE,
        lock_reason = 'Rotated to new key'
    WHERE id = old_key_id;
    
    RETURN new_key_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_active ON public.api_keys(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_key_access_log_key_time ON public.api_key_access_log(api_key_id, access_time);
CREATE INDEX IF NOT EXISTS idx_api_key_access_log_user_time ON public.api_key_access_log(user_id, access_time);