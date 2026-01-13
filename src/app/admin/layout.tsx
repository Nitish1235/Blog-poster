import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogOut, LayoutDashboard, FileText, Tag, FolderTree, BarChart3, Package } from "lucide-react";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen admin-bg">
      <nav className="admin-nav border-b-2 border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
              <Link href="/admin" className="text-lg sm:text-xl font-black uppercase whitespace-nowrap admin-heading">
                Admin Panel
              </Link>
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <LayoutDashboard size={16} className="lg:w-[18px] lg:h-[18px]" /> Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <FileText size={16} className="lg:w-[18px] lg:h-[18px]" /> Posts
                </Link>
                <Link
                  href="/admin/categories"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <Tag size={16} className="lg:w-[18px] lg:h-[18px]" /> Categories
                </Link>
                <Link
                  href="/admin/subcategories"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <FolderTree size={16} className="lg:w-[18px] lg:h-[18px]" /> Subcategories
                </Link>
                <Link
                  href="/admin/product-library"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <Package size={16} className="lg:w-[18px] lg:h-[18px]" /> Products
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-1.5 lg:gap-2 font-bold uppercase text-xs lg:text-sm admin-nav-link transition-colors whitespace-nowrap"
                >
                  <BarChart3 size={16} className="lg:w-[18px] lg:h-[18px]" /> Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="text-xs sm:text-sm font-medium hover:underline hidden sm:inline touch-manipulation admin-link">
                View Site
              </Link>
              <ThemeToggle />
              <form action={handleSignOut}>
                <Button type="submit" variant="outline" size="sm" className="touch-manipulation admin-button">
                  <LogOut size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
