"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Deep dark bg */}
      <div className="absolute inset-0 bg-[#020210]" />
      <div className="absolute inset-0 bg-dot opacity-40" />

      {/* Dual glow orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] orb orb-magenta opacity-30"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] orb orb-blue opacity-25"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top/bottom gradient borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal/40 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-white/60 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Let&apos;s create something great
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Ready to Level Up
            <br />
            <span className="text-gradient">Your Content?</span>
          </h2>

          <p className="text-white/45 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Join 50+ creators and brands who trust Effortless Crew to make their
            content stand out. Let&apos;s talk about your project.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary gradient */}
            <Link
              href="/contact"
              className="relative group flex items-center gap-2.5 px-10 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden w-full sm:w-auto justify-center"
              style={{
                background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
                boxShadow: "0 0 40px rgba(192,38,211,0.4), 0 0 80px rgba(37,99,235,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 btn-shimmer" />
            </Link>

            {/* Secondary glass */}
            <Link
              href="/portfolio"
              className="flex items-center gap-2.5 px-10 py-4 rounded-2xl font-semibold text-white/70 text-base glass border border-white/12 hover:border-white/25 hover:text-white transition-all duration-300 w-full sm:w-auto justify-center"
            >
              View Our Work
              <ArrowRight className="w-4 h-4 opacity-60" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
            {["No contracts", "Fast turnaround", "Unlimited revisions", "Dedicated editor"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/35 text-sm">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #C026D3, #2563EB)" }}
                />
                {item}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
