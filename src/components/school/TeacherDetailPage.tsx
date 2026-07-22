"use client";

import { teachers } from "@/data/school-data";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  Verified,
  MessageSquare,
  Languages,
  ChevronLeft,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherDetailPage({
  teacherId,
  onBack,
  onNavigateHome,
}: {
  teacherId: number;
  onBack: () => void;
  onNavigateHome?: (section: string) => void;
}) {
  const teacher = teachers.find((t) => t.id === teacherId);

  if (!teacher) {
    return (
      <div className="pt-28 sm:pt-32 pb-16 bg-secondary/30 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-lg">Teacher not found.</p>
          <Button
            variant="outline"
            onClick={onBack}
            className="mt-4 text-navy hover:text-gold hover:bg-gold/5"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-16 lg:pb-24 bg-secondary/30 min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-navy hover:text-gold hover:bg-gold/5 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Teachers
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header section */}
          <div className="bg-navy p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
              {/* Teacher photo */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-gold/30">
                <User className="w-20 h-20 text-white/40" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {teacher.name}
                </h1>
                <p className="text-gold font-medium text-sm sm:text-base mb-3">
                  {teacher.designation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                    <BookOpen className="w-4 h-4 text-gold" />
                    {teacher.subject}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                    <GraduationCap className="w-4 h-4 text-gold" />
                    {teacher.qualification}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                    <Clock className="w-4 h-4 text-gold" />
                    {teacher.experience} Years Experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Short intro */}
            <div className="bg-gold/5 rounded-xl p-5 border border-gold/10">
              <p className="text-navy text-sm sm:text-base leading-relaxed italic">
                &ldquo;{teacher.shortIntro}&rdquo;
              </p>
            </div>

            {/* Languages */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy mb-3">
                <Languages className="w-5 h-5 text-gold" />
                Languages Known
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.languages.split(", ").map((lang) => (
                  <span
                    key={lang}
                    className="bg-secondary text-navy text-sm font-medium px-3 py-1.5 rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Teaching Philosophy */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-navy mb-3">
                <MessageSquare className="w-5 h-5 text-gold" />
                Teaching Philosophy
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {teacher.teachingPhilosophy}
              </p>
            </div>

            {/* Two column: Achievements & Certifications */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Achievements */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-navy mb-4">
                  <Award className="w-5 h-5 text-gold" />
                  Achievements
                </h3>
                <ul className="space-y-3">
                  {teacher.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3"
                    >
                      <span className="w-2 h-2 bg-gold rounded-full mt-1.5 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-navy mb-4">
                  <Verified className="w-5 h-5 text-gold" />
                  Certifications & Qualifications
                </h3>
                <ul className="space-y-3">
                  {teacher.certifications.map((cert, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3"
                    >
                      <span className="w-2 h-2 bg-green-accent rounded-full mt-1.5 shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact section (optional) */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-navy mb-1">
                    <Mail className="w-5 h-5 text-gold" />
                    Get in Touch
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Reach out through the school office for any queries related
                    to {teacher.subject}.
                  </p>
                </div>
                <Button
                  className="bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl shadow-md"
                  onClick={() => {
                    if (onNavigateHome) {
                      onNavigateHome("contact");
                    } else {
                      document
                        .querySelector("#contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Contact School
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
