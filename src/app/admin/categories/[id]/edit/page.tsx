import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";

async function getCategory(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  async function updateCategory(formData: FormData) {
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
      .from("categories")
      .update({
        name,
        slug,
        description: (formData.get("description") as string) || null,
        color: (formData.get("color") as "primary" | "secondary" | "accent") || "primary",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    redirect("/admin/categories");
  }

  return (
    <div>
      <h1 className="text-4xl font-black uppercase mb-8">Edit Category</h1>
      <div className="max-w-2xl">
        <CategoryForm category={category} action={updateCategory} />
      </div>
    </div>
  );
}
