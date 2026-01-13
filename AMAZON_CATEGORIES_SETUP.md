# Amazon Affiliate Categories Setup Guide

This guide explains how to set up the complete Amazon Affiliate Product Categories and Subcategories in your PickBettr blog.

## Overview

The seed script includes **10 main categories** and **35 subcategories** based on the comprehensive Amazon Affiliate Product Categories Master List for 2026.

## Categories Included

1. **Home & Lifestyle** (Primary - Yellow)
   - Kitchen & Cooking
   - Home Office & Workspace
   - Smart Home & Automation
   - Home Decor & Organization
   - Garden & Outdoor

2. **Health, Wellness & Personal Care** (Accent - Green)
   - Biohacking & Longevity
   - Fitness & Exercise
   - Self-Care & Relaxation
   - Luxury Beauty

3. **Tech & Gaming** (Secondary - Teal)
   - Gaming
   - Photography & Video
   - Portable Tech & Accessories
   - Computer & Peripherals

4. **Family & Pets** (Primary - Yellow)
   - Pet Supplies
   - Baby Gear
   - Kids & Family

5. **Sustainable & Eco-Living** (Accent - Green)
   - Energy & Power
   - Waste Reduction
   - Ethical Fashion

6. **Fashion & Accessories** (Primary - Yellow)
   - Women's Fashion
   - Men's Fashion
   - Footwear
   - Luggage & Travel

7. **Automotive** (Secondary - Teal)
   - Car Parts & Accessories
   - Motorcycle & Powersports

8. **Sports & Outdoors** (Accent - Green)
   - Outdoor Recreation
   - Fitness Sports

9. **Toys & Games** (Primary - Yellow)
   - Educational Toys
   - Board Games & Puzzles
   - Action Figures & Collectibles
   - Outdoor Toys

10. **Books & Media** (Secondary - Teal)
    - Books
    - E-Books & Digital
    - Movies & TV

## Setup Instructions

### Step 1: Run the Seed Script

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Open the file `supabase-amazon-categories-seed.sql`
4. Copy and paste the entire script
5. Click **Run** to execute

### Step 2: Verify the Data

After running the script, you should see:
- **10 categories** created
- **35 subcategories** created
- A summary table showing each category with its subcategory count

### Step 3: Check in Admin Panel

1. Log into your admin panel at `/admin`
2. Go to **Categories** to see all 10 categories
3. Go to **Subcategories** to see all 35 subcategories
4. Verify that each category has its associated subcategories

## Category Color Distribution

- **Primary (Yellow)**: 4 categories
  - Home & Lifestyle
  - Family & Pets
  - Fashion & Accessories
  - Toys & Games

- **Secondary (Teal)**: 3 categories
  - Tech & Gaming
  - Automotive
  - Books & Media

- **Accent (Green)**: 3 categories
  - Health, Wellness & Personal Care
  - Sustainable & Eco-Living
  - Sports & Outdoors

## Commission Rates by Category

| Category | Commission Rate | Notes |
|----------|----------------|-------|
| Luxury Beauty | 10% | Highest commission |
| Health & Wellness | 4-10% | Varies by product |
| Home & Lifestyle | 4.5% | High volume |
| Fashion & Accessories | 4% | Very high volume |
| Tech & Gaming | 2.5% | High volume, lower margin |
| Pet Supplies | 3% | High volume |
| Books & Media | 4.5% | Medium volume |

## Content Strategy Recommendations

### High-Commission Products (8-10%)
- Focus on in-depth reviews
- "Best of 2026" roundups
- Comparison guides
- Video demonstrations

### Medium-Commission Products (4-4.5%)
- "Top 10" listicles
- Buyer's guides
- "Must-Have" articles
- Use case-specific recommendations

### Lower-Commission Products (2.5-3%)
- Volume-based content
- Comparison videos
- Setup tutorials
- "Is it worth it?" reviews

## Notes

- The script uses `ON CONFLICT DO NOTHING` to prevent duplicates if run multiple times
- Each category includes commission rate information in the description
- Subcategories are linked to their parent categories automatically
- All slugs are URL-friendly and SEO-optimized

## Troubleshooting

**If categories don't appear:**
1. Check that the script ran without errors
2. Verify you're logged in as admin
3. Refresh the admin panel page
4. Check Supabase logs for any errors

**If you want to start fresh:**
1. Uncomment the `TRUNCATE` statements at the top of the script
2. Run the script again
3. This will delete all existing categories and subcategories

## Next Steps

After setting up categories:
1. Create blog posts for each category/subcategory
2. Add affiliate products to your posts
3. Use the analytics dashboard to track performance
4. Optimize content based on commission rates and search volume
