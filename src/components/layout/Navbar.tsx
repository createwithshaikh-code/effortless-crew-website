"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import SiteLogo from "@/components/common/SiteLogo";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [navPill, setNavPill] = useState({ left: 0, width: 0, opacity: 0 });

  const moveNavPill = useCallback((href: string) => {
    const el = navRefs.current[href];
    const container = navContainerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setNavPill({ left: eRect.left - cRect.left, width: eRect.width, opacity: 1 });
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Position pill on active nav item after mount / route change
  useEffect(() => {
    const activeLink = navLinks.find((l) => l.href === pathname);
    if (activeLink) {
      const t = setTimeout(() => moveNavPill(activeLink.href), 50);
      return () => clearTimeout(t);
    } else {
      setNavPill((p) => ({ ...p, opacity: 0 }));
    }
  }, [pathname, moveNavPill]);

  // Don't render on admin pages — MUST be after all hooks
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass-strong border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <SiteLogo />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            ref={navContainerRef}
            className="hidden lg:flex items-center p-1 rounded-2xl relative"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Liquid glass pill */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(192,38,211,0.35) 0%, rgba(37,99,235,0.28) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 4px 24px rgba(192,38,211,0.25), 0 0 40px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
              animate={{ left: navPill.left, width: navPill.width, opacity: navPill.opacity }}
              transition={{ type: "spring", stiffness: 550, damping: 38, mass: 0.7 }}
            />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => { navRefs.current[link.href] = el; }}
                onMouseEnter={() => moveNavPill(link.href)}
                onMouseLeave={() => {
                  const active = navLinks.find((l) => l.href === pathname);
                  if (active) moveNavPill(active.href);
                  else setNavPill((p) => ({ ...p, opacity: 0 }));
                }}
                className={cn(
                  "relative z-10 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                  pathname === link.href ? "text-white" : "text-white/45 hover:text-white/75"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Theme Toggle + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl glass border border-white/10 hover:border-brand/30 transition-all cursor-pointer relative"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 text-white/70 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute top-2 left-2 h-4 w-4 text-white/70 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
                boxShadow: "0 0 20px rgba(192,38,211,0.3)",
              }}
            >
              Get Started
            </Link>
            <button
              className="lg:hidden p-2 rounded-xl glass border border-white/10 hover:border-brand/30 transition-colors cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white/70" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden glass-strong border-b border-white/8"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "text-white glass border border-brand/20"
                        : "text-white/55 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 mt-1">
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)" }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
