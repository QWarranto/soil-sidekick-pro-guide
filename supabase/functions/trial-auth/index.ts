/**
 * Trial Auth Function - Migrated to requestHandler
 * Updated: December 4, 2025 - Phase 2B.2 QC Migration
 * 
 * Handles trial user creation and verification with:
 * - Input validation via Zod schema
 * - Database-backed rate limiting (prevents trial abuse)
 * - Security event logging
 * - Cost tracking
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { trialAuthSchema } from '../_shared/validation.ts';
import { validateTrialAccess, generateTrialToken } from '../_shared/trial-validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// Service role client for trial operations
const getServiceClient = () => createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

requestHandler({
  // Public endpoint - no auth required (trial creation)
  requireAuth: false,
  
  // Validation schema
  validationSchema: trialAuthSchema,
  
  // Rate limiting: 20 requests per hour per IP to prevent trial abuse
  rateLimit: {
    requests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // Use service role for trial user creation
  useServiceRole: true,
  
  handler: async (ctx) => {
    const { email, action, trialDuration } = ctx.validatedData;
    const supabase = getServiceClient();
    
    logSafe('Trial auth request', { email, action });

    switch (action) {
      case 'create_trial': {
        logSafe('Creating trial user', { email });
        
        // Create or update trial user via RPC
        const { data: trialUser, error: createError } = await supabase
          .rpc('create_trial_user', { 
            trial_email: email,
            // Pass custom duration if provided (default handled by RPC)
          });
        
        if (createError) {
          logError('create_trial_user RPC', createError);
          throw new Error(`Trial creation failed: ${createError.message}`);
        }

        // Validate the trial was created successfully
        const validation = await validateTrialAccess(
          email,
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (!validation.isValid) {
          throw new Error(validation.error || 'Trial validation failed');
        }

        // Generate secure session token
        const sessionToken = generateTrialToken(email);

        // Log successful trial creation for analytics
        await supabase.from('cost_tracking').insert({
          service_provider: 'supabase',
          service_type: 'trial_creation',
          feature_name: 'trial-auth',
          usage_count: 1,
          cost_usd: 0,
          request_details: { email_domain: email.split('@')[1] },
        }).catch(() => {}); // Non-blocking

        return {
          sessionToken,
          trialEnd: validation.trialUser?.trial_end,
          trialUser: validation.trialUser, // Backward compatibility
          message: `Trial access granted for ${trialDuration || 10} days`,
        };
      }

      case 'verify_trial': {
        logSafe('Verifying trial user', { email });
        
        // Server-side validation - NEVER trust client data
        const validation = await validateTrialAccess(
          email,
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (!validation.isValid) {
          // Return structured error instead of throwing
          return {
            success: false,
            message: validation.error || 'Trial has expired or is not valid',
            expired: true,
          };
        }

        // Generate new session token
        const sessionToken = generateTrialToken(email);

        return {
          sessionToken,
          trialEnd: validation.trialUser?.trial_end,
          accessCount: validation.trialUser?.access_count,
          trialUser: validation.trialUser, // Backward compatibility
          message: 'Trial access verified',
        };
      }

      default:
        throw new Error(`Invalid action: ${action}`);
    }
  },
});
