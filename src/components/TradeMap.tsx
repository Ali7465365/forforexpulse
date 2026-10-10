import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Store, MapPin, BadgeCheck, TrendingUp, X, Star, Package } from 'lucide-react';
import { supabase, type TradeHub, type Seller, type MarketItem } from '@/lib/supabase';
import { usePro } from '@/context/ProContext';

const categoryColors: Record<string, string> = {
  Spices: '#f97316',
  'Spices & Textiles': '#f97316',
  Textiles: '#3b82f6',
  'Textiles & Spices': '#3b82f6',
  'Textiles & Consumer Goods': '#3b82f6',
  Electronics: '#22c55e',
  'Electronics & Manufacturing': '#22c55e',
  'Electronics & Imports': '#22c55e',
  'Precious Metals': '#eab308',
  Gems: '#a855f7',
  Leather: '#92400e',
  Manufacturing: '#06b6d4',
  'Commodities & Machinery': '#06b6d4',
  Commodities: '#06b6d4',
  Machinery: '#06b6d4',
  Metals: '#94a3b8',
  'Crafts & Textiles': '#ec4899',
  Crafts: '#ec4899',
  Produce: '#84cc16',
  'Consumer Goods': '#f43f5e',
  Imports: '#10b981',
  General: '#64748b',
};

