"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Starter",
    tagline: "Perfect for getting started",
    monthly: 499,
    yearly: 399,
    features: [
      { text: "4 videos per month", included: true },
      { text: "Up to 10 min each", included: true },
      { text: "Color grading", included: true },
      { text: "Custom titles", included: true },
      { text: "2 revisions per video", included: true },
      { text: "7-day turnaround", included: true },
      { text: "Motion graphics", included: false },
      { text: "Shorts/Reels", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    tagline: "For growing creators",
    monthly: 999,
    yearly: 799,
    features: [
      { text: "8 videos per month", included: true },
      { text: "Up to 20 min each", included: true },
      { text: "Color grading", included: true },
      { text: "Custom titles & animations", included: true },
      { text: "Unlimited revisions", included: true },
      { text: "3-day turnaround", included: true },
      { text: "Motion graphics package", included: true },
      { text: "4 Shorts/Reels", included: true },
      { text: "Priority support", included: false },
    ],
    cta: "Start with Pro",
    featured: true,
  },
  {
    name: "Agency",
    tagline: "For brands & high-volume creators",
    monthly: 2499,
    yearly: 1999,
    features: [
      { text: "20+ videos per month", included: true },
      { text: "Unlimited length", included: true },
      { text: "Advanced color grading", included: true },
      { text: "Full motion graphics kit", included: true },
      { text: "Unlimited revisions", included: true },
      { text: "24-48hr turnaround", included: true },
      { text: "Unlimited Shorts/Reels", included: true },
      { text: "Dedicated editor", included: true },
      { text: "Priority support (24/7)", included: true },
    ],
    cta: "Talk to Us",
    featured: false,
  },
];

const faqs = [
  {
    question: "How does the process work?",
    answer: "You submit your raw footage via Google Drive or WeTransfer. We edit and send you a preview link. You leave comments, we revise. Final files are delivered in your preferred format.",
  },
  {
    question: "What formats do you deliver in?",
    answer: "We deliver in MP4 (H.264 or H.265) by default. We can accommodate any format — MOV, ProRes, etc. Just let us know.",
  },
  {
    question: "Do you offer one-off projects?",
    answer: "Yes! While our packages are subscription-based for consistent creators, we also do one-off projects. Contact us with your brief and we'll quote you.",
  },
  {
    question: "Can I change my plan?",
    answer: "Absolutely. You can upgrade, downgrade, or cancel anytime. No lock-in contracts.",
  },
  {
    question: "What if I need more videos than my plan includes?",
    answer: "We can add extra videos at a per-video rate. Just reach out and we'll sort it out.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <Badge variant="brand" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            No surprises. No hidden fees. Pick the plan that fits your needs and
            start growing your channel.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
                !isYearly ? "bg-brand text-white" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-2",
                isYearly ? "bg-brand text-white" : "text-muted-foreground"
              )}
            >
              Yearly
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isYearly ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
              )}>
                Save 20%
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.name} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 lg:p-8 h-full transition-all",
                  pkg.featured
                    ? "border-brand bg-brand/5 shadow-xl shadow-brand/10 scale-105"
                    : "border-border bg-card hover:border-brand/50"
                )}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="brand" className="shadow-lg">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{pkg.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{pkg.tagline}</p>
                  <div className="flex items-end gap-1">
                    <motion.span
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-black"
                    >
                      ${isYearly ? pkg.yearly : pkg.monthly}
                    </motion.span>
                    <span className="text-muted-foreground text-sm mb-1">/month</span>
                  </div>
                  {isYearly && (
                    <p className="text-green-500 text-xs mt-1">
                      Save ${(pkg.monthly - pkg.yearly) * 12}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2.5 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-brand flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span className={!feature.included ? "text-muted-foreground/50" : ""}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={pkg.featured ? "brand" : "brand-outline"}
                  size="lg"
                  className="w-full"
                >
                  <Link href="/contact">
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* FAQ */}
        <ScrollReveal className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {faq.question}
                  <span className={cn(
                    "text-muted-foreground transition-transform ml-4 flex-shrink-0",
                    openFaq === i && "rotate-180"
                  )}>
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
