"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, ChevronDown, Sparkles, X } from "lucide-react";
import HeroOrbit, { type Service, type ServiceData } from "@/components/sections/HeroOrbit";

// Dynamic services from DB
interface DbService {
  id: string;
  name: string;
  icon_name: string;
  orbit: "inner" | "middle" | "outer";
  angle: number;
  card_title: string;
  card_desc: string;
  card_sub_desc: string;
  card_visual: string;
  card_cta: string;
  card_image_url: string | null;
}

/* ── Seeded pseudo-random ── */
function sr(seed: number) {
  const x = Math.sin(seed + 1.5) * 73856;
  return x - Math.floor(x);
}

/* Near layer — larger stars, clockwise rotation at 300s */
const STARS_NEAR = Array.from({ length: 70 }, (_, i) => ({
  top:   `${(sr(i * 4.71 + 1.3) * 100).toFixed(2)}%`,
  left:  `${(sr(i * 8.93 + 2.7) * 100).toFixed(2)}%`,
  size:  sr(i * 12.1 + 0.3) > 0.78 ? 2 : 1,
  delay: `${-(sr(i * 6.57 + 3.9) * 14).toFixed(1)}s`,
  dur:   `${(sr(i * 2.83 + 1.1)  *  8 + 6).toFixed(1)}s`,
}));

/* Far layer — tiny stars, counter-clockwise at 500s */
const STARS_FAR = Array.from({ length: 90 }, (_, i) => ({
  top:   `${(sr(i * 13.7 + 5.1) * 100).toFixed(2)}%`,
  left:  `${(sr(i *  7.23 + 8.4) * 100).toFixed(2)}%`,
  size:  1,
  delay: `${-(sr(i * 9.31 + 2.6) * 16).toFixed(1)}s`,
  dur:   `${(sr(i *  5.17 + 0.9) * 10 + 8).toFixed(1)}s`,
}));

const SHOOTING = [
  { top: "8%",  left: "62%", delay: 0,  dur: 15 },
  { top: "3%",  left: "76%", delay: 5,  dur: 15 },
  { top: "12%", left: "88%", delay: 10, dur: 15 },
];

