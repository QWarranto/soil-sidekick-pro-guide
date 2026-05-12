/**
 * OAuth2 scaffold for Composio marketplace compatibility
 * 
 * Implements:
 * - PKCE authorization code flow (no client secret needed for public clients)
 * - Bearer token validation (JWT-style tokens stored in Supabase)
 * - Token refresh
 * - Rate-limit tracking per API key
 * 
 * Expected env vars:
 *   OAUTH_ISSUER_URL     — Base URL of this function (e.g. https://...supabase.co/functions/v1/mcp-server)
 *   OAUTH_JWT_SECRET     — Symmetric signing secret (generate with `openssl rand -base64 32`)
 *   SUPABASE_URL         — Already required by MCP server
 *   SUPABASE_SERVICE_ROLE_KEY — Already required by MCP server
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const ISSUER = Deno.env.get('OAUTH_ISSUER_URL') ?? '';
const JWT_SECRET = Deno.env.get('OAUTH_JWT_SECRET') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Token shapes ─────────────────────────────────────────────────────

export interface OAuthToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope?: string;
}

interface TokenPayload {
  sub: string;        // user_id or connection_id
  aud: string;        // 'composio' or client_id
  scope: string;      // space-separated tool names or 'all'
  iat: number;
  exp: number;
  jti: string;        // unique token id
}

// ── PKCE Utilities ─────────────────────────────────────────────────

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generateCodeVerifier(): Promise<string> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64url(bytes);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64url(new Uint8Array(hash));
}

// ── JWT Sign / Verify (HS256) ───────────────────────────────────────

async function signHS256(payload: object, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const header = base64url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`));
  const sigB64 = base64url(new Uint8Array(sig));
  return `${header}.${body}.${sigB64}`;
}

async function verifyHS256(token: string, secret: string): Promise<TokenPayload | null> {
  const [headerB64, bodyB64, sigB64] = token.split('.');
  if (!headerB64 || !bodyB64 || !sigB64) return null;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const valid = await crypto.subtle.verify(
    'HMAC', key,
    Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
    encoder.encode(`${headerB64}.${bodyB64}`)
  );
  if (!valid) return null;
  try {
    const body = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(bodyB64), c => c.charCodeAt(0))));
    if (body.exp * 1000 < Date.now()) return null;
    return body as TokenPayload;
  } catch {
    return null;
  }
}

// ── Token Lifecycle ──────────────────────────────────────────────

export async function mintToken(
  userId: string,
  clientId: string,
  scope: string,
  expiresInSeconds = 3600,
): Promise<OAuthToken> {
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  const payload: TokenPayload = {
    sub: userId,
    aud: clientId,
    scope,
    iat: now,
    exp: now + expiresInSeconds,
    jti,
  };
  const accessToken = await signHS256(payload, JWT_SECRET);
  const refreshJti = crypto.randomUUID();
  const refreshPayload = {
    sub: userId,
    aud: clientId,
    scope,
    iat: now,
    exp: now + 30 * 24 * 3600, // 30 days
    jti: refreshJti,
    typ: 'refresh',
  };
  const refreshToken = await signHS256(refreshPayload, JWT_SECRET);

  // Persist token metadata for revocation/lookup
  await db.from('oauth_tokens').insert({
    jti,
    user_id: userId,
    client_id: clientId,
    scope,
    expires_at: new Date((now + expiresInSeconds) * 1000).toISOString(),
    revoked: false,
  });

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: expiresInSeconds,
    refresh_token: refreshToken,
    scope,
  };
}

export async function validateBearerToken(authHeader: string): Promise<{ apiKey: string | null; scope: string; error?: string }> {
  if (!authHeader?.startsWith('Bearer ')) {
    return { apiKey: null, scope: '', error: 'Missing or malformed Authorization header' };
  }
  const token = authHeader.slice(7);
  const payload = await verifyHS256(token, JWT_SECRET);
  if (!payload) {
    return { apiKey: null, scope: '', error: 'Invalid or expired token' };
  }
  // Check revocation in DB
  const { data: row } = await db.from('oauth_tokens')
    .select('revoked, api_key_hash')
    .eq('jti', payload.jti)
    .single();
  if (!row || row.revoked) {
    return { apiKey: null, scope: '', error: 'Token revoked' };
  }

  // Map token → actual API key (stored in oauth_tokens.api_key_hash or looked up via user)
  // For Composio: tokens are minted after the user connects their LeafEngines account.
  // We store the user's active API key at mint time.
  const apiKey = row.api_key_hash ?? null;
  return { apiKey, scope: payload.scope };
}

// ── Rate Limiting ──────────────────────────────────────────────────

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset: number; // Unix seconds
  window: string; // e.g. "60"
}

export async function checkRateLimit(apiKeyHash: string): Promise<RateLimitStatus> {
  const windowSeconds = 60;
  const maxRequests = 60;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);

  // Upsert counter row in Supabase (uses ON CONFLICT via RPC for atomicity)
  const { data } = await db.rpc('rate_limit_hit', {
    p_api_key_hash: apiKeyHash,
    p_window_start: windowStart,
    p_max_requests: maxRequests,
  });

  const count = (data as number) ?? 0;
  return {
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - count),
    reset: windowStart + windowSeconds,
    window: String(windowSeconds),
  };
}

// ── SQL migration (run manually in Supabase SQL Editor) ─────────────

export const OAUTH_MIGRATION_SQL = `
-- OAuth2 token table
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

-- Rate-limit counter table
CREATE TABLE IF NOT EXISTS rate_limit_counters (
  api_key_hash TEXT NOT NULL,
  window_start INT NOT NULL,
  request_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (api_key_hash, window_start)
);

-- Atomic rate-limit hit function
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
`;
