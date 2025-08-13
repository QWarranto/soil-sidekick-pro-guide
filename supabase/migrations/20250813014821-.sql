-- Create additional security monitoring table for real-time threats
CREATE TABLE IF NOT EXISTS public.security_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitoring_type TEXT NOT NULL, -- 'brute_force', 'data_exfiltration', 'privilege_escalation', 'anomalous_access'
    threat_level TEXT NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    target_user_id UUID,
    target_ip INET,
    target_resource TEXT,
    detection_rules JSONB,
    mitigation_actions JSONB,
    auto_blocked BOOLEAN DEFAULT FALSE,
    investigation_status TEXT DEFAULT 'NEW', -- 'NEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on security monitoring
ALTER TABLE public.security_monitoring ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security monitoring
CREATE POLICY "Admins can manage security monitoring" ON public.security_monitoring
FOR ALL
USING (public.is_admin());

-- Add admin policies to existing tables
CREATE POLICY "Admins can manage all soil analyses" ON public.soil_analyses
FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can manage all carbon credits" ON public.carbon_credits
FOR ALL
USING (public.is_admin());

-- Create function for real-time threat detection
CREATE OR REPLACE FUNCTION public.detect_security_threats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    threat_detected BOOLEAN := FALSE;
    threat_level TEXT := 'LOW';
    threat_type TEXT;
    mitigation JSONB := '{}';
