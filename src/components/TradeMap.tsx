import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Store, MapPin, Star, BadgeCheck, Package, TrendingUp, X } from 'lucide-react';
import { supabase, type TradeHub, type Seller, type MarketItem } from '@/lib/supabase';
import { usePro } from '@/context/ProContext';

const categoryColors: Record<string, string> = {
  'Spices': '#f97316',
  'Spices & Textiles': '#f97316',
  'Textiles': '#3b82f6',
  'Textiles & Spices': '#3b82f6',
  'Textiles & Consumer Goods': '#3b82f6',
  'Electronics': '#22c55e',
  'Electronics & Manufacturing': '#22c55e',
  'Electronics & Imports': '#22c55e',
  'Precious Metals': '#eab308',
  'Gems': '#a855f7',
  'Leather': '#92400e',
  'Manufacturing': '#06b6d4',
  'Commodities & Machinery': '#06b6d4',
  'Commodities': '#06b6d4',
  'Machinery': '#06b6d4',
  'Metals': '#94a3b8',
  'Crafts & Textiles': '#ec4899',
  'Crafts': '#ec4899',
  'Produce': '#84cc16',
  'Consumer Goods': '#f43f5e',
  'Imports': '#10b981',
  'General': '#64748b',
};

export default function TradeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [hubs, setHubs] = useState<TradeHub[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSellers, setShowSellers] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [popupData, setPopupData] = useState<
    | { type: 'hub'; hub: TradeHub; hubSellers: Seller[]; hubItems: MarketItem[] }
    | { type: 'seller'; seller: Seller; sellerItems: MarketItem[] }
    | null
  >(null);

  const { isPro } = usePro();

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
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
          },
        ],
      },
      center: [20, 15],
      zoom: 1.8,
      attributionControl: {},
    });

    mapRef.current = map;
    map.addControl(new NavigationControl(), 'top-right');

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

    const filteredSellers = selectedCategory === 'all'
      ? sellers
      : sellers.filter((s) => s.category === selectedCategory);

    const filteredHubs = selectedCategory === 'all'
      ? hubs
      : hubs.filter((h) => h.category === selectedCategory);

    if (showHubs) {
      filteredHubs.forEach((hub) => {
        const color = categoryColors[hub.category] ?? '#64748b';
        const el = document.createElement('div');
        el.style.cssText = `
          width: 32px; height: 32px; cursor: pointer;
          background: ${color}; border-radius: 50%;
          border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s;
        `;
        el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        el.addEventListener('click', () => {
          const hubSellers = sellers.filter((s) => s.hub_id === hub.id);
          const hubItems = items.filter((i) => i.hub_id === hub.id);
          setPopupData({ type: 'hub', hub, hubSellers, hubItems });
          map.flyTo({ center: [hub.longitude, hub.latitude], zoom: 4, duration: 800 });
        });

        const marker = new Marker(el)
          .setLngLat([hub.longitude, hub.latitude])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }

    if (showSellers) {
      filteredSellers.forEach((seller) => {
        const el = document.createElement('div');
        const sellerColor = seller.verified ? '#22c55e' : '#94a3b8';
        el.style.cssText = `
          width: 18px; height: 18px; cursor: pointer;
          background: ${sellerColor}; border-radius: 50%;
          border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const sellerItems = items.filter((i) => i.seller_id === seller.id);
          setPopupData({ type: 'seller', seller, sellerItems });
        });

        const marker = new Marker(el)
          .setLngLat([seller.longitude, seller.latitude])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }
  }, [hubs, sellers, items, loading, selectedCategory, showHubs, showSellers]);

  const allCategories = Array.from(
    new Set([...hubs.map((h) => h.category), ...sellers.map((s) => s.category)])
  ).sort();

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map controls panel */}
      <div className="absolute left-4 top-4 z-10 w-72 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2">
          <Store className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Map Filters</h3>
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Category Filter</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showHubs}
              onChange={(e) => setShowHubs(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            <Store className="h-4 w-4 text-emerald-400" />
            Show Trade Hubs
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showSellers}
              onChange={(e) => setShowSellers(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            <MapPin className="h-4 w-4 text-blue-400" />
            Show Seller Pins
          </label>
        </div>

        <div className="mt-3 border-t border-slate-700 pt-3">
          <div className="mb-2 text-xs font-medium text-slate-400">Legend</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(categoryColors).slice(0, 8).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                <span className="truncate text-[10px] text-slate-400">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-slate-700 pt-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-400">Verified Seller</span>
          <div className="ml-2 h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="text-[10px] text-slate-400">Unverified</span>
        </div>
      </div>

      {/* Info popup */}
      {popupData && (
        <div className="absolute right-4 top-4 z-10 w-80 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setPopupData(null)}
            className="absolute right-3 top-3 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {popupData.type === 'hub' && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: categoryColors[popupData.hub.category] ?? '#64748b' }}
                />
                <h3 className="text-base font-bold text-white">{popupData.hub.name}</h3>
              </div>
              <p className="mb-3 text-xs text-slate-400">{popupData.hub.description}</p>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Sellers</div>
                  <div className="text-sm font-bold text-white">{popupData.hub.total_sellers}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Volume 24h</div>
                  <div className="text-sm font-bold text-emerald-400">
                    ${popupData.hub.volume_24h.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Region</div>
                  <div className="text-sm font-bold text-white">{popupData.hub.region}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Category</div>
                  <div className="text-sm font-bold text-white">{popupData.hub.category}</div>
                </div>
              </div>
              <div className="text-xs font-medium text-slate-400 mb-1">Top Items at this Hub</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {popupData.hubItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-slate-800/50 px-2 py-1.5"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {item.is_pro_signal && !isPro ? (
                        <span className="text-amber-400 text-xs">★</span>
                      ) : (
                        <TrendingUp className="h-3 w-3 flex-shrink-0 text-emerald-400" />
                      )}
                      <span className="truncate text-xs text-slate-300">
                        {item.is_pro_signal && !isPro ? 'PRO Signal — Locked' : item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white ml-2 flex-shrink-0">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {popupData.type === 'seller' && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                {popupData.seller.verified && <BadgeCheck className="h-4 w-4 text-emerald-400" />}
                <h3 className="text-base font-bold text-white">{popupData.seller.name}</h3>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Rating</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-white">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {popupData.seller.rating}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Products</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-white">
                    <Package className="h-3 w-3" />
                    {popupData.seller.products_count}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Category</div>
                  <div className="text-sm font-bold text-white">{popupData.seller.category}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-2">
                  <div className="text-[10px] text-slate-500">Status</div>
                  <div className={`text-sm font-bold ${popupData.seller.verified ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {popupData.seller.verified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </div>
              {popupData.sellerItems.length > 0 && (
                <>
                  <div className="text-xs font-medium text-slate-400 mb-1">Products</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {popupData.sellerItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-slate-800/50 px-2 py-1.5"
                      >
                        <span className="truncate text-xs text-slate-300">
                          {item.is_pro_signal && !isPro ? '★ PRO Signal — Locked' : item.name}
                        </span>
                        <span className="text-xs font-bold text-white ml-2 flex-shrink-0">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
          <div className="rounded-xl bg-slate-900 px-6 py-4 text-sm text-white shadow-2xl">
            Loading trade data...
          </div>
        </div>
      )}
    </div>
  );
}

