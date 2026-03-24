"use client";

import { useState, useEffect } from "react";
import {
  Save, Loader2, Check, Trash2, Plus, Edit2, X, ChevronDown,
  Film, Smartphone, FileText, Bot, Share2, Palette, Megaphone,
  Globe, ShoppingCart, Zap, BarChart3, Youtube, Camera, Music,
  Code, TrendingUp, Users, Star, Target, Wand2, Video, Mail,
  Shield, Search, Layout,
} from "lucide-react";
// Image icon has naming conflict with Next Image - import as ImageIcon
import { Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface HeroService {
  id: string;
  name: string;
  icon_name: string;
  orbit: "inner" | "middle" | "outer";
  angle: number;
  card_title: string;
  card_desc: string;
  card_sub_desc: string;
  card_visual: string;
  card_cta: string;
  card_image_url: string | null;
  card_images: string[] | null;
  sort_order: number;
  is_active: boolean;
}

type ServiceDraft = Omit<HeroService, "id" | "is_active" | "sort_order">;

// ── Icon map ───────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Film, Image: ImageIcon, Smartphone, FileText, Bot, Share2, Palette,
  Megaphone, Globe, ShoppingCart, Zap, BarChart3, Youtube, Camera, Music,
  Code, TrendingUp, Users, Star, Target, Wand2, Video, Mail, Shield,
  Search, Layout,
};

const ICON_OPTIONS = [
  "Film", "Image", "Smartphone", "FileText", "Bot", "Share2",
  "Palette", "Megaphone", "Globe", "ShoppingCart", "Zap", "BarChart3",
  "Youtube", "Camera", "Music", "Code", "TrendingUp", "Users",
  "Star", "Target", "Wand2", "Video", "Mail", "Shield", "Search", "Layout",
];

// ── Default services ───────────────────────────────────────────────────────────

const DEFAULT_SERVICES: Omit<ServiceDraft, "card_title" | "card_desc" | "card_sub_desc" | "card_visual" | "card_cta" | "card_image_url" | "card_images">[] = [
  { name: "YT Automation",     icon_name: "Bot",          orbit: "inner",  angle: 0   },
  { name: "Scriptwriting",     icon_name: "FileText",     orbit: "inner",  angle: 120 },
  { name: "Short-Form Video",  icon_name: "Smartphone",   orbit: "inner",  angle: 240 },
  { name: "Ecommerce Sites",   icon_name: "ShoppingCart", orbit: "middle", angle: 0   },
  { name: "Logo Design",       icon_name: "Palette",      orbit: "middle", angle: 90  },
  { name: "Portfolio Sites",   icon_name: "Globe",        orbit: "middle", angle: 180 },
  { name: "Thumbnails",        icon_name: "Image",        orbit: "middle", angle: 270 },
  { name: "Social Media Mgmt", icon_name: "Share2",       orbit: "outer",  angle: 0   },
  { name: "Trend Research",    icon_name: "BarChart3",    orbit: "outer",  angle: 72  },
  { name: "Ad Production",     icon_name: "Megaphone",    orbit: "outer",  angle: 144 },
  { name: "AI Production",     icon_name: "Zap",          orbit: "outer",  angle: 216 },
  { name: "Video Editing",     icon_name: "Film",         orbit: "outer",  angle: 288 },
];

// ── Migration SQL ──────────────────────────────────────────────────────────────

const MIGRATION_SQL = `-- Run once in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS hero_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  orbit TEXT NOT NULL DEFAULT 'outer',
  angle FLOAT NOT NULL DEFAULT 0,
  card_title TEXT DEFAULT '',
  card_desc TEXT DEFAULT '',
  card_sub_desc TEXT DEFAULT '',
  card_visual TEXT DEFAULT '',
  card_cta TEXT DEFAULT '',
  card_image_url TEXT,
  card_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists, add the column:
ALTER TABLE hero_services
  ADD COLUMN IF NOT EXISTS card_images TEXT[] DEFAULT ARRAY[]::TEXT[];`;

// ── Blank draft ────────────────────────────────────────────────────────────────

function blankDraft(): ServiceDraft {
  return {
    name: "",
    icon_name: "Zap",
    orbit: "outer",
    angle: 0,
    card_title: "",
    card_desc: "",
    card_sub_desc: "",
    card_visual: "",
    card_cta: "",
    card_image_url: null,
    card_images: [],
  };
}

// ── Ring badge ─────────────────────────────────────────────────────────────────

