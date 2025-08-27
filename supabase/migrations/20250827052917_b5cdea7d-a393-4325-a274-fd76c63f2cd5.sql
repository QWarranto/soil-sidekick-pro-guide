-- Add RLS to the subscribers_security_view and create policies for proper access control
-- First enable RLS on the view
ALTER VIEW public.subscribers_security_view SET (security_barrier = false);

-- Enable RLS on the view
ALTER TABLE public.subscribers_security_view ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own masked data
CREATE POLICY "Users can view their own masked subscription data" 
ON public.subscribers_security_view
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy: Admins can see all masked data
CREATE POLICY "Admins can view all masked subscription data" 
ON public.subscribers_security_view
FOR SELECT 
USING (is_admin());

-- Block all modifications since this is a read-only view
CREATE POLICY "Block all modifications to security view" 
ON public.subscribers_security_view
FOR ALL 
USING (false)
WITH CHECK (false);