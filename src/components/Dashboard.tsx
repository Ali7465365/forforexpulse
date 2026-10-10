import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp, Lock, Crown, Search, ArrowUpDown,
  Package, AlertCircle, Store
} from 'lucide-react';
import { supabase, type MarketItem, type TradeHub, type Seller } from '@/lib/supabase';
import { usePro } from '@/context/ProContext';

type RankedItem = MarketItem & {
  hub_name: string;
  seller_name: string;
  value_score: number;
};

type SortKey = 'value_score' | 'margin_estimate' | 'price' | 'demand_score';

const categoryIcons: Record<string, string> = {
  'Spices': '🌶️',
  'Textiles': '🧵',
  'Electronics': '📱',
  'Precious Metals': '🥇',
  'Gems': '💎',
  'Leather': '👜',
  'Manufacturing': '⚙️',
  'Commodities': '📦',
  'Machinery': '🔧',
  'Metals': '🔩',
  'Crafts': '🎨',
  'Produce': '🥭',
  'Consumer Goods': '🛍️',
  'Imports': '✈️',
};

function calculateValueScore(item: MarketItem): number {
  // Higher price + higher demand + lower supply + fewer competitors = higher value
  const priceFactor = Math.log10(item.price + 1) * 15;
  const demandFactor = item.demand_score * 0.3;
  const supplyFactor = (100 - item.supply_level) * 0.2;
  const competitionFactor = Math.max(0, (20 - item.competitor_count)) * 0.5;
  const marginFactor = item.margin_estimate * 0.3;
  return Math.round(priceFactor + demandFactor + supplyFactor + competitionFactor + marginFactor);
}

