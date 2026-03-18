import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/common/ScrollReveal";
import BeforeAfterSlider from "@/components/portfolio/BeforeAfterSlider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!item) return {};
  return { title: item.title, description: item.description };
}

export default async function PortfolioCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*, service:services(title, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!item) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <ScrollReveal>
          <Link
            href="/portfolio"
            className="text-muted-foreground hover:text-brand text-sm mb-8 inline-flex items-center gap-1 transition-colors"
          >
            ← Back to Portfolio
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag: string) => (
              <Badge key={tag} variant="brand">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black mb-2">{item.title}</h1>
          <p className="text-muted-foreground mb-8">Client: {item.client_name}</p>
        </ScrollReveal>

        {/* Video or thumbnail */}
        <ScrollReveal>
          {item.video_url ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-card mb-8">
              <iframe
                src={item.video_url}
                className="w-full h-full"
                allowFullScreen
                title={item.title}
              />
            </div>
          ) : item.thumbnail_url ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-card mb-8 relative">
              <Image
                src={item.thumbnail_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          ) : null}
        </ScrollReveal>

        {/* Before/After slider */}
        {item.before_video_url && item.after_video_url && (
          <ScrollReveal className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Before & After</h2>
            <BeforeAfterSlider
              beforeSrc={item.before_video_url}
              afterSrc={item.after_video_url}
            />
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </ScrollReveal>
          </div>

          {/* Results sidebar */}
          {item.results_json && Object.keys(item.results_json).length > 0 && (
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-4">Results</h3>
                <div className="space-y-3">
                  {Object.entries(item.results_json).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-2xl font-black text-brand">
                        {String(value)}
                      </div>
                      <div className="text-muted-foreground text-sm capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild variant="brand" size="lg" className="w-full mt-4">
                <Link href="/contact">
                  Work With Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </ScrollReveal>
          )}
        </div>
      </div>
    </main>
  );
}
