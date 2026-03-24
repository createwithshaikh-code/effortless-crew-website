import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS hero_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  orbit TEXT NOT NULL DEFAULT 'outer',
  angle FLOAT NOT NULL DEFAULT 0,
  card_title TEXT DEFAULT '',
  card_desc TEXT DEFAULT '',
  card_sub_desc TEXT DEFAULT '',
  card_visual TEXT DEFAULT '',
  card_cta TEXT DEFAULT '',
  card_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

export async function GET() {
  const supabase = adminClient();
  const { data, error } = await supabase
    .from("hero_services")
    .select("*")
    .order("orbit")
    .order("sort_order");

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { error: "MIGRATION_NEEDED", sql: CREATE_TABLE_SQL },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = adminClient();
  const body = await req.json();

  const {
    name,
    icon_name,
    orbit,
    angle,
    card_title,
    card_desc,
    card_sub_desc,
    card_visual,
    card_cta,
    card_image_url,
    sort_order,
  } = body;

  const { data, error } = await supabase
    .from("hero_services")
    .insert({
      name,
      icon_name: icon_name ?? "Zap",
      orbit: orbit ?? "outer",
      angle: angle ?? 0,
      card_title: card_title ?? "",
      card_desc: card_desc ?? "",
      card_sub_desc: card_sub_desc ?? "",
      card_visual: card_visual ?? "",
      card_cta: card_cta ?? "",
      card_image_url: card_image_url ?? null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { error: "MIGRATION_NEEDED", sql: CREATE_TABLE_SQL },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
