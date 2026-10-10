/*
# Simplify Market Data Names to Plain English

Updates trade hub names, regions, descriptions, categories, and seller names
to be simpler, easier to understand, and fully in English. Also simplifies
market item names where needed.

## Tables affected:
- trade_hubs: simplified names, regions, categories, descriptions
- sellers: simplified names
- market_items: simplified item names for a few complex ones
*/

-- Trade Hubs: simplify names, regions, categories, descriptions
UPDATE trade_hubs SET
  name = 'Istanbul Market',
  region = 'Turkey',
  category = 'Spices',
  description = 'Historic market connecting Europe and Asia for spices and textiles'
WHERE id = 'a1000000-0000-0000-0000-000000000001';

UPDATE trade_hubs SET
  name = 'Shanghai Trade Port',
  region = 'China',
  category = 'Electronics',
  description = 'Worlds busiest port for electronics and manufactured goods'
WHERE id = 'a1000000-0000-0000-0000-000000000002';

UPDATE trade_hubs SET
  name = 'Dubai Gold Market',
  region = 'United Arab Emirates',
  category = 'Gold & Gems',
  description = 'Top destination for gold, jewelry, and precious gemstones'
WHERE id = 'a1000000-0000-0000-0000-000000000003';

UPDATE trade_hubs SET
  name = 'Mumbai Wholesale Market',
  region = 'India',
  category = 'Textiles',
  description = 'Large wholesale market for textiles, spices, and fresh produce'
WHERE id = 'a1000000-0000-0000-0000-000000000004';

UPDATE trade_hubs SET
  name = 'Lagos Market',
  region = 'Nigeria',
  category = 'Textiles',
  description = 'West Africas biggest market for fabrics and everyday goods'
WHERE id = 'a1000000-0000-0000-0000-000000000005';

UPDATE trade_hubs SET
  name = 'Sao Paulo Wholesale District',
  region = 'Brazil',
  category = 'Electronics',
  description = 'Major wholesale area for electronics and imported goods'
WHERE id = 'a1000000-0000-0000-0000-000000000006';

UPDATE trade_hubs SET
  name = 'Rotterdam Trade Port',
  region = 'Netherlands',
  category = 'Commodities',
  description = 'Europes main port for bulk goods, metals, and machinery'
WHERE id = 'a1000000-0000-0000-0000-000000000007';

UPDATE trade_hubs SET
  name = 'Bangkok Market',
  region = 'Thailand',
  category = 'Crafts',
  description = 'Famous market for handmade crafts, silk, and textiles'
WHERE id = 'a1000000-0000-0000-0000-000000000008';

