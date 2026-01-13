-- Amazon Affiliate Product Categories & Subcategories Seed Data
-- Based on the Complete Guide for US, UK & International Markets (2026)
-- Run this script in your Supabase SQL Editor to populate categories and subcategories

-- First, let's clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE subcategories CASCADE;
-- TRUNCATE TABLE categories CASCADE;

-- 1. Home & Lifestyle (Primary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Home & Lifestyle', 'home-lifestyle', 'Complete guide to home improvement, kitchen essentials, smart home automation, and lifestyle products. Commission Rate: 4.5%', 'primary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Get the category ID for Home & Lifestyle
DO $$
DECLARE
    home_category_id UUID;
BEGIN
    SELECT id INTO home_category_id FROM categories WHERE slug = 'home-lifestyle';
    
    -- Home & Lifestyle Subcategories
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), home_category_id, 'Kitchen & Cooking', 'kitchen-cooking', 'Small appliances, cookware, kitchen gadgets, and cooking essentials. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), home_category_id, 'Home Office & Workspace', 'home-office-workspace', 'Ergonomic furniture, tech accessories, and workspace enhancements. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), home_category_id, 'Smart Home & Automation', 'smart-home-automation', 'Smart lighting, climate control, security systems, and home automation. Commission: 3%', NOW(), NOW()),
    (gen_random_uuid(), home_category_id, 'Home Decor & Organization', 'home-decor-organization', 'Storage solutions, decorative items, and functional home decor. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), home_category_id, 'Garden & Outdoor', 'garden-outdoor', 'Gardening tools, outdoor living, and advanced gardening solutions. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 2. Health, Wellness & Personal Care (Accent Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Health, Wellness & Personal Care', 'health-wellness-personal-care', 'Biohacking, fitness equipment, self-care products, and luxury beauty. Commission Rate: 4-10%', 'accent', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    health_category_id UUID;
BEGIN
    SELECT id INTO health_category_id FROM categories WHERE slug = 'health-wellness-personal-care';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), health_category_id, 'Biohacking & Longevity', 'biohacking-longevity', 'Recovery therapy, sleep optimization, and health monitoring devices. Commission: 4-10%', NOW(), NOW()),
    (gen_random_uuid(), health_category_id, 'Fitness & Exercise', 'fitness-exercise', 'Home gym equipment, cardio machines, and fitness accessories. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), health_category_id, 'Self-Care & Relaxation', 'self-care-relaxation', 'Skincare tools, relaxation products, and personal care devices. Commission: 4-10%', NOW(), NOW()),
    (gen_random_uuid(), health_category_id, 'Luxury Beauty', 'luxury-beauty', 'Medical-grade skincare, professional hair care, and premium fragrances. Commission: 10%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 3. Tech & Gaming (Secondary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Tech & Gaming', 'tech-gaming', 'Gaming peripherals, photography equipment, portable tech, and computer accessories. Commission Rate: 2.5%', 'secondary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    tech_category_id UUID;
BEGIN
    SELECT id INTO tech_category_id FROM categories WHERE slug = 'tech-gaming';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), tech_category_id, 'Gaming', 'gaming', 'Gaming peripherals, monitors, furniture, consoles, and VR headsets. Commission: 2.5%', NOW(), NOW()),
    (gen_random_uuid(), tech_category_id, 'Photography & Video', 'photography-video', 'Cameras, lenses, video equipment, and drones. Commission: 2.5%', NOW(), NOW()),
    (gen_random_uuid(), tech_category_id, 'Portable Tech & Accessories', 'portable-tech-accessories', 'Audio devices, power banks, e-readers, and smartphone accessories. Commission: 2.5%', NOW(), NOW()),
    (gen_random_uuid(), tech_category_id, 'Computer & Peripherals', 'computer-peripherals', 'Laptops, desktops, storage, and networking equipment. Commission: 2.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 4. Family & Pets (Primary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Family & Pets', 'family-pets', 'Pet supplies, baby gear, kids products, and family essentials. Commission Rate: 3-4.5%', 'primary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    family_category_id UUID;
BEGIN
    SELECT id INTO family_category_id FROM categories WHERE slug = 'family-pets';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), family_category_id, 'Pet Supplies', 'pet-supplies', 'Pet tech, dog products, cat products, and small pet supplies. Commission: 3%', NOW(), NOW()),
    (gen_random_uuid(), family_category_id, 'Baby Gear', 'baby-gear', 'Travel gear, safety monitoring, feeding, sleep, and nursery products. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), family_category_id, 'Kids & Family', 'kids-family', 'Educational toys, outdoor play equipment, and family activities. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 5. Sustainable & Eco-Living (Accent Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Sustainable & Eco-Living', 'sustainable-eco-living', 'Solar power, waste reduction, and ethical fashion products. Commission Rate: 4-4.5%', 'accent', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    eco_category_id UUID;
BEGIN
    SELECT id INTO eco_category_id FROM categories WHERE slug = 'sustainable-eco-living';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), eco_category_id, 'Energy & Power', 'energy-power', 'Solar generators, panels, chargers, and energy storage solutions. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), eco_category_id, 'Waste Reduction', 'waste-reduction', 'Compost bins, reusable products, and sustainable household items. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), eco_category_id, 'Ethical Fashion', 'ethical-fashion', 'Recycled material clothing, organic cotton, and sustainable accessories. Commission: 4%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 6. Fashion & Accessories (Primary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Fashion & Accessories', 'fashion-accessories', 'Women''s and men''s fashion, footwear, luggage, and travel accessories. Commission Rate: 4%', 'primary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    fashion_category_id UUID;
