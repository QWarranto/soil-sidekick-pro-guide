-- ============================================================
-- Professional-Tier Test Account Setup for Carbon Credit Tests
-- A1 Urgent: Stable test account for authenticated success-path
-- ============================================================
-- 
-- INSTRUCTIONS:
-- 1. Create a test user in Supabase Auth dashboard:
--    Email: carbon-test@soilsidekick-internal.test
--    Password: (set a strong password, store in team vault)
--
-- 2. After user is created, get the user UUID from Auth > Users
--    and replace <TEST_USER_UUID> below.
--
-- 3. Run this SQL in Supabase SQL Editor to set up the profile.
-- ============================================================

-- Step 1: Ensure profile exists with professional tier
INSERT INTO public.profiles (
  user_id,
  email,
  full_name,
  subscription_tier,
  subscription_status,
  subscription_starts_at,
  subscription_ends_at
) VALUES (
  '<TEST_USER_UUID>'::uuid,
  'carbon-test@soilsidekick-internal.test',
  'Carbon Credit Test Account',
  'professional',
  'active',
  now(),
  now() + interval '1 year'
)
ON CONFLICT (user_id) DO UPDATE SET
  subscription_tier = 'professional',
  subscription_status = 'active',
  subscription_ends_at = now() + interval '1 year',
  updated_at = now();

-- Step 2: Verify the account
SELECT 
  user_id, 
  subscription_tier, 
  subscription_status, 
  subscription_ends_at 
FROM public.profiles 
WHERE email = 'carbon-test@soilsidekick-internal.test';
