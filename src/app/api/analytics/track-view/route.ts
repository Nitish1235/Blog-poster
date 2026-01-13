import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * Track post view
 * Called when a user views a blog post
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { post_id } = body

    if (!post_id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Get request headers for analytics
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || ''
    const forwardedFor = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || ''
    const ipAddress = forwardedFor.split(',')[0].trim() || null

    // Insert view record
    const { error } = await supabase
      .from('post_views')
      .insert({
        blog_post_id: post_id,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referer,
        viewed_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error tracking view:', error)
      // Don't fail the request if tracking fails
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in track-view:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
