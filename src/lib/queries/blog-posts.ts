import { createClient } from '@/lib/supabase/server'
import { BlogPost, BlogPostWithRelations } from '@/lib/database.types'

export async function getAllBlogPosts(published: boolean = true): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = await createClient()
    
    // First, get all blog posts
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .order('created_at', { ascending: false })

    if (published) {
      query = query.eq('published', true).not('published_at', 'is', null)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    if (!posts || posts.length === 0) {
      return []
    }

    // Fetch products separately and attach them to posts
    const postIds = posts.map((post: any) => post.id)
    const { data: products, error: productsError } = await supabase
      .from('affiliate_products')
      .select('*')
      .in('blog_post_id', postIds)
      .order('display_order', { ascending: true })

    if (productsError) {
      console.error('Error fetching products:', productsError)
      // Continue without products rather than failing completely
    }

    // Attach products to their respective posts
    const postsWithProducts = posts.map((post: any) => ({
      ...post,
      products: (products || []).filter((p: any) => p.blog_post_id === post.id)
    }))

    return postsWithProducts as BlogPostWithRelations[]
  } catch (error: any) {
    // Handle missing Supabase configuration gracefully
    if (error.message?.includes('Missing Supabase environment variables')) {
      console.warn('Supabase not configured. Please set up your .env.local file.')
      return []
    }
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string, published: boolean = true): Promise<BlogPostWithRelations | null> {
  try {
    const supabase = await createClient()
    
    // First, get the blog post
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .eq('slug', slug)

    if (published) {
      query = query.eq('published', true).not('published_at', 'is', null)
    }

    const { data: post, error } = await query.single()

    if (error || !post) {
      console.error('Error fetching blog post:', error)
      return null
    }

    // Fetch products separately
    const { data: products, error: productsError } = await supabase
      .from('affiliate_products')
      .select('*')
      .eq('blog_post_id', post.id)
      .order('display_order', { ascending: true })

    if (productsError) {
      console.error('Error fetching products:', productsError)
      // Continue without products rather than failing completely
    }

    // Attach products to the post
    return {
      ...post,
      products: (products || [])
    } as BlogPostWithRelations
  } catch (error: any) {
    // Handle missing Supabase configuration gracefully
    if (error.message?.includes('Missing Supabase environment variables')) {
      console.warn('Supabase not configured. Please set up your .env.local file.')
      return null
    }
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getBlogPostsByCategory(categorySlug: string, published: boolean = true): Promise<BlogPostWithRelations[]> {
  const supabase = await createClient()
  
  // First get the category
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*)
    `)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  if (published) {
    query = query.eq('published', true).not('published_at', 'is', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts by category:', error)
    return []
  }

  return (data || []) as BlogPostWithRelations[]
}

export async function getBlogPostsBySubcategory(subcategorySlug: string, published: boolean = true): Promise<BlogPostWithRelations[]> {
  const supabase = await createClient()
  
  // First get the subcategory
  const { data: subcategory } = await supabase
    .from('subcategories')
    .select('id')
    .eq('slug', subcategorySlug)
    .single()

  if (!subcategory) return []

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*)
    `)
    .eq('subcategory_id', subcategory.id)
    .order('created_at', { ascending: false })

  if (published) {
    query = query.eq('published', true).not('published_at', 'is', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts by subcategory:', error)
    return []
  }

  return (data || []) as BlogPostWithRelations[]
}
