"use client";

import { useState, useEffect, useRef } from "react";
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
  Camera,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Phone,
  User,
  Clock,
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

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string | null;
  active: boolean;
  order: number;
  createdAt: string;
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  message: string | null;
  status: string;
  createdAt: string;
};

type AdminTab = "notices" | "events" | "announcements" | "gallery" | "enquiries";

const noticeCategories = ["General", "Academic", "Event", "Holiday"];
const eventCategories = ["General", "Celebration", "Sports", "Academic", "Cultural"];
const priorityOptions = ["normal", "high"];
const galleryCategories = [
  "Classrooms",
  "Annual Function",
  "Sports Day",
  "Science Activities",
  "Cultural Events",
  "School Campus",
  "Celebrations",
];

const enquiryStatuses = ["pending", "contacted", "admitted", "closed"];
const classOptions = ["Nursery", "JKG", "SKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];

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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [form, setForm] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, eRes, aRes, gRes, eqRes] = await Promise.all([
        fetch("/api/notices"),
        fetch("/api/events"),
        fetch("/api/announcements"),
        fetch("/api/gallery"),
        fetch("/api/enquiries"),
      ]);
      setNotices(await nRes.json());
      setEvents(await eRes.json());
      setAnnouncements(await aRes.json());
      setGalleryImages(await gRes.json());
      if (eqRes.ok) setEnquiries(await eqRes.json());
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

  // --- Gallery CRUD ---
  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const error = await res.json();
        showStatus(error.error || "Upload failed!");
        return null;
      }
    } catch (err) {
      console.error(err);
      showStatus("Upload failed!");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveGalleryImage = async () => {
    // If creating new, we need an image file
    if (isCreating && !form.imageUrl) {
      showStatus("Please select an image to upload!");
      return;
    }

    let imageUrl = form.imageUrl || "";

    // Handle file upload if a new file was selected
    if (form.imageFile) {
      const url = await handleImageUpload(form.imageFile as unknown as File);
      if (!url) return;
      imageUrl = url;
    }

    const payload = {
      ...(editingItem ? { id: editingItem } : {}),
      title: form.title || "",
      category: form.category || "School Campus",
      imageUrl,
      alt: form.alt || form.title || "",
      active: form.active !== "false",
      order: form.order ? parseInt(form.order) : 0,
    };

    const res = await fetch("/api/gallery", {
      method: editingItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showStatus(editingItem ? "Gallery image updated!" : "Gallery image added!");
      setEditingItem(null);
      setIsCreating(false);
      setForm({});
      fetchData();
    }
  };

  const deleteGalleryImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus("Gallery image deleted!");
      fetchData();
    }
  };

  // --- Enquiries ---
  const updateEnquiryStatus = async (id: string, status: string) => {
    const res = await fetch("/api/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      showStatus(`Enquiry marked as ${status}!`);
      fetchData();
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showStatus("Enquiry deleted!");
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
    } else if (type === "gallery") {
      const g = item as GalleryImage;
      setForm({
        title: g.title,
        category: g.category,
        imageUrl: g.imageUrl,
        alt: g.alt || "",
        active: String(g.active),
        order: String(g.order),
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
    setForm({ active: "true", category: type === "gallery" ? "School Campus" : "General", priority: "normal", venue: "School Campus" });
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
    { key: "gallery", label: "Gallery", icon: Camera },
    { key: "enquiries", label: "Enquiries", icon: MessageSquare },
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

            {/* ====== GALLERY TAB ====== */}
            {activeTab === "gallery" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">Manage Gallery Images</h2>
                  <Button
                    onClick={() => startCreate("gallery")}
                    className="bg-gold hover:bg-gold-dark text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Image
                  </Button>
                </div>

                {/* Create/Edit form */}
                {(isCreating || editingItem) && activeTab === "gallery" && (
                  <div className="bg-white rounded-xl p-5 border border-gold/20 shadow-sm space-y-3">
                    <h3 className="font-semibold text-navy text-sm">
                      {editingItem ? "Edit Gallery Image" : "New Gallery Image"}
                    </h3>

                    {/* Image upload area */}
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gold/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {form.imageUrl ? (
                        <div className="space-y-2">
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg object-contain"
                          />
                          <p className="text-xs text-muted-foreground">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports JPEG, PNG, WebP, GIF (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Preview the file locally
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setForm({
                                ...form,
                                imageUrl: ev.target?.result as string,
                                imageFile: file as unknown as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>

                    {uploading && (
                      <div className="text-center text-sm text-gold flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        Uploading image...
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Image Title"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <input
                      type="text"
                      placeholder="Alt Text (description for accessibility)"
                      value={form.alt || ""}
                      onChange={(e) => setForm({ ...form, alt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={form.category || "School Campus"}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        {galleryCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Display Order"
                        value={form.order || ""}
                        onChange={(e) => setForm({ ...form, order: e.target.value })}
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
                      <Button
                        onClick={saveGalleryImage}
                        disabled={uploading}
                        className="bg-navy hover:bg-navy-light text-white text-sm"
                      >
                        <Save className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="text-sm">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Gallery image list */}
                {galleryImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-muted-foreground">No gallery images yet. Add your first image!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((img) => (
                      <div
                        key={img.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={img.imageUrl}
                            alt={img.alt || img.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => startEdit(img, "gallery")}
                              className="p-2 bg-white/90 rounded-lg text-navy hover:text-gold transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteGalleryImage(img.id)}
                              className="p-2 bg-white/90 rounded-lg text-navy hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full ${
                            img.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {img.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-navy truncate">{img.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{img.category} · Order: {img.order}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ====== ENQUIRIES TAB ====== */}
            {activeTab === "enquiries" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">Enquiries</h2>
                  <div className="flex items-center gap-2">
                    {/* Summary badges */}
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {enquiries.filter(e => e.status === "pending").length} Pending
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {enquiries.filter(e => e.status === "contacted").length} Contacted
                    </span>
                  </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  {["all", ...enquiryStatuses].map((status) => (
                    <button
                      key={status}
                      onClick={() => setEnquiryFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        enquiryFilter === status
                          ? "bg-navy text-white"
                          : "bg-white text-navy hover:bg-navy/5 border border-gray-100"
                      }`}
                    >
                      {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Enquiries list */}
                {enquiries.filter(e => enquiryFilter === "all" || e.status === enquiryFilter).length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-muted-foreground">
                      {enquiryFilter === "all" ? "No enquiries yet" : `No ${enquiryFilter} enquiries`}
                    </p>
                  </div>
                ) : (
                  enquiries
                    .filter(e => enquiryFilter === "all" || e.status === enquiryFilter)
                    .map((enquiry) => (
                      <div
                        key={enquiry.id}
                        className={`bg-white rounded-xl p-4 border shadow-sm ${
                          enquiry.status === "pending"
                            ? "border-l-4 border-l-amber-400 border-amber-50"
                            : enquiry.status === "contacted"
                            ? "border-l-4 border-l-blue-400 border-blue-50"
                            : enquiry.status === "admitted"
                            ? "border-l-4 border-l-green-400 border-green-50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-navy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-sm font-semibold text-navy">{enquiry.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                enquiry.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : enquiry.status === "contacted"
                                  ? "bg-blue-100 text-blue-700"
                                  : enquiry.status === "admitted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}>
                                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {enquiry.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {enquiry.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{" "}
                                {new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Class: <span className="font-medium text-navy">{enquiry.class}</span>
                            </div>
                            {enquiry.message && (
                              <p className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 line-clamp-2">
                                {enquiry.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <select
                              value={enquiry.status}
                              onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                              className="text-[11px] px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/30"
                            >
                              {enquiryStatuses.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteEnquiry(enquiry.id)}
                              className="p-1.5 text-navy hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
