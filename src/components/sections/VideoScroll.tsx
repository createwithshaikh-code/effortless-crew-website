"use client";

import { useRef, useEffect, useCallback } from "react";

// ── Section timestamps (seconds) ──
const SECTIONS = [
  { id: 1, end: 4  },
  { id: 2, end: 7  },
  { id: 3, end: 15 },
  { id: 4, end: 20 },
];

// Smooth ease-in-out (quartic — more gradual than cubic)
function easeInOut(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

// Animate video.currentTime from `from` to `to` over `duration` ms
function animateTime(
  video: HTMLVideoElement,
  from: number,
  to: number,
  duration: number,
): () => void {
  let raf = 0;
  const start = performance.now();

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    video.currentTime = from + (to - from) * easeInOut(t);
    if (t < 1) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export default function VideoScroll() {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef    = useRef<number>(0);
  const cancelAnim   = useRef<() => void>(() => {});
  const triggerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoaded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.currentTime = 0;
  }, []);

  // Animate to the target section — slow and deliberate
  const goToSection = useCallback((idx: number) => {
    const v = videoRef.current;
    if (!v) return;
    cancelAnim.current();

    const target   = SECTIONS[idx].end;
    const from     = v.currentTime;
    const dist     = Math.abs(target - from);

    // Slower: 180ms per second of video, clamped 1400–3500ms
    const duration = Math.max(1400, Math.min(3500, dist * 180));

    cancelAnim.current = animateTime(v, from, target, duration);
  }, []);

  // IntersectionObserver — only fires when section is 90% in view
  // + a 120ms debounce so rapid scroll doesn't trigger mid-snap
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

            // Clear any pending trigger — wait for scroll to settle
            if (triggerTimer.current) clearTimeout(triggerTimer.current);
            triggerTimer.current = setTimeout(() => {
              activeRef.current = idx;
              goToSection(idx);
            }, 120);
          }
        });
      },
      { root: container, threshold: 0.9 } // 90% visible before triggering
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
      {/* Fixed full-screen video — just sits there, no loading state */}
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

      {/* 4 snap sections — each 100vh, transparent, scroll detection only */}
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
