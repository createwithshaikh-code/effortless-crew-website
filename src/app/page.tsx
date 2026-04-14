"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import Orbit from "@/components/Orbit";

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Hero — slides down when orbit opens */}
      <div style={{
        position: "absolute", inset: 0,
        transform: showOrbit ? "translateY(100vh)" : "translateY(0)",
        transition: "transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
        zIndex: showOrbit ? 0 : 1,
      }}>
        <Hero onEnterOrbit={() => setShowOrbit(true)} />
      </div>

      {/* Orbit — slides in from above */}
      <div style={{
        position: "absolute", inset: 0,
        transform: showOrbit ? "translateY(0)" : "translateY(-100vh)",
        transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
        zIndex: showOrbit ? 1 : 0,
      }}>
        <Orbit onExit={() => setShowOrbit(false)} />
      </div>
    </div>
  );
}
