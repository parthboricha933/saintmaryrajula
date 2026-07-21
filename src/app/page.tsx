"use client";

import { useState, useEffect } from "react";
import Header from "@/components/school/Header";
import Footer from "@/components/school/Footer";
import HeroSection from "@/components/school/HeroSection";
import QuickCards from "@/components/school/QuickCards";
import AboutSection from "@/components/school/AboutSection";
import FacilitiesSection from "@/components/school/FacilitiesSection";
import NoticesSection from "@/components/school/NoticesSection";
import GallerySection from "@/components/school/GallerySection";
import TeachersPage from "@/components/school/TeachersPage";
import TeacherDetailPage from "@/components/school/TeacherDetailPage";
import LoadingScreen from "@/components/school/LoadingScreen";

type View = "home" | "teachers" | "teacher-detail";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const handleNavigate = (view: string) => {
    if (view === "teachers") {
      setCurrentView("teachers");
    } else if (view === "home") {
      setCurrentView("home");
      // Small delay then scroll to section or top
      setTimeout(() => {
        const el = document.querySelector(`#${view}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      // For section-based navigation (e.g. "contact", "about"), go home first then scroll
      setCurrentView("home");
      setTimeout(() => {
        const el = document.querySelector(`#${view}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  const handleSelectTeacher = (id: number) => {
    setSelectedTeacherId(id);
    setCurrentView("teacher-detail");
  };

  const handleBackToTeachers = () => {
    setSelectedTeacherId(null);
    setCurrentView("teachers");
  };

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen flex flex-col bg-white">
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main className="flex-1">
          {currentView === "home" && (
            <>
              <HeroSection />
              <QuickCards />
              <AboutSection />
              <FacilitiesSection />
              <GallerySection />
              <NoticesSection />
            </>
          )}
          {currentView === "teachers" && (
            <TeachersPage onSelectTeacher={handleSelectTeacher} />
          )}
          {currentView === "teacher-detail" && selectedTeacherId && (
            <TeacherDetailPage
              teacherId={selectedTeacherId}
              onBack={handleBackToTeachers}
              onNavigateHome={(section) => handleNavigate(section)}
            />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
