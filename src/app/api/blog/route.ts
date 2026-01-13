import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const subcategorySlug = searchParams.get('subcategory')
    const published = searchParams.get('published') !== 'false'

    const supabase = await createClient()

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .order('created_at', { ascending: false })

    if (categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    if (subcategorySlug) {
      const { data: subcategory } = await supabase
        .from('subcategories')
        .select('id')
        .eq('slug', subcategorySlug)
        .single()

      if (subcategory) {
        query = query.eq('subcategory_id', subcategory.id)
      }
    }

    if (published) {
      query = query.eq('published', true).not('published_at', 'is', null)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
