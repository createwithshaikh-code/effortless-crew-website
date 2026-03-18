"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Check, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StatItem } from "@/types";
import type { HeroBgType } from "@/components/sections/HeroBackground";

const BG_PRESETS: { id: HeroBgType; name: string; gradient: string; emoji: string }[] = [
  { id: "orbs",      name: "Floating Orbs",   gradient: "from-purple-600 via-pink-600 to-blue-700",   emoji: "🔮" },
  { id: "aurora",    name: "Aurora",           gradient: "from-green-500 via-purple-600 to-blue-600",  emoji: "🌌" },
  { id: "stars",     name: "Starfield",        gradient: "from-slate-900 via-indigo-950 to-slate-900", emoji: "✨" },
  { id: "matrix",    name: "Matrix Rain",      gradient: "from-slate-950 via-purple-950 to-blue-950", emoji: "💻" },
  { id: "waves",     name: "Pulse Waves",      gradient: "from-purple-900 via-violet-900 to-purple-900", emoji: "〰️" },
  { id: "nebula",    name: "Nebula",           gradient: "from-indigo-950 via-purple-900 to-blue-950", emoji: "🌠" },
  { id: "mesh",      name: "Color Mesh",       gradient: "from-violet-900 via-indigo-800 to-blue-900", emoji: "🎨" },
  { id: "bokeh",     name: "Bokeh Lights",     gradient: "from-slate-950 via-purple-950 to-slate-950", emoji: "💫" },
  { id: "geometric", name: "Geometric",        gradient: "from-indigo-950 via-blue-950 to-purple-950", emoji: "⬡" },
  { id: "synthwave", name: "Synthwave Grid",   gradient: "from-purple-950 via-pink-950 to-purple-950", emoji: "🌆" },
];

