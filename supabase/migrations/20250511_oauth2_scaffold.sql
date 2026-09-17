CREATE TABLE IF NOT EXISTS oauth_tokens (
  jti UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'all',
  api_key_hash TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_oauth_tokens_user ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_expires ON oauth_tokens(expires_at) WHERE NOT revoked;

CREATE TABLE IF NOT EXISTS rate_limit_counters (
  api_key_hash TEXT NOT NULL,
  window_start INT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (api_key_hash, window_start)
);

CREATE OR REPLACE FUNCTION rate_limit_hit(
  p_api_key_hash TEXT,
  p_window_start INT,
  p_max_requests INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO rate_limit_counters (api_key_hash, window_start, request_count)
  VALUES (p_api_key_hash, p_window_start, 1)
  ON CONFLICT (api_key_hash, window_start)
  DO UPDATE SET request_count = rate_limit_counters.request_count + 1
  RETURNING request_count INTO v_count;
  RETURN v_count;
END;
$$;
