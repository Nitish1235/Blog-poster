import { createClient } from '@/lib/supabase/server'
import { Subcategory } from '@/lib/database.types'

export async function getAllSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const supabase = await createClient()
  let query = supabase
    .from('subcategories')
    .select('*')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query.order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }

  return data || []
}

export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching subcategory:', error)
    return null
  }

  return data
}
