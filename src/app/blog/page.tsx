import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/queries/blog-posts";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Articles | PickBettr - Product Reviews & Recommendations",
    description: "We help you pick better products with expert reviews, detailed comparisons, and honest recommendations. Find the best products across categories like tech, home, health, and more.",
    keywords: ['product reviews', 'buying guides', 'product recommendations', 'affiliate marketing', 'best products', 'expert reviews'],
    authors: [{ name: 'PickBettr' }],
    creator: 'PickBettr',
    publisher: 'PickBettr',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'),
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: "All Articles | PickBettr",
        description: "We help you pick better products with expert reviews, detailed comparisons, and honest recommendations.",
        type: 'website',
        locale: 'en_US',
        siteName: 'PickBettr',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog`,
    },
    twitter: {
        card: 'summary_large_image',
        title: "All Articles | PickBettr",
        description: "We help you pick better products with expert reviews and recommendations.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/icon.svg`],
        creator: '@pickbettr',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function BlogExample() {
    const posts = await getAllBlogPosts(true);
    // Supabase is always configured via hardcoded fallbacks in src/lib/supabase/server.ts and client.ts
    // No need to check for configuration - if there's an issue, it will be handled by the query functions

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="flex flex-col items-center mb-12 md:mb-16 text-center px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase mb-4 md:mb-6 relative">
                    All <span className="text-secondary">Articles</span>
                    {/* Decorative underline */}
                    <svg className="absolute w-full h-3 md:h-4 -bottom-1 md:-bottom-2 left-0 text-black" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                </h1>
                <p className="text-base sm:text-lg md:text-xl font-medium max-w-2xl">
                    We help you pick better products with expert reviews, detailed comparisons, and honest recommendations. 
                    Find the best products that match your needs and make smarter purchasing decisions.
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl font-medium text-gray-500">No blog posts found. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {posts.map((post, index) => (
                        <BlogCard 
                            key={post.id} 
                            post={{
                                id: post.id,
                                title: post.title,
                                excerpt: post.excerpt,
                                category: post.category.name,
                                slug: post.slug,
                                color: post.category.color,
                                featured_image_url: post.featured_image_url,
                            }} 
                            index={index} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
