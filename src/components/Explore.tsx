import { useEffect, useRef, useState, useMemo } from 'react';
import {
  Map as MapLibreMap, Marker, NavigationControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Globe, Search, Store, MapPin, Package, Star, BadgeCheck,
  TrendingUp, Lock, X, Users, DollarSign, Loader2,
  Navigation, Layers, ChevronRight,
} from 'lucide-react';
import { supabase, type TradeHub, type Seller, type MarketItem } from '@/lib/supabase';
import { usePro } from '@/context/ProContext';

const categoryColors: Record<string, string> = {
  'Spices': '#f97316',
  'Electronics': '#22c55e',
  'Gold & Gems': '#eab308',
  'Textiles': '#3b82f6',
  'Commodities': '#06b6d4',
  'Crafts': '#ec4899',
  'Leather': '#92400e',
  'Manufacturing': '#06b6d4',
  'Machinery': '#06b6d4',
  'Metals': '#94a3b8',
  'Produce': '#84cc16',
  'Consumer Goods': '#f43f5e',
  'Imports': '#10b981',
  'General': '#64748b',
};

type SearchResult = {
  type: 'country' | 'hub';
  label: string;
  sublabel: string;
  hub?: TradeHub;
  country?: string;
};

type SelectedHubData = TradeHub & {
  hubSellers: Seller[];
  hubItems: MarketItem[];
};

