import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // Fetch featured portfolio items for "Results That Speak" section
  let dbItems = undefined;
  let heroVideoUrl: string | null = null;
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
      .select("hero_video_url")
      .maybeSingle();
    heroVideoUrl =
      settings?.hero_video_url ??
      process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
      "https://res.cloudinary.com/dtn8imtzw/video/upload/v1773822084/webs_u48gto.mp4";
  } catch {
    // Supabase not configured yet — use static fallback
    heroVideoUrl = "https://res.cloudinary.com/dtn8imtzw/video/upload/v1773822084/webs_u48gto.mp4";
  }

  return (
    <>
      <Hero videoUrl={heroVideoUrl} />
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
