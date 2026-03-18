"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  views: number;
  tags: string[];
  created_at: string;
}

export default function BlogTableClient({ posts }: { posts: Post[] }) {
  const [localPosts, setLocalPosts] = useState(posts);
  const router = useRouter();

  const togglePublish = async (post: Post) => {
    const supabase = createClient();
    const newVal = !post.is_published;
    await supabase
      .from("blog_posts")
      .update({
        is_published: newVal,
        published_at: newVal ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, is_published: newVal, published_at: newVal ? new Date().toISOString() : null }
          : p
      )
    );
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    setLocalPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (localPosts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground mb-4">No blog posts yet</p>
        <Button asChild variant="brand" size="sm">
          <Link href="/admin/blog/new">Create your first post</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Views</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {localPosts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium line-clamp-1">{post.title}</div>
                  <div className="text-muted-foreground text-xs">{post.slug}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant={post.is_published ? "success" : "secondary"}>
                    {post.is_published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  {formatDateShort(post.created_at)}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  {post.views}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublish(post)}
                      title={post.is_published ? "Unpublish" : "Publish"}
                      className="cursor-pointer"
                    >
                      {post.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    {post.is_published && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/${post.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePost(post.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