export default function Dashboard() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [hubs, setHubs] = useState<TradeHub[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('value_score');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProOnly, setShowProOnly] = useState(false);

  const { isPro } = usePro();

  useEffect(() => {
    async function loadData() {
      const [itemRes, hubRes, sellerRes] = await Promise.all([
        supabase.from('market_items').select('*'),
        supabase.from('trade_hubs').select('*'),
        supabase.from('sellers').select('*'),
      ]);
      setItems(itemRes.data ?? []);
      setHubs(hubRes.data ?? []);
      setSellers(sellerRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const hubMap = useMemo(() => new Map(hubs.map((h) => [h.id, h])), [hubs]);
  const sellerMap = useMemo(() => new Map(sellers.map((s) => [s.id, s])), [sellers]);

  const rankedItems = useMemo(() => {
    const enriched: RankedItem[] = items.map((item) => ({
      ...item,
      hub_name: hubMap.get(item.hub_id)?.name ?? 'Unknown Hub',
      seller_name: sellerMap.get(item.seller_id)?.name ?? 'Unknown Seller',
      value_score: calculateValueScore(item),
    }));

    let filtered = enriched;
    if (showProOnly) {
      filtered = filtered.filter((i) => i.is_pro_signal);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((i) => i.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.hub_name.toLowerCase().includes(q) ||
          i.seller_name.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const dir = sortKey === 'price' ? 1 : -1;
      return (b[sortKey] - a[sortKey]) * dir;
    });

    return filtered;
  }, [items, hubMap, sellerMap, search, sortKey, categoryFilter, showProOnly]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const proSignals = items.filter((i) => i.is_pro_signal).length;
    const avgMargin = items.length > 0
      ? (items.reduce((s, i) => s + i.margin_estimate, 0) / items.length).toFixed(1)
      : '0';
    const totalHubs = hubs.length;
    return { totalItems, proSignals, avgMargin, totalHubs };
  }, [items, hubs]);

  const allCategories = Array.from(new Set(items.map((i) => i.category))).sort();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Market Intelligence Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ranked high-value trade items based on price, local supply, and competitor density
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Package} label="Total Items" value={stats.totalItems} color="text-blue-400" />
          <StatCard icon={Crown} label="PRO Signals" value={stats.proSignals} color="text-amber-400" />
          <StatCard icon={TrendingUp} label="Avg Margin" value={`${stats.avgMargin}%`} color="text-emerald-400" />
          <StatCard icon={Store} label="Trade Hubs" value={stats.totalHubs} color="text-cyan-400" />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search items, hubs, or sellers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => setShowProOnly((v) => !v)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                showProOnly
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'border border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              <Crown className="h-4 w-4" />
              PRO Only
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-500">Sort by:</span>
            {(['value_score', 'margin_estimate', 'price', 'demand_score'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  sortKey === key
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {key === 'value_score' ? 'Value Score' :
                 key === 'margin_estimate' ? 'Margin %' :
                 key === 'price' ? 'Price (Low→High)' : 'Demand'}
              </button>
            ))}
          </div>
        </div>

        {/* Items table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-500">Loading market data...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/70 text-left">
                    <th className="px-4 py-3 font-medium text-slate-400">Rank</th>
                    <th className="px-4 py-3 font-medium text-slate-400">Item</th>
                    <th className="hidden px-4 py-3 font-medium text-slate-400 md:table-cell">Hub</th>
                    <th className="hidden px-4 py-3 font-medium text-slate-400 lg:table-cell">Seller</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-400">Price</th>
                    <th className="hidden px-4 py-3 text-right font-medium text-slate-400 sm:table-cell">Supply</th>
                    <th className="hidden px-4 py-3 text-right font-medium text-slate-400 sm:table-cell">Comp.</th>
                    <th className="hidden px-4 py-3 text-right font-medium text-slate-400 md:table-cell">Demand</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-400">Margin</th>
                    <th className="px-4 py-3 text-right font-medium text-emerald-400">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedItems.map((item, idx) => {
                    const locked = item.is_pro_signal && !isPro;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {idx < 3 && (
                              <span className={`text-xs font-bold ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-orange-400'}`}>
                                #{idx + 1}
                              </span>
                            )}
                            {idx >= 3 && <span className="text-xs text-slate-500">#{idx + 1}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{categoryIcons[item.category] ?? '📦'}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-medium ${locked ? 'text-slate-500' : 'text-white'}`}>
                                  {locked ? 'PRO Signal — Locked' : item.name}
                                </span>
                                {item.is_pro_signal && (
                                  <span className="flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                                    {isPro ? <Crown className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                                    PRO
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-slate-300 md:table-cell">{item.hub_name}</td>
                        <td className="hidden px-4 py-3 text-slate-300 lg:table-cell">{item.seller_name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-white">
                          {locked ? '—' : `$${item.price.toLocaleString()}`}
                        </td>
                        <td className="hidden px-4 py-3 text-right sm:table-cell">
                          {locked ? '—' : <SupplyBar level={item.supply_level} />}
                        </td>
                        <td className="hidden px-4 py-3 text-right text-slate-400 sm:table-cell">
                          {locked ? '—' : item.competitor_count}
                        </td>
                        <td className="hidden px-4 py-3 text-right md:table-cell">
                          {locked ? '—' : <DemandBar score={item.demand_score} />}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {locked ? (
                            <span className="text-amber-400/50">—</span>
                          ) : (
                            <span className="font-semibold text-emerald-400">{item.margin_estimate}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {locked ? (
                            <span className="flex items-center justify-end gap-1 text-amber-400/60">
                              <Lock className="h-3 w-3" />
                              <span className="text-xs">PRO</span>
                            </span>
                          ) : (
                            <span className="text-base font-bold text-emerald-400">{item.value_score}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rankedItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 py-16 text-center">
            <AlertCircle className="mb-2 h-8 w-8 text-slate-600" />
            <p className="text-sm text-slate-400">No items match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Package;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function SupplyBar({ level }: { level: number }) {
  const color = level > 70 ? 'bg-blue-500' : level > 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center justify-end gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-7">{level}</span>
    </div>
  );
}

function DemandBar({ score }: { score: number }) {
  const color = score > 80 ? 'bg-emerald-500' : score > 50 ? 'bg-yellow-500' : 'bg-slate-500';
  return (
    <div className="flex items-center justify-end gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-7">{score}</span>
    </div>
  );
}


