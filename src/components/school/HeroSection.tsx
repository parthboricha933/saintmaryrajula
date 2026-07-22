"use client";

import { SCHOOL } from "@/data/school-data";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-school.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/80 to-navy-dark/70" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 lg:pt-36">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Logo and badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <img src="/school-logo.png" alt="Saint Mary School Logo" className="w-5 h-5 rounded-full object-contain" />
              <span className="text-sm text-gray-200 font-medium">
                GSEB Affiliated | Since {SCHOOL.established}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">
              {SCHOOL.name}
              <span className="block text-gold text-xl sm:text-2xl lg:text-3xl font-semibold mt-2">
                {SCHOOL.location}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gold-light font-medium mb-6 italic">
              &ldquo;{SCHOOL.tagline}&rdquo;
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              A premier educational institution nurturing young minds from{" "}
              {SCHOOL.classes}. We blend traditional values with modern teaching
              to create confident, knowledgeable, and responsible citizens of
              tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                onClick={() => {
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Admission Open
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-all"
                onClick={() => {
                  document
                    .querySelector("#about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore School
              </Button>
            </div>
          </div>

          {/* Right decorative card */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gold/20 rounded-2xl flex items-center justify-center mb-6 p-2">
                  <img src="/school-logo.png" alt="Saint Mary School Logo" className="w-20 h-20 object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Saint Mary School
                </h3>
                <p className="text-gold-light text-sm font-medium mb-4">
                  Rajula, Gujarat
                </p>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p className="flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 bg-gold rounded-full" />
                    GSEB Affiliated
                  </p>
                  <p className="flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 bg-green-accent rounded-full" />
                    Nursery to Class 8
                  </p>
                  <p className="flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Safe Campus
                  </p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gold text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                Est. {SCHOOL.established}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
