"use client";

import { useRef, useEffect } from "react";

const VIDEO_DURATION = 20;  // seconds
const SCROLL_PER_SEC = 300; // px of scroll per second of video — increase to slow down

export default function VideoScroll() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const targetRef   = useRef(0);   // where scroll says we should be
  const displayRef  = useRef(0);   // where the video actually is (smoothed)
  const rafRef      = useRef(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Smooth follow loop — lerp displayTime toward targetTime every frame
    const tick = () => {
      const diff = targetRef.current - displayRef.current;

      // Only seek if there's a meaningful difference (avoids pointless seeks)
      if (Math.abs(diff) > 0.001) {
        displayRef.current += diff * 0.04; // lower = more inertia, softer stop
        v.currentTime = displayRef.current;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Map scroll position → video time
    const onScroll = () => {
      const totalScroll = VIDEO_DURATION * SCROLL_PER_SEC;
      const progress    = Math.max(0, Math.min(1, window.scrollY / totalScroll));
      targetRef.current = progress * VIDEO_DURATION;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Total page height = enough scroll distance for the full video
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
