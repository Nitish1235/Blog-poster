-- Analytics Schema for PickBettr
-- Tracks post views and affiliate product clicks

-- Post Views Table
CREATE TABLE IF NOT EXISTS post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country_code VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Clicks Table
CREATE TABLE IF NOT EXISTS product_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_product_id UUID NOT NULL REFERENCES affiliate_products(id) ON DELETE CASCADE,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country_code VARCHAR(2),
  click_type VARCHAR(20) DEFAULT 'buy_now' CHECK (click_type IN ('buy_now', 'add_to_cart')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_post_views_blog_post_id ON post_views(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_clicks_product_id ON product_clicks(affiliate_product_id);
CREATE INDEX IF NOT EXISTS idx_product_clicks_blog_post_id ON product_clicks(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_product_clicks_clicked_at ON product_clicks(clicked_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert (anyone can track views/clicks)
CREATE POLICY "Allow public insert on post_views"
  ON post_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on product_clicks"
  ON product_clicks FOR INSERT
  WITH CHECK (true);

-- Create policies for authenticated users (admin read access)
CREATE POLICY "Allow authenticated read on post_views"
  ON post_views FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on product_clicks"
  ON product_clicks FOR SELECT
  USING (auth.role() = 'authenticated');

-- Function to get post view count
CREATE OR REPLACE FUNCTION get_post_view_count(post_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM post_views WHERE blog_post_id = post_id;
$$ LANGUAGE SQL STABLE;

-- Function to get product click count
CREATE OR REPLACE FUNCTION get_product_click_count(product_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM product_clicks WHERE affiliate_product_id = product_id;
$$ LANGUAGE SQL STABLE;

-- Function to get blog post click count (all products in a post)
CREATE OR REPLACE FUNCTION get_blog_post_click_count(post_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM product_clicks WHERE blog_post_id = post_id;
$$ LANGUAGE SQL STABLE;
