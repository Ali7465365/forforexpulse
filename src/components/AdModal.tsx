import { useState, useEffect, useRef } from 'react';
import {
  X, Play, Pause, Lock, Crown, Check, Clock, PlayCircle, Sparkles, TrendingUp,
  CreditCard, Zap
} from 'lucide-react';
import { usePro } from '@/context/ProContext';
import { recordAdView, getAdContent } from '@/lib/proAccess';

type AdModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TOTAL_ADS = 5;

export default function AdModal({ isOpen, onClose }: AdModalProps) {
  const { proPass, setProPass, isPro, timeRemaining, refresh } = usePro();
  const [currentAd, setCurrentAd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adCompleted, setAdCompleted] = useState(false);
  const [recording, setRecording] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedAds = proPass?.ads_watched ?? 0;

  useEffect(() => {
    if (isOpen) {
      refresh();
      setCurrentAd(completedAds);
      setProgress(0);
      setIsPlaying(false);
      setAdCompleted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isPlaying || adCompleted) return;

    const ad = getAdContent(currentAd);
    const totalTime = ad.duration;
    const tickRate = 100;
    const increment = (100 / (totalTime * (1000 / tickRate)));

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + increment;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          setAdCompleted(true);
          return 100;
        }
        return next;
      });
    }, tickRate);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentAd, adCompleted]);

  const handleCompleteAd = async () => {
    if (recording) return;
    setRecording(true);
    try {
      const updated = await recordAdView(proPass!.id, currentAd + 1);
      setProPass(updated);
      if (updated.ads_watched >= TOTAL_ADS) {
        await refresh();
      } else {
        setCurrentAd(updated.ads_watched);
        setProgress(0);
        setAdCompleted(false);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Failed to record ad view', err);
    } finally {
      setRecording(false);
    }
  };

  if (!isOpen) return null;

  const ad = getAdContent(currentAd);
  const adsLeft = TOTAL_ADS - completedAds;
  const allDone = completedAds >= TOTAL_ADS;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {isPro ? 'PRO Access Active' : 'Watch 5 Ads for PRO Access'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isPro ? (
            /* Already PRO */
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600">
                <Crown className="h-8 w-8 text-slate-950" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">You have PRO Access!</h3>
              <p className="mb-4 text-sm text-slate-400">
                Exclusive high-margin trade signals are now unlocked across the platform.
              </p>
              {timeRemaining && (
                <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-300">
                    {timeRemaining.days}d {timeRemaining.hours}h remaining
                  </span>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Explore PRO Signals
              </button>
            </div>
          ) : (
            <>
              {/* Progress tracker */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Progress: {completedAds} / {TOTAL_ADS} ads watched
                  </span>
                  <span className="text-sm font-semibold text-amber-400">
                    {adsLeft} {adsLeft === 1 ? 'ad' : 'ads'} to go
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: TOTAL_ADS }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex h-10 flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                        i < completedAds
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          : i === currentAd
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                          : 'border-slate-700 bg-slate-800 text-slate-600'
                      }`}
                    >
                      {i < completedAds ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video ad area */}
              <div className="mb-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
                  {/* Simulated video content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="mb-3 text-center">
                      <div className="text-xs font-medium text-slate-500">{ad.advertiser}</div>
                      <div className="mt-1 text-xl font-bold text-white">{ad.title}</div>
                      <div className="mt-2 text-xs text-slate-500">Ad #{currentAd + 1} of {TOTAL_ADS}</div>
                    </div>

                    {!isPlaying && !adCompleted && progress === 0 && (
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                      >
                        <Play className="h-4 w-4" />
                        Play Ad
                      </button>
                    )}

                    {!isPlaying && adCompleted && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                          <Check className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-emerald-400">Ad completed!</span>
                      </div>
                    )}

                    {isPlaying && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-amber-500/20">
                          <PlayCircle className="h-6 w-6 text-amber-400" />
                        </div>
                        <span className="text-xs text-slate-400">Playing...</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                    <div
                      className="h-full bg-amber-400 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Pause control */}
                  {isPlaying && (
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action area */}
              {adCompleted ? (
                <button
                  onClick={handleCompleteAd}
                  disabled={recording}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:brightness-110 disabled:opacity-60"
                >
                  {recording ? (
                    <>Recording...</>
                  ) : currentAd + 1 >= TOTAL_ADS ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Unlock 1-Day PRO Access
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirm Ad Watched — Next Ad
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-800/30 py-3 text-sm text-slate-500">
                  <Lock className="h-4 w-4" />
                  Watch all {TOTAL_ADS} ads to unlock 1 day of PRO access
                </div>
              )}

              {/* Benefits */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
                  <Crown className="h-4 w-4 flex-shrink-0 text-amber-400" />
                  <span className="text-xs text-slate-400">Exclusive trade signals</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
                  <TrendingUp className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <span className="text-xs text-slate-400">High-margin items unlocked</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                  <span className="text-xs text-slate-400">1-day unlimited access</span>
                </div>
              </div>

              {/* Paid subscription options */}
              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">
                    Prefer paid access? Skip the ads.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-white">PRO Monthly</span>
                    </div>
                    <div className="mb-2 text-2xl font-bold text-white">
                      $10<span className="text-xs font-normal text-slate-500">/month</span>
                    </div>
                    <ul className="mb-3 space-y-0.5">
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                        All PRO trade signals
                      </li>
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                        Unlimited map access
                      </li>
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                        Cancel anytime
                      </li>
                    </ul>
                    <button
                      disabled
                      className="w-full rounded-lg bg-slate-700 py-2 text-xs font-semibold text-slate-400"
                    >
                      Coming Soon
                    </button>
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">PRO Enterprise</span>
                    </div>
                    <div className="mb-2 text-2xl font-bold text-white">
                      $100<span className="text-xs font-normal text-slate-500">/month</span>
                    </div>
                    <ul className="mb-3 space-y-0.5">
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                        Everything in PRO Monthly
                      </li>
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                        API access with 10k req/hr
                      </li>
                      <li className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                        Priority support
                      </li>
                    </ul>
                    <button
                      disabled
                      className="w-full rounded-lg bg-slate-700 py-2 text-xs font-semibold text-slate-400"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