const wordVariant = {
  hidden:  { opacity: 0, y: 60, rotateX: -15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const container = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
};

/* ── Service card content ── */
interface CardData {
  title: string;
  desc: string;
  subDesc: string;
  visual: string;
  cta: string;
}

const SERVICE_CARDS: Record<string, CardData> = {
  "YT Automation": {
    title: "CHANNEL DOMINATION",
    desc: "We build faceless YouTube empires that generate passive income 24/7 — no camera, no burnout, no limits.",
    subDesc: "From research to upload, our AI-powered pipeline handles everything while your channel compounds on autopilot.",
    visual: "Dashboard: 200% Growth Curve · 1M+ Views · Zero Face Required",
    cta: "BUILD MY EMPIRE",
  },
  "Scriptwriting": {
    title: "SCRIPTS THAT SELL",
    desc: "Every viral video starts with a script that hooks in 3 seconds — we write yours with retention science baked into every line.",
    subDesc: "Your ideas, our words, zero wasted frames. Hook to CTA, engineered for watch time.",
    visual: "Script Preview: Hook → Story Arc → CTA · High-Retention Framework",
    cta: "WRITE MY STORY",
  },
  "Short-Form Video": {
    title: "VERTICAL VIDEO DOMINANCE",
    desc: "We don't just edit shorts; we engineer 60-second cinematic experiences designed to stop the scroll and own the algorithm.",
    subDesc: "Raw footage in, high-performance digital gold out — fast turnarounds, every time.",
    visual: "Video Showreel Placeholder · Rapid cuts, cinematic B-roll · 15s High-Retention Sample Loop",
    cta: "CUT THE NOISE & EDIT",
  },
  "Ecommerce Sites": {
    title: "YOUR DIGITAL FLAGSHIP",
    desc: "We build conversion-first ecommerce experiences where every pixel is engineered to turn browsers into buyers at lightning speed.",
    subDesc: "Your store deserves to look like a brand and perform like a machine — we build both.",
    visual: "High-Speed Preview: Dark Cyberpunk E-commerce · Sub-2s Load · 40% Higher CVR",
    cta: "LAUNCH MY DIGITAL FLAGSHIP",
  },
  "Logo Design": {
    title: "BRAND IDENTITY FORGED",
    desc: "Your logo is the first thing the world sees and the last thing they forget — we design identities that command instant respect.",
    subDesc: "From concept to final files, built to scale across every medium, every market.",
    visual: "Logo Concepts: Minimal · Bold · Motion-Ready · Multi-Format Delivery",
    cta: "BRAND ME UNFORGETTABLE",
  },
  "Portfolio Sites": {
    title: "YOUR WORK, ELEVATED",
    desc: "A portfolio that closes clients before they even reach out — because your work deserves a stage as powerful as your talent.",
    subDesc: "Scroll-stopping design that positions you as the only choice in your niche.",
    visual: "Portfolio Preview: Cinematic Scroll · Project Showcases · Instant Contact Flow",
    cta: "SHOWCASE MY BEST WORK",
  },
  "Thumbnails": {
    title: "CLICKS DON'T LIE",
    desc: "Thumbnails are the most underrated growth lever — we design click-bait that's actually honest, hitting 8–12% CTR consistently.",
    subDesc: "Data-driven aesthetics meet cinematic execution. Supercharge your growth with visuals that convert.",
    visual: "Thumbnail Gallery: 3 viral variants · 9%+ avg CTR · Platform-tested formats",
    cta: "MAKE THEM CLICK",
  },
  "Social Media Mgmt": {
    title: "OWN THE FEED",
    desc: "We trendjack, create, and publish content that builds an obsessed community around your brand — on every platform, every day.",
    subDesc: "Your social presence runs on autopilot while you focus on what matters: growing your business.",
    visual: "Content Grid: Viral Posts · Engagement Metrics · Community Growth Chart",
    cta: "CLAIM THE SPOTLIGHT",
  },
  "Trend Research": {
    title: "AHEAD OF THE CURVE",
    desc: "We identify what's about to explode before it peaks — so your brand is always first, never playing catch-up.",
    subDesc: "Deep cross-platform intelligence delivered as actionable content strategies you can execute tomorrow.",
    visual: "Trend Dashboard: Rising Topics · Timing Windows · Competitor Gap Analysis",
    cta: "GET AHEAD NOW",
  },
  "Ad Production": {
    title: "ADS THAT CONVERT",
    desc: "We produce scroll-stopping ad creatives engineered for ROAS — not just impressions or vanity metrics.",
    subDesc: "Every creative is built with a direct-response mindset: hook, problem, solution, and an offer they can't refuse.",
    visual: "Ad Showreel: 3 winning creatives · Hook testing · Platform-specific formats",
    cta: "LAUNCH THE CAMPAIGN",
  },
  "AI Production": {
    title: "10X OUTPUT. SAME EFFORT.",
    desc: "We fuse cutting-edge AI workflows with human creative vision to deliver what normally takes days — in hours.",
    subDesc: "What takes your team 10 hours takes us 10 minutes. Zero compromise on quality, zero wasted budget.",
    visual: "Split-Screen: 10hr task → 10min AI completion · Workflow Automation Demo",
    cta: "SUPERCHARGE MY GROWTH",
  },
  "Video Editing": {
    title: "CINEMATIC PRECISION",
    desc: "Professional video editing that transforms raw footage into polished content your audience physically can't stop watching.",
    subDesc: "Fast turnarounds, cinematic color grading, and sound design that hits — every frame is intentional.",
    visual: "Before/After Reel: Raw Footage → Cinematic Final Cut · Color Grade · Sound Mix",
    cta: "EDIT MY VISION",
  },
};

const ORBIT_GLOW: Record<"inner" | "middle" | "outer", string> = {
  inner:  "rgba(192,38,211",
  middle: "rgba(167,139,250",
  outer:  "rgba(96,165,250",
};

/* ── Left panel: full-bleed image or icon placeholder ── */
function CardVisual({ glow, imageUrl, icon: Icon }: { glow: string; imageUrl?: string; icon: React.ElementType }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Right-edge fade to blend into card body */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 55%, rgba(4,4,18,0.85) 100%)",
            pointerEvents: "none",
          }} />
        </>
      ) : (
        /* No image — show glowing icon placeholder */
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(160deg, ${glow},0.13) 0%, transparent 70%)`,
        }}>
          <Icon style={{ width: 56, height: 56, color: `${glow},0.30)` }} />
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedInRef  = useRef(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [zoomState, setZoomState] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [dbServices, setDbServices] = useState<DbService[] | null>(null);

  // Fetch services from DB on mount
  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DbService[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbServices(data);
        }
      })
      .catch(() => {/* silently fall back to static data */});
  }, []);

  const handleServiceClick = useCallback((service: Service, nodeEl: HTMLElement) => {
    if (selectedService) return; // already zoomed
    const containerEl = orbitContainerRef.current;
    if (!containerEl) return;

    const containerRect = containerEl.getBoundingClientRect();
    const nodeRect      = nodeEl.getBoundingClientRect();

    const ZOOM = 2.0;
    const vx = window.innerWidth  / 2;
    const vy = window.innerHeight / 2;

    // Container center in viewport
    const cx = containerRect.left + containerRect.width  / 2;
    const cy = containerRect.top  + containerRect.height / 2;

    // Node offset from container center
    const nodeOffX = (nodeRect.left + nodeRect.width  / 2) - cx;
    const nodeOffY = (nodeRect.top  + nodeRect.height / 2) - cy;

    // Translation: bring node to viewport center after scale
    const tx = (vx - cx) - nodeOffX * ZOOM;
    const ty = (vy - cy) - nodeOffY * ZOOM;

    setZoomState({ x: tx, y: ty, scale: ZOOM });
    setSelectedService(service);
  }, [selectedService]);

  const handleClose = useCallback(() => {
    setSelectedService(null);
    setZoomState(null);
  }, []);

  // Escape key closes card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Build cardData: prefer DB data, fall back to static SERVICE_CARDS
  const cardData: CardData | null = selectedService
    ? (() => {
        const dbSvc = dbServices?.find((s) => s.name === selectedService.name);
        if (dbSvc && (dbSvc.card_title || dbSvc.card_desc)) {
          return {
            title: dbSvc.card_title,
            desc: dbSvc.card_desc,
            subDesc: dbSvc.card_sub_desc,
            visual: dbSvc.card_visual,
            cta: dbSvc.card_cta,
          };
        }
        return SERVICE_CARDS[selectedService.name] ?? null;
      })()
    : null;

  // imageUrl for PhoneMockup
  const cardImageUrl: string | undefined = selectedService && dbServices
    ? (dbServices.find((s) => s.name === selectedService.name)?.card_image_url ?? undefined)
    : undefined;

  const orbitGlow = selectedService ? ORBIT_GLOW[selectedService.orbit] : ORBIT_GLOW.inner;

  // Convert dbServices to ServiceData[] for HeroOrbit prop
  const orbitServices: ServiceData[] | undefined = dbServices
    ? dbServices.map((s) => ({
        id: s.id,
        name: s.name,
        iconName: s.icon_name,
        orbit: s.orbit,
        angle: s.angle,
      }))
    : undefined;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-300">

      {/* Base bg */}
      <div className="absolute inset-0 section-bg-1" />

      {/* Soft glow blobs */}
      <div className="absolute top-[-15%] right-[-5%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.10) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }} />


      {/* ── Star field — two counter-rotating layers, appear/disappear twinkle ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x:     zoomState ? -(zoomState.x * 0.10) : 0,
          y:     zoomState ? -(zoomState.y * 0.10) : 0,
          scale: zoomState ? 1.35 : 1,
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Near layer — clockwise 300s */}
        <div
          className="absolute"
          style={{ top: "-30%", left: "-30%", width: "160%", height: "160%",
            animation: "star-field-rotate 300s linear infinite" }}
        >
          {STARS_NEAR.map((s, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size,
                animation: `star-appear ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
          ))}
        </div>

        {/* Far layer — counter-clockwise 500s, slightly dimmer */}
        <div
          className="absolute"
          style={{ top: "-30%", left: "-30%", width: "160%", height: "160%",
            animation: "star-field-rotate 500s linear infinite" }}
        >
          {STARS_FAR.map((s, i) => (
            <div key={i} className="absolute rounded-full"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size,
                background: "rgba(255,255,255,0.75)",
                animation: `star-appear ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
          ))}
        </div>
      </motion.div>

      {/* ── Shooting stars ── */}
      {SHOOTING.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: "1.5px",
            height: "80px",
            background: "linear-gradient(to bottom, transparent, rgba(186,230,253,0.75), white)",
            borderRadius: "999px",
            transformOrigin: "top center",
            animation: `shooting-star ${s.dur}s ease-in ${s.delay}s infinite`,
            animationFillMode: "backwards",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ── Main split layout ── */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0 lg:min-h-screen">

          {/* LEFT: Text — scales up, drifts left, fades out on zoom */}
          <motion.div
            className="flex-1 flex flex-col justify-center lg:py-24 lg:pr-8"
            animate={
              selectedService
                ? { opacity: 0, x: -90, scale: 1.06 }
                : { opacity: 1, x: 0,   scale: 1    }
            }
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex self-start items-center gap-2.5 px-5 py-2 rounded-full glass border border-brand/25 mb-8"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-brand"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-semibold bg-gradient-to-r from-brand-300 to-royal-300 bg-clip-text text-transparent">
                AI-Powered Creative Super-Team
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-sparkle" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ perspective: "1000px" }}
            >
              {["WORK LESS.", "GROW FASTER.", "DOMINATE."].map((line, i) => (
                <motion.span key={i} variants={wordVariant} className={`block ${i === 1 ? "text-gradient" : ""}`}>
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-white/55 text-lg max-w-lg mb-10 leading-relaxed"
            >
              Forget the freelance chaos. Effortless Crew is your reliable,
              AI-powered solar system of content and design services.{" "}
              <span className="text-white/80 font-medium">Work Less, Grow Faster,</span>{" "}
              and let us supercharge your growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/contact"
                className="relative group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden w-full sm:w-auto justify-center"
                style={{
                  background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
                  boxShadow: "0 0 30px rgba(192,38,211,0.4), 0 0 60px rgba(37,99,235,0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide text-sm">
                  Claim Your Creative Freedom
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 btn-shimmer" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, #D946EF 0%, #3B82F6 100%)" }} />
              </Link>

              <button
                className="flex items-center gap-3 group cursor-pointer w-full sm:w-auto"
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              >
                <motion.span
                  className="w-12 h-12 rounded-full glass border border-white/15 flex items-center justify-center group-hover:border-brand/40 transition-all flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 fill-white ml-0.5 text-white" />
                </motion.span>
                <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                  View Our Work
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Orbit — inside layout so position is stable at any viewport width */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <motion.div
              ref={orbitContainerRef}
              style={{
                maskImage: selectedService
                  ? "none"
                  : "linear-gradient(to right, transparent 0%, black 13%)",
                WebkitMaskImage: selectedService
                  ? "none"
                  : "linear-gradient(to right, transparent 0%, black 13%)",
              }}
              initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
              animate={
                zoomState
                  ? { opacity: 1, scale: zoomState.scale, x: zoomState.x, y: zoomState.y }
                  : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={
                !hasAnimatedIn
                  ? { duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }
              onAnimationComplete={() => {
                if (!hasAnimatedInRef.current) {
                  hasAnimatedInRef.current = true;
                  setHasAnimatedIn(true);
                }
              }}
            >
              <HeroOrbit
                onServiceClick={handleServiceClick}
                paused={!!selectedService}
                services={orbitServices}
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedService ? 0 : 1 }}
        transition={{ delay: selectedService ? 0 : 2.2, duration: 0.6 }}
      >
        <span className="text-white/25 text-xs tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={() => document.getElementById("ticker")?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>

      {/* ── Service card overlay ── */}
      <AnimatePresence>
        {selectedService && cardData && (
          <motion.div
            key="service-card-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Blurred backdrop — click to close */}
            <div
              className="absolute inset-0"
              style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", background: "rgba(0,0,0,0.25)" }}
              onClick={handleClose}
            />

            {/* Card */}
            <motion.div
              key={selectedService.name}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(820px, 94vw)",
                background: `linear-gradient(135deg, ${orbitGlow},0.20) 0%, rgba(4,4,18,0.97) 50%, ${orbitGlow},0.07) 100%)`,
                backdropFilter: "blur(36px)",
                WebkitBackdropFilter: "blur(36px)",
                border: `1px solid ${orbitGlow},0.50)`,
                borderRadius: 24,
                boxShadow: `0 0 0 1px ${orbitGlow},0.10), 0 0 50px ${orbitGlow},0.40), 0 0 120px ${orbitGlow},0.18), 0 50px 120px rgba(0,0,0,0.85)`,
                overflow: "hidden",
              }}
            >
              {/* Top-left radial hotspot */}
              <div style={{
                position: "absolute", top: -80, left: -80,
                width: 320, height: 320, borderRadius: "50%",
                background: `radial-gradient(circle, ${orbitGlow},0.28) 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />
              {/* Bottom-right accent */}
              <div style={{
                position: "absolute", bottom: -60, right: -60,
                width: 220, height: 220, borderRadius: "50%",
                background: `radial-gradient(circle, ${orbitGlow},0.12) 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              {/* Service identity — top left */}
              {(() => {
                const Icon = selectedService.icon;
                return (
                  <div
                    className="absolute top-5 left-5 z-20 flex items-center gap-2.5"
                    style={{
                      background: "rgba(0,0,0,0.52)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: 999,
                      padding: "5px 12px 5px 5px",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: `${orbitGlow},0.18)`,
                        border: `1.5px solid ${orbitGlow},0.50)`,
                        boxShadow: `0 0 12px ${orbitGlow},0.35)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: 13, height: 13, color: `${orbitGlow},0.95)` }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: `${orbitGlow},0.80)` }}
                    >
                      {selectedService.name}
                    </span>
                  </div>
                );
              })()}

              {/* Return to Orbit button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-semibold tracking-wide uppercase"
              >
                Return to Orbit
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: `${orbitGlow},0.15)`, border: `1px solid ${orbitGlow},0.35)` }}
                >
                  <X className="w-3 h-3" />
                </span>
              </button>

              {/* Card body */}
              <div className="flex min-h-[380px] relative z-10">

                {/* Left: Visual — full-bleed image or icon placeholder */}
                <div
                  className="hidden sm:block flex-shrink-0"
                  style={{
                    width: 280,
                    borderRight: `1px solid ${orbitGlow},0.18)`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CardVisual
                    glow={orbitGlow}
                    imageUrl={cardImageUrl}
                    icon={selectedService.icon}
                  />
                </div>

                {/* Right: Content */}
                <div className="flex-1 flex flex-col justify-center p-8 pt-14">
                  <h2
                    className="font-black text-white text-2xl lg:text-3xl leading-tight mb-4"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {cardData.title}
                  </h2>
                  <p className="text-white/75 text-sm leading-relaxed mb-3">
                    {cardData.desc}
                  </p>
                  <p className="text-white/45 text-sm leading-relaxed mb-8">
                    {cardData.subDesc}
                  </p>
                  <Link
                    href="/contact"
                    className="self-start flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-white text-xs uppercase tracking-widest"
                    style={{
                      background: `linear-gradient(135deg, ${orbitGlow},1) 0%, rgba(37,99,235,1) 100%)`,
                      boxShadow: `0 0 30px ${orbitGlow},0.65), 0 0 60px ${orbitGlow},0.28), 0 4px 20px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {cardData.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
