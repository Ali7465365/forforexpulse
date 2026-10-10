import { useState } from 'react';
import { TrendingUp, Lock, Crown, Sun, Moon, X } from 'lucide-react';
import { usePro } from '@/context/ProContext';
import { useTheme } from '@/context/ThemeContext';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAds: () => void;
};

const navItems = [
  { id: 'map', label: 'Trade Map' },
  { id: 'research', label: 'Product Research' },
  { id: 'dashboard', label: 'Intelligence' },
  { id: 'api-portal', label: 'API Portal' },
];

export default function Navbar({ currentPage, onNavigate, onOpenAds }: NavbarProps) {
  const { isPro, timeRemaining } = usePro();
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => onNavigate('map')} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">
              <TrendingUp className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ForForex Pulse</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {/* ! circle — app guide (like games / websites) */}
            <button
              onClick={() => setHelpOpen(true)}
              title="How this app works"
              className="mr-1 flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-400 transition hover:bg-amber-500/25 hover:border-amber-400"
            >
              !
            </button>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile ! button */}
            <button
              onClick={() => setHelpOpen(true)}
              title="How this app works"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-400 md:hidden"
            >
              !
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isPro ? (
              <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">
                  PRO
                  {timeRemaining && (
                    <span className="ml-1.5 text-xs font-normal text-amber-400/70">
                      {timeRemaining.days}d {timeRemaining.hours}h
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <button
                onClick={onOpenAds}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110"
              >
                <Lock className="h-4 w-4" />
                Unlock PRO
              </button>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-800 px-2 py-2 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* App guide popup */}
      {helpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-sm font-bold text-amber-400">
                  !
                </span>
                <h2 className="text-base font-bold text-white">How ForForex Pulse works</h2>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="text-slate-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 text-sm text-slate-300">
              <div>
                <p className="mb-1 font-semibold text-emerald-400">Trade Map</p>
                <p className="text-xs text-slate-400">
                  World map of trade hubs and sellers. Filter by category, click pins for details and prices.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-400">Product Research</p>
                <p className="text-xs text-slate-400">
                  Type a product + city. Get demand, quality, supply, prices, import %, competitors, plus factory and store cards. First 2 cards free; full contacts on PRO.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-400">Intelligence</p>
                <p className="text-xs text-slate-400">
                  Ranked list of high-value items by score (price, supply, demand, margin). Best for scanning opportunities across markets.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-400">API Portal</p>
                <p className="text-xs text-slate-400">
                  Create API keys and test trade data queries for your own apps or tools.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-amber-400">PRO ($10/mo)</p>
                <p className="text-xs text-slate-400">
                  Unlocks full store/factory contacts & locations, PRO trade signals, and higher API limits. Platinum ($25) for maximum API volume.
                </p>
              </div>
              <p className="border-t border-slate-800 pt-3 text-[11px] text-slate-500">
                Data is estimated from major trade hubs (~89–92% useful) — not live inventory.
              </p>
            </div>

            <div className="border-t border-slate-800 px-5 py-4">
              <button
                onClick={() => setHelpOpen(false)}
                className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}