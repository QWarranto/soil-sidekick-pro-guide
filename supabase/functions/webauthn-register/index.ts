// WebAuthn registration: generate options + verify response
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from 'https://esm.sh/@simplewebauthn/server@10.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const RP_NAME = 'SoilSidekick Pro';

function rpIdFromOrigin(origin: string): string {
  try {
    return new URL(origin).hostname;
  } catch {
    return 'localhost';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const origin = req.headers.get('origin') ?? req.headers.get('Origin') ?? '';
    const rpID = rpIdFromOrigin(origin);

    // Identify user from JWT
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = await req.json().catch(() => ({}));
    const step = body.step as 'options' | 'verify';

    if (step === 'options') {
      const { data: existing } = await admin
        .from('user_passkeys')
        .select('credential_id, transports')
        .eq('user_id', user.id);

      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID,
        userID: new TextEncoder().encode(user.id),
        userName: user.email ?? user.id,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
        excludeCredentials: (existing ?? []).map((c) => ({
          id: c.credential_id,
          transports: c.transports as AuthenticatorTransport[] | undefined,
        })),
      });

      await admin.from('webauthn_challenges').insert({
        user_id: user.id,
        challenge: options.challenge,
        type: 'registration',
      });

      return new Response(JSON.stringify(options), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (step === 'verify') {
      const { response, nickname } = body;

      const { data: chRows } = await admin
        .from('webauthn_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'registration')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
      const challengeRow = chRows?.[0];
      if (!challengeRow) {
        return new Response(JSON.stringify({ error: 'No challenge found' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challengeRow.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });

      if (!verification.verified || !verification.registrationInfo) {
        return new Response(JSON.stringify({ error: 'Verification failed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { credential, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      await admin.from('user_passkeys').insert({
        user_id: user.id,
        credential_id: credential.id,
        public_key: credential.publicKey,
        counter: credential.counter,
        device_type: credentialDeviceType,
        backed_up: credentialBackedUp,
        transports: response.response?.transports ?? null,
        nickname: nickname ?? null,
      });

      await admin.from('webauthn_challenges').delete().eq('id', challengeRow.id);

      return new Response(JSON.stringify({ verified: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid step' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('webauthn-register error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
