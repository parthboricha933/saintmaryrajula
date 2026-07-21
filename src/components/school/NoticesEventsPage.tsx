"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Megaphone,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
} from "lucide-react";

type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  active: boolean;
};

type SchoolEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  endTime: string | null;
  venue: string;
  category: string;
  active: boolean;
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: string;
  active: boolean;
  createdAt: string;
};

const categoryColors: Record<string, string> = {
  Event: "bg-blue-100 text-blue-700",
  Holiday: "bg-green-100 text-green-700",
  Academic: "bg-amber-100 text-amber-700",
  General: "bg-gray-100 text-gray-700",
  Celebration: "bg-purple-100 text-purple-700",
  Sports: "bg-emerald-100 text-emerald-700",
  Cultural: "bg-pink-100 text-pink-700",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  normal: "bg-blue-100 text-blue-700 border-blue-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const eventCategoryColors: Record<string, string> = {
  Celebration: "bg-purple-100 text-purple-700",
  Sports: "bg-emerald-100 text-emerald-700",
  Academic: "bg-amber-100 text-amber-700",
  Cultural: "bg-pink-100 text-pink-700",
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

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

type Tab = "notices" | "events" | "announcements";

export default function NoticesEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notices");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/notices").then((r) => r.json()),
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/announcements").then((r) => r.json()),
    ])
      .then(([noticesData, eventsData, announcementsData]) => {
        setNotices(noticesData);
        setEvents(eventsData);
        setAnnouncements(announcementsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "notices", label: "Notices", icon: Bell },
    { key: "events", label: "Events", icon: Calendar },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 lg:pb-24 min-h-screen bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Bell className="w-3.5 h-3.5" />
            Stay Updated
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-3">
            Notice Board, <span className="text-gold">Events</span> & Announcements
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Stay informed about the latest school notices, upcoming events, and
            important announcements from Saint Mary School.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gold text-white shadow-md"
                    : "bg-white text-navy hover:bg-gold/10 hover:text-gold border border-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.key === "notices" && notices.length > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-navy/10 text-navy"
                    }`}
                  >
                    {notices.length}
                  </span>
                )}
                {tab.key === "events" && events.length > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-navy/10 text-navy"
                    }`}
                  >
                    {events.length}
                  </span>
                )}
                {tab.key === "announcements" && announcements.length > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-navy/10 text-navy"
                    }`}
                  >
                    {announcements.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        ) : (
          <>
            {/* NOTICES TAB */}
            {activeTab === "notices" && (
              <div className="space-y-4 animate-fade-in">
                {notices.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No notices at the moment.</p>
                  </div>
                ) : (
                  notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/20 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
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
                              <Clock className="w-3 h-3" />
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
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold shrink-0 mt-1 transition-colors hidden sm:block" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 animate-fade-in">
                {events.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No upcoming events.</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/20 transition-all duration-300 group"
                    >
                      {/* Date badge */}
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 bg-gold/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-gold leading-none">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-[10px] text-gold-dark font-medium uppercase">
                            {new Date(event.date).toLocaleString("en-IN", { month: "short" })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span
                            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1.5 ${
                              eventCategoryColors[event.category] || eventCategoryColors.General
                            }`}
                          >
                            {event.category}
                          </span>
                          <h3 className="text-base font-semibold text-navy group-hover:text-gold transition-colors leading-snug">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          {formatTime(event.date)}
                          {event.endTime && ` - ${formatTime(event.endTime)}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ANNOUNCEMENTS TAB */}
            {activeTab === "announcements" && (
              <div className="space-y-4 animate-fade-in">
                {announcements.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Megaphone className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No announcements at the moment.</p>
                  </div>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
                        ann.priority === "high"
                          ? "border-red-200 border-l-4 border-l-red-400"
                          : "border-gray-100 hover:border-gold/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            ann.priority === "high"
                              ? "bg-red-50"
                              : "bg-gold/10"
                          }`}
                        >
                          <Megaphone
                            className={`w-5 h-5 ${
                              ann.priority === "high" ? "text-red-500" : "text-gold"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                                priorityColors[ann.priority] || priorityColors.normal
                              }`}
                            >
                              {ann.priority === "high" ? "Important" : "Update"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(ann.createdAt)}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold text-navy mb-1.5">
                            {ann.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
