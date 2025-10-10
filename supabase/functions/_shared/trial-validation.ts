/**
 * Server-side trial validation utilities
 * NEVER trust client-side trial data
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface TrialValidationResult {
  isValid: boolean;
  trialUser?: {
    id: string;
    email: string;
    trial_start: string;
    trial_end: string;
    access_count: number;
  };
  error?: string;
}

/**
 * Validates trial access server-side
 * This MUST be called in edge functions before granting trial access
 */
export async function validateTrialAccess(
  email: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<TrialValidationResult> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Check if trial is valid using RPC (secure)
  const { data: isValid, error: rpcError } = await supabase
    .rpc('is_trial_valid', { trial_email: email });

  console.log('is_trial_valid result:', { isValid, error: rpcError });

  if (rpcError) {
    console.error('Trial validation RPC error:', rpcError);
    return { isValid: false, error: `Validation failed: ${rpcError.message}` };
  }

  if (!isValid) {
    return { isValid: false, error: 'Trial expired or not found' };
  }

  // Update access count
  await supabase.rpc('update_trial_access', { trial_email: email });

  // Get trial user details
  const { data: trialUser, error: fetchError } = await supabase
    .from('trial_users')
    .select('id, email, trial_start, trial_end, access_count')
    .eq('email', email)
    .single();

  if (fetchError || !trialUser) {
    return { isValid: false, error: 'Trial user not found' };
  }

  return {
    isValid: true,
    trialUser: {
      id: trialUser.id,
      email: trialUser.email,
      trial_start: trialUser.trial_start,
      trial_end: trialUser.trial_end,
      access_count: trialUser.access_count,
    },
  };
}

/**
 * Generates a secure trial session token
 * Store this in localStorage instead of trial data
 */
export function generateTrialToken(email: string): string {
  const timestamp = Date.now();
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomHex = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
  
  // Simple token format: email hash + timestamp + random
  const encoder = new TextEncoder();
  const data = encoder.encode(email + timestamp);
  
  return `trial_${randomHex}_${timestamp}`;
}
