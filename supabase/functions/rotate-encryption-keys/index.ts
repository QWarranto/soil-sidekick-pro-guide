/**
 * One-time key rotation edge function
 * Re-encrypts v2 subscriber data with the new APP_ENCRYPTION_KEY
 * Requires admin authentication
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', claimsData.claims.sub)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newKey = Deno.env.get('APP_ENCRYPTION_KEY');
    if (!newKey) {
      return new Response(JSON.stringify({ error: 'APP_ENCRYPTION_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Old compromised keys from git history
    const oldKeys = [
      'SoilSidekickSecureKey2024!',
      'SoilSidekickEmailKeyV2-2025!Stronger',
      'SoilSidekickEmailKey2024!',
      'SoilSidekickPaymentSecurity2024!SecureKey',
    ];

    // Find v2 encrypted subscribers
    const { data: subscribers, error: fetchErr } = await supabaseAdmin
      .from('subscribers')
      .select('id, encrypted_email, encrypted_stripe_customer_id, encryption_version')
      .lt('encryption_version', 3)
      .not('encrypted_email', 'is', null);

    if (fetchErr) throw fetchErr;

    let reEncrypted = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const sub of subscribers || []) {
      try {
        let decryptedEmail: string | null = null;
        let decryptedStripe: string | null = null;

        // Try decrypting with each old key
        for (const oldKey of oldKeys) {
          if (sub.encrypted_email && !decryptedEmail) {
            const { data } = await supabaseAdmin.rpc('decrypt_email_v3', {
              encrypted_email: sub.encrypted_email,
              encryption_key: oldKey,
            });
            if (data) decryptedEmail = data;
          }
          if (sub.encrypted_stripe_customer_id && !decryptedStripe) {
            const { data } = await supabaseAdmin.rpc('decrypt_sensitive_data_v3', {
              encrypted_data: sub.encrypted_stripe_customer_id,
              encryption_key: oldKey,
            });
            if (data) decryptedStripe = data;
          }
        }

        // Re-encrypt with new key
        const updates: Record<string, unknown> = { encryption_version: 3 };

        if (decryptedEmail) {
          const { data: newEnc } = await supabaseAdmin.rpc('encrypt_email_v3', {
            email_to_encrypt: decryptedEmail,
            encryption_key: newKey,
          });
          if (newEnc) updates.encrypted_email = newEnc;
        }

        if (decryptedStripe) {
          const { data: newEnc } = await supabaseAdmin.rpc('encrypt_sensitive_data_v3', {
            data_to_encrypt: decryptedStripe,
            encryption_key: newKey,
          });
          if (newEnc) updates.encrypted_stripe_customer_id = newEnc;
        }

        const { error: updateErr } = await supabaseAdmin
          .from('subscribers')
          .update(updates)
          .eq('id', sub.id);

        if (updateErr) throw updateErr;
        reEncrypted++;
      } catch (e) {
        failed++;
        errors.push(`${sub.id}: ${e.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Key rotation complete',
        total: subscribers?.length || 0,
        re_encrypted: reEncrypted,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
