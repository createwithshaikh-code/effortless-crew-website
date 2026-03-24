"use client";

import { useEffect, useState } from "react";

interface SiteLogoProps {
  defaultHeight?: number;
  className?: string;
}

export default function SiteLogo({ defaultHeight = 48, className }: SiteLogoProps) {
  const [src, setSrc] = useState("/logo.png");
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    fetch("/api/admin/branding")
      .then((r) => r.json())
      .then((data) => {
        if (data.logo_url) setSrc(data.logo_url);
        if (data.logo_height) setHeight(data.logo_height);
      })
      .catch(() => {});
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Effortless Crew"
      style={{ height: `${height}px`, width: "auto", display: "block" }}
      className={className}
    />
  );
}
