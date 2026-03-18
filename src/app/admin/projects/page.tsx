import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./ProjectsClient";
import type { Project, TeamMember } from "@/types";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: teamMembers }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, team_member:team_members(*)")
      .order("created_at", { ascending: false }),
    supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true }),
  ]);

  return (
    <ProjectsClient
      initialProjects={(projects as Project[]) ?? []}
      teamMembers={(teamMembers as TeamMember[]) ?? []}
    />
  );
}
