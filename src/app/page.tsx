"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";

const SLIDE_MS = 1350;

function buildStarField(el: HTMLElement, count: number, color: string, size: number) {
  const S = Math.max(window.innerWidth, window.innerHeight) * 2.2;
  const shadows = Array.from({ length: count }, () => {
    const x = (Math.random() * S).toFixed(1);
    const y = (Math.random() * S).toFixed(1);
    const a = (Math.random() * 0.6 + 0.35).toFixed(2);
    return `${x}px ${y}px 0 rgba(${color},${a})`;
  }).join(",");
  el.style.cssText = `position:absolute;inset:0;width:${size}px;height:${size}px;box-shadow:${shadows};background:transparent;border-radius:50%;`;
}

function SharedStars() {
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (s1.current) buildStarField(s1.current, 900, "255,230,200", 1);
    if (s2.current) buildStarField(s2.current, 280, "255,240,210", 1.5);
    if (s3.current) buildStarField(s3.current, 100, "255,248,230", 2);
  }, []);

  return (
    <>
      <style>{`
        #shared-stars {
          position:absolute;top:50%;left:50%;
          width:220vmax;height:220vmax;
          margin-left:-110vmax;margin-top:-110vmax;
          z-index:0;transform-origin:center;
          animation:sharedStarRotate 120s linear infinite;
          pointer-events:none;
        }
        @keyframes sharedStarRotate { to { transform:rotate(-360deg); } }
        .ss { position:absolute;inset:0; }
        .ss:nth-child(1) { animation:ssTwinkle 3.5s ease-in-out infinite alternate; }
        .ss:nth-child(2) { animation:ssTwinkle 4.8s ease-in-out infinite alternate-reverse; }
        .ss:nth-child(3) { animation:ssTwinkle 2.9s ease-in-out infinite alternate; }
        @keyframes ssTwinkle { from { filter:brightness(1); } to { filter:brightness(0.5); } }
      `}</style>
      <div id="shared-stars">
        <div className="ss" ref={s1} />
        <div className="ss" ref={s2} />
        <div className="ss" ref={s3} />
      </div>
    </>
  );
}

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    heroRef.current?.exitDown();
    // nudge stars down 5% as CTA is pressed
    gsap.to("#shared-stars", { y: "5%", duration: 0.8, ease: "power2.out" });
    setTimeout(() => setShowOrbit(true), 350);
  };

  const handleExit = () => {
    setShowOrbit(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    // restore stars position
    gsap.to("#shared-stars", { y: "0%", duration: 1.0, ease: "power2.out" });
    setTimeout(() => {
      heroRef.current?.replayEntrance();
    }, SLIDE_MS);
  };

  return (
    <div className="page-shell">
      {/* Always-mounted star field behind both panels */}
      <SharedStars />

      <div id="hero-panel" className={`page-panel page-panel--hero${showOrbit ? " hidden" : ""}`}>
        <Hero ref={heroRef} onEnterOrbit={handleEnterOrbit} />
      </div>
      <div className={`page-panel page-panel--orbit${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={handleExit} />
      </div>
    </div>
  );
}
