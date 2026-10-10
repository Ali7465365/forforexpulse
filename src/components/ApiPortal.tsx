import { useEffect, useState } from 'react';
import {
  Key, Plus, Copy, Check, Trash2, Ban, Loader2,
  Activity, Code, Terminal, Eye, EyeOff, Zap
} from 'lucide-react';
import { supabase, type ApiKey, type MarketItem, type TradeHub } from '@/lib/supabase';
import { createApiKey, fetchApiKeys, revokeApiKey, deleteApiKey, maskApiKey } from '@/lib/apiKeys';

type TestResult = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: unknown;
  message?: string;
  statusCode?: number;
};

const endpointOptions = [
  { value: 'hubs', label: 'GET /trade/hubs — All trade hubs', query: 'trade_hubs' },
  { value: 'items', label: 'GET /trade/items — All market items', query: 'market_items' },
  { value: 'pro-items', label: 'GET /trade/items?pro=true — PRO signals only', query: 'market_items_pro' },
  { value: 'hubs-full', label: 'GET /trade/hubs?include=sellers,items — Full hub data', query: 'trade_hubs_full' },
];

export default function ApiPortal() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newRateLimit, setNewRateLimit] = useState(1000);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // Test console state
  const [selectedEndpoint, setSelectedEndpoint] = useState('hubs');
  const [testKey, setTestKey] = useState('');
  const [testResult, setTestResult] = useState<TestResult>({ status: 'idle' });

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    setLoading(true);
    const keys = await fetchApiKeys();
    setApiKeys(keys);
    setLoading(false);
  }

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const key = await createApiKey(newKeyName.trim(), newRateLimit);
      setApiKeys((prev) => [key, ...prev]);
      setNewKeyName('');
      setNewRateLimit(1000);
      setShowCreateForm(false);
      setRevealedKey(key.id);
      setVisibleKeys((prev) => new Set(prev).add(key.id));
    } catch (err) {
      console.error('Failed to create key', err);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    await revokeApiKey(id);
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k))
    );
  }

  async function handleDelete(id: string) {
    await deleteApiKey(id);
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  }

  async function handleCopy(key: string, id: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleKeyVisibility(id: string) {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runTestQuery() {
    if (!testKey.trim()) {
      setTestResult({ status: 'error', message: 'Please enter an API key' });
      return;
    }

    setTestResult({ status: 'loading' });

    const endpoint = endpointOptions.find((e) => e.value === selectedEndpoint)!;

    try {
      let data: unknown;
      let count: number;

      if (endpoint.query === 'trade_hubs') {
        const res = await supabase.from('trade_hubs').select('*');
        data = res.data;
        count = res.data?.length ?? 0;
      } else if (endpoint.query === 'market_items') {
        const res = await supabase.from('market_items').select('*');
        data = res.data;
        count = res.data?.length ?? 0;
      } else if (endpoint.query === 'market_items_pro') {
        const res = await supabase.from('market_items').select('*').eq('is_pro_signal', true);
        data = res.data;
        count = res.data?.length ?? 0;
      } else {
        const res = await supabase.from('trade_hubs').select('*, sellers(*), market_items(*)');
        data = res.data;
        count = res.data?.length ?? 0;
      }

      setTestResult({
        status: 'success',
        data,
        statusCode: 200,
        message: `200 OK — ${count} records returned`,
      });
    } catch (err) {
      setTestResult({
        status: 'error',
        message: err instanceof Error ? err.message : 'Request failed',
      });
    }
  }

  const totalRequests = apiKeys.reduce((s, k) => s + Number(k.total_requests), 0);
  const activeKeys = apiKeys.filter((k) => k.status === 'active').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Developer API Portal</h1>
          <p className="mt-1 text-sm text-slate-400">
            Generate API keys, monitor usage, and test live trade data queries
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-400" />
              <span className="text-xs text-slate-500">Active Keys</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-400">{activeKeys}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className="text-xs text-slate-500">Total Requests</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-400">{totalRequests.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="text-xs text-slate-500">Avg Rate Limit</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-400">
              {apiKeys.length > 0
                ? Math.round(apiKeys.reduce((s, k) => s + k.rate_limit, 0) / apiKeys.length)
                : 0}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-cyan-400" />
              <span className="text-xs text-slate-500">Endpoints</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-cyan-400">{endpointOptions.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* API Keys section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                <Key className="h-5 w-5 text-emerald-400" />
                Your API Keys
              </h2>
              <button
                onClick={() => setShowCreateForm((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <Plus className="h-4 w-4" />
                New Key
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-slate-400">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Server"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    Rate Limit (requests/hour)
                  </label>
                  <input
                    type="number"
                    value={newRateLimit}
                    onChange={(e) => setNewRateLimit(Number(e.target.value))}
                    min={100}
                    max={10000}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={creating || !newKeyName.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Generate Key
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex h-32 items-center justify-center text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <Key className="mb-2 h-8 w-8 text-slate-700" />
                <p className="text-sm text-slate-500">No API keys yet</p>
                <p className="text-xs text-slate-600">Generate one to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="rounded-lg border border-slate-700 bg-slate-800/30 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{key.key_name}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            key.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}>
                            {key.status}
                          </span>
                          {revealedKey === key.id && (
                            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <code className="rounded bg-slate-900 px-2 py-1 text-xs font-mono text-slate-400">
                            {visibleKeys.has(key.id) ? key.api_key : maskApiKey(key.api_key)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="text-slate-500 transition hover:text-white"
                          >
                            {visibleKeys.has(key.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(key.api_key, key.id)}
                            className="text-slate-500 transition hover:text-white"
                          >
                            {copiedId === key.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                          <span>Limit: {key.rate_limit}/hr</span>
                          <span>Used: {key.requests_this_hour}/hr</span>
                          <span>Total: {Number(key.total_requests).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {key.status === 'active' && (
                          <button
                            onClick={() => handleRevoke(key.id)}
                            title="Revoke"
                            className="rounded p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(key.id)}
                          title="Delete"
                          className="rounded p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Console */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
              <Terminal className="h-5 w-5 text-cyan-400" />
              Live Query Tester
            </h2>

            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Endpoint</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {endpointOptions.map((ep) => (
                  <option key={ep.value} value={ep.value}>{ep.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">API Key</label>
              <input
                type="text"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="mt_..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={runTestQuery}
              disabled={testResult.status === 'loading'}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/15 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/25 disabled:opacity-50"
            >
              {testResult.status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4" />
              )}
              Send Request
            </button>

            {/* Result */}
            {testResult.status !== 'idle' && (
              <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
                  <span className="text-xs font-medium text-slate-400">Response</span>
                  {testResult.statusCode && (
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      testResult.status === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {testResult.statusCode}
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto p-3">
                  {testResult.status === 'loading' && (
                    <div className="flex items-center justify-center py-4 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {testResult.status === 'success' && (
                    <>
                      <div className="mb-2 text-xs text-emerald-400">{testResult.message}</div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(testResult.data, null, 2).slice(0, 2000)}
                      </pre>
                    </>
                  )}
                  {testResult.status === 'error' && (
                    <div className="text-xs text-red-400">{testResult.message}</div>
                  )}
                </div>
              </div>
            )}

            {/* Documentation snippet */}
            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3">
              <div className="mb-1.5 text-xs font-medium text-slate-400">Example Request</div>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-all">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  https://api.marketscope.app/v1/trade/hubs`}
              </pre>
            </div>
          </div>
        </div>

        {/* Rate limit table */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-3 text-base font-bold text-white">Rate Limits by Tier</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { tier: 'Free', limit: '1,000/hr', features: ['Read access', 'All endpoints', 'Basic support'] },
              { tier: 'Pro', limit: '10,000/hr', features: ['Read + Write', 'PRO signals', 'Priority support'] },
              { tier: 'Enterprise', limit: 'Unlimited', features: ['Full access', 'Custom endpoints', 'Dedicated support'] },
            ].map((t) => (
              <div key={t.tier} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                <div className="mb-1 text-sm font-bold text-white">{t.tier}</div>
                <div className="mb-2 text-lg font-bold text-emerald-400">{t.limit}</div>
                <ul className="space-y-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Check className="h-3 w-3 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
