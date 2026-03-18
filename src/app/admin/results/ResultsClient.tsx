"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Save, Loader2, GripVertical, Eye, EyeOff,
  Star, StarOff, ExternalLink, Film, Zap, Sparkles, LayoutGrid,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ResultItem = {
  id: string;
  title: string;
  client_name: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  tags: string[];
  results_json: Record<string, string>;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

type Props = {
  items: ResultItem[];
};

const categoryIcons: Record<string, React.ElementType> = {
  "Long Form": Film,
  "Short Form": Zap,
  "Motion Graphics": Sparkles,
  "YouTube Automation": LayoutGrid,
};

const CATEGORIES = ["Long Form", "Short Form", "Motion Graphics", "YouTube Automation"];

const emptyForm = {
  title: "",
  slug: "",
  client_name: "",
  description: "",
  category: "Long Form",
  thumbnail_url: "",
  video_url: "",
  results: [{ key: "", value: "" }] as { key: string; value: string }[],
  is_featured: true,
  is_published: true,
};

export default function ResultsClient({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (item: ResultItem) => {
    setForm({
      title: item.title,
      slug: item.slug,
      client_name: item.client_name,
      description: item.description,
      category: item.tags[0] ?? "Long Form",
      thumbnail_url: item.thumbnail_url ?? "",
      video_url: item.video_url ?? "",
      results: Object.entries(item.results_json ?? {}).map(([k, v]) => ({ key: k, value: v })),
      is_featured: item.is_featured,
      is_published: item.is_published,
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const results_json = form.results.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      client_name: form.client_name,
      description: form.description,
      thumbnail_url: form.thumbnail_url || null,
      video_url: form.video_url || null,
      tags: [form.category],
      results_json,
      is_featured: form.is_featured,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("portfolio_items").update(payload).eq("id", editingId);
    } else {
      await supabase.from("portfolio_items").insert({
        ...payload,
        sort_order: items.length,
      });
    }

    setSaving(false);
    setDialogOpen(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this result? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("portfolio_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleFeatured = async (item: ResultItem) => {
    setTogglingId(item.id);
    const supabase = createClient();
    await supabase
      .from("portfolio_items")
      .update({ is_featured: !item.is_featured })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => i.id === item.id ? { ...i, is_featured: !i.is_featured } : i)
    );
    setTogglingId(null);
  };

  const togglePublished = async (item: ResultItem) => {
    setTogglingId(item.id);
    const supabase = createClient();
    await supabase
      .from("portfolio_items")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => i.id === item.id ? { ...i, is_published: !i.is_published } : i)
    );
    setTogglingId(null);
  };

  const featuredCount = items.filter((i) => i.is_featured && i.is_published).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Homepage Results</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage the video samples shown in the &quot;Results That Speak&quot; section.
            <span className="ml-2 text-primary font-medium">
              {featuredCount} item{featuredCount !== 1 ? "s" : ""} showing on homepage.
            </span>
          </p>
        </div>
        <Button onClick={openNew} size="sm" className="cursor-pointer" style={{
          background: "linear-gradient(135deg, #C026D3, #2563EB)",
          border: "none",
          color: "white",
        }}>
          <Plus className="w-4 h-4" />
          Add Result
        </Button>
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">How it works:</strong> Items with{" "}
        <span className="text-yellow-400 font-medium">★ Featured</span> + Published will appear on the homepage.
        Toggle <span className="font-medium text-foreground">Featured</span> to show/hide on homepage.
        Use <span className="font-medium text-foreground">Published</span> to show/hide on the Portfolio page.
      </div>

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <LayoutGrid className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">No results yet. Add your first video sample.</p>
          <Button onClick={openNew} variant="outline" size="sm" className="mt-4 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Result
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => {
            const CategoryIcon = categoryIcons[item.tags[0]] ?? Film;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
              >
                {/* Drag handle (visual only) */}
                <GripVertical className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 hidden sm:block" />

                {/* Category icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(192,38,211,0.15), rgba(37,99,235,0.15))" }}>
                  <CategoryIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{item.title}</span>
                    {item.tags[0] && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
                    <span>{item.client_name || "No client"}</span>
                    {Object.entries(item.results_json ?? {}).slice(0, 2).map(([k, v]) => (
                      <span key={k} className="font-medium text-foreground/70">{v} {k}</span>
                    ))}
                    {item.video_url && (
                      <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="w-3 h-3" /> Video
                      </a>
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Featured toggle */}
                  <button
                    onClick={() => toggleFeatured(item)}
                    disabled={togglingId === item.id}
                    title={item.is_featured ? "Remove from homepage" : "Show on homepage"}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      item.is_featured
                        ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                        : "text-muted-foreground/40 hover:text-yellow-400 hover:bg-yellow-500/10"
                    }`}
                  >
                    {item.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                  </button>

                  {/* Published toggle */}
                  <button
                    onClick={() => togglePublished(item)}
                    disabled={togglingId === item.id}
                    title={item.is_published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      item.is_published
                        ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                        : "text-muted-foreground/40 hover:text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(item)}
                    className="cursor-pointer text-xs h-8"
                  >
                    Edit
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Result" : "Add New Result"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Project Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({
                    ...p,
                    title: e.target.value,
                    slug: p.slug || slugify(e.target.value),
                  }))}
                  placeholder="Tech Channel Growth Package"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Client / Channel Name</Label>
                <Input
                  value={form.client_name}
                  onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                  placeholder="TechBrand"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the project and what was done..."
                rows={3}
                className="mt-1.5"
              />
            </div>

            {/* Media */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <h3 className="font-semibold text-sm">Media URLs</h3>
              <div>
                <Label className="text-xs">Video URL (YouTube, Vimeo, or direct MP4)</Label>
                <Input
                  value={form.video_url}
                  onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Thumbnail Image URL</Label>
                <Input
                  value={form.thumbnail_url}
                  onChange={(e) => setForm((p) => ({ ...p, thumbnail_url: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1 font-mono text-xs"
                />
              </div>
            </div>

            {/* Results / Metrics */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Results & Metrics</h3>
                  <p className="text-xs text-muted-foreground">e.g. "Views" → "2.3M", "Growth" → "+340%"</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setForm((p) => ({ ...p, results: [...p.results, { key: "", value: "" }] }))}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
              {form.results.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder="Label (e.g. Views)"
                    value={r.key}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        results: p.results.map((x, j) => j === i ? { ...x, key: e.target.value } : x),
                      }))
                    }
                    className="text-sm"
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
                    className="text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => setForm((p) => ({ ...p, results: p.results.filter((_, j) => j !== i) }))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Visibility */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <h3 className="font-semibold text-sm">Visibility</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="feat" className="cursor-pointer">Show on Homepage</Label>
                  <p className="text-xs text-muted-foreground">Appears in "Results That Speak" section</p>
                </div>
                <Switch
                  id="feat"
                  checked={form.is_featured}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, is_featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pub" className="cursor-pointer">Show on Portfolio Page</Label>
                  <p className="text-xs text-muted-foreground">Published on /portfolio</p>
                </div>
                <Switch
                  id="pub"
                  checked={form.is_published}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))}
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <Label>URL Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className="mt-1.5 font-mono text-xs"
                placeholder="auto-generated-from-title"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex-1 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #C026D3, #2563EB)", border: "none", color: "white" }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {editingId ? "Save Changes" : "Add Result"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