export default function Explore() {
  const { isPro } = usePro();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [hubs, setHubs] = useState<TradeHub[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedHub, setSelectedHub] = useState<SelectedHubData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      const [hubRes, sellerRes, itemRes] = await Promise.all([
        supabase.from('trade_hubs').select('*'),
        supabase.from('sellers').select('*'),
        supabase.from('market_items').select('*'),
      ]);
      setHubs(hubRes.data ?? []);
      setSellers(sellerRes.data ?? []);
      setItems(itemRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const countries = useMemo(() => {
    const set = new Set<string>();
    hubs.forEach((h) => set.add(h.region));
    return Array.from(set).sort();
  }, [hubs]);

  const hubsByCountry = useMemo(() => {
    const map = new Map<string, TradeHub[]>();
    hubs.forEach((h) => {
      const arr = map.get(h.region) ?? [];
      arr.push(h);
      map.set(h.region, arr);
    });
    return map;
  }, [hubs]);

  const sellersMap = useMemo(() => new Map(sellers.map((s) => [s.id, s])), [sellers]);

  const allCategories = useMemo(
    () => Array.from(new Set(hubs.map((h) => h.category))).sort(),
    [hubs]
  );

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const results: SearchResult[] = [];

    countries.forEach((country) => {
      if (country.toLowerCase().includes(q)) {
        results.push({ type: 'country', label: country, sublabel: `${hubsByCountry.get(country)?.length ?? 0} trade hubs`, country });
      }
    });

    hubs.forEach((hub) => {
      if (
        hub.name.toLowerCase().includes(q) ||
        hub.region.toLowerCase().includes(q) ||
        hub.category.toLowerCase().includes(q) ||
        hub.description.toLowerCase().includes(q)
      ) {
        results.push({ type: 'hub', label: hub.name, sublabel: `${hub.region} - ${hub.category}`, hub });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, countries, hubs, hubsByCountry]);

  const filteredHubs = useMemo(() => {
    if (activeCategory === 'all') return hubs;
    return hubs.filter((h) => h.category === activeCategory);
  }, [hubs, activeCategory]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          { id: 'osm-layer', type: 'raster', source: 'osm-tiles' },
        ],
      },
      center: [20, 15],
      zoom: 1.8,
      attributionControl: {},
    });

    mapRef.current = map;
    map.addControl(new NavigationControl(), 'top-right');

    map.on('click', () => {
      setSelectedHub(null);
      setSelectedCountry(null);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || loading) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredHubs.forEach((hub) => {
      const color = categoryColors[hub.category] ?? '#64748b';
      const isSelected = selectedHub?.id === hub.id;
      const size = isSelected ? 40 : 32;

      const el = document.createElement('div');
      el.style.cssText = `
        width: ${size}px; height: ${size}px; cursor: pointer;
        background: ${color}; border-radius: 50%;
        border: ${isSelected ? '4px' : '3px'} solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        ${isSelected ? 'box-shadow: 0 0 0 4px rgba(16,185,129,0.3), 0 4px 12px rgba(0,0,0,0.4);' : ''}
      `;
      el.innerHTML = `<svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectHub(hub);
      });

      const marker = new Marker(el)
        .setLngLat([hub.longitude, hub.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [filteredHubs, loading, selectedHub, sellers, items]);

  function selectHub(hub: TradeHub) {
    const hubSellers = sellers.filter((s) => s.hub_id === hub.id);
    const hubItems = items.filter((i) => i.hub_id === hub.id);
    setSelectedHub({ ...hub, hubSellers, hubItems });
    setSelectedCountry(hub.region);
    mapRef.current?.flyTo({
      center: [hub.longitude, hub.latitude],
      zoom: 5,
      duration: 800,
    });
  }

  function selectCountry(country: string) {
    setSelectedCountry(country);
    setShowDropdown(false);
    setSearchQuery('');

    const countryHubsList = hubsByCountry.get(country) ?? [];
    if (countryHubsList.length === 1) {
      selectHub(countryHubsList[0]);
    } else if (countryHubsList.length > 0) {
      const lats = countryHubsList.map((h) => h.latitude);
      const lngs = countryHubsList.map((h) => h.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      mapRef.current?.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 80, duration: 800 }
      );
      setSelectedHub(null);
    }
  }

  function handleSearchSelect(result: SearchResult) {
    setShowDropdown(false);
    setSearchQuery('');
    if (result.type === 'country' && result.country) {
      selectCountry(result.country);
    } else if (result.type === 'hub' && result.hub) {
      selectHub(result.hub);
    }
  }

  const countryStats = useMemo(() => {
    if (!selectedCountry) return null;
    const countryHubList = hubsByCountry.get(selectedCountry) ?? [];
    const hubIds = new Set(countryHubList.map((h) => h.id));
    const countrySellers = sellers.filter((s) => hubIds.has(s.hub_id));
    const countryItems = items.filter((i) => hubIds.has(i.hub_id));
    const totalVolume = countryHubList.reduce((s, h) => s + h.volume_24h, 0);
    return {
      hubCount: countryHubList.length,
      sellerCount: countrySellers.length,
      itemCount: countryItems.length,
      totalVolume,
      avgRating: countrySellers.length > 0
        ? (countrySellers.reduce((s, sel) => s + sel.rating, 0) / countrySellers.length).toFixed(1)
        : '0.0',
    };
  }, [selectedCountry, hubsByCountry, sellers, items]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Search bar - top center */}
      <div className="absolute left-1/2 top-4 z-20 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2.5 shadow-2xl backdrop-blur-md">
            <Search className="h-5 w-5 flex-shrink-0 text-emerald-400" />
            <input
              type="text"
              placeholder="Search countries, cities, or trade hubs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                className="text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowSidebar((v) => !v)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="Toggle location list"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>

          {/* Search dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/98 shadow-2xl backdrop-blur-md">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchSelect(result)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-800"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
                    {result.type === 'country' ? (
                      <Globe className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Store className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{result.label}</div>
                    <div className="truncate text-xs text-slate-500">{result.sublabel}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600" />
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchQuery.trim() && searchResults.length === 0 && (
            <div className="mt-1 rounded-xl border border-slate-700 bg-slate-900/98 px-3 py-4 text-center shadow-2xl backdrop-blur-md">
              <p className="text-sm text-slate-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - country & hub list */}
      {showSidebar && (
        <div className="absolute left-4 top-20 z-10 max-h-[calc(100%-6rem)] w-72 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Locations</h3>
          </div>

          {/* Category filter */}
          <div className="mb-3">
            <button
              onClick={() => setShowCategoryFilter((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
            >
              <span className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                {activeCategory === 'all' ? 'All Categories' : activeCategory}
              </span>
              <ChevronRight className={`h-3.5 w-3.5 transition ${showCategoryFilter ? 'rotate-90' : ''}`} />
            </button>
            {showCategoryFilter && (
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => { setActiveCategory('all'); setShowCategoryFilter(false); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition ${
                    activeCategory === 'all' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                  All Categories
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowCategoryFilter(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition ${
                      activeCategory === cat ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColors[cat] ?? '#64748b' }} />
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country list */}
          <div className="space-y-1">
            {countries.map((country) => {
              const countryHubsList = (hubsByCountry.get(country) ?? []).filter(
                (h) => activeCategory === 'all' || h.category === activeCategory
              );
              if (countryHubsList.length === 0) return null;
              const isExpanded = selectedCountry === country;
              return (
                <div key={country}>
                  <button
                    onClick={() => selectCountry(country)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isExpanded
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {country}
                    </span>
                    <span className="text-xs text-slate-500">{countryHubsList.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-700 pl-2">
                      {countryHubsList.map((hub) => (
                        <button
                          key={hub.id}
                          onClick={(e) => { e.stopPropagation(); selectHub(hub); }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
                            selectedHub?.id === hub.id
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div
                            className="h-2 w-2 flex-shrink-0 rounded-full"
                            style={{ background: categoryColors[hub.category] ?? '#64748b' }}
                          />
                          <span className="truncate">{hub.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Country stats banner */}
      {selectedCountry && countryStats && !selectedHub && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/95 px-5 py-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">{selectedCountry}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-xs">
              <Store className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-bold text-white">{countryStats.hubCount}</span>
              <span className="text-slate-500">Hubs</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-bold text-white">{countryStats.sellerCount}</span>
              <span className="text-slate-500">Sellers</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Package className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-bold text-white">{countryStats.itemCount}</span>
              <span className="text-slate-500">Items</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
              <span className="font-bold text-white">{countryStats.avgRating}</span>
              <span className="text-slate-500">Rating</span>
            </div>
          </div>
        </div>
      )}

      {/* Hub detail panel */}
      {selectedHub && (
        <div className="absolute right-4 top-20 z-10 max-h-[calc(100%-6rem)] w-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setSelectedHub(null)}
            className="absolute right-3 top-3 text-slate-400 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Hub header */}
          <div className="mb-3 pr-6">
            <div className="mb-1 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: categoryColors[selectedHub.category] ?? '#64748b' }}
              />
              <span className="text-[10px] font-medium text-slate-500">{selectedHub.region}</span>
            </div>
            <h3 className="text-base font-bold text-white">{selectedHub.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{selectedHub.description}</p>
          </div>

          {/* Stats grid */}
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-800 p-2">
              <div className="text-[10px] text-slate-500">Sellers</div>
              <div className="text-sm font-bold text-white">{selectedHub.total_sellers}</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-2">
              <div className="text-[10px] text-slate-500">Volume 24h</div>
              <div className="text-sm font-bold text-emerald-400">
                ${selectedHub.volume_24h.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-slate-800 p-2">
              <div className="text-[10px] text-slate-500">Category</div>
              <div className="text-sm font-bold text-white">{selectedHub.category}</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-2">
              <div className="text-[10px] text-slate-500">Items</div>
              <div className="text-sm font-bold text-white">{selectedHub.hubItems.length}</div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
            <Navigation className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-400">
              {selectedHub.latitude.toFixed(4)}, {selectedHub.longitude.toFixed(4)}
            </span>
          </div>

          {/* Sellers */}
          <div className="mb-3">
            <div className="mb-1.5 text-xs font-medium text-slate-400">
              Sellers ({selectedHub.hubSellers.length})
            </div>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {selectedHub.hubSellers.map((seller) => (
                <div key={seller.id} className="rounded-lg bg-slate-800/50 px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {seller.verified && <BadgeCheck className="h-3 w-3 flex-shrink-0 text-emerald-400" />}
                      <span className="truncate text-xs font-medium text-white">{seller.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-semibold text-white">{seller.rating}</span>
                    </div>
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-500">
                    {seller.category} - {seller.products_count} products
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-1.5 text-xs font-medium text-slate-400">
              Market Items ({selectedHub.hubItems.length})
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {selectedHub.hubItems.map((item) => {
                const locked = item.is_pro_signal && !isPro;
                const seller = sellersMap.get(item.seller_id);
                return (
                  <div key={item.id} className="rounded-lg bg-slate-800/50 px-2 py-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className={`truncate text-xs ${locked ? 'text-slate-500' : 'text-white'}`}>
                            {locked ? 'PRO Signal' : item.name}
                          </span>
                          {item.is_pro_signal && (
                            <span className="flex-shrink-0">
                              {isPro ? (
                                <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[8px] font-bold text-amber-400">PRO</span>
                              ) : (
                                <Lock className="h-2.5 w-2.5 text-amber-400/60" />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-500">
                          {locked ? 'Locked' : `${item.category}${seller ? ` - ${seller.name}` : ''}`}
                        </div>
                      </div>
                      {!locked && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xs font-bold text-white">${item.price.toLocaleString()}</div>
                          <div className="text-[9px] text-emerald-400">{item.margin_estimate}% margin</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-sm text-white shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            Loading trade data...
          </div>
        </div>
      )}
    </div>
  );
}
