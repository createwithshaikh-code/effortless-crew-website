import type { Metadata } from "next";
import Link from "next/link";
import { Scissors, Zap, Film, Sparkles, ArrowRight } from "lucide-react";
import type { ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/common/ScrollReveal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Services",
  description: "Professional video editing services — long form, short form, motion graphics, and YouTube automation.",
};

const iconMap: Record<string, ElementType> = {
  Film,
  Zap,
  Sparkles,
  Scissors,
};

const staticServices = [
  {
    icon: Film,
    title: "Long Form Video Editing",
    slug: "long-form-editing",
    tagline: "Cinematic quality, every time",
    description:
      "Full YouTube videos edited to maximize watch time and viewer retention. We handle everything from rough cuts to final color grading and sound design.",
    features: [
      "Custom intro & outro",
      "Professional color grading",
      "Sound design & mixing",
      "Animated titles & transitions",
      "B-roll integration",
      "Thumbnail consultation",
    ],
  },
  {
    icon: Zap,
    title: "Short Form / Reels",
    slug: "short-form",
    tagline: "Built to go viral",
    description:
      "YouTube Shorts, Instagram Reels, and TikToks crafted with algorithm-aware editing. Every cut, caption, and hook is designed to maximize views.",
    features: [
      "Trend-aware hooks",
      "Captions & subtitles",
      "Fast-paced editing",
      "Music & SFX",
      "Platform-optimized format",
      "Thumbnail/cover frame",
    ],
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    slug: "motion-graphics",
    tagline: "Your brand, animated",
    description:
      "Logo animations, brand kits, animated intros/outros, lower thirds, and custom animations that make your content instantly recognizable.",
    features: [
      "Logo animation",
      "Custom intro/outro",
      "Lower thirds",
      "Animated overlays",
      "Title sequences",
      "Brand kit creation",
    ],
  },
  {
    icon: Scissors,
    title: "YouTube Automation",
    slug: "youtube-automation",
    tagline: "Faceless channels, fully managed",
    description:
      "A complete done-for-you pipeline for faceless YouTube channels. From script to published video — we handle everything hands-off.",
    features: [
      "Script writing",
      "AI voiceover",
      "Stock footage editing",
      "SEO-optimized thumbnails",
      "SEO titles & descriptions",
      "Publishing schedule",
    ],
  },
];

type ServiceDisplay = {
  icon: ElementType;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
};

export default async function ServicesPage() {
  let services: ServiceDisplay[] = staticServices;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (data && data.length > 0) {
      services = data.map((svc) => ({
        icon: iconMap[svc.icon_name] ?? Scissors,
        title: svc.title,
        slug: svc.slug,
        tagline: svc.tagline ?? "",
        description: svc.description ?? "",
        features: Array.isArray(svc.features) ? svc.features : [],
      }));
    }
  } catch {
    // Supabase not configured — use static fallback
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="brand" className="mb-4">What We Offer</Badge>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Our Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every service is designed to help you publish more, grow faster, and
            look legendary doing it.
          </p>
        </ScrollReveal>

        <div className="space-y-8">
          {services.map((service, i) => (
            <ScrollReveal key={service.slug} delay={i * 0.1}>
              <div className="group flex flex-col lg:flex-row gap-8 p-8 rounded-2xl border border-border bg-card hover:border-brand/50 transition-all duration-300">
                <div className="lg:w-64 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-brand" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{service.title}</h2>
                  <p className="text-brand text-sm font-medium mb-4">{service.tagline}</p>
                  <Button asChild variant="brand" size="sm">
                    <Link href={`/services/${service.slug}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which service you need?
          </p>
          <Button asChild variant="brand-outline" size="lg">
            <Link href="/contact">Talk to Us</Link>
          </Button>
        </ScrollReveal>
      </div>
    </main>
  );
}
