"use client";

import {
  Film, Image, Smartphone, FileText,
  Sparkles, Bot, Share2, Palette, Megaphone,
  Globe, ShoppingCart, Video, Zap, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  name: string;
  icon: LucideIcon;
  orbit: "inner" | "middle" | "outer";
  angle: number;
}

const services: Service[] = [
  /* ── Inner orbit ── */
  { name: "Video Editing",    icon: Film,         orbit: "inner",  angle: 0   },
  { name: "Thumbnails",       icon: Image,        orbit: "inner",  angle: 90  },
  { name: "Short-Form",       icon: Smartphone,   orbit: "inner",  angle: 180 },
  { name: "Scripts & Copy",   icon: FileText,     orbit: "inner",  angle: 270 },

  /* ── Middle orbit ── */
  { name: "Motion Graphics",  icon: Sparkles,     orbit: "middle", angle: 0   },
  { name: "YT Automation",    icon: Bot,          orbit: "middle", angle: 72  },
  { name: "Social Media",     icon: Share2,       orbit: "middle", angle: 144 },
  { name: "Logo Design",      icon: Palette,      orbit: "middle", angle: 216 },
  { name: "Ads & Marketing",  icon: Megaphone,    orbit: "middle", angle: 288 },

  /* ── Outer orbit ── */
  { name: "Web Design",       icon: Globe,        orbit: "outer",  angle: 36  },
  { name: "Ecommerce Sites",  icon: ShoppingCart, orbit: "outer",  angle: 108 },
  { name: "Faceless Videos",  icon: Video,        orbit: "outer",  angle: 180 },
  { name: "AI Production",    icon: Zap,          orbit: "outer",  angle: 252 },
  { name: "Brand Strategy",   icon: BarChart3,    orbit: "outer",  angle: 324 },
];

const orbitConfig = {
  inner:  { radius: 200, duration: 20 },
  middle: { radius: 320, duration: 35 },
  outer:  { radius: 445, duration: 50 },
};

const ringStyle = {
  inner: {
    border: "1px solid rgba(192,38,211,0.35)",
    boxShadow: "0 0 18px rgba(192,38,211,0.10), inset 0 0 18px rgba(192,38,211,0.05)",
  },
  middle: {
    border: "1px solid rgba(124,58,237,0.30)",
    boxShadow: "0 0 22px rgba(124,58,237,0.09), inset 0 0 22px rgba(124,58,237,0.04)",
  },
  outer: {
    border: "1px solid rgba(37,99,235,0.28)",
    boxShadow: "0 0 28px rgba(37,99,235,0.08), inset 0 0 28px rgba(37,99,235,0.03)",
  },
};

const particles = [
  { top: "14%", left: "22%", size: 2, delay: 0,  dur: 9  },
  { top: "74%", left: "12%", size: 2, delay: -3, dur: 12 },
  { top: "32%", left: "78%", size: 2, delay: -5, dur: 8  },
  { top: "80%", left: "72%", size: 2, delay: -2, dur: 11 },
  { top: "50%", left: "6%",  size: 2, delay: -7, dur: 10 },
  { top: "10%", left: "60%", size: 2, delay: -4, dur: 13 },
  { top: "88%", left: "44%", size: 2, delay: -6, dur: 8  },
  { top: "42%", left: "92%", size: 2, delay: -1, dur: 10 },
];

export default function HeroOrbit() {
  return (
    <div className="relative" style={{ width: 1000, height: 1000, flexShrink: 0 }}>

      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(192,38,211,0.09) 0%, rgba(37,99,235,0.06) 40%, transparent 68%)",
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top, left: p.left,
            width: p.size, height: p.size,
            background: i % 2 === 0 ? "rgba(192,38,211,0.50)" : "rgba(37,99,235,0.50)",
            animation: `orbit-particle ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ── Orbit track rings ── */}
      {(["inner", "middle", "outer"] as const).map((key) => {
        const { radius } = orbitConfig[key];
        return (
          <div
            key={key}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: "50%", left: "50%",
              marginTop: -radius,
              marginLeft: -radius,
              ...ringStyle[key],
            }}
          />
        );
      })}

      {/* ── Center EC Sun ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="absolute rounded-full animate-ping"
          style={{
            inset: -10,
            background: "linear-gradient(135deg, rgba(192,38,211,0.22), rgba(37,99,235,0.14))",
            animationDuration: "2.4s",
          }}
        />
        <div
          className="absolute rounded-full animate-ping"
          style={{
            inset: -22,
            background: "linear-gradient(135deg, rgba(192,38,211,0.09), rgba(37,99,235,0.06))",
            animationDuration: "3.2s",
            animationDelay: "-0.7s",
          }}
        />
        <div
          className="relative rounded-full flex items-center justify-center select-none"
          style={{
            width: 84, height: 84,
            background: "linear-gradient(135deg, #C026D3 0%, #7C3AED 50%, #2563EB 100%)",
            animation: "sun-pulse 3s ease-in-out infinite",
            willChange: "box-shadow",
          }}
        >
          <span
            className="font-black text-white text-sm tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            EC
          </span>
        </div>
      </div>

      {/* ── Orbiting service nodes ── */}
      {services.map((service) => {
        const { radius, duration } = orbitConfig[service.orbit];
        const delay = -((service.angle / 360) * duration);
        const Icon = service.icon;

        return (
          <div
            key={service.name}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              width: 0, height: 0,
              animation: `orbit-cw ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              willChange: "transform",
            }}
          >
            <div style={{ transform: `translateY(-${radius}px)` }}>
              <div
                style={{
                  animation: `orbit-ccw ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  willChange: "transform",
                }}
              >
                <div style={{ transform: "translateX(-50%)" }}>
                  <div
                    className="flex items-center gap-1.5 px-2.5 rounded-full whitespace-nowrap
                                transition-transform duration-300 hover:scale-110 cursor-default"
                    style={{
                      height: "28px",
                      background: "rgba(10,10,30,0.65)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(192,38,211,0.30)",
                      boxShadow:
                        "0 0 12px rgba(192,38,211,0.15), 0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon
                      style={{ width: 12, height: 12, flexShrink: 0 }}
                      className="text-brand-400"
                    />
                    <span className="text-[11px] font-semibold text-white/90 leading-none">
                      {service.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
