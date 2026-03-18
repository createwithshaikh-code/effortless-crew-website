"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/blog": "Blog Posts",
  "/admin/results": "Homepage Results",
  "/admin/portfolio": "Portfolio",
  "/admin/testimonials": "Testimonials",
  "/admin/services": "Services",
  "/admin/contact": "Contact Inbox",
  "/admin/projects": "Projects",
  "/admin/team": "Team",
  "/admin/settings": "Site Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const pageName =
    Object.entries(pageNames).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Admin";

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 h-14">
        <h1 className="font-semibold text-sm">{pageName}</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
