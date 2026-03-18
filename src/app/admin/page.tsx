import { createServiceClient } from "@/lib/supabase/server";
import { FileText, Image, Star, Mail, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  try {
  const supabase = await createServiceClient();

  const [blogs, portfolio, testimonials, contacts] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact" }),
    supabase.from("portfolio_items").select("id", { count: "exact" }),
    supabase.from("testimonials").select("id", { count: "exact" }),
    supabase
      .from("contact_submissions")
      .select("id, name, email, service_interest, created_at, status", { count: "exact" })
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    blogCount: blogs.count ?? 0,
    portfolioCount: portfolio.count ?? 0,
    testimonialsCount: testimonials.count ?? 0,
    newContacts: contacts.count ?? 0,
    recentContacts: contacts.data ?? [],
  };
  } catch {
    return { blogCount: 0, portfolioCount: 0, testimonialsCount: 0, newContacts: 0, recentContacts: [] };
  }
}

const statCards = [
  { label: "Blog Posts", icon: FileText, href: "/admin/blog", color: "text-blue-500 bg-blue-500/10" },
  { label: "Portfolio Items", icon: Image, href: "/admin/portfolio", color: "text-purple-500 bg-purple-500/10" },
  { label: "Testimonials", icon: Star, href: "/admin/testimonials", color: "text-yellow-500 bg-yellow-500/10" },
  { label: "New Messages", icon: Mail, href: "/admin/contact", color: "text-brand bg-brand/10" },
];

export default async function AdminDashboard() {
  const stats = await getStats();
  const counts = [stats.blogCount, stats.portfolioCount, stats.testimonialsCount, stats.newContacts];

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="brand" size="sm">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4" />
            New Blog Post
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/portfolio/new">
            <Plus className="w-4 h-4" />
            New Portfolio Item
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={card.label}
            href={card.href}
            className="block p-5 rounded-xl border border-border bg-card hover:border-brand/50 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black">{counts[i]}</div>
            <div className="text-muted-foreground text-sm mt-0.5">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent contact submissions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Recent Messages</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/contact">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {stats.recentContacts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No new messages
            </div>
          ) : (
            stats.recentContacts.map((contact: {id: string; name: string; email: string; service_interest: string; created_at: string; status: string}) => (
              <div key={contact.id} className="flex items-center gap-4 p-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand text-xs font-bold">
                    {contact.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-muted-foreground text-xs truncate">
                    {contact.email} · {contact.service_interest}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-muted-foreground text-xs">
                    {formatRelativeDate(contact.created_at)}
                  </span>
                  <Badge variant="brand">New</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
