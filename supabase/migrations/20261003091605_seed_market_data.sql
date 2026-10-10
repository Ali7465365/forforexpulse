/*
# Seed Market Intelligence Data

Populates trade_hubs, sellers, and market_items with realistic sample data
across global trade regions. Also seeds a few PRO-only high-margin trade signals.

## Tables affected:
- trade_hubs: 8 hubs across major global trade regions
- sellers: 3-5 sellers per hub
- market_items: 2-4 items per seller, including some is_pro_signal=true entries
*/

-- Trade Hubs
INSERT INTO trade_hubs (id, name, region, latitude, longitude, description, total_sellers, volume_24h, category) VALUES
('a1000000-0000-0000-0000-000000000001', 'Istanbul Grand Bazaar', 'Mediterranean', 41.0086, 28.9702, 'Historic crossroads market bridging Europe and Asia', 1240, 845000, 'Spices & Textiles'),
('a1000000-0000-0000-0000-000000000002', 'Shanghai Trade Port', 'East Asia', 31.2304, 121.4737, 'Worlds busiest container port and electronics hub', 3850, 5200000, 'Electronics & Manufacturing'),
('a1000000-0000-0000-0000-000000000003', 'Dubai Gold Souk', 'Middle East', 25.2769, 55.2962, 'Premier precious metals and gemstone trading center', 980, 3100000, 'Precious Metals'),
('a1000000-0000-0000-0000-000000000004', 'Mumbai Crawford Market', 'South Asia', 18.9352, 72.8377, 'Dense wholesale hub for textiles, spices, and produce', 2100, 1200000, 'Textiles & Spices'),
('a1000000-0000-0000-0000-000000000005', 'Lagos Balogun Market', 'West Africa', 6.4474, 3.4084, 'West Africas largest consumer goods and fabric trade hub', 3200, 680000, 'Textiles & Consumer Goods'),
('a1000000-0000-0000-0000-000000000006', 'Sao Paulo 25 de Marco', 'South America', -23.5440, -46.6321, 'Massive wholesale district for electronics and imports', 4500, 2100000, 'Electronics & Imports'),
('a1000000-0000-0000-0000-000000000007', 'Rotterdam Port Market', 'Northern Europe', 51.9244, 4.4777, 'Europes gateway port for bulk commodities and machinery', 1750, 4300000, 'Commodities & Machinery'),
('a1000000-0000-0000-0000-000000000008', 'Bangkok Chatuchak Trade', 'Southeast Asia', 13.8267, 100.5530, 'Sprawling weekend and wholesale market for crafts and goods', 2800, 950000, 'Crafts & Textiles')
ON CONFLICT (id) DO NOTHING;

