import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";

function getCategoryColorClass(color: string) {
    if (color === "primary") return "bg-primary";
    if (color === "secondary") return "bg-secondary";
    if (color === "accent") return "bg-accent";
    return "bg-gray-200";
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  return data || [];
}

async function deleteCategory(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  async function createCategory(formData: FormData) {
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

    await supabase.from("categories").insert({
      name,
      slug,
      description: (formData.get("description") as string) || null,
      color: (formData.get("color") as "primary" | "secondary" | "accent") || "primary",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase admin-heading">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 p-4 sm:p-6 admin-card" sharp="br">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 admin-heading">All Categories</h2>
          {categories.length === 0 ? (
            <p className="font-medium admin-text-secondary text-sm sm:text-base">No categories yet. Create your first category!</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {categories.map((category: any) => (
                <Card key={category.id} className="p-3 sm:p-4 admin-card opacity-90" sharp="tr">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getCategoryColorClass(category.color)} border-2 border-border rounded-full flex items-center justify-center font-black text-lg sm:text-xl flex-shrink-0 text-black`}>
                        {category.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-black uppercase break-words admin-text">{category.name}</h3>
                        <p className="text-xs sm:text-sm admin-text-secondary font-medium break-all">{category.slug}</p>
                        {category.description && (
                          <p className="text-xs sm:text-sm admin-text-secondary opacity-75 mt-1 line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/admin/categories/${category.id}/edit`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <form action={deleteCategory.bind(null, category.id)} className="flex-1 sm:flex-none">
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
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 admin-heading">Create Category</h2>
          <CategoryForm action={createCategory} />
        </Card>
      </div>
    </div>
  );
}
