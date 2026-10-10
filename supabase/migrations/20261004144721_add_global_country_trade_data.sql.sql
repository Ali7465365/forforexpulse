/*
# Add Global Trade Data for Many Countries

## Overview
Adds trade hubs, sellers, and market items for 30+ additional countries across 
all continents (Europe, Asia, Africa, Americas, Oceania, Middle East). All names 
are in English. This gives the Explore page comprehensive global coverage.

## Tables affected:
- trade_hubs: ~30 new hubs in new countries
- sellers: 2-3 sellers per new hub
- market_items: 2-4 items per new seller, including some PRO signals

## Security
- No schema changes — uses existing tables with existing RLS policies.
*/

-- ============ EUROPE ============

-- United Kingdom - London
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000001', 'London Wholesale Market', 'United Kingdom', 51.5074, -0.1278, 'Major European hub for finance, fashion, and consumer goods', 1800, 2900000, 'Consumer Goods')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'London Fashion House', 51.5080, -0.1285, 4.6, 85, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Thames Electronics', 51.5065, -0.1270, 4.3, 62, 'Electronics', true),
('c2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'British Tea Merchants', 51.5072, -0.1290, 4.7, 28, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'Designer Handbag Collection', 'Consumer Goods', 2800, 12, 3, 91, 46, true),
('c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'Wool Coat Premium', 'Consumer Goods', 450, 40, 8, 55, 18, false),
('c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'Gaming Laptop Pro', 'Electronics', 1800, 20, 5, 85, 30, false),
('c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000002', 'Wireless Earbuds Bulk 200', 'Electronics', 3200, 15, 4, 88, 42, true),
('c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000003', 'Earl Grey Tea 10kg', 'Commodities', 85, 70, 12, 40, 12, false)
ON CONFLICT DO NOTHING;

-- Germany - Berlin
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000002', 'Berlin Trade Center', 'Germany', 52.5200, 13.4050, 'European hub for machinery, automotive parts, and electronics', 1500, 2400000, 'Machinery')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Berlin Auto Parts', 52.5205, 13.4055, 4.5, 95, 'Machinery', true),
('c2000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'German Precision Tools', 52.5195, 13.4045, 4.8, 42, 'Machinery', true),
('c2000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Munich Electronics Co', 52.5210, 13.4060, 4.2, 68, 'Electronics', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000004', 'BMW Engine Parts Kit', 'Machinery', 5200, 10, 2, 93, 50, true),
('c1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000004', 'Brake Pad Set', 'Machinery', 180, 65, 10, 45, 15, false),
('c1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000005', 'Precision Drill Set', 'Machinery', 750, 18, 3, 87, 44, true),
('c1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000006', 'Smartphone Display Modules', 'Electronics', 4200, 22, 6, 78, 28, false)
ON CONFLICT DO NOTHING;

-- France - Paris
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000003', 'Paris Fashion District', 'France', 48.8566, 2.3522, 'World capital of fashion, luxury goods, and cosmetics', 2200, 3800000, 'Consumer Goods')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'Paris Luxury Goods', 48.8570, 2.3525, 4.9, 52, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'French Cosmetics Co', 48.8560, 2.3518, 4.6, 78, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'Champagne Valley Wines', 48.8575, 2.3530, 4.7, 35, 'Commodities', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000007', 'Luxury Leather Handbag', 'Consumer Goods', 4500, 5, 2, 96, 55, true),
('c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000007', 'Silk Scarf Premium', 'Consumer Goods', 320, 30, 6, 60, 22, false),
('c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000008', 'Premium Skincare Set', 'Consumer Goods', 280, 25, 5, 84, 38, true),
('c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000008', 'Perume 50ml Batch 100', 'Consumer Goods', 150, 60, 12, 42, 14, false),
('c1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000009', 'Vintage Champagne 12 Bottles', 'Commodities', 1200, 8, 2, 92, 48, true)
ON CONFLICT DO NOTHING;

-- Italy - Milan
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000004', 'Milan Fashion Market', 'Italy', 45.4642, 9.1900, 'Global hub for luxury fashion, leather goods, and design', 1900, 3100000, 'Consumer Goods')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'Milan Leather Works', 45.4645, 9.1905, 4.8, 58, 'Leather', true),
('c2000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000004', 'Italian Fashion Group', 45.4638, 9.1895, 4.6, 72, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000004', 'Tuscany Wine Exporters', 45.4650, 9.1910, 4.4, 30, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000010', 'Handcrafted Leather Bag', 'Leather', 1200, 10, 3, 90, 45, true),
('c1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000010', 'Leather Belt Premium', 'Leather', 85, 55, 10, 48, 16, false),
('c1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000011', 'Designer Suit Premium', 'Consumer Goods', 2800, 8, 2, 94, 52, true),
('c1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000012', 'Tuscan Red Wine 12 Bottles', 'Commodities', 340, 35, 6, 65, 20, false)
ON CONFLICT DO NOTHING;

-- Spain - Madrid
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000005', 'Madrid Trade Hub', 'Spain', 40.4168, -3.7038, 'Southern European hub for textiles, olive oil, and ceramics', 1100, 850000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000005', 'Madrid Textile Co', 40.4170, -3.7040, 4.3, 88, 'Textiles', true),
('c2000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000005', 'Spanish Olive Oil Co', 40.4165, -3.7035, 4.7, 45, 'Commodities', true),
('c2000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000005', 'Andalusia Ceramics', 40.4175, -3.7045, 4.2, 38, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000013', 'Spanish Wool Blanket', 'Textiles', 120, 45, 7, 58, 20, false),
('c1000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000014', 'Extra Virgin Olive Oil 200L', 'Commodities', 680, 25, 4, 85, 36, true),
('c1000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000014', 'Saffron Threads 100g', 'Spices', 550, 10, 2, 95, 53, true),
('c1000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000015', 'Handmade Ceramic Tile Set', 'Crafts', 210, 40, 8, 50, 18, false)
ON CONFLICT DO NOTHING;

-- ============ ASIA ============

-- Japan - Tokyo
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000006', 'Tokyo Trade Center', 'Japan', 35.6762, 139.6503, 'Asian tech hub for electronics, robotics, and precision instruments', 2600, 4500000, 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000006', 'Tokyo Electronics Group', 35.6765, 139.6505, 4.8, 110, 'Electronics', true),
('c2000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000006', 'Japan Robotics Co', 35.6758, 139.6500, 4.7, 32, 'Machinery', true),
('c2000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000006', 'Kyoto Craft Guild', 35.6770, 139.6510, 4.5, 48, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000016', '4K Display Panels Batch 50', 'Electronics', 8500, 12, 3, 92, 48, true),
('c1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000016', 'Camera Sensor Modules 100', 'Electronics', 3200, 20, 5, 82, 32, false),
('c1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000017', 'Industrial Robot Arm Pro', 'Machinery', 22000, 5, 2, 95, 52, true),
('c1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000017', 'Precision Sensor Kit', 'Machinery', 890, 30, 6, 68, 25, false),
('c1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000018', 'Handmade Japanese Knife Set', 'Crafts', 450, 15, 3, 88, 42, true)
ON CONFLICT DO NOTHING;

-- South Korea - Seoul
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000007', 'Seoul Tech Market', 'South Korea', 37.5665, 126.9780, 'Asian hub for semiconductors, displays, and K-beauty products', 2100, 3900000, 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000007', 'Seoul Semiconductor', 37.5668, 126.9783, 4.7, 95, 'Electronics', true),
('c2000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000007', 'K-Beauty Cosmetics', 37.5662, 126.9777, 4.6, 120, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000007', 'Korean Textile Co', 37.5670, 126.9785, 4.2, 65, 'Textiles', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000019', 'Memory Chips Batch 1000', 'Electronics', 12000, 8, 3, 94, 50, true),
('c1000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000019', 'OLED Panels 200 Units', 'Electronics', 6800, 15, 4, 86, 35, false),
('c1000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000020', 'K-Beauty Skincare Set 500', 'Consumer Goods', 2800, 18, 5, 89, 40, true),
('c1000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000020', 'BB Cream Bulk 1000', 'Consumer Goods', 120, 75, 15, 35, 10, false)
ON CONFLICT DO NOTHING;

-- Singapore
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000008', 'Singapore Trade Port', 'Singapore', 1.3521, 103.8198, 'Major Southeast Asian port for electronics, commodities, and finance', 3200, 5500000, 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000008', 'Singapore Electronics Hub', 1.3525, 103.8200, 4.7, 140, 'Electronics', true),
('c2000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000008', 'Malacca Commodities', 1.3518, 103.8195, 4.4, 58, 'Commodities', true),
('c2000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000008', 'Lion City Goods', 1.3530, 103.8205, 4.3, 82, 'Consumer Goods', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000022', 'Semiconductor Wafers 100', 'Electronics', 15000, 8, 2, 96, 54, true),
('c1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000022', 'Phone Cases Bulk 5000', 'Electronics', 250, 90, 20, 28, 8, false),
('c1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000023', 'Palm Oil 5 Tons', 'Commodities', 4200, 30, 5, 75, 22, false),
('c1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000023', 'Rare Timber Batch', 'Commodities', 8800, 10, 2, 93, 49, true),
('c1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000024', 'Designer Watch Collection', 'Consumer Goods', 3200, 12, 3, 87, 41, true)
ON CONFLICT DO NOTHING;

-- Vietnam - Ho Chi Minh City
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000009', 'Ho Chi Minh Trade Hub', 'Vietnam', 10.8231, 106.6297, 'Fast-growing hub for textiles, footwear, and coffee exports', 1800, 1100000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000009', 'Vietnam Textile Group', 10.8235, 106.6300, 4.4, 105, 'Textiles', true),
('c2000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000009', 'Saigon Coffee Co', 10.8228, 106.6293, 4.6, 48, 'Commodities', true),
('c2000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000009', 'Vietnam Footwear', 10.8240, 106.6305, 4.2, 72, 'Consumer Goods', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000025', 'Premium Cotton Fabric Roll', 'Textiles', 180, 50, 8, 62, 22, false),
('c1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000025', 'Silk Fabric Premium 100m', 'Textiles', 850, 12, 3, 90, 44, true),
('c1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000026', 'Robusta Coffee Beans 1 Ton', 'Commodities', 2800, 35, 5, 78, 28, false),
('c1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000026', 'Premium Arabica Coffee 500kg', 'Commodities', 5200, 10, 2, 94, 50, true),
('c1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000027', 'Sneakers Bulk 500 Pairs', 'Consumer Goods', 3500, 25, 6, 80, 33, true)
ON CONFLICT DO NOTHING;

-- Indonesia - Jakarta
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000010', 'Jakarta Trade Market', 'Indonesia', -6.2088, 106.8456, 'Southeast Asian hub for textiles, rubber, and palm oil', 1600, 920000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000028', 'c1000000-0000-0000-0000-000000000010', 'Jakarta Textile Market', -6.2090, 106.8460, 4.3, 85, 'Textiles', true),
('c2000000-0000-0000-0000-000000000029', 'c1000000-0000-0000-0000-000000000010', 'Indonesia Rubber Co', -6.2085, 106.8452, 4.5, 52, 'Commodities', true),
('c2000000-0000-0000-0000-000000000030', 'c1000000-0000-0000-0000-000000000010', 'Bali Crafts Export', -6.2095, 106.8465, 4.4, 40, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000028', 'Batik Fabric 500m', 'Textiles', 420, 35, 6, 72, 28, false),
('c1000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000029', 'Natural Rubber 2 Tons', 'Commodities', 3100, 28, 5, 76, 25, false),
('c1000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000029', 'Premium Palm Oil 10 Tons', 'Commodities', 8500, 15, 3, 89, 40, true),
('c1000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000030', 'Hand carved Wood Statue', 'Crafts', 280, 12, 3, 85, 38, true)
ON CONFLICT DO NOTHING;

-- ============ MIDDLE EAST ============

-- Saudi Arabia - Riyadh
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000011', 'Riyadh Trade Center', 'Saudi Arabia', 24.7136, 46.6753, 'Gulf hub for oil products, construction materials, and dates', 1300, 3400000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000031', 'c1000000-0000-0000-0000-000000000011', 'Gulf Oil Products', 24.7140, 46.6755, 4.5, 38, 'Commodities', true),
('c2000000-0000-0000-0000-000000000032', 'c1000000-0000-0000-0000-000000000011', 'Riyadh Construction Co', 24.7132, 46.6750, 4.3, 65, 'Machinery', true),
('c2000000-0000-0000-0000-000000000033', 'c1000000-0000-0000-0000-000000000011', 'Arabian Dates Co', 24.7145, 46.6760, 4.7, 42, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000031', 'Refined Petroleum 100 Barrels', 'Commodities', 8500, 20, 4, 82, 30, false),
('c1000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000031', 'Petrochemical Batch Premium', 'Commodities', 14000, 8, 2, 95, 51, true),
('c1000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000032', 'Steel Beams 5 Tons', 'Machinery', 4200, 30, 6, 68, 22, false),
('c1000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000033', 'Premium Ajwa Dates 50kg', 'Commodities', 680, 15, 3, 88, 40, true)
ON CONFLICT DO NOTHING;

-- Qatar - Doha
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000012', 'Doha Trade Hub', 'Qatar', 25.2854, 51.5310, 'Gulf hub for LNG, luxury goods, and pearl jewelry', 850, 2100000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000034', 'c1000000-0000-0000-0000-000000000012', 'Qatar Energy Co', 25.2858, 51.5313, 4.6, 25, 'Commodities', true),
('c2000000-0000-0000-0000-000000000035', 'c1000000-0000-0000-0000-000000000012', 'Doha Luxury Goods', 25.2850, 51.5307, 4.5, 48, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000036', 'c1000000-0000-0000-0000-000000000012', 'Gulf Pearl Trading', 25.2862, 51.5317, 4.3, 32, 'Gold & Gems', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000034', 'LNG Shipment 1000 Tons', 'Commodities', 22000, 10, 2, 94, 48, true),
('c1000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000035', 'Gold Jewelry Set', 'Gold & Gems', 3800, 12, 4, 85, 35, false),
('c1000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000036', 'Pearl Necklace Premium', 'Gold & Gems', 2200, 8, 2, 92, 46, true)
ON CONFLICT DO NOTHING;

-- Israel - Tel Aviv
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000013', 'Tel Aviv Tech Market', 'Israel', 32.0853, 34.7818, 'Startup hub for cybersecurity, software, and diamonds', 950, 2800000, 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000037', 'c1000000-0000-0000-0000-000000000013', 'Tel Aviv Cybersecurity', 32.0857, 34.7820, 4.8, 28, 'Electronics', true),
('c2000000-0000-0000-0000-000000000038', 'c1000000-0000-0000-0000-000000000013', 'Israel Diamond Exchange', 32.0848, 34.7815, 4.7, 42, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000039', 'c1000000-0000-0000-0000-000000000013', 'Mediterranean Software', 32.0862, 34.7823, 4.4, 55, 'Electronics', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000037', 'Security Software License 100', 'Electronics', 8500, 8, 2, 95, 52, true),
('c1000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000038', 'Cut Diamond 2 Carat', 'Gold & Gems', 18000, 3, 1, 98, 58, true),
('c1000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000038', 'Diamond Ring Set', 'Gold & Gems', 5500, 10, 3, 88, 40, false),
('c1000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000039', 'Mobile App Platform License', 'Electronics', 2200, 20, 5, 78, 30, false)
ON CONFLICT DO NOTHING;

