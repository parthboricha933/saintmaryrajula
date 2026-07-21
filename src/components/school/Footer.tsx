"use client";

import { SCHOOL } from "@/data/school-data";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  GraduationCap,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer id="contact" className="bg-navy text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Saint Mary School
                </h3>
                <p className="text-sm text-gray-300">Rajula, Gujarat</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {SCHOOL.tagline} Established in {SCHOOL.established}, we are
              committed to nurturing young minds through quality education and
              character development.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SCHOOL.social.facebook}
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SCHOOL.social.instagram}
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SCHOOL.social.youtube}
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SCHOOL.social.twitter}
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold text-base mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {["Home", "About Us", "Teachers", "Gallery", "Admission", "Contact Us"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "")}`}
                      className="text-gray-300 hover:text-gold text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-gold/50 rounded-full" />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-semibold text-base mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">
                  {SCHOOL.address.full}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span className="text-gray-300 text-sm">{SCHOOL.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span className="text-gray-300 text-sm">{SCHOOL.email}</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="text-gold font-semibold text-base mb-4">
              Find Us on Map
            </h4>
            <div className="w-full h-44 bg-navy-light rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={SCHOOL.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Saint Mary School Location"
                className="grayscale-[50%] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Saint Mary School, Rajula. All
            rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Designed with care for the students of Rajula
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-11 h-11 bg-gold hover:bg-gold-dark text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