-- Sellers for Istanbul Grand Bazaar
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Anatolian Spice Traders', 41.0095, 28.9715, 4.8, 42, 'Spices', true),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Bosphorus Textiles', 41.0078, 28.9690, 4.5, 68, 'Textiles', true),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Mediterranean Leather Co', 41.0092, 28.9720, 4.3, 31, 'Leather', false),
('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Saffron House', 41.0082, 28.9708, 4.9, 18, 'Spices', true)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Shanghai Trade Port
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'PuDong Electronics Group', 31.2310, 121.4745, 4.6, 120, 'Electronics', true),
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Yangtze Manufacturing', 31.2298, 121.4730, 4.2, 85, 'Manufacturing', true),
('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'Golden Dragon Components', 31.2308, 121.4750, 4.4, 54, 'Electronics', false)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Dubai Gold Souk
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Almas Jewelers', 25.2775, 55.2968, 4.9, 35, 'Precious Metals', true),
('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'Emirates Gold Exchange', 25.2762, 55.2955, 4.7, 22, 'Precious Metals', true),
('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', 'Pearl Coast Trading', 25.2780, 55.2970, 4.3, 48, 'Gems', false)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Mumbai Crawford Market
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004', 'Mumbai Textile Wholesale', 18.9358, 72.8381, 4.4, 92, 'Textiles', true),
('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004', 'Malabar Spice Merchants', 18.9345, 72.8370, 4.6, 38, 'Spices', true),
('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000004', 'Konkan Produce Co', 18.9360, 72.8385, 4.1, 27, 'Produce', false)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Lagos Balogun Market
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'Lagos Fabric Empire', 6.4480, 3.4090, 4.3, 76, 'Textiles', true),
('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', 'West African Goods Depot', 6.4468, 3.4078, 4.0, 110, 'Consumer Goods', false),
('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000005', 'Naija Electronics Hub', 6.4470, 3.4080, 4.5, 64, 'Electronics', true)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Sao Paulo 25 de Marco
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000006', 'Marco Electronics Wholesale', -23.5445, -46.6325, 4.5, 140, 'Electronics', true),
('b1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000006', 'Sao Paulo Import Group', -23.5435, -46.6318, 4.2, 88, 'Imports', true),
('b1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000006', 'Brasil Fabric Center', -23.5448, -46.6328, 4.0, 55, 'Textiles', false)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Rotterdam Port Market
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000007', 'Rhine Commodities', 51.9250, 4.4783, 4.7, 45, 'Commodities', true),
('b1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000007', 'EuroPort Machinery', 51.9238, 4.4770, 4.4, 32, 'Machinery', true),
('b1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000007', 'North Sea Metals Trading', 51.9255, 4.4790, 4.6, 28, 'Metals', true)
ON CONFLICT (id) DO NOTHING;

-- Sellers for Bangkok Chatuchak Trade
INSERT INTO sellers (id, hub_id, name, latitude, longitude, rating, products_count, category, verified) VALUES
('b1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000008', 'Siam Crafts Collective', 13.8272, 100.5535, 4.5, 67, 'Crafts', true),
('b1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000008', 'Chao Phraya Textiles', 13.8262, 100.5525, 4.3, 49, 'Textiles', false),
('b1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000008', 'Bangkok Silk Traders', 13.8270, 100.5540, 4.8, 33, 'Textiles', true)
ON CONFLICT (id) DO NOTHING;

-- Market Items for Istanbul sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Premium Saffron Threads 1kg', 'Spices', 320, 15, 3, 92, 38, true),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Sumac Powder 1kg', 'Spices', 45, 60, 8, 55, 12, false),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Handwoven Turkish Rug 2x3m', 'Textiles', 850, 10, 2, 88, 45, true),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Cotton Bath Towel Set', 'Textiles', 120, 75, 12, 40, 8, false),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'Genuine Leather Jacket', 'Leather', 220, 25, 5, 65, 22, false),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'Iranian Saffron Grade A', 'Spices', 450, 8, 2, 95, 52, true),
('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'Rose Water 500ml', 'Spices', 18, 80, 10, 35, 10, false)
ON CONFLICT DO NOTHING;

-- Market Items for Shanghai sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', 'OLED Display Panels Lot 100', 'Electronics', 12000, 20, 4, 90, 35, true),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', 'USB-C Cables Bulk 1000', 'Electronics', 800, 90, 20, 30, 5, false),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', 'Precision CNC Components', 'Manufacturing', 5500, 15, 3, 85, 40, true),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', 'Steel Brackets Box 500', 'Manufacturing', 350, 85, 15, 35, 8, false),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000007', 'Semiconductor Chips Lot 50', 'Electronics', 8800, 12, 5, 93, 48, true),
('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000007', 'LED Strip Lights Roll', 'Electronics', 25, 95, 25, 25, 4, false)
ON CONFLICT DO NOTHING;

-- Market Items for Dubai sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000008', '22K Gold Bracelet 50g', 'Precious Metals', 3400, 18, 4, 80, 28, false),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000008', 'Diamond Solitaire Ring 1ct', 'Precious Metals', 12500, 5, 2, 96, 55, true),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000009', 'Gold Bullion Bar 100g', 'Precious Metals', 6200, 30, 6, 72, 15, false),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000009', 'Platinum Coin 1oz', 'Precious Metals', 1100, 10, 3, 89, 42, true),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000010', 'Blue Sapphire 2ct Uncut', 'Gems', 4800, 8, 3, 91, 48, true),
('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000010', 'Pearl Strand Necklace', 'Gems', 380, 50, 8, 45, 18, false)
ON CONFLICT DO NOTHING;

