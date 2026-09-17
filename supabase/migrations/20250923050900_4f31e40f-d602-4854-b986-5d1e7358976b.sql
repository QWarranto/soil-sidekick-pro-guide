-- Add missing metadata column to comprehensive_audit_log table
ALTER TABLE public.comprehensive_audit_log 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Update the audit_sensitive_operations trigger function to use correct column names
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log any service role operations on sensitive tables
  IF auth.role() = 'service_role' THEN
    INSERT INTO public.comprehensive_audit_log (
      table_name,
      operation,
      old_values,
      new_values,
      risk_level,
      compliance_tags,
      user_id,
      metadata
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
      'HIGH',
      ARRAY['SERVICE_OPERATION', 'AUDIT_REQUIRED'],
      COALESCE(NEW.user_id, OLD.user_id),
      jsonb_build_object('timestamp', now(), 'trigger_name', TG_NAME)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;