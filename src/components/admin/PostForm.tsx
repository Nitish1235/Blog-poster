"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Eye, Package } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface PostFormProps {
  categories: Category[];
  post?: any;
  action: (formData: FormData) => Promise<void>;
  allPosts?: Array<{ id: string; title: string; slug: string }>;
}

interface Product {
  name: string;
  description: string;
  image_url: string;
  amazon_affiliate_link: string;
  is_featured: boolean;
}

export function PostForm({ categories, post, action, allPosts = [] }: PostFormProps) {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    post?.category_id || ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    post?.subcategory_id || ""
  );
  const [libraryProducts, setLibraryProducts] = useState<any[]>([]);
  const [showLibraryProducts, setShowLibraryProducts] = useState(false);
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState<string[]>(
    post?.related_articles?.map((ra: any) => ra.related_post_id) || []
  );
  const [products, setProducts] = useState<Product[]>(
    post?.products && post.products.length > 0
      ? post.products.map((p: any) => ({
          name: p.name || "",
          description: p.description || "",
          image_url: p.image_url || "",
          amazon_affiliate_link: p.amazon_affiliate_link || "",
          is_featured: p.is_featured || false,
        }))
      : [
          {
            name: "",
            description: "",
            image_url: "",
            amazon_affiliate_link: "",
            is_featured: false,
          },
        ]
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>(post?.featured_image_url || "");
  const supabase = createClient();

  // Update featured image URL when post changes
  useEffect(() => {
    if (post?.featured_image_url) {
      setFeaturedImageUrl(post.featured_image_url);
    }
  }, [post?.featured_image_url]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedSubcategoryId) {
      fetchLibraryProducts(selectedSubcategoryId);
    } else {
      setLibraryProducts([]);
      setShowLibraryProducts(false);
    }
  }, [selectedSubcategoryId]);

  async function fetchSubcategories(categoryId: string) {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");
    setSubcategories(data || []);
  }

  async function fetchLibraryProducts(subcategoryId: string) {
    try {
      const response = await fetch(`/api/product-library?subcategory_id=${subcategoryId}`);
      if (response.ok) {
        const data = await response.json();
        setLibraryProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching library products:", error);
    }
  }

  const addProductFromLibrary = (libraryProduct: any) => {
    if (products.length >= 5) {
      alert("Maximum 5 products allowed per post");
      return;
    }

    // Check if product already added
    const alreadyAdded = products.some(
      (p) => p.amazon_affiliate_link === libraryProduct.amazon_affiliate_link
    );

    if (alreadyAdded) {
      alert("This product is already added to the post");
      return;
    }

    setProducts([
      ...products,
      {
        name: libraryProduct.name,
        description: libraryProduct.description,
        image_url: libraryProduct.image_url,
        amazon_affiliate_link: libraryProduct.amazon_affiliate_link,
        is_featured: libraryProduct.is_featured || false,
      },
    ]);
    setShowLibraryProducts(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const addProduct = () => {
    if (products.length < 5) {
      setProducts([
        ...products,
        {
          name: "",
          description: "",
          image_url: "",
          amazon_affiliate_link: "",
          is_featured: false,
        },
      ]);
    }
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handlePreview = async () => {
    // Get form data directly from input elements (more reliable than FormData)
    const titleEl = document.getElementById("title") as HTMLInputElement;
    const slugEl = document.getElementById("slug") as HTMLInputElement;
    const excerptEl = document.getElementById("excerpt") as HTMLTextAreaElement;
    const contentEl = document.getElementById("content") as HTMLTextAreaElement;
    const categoryEl = document.querySelector('[name="category_id"]') as HTMLSelectElement;
    const subcategoryEl = document.querySelector('[name="subcategory_id"]') as HTMLSelectElement;
    const authorNameEl = document.querySelector('[name="author_name"]') as HTMLInputElement;
    const authorEmailEl = document.querySelector('[name="author_email"]') as HTMLInputElement;
    const readTimeEl = document.querySelector('[name="read_time"]') as HTMLInputElement;

    // Prepare preview data (prefer state for featured image)
    const previewData = {
      title: titleEl?.value?.trim() || "",
      slug: slugEl?.value?.trim() || "",
      excerpt: excerptEl?.value?.trim() || "",
      content: contentEl?.value || "",
      category_id: categoryEl?.value || "",
      subcategory_id: subcategoryEl?.value || null,
      author_name: authorNameEl?.value?.trim() || "",
      author_email: authorEmailEl?.value?.trim() || "",
      featured_image_url: featuredImageUrl || null,
      read_time: parseInt(readTimeEl?.value || "5") || 5,
      products: products
        .filter((p) => p.name && p.amazon_affiliate_link && p.image_url && p.description)
        .map((p, index) => ({
          ...p,
          id: `preview-product-${index}`,
        })),
      related_articles: selectedRelatedArticles,
    };

    console.log('Preview Data Captured:', {
      title: previewData.title,
      excerpt: previewData.excerpt,
      featured_image_url: previewData.featured_image_url,
      products: previewData.products,
      productsCount: previewData.products.length,
    });

    // Send to preview API
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const previewPost = await response.json();
      
      // Store preview data in sessionStorage and open preview
      sessionStorage.setItem('previewPost', JSON.stringify(previewPost));
      window.open(`/admin/posts/preview`, '_blank');
    } catch (error: any) {
      alert('Failed to generate preview: ' + error.message);
    }
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 admin-card" sharp="br">
      <form
        action={async (formData) => {
          // Add products data to formData
          const validProducts = products.filter(
            (p) => p.name && p.amazon_affiliate_link && p.image_url && p.description
          );
          
          // Validate products count
          if (validProducts.length > 0 && (validProducts.length < 3 || validProducts.length > 5)) {
            alert("Please add 3-5 products with all required fields filled.");
            return;
          }

          // Store products as JSON in a hidden field
          if (validProducts.length > 0) {
            formData.append("products", JSON.stringify(validProducts));
          }

          // Store related articles as JSON
          if (selectedRelatedArticles.length > 0) {
            formData.append("related_articles", JSON.stringify(selectedRelatedArticles));
          }

          await action(formData);
          router.refresh();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block font-bold uppercase text-sm mb-2 admin-label">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post?.title || ""}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
              placeholder="Enter post title"
              onChange={(e) => {
                const slugInput = document.getElementById("slug") as HTMLInputElement;
                if (slugInput && !post) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="slug" className="block font-bold uppercase text-sm mb-2 text-white">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={post?.slug || ""}
              className="w-full h-12 px-4 border-2 border-gray-600 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm bg-gray-700 text-white placeholder-gray-400"
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block font-bold uppercase text-sm mb-2 admin-label">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
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
            <label htmlFor="subcategory_id" className="block font-bold uppercase text-sm mb-2 admin-label">
              Subcategory
            </label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              defaultValue={post?.subcategory_id || ""}
              disabled={!selectedCategoryId || subcategories.length === 0}
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">None</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author_name" className="block font-bold uppercase text-sm mb-2">
              Author Name *
            </label>
            <input
              id="author_name"
              name="author_name"
              type="text"
              required
              defaultValue={post?.author_name || ""}
              className="w-full h-12 px-4 border-2 border-gray-600 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="author_email" className="block font-bold uppercase text-sm mb-2">
              Author Email *
            </label>
            <input
              id="author_email"
              name="author_email"
              type="email"
              required
              defaultValue={post?.author_email || ""}
              className="w-full h-12 px-4 border-2 border-gray-600 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="read_time" className="block font-bold uppercase text-sm mb-2">
              Read Time (minutes) *
            </label>
            <input
              id="read_time"
              name="read_time"
              type="number"
              required
              min="1"
              defaultValue={post?.read_time || 5}
              className="w-full h-12 px-4 border-2 border-gray-600 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary bg-gray-700 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              value={featuredImageUrl}
              onChange={(url) => {
                setFeaturedImageUrl(url);
                const input = document.getElementById("featured_image_url") as HTMLInputElement;
                if (input) input.value = url;
              }}
              folder="featured-images"
              label="Featured Image"
              required={false}
            />
            <input
              id="featured_image_url"
              name="featured_image_url"
              type="hidden"
              value={featuredImageUrl}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="block font-bold uppercase text-sm mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              defaultValue={post?.excerpt || ""}
              rows={3}
              className="w-full px-4 py-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none admin-input"
              placeholder="A brief description of the post"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="content" className="block font-bold uppercase text-sm mb-2 admin-label">
              Content (HTML) *
            </label>
            <textarea
              id="content"
              name="content"
              required
              defaultValue={post?.content || ""}
              rows={15}
              className="w-full px-4 py-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm admin-input"
              placeholder="Enter HTML content here..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post?.published || false}
                className="w-5 h-5 border-2 border-border rounded focus:ring-2 focus:ring-primary admin-input"
              />
              <span className="font-bold uppercase admin-label">Publish immediately</span>
            </label>
          </div>
        </div>

        {/* Affiliate Products Section */}
        <div className="md:col-span-2 pt-8 border-t-2 border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase mb-2 admin-heading">Affiliate Products</h3>
              <p className="text-sm font-medium admin-link">
                Add 3-5 Amazon affiliate products for this post (all fields required)
              </p>
            </div>
            <div className="flex gap-2">
              {selectedSubcategoryId && libraryProducts.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLibraryProducts(!showLibraryProducts)}
                  sharp="br"
                  className="admin-button"
                >
                  <Package size={16} className="mr-2" />
                  {showLibraryProducts ? "Hide" : "Browse"} Library ({libraryProducts.length})
                </Button>
              )}
              {products.length < 5 && (
                <Button type="button" variant="outline" size="sm" onClick={addProduct} sharp="br" className="admin-button">
                  <Plus size={16} className="mr-2" /> Add Product
                </Button>
              )}
            </div>
          </div>

          {/* Product Library Browser */}
          {showLibraryProducts && libraryProducts.length > 0 && (
            <Card className="p-4 sm:p-6 mb-6 admin-card" sharp="br">
              <h4 className="text-lg font-black uppercase mb-4 admin-heading">
                Select from Product Library
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {libraryProducts.map((libProduct) => {
                  const alreadyAdded = products.some(
                    (p) => p.amazon_affiliate_link === libProduct.amazon_affiliate_link
                  );
                  return (
                    <Card
                      key={libProduct.id}
                      className={`p-4 admin-card cursor-pointer transition-all hover:scale-105 ${
                        alreadyAdded ? "opacity-50" : ""
                      }`}
                      sharp="br"
                      onClick={() => !alreadyAdded && addProductFromLibrary(libProduct)}
                    >
                      <div className="relative w-full h-32 bg-gray-100 border-2 border-border mb-3 rounded overflow-hidden">
                        <img
                          src={libProduct.image_url}
                          alt={libProduct.name}
                          className="w-full h-full object-cover"
                        />
                        {libProduct.is_featured && (
                          <div className="absolute top-1 right-1 bg-primary border-2 border-black px-1.5 py-0.5 font-black text-xs uppercase">
                            ⭐
                          </div>
                        )}
                      </div>
                      <h5 className="text-sm font-black uppercase mb-1 admin-heading line-clamp-2">
                        {libProduct.name}
                      </h5>
                      <p className="text-xs font-medium admin-link line-clamp-2 mb-2">
                        {libProduct.description}
                      </p>
                      {alreadyAdded ? (
                        <span className="text-xs font-bold admin-link">Already Added</span>
                      ) : (
                        <Button size="sm" variant="primary" className="w-full" sharp="br">
                          Add to Post
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="space-y-6">
            {products.map((product, index) => (
              <Card key={index} className="p-4 sm:p-6 admin-card" sharp="br">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-black uppercase admin-heading">Product {index + 1}</h4>
                  {products.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(index)}
                      className="admin-button"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-bold uppercase text-sm mb-2 admin-label">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(index, "name", e.target.value)}
                      required={products.length > 0}
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary admin-input"
                      placeholder="Amazon Product Name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold uppercase text-sm mb-2 admin-label">
                      Description *
                    </label>
                    <textarea
                      value={product.description}
                      onChange={(e) => updateProduct(index, "description", e.target.value)}
                      required={products.length > 0}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary resize-none admin-input"
                      placeholder="Product description..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      value={product.image_url}
                      onChange={(url) => updateProduct(index, "image_url", url)}
                      folder="product-images"
                      label="Product Image"
                      required={products.length > 0}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold uppercase text-sm mb-2 admin-label">
                      Amazon Affiliate Link *
                    </label>
                    <input
                      type="url"
                      value={product.amazon_affiliate_link}
                      onChange={(e) => updateProduct(index, "amazon_affiliate_link", e.target.value)}
                      required={products.length > 0}
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm admin-input"
                      placeholder="https://amazon.com/dp/..."
                    />
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={product.is_featured}
                      onChange={(e) => updateProduct(index, "is_featured", e.target.checked)}
                      className="w-5 h-5 border-2 border-border rounded focus:ring-2 focus:ring-primary admin-input"
                    />
                    <label className="font-bold uppercase text-sm admin-label">Featured Product</label>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {products.length > 0 && (
            <div className="mt-4 p-4 admin-card border-2 border-border rounded-[10px] opacity-90">
              <p className="text-sm font-medium admin-link">
                <strong className="font-black admin-heading">Note:</strong> You must add between 3-5 products with all required fields (Name, Description, Image URL, and Amazon Link) filled in.
              </p>
            </div>
          )}
        </div>

        {/* Related Articles Section */}
        <div className="md:col-span-2 pt-6 md:pt-8 border-t-2 border-border">
          <div className="mb-4 md:mb-6">
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">Related Articles</h3>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Select up to 3 related articles. If none selected, the top 3 latest articles from the same category/subcategory will be shown automatically.
            </p>
          </div>

          <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto border-2 border-border rounded-[10px] p-3 md:p-4 admin-card opacity-90">
            {allPosts
              .filter((p) => p.id !== post?.id) // Exclude current post
              .map((article) => (
                <label
                  key={article.id}
                  className="flex items-start sm:items-center gap-2 md:gap-3 p-2 md:p-3 border-2 border-border rounded-[10px] hover:opacity-80 cursor-pointer transition-colors touch-manipulation admin-card"
                >
                  <input
                    type="checkbox"
                    checked={selectedRelatedArticles.includes(article.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedRelatedArticles.length < 3) {
                          setSelectedRelatedArticles([...selectedRelatedArticles, article.id]);
                        } else {
                          alert("You can select maximum 3 related articles");
                        }
                      } else {
                        setSelectedRelatedArticles(
                          selectedRelatedArticles.filter((id) => id !== article.id)
                        );
                      }
                    }}
                    className="w-5 h-5 border-2 border-border rounded focus:ring-2 focus:ring-primary mt-0.5 sm:mt-0 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base block break-words">{article.title}</span>
                    <span className="text-xs text-gray-500 font-mono block sm:hidden mt-1 truncate">{article.slug}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono hidden sm:block">{article.slug}</span>
                </label>
              ))}
            
            {allPosts.filter((p) => p.id !== post?.id).length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No other articles available. Related articles will be auto-selected from the same category.
              </p>
            )}
          </div>

          {selectedRelatedArticles.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-[10px]">
              <p className="text-sm font-medium text-blue-800">
                <strong className="font-black">Selected:</strong> {selectedRelatedArticles.length} article(s) will be shown as related articles.
              </p>
            </div>
          )}

          {selectedRelatedArticles.length === 0 && (
            <div className="mt-4 p-4 admin-card border-2 border-border rounded-[10px] opacity-90">
              <p className="text-sm font-medium text-gray-600">
                <strong className="font-black">Auto-selection:</strong> Top 3 latest articles from the same category/subcategory will be shown automatically.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button type="submit" variant="primary" sharp="br" className="flex-1 sm:flex-none">
            {post ? "Update Post" : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            sharp="br"
            className="flex-1 sm:flex-none"
          >
            <Eye size={18} className="mr-2" />
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            sharp="tl"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
