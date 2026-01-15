import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Star, Zap, Shield, CheckCircle2, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/queries/blog-posts";
import { BlogCard } from "@/components/blog/BlogCard";

export default async function Home() {
  const posts = await getAllBlogPosts(true);
  const recentPosts = posts.slice(0, 3);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://postbettr.com';

  // Structured Data for Homepage (Organization + WebSite)
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PickBettr",
    "url": baseUrl,
    "logo": `${baseUrl}/icon.svg`,
    "description": "We suggest the best products after thorough research and testing. Trust our expert recommendations to help you make confident purchases.",
    "sameAs": [
      "https://twitter.com/pickbettr",
      "https://www.facebook.com/pickbettr",
      "https://www.linkedin.com/company/pickbettr",
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PickBettr",
    "url": baseUrl,
    "description": "Trusted product recommendations and reviews. We help you find the best products that deliver real value.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Blog structured data for recent posts
  const blogStructuredData = recentPosts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PickBettr Blog",
    "url": `${baseUrl}/blog`,
    "description": "Expert product reviews, buying guides, and recommendations",
    "blogPost": recentPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${baseUrl}/blog/${post.slug}`,
      "datePublished": post.published_at || post.created_at,
      "author": {
        "@type": "Person",
        "name": "PickBettr",
      },
    })),
  } : null;

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      {blogStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
        />
      )}
      {/* Hero Section */}
      <section id="hero" className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-border">
        <div className="bg-primary p-6 md:p-12 lg:p-20 flex flex-col justify-center items-start gap-6 md:gap-8 border-b-2 md:border-b-0 md:border-r-2 border-border">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
            We Suggest <br />
            <span className="text-white text-stroke">Best Products</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium max-w-md">
            Trust our expert recommendations. We carefully research and test products to help you make confident purchases. Find the best products that truly deliver value.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/blog" className="w-full sm:w-auto">
              <Button size="lg" sharp="br" className="w-full sm:w-auto">Explore Products</Button>
            </Link>
            <Link href="#topics" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" sharp="tl" className="w-full sm:w-auto">Why Trust Us</Button>
            </Link>
          </div>
        </div>
        <div className="bg-purple-100 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] relative flex items-center justify-center overflow-hidden">
          {/* Geometric Pattern Placeholder */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-secondary border-2 border-black hard-shadow-lg rounded-[20px] rotate-12 flex items-center justify-center z-10">
            <span className="text-6xl sm:text-7xl md:text-8xl">🚀</span>
          </div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-accent border-2 border-black hard-shadow absolute bottom-10 right-10 sm:bottom-16 sm:right-16 md:bottom-20 md:right-20 -rotate-6 rounded-full z-0"></div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-12 text-center">
          <div className="bg-black text-white px-4 py-2 font-bold uppercase rounded-full text-sm">Why Trust Us</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase">We Help You Choose Right</h2>
          <p className="text-base sm:text-lg font-medium max-w-2xl text-gray-600 px-4">
            Our team thoroughly researches and tests products before recommending them. We only suggest products we believe in, so you can shop with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <Card variant="white" sharp="br" className="p-8 flex flex-col gap-4">
            <div className="w-16 h-16 bg-secondary border-2 border-black rounded-full flex items-center justify-center mb-4 hard-shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase">Expertly Tested</h3>
            <p className="font-medium text-gray-600">
              Every product we recommend goes through rigorous testing and research. We only suggest products that meet our high standards for quality and value.
            </p>
          </Card>

          <Card variant="primary" sharp="tr" className="p-8 flex flex-col gap-4">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-4 hard-shadow-sm">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase">Best Products</h3>
            <p className="font-medium">
              We curate the finest selection of products across various categories. Our recommendations help you find exactly what you need, saving you time and money.
            </p>
          </Card>

          <Card variant="accent" sharp="tl" className="p-8 flex flex-col gap-4">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-4 hard-shadow-sm">
              <Shield size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase">Trusted Reviews</h3>
            <p className="font-medium">
              Honest, unbiased reviews from real experience. We tell you what works, what doesn't, and why. Your trust is our priority.
            </p>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="bg-black text-white px-4 py-2 font-bold uppercase rounded-full">About Us</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase">Your Trusted Product Guide</h2>
          <p className="text-xl font-medium max-w-3xl text-gray-600">
            At PickBettr, we're committed to helping you make informed purchase decisions. Our team spends countless hours researching, 
            testing, and reviewing products to bring you honest recommendations. We only suggest products we genuinely believe in, 
            so you can shop with complete confidence. Your trust means everything to us.
          </p>
        </div>
      </section>

      {/* Blog Teaser Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12 border-b-2 border-border pb-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase">Latest Articles</h2>
          <Link href="/blog" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View All Posts <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="bg-gray-100 p-8 md:p-12 border-2 border-dashed border-gray-300 rounded-[20px] text-center">
            <p className="font-bold text-gray-500 uppercase text-sm md:text-base">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {recentPosts.map((post, index) => (
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="bg-black text-white px-4 py-2 font-bold uppercase rounded-full">Stay Connected</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase">Discover Best Products</h2>
          <p className="text-xl font-medium max-w-2xl text-gray-600">
            Get access to our latest product recommendations, detailed reviews, and exclusive buying guides. 
            Join thousands of smart shoppers who trust us to help them find the best products.
          </p>
          <div className="mt-8">
            <Link href="/blog">
              <Button size="lg" variant="primary" sharp="br">
                Explore Product Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
