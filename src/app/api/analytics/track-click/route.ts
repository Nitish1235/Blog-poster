import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * Track product click
 * Called when a user clicks on an affiliate product link
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { product_id, post_id, click_type = 'buy_now' } = body

    if (!product_id || !post_id) {
      return NextResponse.json({ error: 'Product ID and Post ID are required' }, { status: 400 })
    }

    // Get request headers for analytics
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || ''
    const forwardedFor = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || ''
    const ipAddress = forwardedFor.split(',')[0].trim() || null

    // Insert click record
    const { error } = await supabase
      .from('product_clicks')
      .insert({
        affiliate_product_id: product_id,
        blog_post_id: post_id,
        click_type: click_type,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referer,
        clicked_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error tracking click:', error)
      // Don't fail the request if tracking fails
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in track-click:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
