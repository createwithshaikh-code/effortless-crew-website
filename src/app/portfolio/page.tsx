import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PortfolioGridClient from "./PortfolioGridClient";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View our video editing work — long form, short form, motion graphics, and YouTube automation projects.",
};

export default async function PortfolioPage() {
  let items = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("*, service:services(title, slug)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    items = data;
  } catch {
    // Supabase not configured yet
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="brand" className="mb-4">Our Work</Badge>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            The Portfolio
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real projects, real results. Browse our work and see the kind of
            content we produce for creators and brands.
          </p>
        </ScrollReveal>

        <PortfolioGridClient items={items ?? []} />
      </div>
    </main>
  );
}
