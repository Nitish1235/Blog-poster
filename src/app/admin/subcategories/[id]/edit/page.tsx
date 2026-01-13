import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SubcategoryForm } from "@/components/admin/SubcategoryForm";

async function getCategory(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export default async function EditSubcategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subcategory, categories] = await Promise.all([
    getCategory(id),
    getCategories(),
  ]);

  if (!subcategory) {
    notFound();
  }

  async function updateSubcategory(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const name = formData.get("name") as string;
    const slug = formData
      .get("slug")
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") as string;

    await supabase
      .from("subcategories")
      .update({
        name,
        slug,
        category_id: formData.get("category_id") as string,
        description: (formData.get("description") as string) || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    redirect("/admin/subcategories");
  }

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-8">Edit Subcategory</h1>
      <div className="max-w-2xl">
        <SubcategoryForm
          categories={categories}
          subcategory={subcategory}
          action={updateSubcategory}
        />
      </div>
    </div>
  );
}