-- ============ AFRICA ============

-- Egypt - Cairo
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000014', 'Cairo Trade Market', 'Egypt', 30.0444, 31.2357, 'North African hub for textiles, cotton, and antiquities', 1400, 720000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000040', 'c1000000-0000-0000-0000-000000000014', 'Cairo Cotton Co', 30.0448, 31.2360, 4.5, 72, 'Textiles', true),
('c2000000-0000-0000-0000-000000000041', 'c1000000-0000-0000-0000-000000000014', 'Nile Valley Spices', 30.0440, 31.2353, 4.3, 45, 'Spices', true),
('c2000000-0000-0000-0000-000000000042', 'c1000000-0000-0000-0000-000000000014', 'Egyptian Handicrafts', 30.0452, 31.2365, 4.2, 38, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000040', 'Egyptian Cotton 500kg', 'Textiles', 2200, 20, 4, 88, 40, true),
('c1000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000040', 'Cotton Bed Sheets Set', 'Textiles', 95, 65, 10, 48, 15, false),
('c1000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000041', 'Cumin Seeds 50kg', 'Spices', 180, 55, 8, 52, 18, false),
('c1000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000041', 'Premium Hibiscus Tea 20kg', 'Spices', 340, 18, 3, 86, 38, true),
('c1000000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000042', 'Papyrus Art Collection', 'Crafts', 220, 25, 5, 68, 25, false)
ON CONFLICT DO NOTHING;

-- South Africa - Johannesburg
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000015', 'Johannesburg Trade Hub', 'South Africa', -26.2041, 28.0473, 'Southern African hub for gold, diamonds, and minerals', 1100, 2600000, 'Gold & Gems')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000043', 'c1000000-0000-0000-0000-000000000015', 'South Africa Mining Co', -26.2045, 28.0475, 4.6, 35, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000044', 'c1000000-0000-0000-0000-000000000015', 'Johannesburg Diamonds', -26.2038, 28.0470, 4.7, 28, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000045', 'c1000000-0000-0000-0000-000000000015', 'Cape Wine Exporters', -26.2048, 28.0478, 4.4, 42, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000043', 'Gold Ore 1 Ton', 'Gold & Gems', 6800, 15, 4, 85, 32, false),
('c1000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000043', 'Platinum Batch Premium', 'Gold & Gems', 12000, 6, 2, 96, 52, true),
('c1000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000044', 'Rough Diamond 3 Carat', 'Gold & Gems', 15000, 4, 1, 97, 56, true),
('c1000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000044', 'Cut Diamond 1 Carat', 'Gold & Gems', 6500, 10, 3, 88, 40, false),
('c1000000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000045', 'South African Wine 24 Bottles', 'Commodities', 420, 40, 7, 62, 22, false)
ON CONFLICT DO NOTHING;

-- Kenya - Nairobi
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000016', 'Nairobi Trade Market', 'Kenya', -1.2921, 36.8219, 'East African hub for tea, coffee, and flowers', 850, 480000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000046', 'c1000000-0000-0000-0000-000000000016', 'Kenya Tea Exporters', -1.2925, 36.8222, 4.5, 38, 'Commodities', true),
('c2000000-0000-0000-0000-000000000047', 'c1000000-0000-0000-0000-000000000016', 'Nairobi Coffee Co', -1.2918, 36.8215, 4.6, 45, 'Commodities', true),
('c2000000-0000-0000-0000-000000000048', 'c1000000-0000-0000-0000-000000000016', 'Kenya Flower Export', -1.2928, 36.8225, 4.4, 52, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000046', 'Kenyan Black Tea 500kg', 'Commodities', 1800, 25, 4, 85, 36, true),
('c1000000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000047', 'AA Grade Coffee 200kg', 'Commodities', 2400, 15, 3, 90, 42, true),
('c1000000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000047', 'Roasted Coffee Beans 100kg', 'Commodities', 850, 40, 6, 65, 22, false),
('c1000000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000048', 'Rose Flowers 5000 Stems', 'Commodities', 680, 20, 5, 78, 28, false)
ON CONFLICT DO NOTHING;

-- Morocco - Casablanca
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000017', 'Casablanca Trade Hub', 'Morocco', 33.5731, -7.5898, 'North African hub for textiles, leather, and phosphates', 920, 580000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000049', 'c1000000-0000-0000-0000-000000000017', 'Morocco Leather Co', 33.5735, -7.5900, 4.4, 58, 'Leather', true),
('c2000000-0000-0000-0000-000000000050', 'c1000000-0000-0000-0000-000000000017', 'Casablanca Textile', 33.5728, -7.5895, 4.3, 72, 'Textiles', true),
('c2000000-0000-0000-0000-000000000051', 'c1000000-0000-0000-0000-000000000017', 'Marrakech Crafts', 33.5740, -7.5905, 4.5, 35, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000049', 'Moroccan Leather Pouf', 'Leather', 120, 35, 6, 65, 24, false),
('c1000000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000049', 'Premium Leather Bag Handmade', 'Leather', 480, 12, 3, 88, 40, true),
('c1000000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000050', 'Moroccan Wool Rug 2x3m', 'Textiles', 680, 15, 3, 87, 42, true),
('c1000000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000051', 'Brass Lantern Set', 'Crafts', 180, 22, 5, 70, 26, false)
ON CONFLICT DO NOTHING;

-- Ghana - Accra
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000018', 'Accra Trade Market', 'Ghana', 5.6037, -0.1870, 'West African hub for cocoa, gold, and kente textiles', 680, 380000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000052', 'c1000000-0000-0000-0000-000000000018', 'Ghana Cocoa Co', 5.6040, -0.1872, 4.5, 42, 'Commodities', true),
('c2000000-0000-0000-0000-000000000053', 'c1000000-0000-0000-0000-000000000018', 'Accra Gold Traders', 5.6032, -0.1867, 4.3, 28, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000054', 'c1000000-0000-0000-0000-000000000018', 'Kente Weavers Guild', 5.6045, -0.1875, 4.6, 32, 'Crafts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000052', 'Premium Cocoa Beans 2 Tons', 'Commodities', 5800, 12, 3, 92, 46, true),
('c1000000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000052', 'Cocoa Butter 500kg', 'Commodities', 2200, 25, 5, 78, 28, false),
('c1000000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000053', 'Gold Nugget 100g', 'Gold & Gems', 5800, 8, 3, 90, 38, false),
('c1000000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000054', 'Kente Cloth Premium', 'Crafts', 320, 10, 2, 89, 44, true)
ON CONFLICT DO NOTHING;

-- ============ AMERICAS ============

-- United States - New York
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000019', 'New York Trade Center', 'United States', 40.7128, -74.0060, 'Global financial hub for electronics, fashion, and commodities', 3800, 6200000, 'Consumer Goods')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000055', 'c1000000-0000-0000-0000-000000000019', 'NYC Fashion District', 40.7132, -74.0062, 4.6, 125, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000056', 'c1000000-0000-0000-0000-000000000019', 'Manhattan Electronics', 40.7125, -74.0057, 4.5, 95, 'Electronics', true),
('c2000000-0000-0000-0000-000000000057', 'c1000000-0000-0000-0000-000000000019', 'Wall Street Commodities', 40.7135, -74.0065, 4.7, 48, 'Commodities', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000055', 'Designer Sneakers Collection', 'Consumer Goods', 5500, 8, 2, 96, 52, true),
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000055', 'Premium Denim Jacket', 'Consumer Goods', 180, 55, 10, 52, 18, false),
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000056', 'Gaming GPU Batch 50', 'Electronics', 28000, 5, 2, 97, 55, true),
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000056', 'Smartphone Pro 100 Units', 'Electronics', 95000, 10, 3, 92, 35, false),
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000057', 'Gold Futures Contract', 'Commodities', 12000, 15, 4, 85, 30, false),
('c1000000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000057', 'Wheat Futures 100 Tons', 'Commodities', 8500, 20, 5, 78, 25, false)
ON CONFLICT DO NOTHING;

-- Canada - Toronto
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000020', 'Toronto Trade Hub', 'Canada', 43.6532, -79.3832, 'North American hub for timber, minerals, and technology', 1500, 1900000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000058', 'c1000000-0000-0000-0000-000000000020', 'Canadian Timber Co', 43.6535, -79.3835, 4.5, 62, 'Commodities', true),
('c2000000-0000-0000-0000-000000000059', 'c1000000-0000-0000-0000-000000000020', 'Toronto Tech Group', 43.6528, -79.3828, 4.4, 85, 'Electronics', true),
('c2000000-0000-0000-0000-000000000060', 'c1000000-0000-0000-0000-000000000020', 'Maple Products Co', 43.6540, -79.3838, 4.3, 28, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000058', 'Premium Lumber 10 Tons', 'Commodities', 4500, 25, 5, 78, 28, false),
('c1000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000058', 'Rare Canadian Maple Wood', 'Commodities', 7800, 8, 2, 93, 48, true),
('c1000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000059', 'AI Software Platform', 'Electronics', 15000, 5, 2, 95, 52, true),
('c1000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000059', 'Gaming Headsets 200', 'Electronics', 1800, 30, 8, 65, 22, false),
('c1000000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000060', 'Maple Syrup 500L', 'Commodities', 1200, 20, 4, 82, 35, true)
ON CONFLICT DO NOTHING;

-- Mexico - Mexico City
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000021', 'Mexico City Trade Market', 'Mexico', 19.4326, -99.1332, 'Latin American hub for silver, automotive parts, and tequila', 1700, 1400000, 'Gold & Gems')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000061', 'c1000000-0000-0000-0000-000000000021', 'Mexico Silver Co', 19.4330, -99.1335, 4.6, 45, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000062', 'c1000000-0000-0000-0000-000000000021', 'Mexico Auto Parts', 19.4322, -99.1328, 4.3, 78, 'Machinery', true),
('c2000000-0000-0000-0000-000000000063', 'c1000000-0000-0000-0000-000000000021', 'Tequila Valley Co', 19.4335, -99.1340, 4.7, 32, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000061', 'Silver Bars 1kg', 'Gold & Gems', 820, 18, 4, 85, 35, false),
('c1000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000061', 'Premium Silver Ore 100kg', 'Gold & Gems', 3400, 8, 2, 94, 48, true),
('c1000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000062', 'Auto Parts Kit Premium', 'Machinery', 2800, 15, 4, 88, 40, true),
('c1000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000062', 'Brake Discs 100 Sets', 'Machinery', 550, 50, 10, 55, 18, false),
('c1000000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000063', 'Premium Tequila 50 Bottles', 'Commodities', 1200, 15, 3, 87, 40, true)
ON CONFLICT DO NOTHING;

-- Argentina - Buenos Aires
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000022', 'Buenos Aires Trade Hub', 'Argentina', -34.6037, -58.3816, 'South American hub for beef, wheat, and leather', 1200, 780000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000064', 'c1000000-0000-0000-0000-000000000022', 'Argentina Beef Co', -34.6040, -58.3818, 4.5, 55, 'Commodities', true),
('c2000000-0000-0000-0000-000000000065', 'c1000000-0000-0000-0000-000000000022', 'Buenos Aires Leather', -34.6032, -58.3813, 4.4, 68, 'Leather', true),
('c2000000-0000-0000-0000-000000000066', 'c1000000-0000-0000-0000-000000000022', 'Pampas Grain Co', -34.6045, -58.3820, 4.3, 42, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000064', 'Premium Beef 5 Tons', 'Commodities', 12000, 10, 3, 92, 45, true),
('c1000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000064', 'Frozen Beef Cuts 1 Ton', 'Commodities', 3500, 30, 6, 72, 25, false),
('c1000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000065', 'Argentine Leather Jacket', 'Leather', 280, 25, 5, 75, 28, false),
('c1000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000065', 'Premium Leather Hide Batch', 'Leather', 1800, 10, 3, 89, 42, true),
('c1000000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000066', 'Wheat 50 Tons', 'Commodities', 8500, 20, 5, 75, 22, false)
ON CONFLICT DO NOTHING;

-- Chile - Santiago
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000023', 'Santiago Trade Market', 'Chile', -33.4489, -70.6693, 'South American hub for copper, lithium, and wine', 850, 1600000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000067', 'c1000000-0000-0000-0000-000000000023', 'Chile Copper Co', -33.4492, -70.6695, 4.6, 38, 'Commodities', true),
('c2000000-0000-0000-0000-000000000068', 'c1000000-0000-0000-0000-000000000023', 'Lithium Mining Co', -33.4485, -70.6690, 4.5, 25, 'Commodities', true),
('c2000000-0000-0000-0000-000000000069', 'c1000000-0000-0000-0000-000000000023', 'Chilean Wine Exporters', -33.4495, -70.6698, 4.4, 48, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000067', 'Copper 10 Tons', 'Commodities', 68000, 15, 4, 85, 30, false),
('c1000000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000068', 'Lithium Carbonate 5 Tons', 'Commodities', 45000, 6, 2, 96, 52, true),
('c1000000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000068', 'Battery Grade Lithium 1 Ton', 'Commodities', 12000, 10, 3, 92, 45, true),
('c1000000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000069', 'Chilean Red Wine 24 Bottles', 'Commodities', 380, 35, 7, 65, 22, false)
ON CONFLICT DO NOTHING;

-- Colombia - Bogota
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000024', 'Bogota Trade Hub', 'Colombia', 4.7110, -74.0721, 'South American hub for coffee, emeralds, and flowers', 980, 620000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000070', 'c1000000-0000-0000-0000-000000000024', 'Colombia Coffee Co', 4.7113, -74.0723, 4.7, 52, 'Commodities', true),
('c2000000-0000-0000-0000-000000000071', 'c1000000-0000-0000-0000-000000000024', 'Emerald Trading Co', 4.7107, -74.0718, 4.5, 28, 'Gold & Gems', true),
('c2000000-0000-0000-0000-000000000072', 'c1000000-0000-0000-0000-000000000024', 'Bogota Flower Export', 4.7115, -74.0725, 4.3, 45, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000070', 'Arabica Coffee 1 Ton', 'Commodities', 5200, 15, 3, 90, 42, true),
('c1000000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000070', 'Roasted Coffee 500kg', 'Commodities', 2800, 25, 5, 78, 28, false),
('c1000000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000071', 'Emerald 3 Carat Cut', 'Gold & Gems', 22000, 3, 1, 98, 58, true),
('c1000000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000071', 'Emerald Ring Set', 'Gold & Gems', 4800, 8, 3, 88, 40, false),
('c1000000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000072', 'Rose Bouquets 10000', 'Commodities', 1200, 20, 6, 75, 25, false)
ON CONFLICT DO NOTHING;

-- ============ OCEANIA ============

-- Australia - Sydney
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000025', 'Sydney Trade Hub', 'Australia', -33.8688, 151.2093, 'Oceania hub for minerals, wool, and wine', 1200, 2200000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000073', 'c1000000-0000-0000-0000-000000000025', 'Australian Mining Co', -33.8690, 151.2095, 4.5, 42, 'Commodities', true),
('c2000000-0000-0000-0000-000000000074', 'c1000000-0000-0000-0000-000000000025', 'Sydney Wool Exporters', -33.8685, 151.2090, 4.4, 58, 'Textiles', true),
('c2000000-0000-0000-0000-000000000075', 'c1000000-0000-0000-0000-000000000025', 'Barossa Wine Co', -33.8695, 151.2100, 4.6, 35, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000073', 'Iron Ore 50 Tons', 'Commodities', 8500, 20, 5, 80, 28, false),
('c1000000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000073', 'Rare Earth Elements 1 Ton', 'Commodities', 28000, 5, 2, 96, 54, true),
('c1000000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000074', 'Merino Wool 2 Tons', 'Textiles', 6800, 15, 4, 88, 38, true),
('c1000000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000074', 'Wool Yarn 500kg', 'Textiles', 2200, 30, 7, 68, 22, false),
('c1000000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000075', 'Premium Wine 24 Bottles', 'Commodities', 680, 18, 4, 85, 35, true)
ON CONFLICT DO NOTHING;

-- New Zealand - Auckland
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000026', 'Auckland Trade Market', 'New Zealand', -36.8485, 174.7633, 'Pacific hub for dairy, lamb, and wool', 680, 420000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000076', 'c1000000-0000-0000-0000-000000000026', 'NZ Dairy Co', -36.8488, 174.7635, 4.6, 48, 'Commodities', true),
('c2000000-0000-0000-0000-000000000077', 'c1000000-0000-0000-0000-000000000026', 'Kiwi Wool Exporters', -36.8482, 174.7630, 4.4, 35, 'Textiles', true),
('c2000000-0000-0000-0000-000000000078', 'c1000000-0000-0000-0000-000000000026', 'Pacific Lamb Co', -36.8490, 174.7638, 4.5, 28, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000076', 'Premium Milk Powder 2 Tons', 'Commodities', 5200, 12, 3, 90, 42, true),
('c1000000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000076', 'Butter 500kg', 'Commodities', 1800, 25, 5, 75, 25, false),
('c1000000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000077', 'Premium Wool 1 Ton', 'Textiles', 3500, 15, 4, 85, 36, true),
('c1000000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000078', 'Lamb Meat 3 Tons', 'Commodities', 8500, 10, 3, 88, 40, true)
ON CONFLICT DO NOTHING;

-- ============ MORE ASIA ============

-- Pakistan - Karachi
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000027', 'Karachi Trade Hub', 'Pakistan', 24.8607, 67.0011, 'South Asian hub for textiles, rice, and leather', 1300, 680000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000079', 'c1000000-0000-0000-0000-000000000027', 'Karachi Textile Group', 24.8610, 67.0013, 4.3, 95, 'Textiles', true),
('c2000000-0000-0000-0000-000000000080', 'c1000000-0000-0000-0000-000000000027', 'Pakistan Rice Co', 24.8603, 67.0008, 4.4, 62, 'Commodities', true),
('c2000000-0000-0000-0000-000000000081', 'c1000000-0000-0000-0000-000000000027', 'Sialkot Leather', 24.8615, 67.0017, 4.5, 48, 'Leather', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000079', 'Cotton Fabric 1000m', 'Textiles', 850, 45, 8, 68, 22, false),
('c1000000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000079', 'Premium Linen 500m', 'Textiles', 1800, 12, 3, 89, 42, true),
('c1000000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000080', 'Basmati Rice 5 Tons', 'Commodities', 4500, 20, 5, 82, 30, false),
('c1000000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000081', 'Premium Leather Jacket', 'Leather', 180, 22, 5, 78, 30, false),
('c1000000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000081', 'Soccer Ball Pro Batch 500', 'Consumer Goods', 3200, 10, 2, 93, 48, true)
ON CONFLICT DO NOTHING;

-- Bangladesh - Dhaka
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000028', 'Dhaka Garment Market', 'Bangladesh', 23.8103, 90.4125, 'Global hub for garment manufacturing and jute', 2800, 1100000, 'Textiles')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000082', 'c1000000-0000-0000-0000-000000000028', 'Dhaka Garment Group', 23.8105, 90.4127, 4.4, 180, 'Textiles', true),
('c2000000-0000-0000-0000-000000000083', 'c1000000-0000-0000-0000-000000000028', 'Bangladesh Jute Co', 23.8100, 90.4122, 4.3, 55, 'Commodities', true),
('c2000000-0000-0000-0000-000000000084', 'c1000000-0000-0000-0000-000000000028', 'Dhaka Leather Export', 23.8110, 90.4130, 4.2, 72, 'Leather', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000082', 'T-Shirt Bulk 10000', 'Textiles', 8500, 30, 6, 80, 32, false),
('c1000000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000082', 'Premium Denim 5000 Pairs', 'Textiles', 12000, 12, 3, 92, 45, true),
('c1000000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000083', 'Jute Bags 5000', 'Commodities', 2200, 35, 8, 65, 22, false),
('c1000000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000084', 'Leather Shoes 2000 Pairs', 'Leather', 5800, 15, 4, 85, 38, true)
ON CONFLICT DO NOTHING;

-- Malaysia - Kuala Lumpur
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000029', 'Kuala Lumpur Trade Hub', 'Malaysia', 3.1390, 101.6869, 'Southeast Asian hub for electronics, palm oil, and rubber', 1400, 1800000, 'Electronics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000085', 'c1000000-0000-0000-0000-000000000029', 'KL Electronics Group', 3.1393, 101.6872, 4.5, 88, 'Electronics', true),
('c2000000-0000-0000-0000-000000000086', 'c1000000-0000-0000-0000-000000000029', 'Malaysia Palm Oil Co', 3.1387, 101.6865, 4.4, 42, 'Commodities', true),
('c2000000-0000-0000-0000-000000000087', 'c1000000-0000-0000-0000-000000000029', 'Penang Rubber Co', 3.1395, 101.6875, 4.2, 38, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000085', 'Circuit Boards Batch 500', 'Electronics', 4800, 15, 4, 88, 40, true),
('c1000000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000085', 'USB Chargers 2000', 'Electronics', 1200, 60, 12, 45, 12, false),
('c1000000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000086', 'Palm Oil 20 Tons', 'Commodities', 8800, 25, 5, 78, 25, false),
('c1000000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000087', 'Natural Rubber 5 Tons', 'Commodities', 5500, 18, 4, 82, 30, false)
ON CONFLICT DO NOTHING;

-- ============ EASTERN EUROPE ============

-- Poland - Warsaw
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000030', 'Warsaw Trade Center', 'Poland', 52.2297, 21.0122, 'Eastern European hub for furniture, machinery, and food', 950, 720000, 'Machinery')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000088', 'c1000000-0000-0000-0000-000000000030', 'Poland Furniture Co', 52.2300, 21.0125, 4.4, 68, 'Consumer Goods', true),
('c2000000-0000-0000-0000-000000000089', 'c1000000-0000-0000-0000-000000000030', 'Warsaw Machinery', 52.2293, 21.0118, 4.5, 42, 'Machinery', true),
('c2000000-0000-0000-0000-000000000090', 'c1000000-0000-0000-0000-000000000030', 'Polish Food Export', 52.2305, 21.0128, 4.3, 55, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000088', 'Oak Furniture Set', 'Consumer Goods', 2200, 15, 4, 85, 38, true),
('c1000000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000088', 'Wooden Chair 100', 'Consumer Goods', 850, 40, 8, 58, 18, false),
('c1000000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000089', 'Industrial Pump Set', 'Machinery', 3200, 12, 3, 88, 42, true),
('c1000000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000090', 'Apple Concentrate 1000L', 'Commodities', 1200, 30, 6, 68, 22, false)
ON CONFLICT DO NOTHING;

-- Russia - Moscow
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000031', 'Moscow Trade Hub', 'Russia', 55.7558, 37.6173, 'Eurasian hub for oil, gas, metals, and timber', 1800, 3200000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000091', 'c1000000-0000-0000-0000-000000000031', 'Russian Energy Co', 55.7560, 37.6175, 4.5, 35, 'Commodities', true),
('c2000000-0000-0000-0000-000000000092', 'c1000000-0000-0000-0000-000000000031', 'Moscow Metals Group', 55.7553, 37.6170, 4.4, 58, 'Metals', true),
('c2000000-0000-0000-0000-000000000093', 'c1000000-0000-0000-0000-000000000031', 'Siberian Timber Co', 55.7565, 37.6178, 4.2, 45, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000031', 'c2000000-0000-0000-0000-000000000091', 'Natural Gas 10000 m3', 'Commodities', 18000, 15, 3, 90, 40, true),
('c1000000-0000-0000-0000-000000000031', 'c2000000-0000-0000-0000-000000000092', 'Steel Plates 10 Tons', 'Metals', 6500, 25, 5, 75, 25, false),
('c1000000-0000-0000-0000-000000000031', 'c2000000-0000-0000-0000-000000000092', 'Titanium Sheets Premium', 'Metals', 12000, 8, 2, 94, 50, true),
('c1000000-0000-0000-0000-000000000031', 'c2000000-0000-0000-0000-000000000093', 'Siberian Pine 20 Tons', 'Commodities', 4200, 20, 6, 72, 22, false)
ON CONFLICT DO NOTHING;

-- Greece - Athens
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000032', 'Athens Trade Market', 'Greece', 37.9838, 23.7275, 'Mediterranean hub for olive oil, marble, and shipping', 850, 580000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000094', 'c1000000-0000-0000-0000-000000000032', 'Greek Olive Oil Co', 37.9840, 23.7277, 4.6, 52, 'Commodities', true),
('c2000000-0000-0000-0000-000000000095', 'c1000000-0000-0000-0000-000000000032', 'Athens Marble Co', 37.9833, 23.7272, 4.4, 28, 'Machinery', true),
('c2000000-0000-0000-0000-000000000096', 'c1000000-0000-0000-0000-000000000032', 'Aegean Shipping', 37.9845, 23.7280, 4.3, 35, 'Commodities', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000032', 'c2000000-0000-0000-0000-000000000094', 'Extra Virgin Olive Oil 500L', 'Commodities', 2800, 20, 5, 85, 35, true),
('c1000000-0000-0000-0000-000000000032', 'c2000000-0000-0000-0000-000000000094', 'Kalamata Olives 200kg', 'Commodities', 850, 30, 7, 68, 22, false),
('c1000000-0000-0000-0000-000000000032', 'c2000000-0000-0000-0000-000000000095', 'Premium Marble Slabs 50', 'Machinery', 5500, 8, 2, 92, 46, true),
('c1000000-0000-0000-0000-000000000032', 'c2000000-0000-0000-0000-000000000096', 'Shipping Container Lease', 'Commodities', 1800, 40, 8, 55, 18, false)
ON CONFLICT DO NOTHING;

-- ============ CENTRAL ASIA ============

-- Kazakhstan - Almaty
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('c1000000-0000-0000-0000-000000000033', 'Almaty Trade Hub', 'Kazakhstan', 43.2220, 76.8512, 'Central Asian hub for wheat, oil, and minerals', 620, 850000, 'Commodities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('c2000000-0000-0000-0000-000000000097', 'c1000000-0000-0000-0000-000000000033', 'Kazakhstan Grain Co', 43.2223, 76.8515, 4.4, 38, 'Commodities', true),
('c2000000-0000-0000-0000-000000000098', 'c1000000-0000-0000-0000-000000000033', 'Almaty Oil Co', 43.2217, 76.8508, 4.3, 25, 'Commodities', true),
('c2000000-0000-0000-0000-000000000099', 'c1000000-0000-0000-0000-000000000033', 'Central Asia Minerals', 43.2228, 76.8518, 4.2, 32, 'Metals', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('c1000000-0000-0000-0000-000000000033', 'c2000000-0000-0000-0000-000000000097', 'Premium Wheat 100 Tons', 'Commodities', 22000, 12, 3, 90, 42, true),
('c1000000-0000-0000-0000-000000000033', 'c2000000-0000-0000-0000-000000000097', 'Flour 50 Tons', 'Commodities', 8500, 25, 5, 75, 25, false),
('c1000000-0000-0000-0000-000000000033', 'c2000000-0000-0000-0000-000000000098', 'Crude Oil 100 Barrels', 'Commodities', 8800, 15, 4, 82, 30, false),
('c1000000-0000-0000-0000-000000000033', 'c2000000-0000-0000-0000-000000000099', 'Uranium Ore 5 Tons', 'Metals', 28000, 5, 2, 96, 53, true)
ON CONFLICT DO NOTHING;

-- ============ INDEXES for new data ============
CREATE INDEX IF NOT EXISTS idx_trade_hubs_region ON trade_hubs(region);
