"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import { cn } from "@/lib/utils";

function highlightEC(text: string) {
  const parts = text.split("Effortless Crew");
  return parts.map((part, i) => (
    <span key={i}>{part}{i < parts.length - 1 && <span className="ec-highlight">Effortless Crew</span>}</span>
  ));
}

const testimonials = [
  {
    id: "1",
    client_name: "Alex Johnson",
    client_title: "YouTuber, 1.2M Subscribers",
    content:
      "Working with Effortless Crew completely transformed my channel. My watch time jumped by 40% in the first month. They don't just edit videos — they understand the algorithm and craft content that actually performs.",
    rating: 5,
    gradient: "from-brand-500 to-purple-600",
    avatarGlow: "rgba(192,38,211,0.4)",
  },
  {
    id: "2",
    client_name: "Sarah Chen",
    client_title: "Brand Director, TechStartup",
    content:
      "We needed a team that could match our brand's premium feel. Effortless Crew delivered beyond expectations. Every video they produce looks like it was made by a full in-house production team.",
    rating: 5,
    gradient: "from-royal-500 to-blue-400",
    avatarGlow: "rgba(37,99,235,0.4)",
  },
  {
    id: "3",
    client_name: "Marcus Williams",
    client_title: "Finance YouTuber, 450K Subs",
    content:
      "I was skeptical at first, but the results speak for themselves. My shorts started getting 5x more views after they revamped my editing style. Best investment I've made for my channel.",
    rating: 5,
    gradient: "from-purple-500 to-royal-500",
    avatarGlow: "rgba(139,92,246,0.4)",
  },
  {
    id: "4",
    client_name: "Priya Patel",
    client_title: "Lifestyle Creator, 280K Followers",
    content:
      "The turnaround time is insane. I submit raw footage on Monday and get polished, ready-to-publish content by Wednesday. And the quality never drops. They're my secret weapon.",
    rating: 5,
    gradient: "from-brand-400 to-royal-500",
    avatarGlow: "rgba(192,38,211,0.35)",
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030315]" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Ambient orbs */}
      <div className="absolute top-1/2 right-0 w-96 h-96 orb orb-magenta opacity-10 -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-96 h-96 orb orb-blue opacity-8 -translate-y-1/2" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand/20 text-brand-300 text-sm font-semibold mb-5">
            Testimonials
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            What Our Clients{" "}
            <span className="text-gradient">Say</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — hear from the creators and brands
            who&apos;ve levelled up with us.
          </p>
        </ScrollReveal>

        {/* Carousel */}
        <ScrollReveal>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] group"
                >
                  <div
                    className="glass-card border border-white/8 rounded-2xl p-6 lg:p-7 h-full flex flex-col relative overflow-hidden hover:border-brand/25 transition-all duration-300"
                    style={{ minHeight: "260px" }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                      style={{ background: `radial-gradient(circle at 0% 0%, ${testimonial.avatarGlow.replace('0.4', '0.08')} 0%, transparent 60%)` }}
                    />

                    {/* Quote icon */}
                    <Quote
                      className="w-7 h-7 mb-4 opacity-30"
                      style={{ color: testimonial.avatarGlow.replace('rgba(', 'rgb(').replace(',0.4)', ')') }}
                    />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          style={{
                            fill: "#D946EF",
                            color: "#D946EF",
                          }}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-white/55 text-sm leading-relaxed mb-6 flex-1">
                      &ldquo;{highlightEC(testimonial.content)}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${testimonial.avatarGlow.replace('0.4)', '0.3)')}, ${testimonial.avatarGlow.replace('0.4)', '0.05)')})`,
                          border: `1px solid ${testimonial.avatarGlow}`,
                        }}
                      >
                        <span
                          className="font-display font-bold text-sm"
                          style={{ color: testimonial.avatarGlow.replace('rgba(', 'rgb(').replace(',0.4)', ')') }}
                        >
                          {testimonial.client_name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-display font-semibold text-sm text-white">
                          {testimonial.client_name}
                        </div>
                        <div className="text-white/35 text-xs">
                          {testimonial.client_title}
                        </div>
                      </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-b-2xl`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full glass border border-white/10 hover:border-brand/40 flex items-center justify-center transition-all cursor-pointer hover:scale-110 text-white/50 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    emblaApi?.scrollTo(i);
                    setSelectedIndex(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    i === selectedIndex
                      ? "w-6"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                  style={i === selectedIndex ? { background: "linear-gradient(90deg, #C026D3, #2563EB)" } : {}}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full glass border border-white/10 hover:border-brand/40 flex items-center justify-center transition-all cursor-pointer hover:scale-110 text-white/50 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
