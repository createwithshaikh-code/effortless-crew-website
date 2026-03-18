"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
      setTestimonials(data ?? []);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();

    const data = {
      client_name: editing.client_name ?? "",
      client_title: editing.client_title ?? "",
      client_avatar_url: editing.client_avatar_url ?? null,
      content: editing.content ?? "",
      rating: editing.rating ?? 5,
      youtube_channel_url: editing.youtube_channel_url ?? null,
      video_testimonial_url: editing.video_testimonial_url ?? null,
      is_featured: editing.is_featured ?? false,
      is_published: editing.is_published ?? true,
      sort_order: editing.sort_order ?? 0,
    };

    if (editing.id) {
      await supabase.from("testimonials").update(data).eq("id", editing.id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t))
      );
    } else {
      const { data: inserted } = await supabase
        .from("testimonials")
        .insert(data)
        .select()
        .single();
      if (inserted) setTestimonials((prev) => [...prev, inserted]);
    }

    setSaving(false);
    setEditing(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Testimonials</h2>
          <p className="text-muted-foreground text-sm">{testimonials.length} total</p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={() =>
            setEditing({ rating: 5, is_featured: false, is_published: true, sort_order: 0 })
          }
        >
          <Plus className="w-4 h-4" />
          New Testimonial
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No testimonials yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="font-medium text-sm">{t.client_name}</div>
                  <div className="text-muted-foreground text-xs">{t.client_title}</div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-brand text-brand" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(t)}
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(t.id)}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit Testimonial" : "New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Client Name</Label>
              <Input
                value={editing?.client_name ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, client_name: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Title / Role</Label>
              <Input
                value={editing?.client_title ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, client_title: e.target.value }))
                }
                placeholder="YouTuber, 1.2M Subscribers"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Testimonial Text</Label>
              <Textarea
                value={editing?.content ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, content: e.target.value }))
                }
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rating (1–5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={editing?.rating ?? 5}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      rating: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input
                  value={editing?.client_avatar_url ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      client_avatar_url: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch
                checked={editing?.is_published ?? true}
                onCheckedChange={(v) =>
                  setEditing((p) => ({ ...p, is_published: v }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch
                checked={editing?.is_featured ?? false}
                onCheckedChange={(v) =>
                  setEditing((p) => ({ ...p, is_featured: v }))
                }
              />
            </div>
            <Button
              variant="brand"
              className="w-full"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Testimonial"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
