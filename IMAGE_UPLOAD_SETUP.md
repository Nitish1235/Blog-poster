# Image Upload Setup Guide

This guide explains how to set up and use the image upload feature for blog posts and products.

## Overview

The image upload feature allows you to upload images directly from your computer instead of providing image URLs. Images are stored in Supabase Storage and automatically optimized.

## Setup Instructions

### Step 1: Create Storage Bucket in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ **Yes** (checked) - This allows images to be accessed via public URLs
   - **File size limit**: `5MB` (or your preferred limit)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/gif`
     - `image/webp`
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase-storage-setup.sql` from this project
3. Copy and paste the SQL script
4. Click **"Run"** to create the storage policies

This will allow:
- Authenticated users to upload images
- Public read access to images
- Authenticated users to update/delete images

### Step 3: Verify Setup

1. Go to **Storage → images** in Supabase Dashboard
2. You should see the bucket with the policies applied
3. Try uploading a test image to verify it works

## Using Image Upload

### For Featured Images (Blog Posts)

When creating or editing a blog post:

1. In the **"Featured Image"** section, you'll see an upload area
2. **Option 1 - Upload from Computer**:
   - Click the upload area or drag and drop an image
   - Select an image file (JPEG, PNG, GIF, WebP up to 5MB)
   - The image will upload automatically
   - Once uploaded, you'll see a preview
3. **Option 2 - Use Existing URL**:
   - If you already have an image URL, you can still paste it manually
   - The system will use the URL directly

### For Product Images

When adding products to a blog post:

1. In the product form, find the **"Product Image"** field
2. Click the upload area
3. Select an image file
4. The image will upload and be automatically added to the product

## Image Organization

Images are organized in folders within the `images` bucket:

- **`featured-images/`** - Featured images for blog posts
- **`product-images/`** - Product images
- **`uploads/`** - General uploads

## Features

- **Drag & Drop**: Drag images directly onto the upload area
- **Preview**: See image preview before saving
- **File Validation**: Only image files up to 5MB are accepted
- **Automatic Optimization**: Images are stored efficiently
- **Public URLs**: Images are accessible via public URLs
- **Replace Images**: Click "Change" to replace an uploaded image
- **Remove Images**: Click the X button to remove an image

## Supported File Types

- JPEG/JPG
- PNG
- GIF
- WebP

## File Size Limits

- Maximum file size: **5MB** per image
- If you need larger images, you can:
  1. Compress images before uploading
  2. Use an external image hosting service
  3. Increase the limit in Supabase Storage settings

## Troubleshooting

### "Failed to upload image" Error

1. **Check Storage Bucket**:
   - Ensure the `images` bucket exists
   - Verify it's set to "Public"

2. **Check Storage Policies**:
   - Run `supabase-storage-setup.sql` to ensure policies are set

3. **Check File Size**:
   - Ensure file is under 5MB
   - Compress large images if needed

4. **Check File Type**:
   - Only image files are accepted
   - Ensure file extension matches the file type

### Images Not Displaying

1. **Check Public Access**:
   - Ensure the bucket is set to "Public"
   - Check storage policies allow public read access

2. **Check URL**:
   - Verify the image URL is correct
   - Test the URL in a browser

3. **Check CORS** (if needed):
   - Supabase Storage should handle CORS automatically
   - If issues persist, check Supabase documentation

## Best Practices

1. **Optimize Images Before Upload**:
   - Compress images to reduce file size
   - Use appropriate dimensions (don't upload 4K images for thumbnails)
   - Use WebP format when possible for better compression

2. **Organize by Purpose**:
   - Featured images go to `featured-images/`
   - Product images go to `product-images/`
   - General uploads go to `uploads/`

3. **Use Descriptive Filenames**:
   - The system generates unique filenames automatically
   - Original filenames are preserved in the metadata

4. **Monitor Storage Usage**:
   - Check your Supabase Storage usage regularly
   - Delete unused images to free up space
   - Consider using external CDN for high-traffic sites

## API Endpoint

The image upload uses the following API endpoint:

- `POST /api/upload` - Upload an image file
  - Body: `FormData` with `file` and `folder` fields
  - Returns: `{ url: string, path: string }`

## Security Notes

- Only authenticated users can upload images
- Images are stored in public buckets (accessible via URL)
- File type and size validation is enforced
- Storage policies restrict access to authenticated users only