-- Sellers: simplify names
UPDATE sellers SET name = 'Turkish Spice Traders' WHERE id = 'b1000000-0000-0000-0000-000000000001';
UPDATE sellers SET name = 'Istanbul Textiles' WHERE id = 'b1000000-0000-0000-0000-000000000002';
UPDATE sellers SET name = 'Mediterranean Leather' WHERE id = 'b1000000-0000-0000-0000-000000000003';
UPDATE sellers SET name = 'Saffron House' WHERE id = 'b1000000-0000-0000-0000-000000000004';
UPDATE sellers SET name = 'Shanghai Electronics' WHERE id = 'b1000000-0000-0000-0000-000000000005';
UPDATE sellers SET name = 'China Manufacturing Co' WHERE id = 'b1000000-0000-0000-0000-000000000006';
UPDATE sellers SET name = 'Dragon Components' WHERE id = 'b1000000-0000-0000-0000-000000000007';
UPDATE sellers SET name = 'Dubai Jewelers' WHERE id = 'b1000000-0000-0000-0000-000000000008';
UPDATE sellers SET name = 'Dubai Gold Exchange' WHERE id = 'b1000000-0000-0000-0000-000000000009';
UPDATE sellers SET name = 'Pearl Coast Trading' WHERE id = 'b1000000-0000-0000-0000-000000000010';
UPDATE sellers SET name = 'Mumbai Textiles' WHERE id = 'b1000000-0000-0000-0000-000000000011';
UPDATE sellers SET name = 'Indian Spice Merchants' WHERE id = 'b1000000-0000-0000-0000-000000000012';
UPDATE sellers SET name = 'Mumbai Produce Co' WHERE id = 'b1000000-0000-0000-0000-000000000013';
UPDATE sellers SET name = 'Lagos Fabric Store' WHERE id = 'b1000000-0000-0000-0000-000000000014';
UPDATE sellers SET name = 'West African Goods' WHERE id = 'b1000000-0000-0000-0000-000000000015';
UPDATE sellers SET name = 'Lagos Electronics' WHERE id = 'b1000000-0000-0000-0000-000000000016';
UPDATE sellers SET name = 'Sao Paulo Electronics' WHERE id = 'b1000000-0000-0000-0000-000000000017';
UPDATE sellers SET name = 'Brazil Import Group' WHERE id = 'b1000000-0000-0000-0000-000000000018';
UPDATE sellers SET name = 'Brazil Fabric Center' WHERE id = 'b1000000-0000-0000-0000-000000000019';
UPDATE sellers SET name = 'Rotterdam Commodities' WHERE id = 'b1000000-0000-0000-0000-000000000020';
UPDATE sellers SET name = 'Rotterdam Machinery' WHERE id = 'b1000000-0000-0000-0000-000000000021';
UPDATE sellers SET name = 'North Sea Metals' WHERE id = 'b1000000-0000-0000-0000-000000000022';
UPDATE sellers SET name = 'Thai Crafts Collective' WHERE id = 'b1000000-0000-0000-0000-000000000023';
UPDATE sellers SET name = 'Bangkok Textiles' WHERE id = 'b1000000-0000-0000-0000-000000000024';
UPDATE sellers SET name = 'Bangkok Silk Traders' WHERE id = 'b1000000-0000-0000-0000-000000000025';

-- Also simplify seller categories to match hub categories
UPDATE sellers SET category = 'Gold & Gems' WHERE category = 'Precious Metals';
UPDATE sellers SET category = 'Gold & Gems' WHERE category = 'Gems';

