"use client";

import { useInView } from "react-intersection-observer";
import { facilities } from "@/data/school-data";
import {
  BookOpen,
  Computer,
  Trees,
  Palette,
  Camera,
  Leaf,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Computer,
  Trees,
  Palette,
  Camera,
  Leaf,
};

export default function FacilitiesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-green-accent/10 text-green-accent rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-green-accent rounded-full" />
            Our Facilities
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            School <span className="text-gold">Facilities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Our school is equipped with modern facilities to provide a
            comprehensive and enriching educational experience for every student.
          </p>
        </div>

        {/* Facilities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {facilities.map((facility, index) => {
            const Icon = iconMap[facility.icon];
            return (
              <div
                key={facility.title}
                className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/20 transition-all duration-300 group flex items-start gap-4 ${
                  inView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gold/10 shrink-0 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  {Icon && (
                    <Icon className="w-7 h-7 text-gold group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-navy mb-1.5">
                    {facility.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
