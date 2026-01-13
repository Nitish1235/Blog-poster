import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/database.types'

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error: any) {
    // Handle missing Supabase configuration gracefully
    if (error.message?.includes('Missing Supabase environment variables')) {
      console.warn('Supabase not configured. Please set up your .env.local file.')
      return []
    }
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}
