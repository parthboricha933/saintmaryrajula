"use client";

import { useInView } from "react-intersection-observer";
import { SCHOOL } from "@/data/school-data";
import { GraduationCap, Users, BookOpen, CheckCircle } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Students" },
  { icon: BookOpen, value: "13+", label: "Years" },
  { icon: CheckCircle, value: "100%", label: "Results" },
  { icon: GraduationCap, value: "GSEB", label: "Affiliated" },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image side */}
          <div
            className={`relative ${
              inView ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/hero-school.jpg"
                alt="Students at Saint Mary School"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 sm:right-4 bg-white rounded-xl shadow-xl p-4 sm:p-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy">
                    {SCHOOL.established}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Year Established
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div
            className={`${
              inView ? "animate-slide-in-right" : "opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-gold rounded-full" />
              About Our School
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 leading-tight">
              Nurturing Young Minds{" "}
              <span className="text-gold">Since 2011</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
              {SCHOOL.about}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-secondary rounded-xl p-3 sm:p-4 text-center hover:bg-gold/5 transition-colors"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold mx-auto mb-2" />
                    <p className="text-lg sm:text-xl font-bold text-navy">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
