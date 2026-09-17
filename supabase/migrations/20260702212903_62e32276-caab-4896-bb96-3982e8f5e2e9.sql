INSERT INTO public.api_keys (user_id, key_name, key_hash, key_hash_v2, subscription_tier, daily_data_limit, is_active, permissions)
VALUES ('f6ee0550-14a6-44c4-b447-5124c7aed2c9', 'curl-validation-test', 'ak_test_curl_validation_2026', 'ak_test_curl_validation_2026', 'pro', 5000, true, '{"assets":true,"wfs":true}'::jsonb)
ON CONFLICT DO NOTHING;