"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, X, Trash2 } from "lucide-react";

interface Product {
  id?: string;
  name: string;
  description: string;
  image_url: string;
  amazon_affiliate_link: string;
  price: string;
  rating: string;
  review_count: string;
  display_order: number;
  is_featured: boolean;
}

interface ProductFormProps {
  blogPostId: string;
  initialProducts?: Product[];
}

export function ProductForm({ blogPostId, initialProducts = [] }: ProductFormProps) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.length > 0
      ? initialProducts
      : [
          {
            name: "",
            description: "",
            image_url: "",
            amazon_affiliate_link: "",
            price: "",
            rating: "",
            review_count: "",
            display_order: 0,
            is_featured: false,
          },
        ]
  );

  const addProduct = () => {
    if (products.length < 5) {
      setProducts([
        ...products,
        {
          name: "",
          description: "",
          image_url: "",
          amazon_affiliate_link: "",
          price: "",
          rating: "",
          review_count: "",
          display_order: products.length,
          is_featured: false,
        },
      ]);
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const saveProducts = async () => {
    try {
      // Validate products
      const validProducts = products.filter(
        (p) => p.name && p.amazon_affiliate_link && p.image_url && p.description
      );

      if (validProducts.length < 3) {
        alert("Please add at least 3 products with all required fields filled.");
        return;
      }

      if (validProducts.length > 5) {
        alert("Maximum 5 products allowed per post.");
        return;
      }

      // Delete existing products
      if (initialProducts.length > 0) {
        const deleteResponse = await fetch(`/api/products?blog_post_id=${blogPostId}`, {
          method: "DELETE",
        });
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete existing products");
        }
      }

      // Save new products
      for (let i = 0; i < validProducts.length; i++) {
        const product = validProducts[i];
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            blog_post_id: blogPostId,
            display_order: i,
            rating: product.rating ? parseFloat(product.rating) : null,
            review_count: product.review_count ? parseInt(product.review_count) : 0,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save product");
        }
      }

      alert(`Successfully saved ${validProducts.length} product(s)!`);
      window.location.reload(); // Refresh to show updated products
    } catch (error: any) {
      console.error("Error saving products:", error);
      alert(`Error saving products: ${error.message || "Please try again."}`);
    }
  };

  return (
    <Card className="p-6" sharp="tl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black uppercase">Affiliate Products (3-5 products)</h3>
        {products.length < 5 && (
          <Button type="button" variant="outline" size="sm" onClick={addProduct} sharp="br">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {products.map((product, index) => (
          <Card key={index} className="p-6" sharp="br">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-black uppercase">Product {index + 1}</h4>
              {products.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeProduct(index)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, "name", e.target.value)}
                  required
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Amazon Product Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-2">
                  Description *
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct(index, "description", e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-2">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  value={product.image_url}
                  onChange={(e) => updateProduct(index, "image_url", e.target.value)}
                  required
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/product-image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold uppercase text-sm mb-2">
                  Amazon Affiliate Link *
                </label>
                <input
                  type="url"
                  value={product.amazon_affiliate_link}
                  onChange={(e) => updateProduct(index, "amazon_affiliate_link", e.target.value)}
                  required
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  placeholder="https://amazon.com/dp/..."
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2">
                  Price
                </label>
                <input
                  type="text"
                  value={product.price}
                  onChange={(e) => updateProduct(index, "price", e.target.value)}
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="$99.99"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={product.rating}
                  onChange={(e) => updateProduct(index, "rating", e.target.value)}
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-sm mb-2">
                  Review Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={product.review_count}
                  onChange={(e) => updateProduct(index, "review_count", e.target.value)}
                  className="w-full h-10 px-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1234"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => updateProduct(index, "is_featured", e.target.checked)}
                  className="w-5 h-5 border-2 border-border rounded focus:ring-2 focus:ring-primary"
                />
                <label className="font-bold uppercase text-sm">Featured Product</label>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <Button type="button" variant="primary" onClick={saveProducts} sharp="br">
          Save Products
        </Button>
        <p className="text-sm text-gray-600 font-medium self-center">
          {products.length} product{products.length !== 1 ? "s" : ""} configured
        </p>
      </div>
    </Card>
  );
}
