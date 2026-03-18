"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
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
import { slugify } from "@/lib/utils";
import type { Service } from "@/types";

const DEFAULT_SERVICES = [
  {
    title: "Long Form Video Editing",
    slug: "long-form-editing",
    tagline: "Cinematic quality, every time",
    description: "Full YouTube videos edited to maximize watch time and viewer retention. We handle everything from rough cuts to final color grading and sound design.",
    long_description: "Our long form editing service is built for creators who want their videos to look and sound like they were made by a professional production team. We focus on pacing, storytelling, and retention — because a beautifully edited video that people stop watching in the first minute is worthless.",
    icon_name: "Film",
    features: ["Custom intro & outro", "Professional color grading", "Sound design & mixing", "Animated titles & transitions", "B-roll integration", "Thumbnail consultation", "Unlimited revisions"],
    deliverables: ["Final edited video (MP4)", "Project files on request", "Thumbnail frame exports"],
    turnaround: "3–5 business days",
    is_active: true,
    sort_order: 0,
  },
  {
    title: "Short Form / Reels",
    slug: "short-form",
    tagline: "Built to go viral",
    description: "YouTube Shorts, Instagram Reels, and TikToks crafted with algorithm-aware editing. Every cut, caption, and hook is designed to maximize views.",
    long_description: "Short form is not just cutting a long video down. It's a completely different craft — every second has to earn its place. We study what's trending, what hooks work, and what keeps people watching past the 3-second mark.",
    icon_name: "Zap",
    features: ["Trend-aware hooks", "Captions & subtitles", "Fast-paced editing", "Music & SFX", "Platform-optimized format", "Thumbnail/cover frame", "Unlimited revisions"],
    deliverables: ["Vertical video (9:16 MP4)", "Optional horizontal repurpose"],
    turnaround: "24–48 hours",
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Motion Graphics",
    slug: "motion-graphics",
    tagline: "Your brand, animated",
    description: "Logo animations, brand kits, animated intros/outros, lower thirds, and custom animations that make your content instantly recognizable.",
    long_description: "Motion graphics are the invisible branding layer that separates amateur channels from professional ones. From a subtle animated logo intro to full custom lower thirds — we make your brand unforgettable.",
    icon_name: "Sparkles",
    features: ["Logo animation", "Custom intro/outro", "Lower thirds", "Animated overlays", "Title sequences", "Brand kit creation", "Source files included", "Unlimited revisions"],
    deliverables: ["MOV files with transparency", "MP4 preview renders", "After Effects source files"],
    turnaround: "5–7 business days",
    is_active: true,
    sort_order: 2,
  },
  {
    title: "YouTube Automation",
    slug: "youtube-automation",
    tagline: "Faceless channels, fully managed",
    description: "A complete done-for-you pipeline for faceless YouTube channels. From script to published video — we handle everything hands-off.",
    long_description: "YouTube automation is one of the fastest growing ways to build passive income. But it only works if the content is good. We handle the entire production pipeline so you can scale without lifting a finger.",
    icon_name: "Scissors",
    features: ["Script writing", "AI voiceover", "Stock footage editing", "SEO-optimized thumbnails", "SEO titles & descriptions", "Publishing schedule", "Upload scheduling (optional)"],
    deliverables: ["Final video (MP4)", "Thumbnail (PNG)", "Video metadata (doc)"],
    turnaround: "5–7 business days per video",
    is_active: true,
    sort_order: 3,
  },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      setServices(data ?? []);
    };
    load();
  }, []);

  const loadDefaults = async () => {
    setSeeding(true);
    setSeedError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .insert(DEFAULT_SERVICES)
      .select();
    if (error) {
      setSeedError(error.message);
    } else if (data) {
      setServices(data);
    }
    setSeeding(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();

    const data = {
      title: editing.title ?? "",
      slug: editing.slug ?? slugify(editing.title ?? ""),
      tagline: editing.tagline ?? "",
      description: editing.description ?? "",
      icon_name: editing.icon_name ?? "Scissors",
      features: Array.isArray(editing.features) ? editing.features : [],
      cover_image_url: editing.cover_image_url ?? null,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
      long_description: editing.long_description ?? null,
      deliverables: Array.isArray(editing.deliverables) ? editing.deliverables : [],
      turnaround: editing.turnaround ?? null,
    };

    if (editing.id) {
      await supabase.from("services").update(data).eq("id", editing.id);
      setServices((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s))
      );
    } else {
      const { data: inserted } = await supabase
        .from("services")
        .insert(data)
        .select()
        .single();
      if (inserted) setServices((prev) => [...prev, inserted]);
    }

    setSaving(false);
    setEditing(null);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Services</h2>
          <p className="text-muted-foreground text-sm">{services.length} total</p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={() => setEditing({ is_active: true, sort_order: services.length, features: [] })}
        >
          <Plus className="w-4 h-4" />
          New Service
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-muted-foreground text-sm">No services yet.</p>
            <Button
              variant="brand"
              size="sm"
              onClick={loadDefaults}
              disabled={seeding}
            >
              {seeding ? "Loading..." : "Load Default Services"}
            </Button>
            <p className="text-muted-foreground text-xs max-w-xs mx-auto">
              This will pre-fill all 4 default services (Long Form, Short Form, Motion Graphics, YouTube Automation) so you can edit them.
            </p>
            {seedError && (
              <p className="text-destructive text-xs max-w-sm mx-auto bg-destructive/10 rounded-lg px-3 py-2 mt-2">
                Error: {seedError}
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {services.map((service) => (
              <div key={service.id} className="flex items-center gap-4 p-4">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{service.title}</div>
                  <div className="text-muted-foreground text-xs">{service.tagline}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${service.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(service)} className="cursor-pointer">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteService(service.id)}
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
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={editing?.title ?? ""}
                onChange={(e) => setEditing((p) => ({
                  ...p,
                  title: e.target.value,
                  slug: p?.slug || slugify(e.target.value),
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={editing?.slug ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, slug: e.target.value }))}
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={editing?.tagline ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="Short catchy phrase"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editing?.description ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <select
                value={editing?.icon_name ?? "Scissors"}
                onChange={(e) => setEditing((p) => ({ ...p, icon_name: e.target.value }))}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Film">Film (Long Form)</option>
                <option value="Zap">Zap (Short Form)</option>
                <option value="Sparkles">Sparkles (Motion Graphics)</option>
                <option value="Scissors">Scissors (Automation)</option>
              </select>
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={(editing?.features ?? []).join("\n")}
                onChange={(e) =>
                  setEditing((p) => ({
                    ...p,
                    features: e.target.value.split("\n").filter(Boolean),
                  }))
                }
                rows={5}
                placeholder="Color grading&#10;Sound design&#10;..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Long Description (detail page)</Label>
              <Textarea
                value={editing?.long_description ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, long_description: e.target.value }))}
                rows={4}
                placeholder="Detailed description shown on the service detail page..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Deliverables (one per line)</Label>
              <Textarea
                value={(editing?.deliverables ?? []).join("\n")}
                onChange={(e) =>
                  setEditing((p) => ({
                    ...p,
                    deliverables: e.target.value.split("\n").filter(Boolean),
                  }))
                }
                rows={3}
                placeholder="Final edited video (MP4)&#10;Project files on request&#10;..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Turnaround Time</Label>
              <Input
                value={editing?.turnaround ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p, turnaround: e.target.value }))}
                placeholder="e.g. 3–5 business days"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={editing?.is_active ?? true}
                onCheckedChange={(v) => setEditing((p) => ({ ...p, is_active: v }))}
              />
            </div>
            <Button variant="brand" className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
