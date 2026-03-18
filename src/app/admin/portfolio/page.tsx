import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortfolioTableClient from "./PortfolioTableClient";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("id, title, client_name, thumbnail_url, is_featured, is_published, tags, created_at")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Portfolio</h2>
          <p className="text-muted-foreground text-sm">{items?.length ?? 0} items</p>
        </div>
        <Button asChild variant="brand" size="sm">
          <Link href="/admin/portfolio/new">
            <Plus className="w-4 h-4" />
            New Item
          </Link>
        </Button>
      </div>
      <PortfolioTableClient items={items ?? []} />
    </div>
  );
}
