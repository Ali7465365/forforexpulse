import { useState } from 'react';
import {
  Building2, MapPin, Search, Lightbulb, TrendingUp,
  AlertTriangle, ListChecks, Loader2
} from 'lucide-react';
import { adviseBusiness, type BusinessAdvice, type BusinessMode } from '@/lib/businessAdvisor';

export default function BusinessAdvisor() {
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<BusinessMode>('new');
  const [businessInput, setBusinessInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessAdvice | null>(null);

  async function handleRun() {
    if (!city.trim() && !country.trim() && !area.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setResult(
      adviseBusiness({
        mode,
        area: area.trim(),
        city: city.trim(),
        country: country.trim(),
        businessInput: businessInput.trim(),
      })
    );
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Building2 className="h-7 w-7 text-emerald-400" />
            Business Advisor
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter your area and business. For a <strong className="text-slate-300">new</strong> business we suggest what fits the location. For an <strong className="text-slate-300">ongoing</strong> business we suggest how to expand.
          </p>
        </div>

        <div className="mb-6 space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Area (e.g. Saddar, Hall Road)"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Karachi)"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country (e.g. Pakistan)"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                mode === 'new' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              New business
            </button>
            <button
              type="button"
              onClick={() => setMode('ongoing')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                mode === 'ongoing' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Ongoing business
            </button>
          </div>

          <textarea
            value={businessInput}
            onChange={(e) => setBusinessInput(e.target.value)}
            rows={3}
            placeholder={
              mode === 'new'
                ? 'What do you want to do? (e.g. mobile accessories shop, small café, leather bags)'
                : 'What business do you run? (e.g. electronics shop in Saddar, clothing store)'
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />

          <button
            onClick={handleRun}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Get advice
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-lg font-bold text-white">{result.headline}</h2>
              <p className="mt-2 text-sm text-slate-400">{result.summary}</p>
              <p className="mt-2 text-[11px] text-slate-500">{result.confidence}</p>
            </div>

            <Section icon={Lightbulb} title="Recommendations" color="text-emerald-400" items={result.recommendations} />
            <Section icon={TrendingUp} title="Opportunities" color="text-blue-400" items={result.opportunities} />
            <Section icon={AlertTriangle} title="Risks" color="text-amber-400" items={result.risks} />
            <Section icon={ListChecks} title="Next steps" color="text-cyan-400" items={result.nextSteps} />
          </div>
        )}

        {!result && !loading && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-800 py-14 text-center text-slate-500">
            <MapPin className="mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Enter location + business type, then get advice</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  items,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className={`mb-3 flex items-center gap-2 text-sm font-bold ${color}`}>
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="text-slate-600">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}