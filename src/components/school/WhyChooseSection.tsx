"use client";

import { useInView } from "react-intersection-observer";
import { whyChooseCards } from "@/data/school-data";
import {
  UserCheck,
  Monitor,
  Trophy,
  Lightbulb,
  Shield,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCheck,
  Monitor,
  Trophy,
  Lightbulb,
  Shield,
  Sparkles,
};

export default function WhyChooseSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 lg:py-24 bg-secondary/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-gold rounded-full" />
            Why Choose Us
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            Why Choose <span className="text-gold">Saint Mary School?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            We provide a nurturing environment where every child can thrive
            academically, physically, and emotionally. Here are the pillars of
            our educational excellence.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {whyChooseCards.map((card, index) => {
            const Icon = iconMap[card.icon];
            return (
              <div
                key={card.title}
                className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/20 hover:-translate-y-0.5 transition-all duration-300 group ${
                  inView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-navy/5 group-hover:bg-gold/10 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  {Icon && (
                    <Icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
