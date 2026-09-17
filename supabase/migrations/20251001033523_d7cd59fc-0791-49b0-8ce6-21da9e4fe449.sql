-- Drop the public read policy on counties table
DROP POLICY IF EXISTS "Counties are publicly readable" ON public.counties;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view counties"
ON public.counties
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Add audit logging for this security change
INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
) VALUES (
    'SECURITY_POLICY_UPDATE',
    NULL,
    jsonb_build_object(
        'table', 'counties',
        'change', 'Restricted public access to authenticated users only',
        'reason', 'Prevent competitor data scraping',
        'timestamp', now()
    )
);