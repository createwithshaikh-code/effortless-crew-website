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
  inner:  { radius: 200, duration: 22 },
  middle: { radius: 320, duration: 36 },
  outer:  { radius: 445, duration: 52 },
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

/* icon color per orbit */
const iconColor = {
  inner:  "rgba(192,38,211,0.90)",
  middle: "rgba(167,139,250,0.90)",
  outer:  "rgba(96,165,250,0.90)",
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
        // negative delay = already N seconds into the animation at render time
        const delay = -((service.angle / 360) * duration);
        const Icon = service.icon;
        const color = iconColor[service.orbit];

        return (
          <div
            key={service.name}
            /* ── Layer 1: rotates CW around container center ── */
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              animation: `orbit-cw ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              willChange: "transform",
            }}
          >
            {/* ── Layer 2: translateY moves the arm outward to orbit radius ── */}
            <div style={{ transform: `translateY(-${radius}px)` }}>

              {/* ── Layer 3: counter-rotates CCW so the node stays upright ── */}
              <div
                style={{
                  animation: `orbit-ccw ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  willChange: "transform",
                }}
              >
                {/* ── Layer 4: center circle on orbit point, label to the right ── */}
                {/* translate(-19px) = half of 38px circle, so circle center = orbit point */}
                <div style={{ transform: "translate(-19px, -50%)", display: "flex", alignItems: "center", gap: 7 }}>

                  {/* Circle planet */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "rgba(8,8,28,0.82)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: `1.5px solid ${color.replace("0.90", "0.40")}`,
                      boxShadow: `0 0 12px ${color.replace("0.90", "0.16")}, 0 4px 14px rgba(0,0,0,0.6)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      style={{
                        width: 14,
                        height: 14,
                        color,
                        flexShrink: 0,
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Label to the right */}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.72)",
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {service.name}
                  </span>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
