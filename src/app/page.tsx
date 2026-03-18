import Hero from "@/components/sections/Hero";
import type { HeroBgConfig } from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import { createClient } from "@/lib/supabase/server";
import type { HeroBgType } from "@/components/sections/HeroBackground";

export default async function HomePage() {
  let dbItems = undefined;
  let heroBg: HeroBgConfig = { type: "orbs" };
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("id, title, client_name, tags, description, thumbnail_url, video_url, results_json, slug")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(6);
    if (data && data.length > 0) dbItems = data;

    const { data: settings } = await supabase
      .from("site_settings")
      .select("hero_bg_type, hero_bg_custom_html, hero_bg_blur")
      .maybeSingle();
    if (settings) {
      heroBg = {
        type: (settings.hero_bg_type as HeroBgType) ?? "orbs",
        customHtml: settings.hero_bg_custom_html ?? undefined,
        blur: settings.hero_bg_blur ?? false,
      };
    }
  } catch {
    // Supabase not configured — use default
  }

  return (
    <>
      <Hero heroBg={heroBg} />
      <Ticker />
      <Stats />
      <Services />
      <Portfolio dbItems={dbItems} />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}
