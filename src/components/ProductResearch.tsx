import { useState } from 'react';
import {
  Search, MapPin, Package, TrendingUp, Factory, Store,
  BarChart3, AlertCircle, Loader2, Globe, DollarSign,
  Users, Truck, Award, Layers, Phone, Lock, Crown
} from 'lucide-react';
import { researchProduct, type ResearchResult, type Factory as FactoryType, type Store as StoreType } from '@/lib/productResearch';
import { usePro } from '@/context/ProContext';

const FREE_UNLOCKED = 2; // first 2 factories + first 2 stores free

export default function ProductResearch() {
  const { isPro } = usePro();
  const [product, setProduct] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!product.trim() || !city.trim()) {
      setError('Please enter both product and city');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setResult(researchProduct(product.trim(), city.trim()));
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Product Research</h1>
          <p className="mt-1 text-sm text-slate-400">
            Product + city → demand, pricing, factories and store cards. Full contacts & locations on PRO.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Product (e.g. Wireless Earbuds, Leather Bags)"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="City (e.g. Shenzhen, Karachi, Dubai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Research
            </button>
          </div>
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
        </div>

        {result && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
              <span className="text-sm text-slate-400">Product:</span>
              <span className="font-semibold text-white">{result.product}</span>
              <span className="text-slate-600">•</span>
              <span className="text-sm text-slate-400">City:</span>
              <span className="font-semibold text-white">{result.city}</span>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">{result.category}</span>
              <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">{result.region}</span>
              <span className="ml-auto text-xs text-slate-500">{result.confidence}</span>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                Section 1 — Product Information in the Area
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard icon={TrendingUp} label="Product Demand" value={result.metrics.demandLevel} sub={result.metrics.demandTrend} score={result.metrics.demandScore} />
                <MetricCard icon={Award} label="Product Quality" value={result.metrics.qualityStandards} sub={result.metrics.qualityGrades.join(' · ')} />
                <MetricCard icon={Layers} label="Need & Necessity" value={result.metrics.needLevel} sub={result.metrics.utilityFactors.join(' · ')} />
                <MetricCard icon={Package} label="Product Quantity" value={result.metrics.quantityEstimate} sub={`Supply score: ${result.metrics.supplyScore}/100`} />
                <MetricCard icon={DollarSign} label="Average Price" value={`Retail: ${result.metrics.avgRetailPrice}`} sub={`Wholesale: ${result.metrics.avgWholesalePrice}`} />
                <MetricCard icon={Truck} label="Import Requirement" value={result.metrics.importRequirement} sub={`Import ${result.metrics.importPercent}% · Local ${result.metrics.localSourcePercent}%`} />
                <MetricCard icon={Users} label="Competitor Quantity" value={`${result.metrics.competitorCount}+ competitors`} sub={result.metrics.competitorNotes} className="sm:col-span-2 lg:col-span-3" />
              </div>
            </div>

            {/* Section 2 — Cards */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <Globe className="h-5 w-5 text-emerald-400" />
                Section 2 — Supply Chain & Market Outlets
              </h2>
              {!isPro && (
                <p className="mb-3 flex items-center gap-2 text-xs text-amber-400/90">
                  <Lock className="h-3.5 w-3.5" />
                  First {FREE_UNLOCKED} free. Unlock PRO for full contact, location and all cards.
                </p>
              )}

              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Factory className="h-4 w-4 text-amber-400" />
                Hubs, Factories & Manufacturers
              </h3>
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.factories.map((f, i) => (
                  <OutletCard key={i} item={f} kind="factory" locked={!isPro && i >= FREE_UNLOCKED} />
                ))}
              </div>

              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Store className="h-4 w-4 text-blue-400" />
                Stores & Retail Outlets
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.stores.map((s, i) => (
                  <OutletCard key={i} item={s} kind="store" locked={!isPro && i >= FREE_UNLOCKED} />
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-500">
            <Search className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Enter a product and city, then click Research</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OutletCard({
  item,
  kind,
  locked,
}: {
  item: FactoryType | StoreType;
  kind: 'factory' | 'store';
  locked: boolean;
}) {
  const price = kind === 'factory' ? (item as FactoryType).wholesalePrice : (item as StoreType).retailPrice;

  if (locked) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="blur-sm select-none">
          <div className="mb-1 font-semibold text-white">{item.name}</div>
          <div className="mb-2 text-lg font-bold text-emerald-400">{price}</div>
          <div className="text-xs text-slate-500">••••••••</div>
          <div className="text-xs text-slate-500">••••••••</div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70">
          <Lock className="mb-1 h-5 w-5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">PRO locked</span>
          <span className="mt-0.5 text-[10px] text-slate-400">Contact + full location</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="font-semibold text-white">{item.name}</div>
        {kind === 'factory' ? (
          <Factory className="h-4 w-4 flex-shrink-0 text-amber-400" />
        ) : (
          <Store className="h-4 w-4 flex-shrink-0 text-blue-400" />
        )}
      </div>
      <div className="mb-2 text-lg font-bold text-emerald-400">{price}</div>
      <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
        {item.location}
      </div>
      <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
        {item.contact}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{item.city}</span>
        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{item.type}</span>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">{item.notes}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  score,
  className = '',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  score?: number;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-4 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {score !== undefined && (
          <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
            {score}/100
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}