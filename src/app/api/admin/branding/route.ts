import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("logo_url, logo_height, favicon_url")
      .single();

    if (error) {
      // Columns may not exist yet — return defaults silently
      return NextResponse.json({ logo_url: null, logo_height: 48, favicon_url: null });
    }

    return NextResponse.json({
      logo_url: data?.logo_url ?? null,
      logo_height: data?.logo_height ?? 35,
      favicon_url: data?.favicon_url ?? null,
    });
  } catch {
    return NextResponse.json({ logo_url: null, logo_height: 48, favicon_url: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logo_url, logo_height, favicon_url } = body;

    const supabase = adminClient();

    // Check if a row exists
    const { count } = await supabase
      .from("site_settings")
      .select("id", { count: "exact", head: true });

    const brandingData = {
      logo_url: logo_url ?? null,
      logo_height: logo_height ?? 35,
      favicon_url: favicon_url ?? null,
      updated_at: new Date().toISOString(),
    };

    let error;

    if ((count ?? 0) > 0) {
      ({ error } = await supabase
        .from("site_settings")
        .update(brandingData)
        .not("id", "is", null));
    } else {
      ({ error } = await supabase.from("site_settings").insert(brandingData));
    }

    if (error) {
      // Check if it's a missing column error
      if (error.message.includes("column") || error.message.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "MIGRATION_NEEDED",
            message: "Run this SQL in your Supabase SQL Editor first:",
            sql: `ALTER TABLE site_settings\n  ADD COLUMN IF NOT EXISTS logo_url TEXT,\n  ADD COLUMN IF NOT EXISTS logo_height INTEGER DEFAULT 35,\n  ADD COLUMN IF NOT EXISTS favicon_url TEXT;`,
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
