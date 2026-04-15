"use client";
import { useState, useRef } from "react";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";
import { gsap } from "gsap";

const SLIDE_MS = 1500;

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    heroRef.current?.exitDown();
    gsap.to("#hero-stars", { y: "5%", duration: 0.8, ease: "power2.out" });
    document.body.style.overflow = "hidden";
    setTimeout(() => setShowOrbit(true), 350);
  };

  const handleExit = () => {
    heroRef.current?.prepareEntrance();
    setShowOrbit(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    gsap.to("#hero-stars", { y: "0%", duration: 1.0, ease: "power2.out" });
    setTimeout(() => {
      document.body.style.overflow = "";
      heroRef.current?.replayEntrance();
    }, SLIDE_MS);
  };

  return (
    <>
      <Hero ref={heroRef} onEnterOrbit={handleEnterOrbit} />
      <div className={`orbit-overlay${showOrbit ? " visible" : ""}`}>
        <Orbit onExit={handleExit} />
      </div>
    </>
  );
}
