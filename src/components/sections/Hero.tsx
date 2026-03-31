"use client";

import React from "react";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, X, Orbit, Sparkles } from "lucide-react";
import HeroOrbit, { type Service, type ServiceData, type RingOverride, type CameraPose, DEFAULT_CAMERA_POSE } from "@/components/sections/HeroOrbit";

const MotionLink = motion(Link);

function highlightEC(text: string) {
  const parts = text.split("Effortless Crew");
  return parts.map((part, i) => (
    <span key={i}>{part}{i < parts.length - 1 && <span className="ec-highlight">Effortless Crew</span>}</span>
  ));
}

// Hero settings from DB
interface HeroSettings {
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_color_1: string;
  hero_color_2: string;
}

const HERO_DEFAULTS: HeroSettings = {
  hero_headline: "WORK LESS.\nGROW FASTER.\nDOMINATE.",
  hero_subheadline:
    "Forget the freelance chaos. Effortless Crew is your reliable, AI-powered solar system of content and design services. Work Less, Grow Faster, and let us supercharge your growth.",
  hero_cta_text: "Claim Your Creative Freedom",
  hero_cta_link: "/contact",
  hero_color_1: "#C026D3",
  hero_color_2: "#2563EB",
};

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
  card_images: string[] | null;
  card_cta_link: string | null;
}

/* ── Seeded pseudo-random ── */
function sr(seed: number) {
  const x = Math.sin(seed + 1.5) * 73856;
  return x - Math.floor(x);
}

/* Stars with per-star twinkle — placed in 160%-oversized space so rotation never exposes edges */
const STARS = Array.from({ length: 70 }, (_, i) => ({
  top:     `${(sr(i * 4.71 + 1.3) * 100).toFixed(2)}%`,
  left:    `${(sr(i * 8.93 + 2.7) * 100).toFixed(2)}%`,
  size:    sr(i * 12.1 + 0.3) > 0.78 ? 2 : 1,
  dur:     `${(sr(i * 2.83 + 1.1) * 5 + 4).toFixed(1)}s`,   // 4–9s twinkle cycle
  delay:   `${-(sr(i * 6.57 + 3.9) * 12).toFixed(1)}s`,     // negative = mid-cycle on load
}));

const SHOOTING = [
  { top: "8%",  left: "62%", delay: 0,  dur: 15 },
  { top: "3%",  left: "76%", delay: 5,  dur: 15 },
  { top: "12%", left: "88%", delay: 10, dur: 15 },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const wordVariant = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease: EASE_OUT } },
};
const container = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.16, delayChildren: 0.4 } },
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

/* ── Camera poses for orbit mode: each ring gets its own camera position ──
   perspective: viewing distance (px). translateZ: how close the scene is.
   Items at z close to perspective appear huge (strong depth).
   rotateX: tilts the orbit plane — steep angles (75°+) make circles into thin
   ellipses, with the "bottom" of each ring closest to the viewer.
   The active service sits at 180° (bottom) = closest to camera = BIGGEST.  */
const CAMERA_POSES: Record<string, CameraPose> = {
  default: DEFAULT_CAMERA_POSE,
  inner: {
    perspective: 900,
    rotateX: 78,
    rotateY: 0,
    rotateZ: -12,
    translateX: 30,
    translateY: -40,
    translateZ: 480,
  },
  middle: {
    perspective: 900,
    rotateX: 76,
    rotateY: 0,
    rotateZ: -8,
    translateX: 20,
    translateY: -70,
    translateZ: 400,
  },
  outer: {
    perspective: 900,
    rotateX: 74,
    rotateY: 0,
    rotateZ: -5,
    translateX: 10,
    translateY: -100,
    translateZ: 320,
  },
};

