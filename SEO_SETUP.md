# SEO Setup Guide for Google Indexing

This guide covers everything you need to get your site listed and ranked on Google.

## ✅ What's Already Configured

Your site now includes:

1. **robots.txt** - Tells search engines which pages to crawl
   - Located at: `https://postbettr.com/robots.txt`
   - Allows all public pages, blocks `/admin/` and `/api/`

2. **sitemap.xml** - Lists all your pages for Google
   - Located at: `https://postbettr.com/sitemap.xml`
   - Automatically includes all published blog posts
   - Updates when you publish new posts

3. **Meta Tags** - SEO metadata on every page
   - Title tags, descriptions, keywords
   - Open Graph tags (for Facebook, LinkedIn sharing)
   - Twitter Card tags
   - Canonical URLs

4. **Structured Data (JSON-LD)** - Helps Google understand your content
   - Organization schema on homepage
   - BlogPosting schema on article pages
   - Product schema for affiliate products
   - WebSite schema with search functionality

5. **Mobile-Friendly** - Responsive design (required by Google)

## 🚀 Steps to Get Listed on Google

### Step 1: Verify Your Site in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Enter your domain: `https://postbettr.com`
4. Choose verification method:
   - **Recommended**: HTML file upload
     - Download the HTML file Google provides
     - Upload it to your `public/` folder
     - Deploy and verify
   - **Alternative**: HTML tag
     - Copy the meta tag Google provides
     - Add it to `src/app/layout.tsx` in the `<head>` section
     - Deploy and verify

### Step 2: Submit Your Sitemap

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://postbettr.com/sitemap.xml`
3. Click **Submit**
4. Google will start crawling your site (can take a few days)

### Step 3: Request Indexing (Optional but Recommended)

1. In Google Search Console, use **URL Inspection** tool
2. Enter your homepage URL: `https://postbettr.com`
3. Click **"Request Indexing"**
4. Repeat for important pages (blog listing, key articles)

### Step 4: Set Up Google Site Verification (Optional)

If you want to use the meta tag method, add this to your environment variables:

```bash
# In Cloud Run or .env.local
GOOGLE_SITE_VERIFICATION=your_verification_code_here
```

Then update `src/app/layout.tsx` to include:
```tsx
verification: {
  google: process.env.GOOGLE_SITE_VERIFICATION,
},
```

## 📊 Monitor Your SEO Performance

### Google Search Console
- **Coverage**: See which pages are indexed
- **Performance**: Track search impressions and clicks
- **Mobile Usability**: Ensure mobile-friendly status
- **Core Web Vitals**: Monitor page speed and user experience

### Key Metrics to Watch
1. **Indexed Pages** - Should match your published posts
2. **Search Impressions** - How often your site appears in search
3. **Click-Through Rate (CTR)** - Percentage of impressions that result in clicks
4. **Average Position** - Where your pages rank in search results

## 🔍 SEO Best Practices Already Implemented

### ✅ Technical SEO
- [x] Mobile-responsive design
- [x] Fast page load times (Next.js optimization)
- [x] Clean URL structure (`/blog/post-slug`)
- [x] HTTPS enabled (required by Cloud Run)
- [x] XML sitemap
- [x] robots.txt configured
- [x] Canonical URLs to prevent duplicate content

### ✅ On-Page SEO
- [x] Unique title tags on every page
- [x] Meta descriptions (150-160 characters)
- [x] Heading structure (H1, H2, H3)
- [x] Alt text for images (add when uploading)
- [x] Internal linking between related articles
- [x] Schema.org structured data

### ✅ Content SEO
- [x] Keyword-rich titles and descriptions
- [x] Category and subcategory organization
- [x] Related articles section
- [x] Author attribution
- [x] Publication dates

## 🎯 Additional SEO Tips

### 1. Content Quality
- Write comprehensive, helpful articles (1000+ words ideal)
- Use keywords naturally in content
- Include internal links to related posts
- Add images with descriptive alt text

### 2. External Links
- Get backlinks from reputable sites
- Share on social media (Twitter, Facebook, LinkedIn)
- Submit to relevant directories
- Guest post on other blogs

### 3. Regular Updates
- Publish new content regularly
- Update old posts with new information
- Keep sitemap fresh (automatic)

### 4. Performance Optimization
- Optimize images (use Next.js Image component)
- Minimize JavaScript bundle size
- Use CDN for static assets (Cloud Run handles this)

## 🔧 Troubleshooting

### Site Not Appearing in Google?

1. **Check Indexing Status**
   - Use Google Search Console → Coverage
   - Look for errors or warnings

2. **Verify robots.txt**
   - Visit: `https://postbettr.com/robots.txt`
   - Ensure it's not blocking important pages

3. **Check Sitemap**
   - Visit: `https://postbettr.com/sitemap.xml`
   - Verify all pages are listed

4. **Wait for Crawling**
   - Google can take 1-7 days to index new sites
   - Be patient and keep publishing quality content

### Common Issues

**Issue**: "Site not indexed"
- **Solution**: Request indexing in Search Console, check robots.txt

**Issue**: "Duplicate content"
- **Solution**: Canonical URLs are already set, ensure unique titles/descriptions

**Issue**: "Mobile usability errors"
- **Solution**: Test with Google's Mobile-Friendly Test tool

## 📝 Quick Checklist

Before submitting to Google:

- [ ] Site is live and accessible at `https://postbettr.com`
- [ ] robots.txt is accessible and correct
- [ ] sitemap.xml is accessible and includes all pages
- [ ] All pages have unique titles and descriptions
- [ ] Site is mobile-friendly
- [ ] HTTPS is enabled
- [ ] Google Search Console property is verified
- [ ] Sitemap is submitted to Search Console
- [ ] At least 3-5 quality blog posts are published

## 🎉 Next Steps

1. **Verify in Google Search Console** (Step 1 above)
2. **Submit your sitemap** (Step 2 above)
3. **Request indexing** for key pages (Step 3 above)
4. **Monitor performance** in Search Console
5. **Keep publishing quality content** regularly

## 📚 Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Schema.org Documentation](https://schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/) - Test your site speed

---

**Note**: It typically takes 1-7 days for Google to start indexing your site after submission. Be patient and focus on creating quality content while you wait!
