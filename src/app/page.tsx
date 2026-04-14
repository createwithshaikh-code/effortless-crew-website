"use client";
import { useState, useRef } from "react";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";

const SLIDE_MS = 1350; // matches CSS transition duration

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    // animate hero elements down first, then slide the panel
    heroRef.current?.exitDown();
    setTimeout(() => setShowOrbit(true), 350);
  };

  const handleExit = () => {
    setShowOrbit(false);
    // scroll hero-panel back to top instantly
    document.getElementById("hero-panel")?.scrollTo({ top: 0, behavior: "instant" });
    // replay entrance after panel slides back into view
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
