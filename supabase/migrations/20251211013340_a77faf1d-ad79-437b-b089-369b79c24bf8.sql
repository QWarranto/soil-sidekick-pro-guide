-- Fix ambiguous column reference in validate_api_key function
CREATE OR REPLACE FUNCTION public.validate_api_key(key_hash text, client_ip inet DEFAULT NULL::inet)
 RETURNS TABLE(user_id uuid, permissions jsonb, rate_limit integer, rate_window_minutes integer, is_valid boolean, api_key_id uuid, access_count integer, is_locked boolean, lock_reason text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
        -- Update access statistics (using table alias to avoid ambiguity)
        UPDATE public.api_keys AS ak
        SET 
            last_used_at = now(),
            access_count = ak.access_count + 1,
            last_access_ip = client_ip
        WHERE ak.id = key_record.id;
        
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
$function$;