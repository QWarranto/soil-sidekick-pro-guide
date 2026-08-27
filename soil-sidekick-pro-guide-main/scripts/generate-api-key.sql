-- Generate a secure API key for QGIS/WFS integration
-- Run this in the Supabase SQL Editor
-- Replace <user-uuid> with the target user's auth.uid

DO $$
DECLARE
    plain_key TEXT := 'lk_' || encode(gen_random_bytes(32), 'base64');
    key_hash TEXT;
    target_user UUID := '<user-uuid>';  -- <-- REPLACE THIS
BEGIN
    key_hash := public.hash_api_key_secure(plain_key);

    INSERT INTO public.api_keys (
        user_id,
        key_name,
        key_hash,
        is_active,
        rate_limit,
        rate_window_minutes
    ) VALUES (
        target_user,
        'QGIS WFS Access',
        key_hash,
        true,
        10000,
        60
    );

    RAISE NOTICE '=================================================';
    RAISE NOTICE 'API KEY (save this — displayed only once):';
    RAISE NOTICE '%', plain_key;
    RAISE NOTICE '=================================================';
END $$;
