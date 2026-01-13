-- Create affiliate_products table for Amazon affiliate products
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  amazon_affiliate_link TEXT NOT NULL,
  price VARCHAR(50),
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_blog_post_id ON affiliate_products(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_display_order ON affiliate_products(blog_post_id, display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on affiliate products"
  ON affiliate_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = affiliate_products.blog_post_id 
      AND blog_posts.published = true 
      AND blog_posts.published_at IS NOT NULL
    )
  );

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated insert on affiliate_products"
  ON affiliate_products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on affiliate_products"
  ON affiliate_products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on affiliate_products"
  ON affiliate_products FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on all affiliate_products"
  ON affiliate_products FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_affiliate_products_updated_at
  BEFORE UPDATE ON affiliate_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
