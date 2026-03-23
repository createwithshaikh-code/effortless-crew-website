export const dynamic = "force-dynamic";

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
  let dbItems = undefined;
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
  } catch {
    // Supabase not configured — use defaults
  }

  return (
    <>
      <Hero />
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
