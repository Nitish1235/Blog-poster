# PickBettr - Affiliate Marketing Blog

A modern, neo-brutalist styled affiliate blog built with Next.js 16, TypeScript, Supabase, and Tailwind CSS. PickBettr helps you pick better strategies and make better decisions in affiliate marketing. This application allows you to manage and publish blog posts organized by categories and subcategories.

## Features

- 📝 **Blog Management**: Create, edit, and publish blog posts with rich HTML content
- 🏷️ **Categories & Subcategories**: Organize content hierarchically
- 🔐 **Admin Dashboard**: Secure admin panel for content management
- 🎨 **Neo-brutalist Design**: Bold, modern UI with hard shadows and vibrant colors
- 📱 **Responsive**: Works beautifully on all devices
- 🚀 **Fast**: Built on Next.js 16 with App Router for optimal performance
- 🔒 **Secure**: Row-level security with Supabase authentication

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

## Quick Start

### Prerequisites

1. Node.js 18+ installed
2. A Supabase account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd aff-blogs
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
   - Get your project URL and anon key from Project Settings > API

4. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Create an admin user:
   - In Supabase Dashboard > Authentication > Users
   - Click "Add User" and create an admin account

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting Started Guide

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── blog/           # Public blog pages
│   │   ├── api/            # API routes
│   │   ├── login/          # Authentication page
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   ├── blog/           # Blog components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   └── lib/
│       ├── supabase/       # Supabase client configuration
│       └── queries/        # Database query functions
├── supabase-schema.sql     # Database schema
└── SETUP.md                # Detailed setup guide
```

## Key Features

### Admin Dashboard

Access the admin panel at `/admin` after logging in:

- **Dashboard**: Overview of posts, categories, and subcategories
- **Posts**: Manage all blog posts (create, edit, delete, publish/unpublish)
- **Categories**: Organize content with colored categories
- **Subcategories**: Add subcategories under categories

### Blog Pages

- **Blog Listing** (`/blog`): View all published posts in a grid layout
- **Blog Post** (`/blog/[slug]`): Individual post pages with sharing options

### Authentication

- Secure login page at `/login`
- Protected admin routes with middleware
- Session management via Supabase Auth

## Database Schema

The application uses three main tables:

1. **categories**: Blog post categories with color coding
2. **subcategories**: Subcategories under categories
3. **blog_posts**: Blog posts with metadata and content

See `supabase-schema.sql` for the complete schema with indexes and security policies.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Customization

### Colors

Edit the color scheme in `src/app/globals.css`:
- `--color-primary`: Yellow (#F2C94C)
- `--color-secondary`: Teal (#82C7C7)
- `--color-accent`: Green (#6FCF97)

### Fonts

The project uses:
- **Inter**: Body text
- **Montserrat**: Headings

Configured in `src/app/layout.tsx`

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to update `NEXT_PUBLIC_SITE_URL` with your production URL.

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access only for published content
- Admin authentication required for content management
- Secure session handling with Supabase

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or refer to the [SETUP.md](./SETUP.md) guide.