BEGIN
    -- Detect brute force attacks
    IF TG_TABLE_NAME = 'auth_security_log' AND NEW.success = FALSE THEN
        -- Check for rapid failed login attempts
        IF (SELECT COUNT(*) FROM public.auth_security_log 
            WHERE user_id = NEW.user_id 
              AND success = FALSE 
              AND created_at > now() - interval '5 minutes') >= 3 THEN
            
            threat_detected := TRUE;
            threat_type := 'brute_force';
            threat_level := 'HIGH';
            mitigation := jsonb_build_object(
                'action', 'temporary_account_lock',
                'duration', '15 minutes'
            );
        END IF;
    END IF;
    
    -- Detect data exfiltration attempts
    IF TG_TABLE_NAME = 'comprehensive_audit_log' AND NEW.operation = 'SELECT' THEN
        -- Check for excessive data access
        IF (SELECT COUNT(*) FROM public.comprehensive_audit_log 
            WHERE user_id = NEW.user_id 
              AND operation = 'SELECT' 
              AND created_at > now() - interval '1 hour') >= 50 THEN
            
            threat_detected := TRUE;
            threat_type := 'data_exfiltration';
            threat_level := 'CRITICAL';
            mitigation := jsonb_build_object(
                'action', 'rate_limit_user',
                'notification', 'admin_alert'
            );
        END IF;
    END IF;
    
    -- Create security monitoring record if threat detected
    IF threat_detected THEN
        INSERT INTO public.security_monitoring (
            monitoring_type, threat_level, target_user_id, target_ip,
            detection_rules, mitigation_actions, auto_blocked
        ) VALUES (
            threat_type, threat_level, NEW.user_id, NEW.ip_address,
            jsonb_build_object('trigger_table', TG_TABLE_NAME, 'detection_time', now()),
            mitigation, threat_level IN ('HIGH', 'CRITICAL')
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create triggers for threat detection
DROP TRIGGER IF EXISTS security_threat_detection_auth ON public.auth_security_log;
CREATE TRIGGER security_threat_detection_auth
    AFTER INSERT ON public.auth_security_log
    FOR EACH ROW
    EXECUTE FUNCTION public.detect_security_threats();

DROP TRIGGER IF EXISTS security_threat_detection_audit ON public.comprehensive_audit_log;
CREATE TRIGGER security_threat_detection_audit
    AFTER INSERT ON public.comprehensive_audit_log
    FOR EACH ROW
    EXECUTE FUNCTION public.detect_security_threats();

-- Create function for automated security response
CREATE OR REPLACE FUNCTION public.automated_security_response(
    monitoring_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    monitoring_record RECORD;
    response_executed BOOLEAN := FALSE;
BEGIN
    -- Get monitoring record
    SELECT * INTO monitoring_record
    FROM public.security_monitoring
    WHERE id = monitoring_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Execute automated responses based on threat type
    CASE monitoring_record.monitoring_type
        WHEN 'brute_force' THEN
            -- Temporarily lock account
            IF monitoring_record.target_user_id IS NOT NULL THEN
                UPDATE public.account_security
                SET 
                    account_locked = TRUE,
                    locked_until = now() + interval '15 minutes',
                    lock_reason = 'Automated security response - brute force detected'
                WHERE user_id = monitoring_record.target_user_id;
                response_executed := TRUE;
            END IF;
            
        WHEN 'data_exfiltration' THEN
            -- Rate limit user severely
            INSERT INTO public.rate_limit_tracking (
                identifier, endpoint, request_count, window_start, window_end
            ) VALUES (
                monitoring_record.target_user_id::TEXT, 'global', 1000, 
                now(), now() + interval '1 hour'
            )
            ON CONFLICT (identifier, endpoint) DO UPDATE SET
                request_count = 1000,
                window_end = now() + interval '1 hour';
            response_executed := TRUE;
            
        ELSE
            -- Log the incident for manual review
            UPDATE public.security_monitoring
            SET investigation_status = 'INVESTIGATING'
            WHERE id = monitoring_id;
    END CASE;
    
    -- Update monitoring record
    UPDATE public.security_monitoring
    SET 
        mitigation_actions = mitigation_actions || jsonb_build_object(
            'response_executed', response_executed,
            'response_time', now()
        ),
        updated_at = now()
    WHERE id = monitoring_id;
    
    RETURN response_executed;
END;
$$;

-- Add trigger for updated_at on security monitoring
DROP TRIGGER IF EXISTS update_security_monitoring_updated_at ON public.security_monitoring;
CREATE TRIGGER update_security_monitoring_updated_at
    BEFORE UPDATE ON public.security_monitoring
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for security monitoring
CREATE INDEX IF NOT EXISTS idx_security_monitoring_type_level ON public.security_monitoring(monitoring_type, threat_level);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_user_time ON public.security_monitoring(target_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_ip_time ON public.security_monitoring(target_ip, created_at);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_status ON public.security_monitoring(investigation_status);

-- Create additional security constraint checks
CREATE OR REPLACE FUNCTION public.enforce_security_constraints()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Enforce minimum password age for changes (prevent rapid changes)
    IF TG_TABLE_NAME = 'account_security' AND TG_OP = 'UPDATE' THEN
        IF OLD.password_changed_at IS NOT NULL AND 
           NEW.password_changed_at > OLD.password_changed_at AND
           OLD.password_changed_at > now() - interval '24 hours' THEN
            RAISE EXCEPTION 'Password can only be changed once per 24 hours';
        END IF;
    END IF;
    
    -- Enforce API key creation limits (max 10 per user)
    IF TG_TABLE_NAME = 'api_keys' AND TG_OP = 'INSERT' THEN
        IF (SELECT COUNT(*) FROM public.api_keys 
            WHERE user_id = NEW.user_id AND is_active = TRUE) >= 10 THEN
            RAISE EXCEPTION 'Maximum number of active API keys (10) exceeded';
        END IF;
    END IF;
    
    -- Prevent privilege escalation in user_roles
    IF TG_TABLE_NAME = 'user_roles' AND TG_OP = 'INSERT' THEN
        -- Only admins can create admin roles
        IF NEW.role = 'admin' AND NOT public.is_admin() THEN
            RAISE EXCEPTION 'Only administrators can grant admin privileges';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create constraint triggers
DROP TRIGGER IF EXISTS enforce_account_security_constraints ON public.account_security;
CREATE TRIGGER enforce_account_security_constraints
    BEFORE UPDATE ON public.account_security
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_security_constraints();

DROP TRIGGER IF EXISTS enforce_api_key_constraints ON public.api_keys;
CREATE TRIGGER enforce_api_key_constraints
    BEFORE INSERT ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_security_constraints();

DROP TRIGGER IF EXISTS enforce_user_role_constraints ON public.user_roles;
CREATE TRIGGER enforce_user_role_constraints
    BEFORE INSERT ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_security_constraints();