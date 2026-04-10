"use client";

import { useRef, useEffect } from "react";

const VIDEO_DURATION = 20;   // seconds
const SCROLL_PER_SEC = 300;  // px of scroll per second of video
const MIN_RATE       = 0.15; // slowest playback speed
const MAX_RATE       = 2.5;  // fastest playback speed
const CATCH_UP_K     = 2.8;  // how aggressively video chases the scroll target

export default function VideoScroll() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const rafRef    = useRef(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Map scroll → target video time
    const onScroll = () => {
      const totalScroll = VIDEO_DURATION * SCROLL_PER_SEC;
      targetRef.current = Math.max(
        0,
        Math.min(VIDEO_DURATION, (window.scrollY / totalScroll) * VIDEO_DURATION)
      );
    };

    // RAF loop — video PLAYS to target (forward) or SEEKS (backward)
    const tick = () => {
      const target  = targetRef.current;
      const current = v.currentTime;
      const diff    = target - current;

      if (diff > 0.05) {
        // Forward: play at a rate proportional to the gap
        // — fast when far away, slows naturally as it approaches
        const rate = Math.min(MAX_RATE, Math.max(MIN_RATE, diff * CATCH_UP_K));
        v.playbackRate = rate;
        if (v.paused) v.play().catch(() => {});

      } else if (diff < -0.05) {
        // Backward: seek (browsers can't play in reverse natively)
        if (!v.paused) v.pause();
        v.currentTime = target;

      } else {
        // Close enough — snap and stop
        if (!v.paused) {
          v.pause();
          v.currentTime = target;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const totalHeight = VIDEO_DURATION * SCROLL_PER_SEC + window.innerHeight;

  return (
    <div style={{ height: totalHeight }}>
      <video
        ref={videoRef}
        src="/website-test.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
