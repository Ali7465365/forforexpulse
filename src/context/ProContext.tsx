import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type ProPass, getOrCreateProPass, isProActive, getProTimeRemaining } from '@/lib/proAccess';

// Re-export so consumers can import from this module
export type { ProPass };

type ProContextValue = {
  proPass: ProPass | null;
  isPro: boolean;
  timeRemaining: { days: number; hours: number } | null;
  refresh: () => Promise<void>;
  setProPass: (pass: ProPass) => void;
};

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const [proPass, setProPassState] = useState<ProPass | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number } | null>(null);

  const refresh = async () => {
    try {
      const pass = await getOrCreateProPass();
      setProPassState(pass);
      setIsPro(isProActive(pass));
      setTimeRemaining(getProTimeRemaining(pass));
    } catch {
      // ignore — will retry
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const setProPass = (pass: ProPass) => {
    setProPassState(pass);
    setIsPro(isProActive(pass));
    setTimeRemaining(getProTimeRemaining(pass));
  };

  return (
    <ProContext.Provider value={{ proPass, isPro, timeRemaining, refresh, setProPass }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within ProProvider');
  return ctx;
}
