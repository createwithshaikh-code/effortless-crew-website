"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import Orbit from "@/components/Orbit";

const TRANSITION_MS = 1350; // matches CSS transition duration

export default function HomePage() {
  const [showOrbit, setShowOrbit]   = useState(false);
  const [heroKey,   setHeroKey]     = useState(0);

  const handleExit = () => {
    setShowOrbit(false);
    // wait for slide transition, then reset scroll + remount Hero so entrance replays
    setTimeout(() => {
      document.getElementById("hero-panel")?.scrollTo({ top: 0, behavior: "instant" });
      setHeroKey(k => k + 1);
    }, TRANSITION_MS);
  };

  return (
    <div className="page-shell">
      <div id="hero-panel" className={`page-panel page-panel--hero${showOrbit ? " hidden" : ""}`}>
        <Hero key={heroKey} onEnterOrbit={() => setShowOrbit(true)} />
      </div>
      <div className={`page-panel page-panel--orbit${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={handleExit} />
      </div>
    </div>
  );
}
