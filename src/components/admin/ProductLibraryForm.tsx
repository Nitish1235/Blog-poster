"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface Subcategory {
  id: string;
  name: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductLibraryFormProps {
  subcategories: Subcategory[];
  product?: any;
  action: (formData: FormData) => Promise<void>;
}

export function ProductLibraryForm({
  subcategories,
  product,
  action,
}: ProductLibraryFormProps) {
  const router = useRouter();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    product?.subcategory_id || ""
  );

  return (
    <Card className="p-4 sm:p-6 md:p-8 admin-card" sharp="br">
      <form
        action={async (formData) => {
          await action(formData);
          router.refresh();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <label htmlFor="subcategory_id" className="block font-bold uppercase text-sm mb-2 admin-label">
              Subcategory *
            </label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              required
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(e.target.value)}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.category?.name} → {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="name" className="block font-bold uppercase text-sm mb-2 admin-label">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={product?.name || ""}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
              placeholder="Amazon Product Name"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block font-bold uppercase text-sm mb-2 admin-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description || ""}
              rows={4}
              className="w-full px-4 py-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none admin-input"
              placeholder="Product description..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="image_url" className="block font-bold uppercase text-sm mb-2 admin-label">
              Product Image URL *
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              required
              defaultValue={product?.image_url || ""}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
              placeholder="https://example.com/product-image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="amazon_affiliate_link" className="block font-bold uppercase text-sm mb-2 admin-label">
              Amazon Affiliate Link *
            </label>
            <input
              id="amazon_affiliate_link"
              name="amazon_affiliate_link"
              type="url"
              required
              defaultValue={product?.amazon_affiliate_link || ""}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm admin-input"
              placeholder="https://amazon.com/dp/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product?.is_featured || false}
                className="w-5 h-5 border-2 border-border rounded focus:ring-2 focus:ring-primary admin-input"
              />
              <span className="font-bold uppercase text-sm admin-label">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button type="submit" variant="primary" sharp="br" className="flex-1 sm:flex-none">
            {product ? "Update Product" : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            sharp="tl"
            className="flex-1 sm:flex-none admin-button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
