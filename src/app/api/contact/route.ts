import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;

    const supabase = await createServiceClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      service_interest: data.service_interest,
      budget_range: data.budget_range,
      message: data.message,
      status: "new",
      ip_address: ip,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Send email notification via Resend (if configured)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
            to: process.env.RESEND_TO_EMAIL ?? "team@effortlesscrew.com",
            subject: `New Contact: ${data.name} — ${data.service_interest}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
              <p><strong>Service:</strong> ${data.service_interest}</p>
              <p><strong>Budget:</strong> ${data.budget_range}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
            `,
          }),
        });
      } catch {
        // Email is optional - don't fail the request
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
