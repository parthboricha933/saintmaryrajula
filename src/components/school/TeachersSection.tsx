"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DBTeacher = {
  id: string;
  name: string;
  designation: string;
  subject: string;
  qualification: string;
  experience: number;
  languages: string;
  shortIntro: string;
  teachingPhilosophy: string;
  photo: string | null;
  status: string;
};

type DisplayTeacher = {
  id: string;
  name: string;
  designation: string;
  subject: string;
  qualification: string;
  experience: number;
  languages: string;
  shortIntro: string;
  teachingPhilosophy: string;
  photo: string | null;
  achievements: string[];
  certifications: string[];
  hasStaticData: boolean;
};

function TeacherCard({
  teacher,
  index,
  inView,
  onSelect,
}: {
  teacher: DisplayTeacher;
  index: number;
  inView: boolean;
  onSelect: (t: DisplayTeacher) => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${
        inView ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onSelect(teacher)}
    >
      {/* Photo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-navy/5 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden group-hover:bg-gold/10 transition-colors">
        {teacher.photo ? (
          <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-navy/30 group-hover:text-gold/50 transition-colors" />
        )}
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

        {teacher.shortIntro && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {teacher.shortIntro}
          </p>
        )}
      </div>
    </div>
  );
}

function TeacherProfile({
  teacher,
  onBack,
}: {
  teacher: DisplayTeacher;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-navy p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border-2 border-gold/30 overflow-hidden">
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white/40" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {teacher.name}
                </h2>
                <p className="text-gold font-medium text-sm sm:text-base mb-2">
                  {teacher.designation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-gold" />
                    {teacher.subject}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-gold" />
                    {teacher.qualification}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" />
                    {teacher.experience} Years Experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Languages */}
            {teacher.languages && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                  <Languages className="w-5 h-5 text-gold" />
                  Languages Known
                </h3>
                <p className="text-muted-foreground text-sm">{teacher.languages}</p>
              </div>
            )}

            {/* Short Intro */}
            {teacher.shortIntro && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                  <MessageSquare className="w-5 h-5 text-gold" />
                  Introduction
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{teacher.shortIntro}</p>
              </div>
            )}

            {/* Teaching Philosophy */}
            {teacher.teachingPhilosophy && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                  <Award className="w-5 h-5 text-gold" />
                  Teaching Philosophy
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {teacher.teachingPhilosophy}
                </p>
              </div>
            )}

            {/* Achievements */}
            {teacher.achievements && teacher.achievements.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-3">
                  <Award className="w-5 h-5 text-gold" />
                  Achievements
                </h3>
                <ul className="space-y-2">
                  {teacher.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-gold rounded-full mt-1.5 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {teacher.certifications && teacher.certifications.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-3">
                  <Verified className="w-5 h-5 text-gold" />
                  Certifications & Qualifications
                </h3>
                <ul className="space-y-2">
                  {teacher.certifications.map((cert, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-green-accent rounded-full mt-1.5 shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeachersSection() {
  const [selectedTeacher, setSelectedTeacher] = useState<DisplayTeacher | null>(null);
  const [dbTeachers, setDbTeachers] = useState<DBTeacher[]>([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    // Fetch approved teachers from database
    fetch("/api/teachers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbTeachers(data);
        }
      })
      .catch(err => console.error("Error fetching teachers:", err));
  }, []);

  // Build unified display teacher list: merge static teachers with DB data
  const displayTeachers: DisplayTeacher[] = [];

  // First, add all static teachers — override with DB data if a match exists
  for (const staticT of teachers) {
    const dbMatch = dbTeachers.find(dbT => dbT.name === staticT.name);
    displayTeachers.push({
      id: dbMatch ? dbMatch.id : String(staticT.id),
      name: dbMatch?.name || staticT.name,
      designation: dbMatch?.designation || staticT.designation,
      subject: dbMatch?.subject || staticT.subject,
      qualification: dbMatch?.qualification || staticT.qualification,
      experience: dbMatch?.experience || staticT.experience,
      languages: dbMatch?.languages || staticT.languages,
      shortIntro: dbMatch?.shortIntro || staticT.shortIntro,
      teachingPhilosophy: dbMatch?.teachingPhilosophy || staticT.teachingPhilosophy,
      photo: dbMatch?.photo || null,
      achievements: staticT.achievements || [],
      certifications: staticT.certifications || [],
      hasStaticData: true,
    });
  }

  // Then, add DB-only teachers (no matching static teacher)
  for (const dbT of dbTeachers) {
    const alreadyAdded = displayTeachers.some(dt => dt.id === dbT.id);
    if (!alreadyAdded) {
      displayTeachers.push({
        id: dbT.id,
        name: dbT.name,
        designation: dbT.designation || "Teacher",
        subject: dbT.subject || "General",
        qualification: dbT.qualification || "",
        experience: dbT.experience || 0,
        languages: dbT.languages || "",
        shortIntro: dbT.shortIntro || "",
        teachingPhilosophy: dbT.teachingPhilosophy || "",
        photo: dbT.photo || null,
        achievements: [],
        certifications: [],
        hasStaticData: false,
      });
    }
  }

  return (
    <section id="teachers" className="py-16 lg:py-24 bg-secondary/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedTeacher ? (
          <TeacherProfile
            teacher={selectedTeacher}
            onBack={() => setSelectedTeacher(null)}
          />
        ) : (
          <>
            {/* Section header */}
            <div className="text-center mb-10 lg:mb-14">
              <div className="inline-flex items-center gap-2 bg-navy/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                Our Faculty
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
                Meet Our <span className="text-gold">Teachers</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Our dedicated team of qualified educators is committed to
                providing the best learning experience for every student. Click
                on a teacher to view their detailed profile.
              </p>
            </div>

            {/* Teachers grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {displayTeachers.map((teacher, index) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  index={index}
                  inView={inView}
                  onSelect={setSelectedTeacher}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
