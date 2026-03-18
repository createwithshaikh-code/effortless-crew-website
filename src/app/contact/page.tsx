"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

const services = [
  "Long Form Video Editing",
  "Short Form / Reels",
  "YouTube Automation",
  "Motion Graphics",
  "Thumbnail Design",
  "Other",
];

const budgets = [
  "Under $500/month",
  "$500 – $1,000/month",
  "$1,000 – $2,500/month",
  "$2,500 – $5,000/month",
  "$5,000+/month",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">
            Thanks for reaching out! We&apos;ll review your project details and
            get back to you within 24 hours.
          </p>
          <Button variant="brand" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-sm font-medium mb-4"
          >
            <MessageSquare className="w-4 h-4" />
            Get In Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black mb-4"
          >
            Let&apos;s Work Together
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Tell us about your project and we&apos;ll get back to you within 24
            hours with a custom plan.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-card border border-border rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Alex Johnson"
                  className="mt-1.5"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company / Channel Name</Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="Optional"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Service Needed *</Label>
                <Select onValueChange={(v) => setValue("service_interest", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service_interest && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.service_interest.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Monthly Budget *</Label>
                <Select onValueChange={(v) => setValue("budget_range", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.budget_range && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.budget_range.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="message">Tell Us About Your Project *</Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Describe what you need — channel type, upload frequency, style references, any specific requirements..."
                rows={5}
                className="mt-1.5"
              />
              {errors.message && (
                <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>

          {/* Contact info */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Or email us directly at{" "}
              <a
                href="mailto:hello@effortlesscrew.com"
                className="text-brand hover:underline font-medium"
              >
                hello@effortlesscrew.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