function areaImageUrl(lat: number, lng: number, zoom = 15) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=600x280&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
}

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
            maxzoom: 19,
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
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
      attributionControl: {},
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ visualizePitch: false }), 'top-right');

    map.scrollZoom.enable();
    map.dragPan.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();

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

    const filteredSellers =
      selectedCategory === 'all'
        ? sellers
        : sellers.filter((s) => s.category === selectedCategory);

    const filteredHubs =
      selectedCategory === 'all'
        ? hubs
        : hubs.filter((h) => h.category === selectedCategory);

    if (showHubs) {
      filteredHubs.forEach((hub) => {
        const color = categoryColors[hub.category] ?? '#64748b';
        const el = document.createElement('div');
        el.style.cssText = `
          width: 34px; height: 34px; cursor: pointer;
          background: ${color}; border-radius: 50%;
          border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s;
        `;
        el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const hubSellers = sellers.filter((s) => s.hub_id === hub.id);
          const hubItems = items.filter((i) => i.hub_id === hub.id);
          setPopupData({ type: 'hub', hub, hubSellers, hubItems });
          map.flyTo({
            center: [hub.longitude, hub.latitude],
            zoom: 13,
            duration: 1000,
          });
        });

        const marker = new Marker({ element: el }).setLngLat([hub.longitude, hub.latitude]).addTo(map);
        markersRef.current.push(marker);
      });
    }

    if (showSellers) {
      filteredSellers.forEach((seller) => {
        const el = document.createElement('div');
        const sellerColor = seller.verified ? '#2563eb' : '#60a5fa';
        el.style.cssText = `
          width: 20px; height: 20px; cursor: pointer;
          background: ${sellerColor}; border-radius: 50%;
          border: 2px solid white; box-shadow: 0 1px 6px rgba(0,0,0,0.4);
          transition: transform 0.15s;
        `;
        el.title = seller.name;
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.35)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const sellerItems = items.filter((i) => i.seller_id === seller.id);
          setPopupData({ type: 'seller', seller, sellerItems });
          map.flyTo({
            center: [seller.longitude, seller.latitude],
            zoom: 15,
            duration: 900,
          });
        });

        const marker = new Marker({ element: el }).setLngLat([seller.longitude, seller.latitude]).addTo(map);
        markersRef.current.push(marker);
      });
    }
  }, [hubs, sellers, items, loading, selectedCategory, showHubs, showSellers]);

  const allCategories = Array.from(
    new Set([...hubs.map((h) => h.category), ...sellers.map((s) => s.category)])
  ).sort();

  const popupLat =
    popupData?.type === 'hub' ? popupData.hub.latitude : popupData?.type === 'seller' ? popupData.seller.latitude : 0;
  const popupLng =
    popupData?.type === 'hub' ? popupData.hub.longitude : popupData?.type === 'seller' ? popupData.seller.longitude : 0;

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <div ref={mapContainer} className="absolute inset-0" />

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
              <option key={cat} value={cat}>
                {cat}
              </option>
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
            Show Seller Pins (blue)
          </label>
        </div>

        <p className="mt-3 border-t border-slate-700 pt-3 text-[10px] text-slate-500">
          Scroll or use + / − to zoom. Click a pin to zoom in, see area map and details.
        </p>

        <div className="mt-3 border-t border-slate-700 pt-3">
          <div className="mb-2 text-xs font-medium text-slate-400">Legend</div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(categoryColors)
              .slice(0, 8)
              .map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  <span className="truncate text-[10px] text-slate-400">{cat}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-slate-700 pt-3">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          <span className="text-[10px] text-slate-400">Verified seller</span>
          <div className="ml-2 h-2.5 w-2.5 rounded-full bg-blue-400" />
          <span className="text-[10px] text-slate-400">Seller</span>
        </div>
      </div>

      {popupData && (
        <div className="absolute right-4 top-4 z-10 max-h-[calc(100vh-6rem)] w-96 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setPopupData(null)}
            className="absolute right-3 top-3 z-10 rounded-full bg-slate-800/90 p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative h-36 w-full overflow-hidden bg-slate-800">
            <img
              src={areaImageUrl(popupLat, popupLng, popupData.type === 'seller' ? 16 : 14)}
              alt="Area map"
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
              Area view · {popupLat.toFixed(4)}, {popupLng.toFixed(4)}
            </div>
          </div>

          <div className="p-4">
            {popupData.type === 'hub' && (
              <div>
                <div className="mb-2 flex items-center gap-2 pr-6">
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-full"
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
                <div className="mb-1 text-xs font-medium text-slate-400">Top items at this hub</div>
                <div className="max-h-36 space-y-1 overflow-y-auto">
                  {popupData.hubItems.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-slate-800/50 px-2 py-1.5"
                    >
                      <div className="flex min-w-0 items-center gap-1.5">
                        {item.is_pro_signal && !isPro ? (
                          <span className="text-xs text-amber-400">★</span>
                        ) : (
                          <TrendingUp className="h-3 w-3 flex-shrink-0 text-emerald-400" />
                        )}
                        <span className="truncate text-xs text-slate-300">
                          {item.is_pro_signal && !isPro ? 'PRO Signal — Locked' : item.name}
                        </span>
                      </div>
                      <span className="ml-2 flex-shrink-0 text-xs font-bold text-white">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {popupData.hubItems.length === 0 && (
                    <p className="text-xs text-slate-500">No items listed for this hub yet.</p>
                  )}
                </div>
              </div>
            )}

            {popupData.type === 'seller' && (
              <div>
                <div className="mb-2 flex items-center gap-2 pr-6">
                  {popupData.seller.verified && <BadgeCheck className="h-4 w-4 text-blue-400" />}
                  <h3 className="text-base font-bold text-white">{popupData.seller.name}</h3>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Category</div>
                    <div className="text-sm font-bold text-white">{popupData.seller.category}</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Rating</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      {popupData.seller.rating}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Products</div>
                    <div className="text-sm font-bold text-white">{popupData.seller.products_count}</div>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Status</div>
                    <div className="text-sm font-bold text-white">
                      {popupData.seller.verified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-400">
                  <Package className="h-3.5 w-3.5" /> Seller items
                </div>
                <div className="max-h-36 space-y-1 overflow-y-auto">
                  {popupData.sellerItems.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-slate-800/50 px-2 py-1.5"
                    >
                      <span className="truncate text-xs text-slate-300">
                        {item.is_pro_signal && !isPro ? 'PRO Signal — Locked' : item.name}
                      </span>
                      <span className="ml-2 flex-shrink-0 text-xs font-bold text-white">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {popupData.sellerItems.length === 0 && (
                    <p className="text-xs text-slate-500">No items linked to this seller.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}