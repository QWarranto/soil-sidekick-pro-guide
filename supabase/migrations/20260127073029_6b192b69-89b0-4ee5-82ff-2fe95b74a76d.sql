-- Create API key requests table for approval workflow
CREATE TABLE public.api_key_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    requested_tier TEXT NOT NULL DEFAULT 'starter',
    request_status TEXT NOT NULL DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
    company_name TEXT,
    use_case TEXT,
    expected_volume TEXT,
    admin_notes TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own API key requests"
ON public.api_key_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create requests
CREATE POLICY "Users can create API key requests"
ON public.api_key_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all API key requests"
ON public.api_key_requests
FOR SELECT
USING (public.is_admin());

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update API key requests"
ON public.api_key_requests
FOR UPDATE
USING (public.is_admin());

-- Create index for faster lookups
CREATE INDEX idx_api_key_requests_user_id ON public.api_key_requests(user_id);
CREATE INDEX idx_api_key_requests_status ON public.api_key_requests(request_status);

-- Create function to auto-generate sandbox API key on signup
CREATE OR REPLACE FUNCTION public.auto_create_sandbox_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    api_key TEXT;
    key_hash TEXT;
BEGIN
    -- Generate a sandbox API key for new users
    api_key := 'ak_sandbox_' || encode(gen_random_bytes(24), 'hex');
    key_hash := encode(digest(api_key, 'sha256'), 'hex');
    
    -- Insert the sandbox key
    INSERT INTO public.api_keys (
        user_id,
        key_name,
        key_hash,
        subscription_tier,
        rate_limit,
        rate_window_minutes,
        permissions
    ) VALUES (
        NEW.user_id,
        'Sandbox API Key (Auto-generated)',
        key_hash,
        'free',
        100,  -- 100 requests per hour for sandbox
        60,
        '{"endpoints": ["sandbox-demo", "get-soil-data"], "sandbox_only": true}'::jsonb
    );
    
    -- Store the actual key temporarily for user to retrieve (will be shown once)
    -- This uses the profiles table since we need to show it to the user
    UPDATE public.profiles
    SET updated_at = now()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

-- Create trigger to auto-generate sandbox key when profile is created
DROP TRIGGER IF EXISTS trigger_auto_create_sandbox_api_key ON public.profiles;
CREATE TRIGGER trigger_auto_create_sandbox_api_key
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_sandbox_api_key();

-- Add updated_at trigger for api_key_requests
CREATE TRIGGER update_api_key_requests_updated_at
BEFORE UPDATE ON public.api_key_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();