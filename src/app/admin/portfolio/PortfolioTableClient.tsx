"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  title: string;
  client_name: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  tags: string[];
  created_at: string;
}

export default function PortfolioTableClient({ items }: { items: Item[] }) {
  const [localItems, setLocalItems] = useState(items);

  const toggle = async (id: string, field: "is_featured" | "is_published") => {
    const supabase = createClient();
    const item = localItems.find((i) => i.id === id)!;
    const newVal = !item[field];
    await supabase.from("portfolio_items").update({ [field]: newVal }).eq("id", id);
    setLocalItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: newVal } : i))
    );
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this portfolio item?")) return;
    const supabase = createClient();
    await supabase.from("portfolio_items").delete().eq("id", id);
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (localItems.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground mb-4">No portfolio items yet</p>
        <Button asChild variant="brand" size="sm">
          <Link href="/admin/portfolio/new">Add your first project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Client</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Tags</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {localItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-muted overflow-hidden flex-shrink-0">
                      {item.thumbnail_url ? (
                        <Image
                          src={item.thumbnail_url}
                          alt={item.title}
                          width={48}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand/20" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="flex gap-1 mt-0.5">
                        {item.is_featured && (
                          <span className="text-xs text-brand">Featured</span>
                        )}
                        {!item.is_published && (
                          <span className="text-xs text-muted-foreground">Draft</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {item.client_name}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggle(item.id, "is_featured")}
                      title="Toggle featured"
                      className={cn("cursor-pointer", item.is_featured && "text-brand")}
                    >
                      <Star className={cn("w-4 h-4", item.is_featured && "fill-brand")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggle(item.id, "is_published")}
                      title={item.is_published ? "Unpublish" : "Publish"}
                      className="cursor-pointer"
                    >
                      {item.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/portfolio/${item.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                      className="text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
