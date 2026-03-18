"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

export default function PortfolioEditor({
  initialData,
}: {
  initialData?: Partial<PortfolioItem>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    client_name: initialData?.client_name ?? "",
    thumbnail_url: initialData?.thumbnail_url ?? "",
    video_url: initialData?.video_url ?? "",
    before_video_url: initialData?.before_video_url ?? "",
    after_video_url: initialData?.after_video_url ?? "",
    description: initialData?.description ?? "",
    tags: initialData?.tags?.join(", ") ?? "",
    is_featured: initialData?.is_featured ?? false,
    is_published: initialData?.is_published ?? false,
    results: Object.entries(initialData?.results_json ?? {}).map(([k, v]) => ({ key: k, value: String(v) })),
  });

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const results_json = form.results.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const data = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      client_name: form.client_name,
      thumbnail_url: form.thumbnail_url || null,
      video_url: form.video_url || null,
      before_video_url: form.before_video_url || null,
      after_video_url: form.after_video_url || null,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_published: form.is_published,
      results_json,
    };

    if (initialData?.id) {
      await supabase.from("portfolio_items").update(data).eq("id", initialData.id);
    } else {
      await supabase.from("portfolio_items").insert({ ...data, sort_order: 0 });
    }

    setSaving(false);
    router.push("/admin/portfolio");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/portfolio">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h2 className="text-xl font-bold">
            {initialData?.id ? "Edit Project" : "New Portfolio Item"}
          </h2>
        </div>
        <Button variant="brand" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>Project Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) }))}
              placeholder="Tech Channel Growth Package"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="mt-1.5 font-mono text-sm"
            />
          </div>
          <div>
            <Label>Client Name</Label>
            <Input
              value={form.client_name}
              onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
              placeholder="TechBrand"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="mt-1.5"
            />
          </div>

          {/* Media URLs */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="font-medium text-sm">Media</h3>
            {[
              { key: "thumbnail_url", label: "Thumbnail URL" },
              { key: "video_url", label: "Main Video URL" },
              { key: "before_video_url", label: "Before Video URL (optional)" },
              { key: "after_video_url", label: "After Video URL (optional)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs">{label}</Label>
                <Input
                  value={(form as unknown as Record<string, string>)[key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Results / Metrics</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForm((p) => ({ ...p, results: [...p.results, { key: "", value: "" }] }))}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>
            {form.results.map((r, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label (e.g. views)"
                  value={r.key}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      results: p.results.map((x, j) => j === i ? { ...x, key: e.target.value } : x),
                    }))
                  }
                />
                <Input
                  placeholder="Value (e.g. 2.3M)"
                  value={r.value}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      results: p.results.map((x, j) => j === i ? { ...x, value: e.target.value } : x),
                    }))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setForm((p) => ({ ...p, results: p.results.filter((_, j) => j !== i) }))}
                  className="text-destructive hover:bg-destructive/10 flex-shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-sm">Publishing</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="pub" className="cursor-pointer">Published</Label>
              <Switch
                id="pub"
                checked={form.is_published}
                onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="feat" className="cursor-pointer">Featured</Label>
              <Switch
                id="feat"
                checked={form.is_featured}
                onCheckedChange={(v) => setForm((p) => ({ ...p, is_featured: v }))}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="Long Form, Tech, Motion"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
