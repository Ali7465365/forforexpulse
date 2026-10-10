import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TradeHub = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  total_sellers: number;
  volume_24h: number;
  category: string;
  created_at: string;
};

export type Seller = {
  id: string;
  hub_id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  products_count: number;
  category: string;
  verified: boolean;
  created_at: string;
};

export type MarketItem = {
  id: string;
  hub_id: string;
  seller_id: string;
  name: string;
  category: string;
  price: number;
  supply_level: number;
  competitor_count: number;
  demand_score: number;
  margin_estimate: number;
  is_pro_signal: boolean;
  created_at: string;
};

export type ApiKey = {
  id: string;
  key_name: string;
  api_key: string;
  rate_limit: number;
  requests_this_hour: number;
  total_requests: number;
  status: string;
  created_at: string;
};

export type ProPass = {
  id: string;
  ads_watched: number;
  unlocked: boolean;
  unlocked_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type AdView = {
  id: string;
  pro_pass_id: string;
  ad_number: number;
  ad_title: string;
  advertiser: string;
  watched_at: string;
};
