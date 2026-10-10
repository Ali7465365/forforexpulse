import { X, Check, Crown, Zap, Lock } from 'lucide-react';
import { usePro } from '@/context/ProContext';

type AdModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    definition: 'Basic trade map, limited product research, and 100 API requests per day.',
    features: ['Trade Map', 'Basic Product Research', '100 API req/day'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$10',
    period: '/month',
    definition: 'Full product research, store & factory cards with contacts, PRO trade signals, and 1,000 API requests per day.',
    features: ['All Free features', 'Full store & factory cards', 'PRO trade signals', '1,000 API req/day'],
    highlight: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '$25',
    period: '/month',
    definition: 'Everything in Pro plus 100,000+ API requests per day, multiple API keys, and priority support.',
    features: ['Everything in Pro', '100,000+ API req/day', 'Multiple API keys', 'Priority support'],
  },
];

export default function AdModal({ isOpen, onClose }: AdModalProps) {
  const { isPro, timeRemaining } = usePro();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Plans</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 transition hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isPro ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600">
                <Crown className="h-7 w-7 text-slate-950" />
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">PRO is active</h3>
              {timeRemaining && (
                <p className="text-sm text-amber-300/80">
                  {timeRemaining.days}d {timeRemaining.hours}h remaining
                </p>
              )}
              <button
                onClick={onClose}
                className="mt-5 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <p className="mb-5 text-center text-sm text-slate-400">
                Choose a plan. Price and what you get — nothing else.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-5 ${
                      plan.highlight
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {plan.id === 'platinum' ? (
                        <Zap className="h-4 w-4 text-amber-400" />
                      ) : plan.id === 'pro' ? (
                        <Crown className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-sm font-bold text-white">{plan.name}</span>
                    </div>

                    <div className="mb-2 text-2xl font-bold text-white">
                      {plan.price}
                      {plan.period && (
                        <span className="text-xs font-normal text-slate-500">{plan.period}</span>
                      )}
                    </div>

                    <p className="mb-4 text-xs leading-relaxed text-slate-400">
                      {plan.definition}
                    </p>

                    <ul className="space-y-1.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-[11px] text-slate-500">
                Payments (EasyPaisa / Stripe / PayPal) can be connected later.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}