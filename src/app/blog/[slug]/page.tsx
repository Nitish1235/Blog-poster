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
        ].filter((keyword): keyword is string => Boolean(keyword)),
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
            tags: [post.category.name, post.subcategory?.name].filter((tag): tag is string => Boolean(tag)),
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
            {/* Header Section - Enhanced Horizontal Layout */}
            <div className={`${categoryColor.bgOpacity} border-b-4 border-black pt-20 sm:pt-24 md:pt-32 pb-16 md:pb-20`}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center font-bold uppercase mb-8 md:mb-10 hover:text-primary transition-colors text-sm md:text-base touch-manipulation group"
                    >
                        <ArrowLeft size={18} className="mr-2 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" /> Back to Articles
                    </Link>

                    {/* Horizontal Layout: Title on Left, Image on Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
                        {/* Left Side: Title and Metadata */}
                        <div className="flex flex-col space-y-6">
                            {/* Category Badges */}
                            <div className="flex gap-3 md:gap-4 flex-wrap">
                                <span className={`${categoryColor.bg} border-2 border-black text-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm`}>
                                    {post.category.name}
                                </span>
                                {post.subcategory && (
                                    <span className="bg-white border-2 border-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm">
                                        {post.subcategory.name}
                                    </span>
                                )}
                                <span className="bg-white border-2 border-black px-3 md:px-4 py-2 font-black uppercase text-xs md:text-sm rounded-md hard-shadow-sm flex items-center gap-1">
                                    <Calendar size={14} className="md:w-4 md:h-4" />
                                    {post.read_time} Min
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] tracking-tight">
                                {post.title || "Untitled Post"}
                            </h1>

                            {/* Excerpt/Description */}
                            <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-2xl">
                                {post.excerpt || "No description available."}
                            </p>

                            {/* Date */}
                            <div className="flex items-center gap-2 pt-4 border-t-4 border-black">
                                <Calendar size={18} className="md:w-5 md:h-5 text-gray-600" />
                                <span className="text-sm md:text-base text-gray-600 font-bold">{format(publishedDate, 'MMMM d, yyyy')}</span>
                            </div>
                        </div>

                        {/* Right Side: Featured Image */}
                        <div className="lg:sticky lg:top-24 order-first lg:order-last">
                            {post.featured_image_url ? (
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-black rounded-[12px] transform rotate-2 group-hover:rotate-3 transition-transform"></div>
                                    <img
                                        src={post.featured_image_url}
                                        alt={post.title}
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
                <div 
                    className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:mb-6 prose-headings:mt-12 max-w-none prose-img:w-full prose-img:rounded-[12px] prose-img:border-2 prose-img:border-black prose-img:hard-shadow prose-a:text-primary prose-a:font-bold prose-a:underline hover:prose-a:text-primary/80 prose-p:leading-relaxed prose-p:mb-6 prose-ul:space-y-2 prose-ol:space-y-2 prose-li:marker:text-black prose-strong:font-black prose-strong:text-black prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-medium"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Affiliate Products Section */}
                {post.products && post.products.length > 0 && (
                    <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t-4 border-black">
                        <div className="space-y-6 md:space-y-8">
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
                    </div>
                )}

                {/* Related Articles Section */}
                {relatedArticles && relatedArticles.length > 0 && (
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
                <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t-4 border-black">
                    <h3 className="font-black uppercase text-xl md:text-2xl mb-6 md:mb-8">Share this article</h3>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
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
