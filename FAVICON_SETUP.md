# Favicon Setup Guide

The favicon has been configured for your PickBettr website. Here's what was set up:

## Files Created

1. **`public/icon.svg`** - SVG favicon (modern browsers)
2. **`public/favicon.ico`** - ICO favicon (fallback for older browsers)
3. **`src/app/icon.tsx`** - Dynamic PNG icon generator (served at `/icon`)
4. **`src/app/apple-icon.tsx`** - Apple touch icon (served at `/apple-icon`)
5. **`public/manifest.json`** - Web app manifest

## How to See the Favicon

### 1. Clear Browser Cache
The browser may have cached the old favicon. To see the new one:

**Chrome/Edge:**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- Or hard refresh: `Ctrl + F5` or `Ctrl + Shift + R`

**Firefox:**
- Press `Ctrl + Shift + Delete`
- Select "Cache"
- Click "Clear Now"
- Or hard refresh: `Ctrl + F5`

**Safari:**
- Press `Cmd + Option + E` to clear cache
- Or hard refresh: `Cmd + Shift + R`

### 2. Restart Development Server
```bash
# Stop the current server (Ctrl + C)
# Then restart:
npm run dev
```

### 3. Verify Files Are Accessible
Visit these URLs in your browser to verify:
- `http://localhost:3000/icon.svg` - Should show the SVG icon
- `http://localhost:3000/favicon.ico` - Should download/show the ICO file
- `http://localhost:3000/icon` - Should show the PNG icon (32x32)
- `http://localhost:3000/apple-icon` - Should show the Apple icon (180x180)

### 4. Check Browser Tab
After clearing cache and restarting, the favicon should appear in:
- Browser tabs
- Bookmarks
- Browser history
- Address bar (some browsers)

## For Google Search

Google will automatically pick up your favicon when it crawls your site. To ensure it's indexed:

1. **Submit your sitemap** to Google Search Console
2. **Request indexing** of your homepage
3. **Wait 1-2 weeks** for Google to crawl and update

The favicon will appear in:
- Google search results
- Browser history
- Bookmarks

## Troubleshooting

If the favicon still doesn't show:

1. **Check browser console** for 404 errors
2. **Verify files exist** in the `public` folder
3. **Check metadata** in `src/app/layout.tsx`
4. **Try incognito/private mode** to bypass cache
5. **Check network tab** to see if favicon requests are successful

## Files Location

- Static files: `public/icon.svg`, `public/favicon.ico`
- Dynamic icons: `src/app/icon.tsx`, `src/app/apple-icon.tsx`
- Manifest: `public/manifest.json`
- Metadata: `src/app/layout.tsx`

The favicon should now work correctly!
