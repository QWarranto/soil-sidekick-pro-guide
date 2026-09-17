-- Create authentication security tracking table
CREATE TABLE IF NOT EXISTS public.auth_security_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT,
    event_type TEXT NOT NULL, -- 'login_attempt', 'login_success', 'login_fail', 'password_change', 'account_locked', 'suspicious_activity'
    ip_address INET,
    user_agent TEXT,
    location_data JSONB,
    device_fingerprint TEXT,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    failure_reason TEXT,
    risk_score INTEGER DEFAULT 0, -- 0-100 risk score
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on auth security log
ALTER TABLE public.auth_security_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth security log
CREATE POLICY "Users can view their own auth logs" ON public.auth_security_log
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Service can insert auth logs" ON public.auth_security_log
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all auth logs" ON public.auth_security_log
FOR SELECT
USING (public.is_admin());

-- Create account security status table
CREATE TABLE IF NOT EXISTS public.account_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    email TEXT NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMPTZ,
    account_locked BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMPTZ,
    lock_reason TEXT,
    password_changed_at TIMESTAMPTZ DEFAULT now(),
    password_strength_score INTEGER DEFAULT 0,
    requires_password_change BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    backup_codes_generated BOOLEAN DEFAULT FALSE,
    suspicious_activity_count INTEGER DEFAULT 0,
    last_suspicious_activity TIMESTAMPTZ,
    trusted_devices JSONB DEFAULT '[]',
    security_questions JSONB DEFAULT '{}',
    recovery_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on account security
ALTER TABLE public.account_security ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for account security
CREATE POLICY "Users can view their own security status" ON public.account_security
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own security status" ON public.account_security
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Service can manage security status" ON public.account_security
FOR ALL
USING (true);

CREATE POLICY "Admins can view all security status" ON public.account_security
FOR SELECT
USING (public.is_admin());

