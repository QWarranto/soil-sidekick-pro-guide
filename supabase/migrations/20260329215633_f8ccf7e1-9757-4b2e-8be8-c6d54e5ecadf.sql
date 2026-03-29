-- Fix audit_subscriber_access to not reference non-existent 'email' column
CREATE OR REPLACE FUNCTION public.audit_subscriber_access()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        'SUBSCRIBER_' || TG_OP,
        COALESCE(auth.uid(), 
            CASE WHEN auth.role() = 'service_role' 
            THEN (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid 
            ELSE NULL END),
        jsonb_build_object(
            'operation', TG_OP,
            'table', 'subscribers',
            'record_id', COALESCE(NEW.id, OLD.id),
            'has_encrypted_email', COALESCE(NEW.encrypted_email, OLD.encrypted_email) IS NOT NULL,
            'auth_role', auth.role()
        ),
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Drop triggers that reference non-existent columns (email, stripe_customer_id)
DROP TRIGGER IF EXISTS prevent_plaintext_subscriber_data ON public.subscribers;
DROP TRIGGER IF EXISTS warn_plaintext_payment_data ON public.subscribers;
DROP FUNCTION IF EXISTS public.prevent_plaintext_payment_data();