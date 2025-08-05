-- Fix function search path security warning

-- Update the is_service_role function to set search_path
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
BEGIN
  -- This function can be enhanced to verify service-level authentication
  -- For now, it returns true for service operations
  RETURN true;
END;
$$;