"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Check, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StatItem } from "@/types";

const defaultSettings = {
  hero_headline: "We Make Creators Look Legendary.",
  hero_subheadline: "From cinematic long-form edits to viral shorts and stunning motion graphics — we turn raw footage into content that actually converts.",
  hero_reel_url: "",
  hero_cta_text: "Start Your Project",
  hero_cta_link: "/contact",
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
  logo_url: "",
  logo_height: 35,
  favicon_url: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [brandingSaved, setBrandingSaved] = useState(false);
  const [brandingError, setBrandingError] = useState<{ message: string; sql?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const [{ data }, brandingRes] = await Promise.all([
        supabase.from("site_settings").select("*").single(),
        fetch("/api/admin/branding").then((r) => r.json()).catch(() => ({})),
      ]);
      if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
          stats_json: data.stats_json ?? defaultSettings.stats_json,
          social_links: data.social_links ?? defaultSettings.social_links,
          logo_url: brandingRes.logo_url ?? "",
          logo_height: brandingRes.logo_height ?? 48,
          favicon_url: brandingRes.favicon_url ?? "",
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const uploadBrandingFile = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "branding");
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadBrandingFile(file);
      setSettings((p) => ({ ...p, logo_url: url }));
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconUploading(true);
    try {
      const url = await uploadBrandingFile(file);
      setSettings((p) => ({ ...p, favicon_url: url }));
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setFaviconUploading(false);
    }
  };

  const handleBrandingSave = async () => {
    setBrandingSaving(true);
    setBrandingError(null);
    try {
      const res = await fetch("/api/admin/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo_url: settings.logo_url || null,
          logo_height: settings.logo_height,
          favicon_url: settings.favicon_url || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBrandingError({ message: data.message || data.error, sql: data.sql });
      } else {
        setBrandingSaved(true);
        setTimeout(() => setBrandingSaved(false), 2500);
      }
    } catch (err) {
      setBrandingError({ message: String(err) });
    } finally {
      setBrandingSaving(false);
    }
  };

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
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4 mt-6">
          {/* Branding error / migration notice */}
          {brandingError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive space-y-2">
              <p><strong>{brandingError.message}</strong></p>
              {brandingError.sql && (
                <>
                  <p className="text-xs opacity-80">Run this once in your Supabase SQL Editor, then try again:</p>
                  <pre className="font-mono bg-black/20 px-2 py-1.5 rounded text-[11px] leading-relaxed whitespace-pre-wrap text-amber-300">
                    {brandingError.sql}
                  </pre>
                </>
              )}
            </div>
          )}

          {/* Logo upload */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <h3 className="font-semibold">Site Logo</h3>

            {/* Preview */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background border border-border">
              {settings.logo_url ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.logo_url}
                    alt="Logo preview"
                    style={{ height: `${settings.logo_height}px`, width: "auto", maxWidth: 260 }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <ImageIcon className="w-5 h-5" />
                  <span>No logo uploaded yet — using default</span>
                </div>
              )}
              {settings.logo_url && (
                <button
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, logo_url: "" }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-medium transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Upload button */}
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
                {logoUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {logoUploading ? "Uploading…" : "Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1.5">PNG, SVG, or WebP recommended. Transparent background works best.</p>
            </div>

            {/* Height slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Logo Height in Navbar</Label>
                <span className="text-sm font-mono text-muted-foreground">{settings.logo_height}px</span>
              </div>
              <input
                type="range"
                min={28}
                max={120}
                value={settings.logo_height}
                onChange={(e) => setSettings((p) => ({ ...p, logo_height: Number(e.target.value) }))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>28px (small)</span>
                <span>120px (large)</span>
              </div>
            </div>

            {/* Manual URL fallback */}
            <div>
              <Label>Or paste a URL directly</Label>
              <Input
                value={settings.logo_url}
                onChange={(e) => setSettings((p) => ({ ...p, logo_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Favicon upload */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Favicon</h3>

            {/* Preview */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-background border border-border">
              {settings.favicon_url ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.favicon_url} alt="Favicon preview" style={{ width: 32, height: 32 }} />
                  <span className="text-xs text-muted-foreground">32×32 preview</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <ImageIcon className="w-5 h-5" />
                  <span>No favicon uploaded yet</span>
                </div>
              )}
              {settings.favicon_url && (
                <button
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, favicon_url: "" }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-medium transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
                {faviconUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {faviconUploading ? "Uploading…" : "Upload Favicon"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFaviconUpload}
                  disabled={faviconUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1.5">ICO, PNG, or SVG. Recommended size: 32×32 or 64×64.</p>
            </div>

            <div>
              <Label>Or paste a URL directly</Label>
              <Input
                value={settings.favicon_url}
                onChange={(e) => setSettings((p) => ({ ...p, favicon_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>
          </div>

          <Button
            variant="brand"
            onClick={handleBrandingSave}
            disabled={brandingSaving}
            className="cursor-pointer"
          >
            {brandingSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : brandingSaved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {brandingSaving ? "Saving…" : brandingSaved ? "Branding Saved!" : "Save Branding"}
          </Button>
        </TabsContent>

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

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold">CTA Button</h3>
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
            <p className="text-xs text-muted-foreground">
              To manage solar system services, go to{" "}
              <a href="/admin/hero" className="underline">Hero &amp; Services</a>.
            </p>
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
