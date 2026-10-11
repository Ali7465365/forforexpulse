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
  { id: 'business', label: 'Business' },
  { id: 'dashboard', label: 'Intelligence' },
  { id: 'api-portal', label: 'API Portal' },
];

export default function Navbar({ currentPage, onNavigate, onOpenAds }: NavbarProps) {
  const { isPro, timeRemaining } = usePro();
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  const isDark = theme === 'dark';

  const headerClass = isDark
    ? 'sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md'
    : 'sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md';

  const logoText = isDark ? 'text-white' : 'text-slate-900';
  const navIdle = isDark
    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const navActive = 'bg-emerald-500/10 text-emerald-500';
  const mobileBorder = isDark ? 'border-slate-800' : 'border-slate-200';
  const themeBtn = isDark
    ? 'rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white'
    : 'rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900';

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => onNavigate('map')} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">
              <TrendingUp className="h-5 w-5 text-slate-950" />
            </div>
            <span className={`text-lg font-bold tracking-tight ${logoText}`}>ForForex Pulse</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => setHelpOpen(true)}
              title="How this app works"
              className="mr-1 flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-500 transition hover:bg-amber-500/25"
            >
              !
            </button>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id ? navActive : navIdle
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHelpOpen(true)}
              title="How this app works"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-500 md:hidden"
            >
              !
            </button>

            <button onClick={toggleTheme} className={themeBtn} title="Toggle light / dark theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isPro ? (
              <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-500">
                  PRO
                  {timeRemaining && (
                    <span className="ml-1.5 text-xs font-normal text-amber-500/70">
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

        <nav className={`flex items-center gap-1 overflow-x-auto border-t px-2 py-2 md:hidden ${mobileBorder}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                currentPage === item.id ? navActive : isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {helpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-2xl ${
              isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-sm font-bold text-amber-500">
                  !
                </span>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  How ForForex Pulse works
                </h2>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={`space-y-4 px-5 py-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div>
                <p className="mb-1 font-semibold text-emerald-500">Trade Map</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Use Trade Map to see major hubs and bigger market locations for your selected product on the world map.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-500">Product Research</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Type a product + city. Get demand, quality, supply, prices, import %, competitors, plus factory and store cards. First 2 cards free; full contacts on PRO.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-500">Business</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter area, city and country. For a new business, get ideas of what to open. For an ongoing business, get ideas on how to expand.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-500">Intelligence</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ranked list of high-value items by score (price, supply, demand, margin). Best for scanning opportunities across markets.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-emerald-500">API Portal</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Create API keys and test trade data queries for your own apps or tools.
                </p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-amber-500">PRO ($10/mo) & Platinum ($25/mo)</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  PRO unlocks full store/factory contacts and locations, PRO signals, and higher API limits. Platinum adds maximum API volume.
                </p>
              </div>
              <div
                className={`rounded-lg border px-3 py-2 text-xs ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/50 text-slate-400'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <p className="font-medium text-emerald-500">Data accuracy</p>
                <p className="mt-1">
                  Our market information is about <strong>95% to 96% correct</strong> based on major trade hubs and regional patterns. Accuracy will be improved later with more updates.
                </p>
                <p className="mt-2">
                  <strong>Updates will come</strong> — more cities, richer contacts, better prices, and new features over time.
                </p>
              </div>
            </div>

            <div className={`border-t px-5 py-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
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