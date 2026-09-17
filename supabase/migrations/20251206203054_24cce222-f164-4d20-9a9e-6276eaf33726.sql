INSERT INTO public.user_roles (user_id, role)
VALUES ('36aa8617-6848-4878-a10c-cfe105b717c2', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;