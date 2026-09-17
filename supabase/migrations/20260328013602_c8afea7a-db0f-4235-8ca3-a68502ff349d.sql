-- Drop both broken triggers that reference handle_new_user_security
DROP TRIGGER IF EXISTS on_auth_user_created_security ON auth.users;
DROP TRIGGER IF EXISTS create_security_on_signup ON auth.users;

-- Now drop the broken function
DROP FUNCTION IF EXISTS public.handle_new_user_security();