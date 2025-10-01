-- Fix RLS policies on visual_analysis_results to require authentication
DROP POLICY IF EXISTS "Users can delete their own visual analysis results" ON public.visual_analysis_results;
DROP POLICY IF EXISTS "Users can update their own visual analysis results" ON public.visual_analysis_results;
DROP POLICY IF EXISTS "Users can view their own visual analysis results" ON public.visual_analysis_results;

-- Create properly restricted policies
CREATE POLICY "Authenticated users can delete their own visual analysis results"
ON public.visual_analysis_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own visual analysis results"
ON public.visual_analysis_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own visual analysis results"
ON public.visual_analysis_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Add audit log
INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
) VALUES (
    'SECURITY_POLICY_UPDATE',
    NULL,
    jsonb_build_object(
        'table', 'visual_analysis_results',
        'change', 'Updated RLS policies to properly restrict anonymous access',
        'reason', 'Fix anonymous access vulnerability',
        'timestamp', now()
    )
);