"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SiteLogoProps {
  defaultHeight?: number;
  className?: string;
}

export default function SiteLogo({ defaultHeight = 56, className }: SiteLogoProps) {
  const [src, setSrc] = useState("/logo.png");
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("logo_url, logo_height")
      .single()
      .then(({ data }) => {
        if (data?.logo_url) setSrc(data.logo_url);
        if (data?.logo_height) setHeight(data.logo_height);
      });
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
