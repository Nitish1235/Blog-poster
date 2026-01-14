import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Prefer environment variables if available
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fallback to the same hardcoded values as the browser client, so that
  // production keeps working even if env vars are not wired through correctly.
  if (!supabaseUrl || !supabaseAnonKey) {
    // IMPORTANT: keep these in sync with src/lib/supabase/client.ts
    const hardcodedUrl = 'https://kbicmlvdsvoknmbaiejc.supabase.co'
    const hardcodedAnonKey = 'sb_publishable_KpEe80akRDmo70TKWpDtXg_v7IVdO0r'

    if (!hardcodedUrl || !hardcodedAnonKey) {
      throw new Error(
        'Missing Supabase configuration on the server. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'or update hardcoded values in src/lib/supabase/server.ts.'
      )
    }

    supabaseUrl = hardcodedUrl
    supabaseAnonKey = hardcodedAnonKey
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
