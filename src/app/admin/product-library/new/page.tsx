import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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

export default async function NewProductLibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subcategories = await getSubcategories();

  async function createProduct(formData: FormData) {
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

    // Get current max display_order for this subcategory
    const { data: existingProducts } = await supabase
      .from("product_library")
      .select("display_order")
      .eq("subcategory_id", subcategory_id)
      .order("display_order", { ascending: false })
      .limit(1);

    const display_order = existingProducts && existingProducts.length > 0
      ? existingProducts[0].display_order + 1
      : 0;

    const { error } = await supabase.from("product_library").insert({
      subcategory_id,
      name,
      description,
      image_url,
      amazon_affiliate_link,
      display_order,
      is_featured,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/product-library");
  }

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black uppercase mb-6 md:mb-8 admin-heading">
        Add Product to Library
      </h1>
      <ProductLibraryForm subcategories={subcategories} action={createProduct} />
    </div>
  );
}
