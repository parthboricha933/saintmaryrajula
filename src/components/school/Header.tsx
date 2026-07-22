"use client";

import { useState, useEffect } from "react";
import { SCHOOL } from "@/data/school-data";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const navItems = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Teachers", href: "teachers" },
  { label: "Gallery", href: "gallery" },
  { label: "Notices", href: "notices-page" },
  { label: "Enquiry", href: "enquiry" },
  { label: "Contact", href: "contact" },
];

const separateViews = ["teachers", "notices-page", "admin", "teacher-login"];

export default function Header({ onNavigate, currentView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    // Separate full-page views
    if (separateViews.includes(href)) {
      onNavigate(href);
      return;
    }

    // If on a different view, go home first then scroll
    if (currentView !== "home") {
      onNavigate("home");
      setTimeout(() => {
        const el = document.querySelector(`#${href}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return;
    }

    // On home view, just scroll
    const el = document.querySelector(`#${href}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (href: string) => {
    if (separateViews.includes(href) && currentView === href) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      {/* Top bar */}
      <div className="bg-navy text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              {SCHOOL.phone}
            </span>
            <span>{SCHOOL.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold-light font-medium">
              GSEB Affiliated | Est. {SCHOOL.established}
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            <img
              src="/school-logo.png"
              alt="Saint Mary School Logo"
              className="w-11 h-11 lg:w-13 lg:h-13 rounded-xl shadow-md object-contain"
            />
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-navy leading-tight">
                Saint Mary School
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Rajula, Gujarat
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(item.href)
                    ? "text-gold bg-gold/10"
                    : "text-navy-light hover:text-gold hover:bg-gold/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              className="ml-2 bg-green-accent hover:bg-green-accent/90 text-white font-semibold px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
              onClick={() => handleNavClick("teacher-login")}
            >
              Teacher
            </Button>
            <Button
              className="ml-1 bg-gold hover:bg-gold-dark text-white font-semibold px-5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
              onClick={() => handleNavClick("admin")}
            >
              Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-navy rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left px-4 py-3 font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "text-gold bg-gold/5"
                    : "text-navy-light hover:bg-gold/5 hover:text-gold"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <Button
                className="w-full bg-green-accent hover:bg-green-accent/90 text-white font-semibold rounded-lg text-sm mb-2"
                onClick={() => handleNavClick("teacher-login")}
              >
                Teacher Panel
              </Button>
              <Button
                className="w-full bg-navy hover:bg-navy-light text-white font-semibold rounded-lg text-sm"
                onClick={() => handleNavClick("admin")}
              >
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
