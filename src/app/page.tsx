"use client";

import Header from "@/components/school/Header";
import Footer from "@/components/school/Footer";
import HeroSection from "@/components/school/HeroSection";
import QuickCards from "@/components/school/QuickCards";
import AboutSection from "@/components/school/AboutSection";
import WhyChooseSection from "@/components/school/WhyChooseSection";
import FacilitiesSection from "@/components/school/FacilitiesSection";
import NoticesSection from "@/components/school/NoticesSection";
import TestimonialsSection from "@/components/school/TestimonialsSection";
import TeachersSection from "@/components/school/TeachersSection";
import GallerySection from "@/components/school/GallerySection";
import LoadingScreen from "@/components/school/LoadingScreen";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <QuickCards />
          <AboutSection />
          <WhyChooseSection />
          <FacilitiesSection />
          <TeachersSection />
          <GallerySection />
          <NoticesSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
