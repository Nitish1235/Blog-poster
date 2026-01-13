import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

function getCategoryColorClass(color: string | undefined) {
    if (color === "primary") return "bg-primary";
    if (color === "secondary") return "bg-secondary";
    if (color === "accent") return "bg-accent";
    return "bg-gray-200";
}

async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*)
    `)
    .order("created_at", { ascending: false });
  return data || [];
}

async function deletePost(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase admin-heading">Blog Posts</h1>
        <Link href="/admin/posts/new" className="w-full sm:w-auto">
          <Button variant="primary" sharp="br" className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="p-12 text-center admin-card" sharp="br">
          <p className="font-medium admin-text-secondary mb-4">No posts yet. Create your first post!</p>
          <Link href="/admin/posts/new">
            <Button variant="primary">Create Post</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Card key={post.id} className="p-4 sm:p-6 admin-card" sharp="tr">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-black uppercase break-words admin-text">{post.title}</h3>
                    {post.published ? (
                      <span className="bg-accent border-2 border-border px-2 py-1 text-xs font-bold uppercase rounded self-start sm:self-auto text-black">
                        <Eye size={12} className="inline mr-1" /> Published
                      </span>
                    ) : (
                      <span className="admin-card opacity-75 border-2 border-border px-2 py-1 text-xs font-bold uppercase rounded self-start sm:self-auto admin-text-secondary">
                        <EyeOff size={12} className="inline mr-1" /> Draft
                      </span>
                    )}
                  </div>
                  <p className="admin-text-secondary font-medium mb-2 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm admin-text-secondary">
                    <span className={`${getCategoryColorClass(post.category?.color)} border border-border px-2 py-1 rounded text-xs font-bold text-black`}>
                      {post.category?.name || "Uncategorized"}
                    </span>
                    {post.subcategory && (
                      <span className="admin-card opacity-75 border border-border px-2 py-1 rounded text-xs font-bold admin-text-secondary">
                        {post.subcategory.name}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-4">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                      <Eye size={16} />
                    </Button>
                  </Link>
                  <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <form action={deletePost.bind(null, post.id)} className="flex-1 sm:flex-none">
                    <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto touch-manipulation admin-button">
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
