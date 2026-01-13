-- Fix foreign key relationship for affiliate_products
-- This script ensures the foreign key is properly recognized by Supabase PostgREST

-- First, check if the foreign key exists and drop it if needed
DO $$ 
BEGIN
    -- Drop existing foreign key if it exists (in case it needs to be recreated)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'affiliate_products_blog_post_id_fkey'
        AND table_name = 'affiliate_products'
    ) THEN
        ALTER TABLE affiliate_products 
        DROP CONSTRAINT affiliate_products_blog_post_id_fkey;
    END IF;
END $$;

-- Recreate the foreign key with explicit constraint name
ALTER TABLE affiliate_products
ADD CONSTRAINT affiliate_products_blog_post_id_fkey
FOREIGN KEY (blog_post_id)
REFERENCES blog_posts(id)
ON DELETE CASCADE;

-- Refresh the PostgREST schema cache
-- Note: You may need to restart your Supabase project or use the API to refresh
NOTIFY pgrst, 'reload schema';
