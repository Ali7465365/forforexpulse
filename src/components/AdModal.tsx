import { useState, useEffect } from 'react';
import { X, Check, Crown, Zap, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { usePro } from '@/context/ProContext';
import { useAuth } from '@/context/AuthContext';

type PlanId = 'pro' | 'platinum';
type PayMethod = 'easypaisa' | 'stripe' | 'paypal';

type AdModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** After login, jump straight to pay step for this plan */
  pendingPlan?: PlanId | null;
  onPendingPlanConsumed?: () => void;
  /** Guest clicked Purchase — parent opens login */
  onRequireLogin: (planId: PlanId) => void;
};

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 'Free',
    priceNum: 0,
    definition: 'Basic trade map, limited product research, and 100 API requests per day.',
    features: ['Trade Map', 'Basic Product Research', '100 API req/day', 'Business Advisor'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$10',
    priceNum: 10,
    period: '/month',
    definition:
      'Full product research, store & factory cards with contacts, PRO trade signals, and 1,000 API requests per day.',
    features: [
      'All Free features',
      'Full store & factory cards + contacts',
      'PRO trade signals',
      '1,000 API req/day',
    ],
    highlight: true,
  },
  {
    id: 'platinum' as const,
    name: 'Platinum',
    price: '$25',
    priceNum: 25,
    period: '/month',
    definition:
      'Everything in Pro plus 100,000+ API requests per day, multiple API keys, and priority support.',
    features: [
      'Everything in Pro',
      '100,000+ API req/day',
      'Multiple API keys',
      'Priority support',
    ],
  },
];

const PAY_METHODS: { id: PayMethod; label: string; desc: string }[] = [
  { id: 'easypaisa', label: 'EasyPaisa', desc: 'Pakistan mobile wallet' },
  { id: 'paypal', label: 'PayPal', desc: 'PayPal balance or linked card' },
  { id: 'stripe', label: 'Stripe', desc: 'Visa, Mastercard & cards' },
];

export default function AdModal({
  isOpen,
  onClose,
  pendingPlan = null,
  onPendingPlanConsumed,
  onRequireLogin,
}: AdModalProps) {
  const { isPro, timeRemaining } = usePro();
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState<'plans' | 'pay'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);

  // After login with a pending plan → go to payment step
  useEffect(() => {
    if (isOpen && isLoggedIn && pendingPlan) {
      setSelectedPlan(pendingPlan);
      setPayMethod(null);
      setStep('pay');
      onPendingPlanConsumed?.();
    }
  }, [isOpen, isLoggedIn, pendingPlan, onPendingPlanConsumed]);

  // Reset when fully closed
  useEffect(() => {
    if (!isOpen) {
      setStep('plans');
      setSelectedPlan(null);
      setPayMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plan = PLANS.find((p) => p.id === selectedPlan);

  function startPurchase(planId: PlanId) {
    // Guest can see plans but must login to buy
    if (!isLoggedIn) {
      onRequireLogin(planId);
      return;
    }
    setSelectedPlan(planId);
    setPayMethod(null);
    setStep('pay');
  }

  function handleClose() {
    setStep('plans');
    setSelectedPlan(null);
    setPayMethod(null);
    onClose();
  }

  function handlePay() {
    if (!plan || !payMethod) return;
    alert(
      `Selected: ${plan.name} ($${plan.priceNum}/month)\nPayment: ${PAY_METHODS.find((m) => m.id === payMethod)?.label}\n\nConnect EasyPaisa / PayPal / Stripe keys for real checkout.`
    );
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            {step === 'pay' ? (
              <button
                onClick={() => setStep('plans')}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Crown className="h-5 w-5 text-amber-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {step === 'pay' ? `Pay for ${plan?.name}` : 'Plans'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-slate-400 transition hover:text-white">
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
                onClick={handleClose}
                className="mt-5 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Continue
              </button>
            </div>
          ) : step === 'plans' ? (
            <>
              <p className="mb-2 text-center text-sm text-slate-400">
                Compare plans — price and what you get.
              </p>
              {!isLoggedIn && (
                <p className="mb-4 text-center text-xs text-amber-400/90">
                  Guest: you can view all plans. Sign in is required only when you click Purchase.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {PLANS.map((p) => (
                  <div
                    key={p.id}
                    className={`flex flex-col rounded-xl border p-5 ${
                      p.highlight
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {p.id === 'platinum' ? (
                        <Zap className="h-4 w-4 text-amber-400" />
                      ) : p.id === 'pro' ? (
                        <Crown className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-sm font-bold text-white">{p.name}</span>
                    </div>

                    <div className="mb-2 text-2xl font-bold text-white">
                      {p.price}
                      {p.period && (
                        <span className="text-xs font-normal text-slate-500">{p.period}</span>
                      )}
                    </div>

                    <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-400">
                      {p.definition}
                    </p>

                    <ul className="mb-4 space-y-1.5">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {p.id === 'free' ? (
                      <button
                        disabled
                        className="w-full rounded-lg bg-slate-800 py-2.5 text-xs font-semibold text-slate-500"
                      >
                        Current plan
                      </button>
                    ) : (
                      <button
                        onClick={() => startPurchase(p.id)}
                        className={`w-full rounded-lg py-2.5 text-xs font-bold text-white transition ${
                          p.id === 'pro'
                            ? 'bg-emerald-500 hover:bg-emerald-400'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110'
                        }`}
                      >
                        Purchase {p.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mb-1 text-sm text-slate-400">
                {plan?.name} · <span className="font-semibold text-white">{plan?.price}</span>
                {plan?.period}
              </p>
              <p className="mb-5 text-xs text-slate-500">Select one payment method</p>

              <div className="mb-5 space-y-2">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      payMethod === m.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard
                      className={`h-5 w-5 ${payMethod === m.id ? 'text-emerald-400' : 'text-slate-400'}`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">{m.label}</div>
                      <div className="text-xs text-slate-500">{m.desc}</div>
                    </div>
                    {payMethod === m.id && <Check className="ml-auto h-4 w-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!payMethod}
                onClick={handlePay}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                Pay {plan?.price}
                {plan?.period}
              </button>
              <p className="mt-3 text-center text-[10px] text-slate-500">
                EasyPaisa · PayPal · Stripe only
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}