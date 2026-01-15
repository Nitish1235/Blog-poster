export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: 'primary' | 'secondary' | 'accent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: 'primary' | 'secondary' | 'accent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: 'primary' | 'secondary' | 'accent'
          created_at?: string
          updated_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          category_id: string
          subcategory_id: string | null
          featured_image_url: string | null
          read_time: number
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          category_id: string
          subcategory_id?: string | null
          featured_image_url?: string | null
          read_time?: number
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          category_id?: string
          subcategory_id?: string | null
          featured_image_url?: string | null
          read_time?: number
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affiliate_products: {
        Row: {
          id: string
          blog_post_id: string
          name: string
          description: string
          image_url: string
          amazon_affiliate_link: string
          price: string | null
          rating: number | null
          review_count: number
          display_order: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          blog_post_id: string
          name: string
          description: string
          image_url: string
          amazon_affiliate_link: string
          price?: string | null
          rating?: number | null
          review_count?: number
          display_order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          blog_post_id?: string
          name?: string
          description?: string
          image_url?: string
          amazon_affiliate_link?: string
          price?: string | null
          rating?: number | null
          review_count?: number
          display_order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_library: {
        Row: {
          id: string
          subcategory_id: string
          name: string
          description: string
          image_url: string
          amazon_affiliate_link: string
          display_order: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subcategory_id: string
          name: string
          description: string
          image_url: string
          amazon_affiliate_link: string
          display_order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subcategory_id?: string
          name?: string
          description?: string
          image_url?: string
          amazon_affiliate_link?: string
          display_order?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types for easier usage
export type Category = Database['public']['Tables']['categories']['Row']
export type Subcategory = Database['public']['Tables']['subcategories']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type AffiliateProduct = Database['public']['Tables']['affiliate_products']['Row']

export type BlogPostWithRelations = BlogPost & {
  category: Category
  subcategory: Subcategory | null
  products?: AffiliateProduct[]
}
