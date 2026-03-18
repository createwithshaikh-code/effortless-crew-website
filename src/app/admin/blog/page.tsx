import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import BlogTableClient from "./BlogTableClient";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, published_at, views, tags, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Blog Posts</h2>
          <p className="text-muted-foreground text-sm">{posts?.length ?? 0} total posts</p>
        </div>
        <Button asChild variant="brand" size="sm">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </Button>
      </div>

      <BlogTableClient posts={posts ?? []} />
    </div>
  );
}
