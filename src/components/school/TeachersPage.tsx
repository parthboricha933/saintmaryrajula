"use client";

import { teachers } from "@/data/school-data";
import {
  GraduationCap,
  BookOpen,
  Clock,
  User,
} from "lucide-react";

export default function TeachersPage({
  onSelectTeacher,
}: {
  onSelectTeacher: (id: number) => void;
}) {
  return (
    <div className="pt-28 sm:pt-32 pb-16 lg:pb-24 bg-secondary/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            Our Faculty
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-3">
            Meet Our <span className="text-gold">Teachers</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Our dedicated team of qualified educators is committed to providing
            the best learning experience for every student. Click on a teacher to
            view their detailed profile.
          </p>
        </div>

        {/* Teachers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {teachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => onSelectTeacher(teacher.id)}
            >
              {/* Photo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-navy/5 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden group-hover:bg-gold/10 transition-colors">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-navy/30 group-hover:text-gold/50 transition-colors" />
              </div>

              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-navy group-hover:text-gold transition-colors mb-0.5">
                  {teacher.name}
                </h3>
                <p className="text-xs sm:text-sm text-gold font-medium mb-1">
                  {teacher.designation}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {teacher.subject}
                </p>

                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {teacher.qualification}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {teacher.experience} yrs
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {teacher.shortIntro}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
