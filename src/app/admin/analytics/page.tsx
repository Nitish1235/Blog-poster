import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { getAllPostAnalytics, getTopProducts } from "@/lib/queries/analytics";
import { Eye, MousePointerClick, TrendingUp, Package, BarChart3 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AnalyticsPage() {
  const [postAnalytics, topProducts] = await Promise.all([
    getAllPostAnalytics(),
    getTopProducts(10),
  ]);

  // Calculate totals
  const totalViews = postAnalytics.reduce((sum, post) => sum + post.views, 0);
  const totalClicks = postAnalytics.reduce((sum, post) => sum + post.clicks, 0);
  const overallConversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  // Sort posts by views (most popular)
  const topPosts = [...postAnalytics].sort((a, b) => b.views - a.views).slice(0, 10);

  // Sort posts by conversion rate (best converting)
  const bestConverting = [...postAnalytics]
    .filter(p => p.views >= 10) // Only posts with at least 10 views
    .sort((a, b) => b.conversion_rate - a.conversion_rate)
    .slice(0, 10);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <BarChart3 size={32} className="text-primary" />
        <h1 className="text-3xl sm:text-4xl font-black uppercase admin-heading">Analytics Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 sm:p-6 admin-card" sharp="br">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center">
              <Eye size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-1 admin-text">{totalViews.toLocaleString()}</h3>
          <p className="font-medium admin-text-secondary text-sm sm:text-base">Total Views</p>
        </Card>

        <Card className="p-4 sm:p-6 admin-card" sharp="tl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary border-2 border-border rounded-full flex items-center justify-center">
              <MousePointerClick size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-1 admin-text">{totalClicks.toLocaleString()}</h3>
          <p className="font-medium admin-text-secondary text-sm sm:text-base">Total Clicks</p>
        </Card>

        <Card className="p-4 sm:p-6 admin-card" sharp="br">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent border-2 border-border rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-1 admin-text">
            {Math.round(overallConversionRate * 100) / 100}%
          </h3>
          <p className="font-medium admin-text-secondary text-sm sm:text-base">Conversion Rate</p>
        </Card>

        <Card className="p-4 sm:p-6 admin-card" sharp="tl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center">
              <Package size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-1 admin-text">{postAnalytics.length}</h3>
          <p className="font-medium admin-text-secondary text-sm sm:text-base">Published Posts</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Top Posts by Views */}
        <Card className="p-4 sm:p-6 admin-card" sharp="br">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 flex items-center gap-2 admin-heading">
            <Eye size={24} className="text-primary" />
            Most Viewed Posts
          </h2>
          {topPosts.length === 0 ? (
            <p className="admin-text-secondary font-medium text-sm sm:text-base">No views yet. Posts will appear here once they receive views.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <Link
                  key={post.post_id}
                  href={`/blog/${post.slug}`}
                  className="block p-3 border-2 border-border rounded-[10px] hover:opacity-80 transition-colors admin-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-black text-primary">#{index + 1}</span>
                        <h3 className="font-black uppercase text-sm sm:text-base truncate admin-text">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm admin-text-secondary">
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {post.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick size={14} /> {post.clicks.toLocaleString()} clicks
                        </span>
                        <span className="text-primary font-bold">{post.conversion_rate}% conversion</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Best Converting Posts */}
        <Card className="p-4 sm:p-6 admin-card" sharp="tl">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 flex items-center gap-2 admin-heading">
            <TrendingUp size={24} className="text-accent" />
            Best Converting Posts
          </h2>
          {bestConverting.length === 0 ? (
            <p className="admin-text-secondary font-medium text-sm sm:text-base">No conversion data yet. Posts need at least 10 views to appear here.</p>
          ) : (
            <div className="space-y-3">
              {bestConverting.map((post, index) => (
                <Link
                  key={post.post_id}
                  href={`/blog/${post.slug}`}
                  className="block p-3 border-2 border-border rounded-[10px] hover:opacity-80 transition-colors admin-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-black text-accent">#{index + 1}</span>
                        <h3 className="font-black uppercase text-sm sm:text-base truncate admin-text">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm admin-text-secondary">
                        <span className="text-accent font-black text-base">{post.conversion_rate}%</span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {post.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick size={14} /> {post.clicks.toLocaleString()} clicks
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-4 sm:p-6 admin-card" sharp="br">
        <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 flex items-center gap-2 admin-heading">
          <Package size={24} className="text-secondary" />
          Top Performing Products
        </h2>
        {topProducts.length === 0 ? (
          <p className="admin-text-secondary font-medium text-sm sm:text-base">No product clicks yet. Products will appear here once they receive clicks.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.product_id}
                className="p-3 border-2 border-border rounded-[10px] admin-card opacity-90"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-secondary">#{index + 1}</span>
                      <h3 className="font-black uppercase text-sm sm:text-base truncate admin-text">{product.product_name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs sm:text-sm admin-text-secondary">
                      <span className="flex items-center gap-1">
                        <MousePointerClick size={14} /> {product.clicks.toLocaleString()} clicks
                      </span>
                      <Link
                        href={`/blog/${product.blog_post_id}`}
                        className="text-primary hover:underline font-medium truncate"
                      >
                        From: {product.blog_post_title}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* All Posts Analytics Table */}
      <Card className="p-4 sm:p-6 mt-6 md:mt-8 admin-card" sharp="tl">
        <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 md:mb-6 admin-heading">All Posts Analytics</h2>
        {postAnalytics.length === 0 ? (
          <p className="admin-text-secondary font-medium text-sm sm:text-base">No posts with analytics yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-2 font-black uppercase text-xs sm:text-sm admin-heading">Post</th>
                  <th className="text-right py-3 px-2 font-black uppercase text-xs sm:text-sm admin-heading">Views</th>
                  <th className="text-right py-3 px-2 font-black uppercase text-xs sm:text-sm admin-heading">Clicks</th>
                  <th className="text-right py-3 px-2 font-black uppercase text-xs sm:text-sm admin-heading">Conversion</th>
                  <th className="text-left py-3 px-2 font-black uppercase text-xs sm:text-sm admin-heading">Published</th>
                </tr>
              </thead>
              <tbody>
                {postAnalytics.map((post) => (
                  <tr key={post.post_id} className="border-b border-border hover:opacity-80 transition-colors">
                    <td className="py-3 px-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-bold uppercase text-xs sm:text-sm hover:text-primary hover:underline admin-text"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-xs sm:text-sm admin-text-secondary">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-xs sm:text-sm admin-text-secondary">
                      {post.clicks.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-2 font-bold text-xs sm:text-sm text-primary">
                      {post.conversion_rate}%
                    </td>
                    <td className="py-3 px-2 text-xs sm:text-sm admin-text-secondary">
                      {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
