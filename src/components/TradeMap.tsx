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
  karachi: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
  lahore: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop',
  islamabad: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cdad?w=800&h=400&fit=crop',
  sialkot: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop',
  shenzhen: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=400&fit=crop',
  shanghai: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=400&fit=crop',
  guangzhou: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=400&fit=crop',
  yiwu: 'https://images.unsplash.com/photo-1441984900005-37e0d0f4f8b0?w=800&h=400&fit=crop',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=400&fit=crop',
  mumbai: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=400&fit=crop',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=400&fit=crop',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=400&fit=crop',
  riyadh: 'https://images.unsplash.com/photo-1586724237569-f3e0c2015990?w=800&h=400&fit=crop',
};

function placePhoto(name: string, region?: string) {
  const key = name.toLowerCase();
  for (const [city, url] of Object.entries(CITY_PHOTOS)) {
    if (key.includes(city) || (region && region.toLowerCase().includes(city))) return url;
  }
  const seed = encodeURIComponent(name.slice(0, 24) || 'market');
  return `https://picsum.photos/seed/${seed}/800/400`;
}

function areaMapUrl(lat: number, lng: number, zoom = 15) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=600x240&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
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
        layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles' }],
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
      selectedCategory === 'all' ? sellers : sellers.filter((s) => s.category === selectedCategory);
    const filteredHubs =
      selectedCategory === 'all' ? hubs : hubs.filter((h) => h.category === selectedCategory);

    if (showHubs) {
      filteredHubs.forEach((hub) => {
        const color = categoryColors[hub.category] ?? '#64748b';
        const el = document.createElement('div');
        el.style.cssText = `width:34px;height:34px;cursor:pointer;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;`;
        el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setPopupData({
            type: 'hub',
            hub,
            hubSellers: sellers.filter((s) => s.hub_id === hub.id),
            hubItems: items.filter((i) => i.hub_id === hub.id),
          });
          map.flyTo({ center: [hub.longitude, hub.latitude], zoom: 13, duration: 1000 });
        });
        markersRef.current.push(new Marker({ element: el }).setLngLat([hub.longitude, hub.latitude]).addTo(map));
      });
    }

    if (showSellers) {
      filteredSellers.forEach((seller) => {
        const el = document.createElement('div');
        const sellerColor = seller.verified ? '#2563eb' : '#60a5fa';
        el.style.cssText = `width:20px;height:20px;cursor:pointer;background:${sellerColor};border-radius:50%;border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4);`;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setPopupData({
            type: 'seller',
            seller,
            sellerItems: items.filter((i) => i.seller_id === seller.id),
          });
          map.flyTo({ center: [seller.longitude, seller.latitude], zoom: 15, duration: 900 });
        });
        markersRef.current.push(new Marker({ element: el }).setLngLat([seller.longitude, seller.latitude]).addTo(map));
      });
    }
  }, [hubs, sellers, items, loading, selectedCategory, showHubs, showSellers]);

  const allCategories = Array.from(
    new Set([...hubs.map((h) => h.category), ...sellers.map((s) => s.category)])
  ).sort();

  const popupLat = popupData?.type === 'hub' ? popupData.hub.latitude : popupData?.seller.latitude ?? 0;
  const popupLng = popupData?.type === 'hub' ? popupData.hub.longitude : popupData?.seller.longitude ?? 0;
  const photoName =
    popupData?.type === 'hub' ? popupData.hub.name : popupData?.type === 'seller' ? popupData.seller.name : '';
  const photoRegion = popupData?.type === 'hub' ? popupData.hub.region : undefined;

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
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={showHubs} onChange={(e) => setShowHubs(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            Show Trade Hubs
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={showSellers} onChange={(e) => setShowSellers(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            Show Seller Pins (blue)
          </label>
        </div>
        <p className="mt-3 border-t border-slate-700 pt-3 text-[10px] text-slate-500">
          Click a pin for area photo, map view, and details. Scroll to zoom.
        </p>
      </div>

      {popupData && (
        <div className="absolute right-4 top-4 z-10 max-h-[calc(100vh-6rem)] w-96 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md">
          <button onClick={() => setPopupData(null)} className="absolute right-3 top-3 z-20 rounded-full bg-slate-800/90 p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>

          <img src={placePhoto(photoName, photoRegion)} alt="Area" className="h-36 w-full object-cover" loading="lazy" />
          <img
            src={areaMapUrl(popupLat, popupLng, popupData.type === 'seller' ? 16 : 14)}
            alt="Map"
            className="h-28 w-full border-t border-slate-800 object-cover"
            loading="lazy"
          />
          <div className="px-3 py-1 text-[10px] text-slate-500">
            Photo + map · {popupLat.toFixed(4)}, {popupLng.toFixed(4)}
          </div>

          <div className="p-4 pt-2">
            {popupData.type === 'hub' && (
              <div>
                <h3 className="mb-1 pr-6 text-base font-bold text-white">{popupData.hub.name}</h3>
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
                <div className="mb-2 flex items-center gap-2">
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