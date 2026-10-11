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

const CITY_PHOTOS: Record<string, string> = {
  karachi: 'https://images.unsplash.com/photo-1578898886225-c7c8940653f5?w=900&h=480&fit=crop&q=80',
  lahore: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&h=480&fit=crop&q=80',
  islamabad: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cdad?w=900&h=480&fit=crop&q=80',
  sialkot: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=480&fit=crop&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=480&fit=crop&q=80',
  shenzhen: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=900&h=480&fit=crop&q=80',
  shanghai: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=900&h=480&fit=crop&q=80',
  guangzhou: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=900&h=480&fit=crop&q=80',
  yiwu: 'https://images.unsplash.com/photo-1441984900005-37e0d0f4f8b0?w=900&h=480&fit=crop&q=80',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&h=480&fit=crop&q=80',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=900&h=480&fit=crop&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&h=480&fit=crop&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&h=480&fit=crop&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=480&fit=crop&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&h=480&fit=crop&q=80',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&h=480&fit=crop&q=80',
  riyadh: 'https://images.unsplash.com/photo-1586724237569-f3e0c2015990?w=900&h=480&fit=crop&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&h=480&fit=crop&q=80',
};

function placePhoto(name: string, region?: string) {
  const key = `${name} ${region || ''}`.toLowerCase();
  for (const [city, url] of Object.entries(CITY_PHOTOS)) {
    if (key.includes(city)) return url;
  }
  return `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=480&fit=crop&q=80`;
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

    // One clean map style (Carto Voyager) — clearer when zoomed than basic OSM
    const map = new MapLibreMap({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap © CARTO',
            maxzoom: 20,
          },
        },
        layers: [{ id: 'carto-layer', type: 'raster', source: 'carto' }],
      },
      center: [20, 15],
      zoom: 2.2,
      minZoom: 1.5,
      maxZoom: 18,
      attributionControl: { compact: true },
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
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
      selectedCategory === 'all' ? sellers : sellers.filter((s) => s.category === selectedCategory);
    const filteredHubs =
      selectedCategory === 'all' ? hubs : hubs.filter((h) => h.category === selectedCategory);

    if (showHubs) {
      filteredHubs.forEach((hub) => {
        const color = categoryColors[hub.category] ?? '#64748b';
        const el = document.createElement('div');
        el.style.cssText = `width:32px;height:32px;cursor:pointer;background:${color};border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;`;
        el.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setPopupData({
            type: 'hub',
            hub,
            hubSellers: sellers.filter((s) => s.hub_id === hub.id),
            hubItems: items.filter((i) => i.hub_id === hub.id),
          });
          map.flyTo({ center: [hub.longitude, hub.latitude], zoom: 12, duration: 900 });
        });
        markersRef.current.push(new Marker({ element: el }).setLngLat([hub.longitude, hub.latitude]).addTo(map));
      });
    }

    if (showSellers) {
      filteredSellers.forEach((seller) => {
        const el = document.createElement('div');
        el.style.cssText = `width:18px;height:18px;cursor:pointer;background:${seller.verified ? '#2563eb' : '#60a5fa'};border-radius:50%;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.35);`;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setPopupData({
            type: 'seller',
            seller,
            sellerItems: items.filter((i) => i.seller_id === seller.id),
          });
          map.flyTo({ center: [seller.longitude, seller.latitude], zoom: 14, duration: 900 });
        });
        markersRef.current.push(new Marker({ element: el }).setLngLat([seller.longitude, seller.latitude]).addTo(map));
      });
    }
  }, [hubs, sellers, items, loading, selectedCategory, showHubs, showSellers]);

  const allCategories = Array.from(
    new Set([...hubs.map((h) => h.category), ...sellers.map((s) => s.category)])
  ).sort();

  const photoName =
    popupData?.type === 'hub' ? popupData.hub.name : popupData?.type === 'seller' ? popupData.seller.name : '';
  const photoRegion = popupData?.type === 'hub' ? popupData.hub.region : undefined;

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {/* Single map only */}
      <div ref={mapContainer} className="absolute inset-0" />

      <div className="absolute left-4 top-4 z-10 w-72 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2">
          <Store className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Map Filters</h3>
        </div>
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
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
            <input type="checkbox" checked={showHubs} onChange={(e) => setShowHubs(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            Trade Hubs
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={showSellers} onChange={(e) => setShowSellers(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            <MapPin className="h-4 w-4 text-blue-400" /> Blue seller pins
          </label>
        </div>
        <p className="mt-3 border-t border-slate-700 pt-3 text-[10px] text-slate-500">
          One map · scroll to zoom · click pin for photo + details
        </p>
      </div>

      {popupData && (
        <div className="absolute right-4 top-4 z-10 max-h-[calc(100vh-6rem)] w-96 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setPopupData(null)}
            className="absolute right-3 top-3 z-20 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Single area image only */}
          <img
            src={placePhoto(photoName, photoRegion)}
            alt="Area"
            className="h-44 w-full object-cover"
            loading="lazy"
          />

          <div className="p-4">
            {popupData.type === 'hub' && (
              <div>
                <h3 className="mb-1 pr-8 text-base font-bold text-white">{popupData.hub.name}</h3>
                <p className="mb-3 text-xs text-slate-400">{popupData.hub.description}</p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Sellers</div><div className="text-sm font-bold text-white">{popupData.hub.total_sellers}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Volume 24h</div><div className="text-sm font-bold text-emerald-400">${popupData.hub.volume_24h.toLocaleString()}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Region</div><div className="text-sm font-bold text-white">{popupData.hub.region}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Category</div><div className="text-sm font-bold text-white">{popupData.hub.category}</div></div>
                </div>
                <div className="mb-1 text-xs font-medium text-slate-400">Top items</div>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {popupData.hubItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex justify-between rounded-lg bg-slate-800/50 px-2 py-1.5 text-xs">
                      <span className="truncate text-slate-300">{item.is_pro_signal && !isPro ? 'PRO Locked' : item.name}</span>
                      <span className="font-bold text-white">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {popupData.type === 'seller' && (
              <div>
                <div className="mb-2 flex items-center gap-2 pr-8">
                  {popupData.seller.verified && <BadgeCheck className="h-4 w-4 text-blue-400" />}
                  <h3 className="text-base font-bold text-white">{popupData.seller.name}</h3>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Category</div><div className="text-sm font-bold text-white">{popupData.seller.category}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Rating</div><div className="flex items-center gap-1 text-sm font-bold text-amber-400"><Star className="h-3.5 w-3.5 fill-amber-400" />{popupData.seller.rating}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Products</div><div className="text-sm font-bold text-white">{popupData.seller.products_count}</div></div>
                  <div className="rounded-lg bg-slate-800 p-2"><div className="text-[10px] text-slate-500">Status</div><div className="text-sm font-bold text-white">{popupData.seller.verified ? 'Verified' : 'Unverified'}</div></div>
                </div>
                <div className="mb-1 flex items-center gap-1 text-xs text-slate-400"><Package className="h-3.5 w-3.5" /> Items</div>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {popupData.sellerItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex justify-between rounded-lg bg-slate-800/50 px-2 py-1.5 text-xs">
                      <span className="truncate text-slate-300">{item.is_pro_signal && !isPro ? 'PRO Locked' : item.name}</span>
                      <span className="font-bold text-white">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}