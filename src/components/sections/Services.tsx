"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, Zap, Film, Sparkles, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";

const services = [
  {
    icon: Film,
    title: "Long Form Editing",
    slug: "long-form-editing",
    tagline: "Cinematic quality, every time",
    description:
      "Full-length YouTube videos, documentaries, and series edited to keep viewers hooked till the last second.",
    features: ["Jump cut optimization", "Color grading", "Sound design", "Custom B-roll"],
    badge: "Most Popular",
    gradient: "from-brand-500 to-purple-600",
    glowColor: "rgba(192,38,211,0.25)",
    borderHover: "hover:border-brand/40",
    taglineColor: "text-brand-400",
    number: "01",
  },
  {
    icon: Zap,
    title: "Short Form / Reels",
    slug: "short-form",
    tagline: "Built to go viral",
    description:
      "Shorts, Reels, and TikToks crafted with fast pacing, trending hooks, and scroll-stopping visuals.",
    features: ["Trend-aware edits", "Caption design", "Hook optimization", "Fast turnaround"],
    badge: null,
    gradient: "from-royal-500 to-blue-400",
    glowColor: "rgba(37,99,235,0.25)",
    borderHover: "hover:border-royal/40",
    taglineColor: "text-royal-400",
    number: "02",
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    slug: "motion-graphics",
    tagline: "Your brand, animated",
    description:
      "Logo animations, intros/outros, lower thirds, and custom animations that make your brand unforgettable.",
    features: ["Brand kits", "Custom animations", "Lower thirds", "Animated titles"],
    badge: null,
    gradient: "from-purple-500 to-brand-500",
    glowColor: "rgba(139,92,246,0.25)",
    borderHover: "hover:border-purple-500/40",
    taglineColor: "text-purple-400",
    number: "03",
  },
  {
    icon: Scissors,
    title: "YouTube Automation",
    slug: "youtube-automation",
    tagline: "Faceless channels, scaled",
    description:
      "Full production pipeline for faceless YouTube channels — scripting to publishing, completely hands-off.",
    features: ["Script writing", "AI voiceover", "Stock footage", "SEO thumbnails"],
    badge: "New",
    gradient: "from-brand-500 via-royal-500 to-purple-500",
    glowColor: "rgba(192,38,211,0.2)",
    borderHover: "hover:border-brand/40",
    taglineColor: "text-brand-400",
    number: "04",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 section-bg-1" />
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Ambient glows — vivid for glassmorphism */}
      <div className="absolute top-1/4 right-[-5%] w-[500px] h-[500px] orb orb-magenta opacity-20 orb-drift" />
      <div className="absolute bottom-1/4 left-[-5%] w-[450px] h-[450px] orb orb-blue opacity-18 orb-drift-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] orb orb-purple opacity-10" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand/20 text-brand-300 text-sm font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Our Services
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Everything Your Content{" "}
            <span className="text-gradient">Needs</span>
          </h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto">
            From raw footage to polished content ready to publish — we handle
            every step of the production process.
          </p>
        </ScrollReveal>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <ScrollReveal key={service.slug} delay={i * 0.08}>
              <Link href={`/services/${service.slug}`}>
                <motion.div
                  className={`relative group flex flex-col p-6 lg:p-8 rounded-2xl glass-card border border-white/8 ${service.borderHover} overflow-hidden cursor-pointer`}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 0% 0%, ${service.glowColor} 0%, transparent 60%)` }}
                  />

                  {/* Number + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <span className={`font-display text-5xl font-black bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>
                      {service.number}
                    </span>
                    {service.badge && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${service.gradient} text-white shadow-lg`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} bg-opacity-15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    style={{ background: `linear-gradient(135deg, ${service.glowColor}, transparent)` }}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-gradient transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className={`text-sm font-semibold ${service.taglineColor} mb-3`}>
                    {service.tagline}
                  </p>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Feature pills */}
                  <ul className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs px-3 py-1.5 rounded-full glass border border-white/8 text-white/50 group-hover:border-white/15 group-hover:text-white/70 transition-all"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className={`mt-auto flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                    Learn more
                    <ArrowRight className={`w-4 h-4 ${service.taglineColor} group-hover:translate-x-1.5 transition-transform`} />
                  </div>

                  {/* Bottom gradient border */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-2xl`} />
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal className="text-center mt-12" delay={0.4}>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium group"
          >
            View all services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
