import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

async function getPost(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(`
      *,
      products:affiliate_products(*)
    `)
    .eq("id", id)
    .maybeSingle();
  
  if (data) {
    // Fetch related articles
    const { data: relatedArticles } = await supabase
      .from("related_articles")
      .select("related_post_id")
      .eq("blog_post_id", id)
      .order("display_order", { ascending: true });
    
    return {
      ...data,
      related_articles: relatedArticles || [],
    };
  }
  
  return data;
}

async function getAllPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug")
    .order("created_at", { ascending: false });
  return data || [];
}


export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, allPosts] = await Promise.all([
    getPost(id),
    getCategories(),
    getAllPosts(),
  ]);

  if (!post) {
    notFound();
  }

  // Sort products by display_order
  if (post.products) {
    post.products.sort((a: any, b: any) => a.display_order - b.display_order);
  }

  async function updatePost(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const title = formData.get("title") as string;
    const slug = formData
      .get("slug")
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") as string;

    const published = formData.get("published") === "on";
    const wasPublished = post.published;

    const updateData: any = {
      title,
      slug,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category_id: formData.get("category_id") as string,
      subcategory_id: (formData.get("subcategory_id") as string) || null,
      featured_image_url: (formData.get("featured_image_url") as string) || null,
      read_time: parseInt(formData.get("read_time") as string) || 5,
      published,
      updated_at: new Date().toISOString(),
    };

    // Only set published_at if publishing for the first time
    if (published && !wasPublished) {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    // Handle related articles if provided
    const relatedArticlesJson = formData.get("related_articles") as string;
    
    // Delete existing related articles
    await supabase.from("related_articles").delete().eq("blog_post_id", id);
    
    if (relatedArticlesJson) {
      try {
        const relatedArticleIds = JSON.parse(relatedArticlesJson);
        
        if (relatedArticleIds.length > 0 && relatedArticleIds.length <= 3) {
          const relatedArticlesToInsert = relatedArticleIds.map((relatedId: string, index: number) => ({
            blog_post_id: id,
            related_post_id: relatedId,
            display_order: index,
            created_at: new Date().toISOString(),
          }));

          const { error: relatedError } = await supabase
            .from("related_articles")
            .insert(relatedArticlesToInsert);

          if (relatedError) {
            console.error("Failed to save related articles:", relatedError);
            // Don't fail the whole operation
          }
        }
      } catch (error: any) {
        console.error("Error saving related articles:", error);
        // Don't fail the whole operation
      }
    }

    // Handle products if provided
    const productsJson = formData.get("products") as string;
    if (productsJson) {
      try {
        const products = JSON.parse(productsJson);
        
        // Validate products count
        if (products.length > 0 && (products.length < 3 || products.length > 5)) {
          throw new Error("You must add between 3-5 products");
        }

        // Delete existing products
        await supabase.from("affiliate_products").delete().eq("blog_post_id", id);

        // Insert new products if any
        if (products.length > 0) {
          const productsToInsert = products.map((product: any, index: number) => ({
            blog_post_id: id,
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            amazon_affiliate_link: product.amazon_affiliate_link,
            price: null,
            rating: null,
            review_count: 0,
            display_order: index,
            is_featured: product.is_featured || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          const { error: productsError } = await supabase
            .from("affiliate_products")
            .insert(productsToInsert);

          if (productsError) {
            throw new Error(`Failed to save products: ${productsError.message}`);
          }
        }
      } catch (error: any) {
        throw new Error(error.message || "Failed to save products");
      }
    }

    redirect("/admin/posts");
  }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black uppercase mb-6 md:mb-8 admin-heading">Edit Post</h1>
      <PostForm categories={categories} post={post} action={updatePost} allPosts={allPosts} />
    </div>
  );
}
