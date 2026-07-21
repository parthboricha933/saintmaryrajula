"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  LogOut,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminUser = { id: string; email: string; name: string; role: string };

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

type AdminTab = "notices" | "events" | "announcements";

const noticeCategories = ["General", "Academic", "Event", "Holiday"];
const eventCategories = ["General", "Celebration", "Sports", "Academic", "Cultural"];
const priorityOptions = ["normal", "high"];

export default function AdminDashboard({
  user,
  onLogout,
}: {
  user: AdminUser;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("notices");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, eRes, aRes] = await Promise.all([
        fetch("/api/notices"),
        fetch("/api/events"),
        fetch("/api/announcements"),
      ]);
      setNotices(await nRes.json());
      setEvents(await eRes.json());
      setAnnouncements(await aRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- Notices CRUD ---
  const saveNotice = async () => {
    const payload = {
      ...(editingItem ? { id: editingItem } : {}),
      title: form.title || "",
      content: form.content || "",
      category: form.category || "General",
      date: form.date || new Date().toISOString(),
      active: form.active !== "false",
    };

    const res = await fetch("/api/notices", {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showStatus(editingItem ? "Notice updated!" : "Notice created!");
      setEditingItem(null);
      setIsCreating(false);
      setForm({});
      fetchData();
    }
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    const res = await fetch(`/api/notices?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus("Notice deleted!");
      fetchData();
    }
  };

  // --- Events CRUD ---
  const saveEvent = async () => {
    const payload = {
      ...(editingItem ? { id: editingItem } : {}),
      title: form.title || "",
      description: form.description || "",
      date: form.date || new Date().toISOString(),
      endTime: form.endTime || null,
      venue: form.venue || "School Campus",
      category: form.category || "General",
      active: form.active !== "false",
    };

    const res = await fetch("/api/events", {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showStatus(editingItem ? "Event updated!" : "Event created!");
      setEditingItem(null);
      setIsCreating(false);
      setForm({});
      fetchData();
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus("Event deleted!");
      fetchData();
    }
  };

  // --- Announcements CRUD ---
  const saveAnnouncement = async () => {
    const payload = {
      ...(editingItem ? { id: editingItem } : {}),
      title: form.title || "",
      content: form.content || "",
      priority: form.priority || "normal",
      active: form.active !== "false",
    };

    const res = await fetch("/api/announcements", {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showStatus(editingItem ? "Announcement updated!" : "Announcement created!");
      setEditingItem(null);
      setIsCreating(false);
      setForm({});
      fetchData();
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus("Announcement deleted!");
      fetchData();
    }
  };

  const startEdit = (item: Record<string, unknown>, type: AdminTab) => {
    setEditingItem(item.id as string);
    setIsCreating(false);
    setActiveTab(type);
    if (type === "notices") {
      const n = item as Notice;
      setForm({
        title: n.title,
        content: n.content,
        category: n.category,
        date: n.date ? new Date(n.date).toISOString().split("T")[0] : "",
        active: String(n.active),
      });
    } else if (type === "events") {
      const e = item as SchoolEvent;
      setForm({
        title: e.title,
        description: e.description,
        date: e.date ? new Date(e.date).toISOString().split("T")[0] + "T09:00" : "",
        endTime: e.endTime ? new Date(e.endTime!).toISOString().split("T")[0] + "T12:00" : "",
        venue: e.venue,
        category: e.category,
        active: String(e.active),
      });
    } else {
      const a = item as Announcement;
      setForm({
        title: a.title,
        content: a.content,
        priority: a.priority,
        active: String(a.active),
      });
    }
  };

  const startCreate = (type: AdminTab) => {
    setActiveTab(type);
    setIsCreating(true);
    setEditingItem(null);
    setForm({ active: "true", category: "General", priority: "normal", venue: "School Campus" });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsCreating(false);
    setForm({});
  };

  const tabs: { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "notices", label: "Notices", icon: Bell },
    { key: "events", label: "Events", icon: Calendar },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-gold" />
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {user.name || user.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-navy hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status message */}
        {saveStatus && (
          <div className="mb-4 bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            {saveStatus}
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  cancelEdit();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-navy text-white shadow-md"
                    : "bg-white text-navy hover:bg-navy/5 border border-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading data...</p>
          </div>
        ) : (
          <>
            {/* ====== NOTICES TAB ====== */}
            {activeTab === "notices" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">Manage Notices</h2>
                  <Button
                    onClick={() => startCreate("notices")}
                    className="bg-gold hover:bg-gold-dark text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Notice
                  </Button>
                </div>

                {/* Create/Edit form */}
                {(isCreating || editingItem) && activeTab === "notices" && (
                  <div className="bg-white rounded-xl p-5 border border-gold/20 shadow-sm space-y-3">
                    <h3 className="font-semibold text-navy text-sm">
                      {editingItem ? "Edit Notice" : "New Notice"}
                    </h3>
                    <input
                      type="text"
                      placeholder="Title"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <textarea
                      placeholder="Content"
                      rows={3}
                      value={form.content || ""}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <select
                        value={form.category || "General"}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        {noticeCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={form.date || ""}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                      <select
                        value={form.active || "true"}
                        onChange={(e) => setForm({ ...form, active: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={saveNotice} className="bg-navy hover:bg-navy-light text-white text-sm">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="text-sm">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* List */}
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3"
                  >
                    <Bell className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-navy">{notice.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          notice.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {notice.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{notice.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(notice, "notices")}
                        className="p-1.5 text-navy hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="p-1.5 text-navy hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ====== EVENTS TAB ====== */}
            {activeTab === "events" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">Manage Events</h2>
                  <Button
                    onClick={() => startCreate("events")}
                    className="bg-gold hover:bg-gold-dark text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Event
                  </Button>
                </div>

                {/* Create/Edit form */}
                {(isCreating || editingItem) && activeTab === "events" && (
                  <div className="bg-white rounded-xl p-5 border border-gold/20 shadow-sm space-y-3">
                    <h3 className="font-semibold text-navy text-sm">
                      {editingItem ? "Edit Event" : "New Event"}
                    </h3>
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <textarea
                      placeholder="Description"
                      rows={3}
                      value={form.description || ""}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={form.date || ""}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={form.endTime || ""}
                          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={form.category || "General"}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        {eventCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Venue"
                        value={form.venue || ""}
                        onChange={(e) => setForm({ ...form, venue: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      />
                      <select
                        value={form.active || "true"}
                        onChange={(e) => setForm({ ...form, active: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={saveEvent} className="bg-navy hover:bg-navy-light text-white text-sm">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="text-sm">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* List */}
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3"
                  >
                    <Calendar className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-navy">{event.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          event.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {event.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{event.venue} · {event.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(event, "events")}
                        className="p-1.5 text-navy hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1.5 text-navy hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ====== ANNOUNCEMENTS TAB ====== */}
            {activeTab === "announcements" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">Manage Announcements</h2>
                  <Button
                    onClick={() => startCreate("announcements")}
                    className="bg-gold hover:bg-gold-dark text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Announcement
                  </Button>
                </div>

                {/* Create/Edit form */}
                {(isCreating || editingItem) && activeTab === "announcements" && (
                  <div className="bg-white rounded-xl p-5 border border-gold/20 shadow-sm space-y-3">
                    <h3 className="font-semibold text-navy text-sm">
                      {editingItem ? "Edit Announcement" : "New Announcement"}
                    </h3>
                    <input
                      type="text"
                      placeholder="Title"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <textarea
                      placeholder="Content"
                      rows={3}
                      value={form.content || ""}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={form.priority || "normal"}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        {priorityOptions.map((p) => (
                          <option key={p} value={p}>{p === "high" ? "High Priority" : "Normal"}</option>
                        ))}
                      </select>
                      <select
                        value={form.active || "true"}
                        onChange={(e) => setForm({ ...form, active: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={saveAnnouncement} className="bg-navy hover:bg-navy-light text-white text-sm">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="text-sm">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* List */}
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`bg-white rounded-xl p-4 border shadow-sm flex items-start gap-3 ${
                      ann.priority === "high" ? "border-l-4 border-l-red-400 border-red-100" : "border-gray-100"
                    }`}
                  >
                    <Megaphone className={`w-5 h-5 shrink-0 mt-0.5 ${ann.priority === "high" ? "text-red-500" : "text-navy"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-navy">{ann.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          ann.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {ann.active ? "Active" : "Inactive"}
                        </span>
                        {ann.priority === "high" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(ann, "announcements")}
                        className="p-1.5 text-navy hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1.5 text-navy hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
