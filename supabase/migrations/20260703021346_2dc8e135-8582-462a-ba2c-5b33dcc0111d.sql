
-- Helper function (standard pattern)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS on api_keys (existing policies will now be enforced)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- model_benchmark_results: enable RLS + admin-only read
ALTER TABLE public.model_benchmark_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read benchmark results" ON public.model_benchmark_results;
CREATE POLICY "Admins can read benchmark results"
  ON public.model_benchmark_results
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- vendor_leads: admin SELECT policy (service_role ALL policy already exists)
DROP POLICY IF EXISTS "Admins can read vendor leads" ON public.vendor_leads;
CREATE POLICY "Admins can read vendor leads"
  ON public.vendor_leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Storage: remove permissive anon INSERT on telegram-uploads; service_role policy remains
DROP POLICY IF EXISTS "telegram_webhook_upload" ON storage.objects;
