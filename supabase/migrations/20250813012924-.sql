-- Drop the problematic policies and recreate them correctly
DROP POLICY IF EXISTS "Enhanced profile access control" ON public.profiles;
DROP POLICY IF EXISTS "Enhanced soil analyses access" ON public.soil_analyses;
DROP POLICY IF EXISTS "Enhanced carbon credits access" ON public.carbon_credits;

-- Create corrected RLS policies without TG_OP reference

-- Enhanced RLS for profiles table
CREATE POLICY "Enhanced profile access control" ON public.profiles
FOR ALL
USING (
    user_id = auth.uid() OR 
    public.is_admin()
);

-- Enhanced RLS for soil analyses (keep existing specific policies)
CREATE POLICY "Users can view their own soil analyses" ON public.soil_analyses
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own soil analyses" ON public.soil_analyses
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own soil analyses" ON public.soil_analyses
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own soil analyses" ON public.soil_analyses
FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all soil analyses" ON public.soil_analyses
FOR ALL
USING (public.is_admin());

-- Enhanced RLS for carbon credits (keep existing specific policies)
CREATE POLICY "Users can view their own carbon credits" ON public.carbon_credits
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own carbon credits" ON public.carbon_credits
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own carbon credits" ON public.carbon_credits
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all carbon credits" ON public.carbon_credits
FOR ALL
USING (public.is_admin());

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
CREATE TRIGGER security_threat_detection_auth
    AFTER INSERT ON public.auth_security_log
    FOR EACH ROW
    EXECUTE FUNCTION public.detect_security_threats();

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
            );
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
CREATE TRIGGER update_security_monitoring_updated_at
    BEFORE UPDATE ON public.security_monitoring
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for security monitoring
CREATE INDEX IF NOT EXISTS idx_security_monitoring_type_level ON public.security_monitoring(monitoring_type, threat_level);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_user_time ON public.security_monitoring(target_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_ip_time ON public.security_monitoring(target_ip, created_at);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_status ON public.security_monitoring(investigation_status);