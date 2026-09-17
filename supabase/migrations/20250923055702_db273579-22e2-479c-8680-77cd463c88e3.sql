-- Make signup trigger idempotent to prevent duplicate key errors on account_security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure an account_security row exists for the new user (idempotent)
  INSERT INTO public.account_security (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO UPDATE
    SET updated_at = now();

  -- Ensure a profiles row exists/updates for the new user (idempotent)
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NULL
    )
  )
  ON CONFLICT (user_id) DO UPDATE
    SET email = COALESCE(EXCLUDED.email, public.profiles.email),
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        updated_at = now();

  RETURN NEW;
END;
$$;

-- Ensure the trigger exists on auth.users to call handle_new_user after signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END$$;