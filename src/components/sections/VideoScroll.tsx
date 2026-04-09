"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ── Section timestamps (seconds) ──
const SECTIONS = [
  { id: 1, end: 4  },
  { id: 2, end: 7  },
  { id: 3, end: 15 },
  { id: 4, end: 20 },
];

// Cubic ease-in-out
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Animate video.currentTime from `from` to `to` over `duration` ms
function animateTime(
  video: HTMLVideoElement,
  from: number,
  to: number,
  duration: number,
  onDone?: () => void
): () => void {
  let raf = 0;
  const start = performance.now();

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    video.currentTime = from + (to - from) * easeInOut(t);
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export default function VideoScroll() {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const activeRef     = useRef<number>(0);
  const cancelAnim    = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  // When video metadata loads, seek to 0 and mark ready
  const onLoaded = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setReady(true);
  }, []);

  // Animate to the target section
  const goToSection = useCallback((idx: number) => {
    const v = videoRef.current;
    if (!v) return;
    cancelAnim.current(); // cancel any running animation

    const target = SECTIONS[idx].end;
    const from   = v.currentTime;
    const dist   = Math.abs(target - from);

    // Duration scales slightly with distance but stays in 800–1800ms range
    const duration = Math.max(800, Math.min(1800, dist * 120));

    cancelAnim.current = animateTime(v, from, target, duration);
  }, []);

  // Observe each section div — when it enters viewport, trigger animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ready) return;

    const sections = container.querySelectorAll<HTMLElement>("[data-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.section);
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              goToSection(idx);
            }
          }
        });
      },
      { root: container, threshold: 0.55 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ready, goToSection]);

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
      {/* Fixed full-screen video */}
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

      {/* Loading overlay — shown until video metadata ready */}
      {!ready && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            background: "#020210",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            width: 40, height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(192,38,211,0.2)",
            borderTopColor: "#C026D3",
            animation: "spin 0.8s linear infinite",
          }} />
        </div>
      )}

      {/* 4 snap sections — each 100vh, transparent, just for scroll detection */}
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
