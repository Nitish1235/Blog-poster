# Analytics Setup Guide

This guide explains how to set up and use the analytics functionality in PickBettr.

## Overview

The analytics system tracks:
- **Post Views**: Every time someone views a blog post
- **Product Clicks**: Every time someone clicks on an affiliate product link
- **Conversion Rates**: Percentage of viewers who click on products

## Database Setup

1. **Run the analytics schema:**
   - In your Supabase dashboard, go to SQL Editor
   - Open `supabase-analytics-schema.sql` from this project
   - Copy and paste the SQL script
   - Click "Run" to create the analytics tables

   This will create:
   - `post_views` table - tracks post views
   - `product_clicks` table - tracks product clicks
   - Indexes for fast queries
   - RLS policies for security

## How It Works

### Automatic Tracking

**Post Views:**
- Automatically tracked when someone visits a blog post page
- Uses the `TrackView` component
- Tracks IP address, user agent, referrer, and timestamp

**Product Clicks:**
- Automatically tracked when someone clicks "Buy Now" or "Add to Cart"
- Tracks which product was clicked
- Tracks which post the product was on
- Tracks click type (buy_now or add_to_cart)

### Privacy

- IP addresses are stored but can be anonymized if needed
- No personal information is collected
- Analytics are only visible to authenticated admin users
- All tracking happens server-side for privacy

## Viewing Analytics

1. **Go to Admin Panel → Analytics**
   - View total views, clicks, and conversion rate
   - See most viewed posts
   - See best converting posts
   - See top performing products
   - View detailed analytics table for all posts

2. **Dashboard Overview**
   - The admin dashboard shows quick stats
   - Total views and clicks across all posts
   - Quick link to full analytics page

## Analytics Metrics

### Post Analytics
- **Views**: Total number of times the post was viewed
- **Clicks**: Total number of product clicks from that post
- **Conversion Rate**: (Clicks / Views) × 100

### Product Analytics
- **Clicks**: Total number of times the product was clicked
- **Post Association**: Which post the clicks came from

## Best Practices

1. **Wait for Data**: Analytics need time to accumulate. New posts won't have data immediately.

2. **Conversion Rates**: 
   - A good conversion rate is typically 1-5%
   - Posts with 10+ views show more reliable conversion rates
   - Focus on posts with high conversion rates

3. **Top Products**: 
   - Identify which products perform best
   - Consider featuring top products more prominently
   - Create more content around high-performing products

4. **Content Optimization**:
   - If a post has high views but low clicks, improve product placement
   - If a post has low views, improve SEO and promotion
   - Use analytics to guide content strategy

## Troubleshooting

**No analytics data showing?**
- Make sure you've run the `supabase-analytics-schema.sql` script
- Check that posts are published (only published posts are tracked)
- Verify you're logged in as admin (analytics are admin-only)

**Analytics not tracking?**
- Check browser console for errors
- Verify API routes are accessible (`/api/analytics/track-view`, `/api/analytics/track-click`)
- Check Supabase RLS policies allow inserts

**High bounce rate?**
- This is normal for blog posts
- Focus on conversion rate (clicks per view) rather than bounce rate
- Improve product descriptions and placement

## Privacy & Compliance

- Analytics comply with GDPR (no personal data collected)
- IP addresses are stored but can be anonymized
- Consider adding a privacy policy mentioning analytics
- Users can block tracking via browser settings (analytics will gracefully fail)

## Future Enhancements

Potential analytics features to add:
- Date range filtering
- Export to CSV
- Charts and graphs
- Geographic data (if IP geolocation is added)
- Time-based trends
- A/B testing results
