import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortfolioEditor from "../PortfolioEditor";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  return <PortfolioEditor initialData={item} />;
}
