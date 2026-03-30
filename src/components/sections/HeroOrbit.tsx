"use client";

import NextImage from "next/image";
import {
  Film, Image, Smartphone, FileText,
  Bot, Share2, Palette, Megaphone,
  Globe, ShoppingCart, Zap, BarChart3,
  Youtube, Camera, Music, Code, TrendingUp, Users,
  Star, Target, Wand2, Video, Mail, Shield, Search, Layout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  name: string;
  icon: LucideIcon;
  orbit: "inner" | "middle" | "outer";
  angle: number;
}

export interface ServiceData {
  id?: string;
  name: string;
  iconName: string;
  orbit: "inner" | "middle" | "outer";
  angle: number;
}

export interface RingOverride {
  paused: boolean;
  offsetDeg: number;
}

export interface CameraPose {
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateX: number;
  translateY: number;
  translateZ: number;
}

export const DEFAULT_CAMERA_POSE: CameraPose = {
  perspective: 0, rotateX: 0, rotateY: 0, rotateZ: 0,
  translateX: 0, translateY: 0, translateZ: 0,
};

const ICON_MAP: Record<string, LucideIcon> = {
  Film, Image, Smartphone, FileText, Bot, Share2, Palette, Megaphone,
  Globe, ShoppingCart, Zap, BarChart3, Youtube, Camera, Music, Code,
  TrendingUp, Users, Star, Target, Wand2, Video, Mail, Shield, Search, Layout,
};