const defaultSettings = {
  hero_headline: "We Make Creators Look Legendary.",
  hero_subheadline: "From cinematic long-form edits to viral shorts and stunning motion graphics — we turn raw footage into content that actually converts.",
  hero_reel_url: "",
  hero_cta_text: "Start Your Project",
  hero_cta_link: "/contact",
  hero_bg_type: "orbs" as HeroBgType,
  hero_bg_custom_html: "",
  hero_bg_blur: false,
  about_headline: "Built by Creators, for Creators",
  about_body: "We're a team of passionate video editors and content strategists who've spent years perfecting the craft of storytelling through video.",
  about_image_url: "",
  stats_json: [
    { label: "Videos Edited", value: "500", suffix: "+" },
    { label: "Happy Clients", value: "50", suffix: "+" },
    { label: "Views Generated", value: "100", suffix: "M+" },
    { label: "Average Rating", value: "4.9", suffix: "/5" },
  ] as StatItem[],
  social_links: { youtube: "", instagram: "", twitter: "", linkedin: "", tiktok: "" },
  seo_title: "Effortless Crew — Premium Video Editing Agency",
  seo_description: "We make creators look legendary. Premium video editing, YouTube automation, motion graphics, and short-form content.",
  seo_og_image_url: "",
  footer_tagline: "Making creators legendary, one frame at a time.",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [bgApplying, setBgApplying] = useState(false);
  const [bgApplied, setBgApplied] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
          stats_json: data.stats_json ?? defaultSettings.stats_json,
          social_links: data.social_links ?? defaultSettings.social_links,
          hero_bg_type: (data.hero_bg_type as HeroBgType) ?? defaultSettings.hero_bg_type,
          hero_bg_custom_html: data.hero_bg_custom_html ?? "",
          hero_bg_blur: data.hero_bg_blur ?? false,
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();

    // Check if a row exists
    const { count } = await supabase
      .from("site_settings")
      .select("id", { count: "exact", head: true });

    const upsertData = {
      hero_headline: settings.hero_headline,
      hero_subheadline: settings.hero_subheadline,
      hero_reel_url: settings.hero_reel_url,
      hero_cta_text: settings.hero_cta_text,
      hero_cta_link: settings.hero_cta_link,
      hero_bg_type: settings.hero_bg_type,
      hero_bg_custom_html: settings.hero_bg_custom_html || null,
      hero_bg_blur: settings.hero_bg_blur,
      about_headline: settings.about_headline,
      about_body: settings.about_body,
      about_image_url: settings.about_image_url,
      stats_json: settings.stats_json,
      social_links: settings.social_links,
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      seo_og_image_url: settings.seo_og_image_url,
      footer_tagline: settings.footer_tagline,
      updated_at: new Date().toISOString(),
    };

    let saveErr: string | null = null;

    if ((count ?? 0) > 0) {
      // Update — no ID needed, just update the only row
      const { error } = await supabase
        .from("site_settings")
        .update(upsertData)
        .not("id", "is", null);
      if (error) saveErr = error.message;
    } else {
      const { error } = await supabase.from("site_settings").insert(upsertData);
      if (error) saveErr = error.message;
    }

    setSaving(false);

    if (saveErr) {
      setSaveError(saveErr);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET }),
      });
    } catch {
      // ignore
    }
  };

  const applyBackground = async () => {
    setBgApplying(true);
    setBgError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_bg_type: settings.hero_bg_type,
        hero_bg_custom_html: settings.hero_bg_custom_html || null,
        hero_bg_blur: settings.hero_bg_blur,
        updated_at: new Date().toISOString(),
      })
      .not("id", "is", null);
    setBgApplying(false);
    if (error) {
      setBgError(error.message);
    } else {
      setBgApplied(true);
      setTimeout(() => setBgApplied(false), 2500);
    }
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      stats_json: prev.stats_json.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addStat = () => {
    setSettings((prev) => ({
      ...prev,
      stats_json: [...prev.stats_json, { label: "", value: "", suffix: "" }],
    }));
  };

  const removeStat = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      stats_json: prev.stats_json.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground text-sm">
            Changes go live immediately after saving.
          </p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {saveError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <strong>Save failed:</strong> {saveError}
          {saveError.includes("column") && (
            <p className="mt-1 text-xs opacity-80">
              Run this SQL in Supabase SQL Editor first:<br />
              <code className="font-mono bg-black/20 px-1 rounded">
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_bg_type TEXT DEFAULT &apos;orbs&apos;, ADD COLUMN IF NOT EXISTS hero_bg_custom_html TEXT, ADD COLUMN IF NOT EXISTS hero_bg_blur BOOLEAN DEFAULT false;
              </code>
            </p>
          )}
        </div>
      )}

      <Tabs defaultValue="hero">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 mt-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Hero Section</h3>
            <div>
              <Label>Main Headline</Label>
              <Input
                value={settings.hero_headline}
                onChange={(e) => setSettings((p) => ({ ...p, hero_headline: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Sub Headline</Label>
              <Textarea
                value={settings.hero_subheadline}
                onChange={(e) => setSettings((p) => ({ ...p, hero_subheadline: e.target.value }))}
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Background Reel Video URL</Label>
              <Input
                value={settings.hero_reel_url}
                onChange={(e) => setSettings((p) => ({ ...p, hero_reel_url: e.target.value }))}
                placeholder="https://res.cloudinary.com/..."
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your reel to Cloudinary and paste the URL here
              </p>
            </div>
          </div>

          {/* Background Animation Picker */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Background Animation</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Select a preset or paste custom HTML/CSS animation code</p>
              </div>
              {/* Blur toggle */}
              <button
                type="button"
                onClick={() => setSettings((p) => ({ ...p, hero_bg_blur: !p.hero_bg_blur }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${settings.hero_bg_blur ? "bg-brand/15 border-brand/40 text-brand-300" : "border-border text-muted-foreground hover:border-border/80"}`}
              >
                {settings.hero_bg_blur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                Blur {settings.hero_bg_blur ? "ON" : "OFF"}
              </button>
            </div>

            {/* 10 preset tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {BG_PRESETS.map((preset) => {
                const active = settings.hero_bg_type === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSettings((p) => ({ ...p, hero_bg_type: preset.id, hero_bg_custom_html: "" }))}
                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${active ? "border-brand/60 bg-brand/10 ring-1 ring-brand/40" : "border-border hover:border-white/20 bg-background/50"}`}
                  >
                    <div className={`w-full h-10 rounded-lg bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-lg`}>
                      {preset.emoji}
                    </div>
                    <span className="text-[11px] font-medium leading-tight text-muted-foreground">{preset.name}</span>
                    {active && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom HTML box */}
            <div className="space-y-2">
              <Label>Custom Animation HTML/CSS</Label>
              <Textarea
                value={settings.hero_bg_custom_html}
                onChange={(e) => setSettings((p) => ({ ...p, hero_bg_custom_html: e.target.value }))}
                placeholder={"<style>/* your keyframes */</style>\n<div class=\"your-animation\"></div>"}
                rows={5}
                className="mt-1.5 font-mono text-xs"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!settings.hero_bg_custom_html.trim()}
                  onClick={() => setSettings((p) => ({ ...p, hero_bg_type: "custom" }))}
                  className="cursor-pointer"
                >
                  Use Custom HTML
                </Button>
                <p className="text-xs text-muted-foreground">Paste HTML + CSS code then click Use Custom HTML, then Apply Background below.</p>
              </div>
            </div>

            {/* Apply button */}
            <div className="pt-2 border-t border-border flex items-center gap-3">
              <Button
                type="button"
                variant="brand"
                onClick={applyBackground}
                disabled={bgApplying}
                className="cursor-pointer"
              >
                {bgApplying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : bgApplied ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {bgApplying ? "Applying..." : bgApplied ? "Applied!" : "Apply Background to Hero"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Currently: <span className="font-medium text-foreground">{settings.hero_bg_type}</span>
                {settings.hero_bg_blur && " · Blur ON"}
              </p>
            </div>
            {bgError && (
              <p className="text-xs text-destructive">{bgError}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Hero Section</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Button Text</Label>
                <Input
                  value={settings.hero_cta_text}
                  onChange={(e) => setSettings((p) => ({ ...p, hero_cta_text: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>CTA Button Link</Label>
                <Input
                  value={settings.hero_cta_link}
                  onChange={(e) => setSettings((p) => ({ ...p, hero_cta_link: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-4 mt-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">About Section</h3>
            <div>
              <Label>Headline</Label>
              <Input
                value={settings.about_headline}
                onChange={(e) => setSettings((p) => ({ ...p, about_headline: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Body Text</Label>
              <Textarea
                value={settings.about_body}
                onChange={(e) => setSettings((p) => ({ ...p, about_body: e.target.value }))}
                rows={5}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>About Image URL</Label>
              <Input
                value={settings.about_image_url}
                onChange={(e) => setSettings((p) => ({ ...p, about_image_url: e.target.value }))}
                placeholder="https://res.cloudinary.com/..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Footer Tagline</Label>
              <Input
                value={settings.footer_tagline}
                onChange={(e) => setSettings((p) => ({ ...p, footer_tagline: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4 mt-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Stats / Counters</h3>
              <Button variant="outline" size="sm" onClick={addStat}>
                <Plus className="w-3.5 h-3.5" />
                Add Stat
              </Button>
            </div>
            {settings.stats_json.map((stat, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="500"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Suffix</Label>
                  <Input
                    value={stat.suffix}
                    onChange={(e) => updateStat(i, "suffix", e.target.value)}
                    placeholder="+"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Videos Edited"
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStat(i)}
                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Social Links</h3>
            {(["youtube", "instagram", "twitter", "linkedin", "tiktok"] as const).map((platform) => (
              <div key={platform}>
                <Label className="capitalize">{platform}</Label>
                <Input
                  value={settings.social_links[platform] ?? ""}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      social_links: { ...p.social_links, [platform]: e.target.value },
                    }))
                  }
                  placeholder={`https://${platform}.com/...`}
                  className="mt-1.5"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Default SEO</h3>
            <div>
              <Label>Meta Title</Label>
              <Input
                value={settings.seo_title}
                onChange={(e) => setSettings((p) => ({ ...p, seo_title: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={settings.seo_description}
                onChange={(e) => setSettings((p) => ({ ...p, seo_description: e.target.value }))}
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input
                value={settings.seo_og_image_url}
                onChange={(e) => setSettings((p) => ({ ...p, seo_og_image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
