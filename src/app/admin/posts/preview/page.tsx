"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Calendar, Facebook, Twitter, Linkedin, ShoppingBag, BookOpen, Eye } from "lucide-react";
import { format } from "date-fns";
import { ProductCard } from "@/components/blog/ProductCard";
import { BlogCard } from "@/components/blog/BlogCard";

interface PreviewPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  subcategory_id: string | null;
  featured_image_url: string | null;
  read_time: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: "primary" | "secondary" | "accent";
  } | null;
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  products: Array<{
    id: string;
    name: string;
    description: string;
    image_url: string;
    amazon_affiliate_link: string;
    price: string | null;
    rating: number | null;
    review_count: number;
    is_featured: boolean;
  }>;
  related_articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    category: {
      name: string;
      color: "primary" | "secondary" | "accent";
    };
  }>;
}

export default function PreviewPage() {
  const [previewPost, setPreviewPost] = useState<PreviewPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get preview data from sessionStorage
    const storedPreview = sessionStorage.getItem('previewPost');
    if (storedPreview) {
      try {
        const post = JSON.parse(storedPreview);
        console.log('Preview Post Data:', post);
        console.log('Title:', post.title);
        console.log('Excerpt:', post.excerpt);
        console.log('Featured Image:', post.featured_image_url);
        console.log('Products:', post.products);
        console.log('Products Count:', post.products?.length || 0);
        console.log('Content (first 200 chars):', post.content?.substring(0, 200));
        console.log('Content type:', typeof post.content);
        setPreviewPost(post);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
    } else {
      console.warn('No preview data found in sessionStorage');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!previewPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-black uppercase mb-4">Preview Not Available</h1>
          <p className="text-gray-600 font-medium mb-6">
            No preview data found. Please go back to your post editor and click "Preview" again.
          </p>
          <Link href="/admin/posts">
            <Button variant="primary" sharp="br">
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = previewPost.published_at 
    ? new Date(previewPost.published_at) 
    : new Date(previewPost.created_at);

  // Map color values to Tailwind classes
  const colorMap = {
    primary: {
      bg: "bg-primary",
      bgOpacity: "bg-primary/20",
    },
    secondary: {
      bg: "bg-secondary",
      bgOpacity: "bg-secondary/20",
    },
    accent: {
      bg: "bg-accent",
      bgOpacity: "bg-accent/20",
    },
  };

  const categoryColor = previewPost.category 
    ? (colorMap[previewPost.category.color] || colorMap.primary)
    : colorMap.primary;

  return (
    <>
      {/* Preview Banner */}
      <div className="bg-yellow-400 border-b-4 border-black py-3 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Eye size={20} className="text-black flex-shrink-0" />
            <span className="font-black uppercase text-sm md:text-base">Preview Mode</span>
            <span className="text-xs md:text-sm font-medium hidden sm:inline">This is how your post will look when published</span>
          </div>
          <Link href="/admin/posts">
            <Button variant="outline" size="sm" sharp="br" className="text-xs md:text-sm">
              Close Preview
            </Button>
          </Link>
        </div>
      </div>

      <article className="min-h-screen bg-white pb-12 md:pb-20">
      {/* Header Section - Enhanced Horizontal Layout */}
      <div className={`${categoryColor.bgOpacity} border-b-4 border-black pt-20 sm:pt-24 md:pt-32 pb-16 md:pb-20`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            href="/admin/posts"
            className="inline-flex items-center font-bold uppercase mb-8 md:mb-10 hover:text-primary transition-colors text-sm md:text-base touch-manipulation group"
          >
            <ArrowLeft size={18} className="mr-2 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" /> Back to Posts
          </Link>

          {/* Horizontal Layout: Title on Left, Image on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left Side: Title and Metadata */}
            <div className="flex flex-col space-y-6">
              {/* Category Badges */}
              <div className="flex gap-3 md:gap-4 flex-wrap">
                {previewPost.category && (
                  <span className={`${categoryColor.bg} border-2 border-black text-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm`}>
                    {previewPost.category.name}
                  </span>
                )}
                {previewPost.subcategory && (
                  <span className="bg-white border-2 border-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm">
                    {previewPost.subcategory.name}
                  </span>
                )}
                <span className="bg-white border-2 border-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm flex items-center gap-1">
                  <Calendar size={14} className="md:w-4 md:h-4" />
                  {previewPost.read_time} Min
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] tracking-tight">
                {previewPost.title || "Untitled Post"}
              </h1>

              {/* Excerpt/Description */}
              <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-2xl">
                {previewPost.excerpt || "No description available."}
              </p>

              {/* Date */}
              <div className="flex items-center gap-2 pt-4 border-t-4 border-black">
                <Calendar size={18} className="md:w-5 md:h-5 text-gray-600" />
                <span className="text-sm md:text-base text-gray-600 font-bold">{format(publishedDate, 'MMMM d, yyyy')}</span>
              </div>
            </div>

            {/* Right Side: Featured Image */}
            <div className="lg:sticky lg:top-24 order-first lg:order-last">
              {previewPost.featured_image_url ? (
                <div className="relative group">
                  <div className="absolute -inset-2 bg-black rounded-[12px] transform rotate-2 group-hover:rotate-3 transition-transform"></div>
                  <img
                    src={previewPost.featured_image_url}
                    alt={previewPost.title}
                    className="relative w-full h-auto border-4 border-black hard-shadow-lg rounded-[10px] transform group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 border-4 border-black hard-shadow-lg rounded-[10px] flex items-center justify-center">
                  <span className="text-gray-400 font-bold uppercase">No Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
        {previewPost.content ? (
          <div 
            className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:mb-6 prose-headings:mt-12 max-w-none prose-img:w-full prose-img:rounded-[12px] prose-img:border-2 prose-img:border-black prose-img:hard-shadow prose-a:text-primary prose-a:font-bold prose-a:underline hover:prose-a:text-primary/80 prose-p:leading-relaxed prose-p:mb-6 prose-ul:space-y-2 prose-ol:space-y-2 prose-li:marker:text-black prose-strong:font-black prose-strong:text-black prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-medium"
            dangerouslySetInnerHTML={{ __html: previewPost.content }}
          />
        ) : (
          <p className="text-gray-500 italic">No content available.</p>
        )}

        {/* Affiliate Products Section */}
        {previewPost.products && previewPost.products.length > 0 && (
          <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t-4 border-black">
            <div className="space-y-6 md:space-y-8">
              {previewPost.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image_url: product.image_url,
                    amazon_affiliate_link: product.amazon_affiliate_link,
                    price: product.price,
                    rating: product.rating,
                    review_count: product.review_count,
                    is_featured: product.is_featured,
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {previewPost.related_articles && previewPost.related_articles.length > 0 && (
          <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t-4 border-black">
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className={`${categoryColor.bg} p-3 md:p-4 border-2 border-black rounded-md hard-shadow-sm`}>
                  <BookOpen size={28} className="md:w-8 md:h-8 text-black" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-tight">
                  Related Articles
                </h2>
              </div>
              <p className="text-lg md:text-xl font-medium text-gray-700 max-w-4xl leading-relaxed">
                Continue reading with these related articles from the same category.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {previewPost.related_articles.map((article, index) => (
                <BlogCard
                  key={article.id}
                  post={{
                    id: article.id,
                    title: article.title,
                    excerpt: article.excerpt,
                    category: article.category.name,
                    slug: article.slug,
                    color: article.category.color,
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t-4 border-black">
          <h3 className="font-black uppercase text-xl md:text-2xl mb-6 md:mb-8">Share this article</h3>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(previewPost.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${previewPost.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation"><Twitter size={18} /> Twitter</Button>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${previewPost.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation"><Facebook size={18} /> Facebook</Button>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${previewPost.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation"><Linkedin size={18} /> LinkedIn</Button>
            </a>
          </div>
        </div>
      </div>
    </article>
    </>
  );
}
