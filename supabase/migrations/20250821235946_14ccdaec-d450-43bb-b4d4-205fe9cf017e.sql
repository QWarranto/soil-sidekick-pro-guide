-- Create trigger to automatically create profiles for new users
CREATE OR REPLACE TRIGGER create_profile_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create the security trigger for account_security table
CREATE OR REPLACE TRIGGER create_security_on_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_security();