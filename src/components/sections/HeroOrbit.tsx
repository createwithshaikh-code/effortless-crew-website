"use client";

import {
  Film,
  Youtube,
  Smartphone,
  Share2,
  Palette,
  Code2,
  Sparkles,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  name: string;
  icon: LucideIcon;
  orbit: "inner" | "middle" | "outer";
  angle: number;
}

const services: Service[] = [
  { name: "Video Editing",      icon: Film,       orbit: "inner",  angle: 0   },
  { name: "YouTube",            icon: Youtube,    orbit: "inner",  angle: 120 },
  { name: "Short Form",         icon: Smartphone, orbit: "inner",  angle: 240 },
  { name: "Social Media",       icon: Share2,     orbit: "middle", angle: 60  },
  { name: "Logo Design",        icon: Palette,    orbit: "middle", angle: 180 },
  { name: "Web Dev",            icon: Code2,      orbit: "middle", angle: 300 },
  { name: "Motion Graphics",    icon: Sparkles,   orbit: "outer",  angle: 90  },
  { name: "Brand Strategy",     icon: BarChart3,  orbit: "outer",  angle: 270 },
];

const orbitConfig = {
  inner:  { radius: 115, duration: 20 },
  middle: { radius: 180, duration: 35 },
  outer:  { radius: 245, duration: 50 },
};

const particles = [
  { top: "12%", left: "18%", size: 3, delay: 0,  dur: 8  },
  { top: "72%", left: "8%",  size: 2, delay: -2, dur: 11 },
  { top: "28%", left: "82%", size: 3, delay: -4, dur: 9  },
  { top: "82%", left: "76%", size: 2, delay: -1, dur: 13 },
  { top: "48%", left: "4%",  size: 2, delay: -6, dur: 10 },
  { top: "8%",  left: "62%", size: 3, delay: -3, dur: 12 },
  { top: "92%", left: "42%", size: 2, delay: -5, dur: 7  },
  { top: "38%", left: "93%", size: 3, delay: -7, dur: 9  },
  { top: "60%", left: "88%", size: 2, delay: -9, dur: 14 },
];

export default function HeroOrbit() {
  return (
    <div className="relative" style={{ width: 500, height: 500, flexShrink: 0 }}>
      {/* Radial backdrop glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(192,38,211,0.08) 0%, rgba(37,99,235,0.05) 38%, transparent 68%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background:
              i % 2 === 0
                ? "rgba(192,38,211,0.55)"
                : "rgba(37,99,235,0.55)",
            animation: `orbit-particle ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Orbit track rings */}
      {(["inner", "middle", "outer"] as const).map((key) => {
        const { radius } = orbitConfig[key];
        return (
          <div
            key={key}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: "50%",
              left: "50%",
              marginTop: -radius,
              marginLeft: -radius,
              border: "1px dashed rgba(192,38,211,0.14)",
            }}
          />
        );
      })}

      {/* ── Center "Sun" ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Outer ping rings */}
        <div
          className="absolute rounded-full animate-ping"
          style={{
            inset: -8,
            background: "linear-gradient(135deg, rgba(192,38,211,0.25), rgba(37,99,235,0.15))",
            animationDuration: "2.2s",
          }}
        />
        <div
          className="absolute rounded-full animate-ping"
          style={{
            inset: -18,
            background: "linear-gradient(135deg, rgba(192,38,211,0.10), rgba(37,99,235,0.06))",
            animationDuration: "3s",
            animationDelay: "-0.6s",
          }}
        />
        {/* Core */}
        <div
          className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center select-none"
          style={{
            background:
              "linear-gradient(135deg, #C026D3 0%, #7C3AED 50%, #2563EB 100%)",
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
            /* Layer 1: rotates the arm CW around center */
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
            {/* Layer 2: static arm — push outward to orbit radius */}
            <div style={{ transform: `translateY(-${radius}px)` }}>
              {/* Layer 3: counter-rotates so card stays upright */}
              <div
                style={{
                  animation: `orbit-ccw ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                  willChange: "transform",
                }}
              >
                {/* Layer 4: horizontal centering */}
                <div style={{ transform: "translateX(-50%)" }}>
                  <div
                    className="group flex items-center gap-1.5 px-2.5 py-[5px] rounded-full whitespace-nowrap cursor-default
                                transition-transform duration-300 hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow:
                        "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon className="w-[11px] h-[11px] text-brand-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-white/85 leading-none">
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
