"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  category?: any;
  action: (formData: FormData) => Promise<void>;
}

export function CategoryForm({ category, action }: CategoryFormProps) {
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
        <label htmlFor="name" className="block font-bold uppercase text-sm mb-2 admin-label">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={category?.name || ""}
          onChange={(e) => {
            const slugInput = document.getElementById("slug") as HTMLInputElement;
            if (slugInput && !category) {
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
          defaultValue={category?.slug || ""}
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
          defaultValue={category?.description || ""}
          rows={3}
          className="w-full px-3 py-2 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none admin-input"
        />
      </div>

      <div>
        <label htmlFor="color" className="block font-bold uppercase text-sm mb-2 admin-label">
          Color *
        </label>
        <select
          id="color"
          name="color"
          required
          defaultValue={category?.color || "primary"}
          className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
        >
          <option value="primary">Primary (Yellow)</option>
          <option value="secondary">Secondary (Teal)</option>
          <option value="accent">Accent (Green)</option>
        </select>
      </div>

      <Button type="submit" variant="primary" sharp="br" className="w-full">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
