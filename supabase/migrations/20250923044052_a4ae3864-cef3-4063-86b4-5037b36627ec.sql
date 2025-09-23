-- Fix the handle_new_user function to use correct column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  
  -- Insert into account_security table with encrypted email
  INSERT INTO public.account_security (
    user_id,
    encrypted_email
  ) VALUES (
    NEW.id,
    public.encrypt_email_address(NEW.email)
  );
  
  RETURN NEW;
END;
$$;