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

-- Create security monitoring table for real-time threats
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

-- Create indexes for audit and security tables
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_table_time ON public.comprehensive_audit_log(table_name, created_at);
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_user_time ON public.comprehensive_audit_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comprehensive_audit_log_risk ON public.comprehensive_audit_log(risk_level, created_at);
CREATE INDEX IF NOT EXISTS idx_data_classification_level ON public.data_classification(classification_level);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_type_level ON public.security_monitoring(monitoring_type, threat_level);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_user_time ON public.security_monitoring(target_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_ip_time ON public.security_monitoring(target_ip, created_at);

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_data_classification_updated_at
    BEFORE UPDATE ON public.data_classification
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_monitoring_updated_at
    BEFORE UPDATE ON public.security_monitoring
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();