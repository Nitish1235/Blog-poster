import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { FileText, Tag, FolderTree, Eye, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getAllPostAnalytics } from "@/lib/queries/analytics";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [postsCount, categoriesCount, subcategoriesCount, analytics] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("subcategories").select("id", { count: "exact", head: true }),
    getAllPostAnalytics(),
  ]);

  const publishedPosts = await supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("published", true);

  const totalViews = analytics.reduce((sum, post) => sum + post.views, 0);
  const totalClicks = analytics.reduce((sum, post) => sum + post.clicks, 0);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black uppercase mb-6 md:mb-8 admin-heading">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-6 admin-card" sharp="br">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center">
              <FileText size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-1 admin-text">{postsCount.count || 0}</h3>
          <p className="font-medium admin-text-secondary">Total Posts</p>
        </Card>

        <Card className="p-6 admin-card" sharp="tl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary border-2 border-border rounded-full flex items-center justify-center">
              <Eye size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-1 admin-text">{publishedPosts.count || 0}</h3>
          <p className="font-medium admin-text-secondary">Published Posts</p>
        </Card>

        <Card className="p-6 admin-card" sharp="br">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent border-2 border-border rounded-full flex items-center justify-center">
              <Tag size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-1 admin-text">{categoriesCount.count || 0}</h3>
          <p className="font-medium admin-text-secondary">Categories</p>
        </Card>

        <Card className="p-6 admin-card" sharp="tl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center">
              <FolderTree size={24} className="text-black" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-1 admin-text">{subcategoriesCount.count || 0}</h3>
          <p className="font-medium admin-text-secondary">Subcategories</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Link href="/admin/posts">
          <Card className="p-6 admin-card hover:-translate-y-1 transition-transform cursor-pointer hover:opacity-90" sharp="br">
            <FileText size={32} className="mb-4 text-primary" />
            <h3 className="text-xl font-black uppercase mb-2 admin-text">Manage Posts</h3>
            <p className="font-medium admin-text-secondary">Create, edit, and delete blog posts</p>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="p-6 admin-card hover:-translate-y-1 transition-transform cursor-pointer hover:opacity-90" sharp="tl">
            <Tag size={32} className="mb-4 text-secondary" />
            <h3 className="text-xl font-black uppercase mb-2 admin-text">Manage Categories</h3>
            <p className="font-medium admin-text-secondary">Organize your content by categories</p>
          </Card>
        </Link>

        <Link href="/admin/subcategories">
          <Card className="p-6 admin-card hover:-translate-y-1 transition-transform cursor-pointer hover:opacity-90" sharp="br">
            <FolderTree size={32} className="mb-4 text-accent" />
            <h3 className="text-xl font-black uppercase mb-2 admin-text">Manage Subcategories</h3>
            <p className="font-medium admin-text-secondary">Add subcategories to categories</p>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="p-6 admin-card hover:-translate-y-1 transition-transform cursor-pointer hover:opacity-90" sharp="tl">
            <BarChart3 size={32} className="mb-4 text-primary" />
            <h3 className="text-xl font-black uppercase mb-2 admin-text">Analytics</h3>
            <p className="font-medium admin-text-secondary">
              {totalViews.toLocaleString()} views, {totalClicks.toLocaleString()} clicks
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
