import { NextResponse } from 'next/server'

// Serve the SVG icon as favicon.ico
export async function GET() {
  // Redirect to icon.svg which browsers can use
  return NextResponse.redirect(new URL('/icon.svg', process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'), {
    status: 301,
  })
}
