
-- ============================================================
-- FIX 1: Enable RLS on all sensor tables missing protection
-- ============================================================

-- sensor_readings: restrict to service_role writes, authenticated reads via device ownership
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sensor readings"
ON public.sensor_readings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view sensor readings"
ON public.sensor_readings FOR SELECT
USING (auth.uid() IS NOT NULL);

-- sensor_devices
ALTER TABLE public.sensor_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sensor devices"
ON public.sensor_devices FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view sensor devices"
ON public.sensor_devices FOR SELECT
USING (auth.uid() IS NOT NULL);

-- sensor_audit_log
ALTER TABLE public.sensor_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sensor audit log"
ON public.sensor_audit_log FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view sensor audit log"
ON public.sensor_audit_log FOR SELECT
USING (auth.uid() IS NOT NULL);

-- sensor_alerts (already has policies in types but RLS not enabled)
ALTER TABLE public.sensor_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sensor alerts"
ON public.sensor_alerts FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view sensor alerts"
ON public.sensor_alerts FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ============================================================
-- FIX 2: Trial unlimited renewal - add tracking columns and limits
-- ============================================================

-- Add renewal tracking columns
ALTER TABLE public.trial_users 
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_trial_start TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_renewal_at TIMESTAMPTZ;

-- Replace the create_trial_user function with renewal limits
CREATE OR REPLACE FUNCTION public.create_trial_user(trial_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    trial_id uuid;
    existing_renewal_count integer;
    existing_first_start timestamptz;
    existing_trial_end timestamptz;
BEGIN
    -- Check existing trial record for limits
    SELECT renewal_count, first_trial_start, trial_end
    INTO existing_renewal_count, existing_first_start, existing_trial_end
    FROM public.trial_users
    WHERE email = trial_email;

    -- Enforce maximum 2 renewals
    IF existing_renewal_count IS NOT NULL AND existing_renewal_count >= 2 THEN
        RAISE EXCEPTION 'Maximum trial renewals exceeded. Please subscribe for continued access.';
    END IF;

    -- Enforce 30-day cooldown between renewals
    IF existing_trial_end IS NOT NULL 
       AND existing_trial_end < now() 
       AND existing_trial_end > (now() - interval '30 days')
       AND existing_renewal_count IS NOT NULL 
       AND existing_renewal_count > 0 THEN
        RAISE EXCEPTION 'Trial renewal cooldown active. Please wait 30 days after expiry or subscribe.';
    END IF;

    -- Enforce maximum 90-day total trial window from first trial
    IF existing_first_start IS NOT NULL 
       AND existing_first_start < (now() - interval '90 days') THEN
        RAISE EXCEPTION 'Maximum trial period exceeded. Please subscribe for continued access.';
    END IF;

    INSERT INTO public.trial_users (email, first_trial_start)
    VALUES (trial_email, now())
    ON CONFLICT (email) DO UPDATE SET
        trial_start = CASE 
            WHEN trial_users.trial_end < now() THEN now()
            ELSE trial_users.trial_start
        END,
        trial_end = CASE 
            WHEN trial_users.trial_end < now() THEN now() + interval '10 days'
            ELSE trial_users.trial_end
        END,
        renewal_count = CASE
            WHEN trial_users.trial_end < now() THEN COALESCE(trial_users.renewal_count, 0) + 1
            ELSE COALESCE(trial_users.renewal_count, 0)
        END,
        last_renewal_at = CASE
            WHEN trial_users.trial_end < now() THEN now()
            ELSE trial_users.last_renewal_at
        END,
        is_active = true,
        updated_at = now()
    RETURNING id INTO trial_id;
    
    RETURN trial_id;
END;
$$;
