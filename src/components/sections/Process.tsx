"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Scissors, Eye, RefreshCw, Rocket } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Brief",
    description: "You share your raw footage, style references, and creative direction. We review and confirm scope.",
    gradient: "from-brand-500 to-purple-600",
    glowColor: "rgba(192,38,211,0.4)",
  },
  {
    icon: Scissors,
    number: "02",
    title: "Edit",
    description: "Our editors get to work — cutting, color grading, sound design, and adding motion elements.",
    gradient: "from-purple-500 to-royal-600",
    glowColor: "rgba(139,92,246,0.4)",
  },
  {
    icon: Eye,
    number: "03",
    title: "Review",
    description: "You get a private preview link. Review on your own time and leave timestamped comments.",
    gradient: "from-royal-500 to-blue-400",
    glowColor: "rgba(37,99,235,0.4)",
  },
  {
    icon: RefreshCw,
    number: "04",
    title: "Revisions",
    description: "We incorporate your feedback. Unlimited revisions until you're 100% satisfied.",
    gradient: "from-blue-500 to-brand-500",
    glowColor: "rgba(59,130,246,0.4)",
  },
  {
    icon: Rocket,
    number: "05",
    title: "Delivery",
    description: "Final files delivered in your preferred format. Ready to upload straight to your platform.",
    gradient: "from-brand-500 to-royal-500",
    glowColor: "rgba(192,38,211,0.4)",
  },
];

export default function Process() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#040416]" />
      <div className="absolute inset-0 bg-dot opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand/20 text-brand-300 text-sm font-semibold mb-5">
            How It Works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            From Footage to{" "}
            <span className="text-gradient">Published</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            A seamless process designed to make your life easier. You focus on
            creating, we handle the rest.
          </p>
        </ScrollReveal>

        {/* Desktop: horizontal timeline */}
        <div ref={containerRef} className="hidden lg:flex items-start gap-0 relative">
          {/* Connecting line base */}
          <div className="absolute top-8 left-[10%] right-[10%] h-px bg-white/8 z-0">
            <motion.div
              className="h-full origin-left"
              style={{ background: "linear-gradient(90deg, #C026D3, #7C3AED, #2563EB)" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex-1 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: i * 0.15 + 0.3 }}
            >
              <div className="flex flex-col items-center text-center px-3">
                {/* Icon circle */}
                <div
                  className="w-16 h-16 rounded-full glass border-2 flex items-center justify-center mb-5 relative"
                  style={{ borderColor: step.glowColor, boxShadow: `0 0 20px ${step.glowColor}` }}
                >
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.gradient} opacity-15 absolute inset-0`} />
                  <step.icon className="w-6 h-6 relative z-10 text-white opacity-80" />
                  <span
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center bg-gradient-to-br ${step.gradient}`}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full glass border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: step.glowColor, boxShadow: `0 0 15px ${step.glowColor}` }}
                  >
                    <step.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-full mt-2 min-h-[40px]"
                      style={{ background: "linear-gradient(to bottom, rgba(192,38,211,0.3), transparent)" }}
                    />
                  )}
                </div>
                <div className="pt-1 pb-6">
                  <div className={`text-xs font-bold mb-1 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.number}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
