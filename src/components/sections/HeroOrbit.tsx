"use client";

import NextImage from "next/image";
import {
  Film, Image, Smartphone, FileText,
  Bot, Share2, Palette, Megaphone,
  Globe, ShoppingCart, Zap, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  name: string;
  icon: LucideIcon;
  orbit: "inner" | "middle" | "outer";
  angle: number;
}

interface HeroOrbitProps {
  onServiceClick?: (service: Service, nodeEl: HTMLElement) => void;
  paused?: boolean;
}

const services: Service[] = [
  { name: "YT Automation",    icon: Bot,          orbit: "inner",  angle: 0   },
  { name: "Scriptwriting",    icon: FileText,     orbit: "inner",  angle: 120 },
  { name: "Short-Form Video", icon: Smartphone,   orbit: "inner",  angle: 240 },
  { name: "Ecommerce Sites",  icon: ShoppingCart, orbit: "middle", angle: 0   },
  { name: "Logo Design",      icon: Palette,      orbit: "middle", angle: 90  },
  { name: "Portfolio Sites",  icon: Globe,        orbit: "middle", angle: 180 },
  { name: "Thumbnails",       icon: Image,        orbit: "middle", angle: 270 },
  { name: "Social Media Mgmt", icon: Share2,    orbit: "outer", angle: 0   },
  { name: "Trend Research",    icon: BarChart3, orbit: "outer", angle: 72  },
  { name: "Ad Production",     icon: Megaphone, orbit: "outer", angle: 144 },
  { name: "AI Production",     icon: Zap,       orbit: "outer", angle: 216 },
  { name: "Video Editing",     icon: Film,      orbit: "outer", angle: 288 },
];

const orbitConfig = {
  inner:  { radius: 200, duration: 22 },
  middle: { radius: 320, duration: 36 },
  outer:  { radius: 445, duration: 52 },
};

const orbitColor = {
  inner:  { r: 192, g: 38,  b: 211 },
  middle: { r: 167, g: 139, b: 250 },
  outer:  { r: 96,  g: 165, b: 250 },
};

const rgba = (c: { r: number; g: number; b: number }, a: number) =>
  `rgba(${c.r},${c.g},${c.b},${a})`;

const ringStyle = {
  inner: {
    border: "1px solid rgba(192,38,211,0.30)",
    boxShadow: "0 0 16px rgba(192,38,211,0.09), inset 0 0 16px rgba(192,38,211,0.04)",
  },
  middle: {
    border: "1px solid rgba(124,58,237,0.24)",
    boxShadow: "0 0 20px rgba(124,58,237,0.07), inset 0 0 20px rgba(124,58,237,0.03)",
  },
  outer: {
    border: "1px solid rgba(37,99,235,0.22)",
    boxShadow: "0 0 24px rgba(37,99,235,0.06), inset 0 0 24px rgba(37,99,235,0.03)",
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

export default function HeroOrbit({ onServiceClick, paused = false }: HeroOrbitProps) {
  return (
    <div
      className={`relative pointer-events-none${paused ? " orbits-paused" : ""}`}
      style={{ width: 1000, height: 1000, flexShrink: 0 }}
    >
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(192,38,211,0.08) 0%, rgba(37,99,235,0.05) 40%, transparent 68%)",
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top, left: p.left,
            width: p.size, height: p.size,
            background: i % 2 === 0 ? "rgba(192,38,211,0.45)" : "rgba(37,99,235,0.45)",
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
            className="absolute rounded-full"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: "50%",
              left: "50%",
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
          className="relative rounded-full flex items-center justify-center select-none overflow-hidden"
          style={{
            width: 84, height: 84,
            background: "linear-gradient(135deg, rgba(10,4,22,0.95) 0%, rgba(20,8,40,0.95) 100%)",
            border: "1.5px solid rgba(192,38,211,0.35)",
            animation: "sun-pulse 3s ease-in-out infinite",
            willChange: "box-shadow",
          }}
        >
          <NextImage src="/logo.png" alt="EC" width={60} height={60} className="object-contain" />
        </div>
      </div>

      {/* ── Per-node ghost trail + orbiting node ── */}
      {services.map((service) => {
        const { radius, duration } = orbitConfig[service.orbit];
        const delay = -((service.angle / 360) * duration);
        const Icon = service.icon;
        const col = orbitColor[service.orbit];

        const ghosts = [
          { delta: duration * 0.025, size: 28, alpha: 0.55 },
          { delta: duration * 0.055, size: 20, alpha: 0.30 },
          { delta: duration * 0.095, size: 13, alpha: 0.14 },
        ];

        return (
          <div key={service.name}>
            {/* Ghost trail circles */}
            {ghosts.map((g, gi) => (
              <div
                key={gi}
                className="absolute"
                style={{
                  top: "50%", left: "50%",
                  width: 0, height: 0,
                  animation: `orbit-cw ${duration}s linear infinite`,
                  animationDelay: `${delay + g.delta}s`,
                  willChange: "transform",
                }}
              >
                <div style={{ transform: `translateY(-${radius}px)` }}>
                  <div
                    style={{
                      width: g.size,
                      height: g.size,
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                      background: rgba(col, g.alpha * 0.35),
                      boxShadow: `0 0 ${Math.round(g.size * 0.7)}px ${rgba(col, g.alpha)}, 0 0 ${Math.round(g.size * 1.4)}px ${rgba(col, g.alpha * 0.5)}`,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* ── Main orbiting node ── */}
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
              <div style={{ transform: `translateY(-${radius}px)` }}>
                <div
                  style={{
                    animation: `orbit-ccw ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                    willChange: "transform",
                  }}
                >
                  {/*
                   * 38×38 layout anchor — translate(-50%,-50%) centers node on orbit point.
                   * Hover class "orbit-node" enables CSS glow/scale on the inner circle.
                   * Enlarged hit area (inset -13px = ~64px zone) for easy clicking.
                   */}
                  <div
                    className="orbit-node"
                    style={{
                      position: "relative",
                      width: 38,
                      height: 38,
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "auto",
                      /* CSS vars used by .orbit-node:hover in globals.css */
                      "--node-glow-hi": rgba(col, 0.72),
                      "--node-glow-lo": rgba(col, 0.28),
                    } as React.CSSProperties}
                  >
                    {/* Enlarged invisible hit area — 64×64 centered over the 38×38 circle */}
                    <div
                      style={{
                        position: "absolute",
                        inset: -13,
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const wrapper = e.currentTarget.parentElement;
                        if (wrapper) onServiceClick?.(service, wrapper);
                      }}
                    />

                    {/* Visual circle */}
                    <div
                      className="orbit-node-circle"
                      style={{
                        width: 38, height: 38,
                        borderRadius: "50%",
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
                      <Icon style={{ width: 14, height: 14, color: rgba(col, 0.95), display: "block" }} />
                    </div>

                    {/* Label — flips to left side when node starts on right half of orbit */}
                    {(() => {
                      const flipLeft = Math.sin(service.angle * Math.PI / 180) > 0.1;
                      return (
                        <span
                          style={{
                            position: "absolute",
                            ...(flipLeft
                              ? { right: "calc(100% + 8px)", textAlign: "right" as const }
                              : { left:  "calc(100% + 8px)", textAlign: "left"  as const }
                            ),
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.72)",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                            letterSpacing: "0.02em",
                            pointerEvents: "none",
                          }}
                        >
                          {service.name}
                        </span>
                      );
                    })()}
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
