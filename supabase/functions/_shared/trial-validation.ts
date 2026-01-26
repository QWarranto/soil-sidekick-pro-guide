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
 * Generates a secure, server-signed trial session token
 * This token is cryptographically signed and cannot be forged
 */
export async function generateSecureTrialToken(
  email: string,
  trialEnd: string
): Promise<string> {
  const timestamp = Date.now();
  const expiresAt = new Date(trialEnd).getTime();
  
  // Create payload with email hash (not raw email) + expiry + timestamp
  const encoder = new TextEncoder();
  const emailHash = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(email.toLowerCase())
  );
  const emailHashHex = Array.from(new Uint8Array(emailHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Create signature using server-side secret
  const secret = Deno.env.get('TRIAL_TOKEN_SECRET') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const payload = `${emailHashHex}:${expiresAt}:${timestamp}`;
  
  const signatureData = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(payload + secret)
  );
  const signature = Array.from(new Uint8Array(signatureData))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 32);
  
  // Token format: base64(emailHash:expiresAt:timestamp:signature)
  const token = btoa(`${emailHashHex}:${expiresAt}:${timestamp}:${signature}`);
  return `trial_${token}`;
}

/**
 * Validates a server-signed trial session token
 * Returns true only if token is valid and not expired
 */
export async function validateSecureTrialToken(
  email: string,
  token: string
): Promise<{ isValid: boolean; expired: boolean }> {
  try {
    if (!token.startsWith('trial_')) {
      return { isValid: false, expired: false };
    }
    
    const encoded = token.substring(6); // Remove 'trial_' prefix
    const decoded = atob(encoded);
    const parts = decoded.split(':');
    
    if (parts.length !== 4) {
      return { isValid: false, expired: false };
    }
    
    const [tokenEmailHash, expiresAtStr, timestampStr, providedSignature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    const timestamp = parseInt(timestampStr, 10);
    
    // Check expiry
    if (Date.now() > expiresAt) {
      return { isValid: false, expired: true };
    }
    
    // Verify email hash matches
    const encoder = new TextEncoder();
    const emailHash = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(email.toLowerCase())
    );
    const expectedEmailHash = Array.from(new Uint8Array(emailHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    if (tokenEmailHash !== expectedEmailHash) {
      return { isValid: false, expired: false };
    }
    
    // Verify signature
    const secret = Deno.env.get('TRIAL_TOKEN_SECRET') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const payload = `${tokenEmailHash}:${expiresAtStr}:${timestampStr}`;
    
    const signatureData = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(payload + secret)
    );
    const expectedSignature = Array.from(new Uint8Array(signatureData))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
    
    if (providedSignature !== expectedSignature) {
      return { isValid: false, expired: false };
    }
    
    return { isValid: true, expired: false };
  } catch (error) {
    console.error('Token validation error:', error);
    return { isValid: false, expired: false };
  }
}
