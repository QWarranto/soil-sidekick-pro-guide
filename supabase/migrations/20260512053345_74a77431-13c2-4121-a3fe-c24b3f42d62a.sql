-- OAuth2 token table
CREATE TABLE IF NOT EXISTS public.oauth_tokens (
  jti UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'all',
  api_key_hash TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user ON public.oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_expires ON public.oauth_tokens(expires_at) WHERE NOT revoked;

ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own oauth tokens"
  ON public.oauth_tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Rate-limit counter table (service-role only; no public access)
CREATE TABLE IF NOT EXISTS public.rate_limit_counters (
  api_key_hash TEXT NOT NULL,
  window_start INT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (api_key_hash, window_start)
);
ALTER TABLE public.rate_limit_counters ENABLE ROW LEVEL SECURITY;

-- Atomic rate-limit hit RPC
CREATE OR REPLACE FUNCTION public.rate_limit_hit(
  p_api_key_hash TEXT,
  p_window_start INT,
  p_max_requests INT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO public.rate_limit_counters (api_key_hash, window_start, request_count)
  VALUES (p_api_key_hash, p_window_start, 1)
  ON CONFLICT (api_key_hash, window_start)
  DO UPDATE SET request_count = public.rate_limit_counters.request_count + 1
  RETURNING request_count INTO v_count;
  RETURN v_count;
END;
$$;