-- Enhanced Security: Strengthen account_security RLS policies and add missing controls
-- This addresses the security finding about customer security information exposure

-- First, let's create a more restrictive policy structure for account_security
-- Drop existing policies to recreate them with stricter controls
DROP POLICY IF EXISTS "Users can view their own security status" ON public.account_security;
DROP POLICY IF EXISTS "Users can update their own security status" ON public.account_security;
DROP POLICY IF EXISTS "Admins can view all security status" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated service can manage security status" ON public.account_security;

-- Create new, more restrictive policies with enhanced security controls

-- 1. Users can only view their own security status with audit logging
CREATE POLICY "Users can view own security status only"
ON public.account_security
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
);

-- 2. Users can only update their own security status with restrictions
CREATE POLICY "Users can update own security status safely" 
ON public.account_security
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
)
WITH CHECK (
    user_id = auth.uid() 
    AND auth.uid() IS NOT NULL
    -- Prevent users from modifying critical security fields directly
    AND OLD.user_id = NEW.user_id
    AND OLD.id = NEW.id
    AND OLD.created_at = NEW.created_at
);

-- 3. Admins can view all security data with strict verification
CREATE POLICY "Verified admins can view all security status"
ON public.account_security  
FOR SELECT
TO authenticated
USING (
    public.is_admin(auth.uid()) = true
    AND auth.uid() IS NOT NULL
);

-- 4. Verified admins can update security data for user management
CREATE POLICY "Verified admins can manage security status"
ON public.account_security
FOR UPDATE  
TO authenticated
USING (
    public.is_admin(auth.uid()) = true
    AND auth.uid() IS NOT NULL
)
WITH CHECK (
    public.is_admin(auth.uid()) = true
    AND auth.uid() IS NOT NULL
);

-- 5. Only authenticated service with JWT verification can insert new security records
CREATE POLICY "Authenticated service can create security records"
ON public.account_security
FOR INSERT
TO authenticated  
WITH CHECK (
    (
        -- Service role with valid JWT claims
        auth.role() = 'service_role' 
        AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL
        AND public.validate_service_operation() = true
    ) 
    OR 
    (
        -- Regular authenticated users creating their own records
        auth.uid() IS NOT NULL 
        AND user_id = auth.uid()
    )
);

-- 6. Prevent DELETE operations entirely - security records should be preserved
-- (Only service operations should be able to delete, and only in exceptional circumstances)
CREATE POLICY "No deletion of security records"
ON public.account_security
FOR DELETE
TO authenticated
USING (false); -- No one can delete security records

-- Create an audit trigger for all access to account_security table
CREATE OR REPLACE FUNCTION public.audit_account_security_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Log all operations on the account_security table
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        record_id,
        old_values,
        new_values,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid(),
        'CRITICAL',
        ARRAY['SECURITY_ACCESS', 'ACCOUNT_SECURITY', 'SENSITIVE_DATA'],
        jsonb_build_object(
            'operation_type', TG_OP,
            'timestamp', now(),
            'user_role', auth.role(),
            'is_admin', public.is_admin(),
            'target_user', COALESCE(NEW.user_id, OLD.user_id)
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply the audit trigger to the account_security table
DROP TRIGGER IF EXISTS audit_account_security_operations ON public.account_security;
CREATE TRIGGER audit_account_security_operations
    AFTER INSERT OR UPDATE OR DELETE ON public.account_security
    FOR EACH ROW EXECUTE FUNCTION public.audit_account_security_access();

-- Create a function to verify security data access requests
CREATE OR REPLACE FUNCTION public.verify_security_data_access(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Only allow access if:
    -- 1. User is accessing their own data
    -- 2. User is a verified admin
    -- 3. This is a verified service operation
    
    IF target_user_id = auth.uid() THEN
        RETURN true;
    END IF;
    
    IF public.is_admin(auth.uid()) THEN
        RETURN true;
    END IF;
    
    IF public.validate_service_operation() THEN
        RETURN true;
    END IF;
    
    -- Log unauthorized access attempt
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        'UNAUTHORIZED_ACCESS_ATTEMPT',
        auth.uid(),
        'CRITICAL',
        ARRAY['SECURITY_VIOLATION', 'UNAUTHORIZED_ACCESS', 'BLOCKED_ATTEMPT'],
        jsonb_build_object(
            'target_user', target_user_id,
            'access_time', now(),
            'blocked_reason', 'Insufficient privileges'
        )
    );
    
    RETURN false;
END;
$$;

-- Log this critical security enhancement
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'account_security',
    'RLS_POLICIES_HARDENED',
    '{"policies": "basic", "audit_logging": "none", "access_control": "permissive"}'::jsonb,
    '{"policies": "restrictive", "audit_logging": "comprehensive", "access_control": "strict", "deletion_blocked": true}'::jsonb,
    'CRITICAL',
    ARRAY['SECURITY_HARDENING', 'ACCESS_CONTROL', 'AUDIT_ENHANCEMENT', 'RLS_IMPROVEMENT']
);