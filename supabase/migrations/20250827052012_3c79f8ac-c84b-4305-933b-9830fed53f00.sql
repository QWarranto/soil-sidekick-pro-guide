-- Fix security vulnerability: Add RLS policies to subscribers_security_view
-- This view contains masked customer data but has no access restrictions

-- Enable RLS on the subscribers_security_view
ALTER TABLE public.subscribers_security_view ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only view their own masked subscription data
CREATE POLICY "Users can view their own masked subscription data" 
ON public.subscribers_security_view
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Admins can view all masked subscription data for administrative purposes
CREATE POLICY "Admins can view all masked subscription data" 
ON public.subscribers_security_view
FOR SELECT 
USING (is_admin());

-- Policy 3: Service role can access for system operations (monitoring, compliance)
CREATE POLICY "Service role can access masked subscription data" 
ON public.subscribers_security_view
FOR SELECT 
USING (auth.role() = 'service_role'::text);

-- Block all other operations (INSERT, UPDATE, DELETE) as this should be a read-only view
CREATE POLICY "Block modifications to security view" 
ON public.subscribers_security_view
FOR ALL 
USING (false)
WITH CHECK (false);