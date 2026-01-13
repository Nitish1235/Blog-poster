import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProductLibraryForm } from "@/components/admin/ProductLibraryForm";

async function getSubcategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order("name");
  return data || [];
}

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_library")
    .select(`
      *,
      subcategory:subcategories(
        id,
        name,
        slug,
        category:categories(id, name, slug)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditProductLibraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const [product, subcategories] = await Promise.all([
    getProduct(id),
    getSubcategories(),
  ]);

  if (!product) {
    notFound();
  }

  async function updateProduct(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const subcategory_id = formData.get("subcategory_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const amazon_affiliate_link = formData.get("amazon_affiliate_link") as string;
    const is_featured = formData.get("is_featured") === "on";

    if (!subcategory_id || !name || !description || !image_url || !amazon_affiliate_link) {
      throw new Error("All fields are required");
    }

    const { error } = await supabase
      .from("product_library")
      .update({
        subcategory_id,
        name,
        description,
        image_url,
        amazon_affiliate_link,
        is_featured,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/product-library");
  }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black uppercase mb-6 md:mb-8 admin-heading">
        Edit Product
      </h1>
      <ProductLibraryForm
        subcategories={subcategories}
        product={product}
        action={updateProduct}
      />
    </div>
  );
}
