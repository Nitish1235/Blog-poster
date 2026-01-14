import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/queries/blog-posts";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Articles | PickBettr - Product Reviews & Recommendations",
    description: "Explore our complete collection of expert product reviews, buying guides, and recommendations. Find the best products across categories like tech, home, health, and more.",
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
        description: "Explore our complete collection of expert product reviews, buying guides, and recommendations.",
        type: 'website',
        locale: 'en_US',
        siteName: 'PickBettr',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog`,
    },
    twitter: {
        card: 'summary_large_image',
        title: "All Articles | PickBettr",
        description: "Explore our complete collection of expert product reviews and recommendations.",
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
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
                    Explore our complete collection of articles on affiliate marketing, SEO, business growth, and more. 
                    Expert insights and actionable strategies to help you succeed.
                </p>
            </div>

            {!isSupabaseConfigured ? (
                <Card className="p-8 text-center" sharp="br">
                    <h2 className="text-2xl font-black uppercase mb-4">Database Not Configured</h2>
                    <p className="font-medium text-gray-600 mb-4">
                        Please set up your Supabase credentials in the <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file.
                    </p>
                    <p className="text-sm text-gray-500">
                        See <code className="bg-gray-100 px-2 py-1 rounded">ENV_SETUP.md</code> for instructions.
                    </p>
                </Card>
            ) : posts.length === 0 ? (
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
                            }} 
                            index={index} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
