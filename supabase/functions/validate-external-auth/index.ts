import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, email } = await req.json();

    // Validate the external auth token
    // This should match the token generation mechanism on SoilCertify.com
    const expectedSecret = Deno.env.get('SOILCERTIFY_SECRET');
    
    if (!expectedSecret) {
      throw new Error('External auth secret not configured');
    }

    // Simple token validation - you should implement your own secure mechanism
    // that matches what SoilCertify.com sends
    const isValidToken = token === expectedSecret || 
                        token === `${expectedSecret}-${email}`;

    if (!isValidToken) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a temporary session for this external user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create or get user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        source: 'soilcertify',
        external_auth: true
      }
    });

    if (userError && !userError.message.includes('already registered')) {
      throw userError;
    }

    // Generate a session token
    const userId = userData?.user?.id;
    if (!userId) {
      // User already exists, get their ID
      const { data: existingUser } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!existingUser) {
        throw new Error('Failed to create or retrieve user');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'External authentication validated',
        sessionToken: token
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('External auth validation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
