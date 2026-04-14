"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import Orbit from "@/components/Orbit";

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);

  return (
    <div className="page-shell">
      <div id="hero-panel" className={`page-panel page-panel--hero${showOrbit ? " hidden" : ""}`}>
        <Hero onEnterOrbit={() => setShowOrbit(true)} />
      </div>
      <div className={`page-panel page-panel--orbit${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={() => setShowOrbit(false)} />
      </div>
    </div>
  );
}
