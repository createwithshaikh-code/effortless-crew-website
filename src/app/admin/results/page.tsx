import { createClient } from "@/lib/supabase/server";
import ResultsClient from "./ResultsClient";

export default async function AdminResultsPage() {
  let items: {
    id: string;
    title: string;
    client_name: string;
    slug: string;
    description: string;
    thumbnail_url: string | null;
    video_url: string | null;
    tags: string[];
    results_json: Record<string, string>;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("id, title, client_name, slug, description, thumbnail_url, video_url, tags, results_json, is_featured, is_published, sort_order")
      .order("sort_order", { ascending: true });
    items = (data ?? []) as typeof items;
  } catch {
    // Supabase not configured
  }

  return <ResultsClient items={items} />;
}
