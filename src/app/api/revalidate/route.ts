import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  // Simple secret check
  if (body.secret && body.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidate all public pages
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/blog");
  revalidatePath("/about");
  revalidatePath("/pricing");

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
