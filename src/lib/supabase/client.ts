import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser Supabase client
 *
 * Note: The Supabase anon key is safe to expose in the browser.
 * It is a *public* key and is protected by Row Level Security (RLS).
 */
export function createClient() {
  // Prefer environment variables if they are available (local dev, properly configured builds)
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (envUrl && envKey) {
    return createBrowserClient(envUrl, envKey)
  }

  // Fallback for production if build-time env vars were not wired correctly:
  // TODO: REPLACE THESE TWO STRINGS with your actual Supabase project URL and anon key.
  // You can copy them from Supabase Dashboard → Settings → API.
  const hardcodedUrl = 'https://your-project-id.supabase.co'
  const hardcodedAnonKey = 'your_anon_public_key_here'

  if (!hardcodedUrl || !hardcodedAnonKey || hardcodedUrl.includes('your-project-id')) {
    // Make failure explicit during development if the values weren't replaced.
    throw new Error(
      'Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY env vars ' +
      'or replace hardcodedUrl / hardcodedAnonKey in src/lib/supabase/client.ts.'
    )
  }

  return createBrowserClient(hardcodedUrl, hardcodedAnonKey)
}
