-- ============================================
-- POST-QC SECURITY SPRINT: Dec 23-24, 2025
-- SEC-1.x and SEC-2.x Implementation
-- ============================================

-- Enable pgcrypto extension for digest function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- SEC-1.1: Trial Users Email Hashing
ALTER TABLE public.trial_users 
ADD COLUMN IF NOT EXISTS email_hash TEXT;

-- Create secure email hash function
CREATE OR REPLACE FUNCTION public.hash_email(email_to_hash TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    salt TEXT := 'SoilSidekickTrialSalt2024!';
BEGIN
    RETURN encode(digest(lower(email_to_hash) || salt, 'sha256'), 'hex');
END;
$$;

-- SEC-1.2: Rate Limit Email/IP Separation
ALTER TABLE public.trial_creation_rate_limit
ADD COLUMN IF NOT EXISTS email_hash TEXT;

-- SEC-2.2: API Key Hash Strengthening
ALTER TABLE public.api_keys
ADD COLUMN IF NOT EXISTS key_hash_v2 TEXT;

-- SEC-2.3: Anonymous Feedback Rate Limiting
ALTER TABLE public.user_feedback
ADD COLUMN IF NOT EXISTS client_ip INET;

-- SEC-2.4: Update session expiration to 30 minutes
ALTER TABLE public.county_search_sessions
ALTER COLUMN expires_at SET DEFAULT now() + interval '30 minutes';

-- Create index for email_hash lookups
CREATE INDEX IF NOT EXISTS idx_trial_users_email_hash ON public.trial_users(email_hash);
CREATE INDEX IF NOT EXISTS idx_rate_limit_email_hash ON public.trial_creation_rate_limit(email_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash_v2 ON public.api_keys(key_hash_v2);