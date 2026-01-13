import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Edit, Trash2 } from "lucide-react";
import { SubcategoryForm } from "@/components/admin/SubcategoryForm";
import Link from "next/link";

function getCategoryColorClass(color: string | undefined) {
    if (color === "primary") return "bg-primary";
    if (color === "secondary") return "bg-secondary";
    if (color === "accent") return "bg-accent";
    return "bg-gray-200";
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

async function getSubcategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .select(`
      *,
      category:categories(*)
    `)
    .order("name", { ascending: true });
  return data || [];
}

async function deleteSubcategory(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("subcategories").delete().eq("id", id);
}

export default async function AdminSubcategoriesPage() {
  const [categories, subcategories] = await Promise.all([
    getCategories(),
    getSubcategories(),
  ]);

  async function createSubcategory(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const name = formData.get("name") as string;
    const slug = formData
      .get("slug")
      ?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") as string;

    await supabase.from("subcategories").insert({
      name,
      slug,
      category_id: formData.get("category_id") as string,
      description: (formData.get("description") as string) || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase admin-heading">Subcategories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 p-4 sm:p-6 admin-card" sharp="br">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 admin-heading">All Subcategories</h2>
          {subcategories.length === 0 ? (
            <p className="font-medium admin-text-secondary text-sm sm:text-base">
              No subcategories yet. Create your first subcategory!
            </p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {subcategories.map((subcategory: any) => (
                <Card key={subcategory.id} className="p-3 sm:p-4 admin-card opacity-90" sharp="tr">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-base sm:text-lg font-black uppercase break-words admin-text">{subcategory.name}</h3>
                        <span className={`${getCategoryColorClass(subcategory.category?.color)} border border-border px-2 py-1 text-xs font-bold rounded self-start sm:self-auto text-black`}>
                          {subcategory.category?.name || "Unknown"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm admin-text-secondary font-medium break-all">{subcategory.slug}</p>
                      {subcategory.description && (
                        <p className="text-xs sm:text-sm admin-text-secondary opacity-75 mt-1 line-clamp-1">{subcategory.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/admin/subcategories/${subcategory.id}/edit`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <form action={deleteSubcategory.bind(null, subcategory.id)} className="flex-1 sm:flex-none">
                        <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                          <Trash2 size={16} />
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-6 admin-card" sharp="tl">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 admin-heading">Create Subcategory</h2>
          <SubcategoryForm categories={categories} action={createSubcategory} />
        </Card>
      </div>
    </div>
  );
}
