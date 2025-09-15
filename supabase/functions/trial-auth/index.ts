import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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
        console.log('Creating trial user for:', email)
        
        // Create or update trial user
        const { data: trialUser, error: createError } = await supabase
          .rpc('create_trial_user', { trial_email: email })
        
        if (createError) {
          console.error('Error creating trial user:', createError)
          throw createError
        }

        // Get trial user details
        const { data: trialData, error: fetchError } = await supabase
          .from('trial_users')
          .select('*')
          .eq('email', email)
          .single()

        if (fetchError) {
          console.error('Error fetching trial user:', fetchError)
          throw fetchError
        }

        return new Response(
          JSON.stringify({
            success: true,
            trialUser: trialData,
            message: 'Trial access granted for 10 days'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'verify_trial': {
        console.log('Verifying trial user:', email)
        
        // Check if trial is valid
        const { data: isValid, error: verifyError } = await supabase
          .rpc('is_trial_valid', { trial_email: email })
        
        if (verifyError) {
          console.error('Error verifying trial:', verifyError)
          throw verifyError
        }

        if (!isValid) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Trial has expired or is not valid'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401,
            }
          )
        }

        // Update access count
        const { error: updateError } = await supabase
          .rpc('update_trial_access', { trial_email: email })
        
        if (updateError) {
          console.error('Error updating trial access:', updateError)
          throw updateError
        }

        // Get updated trial data
        const { data: trialData, error: fetchError } = await supabase
          .from('trial_users')
          .select('*')
          .eq('email', email)
          .single()

        if (fetchError) {
          console.error('Error fetching trial data:', fetchError)
          throw fetchError
        }

        return new Response(
          JSON.stringify({
            success: true,
            trialUser: trialData,
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
    console.error('Trial auth error:', error)
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