function RingBadge({ orbit }: { orbit: "inner" | "middle" | "outer" }) {
  const cls = {
    inner:  "bg-purple-500/20 text-purple-300 border-purple-500/40",
    middle: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    outer:  "bg-blue-500/20  text-blue-300  border-blue-500/40",
  }[orbit];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cls}`}>
      {orbit}
    </span>
  );
}

// ── Service edit form ──────────────────────────────────────────────────────────

interface ServiceFormProps {
  draft: ServiceDraft;
  onChange: (d: ServiceDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  imageUploading: boolean;
  onImageUpload: (file: File) => void;
  onImageRemove: (index: number) => void;
}

function ServiceForm({
  draft, onChange, onSave, onCancel, saving, imageUploading, onImageUpload, onImageRemove,
}: ServiceFormProps) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-background p-4 space-y-4">
      {/* Name */}
      <div>
        <Label>Service Name</Label>
        <Input
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          placeholder="e.g. Video Editing"
          className="mt-1.5"
        />
      </div>

      {/* Icon picker */}
      <div>
        <Label>Icon</Label>
        <div className="mt-1.5 grid grid-cols-6 sm:grid-cols-8 gap-1.5">
          {ICON_OPTIONS.map((iconName) => {
            const Icon = ICON_MAP[iconName] ?? Zap;
            const active = draft.icon_name === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange({ ...draft, icon_name: iconName })}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  active
                    ? "border-brand/60 bg-brand/10 ring-1 ring-brand/40"
                    : "border-border hover:border-white/20 bg-card"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] leading-tight text-muted-foreground truncate w-full text-center">
                  {iconName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orbit + Angle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Ring</Label>
          <div className="mt-1.5 flex gap-2">
            {(["inner", "middle", "outer"] as const).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => onChange({ ...draft, orbit: o })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  draft.orbit === o
                    ? "border-brand/60 bg-brand/10 text-brand-300"
                    : "border-border text-muted-foreground hover:border-white/20"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Angle (0–359°)</Label>
          <Input
            type="number"
            min={0}
            max={359}
            value={draft.angle}
            onChange={(e) => onChange({ ...draft, angle: Number(e.target.value) })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Card fields */}
      <div>
        <Label>Card Title</Label>
        <Input
          value={draft.card_title}
          onChange={(e) => onChange({ ...draft, card_title: e.target.value })}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Card Description</Label>
        <Textarea
          value={draft.card_desc}
          onChange={(e) => onChange({ ...draft, card_desc: e.target.value })}
          rows={3}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Card Sub-Description</Label>
        <Textarea
          value={draft.card_sub_desc}
          onChange={(e) => onChange({ ...draft, card_sub_desc: e.target.value })}
          rows={2}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Card CTA Text</Label>
        <Input
          value={draft.card_cta}
          onChange={(e) => onChange({ ...draft, card_cta: e.target.value })}
          className="mt-1.5"
        />
      </div>

      {/* Card Images (up to 5) */}
      <div>
        <Label>Card Images <span className="text-muted-foreground font-normal">(up to 5 · pan + crossfade)</span></Label>
        <div className="mt-1.5 space-y-2">
          {(draft.card_images ?? []).length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {(draft.card_images ?? []).map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-border" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onImageRemove(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-destructive/80 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white/60">#{i + 1}</span>
                </div>
              ))}
            </div>
          )}
          {(draft.card_images ?? []).length < 5 ? (
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium transition-colors">
              {imageUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              {imageUploading ? "Uploading…" : "Add Image / GIF"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={imageUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          ) : (
            <p className="text-xs text-muted-foreground">Maximum 5 images reached.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button variant="brand" size="sm" onClick={onSave} disabled={saving} className="cursor-pointer">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel} className="cursor-pointer">
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function HeroAdminPage() {
  // ── Hero text state ──
  const [heroText, setHeroText] = useState({
    hero_headline: "",
    hero_subheadline: "",
    hero_cta_text: "",
    hero_cta_link: "",
  });
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  // ── Services state ──
  const [services, setServices] = useState<HeroService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [sqlOpen, setSqlOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ServiceDraft>(blankDraft());
  const [editSaving, setEditSaving] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<ServiceDraft>(blankDraft());
  const [addSaving, setAddSaving] = useState(false);
  const [addImageUploading, setAddImageUploading] = useState(false);

  const [initializing, setInitializing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Load hero text ──
  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_settings").select("hero_headline,hero_subheadline,hero_cta_text,hero_cta_link").single()
      .then(({ data }) => {
        if (data) {
          setHeroText({
            hero_headline: data.hero_headline ?? "",
            hero_subheadline: data.hero_subheadline ?? "",
            hero_cta_text: data.hero_cta_text ?? "",
            hero_cta_link: data.hero_cta_link ?? "",
          });
        }
        setHeroLoading(false);
      });
  }, []);

  // ── Save hero text ──
  const handleHeroSave = async () => {
    setHeroSaving(true);
    setHeroError(null);
    const supabase = createClient();
    const { count } = await supabase.from("site_settings").select("id", { count: "exact", head: true });
    const payload = {
      hero_headline: heroText.hero_headline,
      hero_subheadline: heroText.hero_subheadline,
      hero_cta_text: heroText.hero_cta_text,
      hero_cta_link: heroText.hero_cta_link,
      updated_at: new Date().toISOString(),
    };
    let err: string | null = null;
    if ((count ?? 0) > 0) {
      const { error } = await supabase.from("site_settings").update(payload).not("id", "is", null);
      if (error) err = error.message;
    } else {
      const { error } = await supabase.from("site_settings").insert(payload);
      if (error) err = error.message;
    }
    setHeroSaving(false);
    if (err) { setHeroError(err); return; }
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2500);
  };

  // ── Load services ──
  const loadServices = async () => {
    setServicesLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "MIGRATION_NEEDED") setMigrationNeeded(true);
      setServicesLoading(false);
      return;
    }
    setServices(data);
    setServicesLoading(false);
  };

  useEffect(() => { loadServices(); }, []);

  // ── Upload helper ──
  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.url as string;
  };

  // ── Edit service ──
  const startEdit = (service: HeroService) => {
    setEditingId(service.id);
    setEditDraft({
      name: service.name,
      icon_name: service.icon_name,
      orbit: service.orbit,
      angle: service.angle,
      card_title: service.card_title,
      card_desc: service.card_desc,
      card_sub_desc: service.card_sub_desc,
      card_visual: service.card_visual,
      card_cta: service.card_cta,
      card_image_url: service.card_image_url,
      card_images: service.card_images ?? [],
    });
  };

  const handleEditImageUpload = async (file: File) => {
    setEditImageUploading(true);
    try {
      const url = await uploadImage(file);
      setEditDraft((d) => ({ ...d, card_images: [...(d.card_images ?? []), url] }));
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setEditImageUploading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    setEditSaving(true);
    const res = await fetch(`/api/admin/services/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    setEditSaving(false);
    if (!res.ok) {
      const data = await res.json();
      alert("Save failed: " + (data.error ?? "Unknown error"));
      return;
    }
    setEditingId(null);
    await loadServices();
  };

  // ── Delete service ──
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert("Delete failed: " + (data.error ?? "Unknown error"));
      return;
    }
    setDeleteConfirm(null);
    await loadServices();
  };

  // ── Add service ──
  const handleAddImageUpload = async (file: File) => {
    setAddImageUploading(true);
    try {
      const url = await uploadImage(file);
      setAddDraft((d) => ({ ...d, card_images: [...(d.card_images ?? []), url] }));
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setAddImageUploading(false);
    }
  };

  const handleAddSave = async () => {
    setAddSaving(true);
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addDraft),
    });
    setAddSaving(false);
    if (!res.ok) {
      const data = await res.json();
      if (data.error === "MIGRATION_NEEDED") { setMigrationNeeded(true); return; }
      alert("Save failed: " + (data.error ?? "Unknown error"));
      return;
    }
    setAddOpen(false);
    setAddDraft(blankDraft());
    await loadServices();
  };

  // ── Initialize defaults ──
  const handleInitialize = async () => {
    setInitializing(true);
    for (const svc of DEFAULT_SERVICES) {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...svc,
          card_title: "",
          card_desc: "",
          card_sub_desc: "",
          card_visual: "",
          card_cta: "",
          card_image_url: null,
          card_images: [],
        }),
      });
    }
    setInitializing(false);
    await loadServices();
  };

  // ── Group by orbit ──
  const grouped = {
    inner:  services.filter((s) => s.orbit === "inner"),
    middle: services.filter((s) => s.orbit === "middle"),
    outer:  services.filter((s) => s.orbit === "outer"),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Hero &amp; Services</h2>
        <p className="text-muted-foreground text-sm">Manage hero text and solar system services.</p>
      </div>

      <Tabs defaultValue="hero-text">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
          <TabsTrigger value="hero-text">Hero Text</TabsTrigger>
          <TabsTrigger value="solar-system">Solar System</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Hero Text ── */}
        <TabsContent value="hero-text" className="space-y-4 mt-6">
          {heroLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-semibold">Hero Section Text</h3>

              {heroError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {heroError}
                </div>
              )}

              <div>
                <Label>Main Headline</Label>
                <Input
                  value={heroText.hero_headline}
                  onChange={(e) => setHeroText((p) => ({ ...p, hero_headline: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Sub Headline</Label>
                <Textarea
                  value={heroText.hero_subheadline}
                  onChange={(e) => setHeroText((p) => ({ ...p, hero_subheadline: e.target.value }))}
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={heroText.hero_cta_text}
                    onChange={(e) => setHeroText((p) => ({ ...p, hero_cta_text: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>CTA Button Link</Label>
                  <Input
                    value={heroText.hero_cta_link}
                    onChange={(e) => setHeroText((p) => ({ ...p, hero_cta_link: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Button
                  variant="brand"
                  onClick={handleHeroSave}
                  disabled={heroSaving}
                  className="cursor-pointer"
                >
                  {heroSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : heroSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {heroSaving ? "Saving…" : heroSaved ? "Saved!" : "Save Hero Text"}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 2: Solar System ── */}
        <TabsContent value="solar-system" className="space-y-4 mt-6">

          {/* Migration notice */}
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setSqlOpen((o) => !o)}
              className="flex items-center justify-between w-full px-4 py-3 text-left cursor-pointer"
            >
              <span className="text-sm font-semibold text-amber-300">SQL Migration Required (run once)</span>
              <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform ${sqlOpen ? "rotate-180" : ""}`} />
            </button>
            {sqlOpen && (
              <div className="px-4 pb-4">
                <p className="text-xs text-amber-200/70 mb-2">Run this once in your Supabase SQL Editor before using this tab:</p>
                <pre className="font-mono bg-black/30 px-3 py-2.5 rounded-lg text-[11px] leading-relaxed whitespace-pre-wrap text-amber-100 overflow-x-auto">
                  {MIGRATION_SQL}
                </pre>
              </div>
            )}
          </div>

          {migrationNeeded && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <strong>Table not found.</strong> Run the SQL migration above, then refresh this page.
            </div>
          )}

          {servicesLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading services…
            </div>
          ) : (
            <>
              {/* Services grouped by ring */}
              {(["inner", "middle", "outer"] as const).map((orbit) => (
                <div key={orbit} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <RingBadge orbit={orbit} />
                    <span className="text-sm font-semibold capitalize">{orbit} Ring</span>
                    <span className="text-xs text-muted-foreground">({grouped[orbit].length})</span>
                  </div>

                  {grouped[orbit].length === 0 && (
                    <p className="text-xs text-muted-foreground">No services in this ring yet.</p>
                  )}

                  {grouped[orbit].map((service) => {
                    const Icon = ICON_MAP[service.icon_name] ?? Zap;
                    const isEditing = editingId === service.id;
                    const isDeleting = deleteConfirm === service.id;

                    return (
                      <div key={service.id} className="rounded-lg border border-border bg-background/50">
                        <div className="flex items-center gap-3 p-3">
                          <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.angle}° · {service.icon_name}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isDeleting ? (
                              <>
                                <span className="text-xs text-destructive font-medium">Delete?</span>
                                <button
                                  onClick={() => handleDelete(service.id)}
                                  className="px-2 py-1 rounded text-xs bg-destructive text-white font-medium cursor-pointer hover:bg-destructive/90"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-1 rounded text-xs border border-border text-muted-foreground cursor-pointer hover:bg-accent"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => isEditing ? setEditingId(null) : startEdit(service)}
                                  className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(service.id)}
                                  className="p-1.5 rounded-lg border border-destructive/40 hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="px-3 pb-3">
                            <ServiceForm
                              draft={editDraft}
                              onChange={setEditDraft}
                              onSave={handleEditSave}
                              onCancel={() => setEditingId(null)}
                              saving={editSaving}
                              imageUploading={editImageUploading}
                              onImageUpload={handleEditImageUpload}
                              onImageRemove={(i) => setEditDraft((d) => {
                                const imgs = [...(d.card_images ?? [])];
                                imgs.splice(i, 1);
                                return { ...d, card_images: imgs };
                              })}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Add new service */}
              <div className="rounded-xl border border-border bg-card p-5">
                <button
                  type="button"
                  onClick={() => { setAddOpen((o) => !o); setAddDraft(blankDraft()); }}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Service
                </button>
                {addOpen && (
                  <ServiceForm
                    draft={addDraft}
                    onChange={setAddDraft}
                    onSave={handleAddSave}
                    onCancel={() => setAddOpen(false)}
                    saving={addSaving}
                    imageUploading={addImageUploading}
                    onImageUpload={handleAddImageUpload}
                    onImageRemove={(i) => setAddDraft((d) => {
                      const imgs = [...(d.card_images ?? [])];
                      imgs.splice(i, 1);
                      return { ...d, card_images: imgs };
                    })}
                  />
                )}
              </div>

              {/* Initialize defaults */}
              {services.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <h3 className="font-semibold">Initialize with Defaults</h3>
                  <p className="text-sm text-muted-foreground">
                    No services yet. Click below to populate with the 12 default services matching the current solar system.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleInitialize}
                    disabled={initializing}
                    className="cursor-pointer"
                  >
                    {initializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {initializing ? "Initializing…" : "Initialize with 12 Default Services"}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