/* ── Left panel: multi-image with pan + crossfade ── */
function CardVisual({ glow, images, icon: Icon }: { glow: string; images: string[]; icon: React.ElementType }) {
  // cycle is an always-incrementing counter; even for 1 image, it forces a key change
  // so AnimatePresence triggers a fresh fade+pan on each loop.
  const [cycle, setCycle] = useState(0);
  const idx = images.length > 1 ? cycle % images.length : 0;

  // Reset cycle to 0 when the images list changes (new service selected)
  useEffect(() => { setCycle(0); }, [images]);

  // Advance every 11s (8s pan + 3s pause). Works for 1 or more images.
  useEffect(() => {
    if (!images.length) return;
    const timer = setTimeout(() => { setCycle((c) => c + 1); }, 21000);
    return () => clearTimeout(timer);
  }, [cycle, images]);

  if (!images.length) {
    return (
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(160deg, ${glow},0.13) 0%, transparent 70%)`,
      }}>
        <Icon style={{ width: 56, height: 56, color: `${glow},0.30)` }} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <AnimatePresence>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={cycle}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            animation: "pan-lr 21s linear forwards",
          }}
        />
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const sectionRef        = useRef<HTMLElement>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedInRef  = useRef(false);

  // ── Parallax scroll ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Spring smoothing — slight cinematic lag, auto-pauses at 0/1 bounds
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  const starsY      = useTransform(smooth, [0, 1], [0, -160]); // farthest — most movement
  const orbitY      = useTransform(smooth, [0, 1], [0, -220]); // middle
  const textY       = useTransform(smooth, [0, 1], [0, -90]);  // closest (subtle)
  const textOpacity = useTransform(smooth, [0, 0.6], [1, 0]);  // fades out at 60% scroll

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [zoomState, setZoomState] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [dbServices, setDbServices] = useState<DbService[] | null>(null);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(HERO_DEFAULTS);
  const [settingsReady, setSettingsReady] = useState(false);
  const [showOrbit, setShowOrbit] = useState(false);

  // ── Orbit mode ──────────────────────────────────────────────────────
  const [orbitHovered, setOrbitHovered] = useState(false);
  const [orbitMode, setOrbitMode]       = useState(false);
  const [orbitBlur, setOrbitBlur]       = useState(false);
  // serviceCursor: which service in the flat list is active
  const [serviceCursorIdx, setServiceCursorIdx] = useState(0);
  // ringOverrides: per-ring pause + offset state
  const [ringOverrides, setRingOverrides] = useState<{
    inner: RingOverride; middle: RingOverride; outer: RingOverride;
  }>({
    inner:  { paused: false, offsetDeg: 0 },
    middle: { paused: false, offsetDeg: 0 },
    outer:  { paused: false, offsetDeg: 0 },
  });

  // Fetch hero settings — animate headline only once settings confirmed
  useEffect(() => {
    const fallback = setTimeout(() => setSettingsReady(true), 600);
    fetch("/api/admin/hero-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HeroSettings | null) => { if (data) setHeroSettings(data); })
      .catch(() => {})
      .finally(() => { clearTimeout(fallback); setSettingsReady(true); });
    return () => clearTimeout(fallback);
  }, []);

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

  // ── Orbit mode helpers ───────────────────────────────────────────────
  // Flat list built from DB services or static fallback
  const STATIC_SERVICES: ServiceData[] = [
    { name:"YT Automation", iconName:"Bot", orbit:"inner", angle:0 },
    { name:"Scriptwriting", iconName:"FileText", orbit:"inner", angle:120 },
    { name:"Short-Form Video", iconName:"Smartphone", orbit:"inner", angle:240 },
    { name:"Ecommerce Sites", iconName:"ShoppingCart", orbit:"middle", angle:0 },
    { name:"Logo Design", iconName:"Palette", orbit:"middle", angle:90 },
    { name:"Portfolio Sites", iconName:"Globe", orbit:"middle", angle:180 },
    { name:"Thumbnails", iconName:"Image", orbit:"middle", angle:270 },
    { name:"Social Media Mgmt", iconName:"Share2", orbit:"outer", angle:0 },
    { name:"Trend Research", iconName:"BarChart3", orbit:"outer", angle:72 },
    { name:"Ad Production", iconName:"Megaphone", orbit:"outer", angle:144 },
    { name:"AI Production", iconName:"Zap", orbit:"outer", angle:216 },
    { name:"Video Editing", iconName:"Film", orbit:"outer", angle:288 },
  ];
  const flatServices: ServiceData[] = dbServices
    ? dbServices.map(s => ({ name:s.name, iconName:s.icon_name, orbit:s.orbit, angle:s.angle }))
    : STATIC_SERVICES;

  const activeOrbitService = orbitMode ? flatServices[serviceCursorIdx] : null;

  // Camera pose for current state
  const currentCameraPose: CameraPose = orbitMode && activeOrbitService
    ? CAMERA_POSES[activeOrbitService.orbit] ?? CAMERA_POSES.inner
    : CAMERA_POSES.default;

  // Compute ring offset so the active service lands at the "front" (angle 270° = bottom of orbit = visually center-front in perspective)
  // The orbit animates CW from the angle; we want angle+offset = 270 at the start freeze point
  const computeOffset = (baseAngle: number) => {
    // 180° = bottom of circle = closest to viewer with rotateX tilt = visual front
    const target = 180;
    let off = target - baseAngle;
    if (off < 0) off += 360;
    return off;
  };

  const enterOrbit = useCallback(() => {
    setOrbitMode(true);
    const first = flatServices[0];
    if (!first) return;
    setServiceCursorIdx(0);
    // Blur during fly-in, then unblur after short delay
    setOrbitBlur(false);
    const offset = computeOffset(first.angle);
    setRingOverrides({
      inner:  { paused: true,  offsetDeg: offset },
      middle: { paused: false, offsetDeg: 0 },
      outer:  { paused: false, offsetDeg: 0 },
    });
    // Blur background after orbit settles
    setTimeout(() => setOrbitBlur(true), 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatServices]);

  const exitOrbit = useCallback(() => {
    setOrbitBlur(false);
    setTimeout(() => {
      setOrbitMode(false);
      setServiceCursorIdx(0);
      setRingOverrides({
        inner:  { paused: false, offsetDeg: 0 },
        middle: { paused: false, offsetDeg: 0 },
        outer:  { paused: false, offsetDeg: 0 },
      });
    }, 400);
  }, []);

  const navigateOrbit = useCallback((dir: 1 | -1) => {
    setOrbitBlur(false);
    setTimeout(() => {
      setServiceCursorIdx(prev => {
        const next = Math.max(0, Math.min(flatServices.length - 1, prev + dir));
        const svc = flatServices[next];
        if (!svc) return prev;
        const offset = computeOffset(svc.angle);
        // Determine which rings to pause
        const isPausedMap = { inner: false, middle: false, outer: false };
        isPausedMap[svc.orbit] = true;
        setRingOverrides({
          inner:  { paused: isPausedMap.inner,  offsetDeg: isPausedMap.inner  ? offset : ringOverrides.inner.offsetDeg  },
          middle: { paused: isPausedMap.middle, offsetDeg: isPausedMap.middle ? offset : ringOverrides.middle.offsetDeg },
          outer:  { paused: isPausedMap.outer,  offsetDeg: isPausedMap.outer  ? offset : ringOverrides.outer.offsetDeg  },
        });
        return next;
      });
      setTimeout(() => setOrbitBlur(true), 500);
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatServices, ringOverrides]);

  // Escape key closes card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Show orbit only on real desktop screens (≥1024px) — never on mobile/tablet
  useEffect(() => {
    const check = () => setShowOrbit(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // Resolve images: if card_images column exists (even empty array), use it; only fall back to
  // card_image_url when card_images is null/undefined (pre-migration rows).
  const cardImages: string[] = selectedService && dbServices
    ? (() => {
        const dbSvc = dbServices.find((s) => s.name === selectedService.name);
        if (dbSvc?.card_images != null) return dbSvc.card_images;
        if (dbSvc?.card_image_url) return [dbSvc.card_image_url];
        return [];
      })()
    : [];

  const cardCtaLink: string = selectedService && dbServices
    ? (dbServices.find((s) => s.name === selectedService.name)?.card_cta_link ?? "/contact")
    : "/contact";

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
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-dark-300">

      {/* Base bg */}
      <div className="absolute inset-0 section-bg-1" />

      {/* ── Star field: rotating container + per-star opacity twinkle ── */}
      <motion.div style={{ y: starsY }} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-30%", left: "-30%",
            width: "160%", height: "160%",
            animation: "star-field-rotate 360s linear infinite",
          }}
        >
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: s.top, left: s.left,
                width: s.size, height: s.size,
                animation: `star-appear ${s.dur} ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Soft glow blobs — sit above grid, below content */}
      <div className="absolute top-[-15%] right-[-5%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.10) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)" }} />

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

          {/* LEFT: Text — parallax wrapper handles scroll y+fade; inner handles zoom */}
          <motion.div style={{ y: textY, opacity: textOpacity }} className="flex-1">
          <motion.div
            className="flex flex-col justify-center lg:py-24 lg:pr-8"
            animate={
              selectedService || orbitMode
                ? { opacity: 0, x: -60, scale: 1.03, pointerEvents: "none" }
                : { opacity: 1, x: 0,   scale: 1,    pointerEvents: "auto" }
            }
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >


            {/* Headline */}
            <motion.h1
              style={{ opacity: 0 }}
              variants={container}
              initial="hidden"
              animate={settingsReady ? "visible" : "hidden"}
              className="font-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              {heroSettings.hero_headline.split("\n").map((line, i, arr) => {
                const isGradient = arr.length >= 2 && i === 1;
                return (
                  <motion.span key={i} variants={wordVariant} className="block">
                    {isGradient ? (
                      <span
                        className="text-gradient-custom whitespace-nowrap"
                        style={{
                          "--gc1": heroSettings.hero_color_1,
                          "--gc2": heroSettings.hero_color_2,
                          fontSize: "0.85em",
                        } as React.CSSProperties}
                      >
                        {line}
                      </span>
                    ) : line}
                  </motion.span>
                );
              })}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              style={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={settingsReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="text-white/55 text-lg max-w-lg mb-10 leading-relaxed"
            >
              {highlightEC(heroSettings.hero_subheadline)}
            </motion.p>

            {/* Trust stats — staggered entry */}
            <div className="flex items-center gap-6 mb-10">
              {[
                { value: "1500+", label: "Projects Done" },
                { value: "200M+", label: "Views Generated" },
                { value: "100%",  label: "Client Satisfaction" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  style={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  animate={settingsReady ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.05 + i * 0.08, ease: EASE_OUT }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-black text-white leading-none">{stat.value}</span>
                  <span className="text-[11px] text-white/40 uppercase tracking-widest mt-0.5">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              style={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={settingsReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 1.25 }}
              className="flex flex-row items-center gap-3"
            >
              <MotionLink
                href={heroSettings.hero_cta_link || "/contact"}
                className="relative group flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-2xl font-semibold text-white overflow-hidden whitespace-nowrap justify-center"
                style={{
                  background: `linear-gradient(135deg, ${heroSettings.hero_color_1} 0%, ${heroSettings.hero_color_2} 100%)`,
                  boxShadow: `0 0 30px ${heroSettings.hero_color_1}66, 0 0 60px ${heroSettings.hero_color_2}33`,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide text-xs sm:text-sm whitespace-nowrap">
                  {heroSettings.hero_cta_text || "Claim Your Creative Freedom"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 btn-shimmer" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(135deg, ${heroSettings.hero_color_1}cc 0%, ${heroSettings.hero_color_2}cc 100%)` }} />
              </MotionLink>

              {/* Enter Orbit CTA */}
              <motion.button
                className="relative flex items-center gap-2 group cursor-pointer px-4 py-3 sm:px-5 rounded-2xl transition-all duration-300 whitespace-nowrap overflow-hidden"
                style={{
                  background: orbitHovered
                    ? "rgba(192,38,211,0.18)"
                    : "rgba(255,255,255,0.06)",
                  border: orbitHovered
                    ? "1px solid rgba(192,38,211,0.55)"
                    : "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  boxShadow: orbitHovered
                    ? "0 0 24px rgba(192,38,211,0.35), 0 0 48px rgba(192,38,211,0.15)"
                    : "none",
                  transition: "all 0.35s ease",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={enterOrbit}
              >
                {/* shimmer sweep on hover */}
                {orbitHovered && (
                  <span className="absolute inset-0 btn-shimmer pointer-events-none" />
                )}
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(192,38,211,0.22)",
                    border: "1px solid rgba(192,38,211,0.45)",
                    boxShadow: orbitHovered ? "0 0 10px rgba(192,38,211,0.5)" : "none",
                    transition: "box-shadow 0.35s ease",
                  }}
                >
                  <Orbit className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="relative text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Enter The Orbit
                </span>
                <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          </motion.div>
          </motion.div>

          {/* RIGHT: Orbit — parallax wrapper; only on desktop */}
          {showOrbit && (
            <motion.div
              style={{ y: orbitY }}
              className="flex flex-1 items-center justify-center relative"
              onMouseEnter={() => { if (!orbitMode) setOrbitHovered(true); }}
              onMouseLeave={() => setOrbitHovered(false)}
            >
              <motion.div
                ref={orbitContainerRef}
                style={{
                  maskImage: (selectedService || orbitMode)
                    ? "none"
                    : "linear-gradient(to right, transparent 0%, black 13%, black 88%, transparent 100%)",
                  WebkitMaskImage: (selectedService || orbitMode)
                    ? "none"
                    : "linear-gradient(to right, transparent 0%, black 13%, black 88%, transparent 100%)",
                }}
                initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
                animate={
                  zoomState
                    ? { opacity: 1, scale: zoomState.scale, x: zoomState.x, y: zoomState.y }
                    : orbitMode
                      ? { opacity: 1, scale: 1, x: -180, y: 0 }
                      : { opacity: 1, scale: 1, x: 0, y: 0 }
                }
                transition={
                  !hasAnimatedIn
                    ? { duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
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
                  orbitMode={orbitMode}
                  activeServiceName={activeOrbitService?.name ?? null}
                  ringOverrides={ringOverrides}
                  blurBackground={orbitBlur}
                  cameraPose={currentCameraPose}
                />
              </motion.div>

              {/* ── Hover overlay: "Enter the Orbit" ── */}
              <AnimatePresence>
                {orbitHovered && !orbitMode && !selectedService && (
                  <motion.div
                    key="orbit-hover-overlay"
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Blur + grow effect on the orbit container underneath */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at center, rgba(192,38,211,0.08) 0%, rgba(2,2,16,0.55) 70%)",
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                      }}
                    />
                    <motion.div
                      className="relative flex flex-col items-center gap-3 text-center pointer-events-auto cursor-pointer"
                      initial={{ scale: 0.92, y: 8 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.92, y: 8 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      onClick={enterOrbit}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(192,38,211,0.18)",
                          border: "1.5px solid rgba(192,38,211,0.55)",
                          boxShadow: "0 0 32px rgba(192,38,211,0.45), 0 0 64px rgba(192,38,211,0.20)",
                        }}
                      >
                        <Orbit className="w-7 h-7 text-white" />
                      </div>
                      <p
                        className="text-sm font-bold tracking-widest uppercase"
                        style={{
                          color: "#fff",
                          textShadow: "0 0 20px rgba(192,38,211,0.9), 0 0 40px rgba(192,38,211,0.5)",
                          letterSpacing: "0.18em",
                        }}
                      >
                        Enter Our Orbit
                      </p>
                      <p
                        className="text-xs font-medium max-w-[180px] leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        Click to explore our services in 3D orbit view
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Orbit mode UI: service name + nav ── */}
              <AnimatePresence>
                {orbitMode && (
                  <motion.div
                    key="orbit-mode-ui"
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Active service name */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeOrbitService?.name ?? "none"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center mb-4"
                      >
                        <p className="text-xs font-bold tracking-[0.25em] uppercase mb-1"
                          style={{ color: "rgba(192,38,211,0.8)" }}>
                          {activeOrbitService?.orbit ?? ""} ring
                        </p>
                        <p className="text-lg font-black tracking-wide text-white"
                          style={{ textShadow: "0 0 20px rgba(192,38,211,0.6)" }}>
                          {activeOrbitService?.name ?? ""}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {serviceCursorIdx + 1} / {flatServices.length}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Prev / Next + Exit */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <motion.button
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          fontSize: 18,
                          opacity: serviceCursorIdx === 0 ? 0.3 : 1,
                        }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => navigateOrbit(-1)}
                        disabled={serviceCursorIdx === 0}
                      >
                        ‹
                      </motion.button>

                      <motion.button
                        className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
                        style={{
                          background: "rgba(192,38,211,0.18)",
                          border: "1px solid rgba(192,38,211,0.45)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exitOrbit}
                      >
                        Exit Orbit
                      </motion.button>

                      <motion.button
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          fontSize: 18,
                          opacity: serviceCursorIdx === flatServices.length - 1 ? 0.3 : 1,
                        }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => navigateOrbit(1)}
                        disabled={serviceCursorIdx === flatServices.length - 1}
                      >
                        ›
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

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
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(820px, 94vw)",
                background: `linear-gradient(135deg, ${orbitGlow},0.20) 0%, rgba(4,4,18,0.97) 50%, ${orbitGlow},0.07) 100%)`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
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
                      background: `${orbitGlow},0.22)`,
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      borderRadius: 999,
                      padding: "5px 12px 5px 5px",
                      border: `1px solid ${orbitGlow},0.35)`,
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: `${orbitGlow},0.25)`,
                        border: `1.5px solid ${orbitGlow},0.55)`,
                        boxShadow: `0 0 12px ${orbitGlow},0.35)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: 13, height: 13, color: "rgba(255,255,255,0.95)" }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.95)" }}
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
                    images={cardImages}
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
                    href={cardCtaLink}
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
