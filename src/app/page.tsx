"use client";
import { useState, useRef } from "react";
import Hero, { HeroHandle } from "@/components/Hero";
import Orbit from "@/components/Orbit";
import { gsap } from "gsap";

const SLIDE_MS = 700;

export default function HomePage() {
  const [showOrbit, setShowOrbit] = useState(false);
  const heroRef = useRef<HeroHandle>(null);

  const handleEnterOrbit = () => {
    heroRef.current?.exitDown();
    gsap.to("#nav", { opacity: 0, duration: 0.4, ease: "power2.in" });
    // Stars drift downward, ease to stop as solar system settles
    gsap.to("#hero-stars-wrap", { y: "30%", duration: 4.0, ease: "power2.out" });
    document.body.style.overflow = "hidden";
    // Orbit overlay slides in from above
    setTimeout(() => setShowOrbit(true), 350);
    // Cards fade in after overlay finishes sliding
    setTimeout(() => {
      gsap.to("#orbit-hud", { opacity: 1, duration: 0.5, ease: "power2.out" });
    }, 1100);
  };

  const handleExit = () => {
    // 1. Cards fade out first
    gsap.to("#orbit-hud", { opacity: 0, duration: 0.25, ease: "power2.in" });

    // 2. After cards gone, start panel transition
    setTimeout(() => {
      heroRef.current?.prepareEntrance();
      setShowOrbit(false);
      window.scrollTo({ top: 0, behavior: "instant" });

      // Stars drift back up and ease to stop — mirrors the entrance motion
      gsap.to("#hero-stars-wrap", { y: "0%", duration: 4.0, ease: "power2.out" });

      // Unlock scroll + replay entrance after orbit finishes sliding away
      setTimeout(() => {
        document.body.style.overflow = "";
        heroRef.current?.replayEntrance();
        gsap.to("#nav", { opacity: 1, duration: 0.6, ease: "power2.out" });
      }, SLIDE_MS);
    }, 100);
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
