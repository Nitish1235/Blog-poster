# Environment Variables Setup

## Quick Setup

1. **Create a `.env.local` file** in the root directory of your project (same level as `package.json`)

2. **Copy the following template** into `.env.local`:

```env
# Supabase Configuration
# Get these values from: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project (or create a new one)
   - Go to **Settings** → **API**
   - Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Example of what it should look like:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Restart your development server** after creating/updating `.env.local`:
   ```bash
   npm run dev
   ```

## Important Notes

- The `.env.local` file is already in `.gitignore` and won't be committed to git
- Never share your Supabase keys publicly
- The `NEXT_PUBLIC_` prefix makes these variables available to the browser
- For production, set these same variables in your hosting platform's environment settings
