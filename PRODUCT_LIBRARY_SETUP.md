# Product Library Setup Guide

This guide explains how to set up and use the Product Library feature, which allows you to manage reusable Amazon affiliate products organized by subcategories.

## Overview

The Product Library is a centralized catalog of Amazon affiliate products that can be reused across multiple blog posts. Products are organized by subcategories, making it easy to find and select relevant products when creating posts.

## Database Setup

1. **Run the product library schema:**
   - In your Supabase dashboard, go to SQL Editor
   - Open `supabase-product-library-schema.sql` from this project
   - Copy and paste the SQL script
   - Click "Run" to create the `product_library` table

## Features

### 1. Product Library Management

- **Location**: `/admin/product-library`
- **Features**:
  - Browse all products in your library
  - Filter products by subcategory
  - Search products by name or description
  - Add new products to the library
  - Edit existing products
  - Delete products from the library
  - View product statistics (total products, filtered count)

### 2. Adding Products to Library

1. Go to **Admin Panel → Products**
2. Click **"Add Product"** button
3. Fill in the product details:
   - **Subcategory*** (required): Select the subcategory this product belongs to
   - **Product Name*** (required): The name of the Amazon product
   - **Description*** (required): A brief description of the product
   - **Product Image URL*** (required): Direct URL to the product image
   - **Amazon Affiliate Link*** (required): Your Amazon affiliate link
   - **Featured Product**: Check to mark as featured (shows a badge)
4. Click **"Add Product"** to save

### 3. Using Products from Library When Creating Posts

When creating or editing a blog post:

1. **Select a Category and Subcategory** for your post
2. If products exist in the library for that subcategory, you'll see a **"Browse Library"** button
3. Click **"Browse Library"** to see all products from that subcategory
4. Click on any product card to add it to your post
5. Products already added to the post will show "Already Added"
6. You can still manually add products using the **"Add Product"** button

### 4. Product Organization

- Products are organized by **subcategory**
- Each product belongs to exactly one subcategory
- When browsing the library, you can filter by subcategory
- Products are displayed in order (display_order field)

## Best Practices

1. **Organize by Subcategory**: Add products to the appropriate subcategory for easy discovery
2. **Use Descriptive Names**: Use clear, descriptive product names that match Amazon listings
3. **Write Good Descriptions**: Include key features and benefits in the description
4. **Featured Products**: Mark your top-performing or recommended products as featured
5. **Keep Library Updated**: Regularly review and update product information, especially affiliate links

## Workflow Example

1. **Build Your Library First**:
   - Go to `/admin/product-library`
   - Add products for each subcategory you plan to write about
   - This creates a reusable catalog

2. **When Writing a Post**:
   - Select the appropriate category and subcategory
   - Click "Browse Library" to see products for that subcategory
   - Select 3-5 products from the library
   - Or add new products manually if needed

3. **Reuse Products**:
   - The same product can be used in multiple posts
   - Products in the library are independent of blog posts
   - Changes to library products don't affect existing posts (products are copied when added to posts)

## API Endpoints

The product library uses the following API endpoints:

- `GET /api/product-library?subcategory_id={id}` - Get products (optionally filtered by subcategory)
- `POST /api/product-library` - Create a new product
- `PUT /api/product-library` - Update an existing product
- `DELETE /api/product-library?id={id}` - Delete a product

## Database Schema

The `product_library` table includes:
- `id` - Unique identifier
- `subcategory_id` - Foreign key to subcategories table
- `name` - Product name
- `description` - Product description
- `image_url` - Product image URL
- `amazon_affiliate_link` - Amazon affiliate link
- `display_order` - Order for display
- `is_featured` - Featured flag
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Notes

- Products in the library are **copied** to blog posts when selected, not linked
- This means you can modify library products without affecting existing posts
- Each blog post maintains its own copy of product data
- The library is for organization and reuse, not for shared product instances
