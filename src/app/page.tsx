"use client";

import { useState, useEffect } from "react";
import Header from "@/components/school/Header";
import Footer from "@/components/school/Footer";
import HeroSection from "@/components/school/HeroSection";
import QuickCards from "@/components/school/QuickCards";
import AboutSection from "@/components/school/AboutSection";
import AdmissionsSection from "@/components/school/AdmissionsSection";
import NoticesSection from "@/components/school/NoticesSection";
import GallerySection from "@/components/school/GallerySection";
import EnquirySection from "@/components/school/EnquirySection";
import NoticesEventsPage from "@/components/school/NoticesEventsPage";
import AdminLogin from "@/components/school/AdminLogin";
import AdminDashboard from "@/components/school/AdminDashboard";
import TeacherLogin from "@/components/school/TeacherLogin";
import TeacherDashboard from "@/components/school/TeacherDashboard";
import LoadingScreen from "@/components/school/LoadingScreen";

type View =
  | "home"
  | "notices-page"
  | "admin"
  | "admin-dashboard"
  | "teacher-login"
  | "teacher-dashboard";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type TeacherData = {
  id: string;
  email: string;
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

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [teacherUser, setTeacherUser] = useState<TeacherData | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const handleNavigate = (view: string) => {
    if (
      view === "notices-page" ||
      view === "admin" ||
      view === "admin-dashboard" ||
      view === "teacher-login" ||
      view === "teacher-dashboard"
    ) {
      setCurrentView(view as View);
    } else if (view === "home") {
      setCurrentView("home");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      // Section-based navigation (about, contact, etc.)
      setCurrentView("home");
      setTimeout(() => {
        const el = document.querySelector(`#${view}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  const handleAdminLogin = (user: AdminUser) => {
    setAdminUser(user);
    setCurrentView("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setCurrentView("home");
  };

  const handleTeacherLogin = (teacher: TeacherData) => {
    setTeacherUser(teacher);
    setCurrentView("teacher-dashboard");
  };

  const handleTeacherLogout = () => {
    setTeacherUser(null);
    setCurrentView("home");
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
              <AdmissionsSection />
              <GallerySection />
              <NoticesSection />
              <EnquirySection />
            </>
          )}
          {currentView === "notices-page" && <NoticesEventsPage />}
          {currentView === "admin" && <AdminLogin onLogin={handleAdminLogin} />}
          {currentView === "admin-dashboard" && adminUser && (
            <AdminDashboard user={adminUser} onLogout={handleAdminLogout} />
          )}
          {currentView === "teacher-login" && (
            <TeacherLogin onLogin={handleTeacherLogin} />
          )}
          {currentView === "teacher-dashboard" && teacherUser && (
            <TeacherDashboard teacher={teacherUser} onLogout={handleTeacherLogout} />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
