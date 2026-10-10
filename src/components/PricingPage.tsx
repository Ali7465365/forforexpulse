import { useState } from 'react';
import {
  Check, Crown, Zap, CreditCard, Store, MapPin, Phone,
  Key, Lock, Sparkles, X
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

type PlanId = 'free' | 'pro' | 'platinum';
type PayMethod = 'easypaisa' | 'stripe' | 'paypal' | null;

const PLANS = [
  {
    id: 'free' as PlanId,
    name: 'Free',
    price: 0,
    tagline: 'Get started',
    color: 'slate',
    features: [
      'Trade Map access',
      'Product Research (basic)',
      'Intelligence dashboard (limited)',
      '100 API requests / day',
      'Community support',
    ],
    apiLimit: '100 / day',
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    price: 10,
    tagline: 'For serious traders',
    color: 'emerald',
    popular: true,
    features: [
      'Everything in Free',
      'All PRO trade signals unlocked',
      'Full Product Research + city data',
      'Store cards with local prices',
      '1,000 API requests / day',
      'Priority email support',
    ],
    apiLimit: '1,000 / day',
  },
  {
    id: 'platinum' as PlanId,
    name: 'Platinum',
    price: 25,
    tagline: 'Full power',
    color: 'amber',
    features: [
      'Everything in Free + Pro',
      'Unlimited high-value signals',
      'All store & factory intel',
      '100,000+ API requests / day',
      'Multiple API keys',
      'Priority support + early features',
    ],
    apiLimit: '100,000+ / day',
  },
];

const SAMPLE_STORES = [
  { name: 'Huaqiangbei Electronics Market', city: 'Shenzhen', price: '$18 – $45', contact: '+86 755-xxxx', location: 'Huaqiang North Rd, Futian' },
  { name: 'Dragon Mart', city: 'Dubai', price: '$22 – $55', contact: '+971 4-xxxx', location: 'International City, Dubai' },
  { name: 'Saddar / Bolton Market', city: 'Karachi', price: 'Rs 2,500 – 6,000', contact: '+92 21-xxxx', location: 'Saddar, Karachi' },
  { name: 'Hall Road Market', city: 'Lahore', price: 'Rs 2,200 – 5,500', contact: '+92 42-xxxx', location: 'Hall Road, Lahore' },
  { name: 'Osmanbey Textile District', city: 'Istanbul', price: '₺400 – 1,200', contact: '+90 212-xxxx', location: 'Osmanbey, Şişli' },
  { name: 'Yiwu International Trade City', city: 'Yiwu', price: '$5 – $25', contact: '+86 579-xxxx', location: 'Futian Market, Yiwu' },
];

export default function PricingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const openCheckout = (planId: PlanId) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
    setPayMethod(null);
    setShowCheckout(true);
  };

  const plan = PLANS.find((p) => p.id === selectedPlan);

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const pageBg = isDark ? 'bg-slate-950' : 'bg-slate-50';

  return (
    <div className={`min-h-[calc(100vh-4rem)] ${pageBg} px-4 py-8 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${textMain}`}>Choose Your Plan</h1>
          <p className={`mt-2 text-sm ${textMuted}`}>
            Free → Pro ($10) → Platinum ($25). Pay with EasyPaisa, Stripe or PayPal.
          </p>
        </div>

        {/* Plans */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const isPro = p.id === 'pro';
            const isPlat = p.id === 'platinum';
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border p-6 transition ${
                  isPro
                    ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                    : isPlat
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : cardBg
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-4 flex items-center gap-2">
                  {isPlat ? <Zap className="h-5 w-5 text-amber-400" /> : isPro ? <Crown className="h-5 w-5 text-emerald-400" /> : <Lock className="h-5 w-5 text-slate-400" />}
                  <h2 className={`text-xl font-bold ${textMain}`}>{p.name}</h2>
                </div>
                <div className={`mb-1 text-3xl font-bold ${textMain}`}>
                  {p.price === 0 ? 'Free' : `$${p.price}`}
                  {p.price > 0 && <span className={`text-sm font-normal ${textMuted}`}>/month</span>}
                </div>
                <p className={`mb-4 text-xs ${textMuted}`}>{p.tagline}</p>
                <div className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  API: {p.apiLimit}
                </div>
                <ul className="mb-6 space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${textMuted}`}>
                      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isPlat ? 'text-amber-400' : 'text-emerald-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openCheckout(p.id)}
                  disabled={p.id === 'free'}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                    p.id === 'free'
                      ? isDark ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-slate-200 text-slate-500 cursor-default'
                      : isPro
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110'
                  }`}
                >
                  {p.id === 'free' ? 'Current Plan' : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Pro feature: Store cards */}
        <div className="mb-8">
          <h2 className={`mb-2 flex items-center gap-2 text-xl font-bold ${textMain}`}>
            <Store className="h-5 w-5 text-emerald-400" />
            Store Cards <span className="text-sm font-normal text-emerald-400">(Pro & Platinum)</span>
          </h2>
          <p className={`mb-4 text-sm ${textMuted}`}>
            Real store names, local prices, contact and location — unlocked on Pro and above.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_STORES.map((s, i) => (
              <div key={i} className={`rounded-xl border p-4 ${cardBg}`}>
                <div className={`mb-2 font-semibold ${textMain}`}>{s.name}</div>
                <div className={`mb-3 text-lg font-bold text-emerald-400`}>{s.price}</div>
                <div className={`flex items-center gap-1.5 text-xs ${textMuted}`}>
                  <MapPin className="h-3.5 w-3.5" /> {s.location}
                </div>
                <div className={`mt-1 flex items-center gap-1.5 text-xs ${textMuted}`}>
                  <Phone className="h-3.5 w-3.5" /> {s.contact}
                </div>
                <div className={`mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {s.city}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods note */}
        <div className={`rounded-xl border p-5 ${cardBg}`}>
          <h3 className={`mb-3 flex items-center gap-2 font-semibold ${textMain}`}>
            <CreditCard className="h-4 w-4 text-emerald-400" /> Accepted Payments
          </h3>
          <div className="flex flex-wrap gap-3">
            {['EasyPaisa', 'Stripe', 'PayPal'].map((m) => (
              <span
                key={m}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && plan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl border p-6 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <button onClick={() => setShowCheckout(false)} className={`absolute right-4 top-4 ${textMuted} hover:opacity-80`}>
              <X className="h-5 w-5" />
            </button>
            <h3 className={`mb-1 text-lg font-bold ${textMain}`}>Subscribe to {plan.name}</h3>
            <p className={`mb-4 text-sm ${textMuted}`}>${plan.price}/month · {plan.apiLimit} API requests</p>

            <p className={`mb-2 text-xs font-medium ${textMuted}`}>Select payment method</p>
            <div className="mb-5 space-y-2">
              {(
                [
                  { id: 'easypaisa' as PayMethod, label: 'EasyPaisa', desc: 'Pakistan mobile wallet' },
                  { id: 'stripe' as PayMethod, label: 'Stripe', desc: 'Card (Visa, Mastercard)' },
                  { id: 'paypal' as PayMethod, label: 'PayPal', desc: 'PayPal balance or card' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    payMethod === m.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isDark ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className={`h-5 w-5 ${payMethod === m.id ? 'text-emerald-400' : textMuted}`} />
                  <div>
                    <div className={`text-sm font-semibold ${textMain}`}>{m.label}</div>
                    <div className={`text-xs ${textMuted}`}>{m.desc}</div>
                  </div>
                  {payMethod === m.id && <Check className="ml-auto h-4 w-4 text-emerald-400" />}
                </button>
              ))}
            </div>

            <button
              disabled={!payMethod}
              onClick={() => {
                alert(`Demo: ${plan.name} via ${payMethod}. Connect real EasyPaisa / Stripe / PayPal keys to process payments.`);
                setShowCheckout(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Pay ${plan.price} / month
            </button>
            <p className={`mt-3 text-center text-[10px] ${textMuted}`}>
              Demo checkout only. Real payments need your EasyPaisa / Stripe / PayPal API keys.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}