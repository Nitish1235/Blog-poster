"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface SubcategoryFormProps {
  categories: Category[];
  subcategory?: any;
  action: (formData: FormData) => Promise<void>;
}

export function SubcategoryForm({
  categories,
  subcategory,
  action,
}: SubcategoryFormProps) {
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <form
      action={async (formData) => {
        await action(formData);
        router.refresh();
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="category_id" className="block font-bold uppercase text-sm mb-2 admin-label">
          Category *
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={subcategory?.category_id || ""}
          className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block font-bold uppercase text-sm mb-2 admin-label">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={subcategory?.name || ""}
          onChange={(e) => {
            const slugInput = document.getElementById("slug") as HTMLInputElement;
            if (slugInput && !subcategory) {
              slugInput.value = generateSlug(e.target.value);
            }
          }}
          className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block font-bold uppercase text-sm mb-2 admin-label">
          Slug *
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={subcategory?.slug || ""}
          className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm admin-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-bold uppercase text-sm mb-2 admin-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={subcategory?.description || ""}
          rows={3}
          className="w-full px-3 py-2 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none admin-input"
        />
      </div>

      <Button type="submit" variant="primary" sharp="br" className="w-full">
        {subcategory ? "Update Subcategory" : "Create Subcategory"}
      </Button>
    </form>
  );
}
