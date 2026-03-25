import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Zap, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import AnimatedCounter from "@/components/common/AnimatedCounter";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind Effortless Crew — video editing experts passionate about helping creators grow.",
};

const values = [
  {
    icon: Heart,
    title: "Creator-First",
    description: "We started as creators ourselves. Every decision we make is guided by what actually helps channels grow.",
  },
  {
    icon: Zap,
    title: "Speed Without Sacrifice",
    description: "Fast turnarounds don't mean cutting corners. We've built systems that let us deliver premium quality fast.",
  },
  {
    icon: Users,
    title: "Long-Term Partners",
    description: "We're not a one-time service. We become part of your team, learning your brand voice and growing with you.",
  },
  {
    icon: Target,
    title: "Results Obsessed",
    description: "We measure success by your growth. Views, retention, subscribers — we care about what actually matters.",
  },
];

const stats = [
  { value: "500", suffix: "+", label: "Videos Edited" },
  { value: "50", suffix: "+", label: "Clients Served" },
  { value: "100", suffix: "M+", label: "Views Generated" },
  { value: "3", suffix: "+", label: "Years Experience" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <Badge variant="brand" className="mb-4">Our Story</Badge>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              Built by Creators,
              <br />
              <span className="text-gradient">for Creators</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed mb-8">
              <span className="ec-highlight">Effortless Crew</span> was born from a simple frustration: finding a
              video editor who actually understood the YouTube algorithm, the
              importance of hooks, and what it takes to make content that
              doesn&apos;t just look good — but performs.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We&apos;ve spent years editing for top creators and brands across
              all niches. We know what makes viewers click, stay, and come back.
              And we bring that knowledge to every project we touch.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-4xl font-black text-brand mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <Badge variant="brand" className="mb-4">What We Stand For</Badge>
            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Our Core Values
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-brand/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-black mb-4">Ready to Work Together?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Let&apos;s talk about your project and see if we&apos;re the right
              fit for your channel or brand.
            </p>
            <Button asChild variant="brand" size="lg">
              <Link href="/contact">
                Get In Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
