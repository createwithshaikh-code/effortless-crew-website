"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, ChevronDown, Sparkles, Zap, Star } from "lucide-react";
import HeroBackground, { type HeroBgType } from "@/components/sections/HeroBackground";

export interface HeroBgConfig {
  type: HeroBgType;
  customHtml?: string;
  blur?: boolean;
}

const words = ["We Make", "Creators", "Look Legendary."];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.5 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingBadges = [
  { icon: Zap, text: "500+ Videos", border: "border-brand/20", textColor: "text-brand", x: "-left-4 lg:-left-16", y: "top-24" },
  { icon: Star, text: "4.9/5 Rating", border: "border-royal/20", textColor: "text-royal-300", x: "-right-4 lg:-right-16", y: "top-32" },
  { icon: Sparkles, text: "100M+ Views", border: "border-purple-500/20", textColor: "text-purple-400", x: "-left-4 lg:-left-20", y: "bottom-32" },
];

export default function Hero({ heroBg }: { heroBg?: HeroBgConfig }) {
  const bg = heroBg ?? { type: "orbs" as HeroBgType };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-300">

      {/* Deep background base */}
      <div className="absolute inset-0 section-bg-1" />

      {/* Animated background */}
      <HeroBackground type={bg.type} customHtml={bg.customHtml} blur={bg.blur} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Floating badge cards — desktop only */}
        {floatingBadges.map((badge, i) => (
          <motion.div
            key={badge.text}
            className={`absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl glass border ${badge.border} ${badge.y} ${badge.x}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 1.5 + i * 0.2, duration: 0.5 },
              scale: { delay: 1.5 + i * 0.2, duration: 0.5 },
              y: { delay: 2 + i * 0.2, duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <badge.icon className={`w-3.5 h-3.5 ${badge.textColor}`} />
            <span className={`text-xs font-semibold ${badge.textColor}`}>{badge.text}</span>
          </motion.div>
        ))}

        {/* Pre-headline pill */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border border-brand/25 mb-10 group cursor-default"
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

        {/* Main headline */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6"
          style={{ perspective: "1000px" }}
        >
          {words.map((line, i) => (
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
          className="text-white/55 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="relative group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden w-full sm:w-auto justify-center"
            style={{ background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)", boxShadow: "0 0 30px rgba(192,38,211,0.4), 0 0 60px rgba(37,99,235,0.2)" }}
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
            className="flex items-center gap-3 group cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          >
            <motion.span
              className="w-12 h-12 rounded-full glass border border-white/15 flex items-center justify-center group-hover:border-brand/40 transition-all"
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

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-14"
        >
          {[
            { value: "500+", label: "Videos Edited", color: "text-brand-300" },
            { value: "50+", label: "Happy Clients", color: "text-royal-300" },
            { value: "100M+", label: "Views Generated", color: "text-purple-400" },
            { value: "4.9/5", label: "Client Rating", color: "text-brand-300" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-white/8"
              whileHover={{ scale: 1.05, borderColor: "rgba(192,38,211,0.3)" }}
            >
              <span className={`font-black text-sm ${stat.color}`}>{stat.value}</span>
              <span className="text-white/35 text-xs">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
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
