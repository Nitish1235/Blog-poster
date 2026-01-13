import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import { ProductLibraryManager } from "@/components/admin/ProductLibraryManager";

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

async function getProductLibrary(subcategoryId?: string) {
  const supabase = await createClient();
  let query = supabase
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
    .order("display_order", { ascending: true });

  if (subcategoryId) {
    query = query.eq("subcategory_id", subcategoryId);
  }

  const { data } = await query;
  return data || [];
}

export default async function ProductLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const selectedSubcategoryId = params.subcategory;

  const [subcategories, products] = await Promise.all([
    getSubcategories(),
    getProductLibrary(selectedSubcategoryId),
  ]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase mb-2 admin-heading">Product Library</h1>
          <p className="text-sm sm:text-base font-medium admin-link">
            Manage reusable Amazon affiliate products organized by subcategories
          </p>
        </div>
        <Link href="/admin/product-library/new">
          <Button variant="primary" size="lg" sharp="br">
            <Plus size={18} className="mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <ProductLibraryManager
        initialProducts={products}
        subcategories={subcategories}
        selectedSubcategoryId={selectedSubcategoryId}
      />
    </div>
  );
}