BEGIN
    SELECT id INTO fashion_category_id FROM categories WHERE slug = 'fashion-accessories';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), fashion_category_id, 'Women''s Fashion', 'womens-fashion', 'Clothing, accessories, jewelry, and watches for women. Commission: 4%', NOW(), NOW()),
    (gen_random_uuid(), fashion_category_id, 'Men''s Fashion', 'mens-fashion', 'Clothing, accessories, watches, and grooming products for men. Commission: 4%', NOW(), NOW()),
    (gen_random_uuid(), fashion_category_id, 'Footwear', 'footwear', 'Women''s and men''s shoes including sneakers, boots, heels, and casual footwear. Commission: 4%', NOW(), NOW()),
    (gen_random_uuid(), fashion_category_id, 'Luggage & Travel', 'luggage-travel', 'Suitcases, travel backpacks, and travel accessories. Commission: 4%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 7. Automotive (Secondary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Automotive', 'automotive', 'Car parts, accessories, motorcycle gear, and automotive maintenance products. Commission Rate: 4.5%', 'secondary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    auto_category_id UUID;
BEGIN
    SELECT id INTO auto_category_id FROM categories WHERE slug = 'automotive';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), auto_category_id, 'Car Parts & Accessories', 'car-parts-accessories', 'Electronics, maintenance tools, interior and exterior accessories. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), auto_category_id, 'Motorcycle & Powersports', 'motorcycle-powersports', 'Motorcycle gear, helmets, protective equipment, and accessories. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 8. Sports & Outdoors (Accent Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Sports & Outdoors', 'sports-outdoors', 'Outdoor recreation, fitness sports, camping, hiking, and water sports equipment. Commission Rate: 4.5%', 'accent', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    sports_category_id UUID;
BEGIN
    SELECT id INTO sports_category_id FROM categories WHERE slug = 'sports-outdoors';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), sports_category_id, 'Outdoor Recreation', 'outdoor-recreation', 'Camping gear, hiking equipment, and water sports products. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), sports_category_id, 'Fitness Sports', 'fitness-sports', 'Running gear, cycling equipment, pickleball, and home gym essentials. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 9. Toys & Games (Primary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Toys & Games', 'toys-games', 'Educational toys, board games, puzzles, action figures, and outdoor toys. Commission Rate: 4.5%', 'primary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    toys_category_id UUID;
BEGIN
    SELECT id INTO toys_category_id FROM categories WHERE slug = 'toys-games';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), toys_category_id, 'Educational Toys', 'educational-toys', 'STEM toys, robotics kits, science experiments, and learning toys. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), toys_category_id, 'Board Games & Puzzles', 'board-games-puzzles', 'Classic board games, jigsaw puzzles, brain teasers, and escape room games. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), toys_category_id, 'Action Figures & Collectibles', 'action-figures-collectibles', 'Superhero figures, anime collectibles, and model kits. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), toys_category_id, 'Outdoor Toys', 'outdoor-toys', 'Bikes, scooters, trampolines, swing sets, and active play equipment. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- 10. Books & Media (Secondary Color)
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Books & Media', 'books-media', 'Physical books, e-books, digital media, movies, TV, and streaming services. Commission Rate: 4.5%', 'secondary', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    books_category_id UUID;
BEGIN
    SELECT id INTO books_category_id FROM categories WHERE slug = 'books-media';
    
    INSERT INTO subcategories (id, category_id, name, slug, description, created_at, updated_at) VALUES
    (gen_random_uuid(), books_category_id, 'Books', 'books', 'Fiction, non-fiction, children''s books, cookbooks, and travel guides. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), books_category_id, 'E-Books & Digital', 'ebooks-digital', 'Kindle devices, Kindle Unlimited, and Audible subscriptions. Commission: 4.5%', NOW(), NOW()),
    (gen_random_uuid(), books_category_id, 'Movies & TV', 'movies-tv', 'Amazon Prime Video, Fire TV Sticks, and streaming device accessories. Commission: 4.5%', NOW(), NOW())
    ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- Display summary
SELECT 
    c.name as category,
    c.color,
    COUNT(s.id) as subcategory_count,
    c.description
FROM categories c
LEFT JOIN subcategories s ON s.category_id = c.id
GROUP BY c.id, c.name, c.color, c.description
ORDER BY c.name;
