-- Fix the security definer view issue and run data migration

-- Fix the security definer view by removing the setting
DROP VIEW IF EXISTS public.subscribers_security_view;
CREATE VIEW public.subscribers_security_view AS
SELECT 
    id,
    user_id,
    '***@***' as masked_email,
    CASE WHEN encrypted_stripe_customer_id IS NOT NULL THEN 'cus_***encrypted***' ELSE NULL END as masked_stripe_id,
    subscribed,
    subscription_tier,
    subscription_interval,
    subscription_end,
    encryption_version,
    created_at,
    updated_at
FROM public.subscribers;

-- Grant select on security view to authenticated users
GRANT SELECT ON public.subscribers_security_view TO authenticated;

-- Run the data migration to encrypt existing plaintext data
SELECT public.migrate_subscriber_data_to_encrypted();