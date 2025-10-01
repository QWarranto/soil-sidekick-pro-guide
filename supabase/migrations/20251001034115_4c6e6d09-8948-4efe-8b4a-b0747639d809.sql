-- Fix search_path for all database functions to prevent security vulnerabilities

-- Fix generate_recurring_tasks function
DROP FUNCTION IF EXISTS public.generate_recurring_tasks();
CREATE OR REPLACE FUNCTION public.generate_recurring_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- This function can be called periodically to create new task instances
  -- from recurring task templates for the upcoming season/year
  INSERT INTO public.user_tasks (
    user_id,
    field_id,
    task_name,
    category,
    description,
    status,
    priority,
    is_recurring,
    recurrence_pattern,
    recurrence_config,
    parent_task_id,
    crops_involved,
    created_from_template_id
  )
  SELECT 
    ut.user_id,
    ut.field_id,
    ut.task_name,
    ut.category,
    ut.description,
    'pending'::task_status,
    ut.priority,
    ut.is_recurring,
    ut.recurrence_pattern,
    ut.recurrence_config,
    ut.id, -- link back to parent
    ut.crops_involved,
    ut.created_from_template_id
  FROM public.user_tasks ut
  WHERE ut.is_recurring = true
    AND ut.status = 'completed'
    AND ut.recurrence_pattern = 'annual'
    -- Only generate if no pending task exists for next year
    AND NOT EXISTS (
      SELECT 1 FROM public.user_tasks ut2
      WHERE ut2.parent_task_id = ut.id
        AND ut2.status = 'pending'
        AND ut2.scheduled_date > now()
    );
END;
$function$;

-- Fix cleanup_rate_limit_tracking function
DROP FUNCTION IF EXISTS public.cleanup_rate_limit_tracking();
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.rate_limit_tracking 
  WHERE window_end < now() - interval '24 hours';
END;
$function$;

-- Fix sanitize_email_for_audit function
DROP FUNCTION IF EXISTS public.sanitize_email_for_audit(text);
CREATE OR REPLACE FUNCTION public.sanitize_email_for_audit(email_address text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Return masked email for audit logs (keep domain for debugging)
    IF email_address IS NULL OR email_address = '' THEN
        RETURN NULL;
    END IF;
    
    -- Extract parts of the email
    DECLARE
        at_position integer;
        local_part text;
        domain_part text;
    BEGIN
        at_position := position('@' in email_address);
        
        IF at_position = 0 THEN
            -- No @ symbol, just mask the middle
            RETURN substring(email_address from 1 for 3) || '***';
        END IF;
        
        local_part := substring(email_address from 1 for at_position - 1);
        domain_part := substring(email_address from at_position);
        
        -- Mask the local part but keep the domain
        IF length(local_part) <= 3 THEN
            RETURN '***' || domain_part;
        ELSE
            RETURN substring(local_part from 1 for 3) || '***' || domain_part;
        END IF;
    END;
END;
$function$;

-- Add audit log
INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
) VALUES (
    'SECURITY_POLICY_UPDATE',
    NULL,
    jsonb_build_object(
        'change', 'Fixed search_path parameter for database functions',
        'reason', 'Prevent search path manipulation attacks',
        'functions_updated', ARRAY['generate_recurring_tasks', 'cleanup_rate_limit_tracking', 'sanitize_email_for_audit'],
        'timestamp', now()
    )
);