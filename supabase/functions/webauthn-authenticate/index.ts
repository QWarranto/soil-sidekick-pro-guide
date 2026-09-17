// WebAuthn authentication: generate options + verify assertion, then issue a Supabase session
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from 'https://esm.sh/@simplewebauthn/server@10.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function rpIdFromOrigin(origin: string): string {
  try { return new URL(origin).hostname; } catch { return 'localhost'; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const origin = req.headers.get('origin') ?? req.headers.get('Origin') ?? '';
    const rpID = rpIdFromOrigin(origin);
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = await req.json().catch(() => ({}));
    const step = body.step as 'options' | 'verify';

    if (step === 'options') {
      const email = (body.email ?? '').toString().toLowerCase().trim();
      let allowCredentials: { id: string; transports?: AuthenticatorTransport[] }[] = [];
      let userId: string | null = null;

      if (email) {
        const { data: usersList } = await admin.auth.admin.listUsers();
        const u = usersList?.users?.find((x) => x.email?.toLowerCase() === email);
        if (u) {
          userId = u.id;
          const { data: keys } = await admin
            .from('user_passkeys')
            .select('credential_id, transports')
            .eq('user_id', u.id);
          allowCredentials = (keys ?? []).map((k) => ({
            id: k.credential_id,
            transports: (k.transports ?? undefined) as AuthenticatorTransport[] | undefined,
          }));
        }
      }

      const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials,
        userVerification: 'preferred',
      });

      await admin.from('webauthn_challenges').insert({
        user_id: userId,
        email: email || null,
        challenge: options.challenge,
        type: 'authentication',
      });

      return new Response(JSON.stringify(options), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (step === 'verify') {
      const { response } = body;
      const credentialId = response.id as string;

      const { data: passkey } = await admin
        .from('user_passkeys')
        .select('*')
        .eq('credential_id', credentialId)
        .maybeSingle();
      if (!passkey) {
        return new Response(JSON.stringify({ error: 'Unknown passkey' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: chRows } = await admin
        .from('webauthn_challenges')
        .select('*')
        .eq('type', 'authentication')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5);
      const challengeRow = chRows?.find((c) =>
        c.user_id === passkey.user_id || c.user_id === null
      );
      if (!challengeRow) {
        return new Response(JSON.stringify({ error: 'No challenge found' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: challengeRow.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: passkey.credential_id,
          publicKey: passkey.public_key,
          counter: Number(passkey.counter),
          transports: (passkey.transports ?? undefined) as AuthenticatorTransport[] | undefined,
        },
      });

      if (!verification.verified) {
        return new Response(JSON.stringify({ error: 'Verification failed' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await admin.from('user_passkeys').update({
        counter: verification.authenticationInfo.newCounter,
        last_used_at: new Date().toISOString(),
      }).eq('id', passkey.id);

      await admin.from('webauthn_challenges').delete().eq('id', challengeRow.id);

      // Issue a Supabase session via a magiclink hashed token the client exchanges immediately.
      const { data: userData } = await admin.auth.admin.getUserById(passkey.user_id);
      const email = userData?.user?.email;
      if (!email) {
        return new Response(JSON.stringify({ error: 'User has no email' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });
      if (linkErr || !link) {
        return new Response(JSON.stringify({ error: linkErr?.message ?? 'Could not issue session' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        verified: true,
        email,
        token_hash: link.properties.hashed_token,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid step' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('webauthn-authenticate error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
