"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { slugify, calculateReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogEditorProps {
  initialData?: Partial<BlogPost>;
}

export default function BlogEditor({ initialData }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    cover_image_url: initialData?.cover_image_url ?? "",
    author_name: initialData?.author_name ?? "Effortless Crew",
    tags: initialData?.tags?.join(", ") ?? "",
    is_published: initialData?.is_published ?? false,
    seo_title: initialData?.seo_title ?? "",
    seo_description: initialData?.seo_description ?? "",
  });

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  };

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    const supabase = createClient();
    const isPublishing = publish !== undefined ? publish : form.is_published;

    const data = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      author_name: form.author_name,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: isPublishing,
      published_at: isPublishing ? (initialData?.published_at ?? new Date().toISOString()) : null,
      reading_time_minutes: calculateReadingTime(form.content),
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      updated_at: new Date().toISOString(),
    };

    if (initialData?.id) {
      await supabase.from("blog_posts").update(data).eq("id", initialData.id);
    } else {
      await supabase.from("blog_posts").insert({ ...data, views: 0 });
    }

    setSaving(false);
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h2 className="text-xl font-bold">
            {initialData?.id ? "Edit Post" : "New Blog Post"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving && <Loader2 className="w-3 h-3 animate-spin" />}
            Save Draft
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
              className="mt-1.5 text-lg font-semibold"
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="post-slug"
              className="mt-1.5 font-mono text-sm"
            />
          </div>

          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              placeholder="Brief description shown on blog listing..."
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Content</Label>
            <div className="mt-1.5">
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm((p) => ({ ...p, content: html }))}
                placeholder="Write your blog post..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-sm">Publishing</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="published" className="cursor-pointer">Published</Label>
              <Switch
                id="published"
                checked={form.is_published}
                onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))}
              />
            </div>

            <div>
              <Label>Author</Label>
              <Input
                value={form.author_name}
                onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={form.cover_image_url}
                onChange={(e) => setForm((p) => ({ ...p, cover_image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="video editing, youtube, tips"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-sm">SEO Overrides</h3>
            <div>
              <Label>SEO Title</Label>
              <Input
                value={form.seo_title}
                onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
                placeholder="Leave blank to use post title"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>SEO Description</Label>
              <Textarea
                value={form.seo_description}
                onChange={(e) => setForm((p) => ({ ...p, seo_description: e.target.value }))}
                placeholder="Leave blank to use excerpt"
                rows={3}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
