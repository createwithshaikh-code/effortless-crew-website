import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const HERO_DEFAULTS = {
  hero_headline: "WORK LESS.\nGROW FASTER.\nDOMINATE.",
  hero_subheadline:
    "Forget the freelance chaos. Effortless Crew is your reliable, AI-powered solar system of content and design services. Work Less, Grow Faster, and let us supercharge your growth.",
  hero_cta_text: "Claim Your Creative Freedom",
  hero_cta_link: "/contact",
  hero_color_1: "#C026D3",
  hero_color_2: "#2563EB",
};

export async function GET() {
  const supabase = adminClient();
  // select("*") so missing columns return undefined (not an error)
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle();

  return NextResponse.json({
    hero_headline:    (data as Record<string,string> | null)?.hero_headline    || HERO_DEFAULTS.hero_headline,
    hero_subheadline: (data as Record<string,string> | null)?.hero_subheadline || HERO_DEFAULTS.hero_subheadline,
    hero_cta_text:    (data as Record<string,string> | null)?.hero_cta_text    || HERO_DEFAULTS.hero_cta_text,
    hero_cta_link:    (data as Record<string,string> | null)?.hero_cta_link    || HERO_DEFAULTS.hero_cta_link,
    hero_color_1:     (data as Record<string,string> | null)?.hero_color_1     || HERO_DEFAULTS.hero_color_1,
    hero_color_2:     (data as Record<string,string> | null)?.hero_color_2     || HERO_DEFAULTS.hero_color_2,
  });
}

export async function POST(req: NextRequest) {
  const supabase = adminClient();
  const body = await req.json();

  const payload = {
    hero_headline:    body.hero_headline,
    hero_subheadline: body.hero_subheadline,
    hero_cta_text:    body.hero_cta_text,
    hero_cta_link:    body.hero_cta_link,
    hero_color_1:     body.hero_color_1,
    hero_color_2:     body.hero_color_2,
    updated_at: new Date().toISOString(),
  };

  const { count } = await supabase
    .from("site_settings")
    .select("id", { count: "exact", head: true });

  const { error } =
    (count ?? 0) > 0
      ? await supabase.from("site_settings").update(payload).not("id", "is", null)
      : await supabase.from("site_settings").insert(payload);

  if (error) {
    // If color columns don't exist yet, save without them
    if (error.message.includes("hero_color")) {
      const { hero_color_1: _c1, hero_color_2: _c2, ...rest } = payload;
      const { error: e2 } =
        (count ?? 0) > 0
          ? await supabase.from("site_settings").update(rest).not("id", "is", null)
          : await supabase.from("site_settings").insert(rest);
      if (e2) return NextResponse.json({ error: e2.message, colorMigrationNeeded: true }, { status: 500 });
      return NextResponse.json({ success: true, colorMigrationNeeded: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
