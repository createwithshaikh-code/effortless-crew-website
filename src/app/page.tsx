"use client";
import { useState, useRef } from "react";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";
import { gsap } from "gsap";

const SLIDE_MS = 1350;

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    heroRef.current?.exitDown();
    // nudge stars down 5%
    gsap.to("#hero-stars", { y: "5%", duration: 0.8, ease: "power2.out" });
    setTimeout(() => setShowOrbit(true), 350);
  };

  const handleExit = () => {
    setShowOrbit(false);
    document.getElementById("hero-panel")?.scrollTo({ top: 0, behavior: "instant" });
    // restore stars
    gsap.to("#hero-stars", { y: "0%", duration: 1.0, ease: "power2.out" });
    setTimeout(() => {
      heroRef.current?.replayEntrance();
    }, SLIDE_MS);
  };

  return (
    <div className="page-shell">
      <div id="hero-panel" className={`page-panel page-panel--hero${showOrbit ? " hidden" : ""}`}>
        <Hero ref={heroRef} onEnterOrbit={handleEnterOrbit} />
      </div>
      <div className={`page-panel page-panel--orbit${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={handleExit} />
      </div>
    </div>
  );
}
