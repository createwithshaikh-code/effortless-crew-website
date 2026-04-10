"use client";

import { useRef, useEffect } from "react";

const VIDEO_DURATION = 20;   // seconds
const MIN_RATE       = 0.15;
const MAX_RATE       = 2.5;
const CATCH_UP_K     = 2.8;
const FRICTION       = 0.88; // velocity decay per frame (lower = stops faster)
const SENSITIVITY    = 0.00035; // wheel sensitivity

export default function VideoScroll() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);   // 0–1 progress
  const velRef    = useRef(0);   // current scroll velocity
  const rafRef    = useRef(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // ── Mouse wheel: normalize delta across browsers/OS and accumulate velocity ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Normalize deltaMode: pixel (Chrome) / line (Firefox) / page
      const delta =
        e.deltaMode === 1 ? e.deltaY * 16 :   // line → px
        e.deltaMode === 2 ? e.deltaY * 600 :  // page → px
        e.deltaY;                              // already px

      velRef.current += delta * SENSITIVITY;
    };

    // ── Touch: compute delta between moves ──
    let lastTouch = 0;
    const onTouchStart = (e: TouchEvent) => { lastTouch = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      const delta = lastTouch - e.touches[0].clientY;
      lastTouch   = e.touches[0].clientY;
      velRef.current += delta * SENSITIVITY * 0.6;
    };

    // ── RAF loop: apply friction to velocity, advance target, drive video ──
    const tick = () => {
      velRef.current *= FRICTION;

      // Advance virtual progress by velocity
      if (Math.abs(velRef.current) > 0.0001) {
        targetRef.current = Math.max(
          0,
          Math.min(1, targetRef.current + velRef.current)
        );
      }

      const target  = targetRef.current * VIDEO_DURATION;
      const current = v.currentTime;
      const diff    = target - current;

      if (diff > 0.05) {
        // Forward — native play (smooth decoder, no seeking)
        const rate = Math.min(MAX_RATE, Math.max(MIN_RATE, diff * CATCH_UP_K));
        v.playbackRate = rate;
        if (v.paused) v.play().catch(() => {});

      } else if (diff < -0.05) {
        // Backward — one seek (unavoidable, browsers can't play in reverse)
        if (!v.paused) v.pause();
        v.currentTime = target;

      } else {
        // Arrived — stop
        if (!v.paused) {
          v.pause();
          v.currentTime = target;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Attach to the container so it doesn't interfere with rest of page
    const el = document.documentElement;
    el.addEventListener("wheel",      onWheel,      { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true  });
    el.addEventListener("touchmove",  onTouchMove,  { passive: true  });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener("wheel",      onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "fixed", top: 0, left: 0 }}>
      <video
        ref={videoRef}
        src="/website-test.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
