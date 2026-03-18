import { createServiceClient } from "@/lib/supabase/server";
import ContactInboxClient from "./ContactInboxClient";

export default async function AdminContactPage() {
  const supabase = await createServiceClient();
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contact Inbox</h2>
        <p className="text-muted-foreground text-sm">
          {submissions?.filter((s) => s.status === "new").length ?? 0} new messages
        </p>
      </div>
      <ContactInboxClient submissions={submissions ?? []} />
    </div>
  );
}
