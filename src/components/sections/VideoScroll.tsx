"use client";

import { useRef, useEffect, useCallback } from "react";

// ── Section end timestamps (seconds) ──
const SECTIONS = [
  { id: 1, end: 4  },
  { id: 2, end: 7  },
  { id: 3, end: 15 },
  { id: 4, end: 20 },
];

const RATE_MAX  = 1.0;  // full speed in the middle
const RATE_MIN  = 0.25; // slowest at start and end of each section transition
const EASE_WIN  = 0.8;  // seconds of video over which ease-in / ease-out happens

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function VideoScroll() {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef    = useRef<number>(0);
  const targetRef    = useRef<number>(0);
  const startRef     = useRef<number>(0); // currentTime when this transition began
  const triggerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoaded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.currentTime = 0;
  }, []);

  const goToSection = useCallback((idx: number) => {
    const v = videoRef.current;
    if (!v) return;

    const target = SECTIONS[idx].end;
    targetRef.current = target;

    const current = v.currentTime;
    if (Math.abs(current - target) < 0.05) return;

    if (target > current) {
      // Forward — play with ease-in/out rate control
      startRef.current  = current;
      v.playbackRate    = RATE_MIN; // start slow
      v.play().catch(() => {});
    } else {
      // Backward — browsers can't play in reverse, so seek instantly
      v.pause();
      v.currentTime = target;
    }
  }, []);

  // On every timeupdate, adjust playbackRate for ease-in / ease-out
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      const target  = targetRef.current;
      const start   = startRef.current;
      const current = v.currentTime;

      if (v.paused) return;

      // Distance from where we started (ease-in)
      const fromStart = current - start;
      // Distance to target (ease-out)
      const toTarget  = target - current;

      // If we've passed or reached the target — stop
      if (toTarget <= 0) {
        v.pause();
        v.currentTime = target;
        return;
      }

      // Ease-in: ramp from RATE_MIN → RATE_MAX over EASE_WIN seconds
      const easeIn  = lerp(RATE_MIN, RATE_MAX, fromStart / EASE_WIN);
      // Ease-out: ramp from RATE_MAX → RATE_MIN as we approach target
      const easeOut = lerp(RATE_MIN, RATE_MAX, toTarget  / EASE_WIN);

      // Apply the slower of the two (whichever phase is dominant)
      v.playbackRate = Math.min(easeIn, easeOut, RATE_MAX);
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // IntersectionObserver — 90% visible threshold, 100ms debounce
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll<HTMLElement>("[data-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.section);
            if (idx === activeRef.current) return;

            if (triggerTimer.current) clearTimeout(triggerTimer.current);
            triggerTimer.current = setTimeout(() => {
              activeRef.current = idx;
              goToSection(idx);
            }, 100);
          }
        });
      },
      { root: container, threshold: 0.9 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      if (triggerTimer.current) clearTimeout(triggerTimer.current);
    };
  }, [goToSection]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        src="/website-test.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={onLoaded}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {SECTIONS.map((section, i) => (
        <div
          key={section.id}
          data-section={i}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            position: "relative",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}
