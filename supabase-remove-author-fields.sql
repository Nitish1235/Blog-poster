-- Migration: Remove author_name and author_email columns from blog_posts table
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the columns (this will remove all data in these columns)
ALTER TABLE blog_posts 
DROP COLUMN IF EXISTS author_name,
DROP COLUMN IF EXISTS author_email;

-- Note: This operation cannot be undone. Make sure you have a backup if needed.
-- The columns will be permanently removed from the table.
