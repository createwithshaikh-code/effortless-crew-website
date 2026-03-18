"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import LiquidTabs from "@/components/common/LiquidTabs";
import { cn } from "@/lib/utils";

const portfolioItems = [
  {
    id: "1",
    title: "Tech Channel Growth Package",
    client_name: "TechBrand",
    category: "Long Form",
    thumbnail_url: null,
    description: "Monthly editing package for a tech review channel — 8 videos/month with color grading, sound design, and custom animated titles.",
    results: { views: "2.3M", growth: "+340%" },
    tags: ["Long Form", "Tech"],
    gradient: "from-brand-600 to-purple-600",
    accentColor: "#C026D3",
  },
  {
    id: "2",
    title: "Viral Shorts Campaign",
    client_name: "LifestyleCreator",
    category: "Short Form",
    thumbnail_url: null,
    description: "Series of 30 shorts over 3 months, each optimized for the algorithm with trending hooks and scroll-stopping visuals.",
    results: { views: "15M", growth: "+890%" },
    tags: ["Short Form", "Viral"],
    gradient: "from-royal-600 to-blue-400",
    accentColor: "#2563EB",
  },
  {
    id: "3",
    title: "Faceless Finance Channel",
    client_name: "FinanceChannel",
    category: "YouTube Automation",
    thumbnail_url: null,
    description: "Built a faceless finance channel from scratch — scripting, AI voiceover, stock footage editing, and SEO thumbnails.",
    results: { views: "4.5M", subscribers: "85K" },
    tags: ["Automation", "Finance"],
    gradient: "from-purple-600 to-royal-500",
    accentColor: "#7C3AED",
  },
  {
    id: "4",
    title: "Brand Motion Package",
    client_name: "StartupBrand",
    category: "Motion Graphics",
    thumbnail_url: null,
    description: "Full motion branding kit — animated logo, intro/outro, lower thirds, and custom transitions for their video content.",
    results: { deliverables: "12 assets", turnaround: "5 days" },
    tags: ["Motion", "Branding"],
    gradient: "from-brand-500 to-royal-600",
    accentColor: "#C026D3",
  },
];

const categories = ["All", "Long Form", "Short Form", "Motion Graphics", "YouTube Automation"];

// Accent colors to cycle through when using DB data
const accentColors = ["#C026D3", "#2563EB", "#7C3AED", "#C026D3"];
const gradients = [
  "from-brand-600 to-purple-600",
  "from-royal-600 to-blue-400",
  "from-purple-600 to-royal-500",
  "from-brand-500 to-royal-600",
];

type DBItem = {
  id: string;
  title: string;
  client_name: string;
  tags: string[];
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  results_json: Record<string, string> | null;
  slug: string;
};

export default function Portfolio({ dbItems }: { dbItems?: DBItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Merge DB items on top of static placeholders, or use static if no DB items
  const allItems = dbItems && dbItems.length > 0
    ? dbItems.map((item, i) => ({
        ...item,
        category: item.tags[0] ?? "General",
        results: item.results_json ?? {},
        gradient: gradients[i % gradients.length],
        accentColor: accentColors[i % accentColors.length],
      }))
    : portfolioItems;

  const filtered =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.tags.includes(activeCategory));

  return (
    <section id="portfolio" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 section-bg-2" />
      <div className="absolute inset-0 bg-dot opacity-40" />

      {/* Ambient orbs — needed for glassmorphism to be visible */}
      <div className="absolute top-[-5%] right-[10%] w-[450px] h-[450px] orb orb-magenta opacity-25 orb-drift" />
      <div className="absolute bottom-[-5%] left-[5%] w-[400px] h-[400px] orb orb-blue opacity-20 orb-drift-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] orb orb-purple opacity-12" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-royal/20 text-royal-300 text-sm font-semibold mb-5">
            <TrendingUp className="w-3.5 h-3.5" />
            Our Work
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Results That{" "}
            <span className="text-gradient">Speak</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Real projects, real results. Every edit is crafted to maximize watch
            time, retention, and growth.
          </p>
        </ScrollReveal>

        {/* Filter tabs — Liquid Glass */}
        <ScrollReveal className="flex justify-center mb-10" delay={0.1}>
          <LiquidTabs
            tabs={categories.map((c) => ({ label: c, value: c }))}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </ScrollReveal>

        {/* Portfolio grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div
                  className="group relative rounded-2xl overflow-hidden glass-card border border-white/8 cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ borderColor: hoveredId === item.id ? `${item.accentColor}40` : undefined }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {/* Default gradient bg */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20`}
                    />
                    <div className="absolute inset-0 bg-grid opacity-30" />

                    {item.thumbnail_url ? (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${item.accentColor}30, transparent)`,
                            border: `2px solid ${item.accentColor}50`,
                          }}
                          animate={hoveredId === item.id ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Play className="w-6 h-6 ml-0.5" style={{ color: item.accentColor, fill: item.accentColor }} />
                        </motion.div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <AnimatePresence>
                      {hoveredId === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${item.accentColor}20, rgba(0,0,0,0.6))` }}
                        >
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${item.accentColor}, #2563EB)`,
                              boxShadow: `0 0 30px ${item.accentColor}60`,
                            }}
                          >
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${item.accentColor}, #2563EB)` }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-white/30 text-xs mb-1 font-medium">{item.client_name}</div>
                    <h3
                      className="font-display font-bold text-lg text-white mb-2 transition-all duration-300"
                      style={{ color: hoveredId === item.id ? item.accentColor : undefined }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Results */}
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(item.results).map(([key, value]) => (
                        <div key={key} className="flex items-baseline gap-1.5">
                          <span className="font-display font-black text-base" style={{ color: item.accentColor }}>{value}</span>
                          <span className="text-white/30 text-xs capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <ScrollReveal className="text-center mt-12" delay={0.3}>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 group"
            style={{
              background: "linear-gradient(135deg, rgba(192,38,211,0.15), rgba(37,99,235,0.15))",
              border: "1px solid rgba(192,38,211,0.3)",
            }}
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