-- Market Items for Mumbai sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000011', 'Pashmina Shawl Premium', 'Textiles', 180, 12, 3, 87, 44, true),
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000011', 'Cotton Saree Bulk Lot 50', 'Textiles', 600, 70, 14, 38, 9, false),
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000012', 'Cardamom Black 10kg', 'Spices', 280, 20, 4, 84, 36, true),
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000012', 'Turmeric Powder 5kg', 'Spices', 65, 85, 18, 30, 7, false),
('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000013', 'Alphonso Mango Crate', 'Produce', 45, 60, 10, 50, 15, false)
ON CONFLICT DO NOTHING;

-- Market Items for Lagos sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000014', 'Ankara Print Fabric 6yards', 'Textiles', 35, 65, 12, 55, 20, false),
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000014', 'Aso Oke Premium Weave', 'Textiles', 120, 15, 3, 88, 46, true),
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000015', 'Imported Footwear Pair', 'Consumer Goods', 55, 80, 15, 40, 12, false),
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000016', 'Refurbished Smartphone Pro', 'Electronics', 180, 25, 6, 82, 38, true),
('a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000016', 'Phone Accessories Bundle', 'Electronics', 30, 90, 22, 28, 6, false)
ON CONFLICT DO NOTHING;

-- Market Items for Sao Paulo sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000017', 'Gaming Console Bundle', 'Electronics', 420, 20, 5, 86, 33, true),
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000017', 'HDMI Cables Bulk 500', 'Electronics', 250, 92, 25, 22, 4, false),
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000018', 'Imported Watches Lot 20', 'Imports', 2400, 10, 2, 93, 50, true),
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000018', 'Designer Sunglasses Pair', 'Imports', 85, 55, 10, 48, 18, false),
('a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000019', 'Brazilian Cotton Sheets', 'Textiles', 70, 70, 12, 42, 14, false)
ON CONFLICT DO NOTHING;

-- Market Items for Rotterdam sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000020', 'Cocoa Beans Bulk 1 Ton', 'Commodities', 3800, 35, 6, 78, 25, false),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000020', 'Rare Earth Minerals Lot', 'Commodities', 9500, 8, 2, 94, 51, true),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000021', 'Industrial Robot Arm Unit', 'Machinery', 18000, 5, 2, 90, 47, true),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000021', 'Hydraulic Pump Set', 'Machinery', 1200, 40, 7, 55, 20, false),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000022', 'Copper Cathodes 1 Ton', 'Metals', 8500, 25, 5, 75, 22, false),
('a1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000022', 'Titanium Alloy Billet', 'Metals', 4200, 10, 3, 92, 49, true)
ON CONFLICT DO NOTHING;

-- Market Items for Bangkok sellers
INSERT INTO market_items (hub_id, seller_id, name, category, price, supply_level, competitor_count, demand_score, margin_estimate, is_pro_signal) VALUES
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000023', 'Handcarved Teak Wood Panel', 'Crafts', 340, 12, 3, 85, 43, true),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000023', 'Ceramic Bowl Set of 6', 'Crafts', 45, 75, 12, 35, 12, false),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000024', 'Thai Silk Scarf Premium', 'Textiles', 95, 18, 4, 82, 39, true),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000024', 'Cotton T-Shirt Bulk 100', 'Textiles', 200, 88, 20, 28, 6, false),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000025', 'Royal Thai Silk 1m', 'Textiles', 160, 8, 2, 95, 54, true),
('a1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000025', 'Silk Pillow Cover', 'Textiles', 35, 65, 10, 42, 16, false)
ON CONFLICT DO NOTHING;
