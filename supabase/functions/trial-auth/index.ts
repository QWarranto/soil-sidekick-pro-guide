import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { logSafe, logError } from '../_shared/logging-utils.ts'
import { validateTrialAccess, generateTrialToken } from '../_shared/trial-validation.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, action } = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    switch (action) {
      case 'create_trial': {
        logSafe('Creating trial user', { email })
        
        // Create or update trial user
        const { data: trialUser, error: createError } = await supabase
          .rpc('create_trial_user', { trial_email: email })
        
        if (createError) {
          logError('create_trial_user RPC', createError)
          throw createError
        }

        // Validate the trial was created successfully
        const validation = await validateTrialAccess(
          email,
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        if (!validation.isValid) {
          throw new Error(validation.error || 'Trial validation failed')
        }

        // Generate secure session token instead of sending trial data
        const sessionToken = generateTrialToken(email)

        return new Response(
          JSON.stringify({
            success: true,
            sessionToken, // Client stores this instead of trial data
            trialEnd: validation.trialUser?.trial_end,
            message: 'Trial access granted for 10 days'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'verify_trial': {
        logSafe('Verifying trial user', { email })
        
        // Server-side validation - NEVER trust client data
        const validation = await validateTrialAccess(
          email,
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        if (!validation.isValid) {
          return new Response(
            JSON.stringify({
              success: false,
              message: validation.error || 'Trial has expired or is not valid'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401,
            }
          )
        }

        // Generate new session token
        const sessionToken = generateTrialToken(email)

        return new Response(
          JSON.stringify({
            success: true,
            sessionToken,
            trialEnd: validation.trialUser?.trial_end,
            accessCount: validation.trialUser?.access_count,
            message: 'Trial access verified'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    logError('trial-auth', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})