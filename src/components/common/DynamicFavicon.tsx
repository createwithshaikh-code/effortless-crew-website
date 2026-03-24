"use client";

import { useEffect } from "react";

export default function DynamicFavicon() {
  useEffect(() => {
    fetch("/api/admin/branding")
      .then((r) => r.json())
      .then((data) => {
        if (data.favicon_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.favicon_url;
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
