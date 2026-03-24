"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Image,
  Star,
  Wrench,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  LayoutGrid,
  Clapperboard,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "Homepage Results",
    href: "/admin/results",
    icon: LayoutGrid,
  },
  {
    label: "Portfolio",
    href: "/admin/portfolio",
    icon: Image,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: Star,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    label: "Inbox",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Clapperboard,
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [newMsgCount, setNewMsgCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .then(({ count }) => setNewMsgCount(count ?? 0));

    // Realtime — refetch count on any change
    const channel = supabase
      .channel("sidebar_msg_count")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, async () => {
        const { count } = await supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        setNewMsgCount(count ?? 0);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="hidden lg:flex w-60 flex-col bg-card border-r border-border min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image src="/logo.png" alt="Effortless Crew" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <div className="font-bold text-sm">EffortlessCrew</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive(item)
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/contact" && newMsgCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold">
                {newMsgCount > 99 ? "99+" : newMsgCount}
              </span>
            )}
            <ChevronRight
              className={cn(
                "w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity",
                isActive(item) && "opacity-50"
              )}
            />
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
