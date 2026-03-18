import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { formatDateShort } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, insights, and guides on video editing, YouTube growth, and content creation.",
};

export default async function BlogPage() {
  type BlogPreview = {
    id: string; title: string; slug: string; excerpt: string;
    cover_image_url: string | null; author_name: string;
    tags: string[]; reading_time_minutes: number; published_at: string | null;
  };
  let posts: BlogPreview[] | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, author_name, tags, reading_time_minutes, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    posts = data as BlogPreview[];
  } catch {
    // Supabase not configured yet
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="brand" className="mb-4">Resources</Badge>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tips, guides, and insights on video editing, YouTube growth, and
            building a content brand.
          </p>
        </ScrollReveal>

        {posts?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No posts yet — check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-border bg-card hover:border-brand/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
                >
                  {/* Cover */}
                  <div className="aspect-video relative bg-gradient-to-br from-brand/20 to-brand/5 overflow-hidden">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-brand/20">EC</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="brand" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.reading_time_minutes} min read
                      </div>
                      <span>
                        {post.published_at && formatDateShort(post.published_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
