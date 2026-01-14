# Production Environment Variables Setup

## Quick Fix for "Supabase Not Configured" Warning

If you're seeing the warning on your production site, you need to set the Supabase environment variables in Google Cloud Run.

## Method 1: Using gcloud CLI (Fastest)

```bash
# Replace these with your actual Supabase values
gcloud run services update pickbettr \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,NEXT_PUBLIC_SITE_URL=https://your-cloud-run-url.run.app" \
  --region=us-central1
```

**Get your Supabase values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon/public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Method 2: Using Google Cloud Console (Visual)

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service name (`pickbettr`)
3. Click **"EDIT & DEPLOY NEW REVISION"** button
4. Scroll down to **"Variables & Secrets"** section
5. Click **"ADD VARIABLE"** and add these three variables:

   | Variable Name | Value |
   |--------------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-service-url.run.app` |

6. Click **"DEPLOY"** button at the bottom
7. Wait for deployment to complete (1-2 minutes)
8. Refresh your website - the warning should be gone!

## Verify It's Working

After setting the variables, check:
1. Visit your login page - the warning should be gone
2. Try logging in - it should work now
3. Check Cloud Run logs if there are any errors:
   ```bash
   gcloud run services logs read pickbettr --region=us-central1 --limit=50
   ```

## Troubleshooting

### Still seeing the warning?
- Wait 1-2 minutes for the new revision to deploy
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check that variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- Verify your Supabase URL doesn't have trailing slashes
- Check Cloud Run logs for errors

### Getting authentication errors?
- Make sure your Supabase project is active
- Verify the anon key is correct (starts with `eyJ...`)
- Check that your Supabase project has the correct database schema set up

## Security Note

These are **public** environment variables (they start with `NEXT_PUBLIC_`), which means they're safe to expose in the browser. The anon key is designed to be public and has Row Level Security (RLS) policies protecting your data.
