import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '@/utils/emailValidation';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_interval?: string;
  subscription_end?: string;
}

interface TrialUser {
  id: string;
  email: string;
  trial_start: string;
  trial_end: string;
  is_active: boolean;
  access_count: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscriptionData: SubscriptionData | null;
  trialUser: TrialUser | null;
  refreshSubscription: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signInWithLinkedIn: () => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  signInWithTrial: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [trialUser, setTrialUser] = useState<TrialUser | null>(null);
  const { toast } = useToast();

  const refreshSubscription = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check subscription when user logs in
        if (session?.user) {
          setTimeout(() => {
            refreshSubscription();
          }, 0);
        } else {
          setSubscriptionData(null);
        }
        
        // Clear trial user when regular user logs in
        if (session?.user) {
          setTrialUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          refreshSubscription();
        }, 0);
      }
      
      // Check for trial user in localStorage
      const savedTrialUser = localStorage.getItem('trialUser');
      if (savedTrialUser && !session?.user) {
        try {
          const trialData = JSON.parse(savedTrialUser);
          if (new Date(trialData.trial_end) > new Date()) {
            setTrialUser(trialData);
          } else {
            localStorage.removeItem('trialUser');
          }
        } catch (error) {
          localStorage.removeItem('trialUser');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Send sign-in notification email
        setTimeout(async () => {
          try {
            await supabase.functions.invoke('send-signin-notification', {
              body: { 
                email,
                timestamp: new Date().toLocaleString(),
                ipAddress: window.location.hostname,
                userAgent: navigator.userAgent
              }
            });
          } catch (emailError) {
            console.error('Failed to send sign-in notification:', emailError);
          }
        }, 0);
        
        toast({
          title: "Sign in successful!",
          description: "Check your email for a sign-in confirmation.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validate email before attempting signup
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        toast({
          title: "Invalid email address",
          description: emailValidation.error,
          variant: "destructive",
        });
        return { error: { message: emailValidation.error } };
      }
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined,
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful!",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithTrial = async (email: string) => {
    try {
      // Validate email before creating trial
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        toast({
          title: "Invalid email address",
          description: emailValidation.error,
          variant: "destructive",
        });
        return { error: { message: emailValidation.error } };
      }

      const { data, error } = await supabase.functions.invoke('trial-auth', {
        body: { email, action: 'create_trial' }
      });

      console.log('Trial auth response:', { data, error });

      if (error) {
        toast({
          title: "Trial access failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        return { error };
      }

      if (data?.success && data?.trialUser) {
        setTrialUser(data.trialUser);
        localStorage.setItem('trialUser', JSON.stringify(data.trialUser));
        toast({
          title: "Trial access granted!",
          description: `You have 10-day trial access. Please check your email to verify your account for full access.`,
        });
        return { error: null };
      } else {
        const errorMsg = data?.error || data?.message || "Trial creation failed";
        toast({
          title: "Trial access failed",
          description: errorMsg,
          variant: "destructive",
        });
        return { error: new Error(errorMsg) };
      }
    } catch (error: any) {
      console.error('Trial auth error:', error);
      toast({
        title: "Trial access failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
    // Clear trial user data
    setTrialUser(null);
    localStorage.removeItem('trialUser');
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent!",
          description: "Check your email for a password reset link.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google OAuth with redirect:', `${window.location.origin}/`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth?provider=google`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      console.log('Google OAuth response:', { data, error });
      
      if (error) {
        console.error('Google OAuth error:', error);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Google OAuth catch error:', error);
      toast({
        title: "Google sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithApple = async () => {
    try {
      console.log('Starting Apple OAuth with redirect:', `${window.location.origin}/`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth?provider=apple`,
          scopes: 'name email'
        }
      });
      
      console.log('Apple OAuth response:', { data, error });
      
      if (error) {
        console.error('Apple OAuth error:', error);
        toast({
          title: "Apple sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Apple OAuth catch error:', error);
      toast({
        title: "Apple sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      console.log('Starting LinkedIn OAuth with redirect:', `${window.location.origin}/`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth?provider=linkedin`,
          scopes: 'openid profile email'
        }
      });
      
      console.log('LinkedIn OAuth response:', { data, error });
      
      if (error) {
        console.error('LinkedIn OAuth error:', error);
        toast({
          title: "LinkedIn sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('LinkedIn OAuth catch error:', error);
      toast({
        title: "LinkedIn sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log('Starting Facebook OAuth with redirect:', `${window.location.origin}/`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth?provider=facebook`,
          scopes: 'email'
        }
      });
      
      console.log('Facebook OAuth response:', { data, error });
      
      if (error) {
        console.error('Facebook OAuth error:', error);
        toast({
          title: "Facebook sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Facebook OAuth catch error:', error);
      toast({
        title: "Facebook sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const formatToE164 = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it starts with 1 and has 11 digits, add +
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    // If it has 10 digits, assume US number and add +1
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    
    // If it already starts with +, return as is (after removing non-digits except +)
    if (phone.startsWith('+')) {
      return `+${digits}`;
    }
    
    // Default: add + if not present
    return phone.startsWith('+') ? phone : `+${digits}`;
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const formattedPhone = formatToE164(phone);
      console.log('Original phone:', phone, 'Formatted:', formattedPhone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        toast({
          title: "Phone sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP sent!",
          description: "Check your phone for the verification code.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Phone sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const formattedPhone = formatToE164(phone);
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms'
      });
      
      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Phone verified successfully!",
          description: "You are now signed in.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated successfully!",
          description: "Your password has been changed.",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    subscriptionData,
    trialUser,
    refreshSubscription,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signInWithLinkedIn,
    signInWithFacebook,
    signInWithPhone,
    verifyOtp,
    signInWithTrial,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}