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
  author_name: string;
  author_email: string;
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
        setPreviewPost(post);
      } catch (error) {
        console.error('Error parsing preview data:', error);
      }
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
    <article className="min-h-screen bg-white pb-12 md:pb-20">
      {/* Preview Banner */}
      <div className="bg-yellow-400 border-b-2 border-black py-3 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-black" />
            <span className="font-black uppercase text-sm md:text-base">Preview Mode</span>
            <span className="text-xs md:text-sm font-medium">This is how your post will look when published</span>
          </div>
          <Link href="/admin/posts">
            <Button variant="outline" size="sm" sharp="br" className="text-xs md:text-sm">
              Close Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <div className={`${categoryColor.bgOpacity} border-b-2 border-border pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-16`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/admin/posts"
            className="inline-flex items-center font-bold uppercase mb-6 md:mb-8 hover:underline text-sm md:text-base touch-manipulation"
          >
            <ArrowLeft size={18} className="mr-2 md:w-5 md:h-5" /> Back to Posts
          </Link>

          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
            {previewPost.category && (
              <span className={`${categoryColor.bg} border-2 border-black text-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md`}>
                {previewPost.category.name}
              </span>
            )}
            {previewPost.subcategory && (
              <span className="bg-white border-2 border-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md">
                {previewPost.subcategory.name}
              </span>
            )}
            <span className="bg-white border-2 border-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md">
              {previewPost.read_time} Min Read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-6 md:mb-8">
            {previewPost.title}
          </h1>

          <div className="flex items-center gap-3 md:gap-4 border-t-2 border-black/10 pt-4 md:pt-6">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${categoryColor.bg} rounded-full border-2 border-black flex items-center justify-center text-lg md:text-xl flex-shrink-0`}>
              {previewPost.author_name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="font-bold uppercase text-sm md:text-base truncate">{previewPost.author_name || 'Author'}</p>
              <div className="flex items-center text-xs md:text-sm text-gray-600 font-medium gap-3 md:gap-4">
                <span className="flex items-center whitespace-nowrap">
                  <Calendar size={12} className="mr-1 md:w-3.5 md:h-3.5" /> 
                  {format(publishedDate, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-3xl py-8 md:py-12">
        {previewPost.featured_image_url && (
          <img
            src={previewPost.featured_image_url}
            alt={previewPost.title}
            className="w-full h-auto border-2 border-black hard-shadow rounded-[10px] mb-8"
          />
        )}
        <div 
          className="prose prose-sm sm:prose-base md:prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none prose-img:w-full prose-img:rounded-[10px] prose-a:text-primary prose-a:font-bold prose-a:underline"
          dangerouslySetInnerHTML={{ __html: previewPost.content }}
        />

        {/* Affiliate Products Section */}
        {previewPost.products && previewPost.products.length > 0 && (
          <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t-2 border-border">
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <ShoppingBag size={24} className="md:w-7 md:h-7 text-primary flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase">
                Recommended Products
              </h2>
            </div>
            <p className="text-gray-600 font-medium mb-6 md:mb-8 max-w-3xl text-sm md:text-base">
              Here are our top picks for this category. These products have been carefully selected based on quality, value, and customer reviews. Click any product to view full details and purchase on Amazon.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
            <div className="mt-8 p-6 bg-gray-50 border-2 border-border rounded-[10px]">
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                <strong className="font-black uppercase">Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
                The products featured above are independently selected by our editorial team. 
                When you purchase through our affiliate links, we may earn a commission at no extra cost to you. 
                All product information is accurate at the time of publication, but prices and availability may change.
              </p>
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {previewPost.related_articles && previewPost.related_articles.length > 0 && (
          <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t-2 border-border">
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <BookOpen size={24} className="md:w-7 md:h-7 text-primary flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase">
                Related Articles
              </h2>
            </div>
            <p className="text-gray-600 font-medium mb-6 md:mb-8 max-w-3xl text-sm md:text-base">
              Continue reading with these related articles from the same category.
            </p>
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
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t-2 border-border">
          <h3 className="font-black uppercase text-lg md:text-xl mb-4">Share this article</h3>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
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
  );
}
