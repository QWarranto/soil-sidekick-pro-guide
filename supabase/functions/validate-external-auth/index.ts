/**
 * Validate External Auth Function - Migrated to requestHandler
 * Updated: December 4, 2025 - Phase 2B.3 QC Migration
 * 
 * Validates external authentication tokens from partner systems (e.g., SoilCertify.com)
 * with:
 * - Input validation via Zod schema
 * - Rate limiting (prevents brute force attacks)
 * - Security event logging for auth attempts
 * - Partner token validation
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { externalAuthSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';
import { logSecurityEvent } from '../_shared/security-utils.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

requestHandler({
  // No auth required - this endpoint validates tokens before establishing auth
  requireAuth: false,
  
  // Validation schema
  validationSchema: externalAuthSchema,
  
  // Rate limiting: 10 requests per minute per IP (strict for auth endpoint)
  rateLimit: {
    requests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Use service role for user creation
  useServiceRole: true,
  
  handler: async (ctx) => {
    const { token, email, provider, metadata } = ctx.validatedData;
    
    logSafe('External auth validation request', { email, provider });

    // Get the expected secret for the provider
    const secretEnvKey = `${provider.toUpperCase()}_SECRET`;
    const expectedSecret = Deno.env.get(secretEnvKey) || Deno.env.get('SOILCERTIFY_SECRET');
    
    if (!expectedSecret) {
      logError('External auth config', new Error(`Secret not configured for provider: ${provider}`));
      
      // Log security event for missing config
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_config_error',
        severity: 'high',
        details: { provider, error: 'Secret not configured' },
      }, ctx.req);
      
      throw new Error('External auth secret not configured');
    }

    // Validate the token
    // Support multiple validation patterns:
    // 1. Direct secret match
    // 2. Secret + email combination
    // 3. HMAC signature (future enhancement)
    const isValidToken = 
      token === expectedSecret || 
      token === `${expectedSecret}-${email}`;

    if (!isValidToken) {
      logSafe('External auth token validation failed', { email, provider });
      
      // Log security event for failed auth attempt
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_failure',
        severity: 'medium',
        details: { 
          email, 
          provider,
          reason: 'Invalid token',
        },
      }, ctx.req);
      
      return {
        success: false,
        error: 'Invalid authentication token',
      };
    }

    // Token validated - create or get user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let userId: string | undefined;

    try {
      // Attempt to create user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          source: provider,
          external_auth: true,
          ...metadata,
        },
      });

      if (userError && !userError.message.includes('already registered')) {
        throw userError;
      }

      userId = userData?.user?.id;

      if (!userId) {
        // User already exists - get their ID
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (!listError && users) {
          const existingUser = users.find(u => u.email === email);
          userId = existingUser?.id;
        }
      }

      if (!userId) {
        throw new Error('Failed to create or retrieve user');
      }

      // Log successful external auth
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_success',
        severity: 'low',
        user_id: userId,
        details: { 
          email, 
          provider,
        },
      }, ctx.req);

      // Track for analytics
      await supabaseAdmin.from('cost_tracking').insert({
        service_provider: 'supabase',
        service_type: 'external_auth',
        feature_name: 'validate-external-auth',
        usage_count: 1,
        cost_usd: 0,
        request_details: { provider, email_domain: email.split('@')[1] },
      }).catch(() => {}); // Non-blocking

      logSafe('External auth validated successfully', { email, provider, userId });

      return {
        message: 'External authentication validated',
        userId,
        sessionToken: token, // Client can use this for subsequent requests
      };

    } catch (error) {
      logError('External auth user creation', error);
      
      await logSecurityEvent(ctx.supabaseClient, {
        event_type: 'external_auth_error',
        severity: 'high',
        details: { 
          email, 
          provider,
          error: error.message,
        },
      }, ctx.req);
      
      throw new Error('Failed to process external authentication');
    }
  },
});
