"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
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
  hero_video_url: "",
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
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const upsertData = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .single();

    if (existing) {
      await supabase.from("site_settings").update(upsertData).eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert(upsertData);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Trigger revalidation
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
            <div>
              <Label>Hero Video Background URL</Label>
              <Input
                value={settings.hero_video_url}
                onChange={(e) => setSettings((p) => ({ ...p, hero_video_url: e.target.value }))}
                placeholder="https://res.cloudinary.com/..."
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional video that plays as the hero section background (muted, looped, 30% opacity)
              </p>
            </div>
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
