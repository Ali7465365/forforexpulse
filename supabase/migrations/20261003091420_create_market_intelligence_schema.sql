/*
# Market Intelligence & Trading Platform Schema

## Overview
Creates the core data tables for a market intelligence platform where users can view trade hubs, sellers, market items, generate API keys, and earn PRO access by watching ads.

## New Tables

### 1. trade_hubs
- `id` (uuid, PK): unique identifier
- `name` (text): name of the trade hub (e.g., "Silk Road Market")
- `region` (text): geographic region (e.g., "Southeast Asia")
- `latitude` (numeric): map latitude coordinate
- `longitude` (numeric): map longitude coordinate
- `description` (text): short description of the hub
- `total_sellers` (int): number of active sellers at this hub
- `volume_24h` (numeric): total trade volume in the last 24 hours (USD)
- `category` (text): primary trade category (e.g., "Textiles", "Spices")
- `created_at` (timestamptz): creation timestamp

### 2. sellers
- `id` (uuid, PK): unique identifier
- `hub_id` (uuid, FK -> trade_hubs.id): which hub the seller belongs to
- `name` (text): seller display name
- `latitude` (numeric): map latitude
- `longitude` (numeric): map longitude
- `rating` (numeric): seller rating 0-5
- `products_count` (int): number of products listed
- `category` (text): primary product category
- `verified` (boolean): whether the seller is verified
- `created_at` (timestamptz): creation timestamp

### 3. market_items
- `id` (uuid, PK): unique identifier
- `hub_id` (uuid, FK -> trade_hubs.id): hub where item is sold
- `seller_id` (uuid, FK -> sellers.id): seller offering the item
- `name` (text): item name
- `category` (text): product category
- `price` (numeric): asking price in USD
- `supply_level` (int): local supply quantity (1-100)
- `competitor_count` (int): number of competing sellers
- `demand_score` (int): demand rating 1-100
- `margin_estimate` (numeric): estimated profit margin percentage
- `is_pro_signal` (boolean): whether this is an exclusive PRO-only high-margin signal
- `created_at` (timestamptz): creation timestamp

### 4. api_keys
- `id` (uuid, PK): unique identifier
- `key_name` (text): human-friendly label for the key
- `api_key` (text): the actual API key string (prefixed "mt_")
- `rate_limit` (int): requests per hour limit
- `requests_this_hour` (int): current hour's request count
- `total_requests` (bigint): lifetime request count
- `status` (text): 'active' or 'revoked'
- `created_at` (timestamptz): creation timestamp

### 5. pro_passes
- `id` (uuid, PK): unique identifier
- `ads_watched` (int): number of ads watched so far (0-5)
- `unlocked` (boolean): whether PRO access has been unlocked
- `unlocked_at` (timestamptz): when PRO was unlocked
- `expires_at` (timestamptz): when the 7-day pass expires
- `created_at` (timestamptz): creation timestamp

### 6. ad_views
- `id` (uuid, PK): unique identifier
- `pro_pass_id` (uuid, FK -> pro_passes.id): which pass this ad view counts toward
- `ad_number` (int): which ad (1-5)
- `ad_title` (text): simulated ad title
- `advertiser` (text): simulated advertiser name
- `watched_at` (timestamptz): when the ad was watched

## Security
- RLS enabled on all tables.
- All tables use TO anon, authenticated with USING(true) / WITH CHECK(true) since this is a single-tenant public app with no sign-in.
*/

-- Trade Hubs
CREATE TABLE IF NOT EXISTS trade_hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  description text DEFAULT '',
  total_sellers int NOT NULL DEFAULT 0,
  volume_24h numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trade_hubs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_trade_hubs" ON trade_hubs;
CREATE POLICY "anon_select_trade_hubs" ON trade_hubs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_trade_hubs" ON trade_hubs;
CREATE POLICY "anon_insert_trade_hubs" ON trade_hubs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_trade_hubs" ON trade_hubs;
CREATE POLICY "anon_update_trade_hubs" ON trade_hubs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_trade_hubs" ON trade_hubs;
CREATE POLICY "anon_delete_trade_hubs" ON trade_hubs FOR DELETE TO anon, authenticated USING (true);

