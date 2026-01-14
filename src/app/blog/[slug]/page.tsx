import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Calendar, Facebook, Twitter, Linkedin, ShoppingBag, BookOpen } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/queries/blog-posts";
import { getRelatedArticles } from "@/lib/queries/related-articles";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ProductCard } from "@/components/blog/ProductCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { TrackView } from "@/components/blog/TrackView";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug, true);

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com';
    const postUrl = `${baseUrl}/blog/${slug}`;
    const featuredImage = post.featured_image_url || `${baseUrl}/icon.svg`;
    const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);
    const modifiedDate = new Date(post.updated_at);

    return {
        title: `${post.title} | PickBettr`,
        description: post.excerpt || `Read our expert review and recommendations for ${post.title}. ${post.category.name} insights and product recommendations.`,
        keywords: [
            post.category.name,
            post.subcategory?.name,
            post.title,
            'product review',
            'affiliate marketing',
            'product recommendations',
            'buying guide',
        ].filter(Boolean),
        authors: [{ name: post.author_name || 'PickBettr' }],
        creator: 'PickBettr',
        publisher: 'PickBettr',
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt || `Expert review and recommendations for ${post.title}`,
            type: 'article',
            locale: 'en_US',
            siteName: 'PickBettr',
            url: postUrl,
            publishedTime: publishedDate.toISOString(),
            modifiedTime: modifiedDate.toISOString(),
            authors: [post.author_name || 'PickBettr'],
            section: post.category.name,
            tags: [post.category.name, post.subcategory?.name].filter(Boolean),
            images: [
                {
                    url: featuredImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || `Expert review and recommendations for ${post.title}`,
            images: [featuredImage],
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
}

export default async function BlogPost({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug, true);

    if (!post) {
        notFound();
    }

    // Get related articles
    const relatedArticles = await getRelatedArticles(
        post.id,
        post.category_id,
        post.subcategory_id,
        true
    );

    const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

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

    const categoryColor = colorMap[post.category.color] || colorMap.primary;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com';
    const postUrl = `${baseUrl}/blog/${slug}`;

    // Structured Data (JSON-LD) for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.title,
        "image": post.featured_image_url ? [post.featured_image_url] : [`${baseUrl}/icon.svg`],
        "datePublished": publishedDate.toISOString(),
        "dateModified": new Date(post.updated_at).toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author_name || "PickBettr",
        },
        "publisher": {
            "@type": "Organization",
            "name": "PickBettr",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/icon.svg`,
            },
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl,
        },
        "articleSection": post.category.name,
        "keywords": [post.category.name, post.subcategory?.name].filter(Boolean).join(", "),
        "wordCount": post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
        "timeRequired": `PT${post.read_time}M`,
    };

    // Add product structured data if products exist
    const productStructuredData = post.products && post.products.length > 0 ? post.products.map((product) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image_url,
        "offers": {
            "@type": "Offer",
            "url": product.amazon_affiliate_link,
            "priceCurrency": "USD",
            "price": product.price?.toString() || "0",
            "availability": "https://schema.org/InStock",
        },
        "aggregateRating": product.rating && product.review_count ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating.toString(),
            "reviewCount": product.review_count.toString(),
        } : undefined,
    })).filter(Boolean) : [];

    return (
        <article className="min-h-screen bg-white pb-12 md:pb-20">
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {productStructuredData.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
                />
            )}
            <TrackView postId={post.id} />
            {/* Header Section */}
            <div className={`${categoryColor.bgOpacity} border-b-2 border-border pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-16`}>
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center font-bold uppercase mb-6 md:mb-8 hover:underline text-sm md:text-base touch-manipulation"
                    >
                        <ArrowLeft size={18} className="mr-2 md:w-5 md:h-5" /> Back to Articles
                    </Link>

                    <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
                        <span className={`${categoryColor.bg} border-2 border-black text-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md`}>
                            {post.category.name}
                        </span>
                        {post.subcategory && (
                            <span className="bg-white border-2 border-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md">
                                {post.subcategory.name}
                            </span>
                        )}
                        <span className="bg-white border-2 border-black px-2 md:px-3 py-1 font-bold uppercase text-xs md:text-sm rounded-md">
                            {post.read_time} Min Read
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-6 md:mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 md:gap-4 border-t-2 border-black/10 pt-4 md:pt-6">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${categoryColor.bg} rounded-full border-2 border-black flex items-center justify-center text-lg md:text-xl flex-shrink-0`}>
                            {post.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold uppercase text-sm md:text-base truncate">{post.author_name}</p>
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
                {post.featured_image_url && (
                    <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-auto border-2 border-black hard-shadow rounded-[10px] mb-8"
                    />
                )}
                <div 
                    className="prose prose-sm sm:prose-base md:prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none prose-img:w-full prose-img:rounded-[10px] prose-a:text-primary prose-a:font-bold prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Affiliate Products Section */}
                {post.products && post.products.length > 0 && (
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
                            {post.products.map((product, index) => (
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
                                    blogPostId={post.id}
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
                {relatedArticles && relatedArticles.length > 0 && (
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
                            {relatedArticles.map((article, index) => (
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
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${post.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        >
                            <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation"><Twitter size={18} /> Twitter</Button>
                        </a>
                        <a 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${post.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        >
                            <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto touch-manipulation"><Facebook size={18} /> Facebook</Button>
                        </a>
                        <a 
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com'}/blog/${post.slug}`)}`}
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
