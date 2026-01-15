"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, ShoppingCart, CheckCircle2, Package } from "lucide-react";
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
    <Card
      variant="white"
      sharp={sharpCorner}
      className="h-full flex flex-col overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-[8px_8px_0px_0px_#000000] border-2 border-black"
    >
      {/* Product Image */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-100 border-b-4 border-black overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.is_featured && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary border-2 border-black px-3 py-1.5 sm:px-4 sm:py-2 font-black text-xs uppercase hard-shadow-sm z-10 rounded-md">
            ⭐ Featured
          </div>
        )}
        {asin && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black text-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-black uppercase rounded-md border-2 border-white/20">
            ASIN: {asin}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 sm:p-6 md:p-7 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase mb-3 md:mb-4 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Full Description */}
        <div className="mb-6 md:mb-8 flex-grow">
          <p className="text-gray-700 font-medium text-sm md:text-base leading-relaxed">
            {product.description}
          </p>
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

        {/* Trust Indicators */}
        <div className="mt-4 pt-4 border-t-2 border-black/20">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span className="font-bold">Verified Amazon Product</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