-- Sellers
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES trade_hubs(id) ON DELETE CASCADE,
  name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  rating numeric DEFAULT 0,
  products_count int DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sellers" ON sellers;
CREATE POLICY "anon_select_sellers" ON sellers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sellers" ON sellers;
CREATE POLICY "anon_insert_sellers" ON sellers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sellers" ON sellers;
CREATE POLICY "anon_update_sellers" ON sellers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sellers" ON sellers;
CREATE POLICY "anon_delete_sellers" ON sellers FOR DELETE TO anon, authenticated USING (true);

-- Market Items
CREATE TABLE IF NOT EXISTS market_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES trade_hubs(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES sellers(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  price numeric NOT NULL DEFAULT 0,
  supply_level int NOT NULL DEFAULT 50,
  competitor_count int NOT NULL DEFAULT 0,
  demand_score int NOT NULL DEFAULT 50,
  margin_estimate numeric NOT NULL DEFAULT 0,
  is_pro_signal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE market_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_market_items" ON market_items;
CREATE POLICY "anon_select_market_items" ON market_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_market_items" ON market_items;
CREATE POLICY "anon_insert_market_items" ON market_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_market_items" ON market_items;
CREATE POLICY "anon_update_market_items" ON market_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_market_items" ON market_items;
CREATE POLICY "anon_delete_market_items" ON market_items FOR DELETE TO anon, authenticated USING (true);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  api_key text UNIQUE NOT NULL,
  rate_limit int NOT NULL DEFAULT 1000,
  requests_this_hour int NOT NULL DEFAULT 0,
  total_requests bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_api_keys" ON api_keys;
CREATE POLICY "anon_select_api_keys" ON api_keys FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_api_keys" ON api_keys;
CREATE POLICY "anon_insert_api_keys" ON api_keys FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_api_keys" ON api_keys;
CREATE POLICY "anon_update_api_keys" ON api_keys FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_api_keys" ON api_keys;
CREATE POLICY "anon_delete_api_keys" ON api_keys FOR DELETE TO anon, authenticated USING (true);

-- PRO Passes
CREATE TABLE IF NOT EXISTS pro_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ads_watched int NOT NULL DEFAULT 0,
  unlocked boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pro_passes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_pro_passes" ON pro_passes;
CREATE POLICY "anon_select_pro_passes" ON pro_passes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_pro_passes" ON pro_passes;
CREATE POLICY "anon_insert_pro_passes" ON pro_passes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_pro_passes" ON pro_passes;
CREATE POLICY "anon_update_pro_passes" ON pro_passes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_pro_passes" ON pro_passes;
CREATE POLICY "anon_delete_pro_passes" ON pro_passes FOR DELETE TO anon, authenticated USING (true);

-- Ad Views
CREATE TABLE IF NOT EXISTS ad_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_pass_id uuid REFERENCES pro_passes(id) ON DELETE CASCADE,
  ad_number int NOT NULL,
  ad_title text NOT NULL,
  advertiser text NOT NULL,
  watched_at timestamptz DEFAULT now()
);

ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_ad_views" ON ad_views;
CREATE POLICY "anon_select_ad_views" ON ad_views FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ad_views" ON ad_views;
CREATE POLICY "anon_insert_ad_views" ON ad_views FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ad_views" ON ad_views;
CREATE POLICY "anon_update_ad_views" ON ad_views FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ad_views" ON ad_views;
CREATE POLICY "anon_delete_ad_views" ON ad_views FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sellers_hub_id ON sellers(hub_id);
CREATE INDEX IF NOT EXISTS idx_market_items_hub_id ON market_items(hub_id);
CREATE INDEX IF NOT EXISTS idx_market_items_seller_id ON market_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_items_pro_signal ON market_items(is_pro_signal);
CREATE INDEX IF NOT EXISTS idx_ad_views_pro_pass_id ON ad_views(pro_pass_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
