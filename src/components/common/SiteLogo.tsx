"use client";

import { useEffect, useState } from "react";

const CACHE_URL_KEY = "ec_logo_url";
const CACHE_H_KEY = "ec_logo_height";
const DEFAULT_HEIGHT = 100;

export default function SiteLogo({ className }: { className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Apply cache instantly (no flash), but only if a real URL was previously saved
    const cachedUrl = localStorage.getItem(CACHE_URL_KEY);
    const cachedH = localStorage.getItem(CACHE_H_KEY);
    if (cachedUrl) {
      setSrc(cachedUrl);
      if (cachedH) setHeight(Number(cachedH));
      // Small delay so the fade-in is perceivable even on cache hit
      setTimeout(() => setVisible(true), 60);
    }

    // Always refresh from API
    fetch("/api/admin/branding")
      .then((r) => r.json())
      .then((data) => {
        if (data.logo_url) {
          setSrc(data.logo_url);
          setHeight(data.logo_height || DEFAULT_HEIGHT);
          localStorage.setItem(CACHE_URL_KEY, data.logo_url);
          localStorage.setItem(CACHE_H_KEY, String(data.logo_height || DEFAULT_HEIGHT));
          setVisible(true);
        } else {
          // No logo set — hide and clear cache
          setSrc(null);
          setVisible(false);
          localStorage.removeItem(CACHE_URL_KEY);
          localStorage.removeItem(CACHE_H_KEY);
        }
      })
      .catch(() => {});
  }, []);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Effortless Crew"
      style={{
        height: `${height}px`,
        width: "auto",
        display: "block",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
      className={className}
    />
  );
}
