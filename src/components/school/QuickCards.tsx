"use client";

import { useInView } from "react-intersection-observer";
import { quickCards } from "@/data/school-data";
import {
  CalendarDays,
  Award,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarDays,
  Award,
  GraduationCap,
  ShieldCheck,
};

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  navy: {
    bg: "bg-navy/5",
    icon: "text-navy",
    border: "border-navy/10",
  },
  gold: {
    bg: "bg-gold/5",
    icon: "text-gold",
    border: "border-gold/10",
  },
  green: {
    bg: "bg-green-accent/5",
    icon: "text-green-accent",
    border: "border-green-accent/10",
  },
};

export default function QuickCards() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {quickCards.map((card, index) => {
          const Icon = iconMap[card.icon];
          const colors = colorMap[card.color] || colorMap.navy;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg border ${colors.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
                inView
                  ? "animate-fade-in-up"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}
              >
                {Icon && <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-navy mb-1">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
