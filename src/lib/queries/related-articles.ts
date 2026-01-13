import { createClient } from '@/lib/supabase/server'
import { BlogPostWithRelations } from '@/lib/database.types'

/**
 * Get related articles for a blog post
 * If manually selected articles exist, return those
 * Otherwise, return top 3 latest from same category/subcategory
 */
export async function getRelatedArticles(
  blogPostId: string,
  categoryId: string,
  subcategoryId: string | null,
  published: boolean = true
): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = await createClient()
    
    // First, check if there are manually selected related articles
    const { data: relatedArticles, error: relatedError } = await supabase
      .from('related_articles')
      .select('related_post_id, display_order')
      .eq('blog_post_id', blogPostId)
      .order('display_order', { ascending: true })
      .limit(3)

    if (!relatedError && relatedArticles && relatedArticles.length > 0) {
      // Return manually selected articles
      const relatedPostIds = relatedArticles.map((ra: any) => ra.related_post_id)
      
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .in('id', relatedPostIds)

      if (published) {
        query = query.eq('published', true).not('published_at', 'is', null)
      }

      const { data: posts, error } = await query

      if (error) {
        console.error('Error fetching related articles:', error)
        // Fall through to auto-selection
      } else if (posts && posts.length > 0) {
        // Sort by display_order
        const sortedPosts = relatedArticles
          .map((ra: any) => posts.find((p: any) => p.id === ra.related_post_id))
          .filter((p: any) => p !== undefined)
        
        return sortedPosts as BlogPostWithRelations[]
      }
    }

    // Auto-select: Get top 3 latest from same category/subcategory
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .neq('id', blogPostId) // Exclude current post
      .order('created_at', { ascending: false })
      .limit(3)

    if (published) {
      query = query.eq('published', true).not('published_at', 'is', null)
    }

    // Filter by subcategory first (more specific), then category
    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId)
    } else {
      query = query.eq('category_id', categoryId)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching related articles:', error)
      return []
    }

    return (posts || []) as BlogPostWithRelations[]
  } catch (error: any) {
    console.error('Error in getRelatedArticles:', error)
    return []
  }
}
