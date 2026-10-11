import { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
};

export default function LoginModal({ isOpen, onClose, reason }: Props) {
  const {
    signInWithOAuth,
    signInWithEmail,
    signUpWithEmail,
    continueAsGuest,
    loading,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res =
      mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    onClose();
  }

  function handleGuest() {
    continueAsGuest();
    onClose();
  }

  const providers: { id: 'google' | 'github' | 'gitlab' | 'facebook' | 'twitter'; label: string }[] = [
    { id: 'google', label: 'Google' },
    { id: 'github', label: 'GitHub' },
    { id: 'gitlab', label: 'GitLab' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'X' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Sign in</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {reason && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              {reason}
            </p>
          )}

          <div className="grid grid-cols-1 gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                disabled={loading || busy}
                onClick={() => signInWithOAuth(p.id)}
                className="rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-750"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-700" />
            or email
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <form onSubmit={handleEmail} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6)"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {mode === 'signin' ? 'Sign in with email' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full text-center text-xs text-slate-400 hover:text-emerald-400"
          >
            {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="w-full rounded-lg border border-dashed border-slate-600 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-400 hover:text-white"
          >
            Skip for now (guest)
          </button>
          <p className="text-center text-[10px] text-slate-500">
            Guests can browse. You must sign in to buy Pro or Platinum.
          </p>
        </div>
      </div>
    </div>
  );
}