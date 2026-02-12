/**
 * Validate External Auth Function - Hardened with HMAC
 * Updated: February 2026 - Security Sprint
 * 
 * Validates external authentication tokens from partner systems (e.g., SoilCertify.com)
 * with:
 * - HMAC signature validation (replaces simple secret comparison)
 * - Timestamp + nonce anti-replay protection
 * - Email verification required (no auto-confirm)
 * - Input validation via Zod schema
 * - Rate limiting (prevents brute force attacks)
 * - Security event logging for auth attempts
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { externalAuthSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';
import { logSecurityEvent } from '../_shared/security-utils.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// HMAC signature verification
async function verifyHmacSignature(
  secret: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const expectedHex = Array.from(new Uint8Array(expectedSig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedHex.length) return false;
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

// Used nonce tracking (in-memory, resets on cold start - acceptable for edge)
const usedNonces = new Map<string, number>();
const NONCE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function cleanExpiredNonces() {
  const now = Date.now();
  for (const [nonce, timestamp] of usedNonces) {
    if (now - timestamp > NONCE_EXPIRY_MS) {
      usedNonces.delete(nonce);
    }
  }
}

requestHandler({
  requireAuth: false,
  validationSchema: externalAuthSchema,
  rateLimit: {
    requests: 10,
    windowMs: 60 * 1000,
  },
  useServiceRole: true,

  handler: async (ctx) => {
    const { token, email, provider, metadata } = ctx.validatedData;
    
    logSafe('External auth validation request', { email, provider });

    // Get the expected secret for the provider
    const secretEnvKey = `${provider.toUpperCase()}_SECRET`;
    const expectedSecret = Deno.env.get(secretEnvKey) || Deno.env.get('SOILCERTIFY_SECRET');
    
    if (!expectedSecret) {
      logError('External auth config', new Error(`Secret not configured for provider: ${provider}`));
      
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_config_error',
        severity: 'high',
        details: { provider, error: 'Secret not configured' },
      }, ctx.req);
      
      throw new Error('External auth secret not configured');
    }

    // --- HMAC Signature Validation ---
    // Token format: "hmac:<timestamp>:<nonce>:<signature>"
    // Legacy format: plain secret string (still supported with deprecation warning)
    let isValidToken = false;
    let isLegacyToken = false;

    if (token.startsWith('hmac:')) {
      const parts = token.split(':');
      if (parts.length !== 4) {
        await logSecurityEvent(ctx.supabaseClient, {
          event_type: 'external_auth_failure',
          severity: 'medium',
          details: { email, provider, reason: 'Malformed HMAC token' },
        }, ctx.req);
        return { success: false, error: 'Malformed authentication token' };
      }

      const [, timestampStr, nonce, signature] = parts;
      const timestamp = parseInt(timestampStr, 10);

      // Validate timestamp (5 minute window)
      const tokenAge = Date.now() - timestamp;
      if (isNaN(timestamp) || tokenAge > 5 * 60 * 1000 || tokenAge < -30000) {
        await logSecurityEvent(ctx.supabaseClient, {
          event_type: 'external_auth_failure',
          severity: 'medium',
          details: { email, provider, reason: 'Token expired or future-dated' },
        }, ctx.req);
        return { success: false, error: 'Token expired' };
      }

      // Anti-replay: check nonce
      cleanExpiredNonces();
      if (usedNonces.has(nonce)) {
        await logSecurityEvent(ctx.supabaseClient, {
          event_type: 'external_auth_failure',
          severity: 'high',
          details: { email, provider, reason: 'Nonce replay detected' },
        }, ctx.req);
        return { success: false, error: 'Token already used' };
      }

      // Verify HMAC signature
      const message = `${email}:${timestampStr}:${nonce}`;
      isValidToken = await verifyHmacSignature(expectedSecret, message, signature);

      if (isValidToken) {
        usedNonces.set(nonce, Date.now());
      }
    } else {
      // Legacy validation (deprecated - log warning)
      isValidToken = token === expectedSecret || token === `${expectedSecret}-${email}`;
      isLegacyToken = isValidToken;

      if (isLegacyToken) {
        logSafe('DEPRECATION WARNING: Legacy token format used', { provider });
        await logSecurityEvent(ctx.supabaseClient, {
          event_type: 'external_auth_legacy_token',
          severity: 'medium',
          details: { email, provider, warning: 'Legacy plain-text token format. Migrate to HMAC.' },
        }, ctx.req);
      }
    }

    if (!isValidToken) {
      logSafe('External auth token validation failed', { email, provider });
      
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_failure',
        severity: 'medium',
        details: { email, provider, reason: 'Invalid token' },
      }, ctx.req);
      
      return { success: false, error: 'Invalid authentication token' };
    }

    // Token validated - create or get user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let userId: string | undefined;

    try {
      // Check if user already exists first
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!listError && users) {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          // User exists - verify provider matches or is compatible
          const existingSource = existingUser.user_metadata?.source;
          if (existingSource && existingSource !== provider) {
            await logSecurityEvent(ctx.supabaseClient, {
              event_type: 'external_auth_provider_mismatch',
              severity: 'high',
              details: { email, provider, existing_provider: existingSource },
            }, ctx.req);
            return {
              success: false,
              error: 'Email already registered with a different provider',
            };
          }
          userId = existingUser.id;
        }
      }

      if (!userId) {
        // Create new user - DO NOT auto-confirm email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: false, // Require email verification
          user_metadata: {
            source: provider,
            external_auth: true,
            pending_verification: true,
            ...(metadata || {}),
          },
        });

        if (userError) {
          throw userError;
        }

        userId = userData?.user?.id;

        if (!userId) {
          throw new Error('Failed to create user');
        }

        // Send verification email
        await supabaseAdmin.auth.resend({
          type: 'signup',
          email: email,
        }).catch((err: Error) => {
          logError('Failed to send verification email', err);
        });
      }

      // Log successful external auth
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_success',
        severity: 'low',
        user_id: userId,
        details: { email, provider, hmac: !isLegacyToken },
      }, ctx.req);

      // Track for analytics
      await supabaseAdmin.from('cost_tracking').insert({
        service_provider: 'supabase',
        service_type: 'external_auth',
        feature_name: 'validate-external-auth',
        usage_count: 1,
        cost_usd: 0,
        request_details: { provider, email_domain: email.split('@')[1] },
      }).catch(() => {});

      logSafe('External auth validated successfully', { email, provider, userId });

      return {
        message: 'External authentication validated',
        userId,
        emailVerified: !!(await supabaseAdmin.auth.admin.getUserById(userId))
          .data?.user?.email_confirmed_at,
        ...(isLegacyToken ? { warning: 'Legacy token format deprecated. Migrate to HMAC signatures.' } : {}),
      };

    } catch (error) {
      logError('External auth user creation', error);
      
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_error',
        severity: 'high',
        details: { email, provider, error: error.message },
      }, ctx.req);
      
      throw new Error('Failed to process external authentication');
    }
  },
});
