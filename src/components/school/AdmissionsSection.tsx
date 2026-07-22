"use client";

import { useInView } from "react-intersection-observer";
import {
  GraduationCap,
  Baby,
  Palette,
  Pencil,
  ClipboardList,
  BookOpen,
  Ruler,
  Microscope,
  Trophy,
  FileText,
  Camera,
  CreditCard,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const gradeLevels = [
  { icon: Baby, name: "Play House", age: "Age 2.5 – 3.5 yrs", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { icon: Palette, name: "Nursery", age: "Age 3.5 – 4.5 yrs", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { icon: Pencil, name: "Junior KG", age: "Age 4.5 – 5.5 yrs", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: ClipboardList, name: "Senior KG", age: "Age 5.5 – 6.5 yrs", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { icon: BookOpen, name: "Standard 1", age: "Age 6+ yrs", color: "bg-green-50 text-green-600 border-green-100" },
  { icon: Ruler, name: "Standard 2", age: "Age 7+ yrs", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: Microscope, name: "Standard 3 – 5", age: "Primary Section", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: Trophy, name: "Standard 6 – 8", age: "Middle Section", color: "bg-navy/5 text-navy border-navy/10" },
];

const admissionRequirements = [
  { icon: FileText, text: "Birth Certificate of the child" },
  { icon: FileText, text: "Transfer Certificate (if applicable)" },
  { icon: ClipboardList, text: "Previous school report card" },
  { icon: Camera, text: "Passport-size photographs (4 nos.)" },
  { icon: CreditCard, text: "Aadhar Card of child & parent" },
  { icon: UserCheck, text: "Caste Certificate (if applicable)" },
];

export default function AdmissionsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="admissions" className="py-16 lg:py-24 bg-secondary/50">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <div
          className={`text-center mb-10 lg:mb-14 ${
            inView ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            Admissions Open 2026–27
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            Join Our <span className="text-gold">School</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We welcome students from Play House through Standard 8. Give your child the best start with quality English-medium education in a nurturing environment.
          </p>
        </div>

        {/* Grade levels grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-12 ${
            inView ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {gradeLevels.map((grade) => {
            const Icon = grade.icon;
            return (
              <div
                key={grade.name}
                className={`bg-white rounded-xl p-4 sm:p-5 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center ${grade.color}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${grade.color.split(" ")[0]}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${grade.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-navy mb-1">
                  {grade.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {grade.age}
                </p>
              </div>
            );
          })}
        </div>

        {/* Admission requirements */}
        <div
          className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${
            inView ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-navy p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              Admission Requirements
            </h3>
            <p className="text-sm text-white/70">
              Our admission process is simple and transparent. We welcome all children in our school family.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {admissionRequirements.map((req) => {
                const Icon = req.icon;
                return (
                  <div
                    key={req.text}
                    className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-sm text-navy font-medium leading-snug">
                      {req.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base font-semibold text-navy mb-1">
                  Seats are limited. Secure your child&apos;s future today.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Contact us or visit our school office for more information.
                </p>
              </div>
              <Button
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm shrink-0"
                onClick={() => {
                  const el = document.querySelector("#enquiry");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
