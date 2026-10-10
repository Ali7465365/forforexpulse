import { TrendingUp, Lock, Crown, Clock } from 'lucide-react';
import { usePro } from '@/context/ProContext';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAds: () => void;
};

const navItems = [
  { id: 'map', label: 'Trade Map' },
  { id: 'explore', label: 'Explore' },
  { id: 'dashboard', label: 'Intelligence' },
  { id: 'api-portal', label: 'API Portal' },
];

export default function Navbar({ currentPage, onNavigate, onOpenAds }: NavbarProps) {
  const { isPro, timeRemaining } = usePro();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('map')} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">
            <TrendingUp className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ForForex Pulse</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isPro ? (
            <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">
                PRO
                {timeRemaining && (
                  <span className="ml-1.5 text-xs font-normal text-amber-400/70">
                    {timeRemaining.days}d {timeRemaining.hours}h left
                  </span>
                )}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenAds}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:brightness-110"
            >
              <Lock className="h-4 w-4" />
              Unlock PRO
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-slate-800 px-4 py-2 md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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
  );
}