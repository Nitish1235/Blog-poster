import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Preview API endpoint for draft posts
 * Allows previewing posts before they're published
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Log received data for debugging
    console.log('Preview API received data:', {
      hasTitle: !!body.title,
      hasExcerpt: !!body.excerpt,
      hasContent: !!body.content,
      hasFeaturedImage: !!body.featured_image_url,
      hasProducts: !!body.products,
      productsCount: body.products?.length || 0,
      titlePreview: body.title?.substring(0, 50),
      excerptPreview: body.excerpt?.substring(0, 50),
      contentPreview: body.content?.substring(0, 50),
    })
    
    const {
      title,
      slug,
      excerpt,
      content,
      category_id,
      subcategory_id,
      author_name,
      author_email,
      featured_image_url,
      read_time,
      products,
      related_articles,
    } = body

    // Fetch category and subcategory data
    const [categoryResult, subcategoryResult] = await Promise.all([
      category_id
        ? supabase.from('categories').select('*').eq('id', category_id).single()
        : Promise.resolve({ data: null, error: null }),
      subcategory_id
        ? supabase.from('subcategories').select('*').eq('id', subcategory_id).single()
        : Promise.resolve({ data: null, error: null }),
    ])

    const category = categoryResult.data
    const subcategory = subcategoryResult.data

    // Fetch related articles if provided
    let relatedArticlesData = []
    if (related_articles && related_articles.length > 0) {
      const { data: relatedPosts } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .in('id', related_articles)
        .eq('published', true)
        .not('published_at', 'is', null)
        .limit(3)
      
      relatedArticlesData = relatedPosts || []
    } else if (category_id) {
      // Auto-select top 3 from same category/subcategory
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .eq('published', true)
        .not('published_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3)

      if (subcategory_id) {
        query = query.eq('subcategory_id', subcategory_id)
      } else {
        query = query.eq('category_id', category_id)
      }

      const { data } = await query
      relatedArticlesData = data || []
    }

    // Format products data
    const formattedProducts = (products || []).map((product: any, index: number) => ({
      id: `preview-${index}`,
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      amazon_affiliate_link: product.amazon_affiliate_link,
      price: null,
      rating: null,
      review_count: 0,
      display_order: index,
      is_featured: product.is_featured || false,
    }))

    // Return preview data - ensure all fields are included
    const previewResponse = {
      id: 'preview',
      title: title || '',
      slug: slug || '',
      excerpt: excerpt || '',
      content: content || '',
      category_id: category_id || '',
      subcategory_id: subcategory_id || null,
      author_name: author_name || '',
      author_email: author_email || '',
      featured_image_url: featured_image_url || null,
      read_time: read_time || 5,
      published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: category || null,
      subcategory: subcategory || null,
      products: formattedProducts,
      related_articles: relatedArticlesData,
    }
    
    // Log final response
    console.log('Preview API returning data:', {
      hasTitle: !!previewResponse.title,
      hasExcerpt: !!previewResponse.excerpt,
      hasContent: !!previewResponse.content,
      hasFeaturedImage: !!previewResponse.featured_image_url,
      titleLength: previewResponse.title?.length || 0,
      excerptLength: previewResponse.excerpt?.length || 0,
      contentLength: previewResponse.content?.length || 0,
    })
    
    return NextResponse.json(previewResponse)
  } catch (error: any) {
    console.error('Preview error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate preview' }, { status: 500 })
  }
}
