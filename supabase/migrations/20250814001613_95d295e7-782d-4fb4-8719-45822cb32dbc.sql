-- Fix overly permissive service role policies across multiple tables
-- Implement stricter authentication and context validation for service operations

-- 1. Fix subscribers table - restrict service role access to specific operations
DROP POLICY IF EXISTS "Service functions can insert subscription data" ON public.subscribers;
DROP POLICY IF EXISTS "Service functions can update subscription data" ON public.subscribers;

-- Create more restrictive service policies for subscribers table
CREATE POLICY "Authenticated service can insert subscription data"
ON public.subscribers
FOR INSERT
WITH CHECK (
  -- Only allow if called from authenticated context or system function
  (auth.role() = 'service_role' AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL)
  OR 
  (auth.uid() IS NOT NULL)
);

CREATE POLICY "Authenticated service can update subscription data"
ON public.subscribers
FOR UPDATE
USING (
  -- Only allow if called from authenticated context or system function
  (auth.role() = 'service_role' AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL)
  OR 
  (auth.uid() = user_id)
);

-- 2. Fix adapt_integrations table - ensure API credentials are properly protected
DROP POLICY IF EXISTS "Users can manage their own integrations" ON public.adapt_integrations;

-- Recreate with more specific policies
CREATE POLICY "Users can view their own integrations"
ON public.adapt_integrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations"
ON public.adapt_integrations
FOR INSERT
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own integrations"
ON public.adapt_integrations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations"
ON public.adapt_integrations
FOR DELETE
USING (auth.uid() = user_id);

-- 3. Fix account_security table - restrict service access
DROP POLICY IF EXISTS "Service can manage security status" ON public.account_security;

CREATE POLICY "Authenticated service can manage security status"
ON public.account_security
FOR ALL
USING (
  -- Only allow service role with valid authentication context
  (auth.role() = 'service_role' AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL)
  OR
  (auth.uid() = user_id)
);

-- 4. Fix profiles table - ensure stronger validation
-- Add additional check to existing policies
ALTER POLICY "Users can view their own profile" ON public.profiles
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

ALTER POLICY "Users can update their own profile" ON public.profiles
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

ALTER POLICY "Users can insert their own profile" ON public.profiles
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 5. Add function to validate service operations
CREATE OR REPLACE FUNCTION public.validate_service_operation()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Check if this is a legitimate service operation
  -- Must have service role AND valid JWT context
  RETURN (
    auth.role() = 'service_role' 
    AND current_setting('request.jwt.claims', true)::json->>'email' IS NOT NULL
  );
END;
$$;

-- 6. Create audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log any service role operations on sensitive tables
  IF auth.role() = 'service_role' THEN
    INSERT INTO public.comprehensive_audit_log (
      table_name,
      operation,
      old_values,
      new_values,
      risk_level,
      compliance_tags,
      user_id
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
      'HIGH',
      ARRAY['SERVICE_OPERATION', 'AUDIT_REQUIRED'],
      COALESCE(NEW.user_id, OLD.user_id)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_subscribers_operations
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

CREATE TRIGGER audit_integrations_operations
  AFTER INSERT OR UPDATE OR DELETE ON public.adapt_integrations
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

-- 7. Log this security hardening
INSERT INTO public.comprehensive_audit_log (
  table_name,
  operation,
  old_values,
  new_values,
  risk_level,
  compliance_tags
) VALUES (
  'multiple_tables',
  'SECURITY_HARDENING',
  '{"service_policies": "permissive", "validation": "weak"}'::jsonb,
  '{"service_policies": "restrictive", "validation": "strong", "audit_enabled": true}'::jsonb,
  'CRITICAL',
  ARRAY['SECURITY_HARDENING', 'SERVICE_ROLE_RESTRICTION', 'DATA_PROTECTION', 'AUDIT_ENHANCEMENT']
);