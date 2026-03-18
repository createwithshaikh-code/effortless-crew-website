"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

interface PortfolioWithService extends Omit<PortfolioItem, "service"> {
  service?: { title: string; slug: string } | null;
}

export default function PortfolioGridClient({
  items,
}: {
  items: PortfolioWithService[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(items.flatMap((item) => item.tags))
  );
  const filters = ["All", ...allTags];

  const filtered =
    activeFilter === "All"
      ? items
      : items.filter((item) => item.tags.includes(activeFilter));

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Portfolio items will appear here once published in the admin panel.
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
              activeFilter === filter
                ? "bg-brand text-white shadow-lg shadow-brand/30"
                : "bg-card border border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/portfolio/${item.slug}`}
                className="group block rounded-2xl overflow-hidden border border-border bg-card hover:border-brand/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-brand/20 to-brand/5 overflow-hidden">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-brand/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-brand fill-brand ml-0.5" />
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {hoveredId === item.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute top-3 left-3 flex gap-2">
                    {item.tags.slice(0, 1).map((tag) => (
                      <Badge key={tag} variant="brand">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs text-muted-foreground mb-1">{item.client_name}</div>
                  <h3 className="font-bold mb-2 group-hover:text-brand transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {item.results_json && Object.keys(item.results_json).length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {Object.entries(item.results_json)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <span className="text-brand font-bold text-sm">{value}</span>
                            <span className="text-muted-foreground text-xs capitalize">{key}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-brand text-sm font-medium group-hover:gap-2.5 transition-all">
                    View Case Study
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
