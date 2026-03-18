import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { createClient } from "@/lib/supabase/server";

const staticServices: Record<string, {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  deliverables: string[];
  turnaround: string;
}> = {
  "long-form-editing": {
    title: "Long Form Video Editing",
    tagline: "Cinematic quality, every time",
    description: "Full YouTube videos edited to maximize watch time and viewer retention.",
    longDescription: "Our long form editing service is built for creators who want their videos to look and sound like they were made by a professional production team. We focus on pacing, storytelling, and retention — because a beautifully edited video that people stop watching in the first minute is worthless.",
    features: [
      "Rough cut + final edit",
      "Professional color grading (DaVinci Resolve)",
      "Sound design & audio mixing",
      "Custom animated titles & transitions",
      "B-roll selection & integration",
      "Music licensing consultation",
      "Thumbnail frame selection",
      "Unlimited revisions",
    ],
    deliverables: ["Final edited video (MP4)", "Project files on request", "Thumbnail frame exports"],
    turnaround: "3–5 business days",
  },
  "short-form": {
    title: "Short Form / Reels Editing",
    tagline: "Built to go viral",
    description: "YouTube Shorts, Reels, and TikToks designed with the algorithm in mind.",
    longDescription: "Short form is not just cutting a long video down. It's a completely different craft — every second has to earn its place. We study what's trending, what hooks work, and what keeps people watching past the 3-second mark.",
    features: [
      "Hook-optimized opening (3 sec)",
      "Fast-paced vertical editing",
      "Auto-captions & styled subtitles",
      "Trending sound/music integration",
      "Text overlays & animations",
      "Platform-specific aspect ratios",
      "Thumbnail/cover frame selection",
      "Unlimited revisions",
    ],
    deliverables: ["Vertical video (9:16 MP4)", "Optional horizontal repurpose"],
    turnaround: "24–48 hours",
  },
  "motion-graphics": {
    title: "Motion Graphics",
    tagline: "Your brand, animated",
    description: "Animations, intros, brand kits, and more.",
    longDescription: "Motion graphics are the invisible branding layer that separates amateur channels from professional ones. From a subtle animated logo intro to full custom lower thirds — we make your brand unforgettable.",
    features: [
      "Logo animation (3 variations)",
      "Custom intro/outro (5–10 sec)",
      "Animated lower thirds",
      "Title sequences",
      "Transition packs",
      "Brand color & style guide",
      "Source files included",
      "Unlimited revisions",
    ],
    deliverables: ["MOV files with transparency", "MP4 preview renders", "After Effects source files"],
    turnaround: "5–7 business days",
  },
  "youtube-automation": {
    title: "YouTube Automation",
    tagline: "Faceless channels, fully managed",
    description: "A complete done-for-you pipeline for faceless YouTube channels.",
    longDescription: "YouTube automation is one of the fastest growing ways to build passive income. But it only works if the content is good. We handle the entire production pipeline so you can scale without lifting a finger.",
    features: [
      "Niche & keyword research",
      "Script writing (SEO-optimized)",
      "AI voiceover (11Labs)",
      "Stock footage sourcing & editing",
      "Custom thumbnail design",
      "SEO title & description",
      "Tags & metadata optimization",
      "Upload scheduling (optional)",
    ],
    deliverables: ["Final video (MP4)", "Thumbnail (PNG)", "Video metadata (doc)"],
    turnaround: "5–7 business days per video",
  },
};

type ServiceDetail = {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  deliverables: string[];
  turnaround: string;
};

async function getService(slug: string): Promise<ServiceDetail | null> {
  // Try Supabase first
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (data) {
      return {
        title: data.title,
        tagline: data.tagline ?? "",
        description: data.description ?? "",
        longDescription: data.long_description ?? data.description ?? "",
        features: Array.isArray(data.features) ? data.features : [],
        deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
        turnaround: data.turnaround ?? "",
      };
    }
  } catch {
    // Fall through to static
  }

  // Fall back to static data
  return staticServices[slug] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <ScrollReveal>
          <Link
            href="/services"
            className="text-muted-foreground hover:text-brand text-sm mb-8 inline-flex items-center gap-1 transition-colors"
          >
            ← Back to Services
          </Link>

          <Badge variant="brand" className="mb-4">
            {service.tagline}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black mb-6">
            {service.title}
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed mb-8">
            {service.longDescription}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-6">What&apos;s Included</h2>
              <div className="space-y-3">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-brand" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <div className="space-y-4">
            <ScrollReveal delay={0.1}>
              {service.deliverables.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold mb-3">Deliverables</h3>
                  <ul className="space-y-2">
                    {service.deliverables.map((d) => (
                      <li key={d} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.turnaround && (
                <div className="rounded-xl border border-border bg-card p-5 mt-4">
                  <h3 className="font-semibold mb-1">Turnaround</h3>
                  <p className="text-brand font-bold">{service.turnaround}</p>
                </div>
              )}

              <Button asChild variant="brand" size="lg" className="w-full mt-4">
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
