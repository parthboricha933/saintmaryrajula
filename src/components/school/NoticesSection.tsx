"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Bell, Calendar, ChevronRight, ArrowRight } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  active: boolean;
};

const categoryColors: Record<string, string> = {
  Event: "bg-blue-100 text-blue-700",
  Holiday: "bg-green-100 text-green-700",
  Academic: "bg-amber-100 text-amber-700",
  General: "bg-gray-100 text-gray-700",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch("/api/notices")
      .then((r) => r.json())
      .then(setNotices)
      .catch(console.error);
  }, []);

  // Show only the 3 latest on the home page
  const displayNotices = notices.slice(0, 3);

  return (
    <section id="notices" className="py-16 lg:py-24 bg-secondary/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Bell className="w-3.5 h-3.5" />
            Latest Notices
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            Notice <span className="text-gold">Board</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Stay updated with the latest announcements, events, and important
            information from Saint Mary School.
          </p>
        </div>

        {/* Notices list */}
        <div className="max-w-3xl mx-auto space-y-4">
          {displayNotices.map((notice, index) => (
            <div
              key={notice.id}
              className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/20 transition-all duration-300 group cursor-pointer ${
                inView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          categoryColors[notice.category] || categoryColors.General
                        }`}
                      >
                        {notice.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notice.date)}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-1.5 group-hover:text-gold transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        {notices.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const navEl = document.querySelector('[data-nav="notices-page"]') as HTMLElement;
                if (navEl) navEl.click();
                else window.location.hash = "notices-page";
              }}
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium text-sm transition-colors group"
            >
              View All Notices, Events & Announcements
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
