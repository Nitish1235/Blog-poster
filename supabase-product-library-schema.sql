-- Create product_library table for reusable Amazon affiliate products
-- This allows products to be stored independently and reused across multiple blog posts
CREATE TABLE IF NOT EXISTS product_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  amazon_affiliate_link TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_library_subcategory_id ON product_library(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_product_library_display_order ON product_library(subcategory_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_library_is_featured ON product_library(is_featured);

-- Enable Row Level Security (RLS)
ALTER TABLE product_library ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access only)
CREATE POLICY "Allow authenticated read on product_library"
  ON product_library FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on product_library"
  ON product_library FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on product_library"
  ON product_library FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on product_library"
  ON product_library FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_product_library_updated_at
  BEFORE UPDATE ON product_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
