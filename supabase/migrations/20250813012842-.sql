-- Create comprehensive audit trail for all sensitive operations
CREATE TABLE IF NOT EXISTS public.comprehensive_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE, SELECT
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    risk_level TEXT DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    compliance_tags TEXT[] DEFAULT '{}',
    retention_period INTERVAL DEFAULT '7 years',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on comprehensive audit log
ALTER TABLE public.comprehensive_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comprehensive audit log
CREATE POLICY "Admins can view all audit records" ON public.comprehensive_audit_log
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can view their own audit records" ON public.comprehensive_audit_log
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Service can insert audit records" ON public.comprehensive_audit_log
FOR INSERT
WITH CHECK (true);

-- Create data classification table
CREATE TABLE IF NOT EXISTS public.data_classification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL UNIQUE,
    classification_level TEXT NOT NULL, -- PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
    data_retention_days INTEGER DEFAULT 2555, -- 7 years default
    encryption_required BOOLEAN DEFAULT FALSE,
    access_logging_required BOOLEAN DEFAULT TRUE,
    approval_required_for_access BOOLEAN DEFAULT FALSE,
    compliance_requirements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on data classification
ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for data classification
CREATE POLICY "Admins can manage data classification" ON public.data_classification
FOR ALL
USING (public.is_admin());

CREATE POLICY "All can view data classification" ON public.data_classification
FOR SELECT
USING (true);

-- Insert data classifications for existing tables
INSERT INTO public.data_classification (table_name, classification_level, encryption_required, access_logging_required) VALUES
('profiles', 'CONFIDENTIAL', true, true),
('subscribers', 'CONFIDENTIAL', true, true),
('api_keys', 'RESTRICTED', true, true),
('account_security', 'RESTRICTED', true, true),
('auth_security_log', 'RESTRICTED', true, true),
('security_audit_log', 'RESTRICTED', true, true),
('security_incidents', 'RESTRICTED', true, true),
('user_roles', 'CONFIDENTIAL', true, true),
('soil_analyses', 'INTERNAL', false, true),
('carbon_credits', 'CONFIDENTIAL', true, true),
('adapt_integrations', 'CONFIDENTIAL', true, true)
ON CONFLICT (table_name) DO NOTHING;

