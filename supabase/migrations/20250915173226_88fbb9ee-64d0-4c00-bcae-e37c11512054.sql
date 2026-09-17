-- Create trial_users table for 10-day email-only access
CREATE TABLE public.trial_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  trial_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 days'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_access TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_users ENABLE ROW LEVEL SECURITY;

-- Create policies for trial users
CREATE POLICY "Trial users can view their own record" 
ON public.trial_users 
FOR SELECT 
USING (email = current_setting('trial.email', true));

CREATE POLICY "Service role can manage trial users" 
ON public.trial_users 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update trial user access
CREATE OR REPLACE FUNCTION public.update_trial_access(trial_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.trial_users 
    SET 
        access_count = access_count + 1,
        last_access = now(),
        updated_at = now()
    WHERE email = trial_email 
      AND is_active = true 
      AND trial_end > now();
    
    RETURN FOUND;
END;
$$;

-- Create function to create trial user
CREATE OR REPLACE FUNCTION public.create_trial_user(trial_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    trial_id uuid;
BEGIN
    INSERT INTO public.trial_users (email)
    VALUES (trial_email)
    ON CONFLICT (email) DO UPDATE SET
        trial_start = CASE 
            WHEN trial_users.trial_end < now() THEN now()
            ELSE trial_users.trial_start
        END,
        trial_end = CASE 
            WHEN trial_users.trial_end < now() THEN now() + interval '10 days'
            ELSE trial_users.trial_end
        END,
        is_active = true,
        updated_at = now()
    RETURNING id INTO trial_id;
    
    RETURN trial_id;
END;
$$;

-- Create function to check trial validity
CREATE OR REPLACE FUNCTION public.is_trial_valid(trial_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    is_valid boolean := false;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.trial_users 
        WHERE email = trial_email 
          AND is_active = true 
          AND trial_end > now()
    ) INTO is_valid;
    
    RETURN is_valid;
END;
$$;