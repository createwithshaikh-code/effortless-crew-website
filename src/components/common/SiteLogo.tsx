"use client";

import { useEffect, useState } from "react";

const CACHE_URL_KEY = "ec_logo_url";
const CACHE_H_KEY = "ec_logo_height";
const DEFAULT_HEIGHT = 35;
const DEFAULT_SRC = "/logo.png";

export default function SiteLogo({ className }: { className?: string }) {
  // Start from localStorage cache instantly — no flash
  const [src, setSrc] = useState(DEFAULT_SRC);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Apply cache before paint so there is zero visible jump
    const cachedUrl = localStorage.getItem(CACHE_URL_KEY);
    const cachedH = localStorage.getItem(CACHE_H_KEY);
    if (cachedUrl) setSrc(cachedUrl);
    if (cachedH) setHeight(Number(cachedH));
    setReady(true);

    // Refresh from API in background
    fetch("/api/admin/branding")
      .then((r) => r.json())
      .then((data) => {
        const url = data.logo_url || DEFAULT_SRC;
        const h = data.logo_height || DEFAULT_HEIGHT;
        setSrc(url);
        setHeight(h);
        localStorage.setItem(CACHE_URL_KEY, url);
        localStorage.setItem(CACHE_H_KEY, String(h));
      })
      .catch(() => {});
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Effortless Crew"
      style={{
        height: `${height}px`,
        width: "auto",
        display: "block",
        // Hide until cache is read to avoid the 1-frame default flash
        visibility: ready ? "visible" : "hidden",
      }}
      className={className}
    />
  );
}
