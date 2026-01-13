# Amazon Affiliate Products Setup Guide

This guide explains how to add Amazon affiliate products to your blog posts.

## Overview

Each blog post can have 3-5 Amazon affiliate products. These products are displayed in an attractive grid layout at the bottom of each blog post.

## Database Setup

1. **Run the products schema:**
   - In your Supabase dashboard, go to SQL Editor
   - Open `supabase-products-schema.sql` from this project
   - Copy and paste the SQL script
   - Click "Run" to create the `affiliate_products` table

## Adding Products to a Blog Post

### Step 1: Create or Edit a Blog Post

1. Go to Admin Panel → Posts
2. Create a new post or edit an existing one
3. Fill in all the post details (title, content, etc.)
4. Save the post

### Step 2: Add Affiliate Products

After creating/editing a post, you'll see the "Affiliate Products" section:

1. **Click "Add Product"** to add products (minimum 3, maximum 5)
2. **Fill in product details for each product:**
   - **Product Name*** (required): The name of the Amazon product
   - **Description*** (required): A brief description of the product
   - **Product Image URL*** (required): Direct URL to the product image
   - **Amazon Affiliate Link*** (required): Your Amazon affiliate link
   - **Featured Product**: Check to mark as featured (shows a badge)
   
   **Note:** Price, rating, and review count are not stored as they change frequently on Amazon. Users will see current prices and ratings when they visit Amazon through your affiliate links.

3. **Click "Save Products"** to save all products

### Step 3: Product Display Order

Products are displayed in the order you add them. The first product has `display_order: 0`, second has `display_order: 1`, etc.

## Getting Amazon Affiliate Links

1. **Sign up for Amazon Associates:**
   - Go to [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
   - Sign up for an account
   - Get your affiliate tag

2. **Create affiliate links:**
   - Find a product on Amazon
   - Use Amazon's link builder or add your tag to the URL
   - Format: `https://amazon.com/dp/PRODUCT_ID?tag=YOUR_TAG`

3. **Get product images:**
   - Right-click on product image on Amazon
   - Copy image address
   - Use the direct image URL (not the thumbnail)

## Product Display

Products are displayed on the blog post page in a responsive grid:
- **Desktop**: 3 columns
- **Tablet**: 2 columns  
- **Mobile**: 1 column

Each product card shows:
- Product image with hover effect
- Product name
- Description
- "Buy Now on Amazon" button with affiliate link
- "Add to Cart on Amazon" link
- Featured badge (if marked as featured)
- Verified Amazon Product indicator

## Best Practices

1. **Use high-quality images**: Use Amazon's product images directly
2. **Write compelling descriptions**: Highlight key features and benefits
3. **Feature your top pick**: Mark your #1 recommendation as featured
4. **Test links**: Always test affiliate links before publishing
5. **Comply with FTC**: Include proper disclosure (already included in the template)
6. **Keep descriptions current**: Since prices and ratings aren't stored, make sure your descriptions highlight the product's value proposition

## Disclosure

The blog post template automatically includes an Amazon Associates disclosure at the bottom of the products section. Make sure to comply with FTC guidelines and Amazon's affiliate program terms.

## Troubleshooting

**Products not showing?**
- Make sure you've run the `supabase-products-schema.sql` script
- Check that products are saved (click "Save Products" button)
- Verify the blog post is published
- Check browser console for errors

**Can't save products?**
- Ensure you're logged in as admin
- Check that all required fields are filled
- Verify you have 3-5 products (minimum 3, maximum 5)
- Check Supabase RLS policies are set correctly
