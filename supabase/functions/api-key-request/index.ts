/**
 * API Key Request Edge Function
 * Handles tiered API key automation:
 * - Instant sandbox keys for free tier
 * - Approval queue for paid tiers (starter, pro, enterprise)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await supabase.auth.getUser(token);
    if (claimsError || !claims.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claims.user.id;
    const userEmail = claims.user.email;
    const method = req.method;

    if (method === 'GET') {
      // Get user's API keys and pending requests
      const [keysResult, requestsResult] = await Promise.all([
        supabase
          .from('api_keys')
          .select('id, key_name, subscription_tier, rate_limit, is_active, created_at, last_used_at, permissions')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('api_key_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ]);

      return new Response(
        JSON.stringify({
          apiKeys: keysResult.data || [],
          pendingRequests: requestsResult.data || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      const body = await req.json();
      const { action, tier, companyName, useCase, expectedVolume, keyName } = body;

      // Action: Generate instant sandbox key
      if (action === 'generate_sandbox') {
        // Check if user already has a sandbox key
        const { data: existingKeys } = await supabase
          .from('api_keys')
          .select('id')
          .eq('user_id', userId)
          .eq('subscription_tier', 'free')
          .limit(1);

        if (existingKeys && existingKeys.length > 0) {
          return new Response(
            JSON.stringify({ error: 'You already have a sandbox API key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate sandbox key
        const apiKey = 'ak_sandbox_' + generateSecureKey(24);
        const keyHash = await hashKey(apiKey);

        const { data: newKey, error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: userId,
            key_name: keyName || 'Sandbox API Key',
            key_hash: keyHash,
            subscription_tier: 'free',
            rate_limit: 100, // 100 requests/hour
            rate_window_minutes: 60,
            permissions: { endpoints: ['sandbox-demo', 'get-soil-data'], sandbox_only: true }
          })
          .select('id, key_name, subscription_tier, rate_limit, created_at')
          .single();

        if (insertError) {
          throw insertError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            apiKey: {
              ...newKey,
              key: apiKey, // Only shown once!
            },
            message: 'Sandbox API key generated successfully. Save this key - it will not be shown again!'
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Action: Request paid tier key (requires approval)
      if (action === 'request_upgrade') {
        const validTiers = ['starter', 'pro', 'enterprise'];
        if (!validTiers.includes(tier)) {
          return new Response(
            JSON.stringify({ error: 'Invalid tier. Must be starter, pro, or enterprise' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check for existing pending request
        const { data: existingRequest } = await supabase
          .from('api_key_requests')
          .select('id')
          .eq('user_id', userId)
          .eq('requested_tier', tier)
          .eq('request_status', 'pending')
          .limit(1);

        if (existingRequest && existingRequest.length > 0) {
          return new Response(
            JSON.stringify({ error: 'You already have a pending request for this tier' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create request
        const { data: request, error: requestError } = await supabase
          .from('api_key_requests')
          .insert({
            user_id: userId,
            requested_tier: tier,
            company_name: companyName || null,
            use_case: useCase || null,
            expected_volume: expectedVolume || null
          })
          .select()
          .single();

        if (requestError) {
          throw requestError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            request,
            message: `Your ${tier} tier API key request has been submitted for review. We'll notify you once approved.`
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API key request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSecureKey(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, b => chars[b % chars.length]).join('');
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
