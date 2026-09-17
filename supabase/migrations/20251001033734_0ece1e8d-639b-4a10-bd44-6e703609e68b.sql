-- Drop the public read policy on seasonal_task_templates table
DROP POLICY IF EXISTS "Task templates are viewable by everyone" ON public.seasonal_task_templates;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view task templates"
ON public.seasonal_task_templates
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
        'table', 'seasonal_task_templates',
        'change', 'Restricted public access to authenticated users only',
        'reason', 'Protect agricultural IP from competitor theft',
        'timestamp', now()
    )
);