-- Drop old encryption functions that contain hardcoded plaintext keys.
-- The secure v3 replacements (encrypt_email_v3, decrypt_email_v3, encrypt_sensitive_data_v3, decrypt_sensitive_data_v3)
-- accept keys as explicit parameters and are already in use by edge functions.

-- 1. Drop v1 email encryption (hardcoded key: 'SoilSidekickEmailKey2024!')
DROP FUNCTION IF EXISTS public.encrypt_email_address(text);
DROP FUNCTION IF EXISTS public.decrypt_email_address(text);

-- 2. Drop v2 email encryption (hardcoded key: 'SoilSidekickEmailKeyV2-2025!Stronger')
DROP FUNCTION IF EXISTS public.encrypt_email_v2(text);

-- 3. Drop payment data encryption (hardcoded key: 'SoilSidekickPaymentSecurity2024!SecureKey')
DROP FUNCTION IF EXISTS public.decrypt_sensitive_payment_data(text);

-- 4. Drop bulk encryption utility (hardcoded key: 'SoilSidekickSecureKey2024!')
DROP FUNCTION IF EXISTS public.encrypt_existing_sensitive_data();