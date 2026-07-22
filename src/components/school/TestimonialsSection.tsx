"use client";

import { useInView } from "react-intersection-observer";
import { testimonials } from "@/data/school-data";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-gold rounded-full" />
            Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            What Parents <span className="text-gold">Say About Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Hear from the parents of our students about their experience with
            Saint Mary School and the positive impact we have made on their
            children&apos;s lives.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative ${
                inView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Quote className="w-8 h-8 text-gold/20 absolute top-4 right-4" />

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-gold fill-gold"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <span className="text-navy font-semibold text-sm">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
