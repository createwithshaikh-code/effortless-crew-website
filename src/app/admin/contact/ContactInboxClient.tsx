"use client";

import { useState } from "react";
import { formatRelativeDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/types";

const statusOptions: ContactSubmission["status"][] = ["new", "read", "replied", "archived"];

const statusColors: Record<ContactSubmission["status"], string> = {
  new: "brand",
  read: "secondary",
  replied: "success",
  archived: "outline",
};

export default function ContactInboxClient({
  submissions,
}: {
  submissions: ContactSubmission[];
}) {
  const [localSubmissions, setLocalSubmissions] = useState(submissions);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<ContactSubmission["status"] | "all">("all");

  const filtered =
    filter === "all"
      ? localSubmissions
      : localSubmissions.filter((s) => s.status === filter);

  const updateStatus = async (id: string, status: ContactSubmission["status"]) => {
    const supabase = createClient();
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setLocalSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    if (selected?.id === id) setSelected((p) => p ? { ...p, status } : p);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Company", "Service", "Budget", "Message", "Status", "Date"];
    const rows = localSubmissions.map((s) => [
      s.name, s.email, s.company ?? "", s.service_interest, s.budget_range,
      s.message.replace(/,/g, ";"), s.status, s.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(["all", ...statusOptions] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize cursor-pointer",
                filter === s
                  ? "bg-brand text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No messages found
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((submission) => (
              <button
                key={submission.id}
                onClick={() => {
                  setSelected(submission);
                  if (submission.status === "new") updateStatus(submission.id, "read");
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left cursor-pointer",
                  submission.status === "new" && "bg-brand/5"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand text-sm font-bold">
                    {submission.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{submission.name}</span>
                    {submission.status === "new" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs truncate">
                    {submission.service_interest} · {submission.budget_range}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-muted-foreground text-xs hidden sm:block">
                    {formatRelativeDate(submission.created_at)}
                  </span>
                  <Badge variant={statusColors[submission.status] as "brand" | "secondary" | "success" | "outline"}>
                    {submission.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Email</div>
                  <a href={`mailto:${selected.email}`} className="text-brand hover:underline">
                    {selected.email}
                  </a>
                </div>
                {selected.company && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-0.5">Company</div>
                    <div>{selected.company}</div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Service</div>
                  <div>{selected.service_interest}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Budget</div>
                  <div>{selected.budget_range}</div>
                </div>
              </div>

              <div>
                <div className="text-muted-foreground text-xs mb-1">Message</div>
                <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-3">
                  {selected.message}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer",
                      selected.status === s
                        ? "bg-brand text-white"
                        : "bg-muted hover:bg-accent"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
