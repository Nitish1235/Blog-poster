import { createClient } from '@/lib/supabase/server'

export interface PostAnalytics {
  post_id: string
  title: string
  slug: string
  views: number
  clicks: number
  conversion_rate: number
  published_at: string | null
}

export interface ProductAnalytics {
  product_id: string
  product_name: string
  clicks: number
  blog_post_id: string
  blog_post_title: string
}

/**
 * Get analytics for all posts
 */
export async function getAllPostAnalytics(): Promise<PostAnalytics[]> {
  try {
    const supabase = await createClient()
    
    // Get all published posts with their view and click counts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, published_at')
      .eq('published', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts for analytics:', postsError)
      return []
    }

    if (!posts || posts.length === 0) {
      return []
    }

    const postIds = posts.map(p => p.id)

    // Get view counts
    const { data: viewsData } = await supabase
      .from('post_views')
      .select('blog_post_id')
      .in('blog_post_id', postIds)

    // Get click counts
    const { data: clicksData } = await supabase
      .from('product_clicks')
      .select('blog_post_id')
      .in('blog_post_id', postIds)

    // Count views and clicks per post
    const viewsMap = new Map<string, number>()
    const clicksMap = new Map<string, number>()

    viewsData?.forEach((view: any) => {
      viewsMap.set(view.blog_post_id, (viewsMap.get(view.blog_post_id) || 0) + 1)
    })

    clicksData?.forEach((click: any) => {
      clicksMap.set(click.blog_post_id, (clicksMap.get(click.blog_post_id) || 0) + 1)
    })

    // Combine data
    return posts.map((post: any) => {
      const views = viewsMap.get(post.id) || 0
      const clicks = clicksMap.get(post.id) || 0
      const conversionRate = views > 0 ? (clicks / views) * 100 : 0

      return {
        post_id: post.id,
        title: post.title,
        slug: post.slug,
        views,
        clicks,
        conversion_rate: Math.round(conversionRate * 100) / 100,
        published_at: post.published_at,
      }
    })
  } catch (error: any) {
    console.error('Error in getAllPostAnalytics:', error)
    return []
  }
}

/**
 * Get analytics for a specific post
 */
export async function getPostAnalytics(postId: string): Promise<PostAnalytics | null> {
  try {
    const supabase = await createClient()
    
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, published_at')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return null
    }

    // Get view count
    const { count: viewsCount } = await supabase
      .from('post_views')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', postId)

    // Get click count
    const { count: clicksCount } = await supabase
      .from('product_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', postId)

    const views = viewsCount || 0
    const clicks = clicksCount || 0
    const conversionRate = views > 0 ? (clicks / views) * 100 : 0

    return {
      post_id: post.id,
      title: post.title,
      slug: post.slug,
      views,
      clicks,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      published_at: post.published_at,
    }
  } catch (error: any) {
    console.error('Error in getPostAnalytics:', error)
    return null
  }
}

/**
 * Get top performing products
 */
export async function getTopProducts(limit: number = 10): Promise<ProductAnalytics[]> {
  try {
    const supabase = await createClient()
    
    // Get click counts per product
    const { data: clicksData, error: clicksError } = await supabase
      .from('product_clicks')
      .select('affiliate_product_id, blog_post_id')
      .order('clicked_at', { ascending: false })
      .limit(limit * 10) // Get more to account for grouping

    if (clicksError) {
      console.error('Error fetching product clicks:', clicksError)
      return []
    }

    if (!clicksData || clicksData.length === 0) {
      return []
    }

    // Count clicks per product
    const productClicksMap = new Map<string, { count: number; postId: string }>()
    
    clicksData.forEach((click: any) => {
      const key = click.affiliate_product_id
      if (!productClicksMap.has(key)) {
        productClicksMap.set(key, { count: 0, postId: click.blog_post_id })
      }
      const current = productClicksMap.get(key)!
      current.count += 1
    })

    // Get product and post details
    const productIds = Array.from(productClicksMap.keys())
    const postIds = Array.from(new Set(Array.from(productClicksMap.values()).map(v => v.postId)))

    const [productsResult, postsResult] = await Promise.all([
      supabase
        .from('affiliate_products')
        .select('id, name')
        .in('id', productIds),
      supabase
        .from('blog_posts')
        .select('id, title')
        .in('id', postIds),
    ])

    const products = productsResult.data || []
    const posts = postsResult.data || []

    const productsMap = new Map(products.map((p: any) => [p.id, p.name]))
    const postsMap = new Map(posts.map((p: any) => [p.id, p.title]))

    // Combine and sort by clicks
    const result: ProductAnalytics[] = Array.from(productClicksMap.entries())
      .map(([productId, data]) => ({
        product_id: productId,
        product_name: productsMap.get(productId) || 'Unknown Product',
        clicks: data.count,
        blog_post_id: data.postId,
        blog_post_title: postsMap.get(data.postId) || 'Unknown Post',
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit)

    return result
  } catch (error: any) {
    console.error('Error in getTopProducts:', error)
    return []
  }
}

/**
 * Get recent activity (views and clicks)
 */
export async function getRecentActivity(limit: number = 50) {
  try {
    const supabase = await createClient()
    
    const [viewsResult, clicksResult] = await Promise.all([
      supabase
        .from('post_views')
        .select('blog_post_id, viewed_at')
        .order('viewed_at', { ascending: false })
        .limit(limit),
      supabase
        .from('product_clicks')
        .select('affiliate_product_id, blog_post_id, clicked_at, click_type')
        .order('clicked_at', { ascending: false })
        .limit(limit),
    ])

    return {
      views: viewsResult.data || [],
      clicks: clicksResult.data || [],
    }
  } catch (error: any) {
    console.error('Error in getRecentActivity:', error)
    return { views: [], clicks: [] }
  }
}
