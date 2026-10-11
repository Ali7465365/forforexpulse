import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  isLoggedIn: boolean;
  signInWithOAuth: (provider: 'google' | 'github' | 'gitlab' | 'facebook' | 'twitter') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return localStorage.getItem('ffp_guest') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        setIsGuest(false);
        try {
          localStorage.removeItem('ffp_guest');
        } catch {
          /* ignore */
        }
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        setIsGuest(false);
        try {
          localStorage.removeItem('ffp_guest');
        } catch {
          /* ignore */
        }
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithOAuth = async (
    provider: 'google' | 'github' | 'gitlab' | 'facebook' | 'twitter'
  ) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message };
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    try {
      localStorage.setItem('ffp_guest', '1');
    } catch {
      /* ignore */
    }
  };

  const signOut = async () => {
    setIsGuest(false);
    try {
      localStorage.removeItem('ffp_guest');
    } catch {
      /* ignore */
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        isLoggedIn: !!user,
        signInWithOAuth,
        signInWithEmail,
        signUpWithEmail,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}