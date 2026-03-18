"use client";

import { Sparkles } from "lucide-react";

const items = [
  "Video Editing",
  "YouTube Automation",
  "Short Form Content",
  "Motion Graphics",
  "Long Form Editing",
  "Thumbnail Design",
  "Color Grading",
  "Sound Design",
  "VFX & Effects",
  "Brand Content",
];

const separators = ["✦", "◆", "✧", "◇", "✦"];

export default function Ticker() {
  const repeatedItems = [...items, ...items, ...items];

  return (
    <section
      id="ticker"
      className="relative overflow-hidden py-4"
      style={{
        background: "linear-gradient(135deg, #C026D3 0%, #7C3AED 50%, #2563EB 100%)",
        boxShadow: "0 0 40px rgba(192,38,211,0.3), 0 0 80px rgba(37,99,235,0.2)",
      }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 btn-shimmer opacity-40" />

      <div className="flex overflow-hidden">
        {/* First set */}
        <div className="flex items-center gap-0 animate-ticker whitespace-nowrap flex-shrink-0">
          {repeatedItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-4 text-white font-semibold text-sm">
              <Sparkles className="w-3 h-3 text-white/50 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div
          className="flex items-center gap-0 animate-ticker whitespace-nowrap flex-shrink-0"
          aria-hidden
        >
          {repeatedItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-4 text-white font-semibold text-sm">
              <Sparkles className="w-3 h-3 text-white/50 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
