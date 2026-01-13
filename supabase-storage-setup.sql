-- Supabase Storage Setup for Image Uploads
-- Run this in your Supabase SQL Editor after creating the storage bucket

-- Create storage bucket for images (if it doesn't exist)
-- Note: You need to create the bucket in Supabase Dashboard first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: "images"
-- 4. Public: Yes (so images can be accessed via public URLs)
-- 5. File size limit: 5MB (or your preferred limit)
-- 6. Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp

-- Storage Policies for authenticated users
-- These policies allow authenticated users to upload, read, and delete their own images

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] IN ('uploads', 'featured-images', 'product-images')
);

-- Policy: Allow public read access to images
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to update their own images
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] IN ('uploads', 'featured-images', 'product-images')
);

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] IN ('uploads', 'featured-images', 'product-images')
);
