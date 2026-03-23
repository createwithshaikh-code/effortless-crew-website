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

/* Trail & icon colour per orbit */
const orbitColor = {
  inner:  { r: 192, g: 38,  b: 211 }, // magenta
  middle: { r: 167, g: 139, b: 250 }, // purple
  outer:  { r: 96,  g: 165, b: 250 }, // blue
};

const rgba = (c: { r: number; g: number; b: number }, a: number) =>
  `rgba(${c.r},${c.g},${c.b},${a})`;

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
            "radial-gradient(circle at center, rgba(192,38,211,0.08) 0%, rgba(37,99,235,0.05) 40%, transparent 68%)",
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
            background: i % 2 === 0 ? "rgba(192,38,211,0.45)" : "rgba(37,99,235,0.45)",
            animation: `orbit-particle ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

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
          <span className="font-black text-white text-sm tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
            EC
          </span>
        </div>
      </div>

      {/* ── Per-node comet trail + orbiting node ── */}
      {services.map((service) => {
        const { radius, duration } = orbitConfig[service.orbit];
        const delay = -((service.angle / 360) * duration);
        const Icon = service.icon;
        const col = orbitColor[service.orbit];

        /*
         * Trail logic:
         * The orbit arm always points UP (0°) in local space before rotation.
         * The negative delay starts the animation already rotated to service.angle.
         * Therefore in LOCAL coords, the node is always at 0° (top).
         * A conic-gradient sector from 318°→360° in local coords will always
         * appear immediately BEHIND the node as it orbits. ✓
         */
        const trailGradient = `conic-gradient(
          transparent 0deg,
          transparent 318deg,
          ${rgba(col, 0.0)} 318deg,
          ${rgba(col, 0.25)} 340deg,
          ${rgba(col, 0.55)} 355deg,
          ${rgba(col, 0.70)} 359deg,
          transparent 360deg
        )`;

        /* Ring mask: show only the orbit-border strip, hide fill */
        const ringMask = `radial-gradient(
          transparent ${radius - 6}px,
          black       ${radius - 4}px,
          black       ${radius + 4}px,
          transparent ${radius + 6}px
        )`;

        return (
          <div key={service.name}>

            {/* ── Comet trail arc (same rotation as the node, no counter-rotate) ── */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: radius * 2,
                height: radius * 2,
                top: "50%", left: "50%",
                marginTop: -radius,
                marginLeft: -radius,
                borderRadius: "50%",
                background: trailGradient,
                WebkitMaskImage: ringMask,
                maskImage: ringMask,
                animation: `orbit-cw ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                willChange: "transform",
              }}
            />

            {/* ── Orbiting node ── */}
            <div
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: 0, height: 0,
                animation: `orbit-cw ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                willChange: "transform",
              }}
            >
              {/* translate to radius */}
              <div style={{ transform: `translateY(-${radius}px)` }}>
                {/* counter-rotate so node stays upright */}
                <div
                  style={{
                    animation: `orbit-ccw ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                    willChange: "transform",
                  }}
                >
                  {/* center circle on orbit point, label to right */}
                  <div style={{ transform: "translate(-19px, -50%)", display: "flex", alignItems: "center", gap: 7 }}>

                    {/* Circle */}
                    <div
                      style={{
                        width: 38, height: 38,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "rgba(8,8,28,0.82)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: `1.5px solid ${rgba(col, 0.42)}`,
                        boxShadow: `0 0 12px ${rgba(col, 0.28)}, 0 0 24px ${rgba(col, 0.12)}, 0 4px 14px rgba(0,0,0,0.6)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon style={{ width: 14, height: 14, color: rgba(col, 0.95), display: "block", flexShrink: 0 }} />
                    </div>

                    {/* Label */}
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

          </div>
        );
      })}
    </div>
  );
}
