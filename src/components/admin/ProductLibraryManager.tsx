"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Package, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductLibraryItem {
  id: string;
  subcategory_id: string;
  name: string;
  description: string;
  image_url: string;
  amazon_affiliate_link: string;
  display_order: number;
  is_featured: boolean;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface ProductLibraryManagerProps {
  initialProducts: ProductLibraryItem[];
  subcategories: Array<{
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  }>;
  selectedSubcategoryId?: string;
}

export function ProductLibraryManager({
  initialProducts,
  subcategories,
  selectedSubcategoryId,
}: ProductLibraryManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductLibraryItem[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<ProductLibraryItem[]>(initialProducts);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(selectedSubcategoryId || "");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = products;

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategory_id === selectedSubcategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.subcategory?.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedSubcategory, searchQuery]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product from the library?")) {
      return;
    }

    try {
      const response = await fetch(`/api/product-library?id=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== productId));
      router.refresh();
    } catch (error: any) {
      alert("Error deleting product: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 sm:p-6 admin-card" sharp="br">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Subcategory Filter */}
          <div className="flex-1">
            <label className="block font-bold uppercase text-sm mb-2 admin-label">
              Filter by Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                router.push(
                  e.target.value
                    ? `/admin/product-library?subcategory=${e.target.value}`
                    : "/admin/product-library"
                );
              }}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
            >
              <option value="">All Subcategories</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.category?.name} → {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block font-bold uppercase text-sm mb-2 admin-label">
              Search Products
            </label>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description..."
                className="w-full h-12 pl-10 pr-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center admin-card" sharp="br">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-black uppercase mb-2 admin-heading">
            No Products Found
          </h3>
          <p className="text-sm font-medium admin-link mb-6">
            {selectedSubcategory || searchQuery
              ? "Try adjusting your filters or search query"
              : "Start building your product library by adding your first product"}
          </p>
          {!selectedSubcategory && !searchQuery && (
            <Link href="/admin/product-library/new">
              <Button variant="primary" sharp="br">
                Add First Product
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="admin-card overflow-hidden" sharp="br">
              {/* Product Image */}
              <div className="relative w-full h-48 bg-gray-100 border-b-2 border-border">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.is_featured && (
                  <div className="absolute top-2 right-2 bg-primary border-2 border-black px-2 py-1 font-black text-xs uppercase hard-shadow-sm">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase admin-link">
                    {product.subcategory?.category?.name} → {product.subcategory?.name}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase mb-2 admin-heading line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm font-medium admin-link line-clamp-2 mb-4">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/product-library/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full admin-button" sharp="br">
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="admin-button"
                    sharp="br"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card className="p-4 sm:p-6 admin-card" sharp="br">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div>
            <span className="text-sm font-medium admin-link">Total Products:</span>
            <span className="ml-2 text-lg font-black admin-heading">{products.length}</span>
          </div>
          <div>
            <span className="text-sm font-medium admin-link">Showing:</span>
            <span className="ml-2 text-lg font-black admin-heading">{filteredProducts.length}</span>
          </div>
          {selectedSubcategory && (
            <div>
              <span className="text-sm font-medium admin-link">Subcategory:</span>
              <span className="ml-2 text-lg font-black admin-heading">
                {subcategories.find((s) => s.id === selectedSubcategory)?.name}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
