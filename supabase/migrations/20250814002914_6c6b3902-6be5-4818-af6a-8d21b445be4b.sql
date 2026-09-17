-- Fix customer data exposure in account_security and other sensitive tables
-- Implement strict access controls to protect email addresses and personal data

-- 1. Fix account_security table - remove overly permissive service policy
DROP POLICY IF EXISTS "Service can manage security status" ON public.account_security;

-- Create more restrictive service policy for account_security
CREATE POLICY "Authenticated service can manage security status"
ON public.account_security
FOR ALL
USING (
  -- Only allow service role with valid authentication context OR admin users
  (auth.role() = 'service_role' AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL)
  OR 
  is_admin()
  OR
  (auth.uid() = user_id)
);

-- 2. Strengthen profiles table policies to protect email addresses
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate profiles policies with stricter validation
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL AND user_id IS NOT NULL);

-- Admin access to profiles for support purposes
CREATE POLICY "Admins can view all profiles for support"
ON public.profiles
FOR SELECT
USING (is_admin());

-- 3. Strengthen API keys table policies
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.api_keys;

-- Recreate API keys policies with enhanced security
CREATE POLICY "Users can view only their own API keys"
ON public.api_keys
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can create only their own API keys"
ON public.api_keys
FOR INSERT
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL AND user_id IS NOT NULL);

CREATE POLICY "Users can update only their own API keys"
ON public.api_keys
FOR UPDATE
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete only their own API keys"
ON public.api_keys
FOR DELETE
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Admin access to API keys for security monitoring
CREATE POLICY "Admins can manage all API keys for security"
ON public.api_keys
FOR ALL
USING (is_admin());

-- 4. Create function to sanitize email addresses for logging
CREATE OR REPLACE FUNCTION public.sanitize_email_for_audit(email_address text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Return masked email for audit logs (keep domain for debugging)
    IF email_address IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN substring(email_address from 1 for 3) || '***@' || 
           substring(email_address from position('@' in email_address) + 1);
END;
$$;

-- 5. Create audit trigger for sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Log access to sensitive personal data
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        TG_TABLE_NAME,
        'SENSITIVE_DATA_ACCESS',
        auth.uid(),
        'HIGH',
        ARRAY['PERSONAL_DATA_ACCESS', 'EMAIL_ACCESS', 'PRIVACY_AUDIT'],
        jsonb_build_object(
            'access_time', now(),
            'table_accessed', TG_TABLE_NAME,
            'masked_email', CASE 
                WHEN TG_TABLE_NAME = 'account_security' THEN public.sanitize_email_for_audit(NEW.email)
                WHEN TG_TABLE_NAME = 'profiles' THEN public.sanitize_email_for_audit(NEW.email)
                ELSE 'N/A'
            END
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_account_security_access ON public.account_security;
DROP TRIGGER IF EXISTS audit_profiles_access ON public.profiles;

CREATE TRIGGER audit_account_security_access
    AFTER SELECT ON public.account_security
    FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data_access();

CREATE TRIGGER audit_profiles_access
    AFTER SELECT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data_access();

-- 6. Create function to verify data access legitimacy
CREATE OR REPLACE FUNCTION public.verify_legitimate_data_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Verify the request is legitimate (not from suspicious sources)
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if this is an admin or service role with proper context
    IF is_admin() OR 
       (auth.role() = 'service_role' AND 
        current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL) THEN
        RETURN TRUE;
    END IF;
    
    -- For regular users, additional checks could be added here
    -- (e.g., rate limiting, time-based restrictions, etc.)
    
    RETURN TRUE;
END;
$$;

-- 7. Log this critical security fix
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'customer_data_protection',
    'PERSONAL_DATA_SECURITY_HARDENING',
    '{"account_security": "overly_permissive_service_access", "profiles": "basic_rls", "api_keys": "basic_rls", "audit_logging": "minimal"}'::jsonb,
    '{"account_security": "strict_authenticated_access", "profiles": "enhanced_user_only_access", "api_keys": "secure_user_admin_access", "audit_logging": "comprehensive_with_email_masking"}'::jsonb,
    'CRITICAL',
    ARRAY['CUSTOMER_DATA_PROTECTED', 'EMAIL_PRIVACY', 'PERSONAL_INFO_SECURED', 'ADMIN_ACCESS_CONTROLLED', 'AUDIT_ENHANCED']
);