"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, CalendarDays, ExternalLink, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus, ProjectPriority, TeamMember } from "@/types";

const STATUSES: { key: ProjectStatus; label: string; color: string; dotColor: string }[] = [
  { key: "brief_received",  label: "Brief Received",  color: "bg-slate-500/10 text-slate-400 border-slate-500/20",   dotColor: "bg-slate-400" },
  { key: "in_production",   label: "In Production",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20",      dotColor: "bg-blue-400" },
  { key: "under_review",    label: "Under Review",    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dotColor: "bg-yellow-400" },
  { key: "revisions",       label: "Revisions",       color: "bg-orange-500/10 text-orange-400 border-orange-500/20", dotColor: "bg-orange-400" },
  { key: "delivered",       label: "Delivered",       color: "bg-green-500/10 text-green-400 border-green-500/20",    dotColor: "bg-green-400" },
];

const PRIORITY_COLORS: Record<ProjectPriority, string> = {
  low:    "bg-slate-500/10 text-slate-400",
  normal: "bg-blue-500/10 text-blue-400",
  high:   "bg-orange-500/10 text-orange-400",
  urgent: "bg-red-500/10 text-red-500",
};

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  teamMembers,
  onClick,
  onStatusChange,
  onDragStart,
}: {
  project: Project;
  teamMembers: TeamMember[];
  onClick: () => void;
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
}) {
  const assignedMember =
    (project.team_member as TeamMember | null) ??
    teamMembers.find((tm) => tm.id === project.assigned_to) ??
    null;

  const isOverdue =
    project.deadline &&
    new Date(project.deadline) < new Date() &&
    project.status !== "delivered";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      className="bg-card border border-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-brand/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:opacity-60 active:scale-95"
      onClick={onClick}
    >
      {/* Drag handle + priority + service */}
      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0 -ml-1" />
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase",
            PRIORITY_COLORS[project.priority]
          )}
        >
          {project.priority}
        </span>
        {project.service_type && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
            {project.service_type}
          </span>
        )}
      </div>

      {/* Title + client */}
      <div className="font-medium text-sm leading-snug mb-0.5 line-clamp-2">
        {project.title}
      </div>
      <div className="text-muted-foreground text-xs mb-3">{project.client_name}</div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {project.deadline && (
            <span
              className={cn(
                "text-[10px] flex items-center gap-0.5",
                isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"
              )}
            >
              <CalendarDays className="w-3 h-3" />
              {new Date(project.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {assignedMember && (
            <div
              className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand text-[9px] font-bold flex-shrink-0"
              title={assignedMember.name}
            >
              {assignedMember.name[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Inline status select — stops propagation */}
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={project.status}
            onValueChange={(val) => onStatusChange(project.id, val as ProjectStatus)}
          >
            <SelectTrigger className="h-6 text-[10px] px-2 w-auto gap-1 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.key} value={s.key} className="text-xs">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProjectsClient({
  initialProjects,
  teamMembers,
}: {
  initialProjects: Project[];
  teamMembers: TeamMember[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<ProjectStatus | null>(null);

  // ── Drag & Drop ────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData("projectId", projectId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const projectId = e.dataTransfer.getData("projectId");
    if (!projectId) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.status === status) return;
    await updateStatus(projectId, status);
  };

  // ── Status update ──────────────────────────────────────────────────
  const updateStatus = async (projectId: string, status: ProjectStatus) => {
    const supabase = createClient();
    await supabase.from("projects").update({ status }).eq("id", projectId);
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
    setSelectedProject((p) => (p?.id === projectId ? { ...p, status } : p));
  };

  // ── Save (create / update) ─────────────────────────────────────────
  const handleSave = async () => {
    if (!editingProject) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      title: editingProject.title ?? "",
      client_name: editingProject.client_name ?? "",
      client_email: editingProject.client_email ?? null,
      service_type: editingProject.service_type ?? null,
      status: editingProject.status ?? "brief_received",
      priority: editingProject.priority ?? "normal",
      deadline: editingProject.deadline ?? null,
      assigned_to: editingProject.assigned_to ?? null,
      raw_footage_url: editingProject.raw_footage_url ?? null,
      deliverable_url: editingProject.deliverable_url ?? null,
      notes: editingProject.notes ?? null,
    };

    if (editingProject.id) {
      await supabase.from("projects").update(payload).eq("id", editingProject.id);
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...payload } : p))
      );
    } else {
      const { data: inserted } = await supabase
        .from("projects")
        .insert(payload)
        .select("*, team_member:team_members(*)")
        .single();
      if (inserted) setProjects((prev) => [inserted as Project, ...prev]);
    }

    setSaving(false);
    setEditingProject(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  const totalActive = projects.filter(
    (p) => p.status !== "delivered" && p.status !== "archived"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-muted-foreground text-sm">
            {totalActive} active · {projects.length} total
          </p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={() =>
            setEditingProject({ status: "brief_received", priority: "normal" })
          }
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto -mx-6 px-6 pb-4">
        <div className="flex gap-4 min-w-max">
          {STATUSES.map((col) => {
            const colProjects = projects.filter((p) => p.status === col.key);
            const isDragTarget = dragOverColumn === col.key;

            return (
              <div
                key={col.key}
                className="w-72 flex-shrink-0"
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      col.color
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", col.dotColor)} />
                    {col.label}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">
                    {colProjects.length}
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  className={cn(
                    "space-y-3 min-h-[120px] rounded-xl transition-all duration-150 p-1 -m-1",
                    isDragTarget && "bg-brand/5 ring-2 ring-brand/20 ring-dashed"
                  )}
                >
                  {colProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      teamMembers={teamMembers}
                      onClick={() => setSelectedProject(project)}
                      onStatusChange={updateStatus}
                      onDragStart={handleDragStart}
                    />
                  ))}
                  {colProjects.length === 0 && (
                    <div
                      className={cn(
                        "border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-xs transition-colors",
                        isDragTarget && "border-brand/40 text-brand/60"
                      )}
                    >
                      {isDragTarget ? "Drop here" : "No projects"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Dialog ──────────────────────────────────────────── */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>{selectedProject?.client_name}</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              {/* Status pills */}
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => updateStatus(selectedProject.id, s.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
                      selectedProject.status === s.key
                        ? "bg-brand text-white border-brand"
                        : "border-border text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", selectedProject.status === s.key ? "bg-white" : s.dotColor)} />
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Priority</div>
                  <div className="capitalize font-medium">{selectedProject.priority}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Service Type</div>
                  <div>{selectedProject.service_type ?? "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Client Email</div>
                  {selectedProject.client_email ? (
                    <a href={`mailto:${selectedProject.client_email}`} className="text-brand hover:underline">
                      {selectedProject.client_email}
                    </a>
                  ) : <span>—</span>}
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Deadline</div>
                  <div>
                    {selectedProject.deadline
                      ? new Date(selectedProject.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Assigned To</div>
                  <div>
                    {(selectedProject.team_member as TeamMember | null)?.name ??
                      teamMembers.find((tm) => tm.id === selectedProject.assigned_to)?.name ??
                      "—"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Created</div>
                  <div>
                    {new Date(selectedProject.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Links */}
              {(selectedProject.raw_footage_url || selectedProject.deliverable_url) && (
                <div className="flex gap-4 flex-wrap">
                  {selectedProject.raw_footage_url && (
                    <a href={selectedProject.raw_footage_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-brand underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Raw Footage
                    </a>
                  )}
                  {selectedProject.deliverable_url && (
                    <a href={selectedProject.deliverable_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-brand underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Deliverable
                    </a>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedProject.notes && (
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Notes</div>
                  <p className="text-sm bg-muted/50 rounded-lg p-3 leading-relaxed">{selectedProject.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingProject(selectedProject);
                  setSelectedProject(null);
                }}>
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteProject(selectedProject.id)}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Create / Edit Dialog ───────────────────────────────────── */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject?.id ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Project Title *</Label>
              <Input
                value={editingProject?.title ?? ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, title: e.target.value }))}
                className="mt-1"
                placeholder="e.g. YouTube Long-form Edit — March"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Client Name *</Label>
                <Input
                  value={editingProject?.client_name ?? ""}
                  onChange={(e) => setEditingProject((p) => ({ ...p, client_name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={editingProject?.client_email ?? ""}
                  onChange={(e) => setEditingProject((p) => ({ ...p, client_email: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Status</Label>
                <Select
                  value={editingProject?.status ?? "brief_received"}
                  onValueChange={(val) => setEditingProject((p) => ({ ...p, status: val as ProjectStatus }))}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={editingProject?.priority ?? "normal"}
                  onValueChange={(val) => setEditingProject((p) => ({ ...p, priority: val as ProjectPriority }))}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["low", "normal", "high", "urgent"] as ProjectPriority[]).map((pr) => (
                      <SelectItem key={pr} value={pr} className="capitalize">{pr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service Type</Label>
                <Input
                  value={editingProject?.service_type ?? ""}
                  onChange={(e) => setEditingProject((p) => ({ ...p, service_type: e.target.value }))}
                  placeholder="Long-form"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Deadline</Label>
                <Input
                  type="datetime-local"
                  value={editingProject?.deadline ? editingProject.deadline.slice(0, 16) : ""}
                  onChange={(e) =>
                    setEditingProject((p) => ({
                      ...p,
                      deadline: e.target.value ? new Date(e.target.value).toISOString() : null,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Assigned To</Label>
                <Select
                  value={editingProject?.assigned_to ?? "none"}
                  onValueChange={(val) =>
                    setEditingProject((p) => ({ ...p, assigned_to: val === "none" ? null : val }))
                  }
                >
                  <SelectTrigger className="mt-1"><SelectValue placeholder="— None —" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {teamMembers.map((tm) => (
                      <SelectItem key={tm.id} value={tm.id}>
                        {tm.name} ({tm.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Raw Footage URL</Label>
              <Input
                value={editingProject?.raw_footage_url ?? ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, raw_footage_url: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Deliverable URL</Label>
              <Input
                value={editingProject?.deliverable_url ?? ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, deliverable_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editingProject?.notes ?? ""}
                onChange={(e) => setEditingProject((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="mt-1"
                placeholder="Internal notes..."
              />
            </div>

            <Button variant="brand" className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingProject?.id ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
