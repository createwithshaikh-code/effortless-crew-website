"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TeamMember, TeamMemberRole } from "@/types";

const ROLES: TeamMemberRole[] = ["Video Editor", "Motion Designer", "VA", "Manager"];

const ROLE_COLORS: Record<TeamMemberRole, string> = {
  "Video Editor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Motion Designer": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "VA": "bg-green-500/10 text-green-400 border-green-500/20",
  "Manager": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [{ data: membersData }, { data: projectsData }] = await Promise.all([
        supabase.from("team_members").select("*").order("name", { ascending: true }),
        supabase
          .from("projects")
          .select("assigned_to")
          .not("status", "eq", "delivered")
          .not("status", "eq", "archived"),
      ]);
      setMembers(membersData ?? []);
      const counts: Record<string, number> = {};
      (projectsData ?? []).forEach((p: { assigned_to: string | null }) => {
        if (p.assigned_to) counts[p.assigned_to] = (counts[p.assigned_to] ?? 0) + 1;
      });
      setProjectCounts(counts);
    };
    load();
  }, []);

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) return;
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();

    const payload = {
      name: editing.name.trim(),
      role: editing.role ?? "Video Editor",
      email: editing.email?.trim() || null,
      avatar_url: editing.avatar_url?.trim() || null,
      is_active: editing.is_active ?? true,
    };

    if (editing.id) {
      // Update existing member
      await supabase.from("team_members").update(payload).eq("id", editing.id);
      setMembers((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...payload } : m))
      );
    } else {
      // Create auth account first if email provided
      if (payload.email) {
        const res = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: payload.email }),
        });
        const result = await res.json();
        if (!res.ok && !result.existed) {
          setSaveError(result.error ?? "Failed to create login account");
          setSaving(false);
          return;
        }
      }

      const { data: inserted } = await supabase
        .from("team_members")
        .insert(payload)
        .select()
        .single();
      if (inserted) setMembers((prev) => [...prev, inserted as TeamMember]);
    }
    setSaving(false);
    setEditing(null);
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this team member? Any assigned projects will become unassigned.")) return;
    const supabase = createClient();
    await supabase.from("team_members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const activeCount = members.filter((m) => m.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Team</h2>
          <p className="text-muted-foreground text-sm">
            {activeCount} active member{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={() => setEditing({ is_active: true, role: "Video Editor" })}
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">No team members yet.</p>
          <Button
            variant="brand"
            size="sm"
            onClick={() => setEditing({ is_active: true, role: "Video Editor" })}
          >
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const activeProjects = projectCounts[member.id] ?? 0;
            return (
              <div
                key={member.id}
                className={cn(
                  "bg-card border border-border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-brand/30",
                  !member.is_active && "opacity-50"
                )}
              >
                {/* Avatar + name + actions */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-lg flex-shrink-0 overflow-hidden">
                    {member.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      member.name[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{member.name}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 truncate">
                      {member.email ?? "—"}
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(member)}
                      className="cursor-pointer h-7 w-7"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMember(member.id)}
                      className="text-destructive hover:bg-destructive/10 cursor-pointer h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium border",
                      ROLE_COLORS[member.role as TeamMemberRole] ?? "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {member.role}
                  </span>
                  {activeProjects > 0 && (
                    <Badge variant="brand" className="text-xs">
                      {activeProjects} active
                    </Badge>
                  )}
                  {!member.is_active && (
                    <Badge variant="outline" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input
                value={editing?.name ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1"
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={editing?.role ?? "Video Editor"}
                onValueChange={(val) =>
                  setEditing((p) => ({ ...p, role: val as TeamMemberRole }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editing?.email ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1"
                placeholder="editor@example.com"
              />
              {!editing?.id && (
                <p className="text-muted-foreground text-xs mt-1">
                  A login account will be created with default password: <span className="font-mono font-semibold text-brand">admin</span>
                </p>
              )}
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input
                value={editing?.avatar_url ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, avatar_url: e.target.value }))
                }
                className="mt-1"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={editing?.is_active ?? true}
                onCheckedChange={(v) =>
                  setEditing((p) => ({ ...p, is_active: v }))
                }
              />
            </div>
            {saveError && (
              <p className="text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            <Button
              variant="brand"
              className="w-full"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : editing?.id ? "Update Member" : "Add Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
