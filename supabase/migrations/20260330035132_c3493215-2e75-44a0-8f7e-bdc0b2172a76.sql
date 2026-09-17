INSERT INTO public.api_keys (user_id, key_name, key_hash, subscription_tier, rate_limit, rate_window_minutes, permissions, is_active)
VALUES (
  '36aa8617-6848-4878-a10c-cfe105b717c2',
  'SDK QA Developer Key',
  '63ab2e84917db050cd9125497460928a9c3ac2d74409a4606ee7cf1b5df84244',
  'free',
  100,
  60,
  '{"endpoints": ["sandbox-demo", "get-soil-data", "county-lookup", "agricultural-intelligence"], "sandbox_only": true}'::jsonb,
  true
);