interface HeroOrbitProps {
  onServiceClick?: (service: Service, nodeEl: HTMLElement) => void;
  paused?: boolean;
  services?: ServiceData[];
  orbitMode?: boolean;
  activeServiceName?: string | null;
  ringOverrides?: { inner?: RingOverride; middle?: RingOverride; outer?: RingOverride };
  blurBackground?: boolean;
  cameraPose?: CameraPose;
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

// 3D tilt angle in orbit mode (degrees). 72° makes circles into tight ellipses.
const TILT_DEG = 72;

export default function HeroOrbit({
  onServiceClick,
  paused = false,
  services: servicesProp,
  orbitMode = false,
  activeServiceName = null,
  ringOverrides = {},
  blurBackground = false,
}: HeroOrbitProps) {
  const resolvedServices: Service[] = servicesProp
    ? servicesProp.map((sd) => ({
        name: sd.name,
        icon: ICON_MAP[sd.iconName] ?? Zap,
        orbit: sd.orbit,
        angle: sd.angle,
      }))
    : services;

  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      className={`relative pointer-events-none${paused && !orbitMode ? " orbits-paused" : ""}`}
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

      {/*
        ── 3D Perspective wrapper ──
        In orbit mode: perspective on parent, rotateX on child tilts the entire orbital plane.
        This makes the rings into ellipses and gives depth — "front" items appear larger.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: orbitMode ? "900px" : "none",
          transition: `perspective 0.8s ${EASE}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: orbitMode
              ? `rotateX(${TILT_DEG}deg)`
              : "rotateX(0deg)",
            transition: `transform 0.8s ${EASE}`,
          }}
        >
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
          <div
            className="absolute top-1/2 left-1/2 z-20"
            style={{
              // Counter-rotate so EC stays face-on (billboard)
              transform: orbitMode
                ? `translate(-50%, -50%) rotateX(${-TILT_DEG}deg)`
                : "translate(-50%, -50%)",
              transition: `transform 0.8s ${EASE}, filter 0.6s ease`,
              filter: blurBackground ? "blur(5px) brightness(0.6)" : "none",
            }}
          >
            <div
              className="absolute rounded-full animate-ping"
              style={{
                inset: -12,
                background: "linear-gradient(135deg, rgba(80,200,255,0.28), rgba(37,99,235,0.18))",
                animationDuration: "2.4s",
              }}
            />
            <div
              className="absolute rounded-full animate-ping"
              style={{
                inset: -26,
                background: "linear-gradient(135deg, rgba(80,200,255,0.11), rgba(37,99,235,0.07))",
                animationDuration: "3.2s",
                animationDelay: "-0.7s",
              }}
            />
            <div
              className="relative rounded-full flex items-center justify-center select-none overflow-hidden"
              style={{
                width: 118, height: 118,
                background: "radial-gradient(circle at center, rgba(10,20,50,0.95) 0%, rgba(5,10,35,0.98) 60%, rgba(2,2,16,1) 100%)",
                border: "1.5px solid rgba(80,200,255,0.50)",
                boxShadow: "0 0 32px rgba(80,200,255,0.35), 0 0 70px rgba(80,200,255,0.15), inset 0 0 18px rgba(30,80,160,0.25)",
                animation: "sun-pulse 3s ease-in-out infinite",
                willChange: "box-shadow",
              }}
            >
              <NextImage
                src="/orbit-logo.png"
                alt="EC"
                width={94}
                height={94}
                className="object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
          </div>

          {/* ── Per-node ghost trail + orbiting node ── */}
          {resolvedServices.map((service) => {
            const { radius, duration } = orbitConfig[service.orbit];
            const override = ringOverrides[service.orbit];
            const isActive = service.name === activeServiceName;
            const isInBackground = orbitMode && !isActive && activeServiceName !== null;
            const isPausedByOverride = orbitMode && override?.paused;
            const offsetDeg = override?.offsetDeg ?? 0;
            const delay = -(((service.angle + offsetDeg) / 360) * duration);
            const col = orbitColor[service.orbit];
            const Icon = service.icon;

            const ghosts = [
              { delta: duration * 0.04, size: 18, alpha: 0.30 },
            ];

            return (
              <div
                key={service.name}
                className={isPausedByOverride ? "orbits-paused" : ""}
              >
                {/* Ghost trail */}
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
                      opacity: isInBackground ? 0 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    <div style={{ transform: `translateY(-${radius}px)` }}>
                      <div
                        style={{
                          width: g.size, height: g.size,
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
                        Billboard wrapper: counter-rotates X so node faces the camera
                        even when the orbital plane is tilted.
                      */}
                      <div
                        style={{
                          transform: orbitMode
                            ? `translate(-50%, -50%) rotateX(${-TILT_DEG}deg)`
                            : "translate(-50%, -50%)",
                          transition: `transform 0.8s ${EASE}`,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div
                          className="orbit-node"
                          style={{
                            position: "relative",
                            width: 38,
                            height: 38,
                            pointerEvents: "auto",
                            filter: isInBackground
                              ? "blur(3px) brightness(0.5)"
                              : "none",
                            opacity: isInBackground ? 0.35 : 1,
                            transition: "filter 0.5s ease, opacity 0.5s ease",
                            "--node-glow-hi": rgba(col, 0.72),
                            "--node-glow-lo": rgba(col, 0.28),
                          } as React.CSSProperties}
                        >
                          {/* Enlarged hit area */}
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

                          {/* Active ring glow */}
                          {isActive && (
                            <div
                              style={{
                                position: "absolute",
                                inset: -12,
                                borderRadius: "50%",
                                border: `2px solid ${rgba(col, 0.95)}`,
                                boxShadow: `0 0 24px ${rgba(col, 0.8)}, 0 0 48px ${rgba(col, 0.45)}, 0 0 80px ${rgba(col, 0.2)}`,
                                animation: "sun-pulse 2s ease-in-out infinite",
                                pointerEvents: "none",
                              }}
                            />
                          )}

                          {/* Visual circle */}
                          <div
                            className="orbit-node-circle"
                            style={{
                              width: 38, height: 38,
                              borderRadius: "50%",
                              background: isActive
                                ? `radial-gradient(circle at 38% 38%, rgba(${col.r},${col.g},${col.b},0.35), rgba(8,8,28,0.95))`
                                : "rgba(8,8,28,0.90)",
                              border: `1.5px solid ${rgba(col, isActive ? 0.9 : 0.42)}`,
                              boxShadow: isActive
                                ? `0 0 24px ${rgba(col, 0.7)}, 0 0 48px ${rgba(col, 0.35)}, 0 4px 14px rgba(0,0,0,0.6)`
                                : `0 0 12px ${rgba(col, 0.28)}, 0 0 24px ${rgba(col, 0.12)}, 0 4px 14px rgba(0,0,0,0.6)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.4s ease",
                            }}
                          >
                            <Icon style={{ width: 14, height: 14, color: rgba(col, isActive ? 1 : 0.95), display: "block" }} />
                          </div>

                          {/* Label */}
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
                                  fontSize: isActive ? 11 : 10,
                                  fontWeight: isActive ? 700 : 600,
                                  color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
                                  whiteSpace: "nowrap",
                                  lineHeight: 1,
                                  letterSpacing: "0.02em",
                                  pointerEvents: "none",
                                  transition: "all 0.4s ease",
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
