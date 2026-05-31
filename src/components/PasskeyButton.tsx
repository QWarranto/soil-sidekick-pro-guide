import { useState } from 'react';
import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { KeyRound, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

type Mode = 'register' | 'authenticate';

interface Props {
  mode: Mode;
  email?: string;
  onSuccess?: () => void;
}

/**
 * Passwordless WebAuthn / Passkey button.
 * - mode="register": requires an authenticated user; enrolls a new passkey
 * - mode="authenticate": signs the user in via a passkey (optionally scoped by email)
 */
export const PasskeyButton = ({ mode, email: initialEmail, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail ?? '');

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { data: options, error: optErr } = await supabase.functions.invoke(
        'webauthn-register',
        { body: { step: 'options' } },
      );
      if (optErr) throw optErr;

      const attResp = await startRegistration({ optionsJSON: options });

      const { data: result, error: vErr } = await supabase.functions.invoke(
        'webauthn-register',
        { body: { step: 'verify', response: attResp } },
      );
      if (vErr) throw vErr;
      if (!result?.verified) throw new Error('Verification failed');

      toast.success('Passkey added');
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Could not register passkey');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    try {
      const { data: options, error: optErr } = await supabase.functions.invoke(
        'webauthn-authenticate',
        { body: { step: 'options', email } },
      );
      if (optErr) throw optErr;

      const authResp = await startAuthentication({ optionsJSON: options });

      const { data: result, error: vErr } = await supabase.functions.invoke(
        'webauthn-authenticate',
        { body: { step: 'verify', response: authResp } },
      );
      if (vErr) throw vErr;
      if (!result?.verified || !result?.token_hash) {
        throw new Error('Verification failed');
      }

      // Exchange the magiclink hashed token for a real Supabase session.
      const { error: otpErr } = await supabase.auth.verifyOtp({
        type: 'magiclink',
        token_hash: result.token_hash,
      });
      if (otpErr) throw otpErr;

      toast.success('Signed in with passkey');
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Passkey sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'register') {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleRegister}
        disabled={loading}
        className="w-full gap-2"
      >
        <KeyRound className="h-4 w-4" />
        {loading ? 'Adding passkey…' : 'Add a passkey'}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      {initialEmail === undefined && (
        <div className="space-y-1">
          <Label htmlFor="passkey-email">Email (optional)</Label>
          <Input
            id="passkey-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleAuthenticate}
        disabled={loading}
        className="w-full gap-2"
      >
        <Fingerprint className="h-4 w-4" />
        {loading ? 'Verifying…' : 'Sign in with a passkey'}
      </Button>
    </div>
  );
};

export default PasskeyButton;