-- Market items: simplify some complex names
UPDATE market_items SET name = 'Premium Saffron 1kg' WHERE name = 'Premium Saffron Threads 1kg';
UPDATE market_items SET name = 'Handwoven Rug 2x3m' WHERE name = 'Handwoven Turkish Rug 2x3m';
UPDATE market_items SET name = 'Leather Jacket' WHERE name = 'Genuine Leather Jacket';
UPDATE market_items SET name = 'Grade A Saffron' WHERE name = 'Iranian Saffron Grade A';
UPDATE market_items SET name = 'OLED Screens (Batch of 100)' WHERE name = 'OLED Display Panels Lot 100';
UPDATE market_items SET name = 'USB-C Cables (Box of 1000)' WHERE name = 'USB-C Cables Bulk 1000';
UPDATE market_items SET name = 'CNC Machine Parts' WHERE name = 'Precision CNC Components';
UPDATE market_items SET name = 'Steel Brackets (Box of 500)' WHERE name = 'Steel Brackets Box 500';
UPDATE market_items SET name = 'Computer Chips (Batch of 50)' WHERE name = 'Semiconductor Chips Lot 50';
UPDATE market_items SET name = 'LED Light Strips' WHERE name = 'LED Strip Lights Roll';
UPDATE market_items SET name = 'Gold Bracelet 50g' WHERE name = '22K Gold Bracelet 50g';
UPDATE market_items SET name = 'Diamond Ring 1 Carat' WHERE name = 'Diamond Solitaire Ring 1ct';
UPDATE market_items SET name = 'Gold Bar 100g' WHERE name = 'Gold Bullion Bar 100g';
UPDATE market_items SET name = 'Platinum Coin 1oz' WHERE name = 'Platinum Coin 1oz';
UPDATE market_items SET name = 'Blue Sapphire 2 Carat' WHERE name = 'Blue Sapphire 2ct Uncut';
UPDATE market_items SET name = 'Pearl Necklace' WHERE name = 'Pearl Strand Necklace';
UPDATE market_items SET name = 'Pashmina Shawl' WHERE name = 'Pashmina Shawl Premium';
UPDATE market_items SET name = 'Cotton Sarees (Batch of 50)' WHERE name = 'Cotton Saree Bulk Lot 50';
UPDATE market_items SET name = 'Black Cardamom 10kg' WHERE name = 'Cardamom Black 10kg';
UPDATE market_items SET name = 'Turmeric Powder 5kg' WHERE name = 'Turmeric Powder 5kg';
UPDATE market_items SET name = 'Mango Crate' WHERE name = 'Alphonso Mango Crate';
UPDATE market_items SET name = 'African Print Fabric 6 Yards' WHERE name = 'Ankara Print Fabric 6yards';
UPDATE market_items SET name = 'Premium Woven Fabric' WHERE name = 'Aso Oke Premium Weave';
UPDATE market_items SET name = 'Imported Shoes (Pair)' WHERE name = 'Imported Footwear Pair';
UPDATE market_items SET name = 'Refurbished Smartphone' WHERE name = 'Refurbished Smartphone Pro';
UPDATE market_items SET name = 'Phone Accessories Pack' WHERE name = 'Phone Accessories Bundle';
UPDATE market_items SET name = 'Gaming Console Bundle' WHERE name = 'Gaming Console Bundle';
UPDATE market_items SET name = 'HDMI Cables (Box of 500)' WHERE name = 'HDMI Cables Bulk 500';
UPDATE market_items SET name = 'Imported Watches (Batch of 20)' WHERE name = 'Imported Watches Lot 20';
UPDATE market_items SET name = 'Designer Sunglasses' WHERE name = 'Designer Sunglasses Pair';
UPDATE market_items SET name = 'Cotton Bed Sheets' WHERE name = 'Brazilian Cotton Sheets';
UPDATE market_items SET name = 'Cocoa Beans (1 Ton)' WHERE name = 'Cocoa Beans Bulk 1 Ton';
UPDATE market_items SET name = 'Rare Earth Minerals' WHERE name = 'Rare Earth Minerals Lot';
UPDATE market_items SET name = 'Industrial Robot Arm' WHERE name = 'Industrial Robot Arm Unit';
UPDATE market_items SET name = 'Hydraulic Pump Set' WHERE name = 'Hydraulic Pump Set';
UPDATE market_items SET name = 'Copper (1 Ton)' WHERE name = 'Copper Cathodes 1 Ton';
UPDATE market_items SET name = 'Titanium Alloy Block' WHERE name = 'Titanium Alloy Billet';
UPDATE market_items SET name = 'Carved Wood Panel' WHERE name = 'Handcarved Teak Wood Panel';
UPDATE market_items SET name = 'Ceramic Bowl Set (6)' WHERE name = 'Ceramic Bowl Set of 6';
UPDATE market_items SET name = 'Thai Silk Scarf' WHERE name = 'Thai Silk Scarf Premium';
UPDATE market_items SET name = 'Cotton T-Shirts (Batch of 100)' WHERE name = 'Cotton T-Shirt Bulk 100';
UPDATE market_items SET name = 'Premium Thai Silk 1m' WHERE name = 'Royal Thai Silk 1m';
UPDATE market_items SET name = 'Silk Pillow Cover' WHERE name = 'Silk Pillow Cover';

-- Simplify market item categories to match simplified hub categories
UPDATE market_items SET category = 'Gold & Gems' WHERE category = 'Precious Metals';
UPDATE market_items SET category = 'Gold & Gems' WHERE category = 'Gems';
