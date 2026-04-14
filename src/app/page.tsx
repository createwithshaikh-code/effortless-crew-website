"use client";
import { useState, useRef } from "react";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";

const SLIDE_MS = 1350; // matches CSS transition duration

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    heroRef.current?.exitDown();
    setTimeout(() => setShowOrbit(true), 350);
  };

  const handleExit = () => {
    setShowOrbit(false);
    // scroll body back to top so ScrollTrigger resets to start
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => {
      heroRef.current?.replayEntrance();
    }, SLIDE_MS);
  };

  return (
    <div className="page-shell">
      {/* Spacer gives body its scroll height — hidden when orbit is active */}
      <div className={`hero-scroll-spacer${showOrbit ? " hidden" : ""}`} />

      <div className={`page-panel page-panel--hero${showOrbit ? " hidden" : ""}`}>
        <Hero ref={heroRef} onEnterOrbit={handleEnterOrbit} />
      </div>
      <div className={`page-panel page-panel--orbit${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={handleExit} />
      </div>
    </div>
  );
}
