import { useState } from 'react';
import {
  Search, MapPin, Package, TrendingUp, Factory, Store,
  BarChart3, AlertCircle, Loader2, Globe, DollarSign,
  Users, Truck, Award, Layers
} from 'lucide-react';
import { researchProduct, type ResearchResult } from '@/lib/productResearch';

export default function ProductResearch() {
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
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));
    const data = researchProduct(product.trim(), city.trim());
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Product Research</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter any product and city to get demand, pricing, supply chain, factories and retail outlets
          </p>
        </div>

        {/* Search box */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Product (e.g. Wireless Earbuds, Saffron, Leather Bags)"
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
                placeholder="City (e.g. Shenzhen, Karachi, Dubai, Istanbul)"
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

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
              <span className="text-sm text-slate-400">Product:</span>
              <span className="font-semibold text-white">{result.product}</span>
              <span className="text-slate-600">•</span>
              <span className="text-sm text-slate-400">City:</span>
              <span className="font-semibold text-white">{result.city}</span>
              <span className="text-slate-600">•</span>
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

            {/* Section 2 */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <Globe className="h-5 w-5 text-emerald-400" />
                Section 2 — Supply Chain & Market Outlets
              </h2>

              {/* Factories */}
              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Factory className="h-4 w-4 text-amber-400" />
                  Hubs, Factories & Manufacturers
                </h3>
                <div className="space-y-2">
                  {result.factories.map((f, i) => (
                    <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-white">{f.name}</div>
                          <div className="mt-0.5 text-xs text-slate-400">{f.city} · {f.type}</div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-400">{f.wholesalePrice}</div>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">{f.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stores */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Store className="h-4 w-4 text-blue-400" />
                  Stores & Retail Outlets
                </h3>
                <div className="space-y-2">
                  {result.stores.map((s, i) => (
                    <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-white">{s.name}</div>
                          <div className="mt-0.5 text-xs text-slate-400">{s.city} · {s.type}</div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-400">{s.retailPrice}</div>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">{s.notes}</p>
                    </div>
                  ))}
                </div>
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