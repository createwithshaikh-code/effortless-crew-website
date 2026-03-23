"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import HeroOrbit from "@/components/sections/HeroOrbit";

/* ── Seeded pseudo-random (sin-based, truly non-uniform) ── */
function sr(seed: number) {
  const x = Math.sin(seed + 1.5) * 73856;
  return x - Math.floor(x);
}

/* Sparse background stars — scattered across full screen */
const BG_STARS = Array.from({ length: 70 }, (_, i) => ({
  top:   `${(sr(i * 4.71 + 1.3)  * 100).toFixed(2)}%`,
  left:  `${(sr(i * 8.93 + 2.7)  * 100).toFixed(2)}%`,
  size:  sr(i * 12.1 + 0.3) > 0.82 ? 2 : 1,
  delay: `${-(sr(i * 6.57 + 3.9) * 5).toFixed(1)}s`,
  dur:   `${(sr(i * 2.83 + 1.1)  * 3 + 1.6).toFixed(1)}s`,
  slow:  i % 5 === 0,
}));

/* Dense stars near the orbit (right 55%, full height) */
const ORBIT_STARS = Array.from({ length: 60 }, (_, i) => ({
  top:   `${(sr(i * 19.3 + 7.1) * 88 + 6).toFixed(2)}%`,
  left:  `${(sr(i * 11.7 + 4.9) * 55 + 45).toFixed(2)}%`,
  size:  1,
  delay: `${-(sr(i * 7.43 + 2.2) * 4).toFixed(1)}s`,
  dur:   `${(sr(i * 3.61 + 0.8) * 2 + 1.4).toFixed(1)}s`,
  slow:  i % 4 === 0,
}));

const ALL_STARS = [...BG_STARS, ...ORBIT_STARS];

/* ── Shooting stars — 1 at a time, 5s apart ── */
const SHOOTING = [
  { top: "8%",  left: "62%", delay: 0,  dur: 15 },
  { top: "3%",  left: "76%", delay: 5,  dur: 15 },
  { top: "12%", left: "88%", delay: 10, dur: 15 },
];

const wordVariant = {
  hidden:  { opacity: 0, y: 60, rotateX: -15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-300">

      {/* Base bg */}
      <div className="absolute inset-0 section-bg-1" />

      {/* Soft radial glow blobs — no animation, zero GPU cost */}
      <div className="absolute top-[-15%] right-[-5%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.10) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* ── Star field ── */}
      {ALL_STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: "white",
            animation: `${s.slow ? "twinkle-slow" : "twinkle"} ${s.dur}s ease-in-out ${s.delay}s infinite`,
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* ── Shooting stars ── */}
      {SHOOTING.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: "1.5px",
            height: "80px",
            background: "linear-gradient(to bottom, transparent, rgba(186,230,253,0.75), white)",
            borderRadius: "999px",
            transformOrigin: "top center",
            animation: `shooting-star ${s.dur}s ease-in ${s.delay}s infinite`,
            animationFillMode: "backwards",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ── Solar orbit — right side, vertically centered, fades left ── */}
      {/* Outer div handles position only (no transform conflict with framer scale) */}
      <div
        className="hidden lg:flex absolute pointer-events-none items-center"
        style={{ right: "-60px", top: 0, bottom: 0 }}
      >
        <motion.div
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.7) 46%, black 56%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.7) 46%, black 56%)",
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroOrbit />
        </motion.div>
      </div>

      {/* ── Main split layout ── */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-4 lg:min-h-screen">

          {/* LEFT: Text */}
          <div className="flex-1 flex flex-col justify-center lg:py-24 lg:pr-8">

            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex self-start items-center gap-2.5 px-5 py-2 rounded-full glass border border-brand/25 mb-8"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-brand"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-brand-300 to-royal-300 bg-clip-text text-transparent">
                Premium Video Editing Agency
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-sparkle" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ perspective: "1000px" }}
            >
              {["We Make", "Creators", "Look Legendary."].map((line, i) => (
                <motion.span key={i} variants={wordVariant} className={`block ${i === 1 ? "text-gradient" : ""}`}>
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-white/55 text-lg max-w-lg mb-10 leading-relaxed"
            >
              From cinematic long-form edits to viral shorts and stunning motion
              graphics — we turn raw footage into content that{" "}
              <span className="text-white/80 font-medium">actually converts.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/contact"
                className="relative group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden w-full sm:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
                  boxShadow: "0 0 30px rgba(192,38,211,0.4), 0 0 60px rgba(37,99,235,0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 btn-shimmer" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, #D946EF 0%, #3B82F6 100%)" }} />
              </Link>

              <button
                className="flex items-center gap-3 group cursor-pointer w-full sm:w-auto"
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              >
                <motion.span
                  className="w-12 h-12 rounded-full glass border border-white/15 flex items-center justify-center group-hover:border-brand/40 transition-all flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 fill-white ml-0.5 text-white" />
                </motion.span>
                <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                  View Our Work
                </span>
              </button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="text-white/25 text-xs tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={() => document.getElementById("ticker")?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
