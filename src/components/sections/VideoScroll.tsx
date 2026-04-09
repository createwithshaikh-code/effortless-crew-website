"use client";

import { useRef, useEffect, useCallback } from "react";

// ── Section end timestamps (seconds) ──
const SECTIONS = [
  { id: 1, end: 4  },
  { id: 2, end: 7  },
  { id: 3, end: 15 },
  { id: 4, end: 20 },
];

// How fast the video plays between sections (1 = normal speed, 0.5 = half speed)
const PLAYBACK_RATE = 0.5;

export default function VideoScroll() {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef    = useRef<number>(0);
  const targetRef    = useRef<number>(0);
  const triggerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoaded = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.playbackRate = PLAYBACK_RATE;
  }, []);

  // Play video toward target — pause when it arrives
  const goToSection = useCallback((idx: number) => {
    const v = videoRef.current;
    if (!v) return;

    const target = SECTIONS[idx].end;
    targetRef.current = target;

    const current = v.currentTime;
    if (Math.abs(current - target) < 0.05) return;

    // Play forward or backward
    if (target > current) {
      v.playbackRate = PLAYBACK_RATE;
    } else {
      // Browsers don't support negative playbackRate natively —
      // seek directly for backward (one-time seek, not frame-by-frame)
      v.currentTime = target;
      return;
    }

    v.play().catch(() => {});
  }, []);

  // Monitor playback — pause when we reach the target
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      const target = targetRef.current;
      if (v.currentTime >= target && !v.paused) {
        v.pause();
        v.currentTime = target;
      }
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // IntersectionObserver — snap sections trigger goToSection
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
