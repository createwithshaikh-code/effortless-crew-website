"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Video, Users, TrendingUp, Star } from "lucide-react";

const stats = [
  {
    icon: Video,
    value: "1500",
    suffix: "+",
    label: "Projects Done",
    description: "Across all formats & platforms",
    gradient: "from-brand-500 to-brand-700",
    glow: "rgba(192,38,211,0.3)",
    iconBg: "from-brand/20 to-brand/5",
    iconColor: "text-brand-400",
  },
  {
    icon: Users,
    value: "100",
    suffix: "+",
    label: "Happy Clients",
    description: "From solo creators to brands",
    gradient: "from-royal-500 to-royal-700",
    glow: "rgba(37,99,235,0.3)",
    iconBg: "from-royal/20 to-royal/5",
    iconColor: "text-royal-400",
  },
  {
    icon: TrendingUp,
    value: "200",
    suffix: "M+",
    label: "Views Generated",
    description: "Combined across client channels",
    gradient: "from-purple-500 to-purple-700",
    glow: "rgba(139,92,246,0.3)",
    iconBg: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
  },
  {
    icon: Star,
    value: "5.0",
    suffix: "/5",
    label: "Average Rating",
    description: "From our client reviews",
    gradient: "from-brand-500 via-purple-500 to-royal-500",
    glow: "rgba(192,38,211,0.2)",
    iconBg: "from-brand/20 via-purple-500/10 to-royal/5",
    iconColor: "text-brand-300",
  },
];

export default function Stats() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 section-bg-2" />
      <div className="absolute inset-0 bg-dot opacity-50" />

      {/* Background orbs for glass effect to work */}
      <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] orb orb-magenta opacity-30 orb-drift" />
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] orb orb-blue opacity-25 orb-drift-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] orb orb-purple opacity-15" />

      {/* Edge gradient bleeds */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.07}>
              <motion.div
                className="relative group rounded-2xl p-5 lg:p-6 glass-card overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.glow} 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>

                {/* Number */}
                <div className="font-display text-3xl lg:text-4xl font-black text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className={`font-semibold text-sm mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-white/35 text-xs hidden lg:block leading-relaxed">
                  {stat.description}
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-2xl`} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
