"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = { label: string; value: string };

export default function LiquidTabs({
  tabs,
  active,
  onChange,
  className,
  size = "md",
}: {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const movePill = useCallback((value: string) => {
    const el = tabRefs.current[value];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setPillStyle({ left: eRect.left - cRect.left, width: eRect.width, opacity: 1 });
  }, []);

  useEffect(() => {
    // slight delay to let DOM settle after mount
    const t = setTimeout(() => movePill(active), 50);
    return () => clearTimeout(t);
  }, [active, movePill]);

  const padX = size === "sm" ? "px-3 py-1.5" : size === "lg" ? "px-6 py-3" : "px-4 py-2";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex items-center p-1 rounded-2xl",
        "bg-white/5 border border-white/10",
        "backdrop-blur-md",
        className
      )}
    >
      {/* Liquid glass pill */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(192,38,211,0.35) 0%, rgba(37,99,235,0.28) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 4px 24px rgba(192,38,211,0.25), 0 0 40px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
        animate={{ left: pillStyle.left, width: pillStyle.width, opacity: pillStyle.opacity }}
        transition={{ type: "spring", stiffness: 550, damping: 38, mass: 0.7 }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.value}
          ref={(el) => { tabRefs.current[tab.value] = el; }}
          onMouseEnter={() => movePill(tab.value)}
          onMouseLeave={() => movePill(active)}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative z-10 rounded-xl font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap",
            padX,
            textSize,
            active === tab.value ? "text-white" : "text-white/45 hover:text-white/75"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