-- Create function for enhanced input validation
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(
    input_value TEXT,
    validation_type TEXT DEFAULT 'general',
    max_length INTEGER DEFAULT 1000
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    sanitized_value TEXT;
    pattern TEXT;
BEGIN
    -- Basic sanitization
    sanitized_value := trim(input_value);
    
    -- Length validation
    IF length(sanitized_value) > max_length THEN
        RAISE EXCEPTION 'Input exceeds maximum length of %', max_length;
    END IF;
    
    -- Type-specific validation
    CASE validation_type
        WHEN 'email' THEN
            pattern := '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
            IF NOT sanitized_value ~ pattern THEN
                RAISE EXCEPTION 'Invalid email format';
            END IF;
            
        WHEN 'alphanumeric' THEN
            pattern := '^[a-zA-Z0-9_-]+$';
            IF NOT sanitized_value ~ pattern THEN
                RAISE EXCEPTION 'Input must be alphanumeric with underscores and hyphens only';
            END IF;
            
        WHEN 'sql_safe' THEN
            -- Remove potential SQL injection patterns
            IF sanitized_value ~* '(drop|delete|truncate|insert|update|create|alter|exec|union|select|script|javascript|vbscript)' THEN
                RAISE EXCEPTION 'Input contains potentially dangerous content';
            END IF;
            
        WHEN 'numeric' THEN
            IF NOT sanitized_value ~ '^[0-9]+(\.[0-9]+)?$' THEN
                RAISE EXCEPTION 'Input must be numeric';
            END IF;
            
        WHEN 'county_fips' THEN
            IF NOT sanitized_value ~ '^[0-9]{5}$' THEN
                RAISE EXCEPTION 'County FIPS must be exactly 5 digits';
            END IF;
            
        ELSE
            -- General sanitization - remove dangerous characters
            sanitized_value := regexp_replace(sanitized_value, '[<>"\'';&|`$]', '', 'g');
    END CASE;
    
    RETURN sanitized_value;
END;
$$;

-- Create function for enhanced rate limiting with IP-based tracking
CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit(
    identifier TEXT,
    endpoint TEXT,
    limit_count INTEGER DEFAULT 100,
    window_minutes INTEGER DEFAULT 60,
    ip_address INET DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    current_count INTEGER := 0;
    window_start TIMESTAMPTZ;
    is_rate_limited BOOLEAN := FALSE;
    reset_time TIMESTAMPTZ;
    ip_count INTEGER := 0;
    suspicious_activity BOOLEAN := FALSE;
BEGIN
    window_start := now() - (window_minutes || ' minutes')::INTERVAL;
    reset_time := now() + (window_minutes || ' minutes')::INTERVAL;
    
    -- Check identifier-based rate limit
    SELECT COUNT(*) INTO current_count
    FROM public.rate_limit_tracking
    WHERE identifier = check_enhanced_rate_limit.identifier
      AND endpoint = check_enhanced_rate_limit.endpoint
      AND window_start >= check_enhanced_rate_limit.window_start;
    
    -- Check IP-based rate limit (stricter)
    IF ip_address IS NOT NULL THEN
        SELECT COUNT(*) INTO ip_count
        FROM public.rate_limit_tracking
        WHERE identifier = ip_address::TEXT
          AND window_start >= check_enhanced_rate_limit.window_start;
          
        -- Flag suspicious activity if IP has excessive requests across endpoints
        IF ip_count > (limit_count * 3) THEN
            suspicious_activity := TRUE;
            
            -- Log suspicious activity
            INSERT INTO public.security_incidents (
                incident_type, severity, source_ip, endpoint, incident_details
            ) VALUES (
                'rate_limit_abuse', 'HIGH', ip_address, endpoint,
                jsonb_build_object(
                    'ip_request_count', ip_count,
                    'window_minutes', window_minutes,
                    'threshold_exceeded', limit_count * 3
                )
            );
        END IF;
    END IF;
    
    -- Determine if rate limited
    is_rate_limited := current_count >= limit_count OR suspicious_activity;
    
    -- Insert/update tracking record
    INSERT INTO public.rate_limit_tracking (
        identifier, endpoint, request_count, window_start, window_end
    ) VALUES (
        identifier, endpoint, 1, now(), reset_time
    )
    ON CONFLICT (identifier, endpoint) DO UPDATE SET
        request_count = rate_limit_tracking.request_count + 1,
        window_end = CASE 
            WHEN rate_limit_tracking.window_start < window_start THEN reset_time
            ELSE rate_limit_tracking.window_end
        END;
    
    RETURN jsonb_build_object(
        'allowed', NOT is_rate_limited,
        'current_count', current_count + 1,
        'limit', limit_count,
        'reset_time', reset_time,
        'suspicious_activity', suspicious_activity,
        'ip_requests', ip_count
    );
END;
$$;

-- Create function for data access authorization
CREATE OR REPLACE FUNCTION public.authorize_data_access(
    table_name_param TEXT,
    operation_param TEXT,
    user_id_param UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    classification RECORD;
    user_role TEXT;
    is_authorized BOOLEAN := FALSE;
BEGIN
    -- Get data classification
    SELECT * INTO classification
    FROM public.data_classification
    WHERE table_name = table_name_param;
    
    -- Get user role (default to 'user' if no role found)
    SELECT role INTO user_role
    FROM public.user_roles
    WHERE user_id = user_id_param
    ORDER BY CASE role 
        WHEN 'admin' THEN 1 
        WHEN 'moderator' THEN 2 
        ELSE 3 
    END
    LIMIT 1;
    
    IF user_role IS NULL THEN
        user_role := 'user';
    END IF;
    
    -- Authorization logic based on classification level
    CASE classification.classification_level
        WHEN 'PUBLIC' THEN
            is_authorized := TRUE;
            
        WHEN 'INTERNAL' THEN
            is_authorized := (user_role IN ('admin', 'moderator', 'user'));
            
        WHEN 'CONFIDENTIAL' THEN
            is_authorized := (user_role IN ('admin', 'moderator')) OR 
                           (user_role = 'user' AND operation_param IN ('SELECT'));
            
        WHEN 'RESTRICTED' THEN
            is_authorized := (user_role = 'admin') OR
                           (user_role = 'moderator' AND operation_param = 'SELECT');
            
        ELSE
            is_authorized := FALSE;
    END CASE;
    
    -- Log access attempt if logging required
    IF classification.access_logging_required THEN
        INSERT INTO public.comprehensive_audit_log (
            user_id, table_name, operation, risk_level
        ) VALUES (
            user_id_param, table_name_param, operation_param,
            CASE WHEN is_authorized THEN 'LOW' ELSE 'HIGH' END
        );
    END IF;
    
    RETURN is_authorized;
END;
$$;

-- Create function for security event correlation
CREATE OR REPLACE FUNCTION public.correlate_security_events()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    suspicious_ips RECORD;
    high_risk_users RECORD;
BEGIN
    -- Identify suspicious IP addresses (multiple failed logins across users)
    FOR suspicious_ips IN 
        SELECT 
            ip_address,
            COUNT(DISTINCT user_id) as unique_users,
            COUNT(*) as failed_attempts
        FROM public.auth_security_log
        WHERE success = FALSE 
          AND created_at > now() - interval '1 hour'
          AND ip_address IS NOT NULL
        GROUP BY ip_address
        HAVING COUNT(DISTINCT user_id) >= 3 OR COUNT(*) >= 10
    LOOP
        -- Create security incident for suspicious IP
        INSERT INTO public.security_incidents (
            incident_type, severity, source_ip, incident_details
        ) VALUES (
            'suspicious_ip_activity', 'HIGH', suspicious_ips.ip_address,
            jsonb_build_object(
                'unique_users_targeted', suspicious_ips.unique_users,
                'total_failed_attempts', suspicious_ips.failed_attempts,
                'detection_window', '1 hour'
            )
        );
    END LOOP;
    
    -- Identify high-risk users (multiple failed attempts, suspicious activity)
    FOR high_risk_users IN
        SELECT 
            user_id,
            email,
            SUM(risk_score) as total_risk,
            COUNT(*) as event_count
        FROM public.auth_security_log
        WHERE created_at > now() - interval '24 hours'
          AND user_id IS NOT NULL
        GROUP BY user_id, email
        HAVING SUM(risk_score) >= 200 OR COUNT(*) >= 20
    LOOP
        -- Update account security for high-risk users
        UPDATE public.account_security
        SET 
            suspicious_activity_count = suspicious_activity_count + 1,
            last_suspicious_activity = now(),
            requires_password_change = CASE 
                WHEN high_risk_users.total_risk >= 300 THEN TRUE 
                ELSE requires_password_change 
            END
        WHERE user_id = high_risk_users.user_id;
        
        -- Create security incident
        INSERT INTO public.security_incidents (
            user_id, incident_type, severity, incident_details
        ) VALUES (
            high_risk_users.user_id, 'high_risk_user_activity', 'MEDIUM',
            jsonb_build_object(
                'total_risk_score', high_risk_users.total_risk,
                'event_count', high_risk_users.event_count,
                'requires_password_change', high_risk_users.total_risk >= 300
            )
        );
    END LOOP;
END;
$$;

-- Create function to clean up old audit logs based on retention policies
CREATE OR REPLACE FUNCTION public.cleanup_audit_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    deleted_count INTEGER := 0;
    classification RECORD;
BEGIN
    -- Clean up based on data classification retention policies
    FOR classification IN 
        SELECT table_name, data_retention_days 
        FROM public.data_classification
    LOOP
        -- Clean up comprehensive audit log
        DELETE FROM public.comprehensive_audit_log
        WHERE table_name = classification.table_name
          AND created_at < now() - (classification.data_retention_days || ' days')::INTERVAL;
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
    END LOOP;
    
    -- Clean up old rate limit tracking (keep 30 days)
    DELETE FROM public.rate_limit_tracking
    WHERE window_end < now() - interval '30 days';
    
    -- Clean up old auth security logs (keep 1 year)
    DELETE FROM public.auth_security_log
    WHERE created_at < now() - interval '1 year';
    
    RETURN deleted_count;
END;
$$;

-- Create additional RLS policies for enhanced security

-- Enhanced RLS for profiles table
DROP POLICY IF EXISTS "Enhanced profile access control" ON public.profiles;
CREATE POLICY "Enhanced profile access control" ON public.profiles
FOR ALL
USING (
    user_id = auth.uid() OR 
    public.is_admin() OR
    public.authorize_data_access('profiles', TG_OP)
);

-- Enhanced RLS for soil analyses
DROP POLICY IF EXISTS "Users can view their own soil analyses" ON public.soil_analyses;
CREATE POLICY "Enhanced soil analyses access" ON public.soil_analyses
FOR SELECT
USING (
    user_id = auth.uid() OR 
    public.is_admin() OR
    public.authorize_data_access('soil_analyses', 'SELECT')
);

-- Enhanced RLS for carbon credits
DROP POLICY IF EXISTS "Users can view their own carbon credits" ON public.carbon_credits;
CREATE POLICY "Enhanced carbon credits access" ON public.carbon_credits
FOR SELECT
USING (
    user_id = auth.uid() OR 
    public.is_admin() OR
    public.authorize_data_access('carbon_credits', 'SELECT')
);

-- Create indexes for audit and security tables
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_table_time ON public.comprehensive_audit_log(table_name, created_at);
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_user_time ON public.comprehensive_audit_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_risk ON public.comprehensive_audit_log(risk_level, created_at);
CREATE INDEX IF NOT EXISTS idx_data_classification_level ON public.data_classification(classification_level);

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_data_classification_updated_at
    BEFORE UPDATE ON public.data_classification
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();