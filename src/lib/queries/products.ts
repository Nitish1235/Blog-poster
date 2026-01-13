import { createClient } from '@/lib/supabase/server'
import { AffiliateProduct } from '@/lib/database.types'

export async function getProductsByBlogPost(blogPostId: string): Promise<AffiliateProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('affiliate_products')
    .select('*')
    .eq('blog_post_id', blogPostId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}
