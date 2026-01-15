"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExternalLink, ShoppingCart, Package } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    amazon_affiliate_link: string;
    price?: string | null;
    rating?: number | null;
    review_count?: number;
    is_featured?: boolean;
  };
  index: number;
  blogPostId?: string;
}

// Helper function to extract ASIN from Amazon URL
function extractASIN(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Try to get ASIN from /dp/ASIN or /gp/product/ASIN patterns
    const dpMatch = urlObj.pathname.match(/\/dp\/([A-Z0-9]{10})/);
    if (dpMatch) return dpMatch[1];
    
    const gpMatch = urlObj.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/);
    if (gpMatch) return gpMatch[1];
    
    // Try query parameter
    const asinParam = urlObj.searchParams.get('asin');
    if (asinParam) return asinParam;
    
    return null;
  } catch {
    return null;
  }
}

export const ProductCard = ({ product, index, blogPostId }: ProductCardProps) => {
  const corners: ("tl" | "tr" | "bl" | "br")[] = ["tr", "tl", "br", "bl"];
  const sharpCorner = corners[index % 4];
  const asin = extractASIN(product.amazon_affiliate_link);
  const [isTracking, setIsTracking] = useState(false);

  const trackClick = async (clickType: 'buy_now' | 'add_to_cart') => {
    if (isTracking || !blogPostId) return;
    
    setIsTracking(true);
    try {
      await fetch("/api/analytics/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          post_id: blogPostId,
          click_type: clickType,
        }),
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the page
      console.error("Failed to track click:", error);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <article className="flex flex-col md:flex-row gap-6 md:gap-8 py-6 md:py-8 group">
      {/* Left Side: Product Info */}
      <div className="flex flex-col flex-grow md:w-1/2">
        {/* Product Name */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-3 md:mb-4 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Full Description */}
        <div className="mb-6 md:mb-8 flex-grow">
          <p className="text-gray-700 font-medium text-sm md:text-base leading-relaxed break-words overflow-wrap-anywhere whitespace-normal word-wrap break-word">
            {product.description}
          </p>
        </div>

      </div>

      {/* Right Side: Product Image and Buttons */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Product Image */}
        <div className="relative w-full h-64 sm:h-72 md:h-[300px] bg-gray-100 overflow-hidden rounded-lg mb-4">
          <Image
            src={product.image_url}
            alt={`${product.name} - Amazon affiliate product image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.is_featured && (
            <div className="absolute top-3 right-3 bg-primary px-3 py-1.5 font-black text-xs uppercase rounded-md">
              ⭐ Featured
            </div>
          )}
          {asin && (
            <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2.5 py-1.5 text-xs font-black uppercase rounded-md">
              ASIN: {asin}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 md:space-y-3">
          {/* Primary Buy Now Button */}
          <a
            href={product.amazon_affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block touch-manipulation"
            onClick={() => trackClick('buy_now')}
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm sm:text-base font-black uppercase py-3 md:py-4"
              sharp="br"
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5 mr-2" />
              <span className="hidden sm:inline">Buy Now on Amazon</span>
              <span className="sm:hidden">Buy Now</span>
              <ExternalLink size={16} className="md:w-[18px] md:h-[18px] ml-2" />
            </Button>
          </a>

          {/* Secondary Add to Cart Link */}
          <a
            href={product.amazon_affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-700 hover:text-primary transition-colors underline touch-manipulation"
            onClick={() => trackClick('add_to_cart')}
          >
            <Package size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Add to Cart on Amazon</span>
            <span className="sm:hidden">Add to Cart</span>
          </a>
        </div>
      </div>
    </article>
  );
};
