import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    slug: string;
    color: "primary" | "secondary" | "accent";
    featured_image_url?: string | null;
}

interface BlogCardProps {
    post: BlogPost;
    index: number;
}

export const BlogCard = ({ post, index }: BlogCardProps) => {
    // Determine sharp corner based on index for variety
    const corners: ("tl" | "tr" | "bl" | "br")[] = ["tr", "tl", "br", "bl"];
    const sharpCorner = corners[index % 4];

    return (
        <Link href={`/blog/${post.slug}`} className="group relative block hover:no-underline text-inherit hover:text-inherit">
            <Card
                sharp={sharpCorner}
                className="h-full flex flex-col transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000000] cursor-pointer bg-white"
                noShadow
            >
                {/* Featured Image */}
                {post.featured_image_url ? (
                    <div className="relative h-40 sm:h-48 w-full border-b-2 border-border mb-3 md:mb-4 overflow-hidden">
                        <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                ) : (
                    <div className={`h-40 sm:h-48 w-full border-b-2 border-border mb-3 md:mb-4 ${post.color === 'primary' ? 'bg-primary' :
                            post.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
                        } flex items-center justify-center`}>
                        <span className="text-3xl sm:text-4xl">📝</span>
                    </div>
                )}

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider border border-black px-2 py-1 rounded-md">
                            {post.category}
                        </span>
                        <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" size={18} />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight mb-2 md:mb-3">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 font-medium text-sm sm:text-base line-clamp-3 mb-4 md:mb-6 flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="text-xs sm:text-sm font-bold uppercase text-gray-400 group-hover:text-gray-400">
                        Read Article →
                    </div>
                </div>

                {/* Hard Shadow for the card itself (custom handling since we want hover effect) */}
                <div className={`absolute inset-0 border-2 border-black -z-10 translate-x-1 translate-y-1 ${sharpCorner === 'tr' ? 'rounded-[20px] rounded-tr-none' :
                        sharpCorner === 'tl' ? 'rounded-[20px] rounded-tl-none' :
                            sharpCorner === 'br' ? 'rounded-[20px] rounded-br-none' :
                                'rounded-[20px] rounded-bl-none'
                    } bg-black transition-transform group-hover:translate-x-2 group-hover:translate-y-2`}></div>
            </Card>
        </Link>
    );
};