-- Create function to check password strength
CREATE OR REPLACE FUNCTION public.check_password_strength(password_text TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    strength_score INTEGER := 0;
    char_count INTEGER;
BEGIN
    char_count := LENGTH(password_text);
    
    -- Length scoring
    IF char_count >= 8 THEN strength_score := strength_score + 20; END IF;
    IF char_count >= 12 THEN strength_score := strength_score + 20; END IF;
    IF char_count >= 16 THEN strength_score := strength_score + 10; END IF;
    
    -- Character variety scoring
    IF password_text ~ '[a-z]' THEN strength_score := strength_score + 10; END IF; -- lowercase
    IF password_text ~ '[A-Z]' THEN strength_score := strength_score + 10; END IF; -- uppercase
    IF password_text ~ '[0-9]' THEN strength_score := strength_score + 10; END IF; -- numbers
    IF password_text ~ '[^A-Za-z0-9]' THEN strength_score := strength_score + 20; END IF; -- special chars
    
    -- Penalty for common patterns
    IF password_text ~* '(password|123456|qwerty|admin|letmein)' THEN 
        strength_score := strength_score - 30; 
    END IF;
    
    -- Ensure minimum score of 0
    IF strength_score < 0 THEN strength_score := 0; END IF;
    IF strength_score > 100 THEN strength_score := 100; END IF;
    
    RETURN strength_score;
END;
$$;

-- Create function to handle login attempts and security
CREATE OR REPLACE FUNCTION public.handle_login_attempt(
    user_email TEXT,
    attempt_success BOOLEAN,
    client_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL,
    failure_reason_text TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_record RECORD;
    security_record RECORD;
    risk_score INTEGER := 0;
    account_locked BOOLEAN := FALSE;
    lockout_duration INTERVAL := '15 minutes';
    max_attempts INTEGER := 5;
    result JSONB;
BEGIN
    -- Get user info
    SELECT id INTO user_record
    FROM auth.users
    WHERE email = user_email;
    
    -- Get or create security record
    INSERT INTO public.account_security (user_id, email)
    VALUES (user_record.id, user_email)
    ON CONFLICT (user_id) DO NOTHING;
    
    SELECT * INTO security_record
    FROM public.account_security
    WHERE user_id = user_record.id;
    
    -- Calculate risk score based on various factors
    risk_score := 0;
    
    -- IP-based risk (simplified)
    IF client_ip IS NOT NULL THEN
        -- Check if IP has had multiple failed attempts recently
        SELECT COUNT(*) INTO risk_score
        FROM public.auth_security_log
        WHERE ip_address = client_ip 
          AND success = FALSE 
          AND created_at > now() - interval '1 hour';
        
        risk_score := LEAST(risk_score * 10, 50);
    END IF;
    
    -- Time-based risk (login outside normal hours)
    IF EXTRACT(hour FROM now()) NOT BETWEEN 6 AND 23 THEN
        risk_score := risk_score + 20;
    END IF;
    
    IF attempt_success THEN
        -- Successful login - reset failed attempts
        UPDATE public.account_security
        SET 
            failed_login_attempts = 0,
            last_failed_login = NULL,
            account_locked = FALSE,
            locked_until = NULL,
            updated_at = now()
        WHERE user_id = user_record.id;
        
        -- Log successful login
        INSERT INTO public.auth_security_log (
            user_id, email, event_type, ip_address, user_agent, 
            success, risk_score, metadata
        ) VALUES (
            user_record.id, user_email, 'login_success', client_ip, user_agent_string,
            TRUE, risk_score, jsonb_build_object('timestamp', now())
        );
        
    ELSE
        -- Failed login attempt
        UPDATE public.account_security
        SET 
            failed_login_attempts = failed_login_attempts + 1,
            last_failed_login = now(),
            suspicious_activity_count = CASE 
                WHEN risk_score > 30 THEN suspicious_activity_count + 1 
                ELSE suspicious_activity_count 
            END,
            last_suspicious_activity = CASE 
                WHEN risk_score > 30 THEN now() 
                ELSE last_suspicious_activity 
            END,
            updated_at = now()
        WHERE user_id = user_record.id;
        
        -- Check if account should be locked
        IF security_record.failed_login_attempts + 1 >= max_attempts THEN
            UPDATE public.account_security
            SET 
                account_locked = TRUE,
                locked_until = now() + lockout_duration,
                lock_reason = 'Too many failed login attempts'
            WHERE user_id = user_record.id;
            
            account_locked := TRUE;
            
            -- Log account lockout
            INSERT INTO public.auth_security_log (
                user_id, email, event_type, ip_address, user_agent,
                success, failure_reason, risk_score, metadata
            ) VALUES (
                user_record.id, user_email, 'account_locked', client_ip, user_agent_string,
                FALSE, 'Account locked due to failed attempts', risk_score,
                jsonb_build_object('locked_until', now() + lockout_duration)
            );
        END IF;
        
        -- Log failed attempt
        INSERT INTO public.auth_security_log (
            user_id, email, event_type, ip_address, user_agent,
            success, failure_reason, risk_score, metadata
        ) VALUES (
            user_record.id, user_email, 'login_fail', client_ip, user_agent_string,
            FALSE, failure_reason_text, risk_score,
            jsonb_build_object('attempt_number', security_record.failed_login_attempts + 1)
        );
    END IF;
    
    -- Return result
    result := jsonb_build_object(
        'success', attempt_success,
        'account_locked', account_locked,
        'risk_score', risk_score,
        'failed_attempts', CASE WHEN attempt_success THEN 0 ELSE security_record.failed_login_attempts + 1 END
    );
    
    RETURN result;
END;
$$;

-- Create function to unlock account (for admins or after timeout)
CREATE OR REPLACE FUNCTION public.unlock_account(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if user can unlock (admin or self after timeout)
    IF NOT (public.is_admin() OR 
            (auth.uid() = target_user_id AND 
             EXISTS(SELECT 1 FROM public.account_security 
                   WHERE user_id = target_user_id 
                   AND locked_until < now()))) THEN
        RETURN FALSE;
    END IF;
    
    -- Unlock the account
    UPDATE public.account_security
    SET 
        account_locked = FALSE,
        locked_until = NULL,
        failed_login_attempts = 0,
        lock_reason = NULL,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    -- Log unlock event
    INSERT INTO public.auth_security_log (
        user_id, event_type, success, metadata
    ) VALUES (
        target_user_id, 'account_unlocked', TRUE,
        jsonb_build_object('unlocked_by', auth.uid(), 'timestamp', now())
    );
    
    RETURN TRUE;
END;
$$;

-- Create function to check if account is locked
CREATE OR REPLACE FUNCTION public.is_account_locked(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    is_locked BOOLEAN := FALSE;
    user_id_val UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id_val
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id_val IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check lock status
    SELECT 
        account_locked AND (locked_until IS NULL OR locked_until > now())
    INTO is_locked
    FROM public.account_security
    WHERE user_id = user_id_val;
    
    -- Auto-unlock if timeout has passed
    IF is_locked = FALSE THEN
        UPDATE public.account_security
        SET 
            account_locked = FALSE,
            locked_until = NULL,
            updated_at = now()
        WHERE user_id = user_id_val 
          AND account_locked = TRUE 
          AND locked_until IS NOT NULL 
          AND locked_until <= now();
    END IF;
    
    RETURN COALESCE(is_locked, FALSE);
END;
$$;

-- Create trigger to automatically create security record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.account_security (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;

-- Create trigger for new users (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created_security ON auth.users;
CREATE TRIGGER on_auth_user_created_security
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_security();

-- Create trigger for updated_at on account_security
CREATE TRIGGER update_account_security_updated_at
    BEFORE UPDATE ON public.account_security
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_security_log_user_time ON public.auth_security_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_security_log_ip_time ON public.auth_security_log(ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_security_log_event_time ON public.auth_security_log(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_account_security_user ON public.account_security(user_id);
CREATE INDEX IF NOT EXISTS idx_account_security_email ON public.account_security(email);
CREATE INDEX IF NOT EXISTS idx_account_security_locked ON public.account_security(account_locked, locked_until);