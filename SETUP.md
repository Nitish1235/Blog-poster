# Setup Guide for Affiliate Blog Application

This guide will help you set up your Supabase database and configure the application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js 18+ installed
3. npm or yarn package manager

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be fully provisioned
3. Note your project URL and anon key from the project settings

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. First, run the main schema:
   - Open the `supabase-schema.sql` file from this project
   - Copy and paste the entire SQL script into the SQL Editor
   - Click "Run" to execute the script
3. Then, run the products schema:
   - Open the `supabase-products-schema.sql` file from this project
   - Copy and paste the entire SQL script into the SQL Editor
   - Click "Run" to execute the script
4. This will create all necessary tables (categories, subcategories, blog_posts, and affiliate_products), indexes, and security policies

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace:
- `your_supabase_project_url` with your Supabase project URL (found in Project Settings > API)
- `your_supabase_anon_key` with your Supabase anon/public key (found in Project Settings > API)
- Update `NEXT_PUBLIC_SITE_URL` with your production URL when deploying

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Set Up Authentication

1. In your Supabase dashboard, go to Authentication > Users
2. Click "Add User" to create an admin user
3. Set the email and password (you can also enable email confirmation if needed)
4. This user will be able to access the admin panel at `/admin`

## Step 6: Create Initial Categories

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Login with your admin credentials
4. Go to the Categories page and create some categories:
   - Strategy (color: primary)
   - SEO (color: secondary)
   - Email (color: accent)
   - Copywriting (color: primary)
   - Reviews (color: secondary)
   - Tools (color: accent)

## Step 7: Create Subcategories (Optional)

1. Go to the Subcategories page in the admin panel
2. Create subcategories and assign them to categories
   - Example: Under "SEO", you might create "Technical SEO", "On-Page SEO", etc.

## Step 8: Create Your First Blog Post

1. Go to the Posts page in the admin panel
2. Click "New Post"
3. Fill in all the required fields:
   - Title
   - Slug (auto-generated from title)
   - Category (required)
   - Subcategory (optional)
   - Author name and email
   - Read time (in minutes)
   - Excerpt (brief description)
   - Content (HTML format)
   - Featured image URL (optional)
   - Check "Publish immediately" to make it visible
4. Click "Create Post"

## Step 9: Test Your Blog

1. Navigate to `http://localhost:3000/blog` to see your published posts
2. Click on a post to view the full article
3. Make sure all links and images are working correctly

## Database Structure

### Categories Table
- Stores blog post categories
- Has a color field (primary, secondary, accent) for styling

### Subcategories Table
- Stores subcategories under categories
- Linked to categories via foreign key

### Blog Posts Table
- Stores all blog posts
- Can be published or draft
- Linked to categories and optionally subcategories
- Includes metadata like author, read time, featured image

## Security

- Row Level Security (RLS) is enabled on all tables
- Public users can only read published blog posts and categories
- Only authenticated users can create, update, or delete content
- Admin routes are protected by middleware

## Tips

1. **Slug Generation**: Slugs are auto-generated from titles when creating new posts/categories
2. **HTML Content**: Blog post content accepts HTML - you can format your posts with HTML tags
3. **Featured Images**: Use full URLs for featured images (or host them yourself)
4. **Read Time**: Estimate read time based on content length (average reading speed: 200 words/minute)
5. **Publishing**: Posts must be marked as published AND have a published_at timestamp to appear on the public blog

## Troubleshooting

### Cannot access admin panel
- Make sure you're logged in
- Check that your Supabase RLS policies are correctly set up
- Verify your environment variables are set correctly

### Posts not showing up
- Check that posts are marked as "published" and have a `published_at` timestamp
- Verify the query functions are working correctly
- Check browser console for errors

### Database connection errors
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that your Supabase project is active and not paused
- Ensure you've run the SQL schema script

## Next Steps

- Customize the design and branding
- Add more features like tags, comments, or search
- Set up image upload functionality
- Add analytics tracking
- Configure email notifications for new posts
- Set up RSS feed for your blog
