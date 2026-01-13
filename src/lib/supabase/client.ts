import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, provide dummy values that will fail gracefully
  // The @supabase/ssr library requires non-empty strings and valid URL format
  if (!supabaseUrl || !supabaseAnonKey) {
    // Use a valid-looking URL format that will pass validation
    // but will fail on actual network requests (which is fine)
    return createBrowserClient(
      'https://xxxxxxxxxxxxxxxxxxxxx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
