"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DynamicFavicon() {
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("favicon_url")
      .single()
      .then(({ data }) => {
        if (data?.favicon_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.favicon_url;
        }
      });
  }, []);

  return null;
}
