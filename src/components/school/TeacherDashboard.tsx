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
  UserCircle,
  Camera,
  Upload,
  CheckCircle,
  Clock,
  BookOpen,
  GraduationCap,
  Languages,
  MessageSquare,
  Award,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

type TeacherTab = "profile" | "notices" | "events" | "announcements" | "enquiries";

const noticeCategories = ["General", "Academic", "Event", "Holiday"];
const eventCategories = ["General", "Celebration", "Sports", "Academic", "Cultural"];
const priorityOptions = ["normal", "high"];
const enquiryStatuses = ["pending", "contacted", "admitted", "closed"];
const classOptions = ["Nursery", "JKG", "SKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];

export default function TeacherDashboard({
  teacher,
  onLogout,
}: {
  teacher: TeacherData;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TeacherTab>("profile");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<TeacherData>(teacher);
  const [editProfile, setEditProfile] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, eRes, aRes, enqRes] = await Promise.all([
        fetch("/api/notices"),
        fetch("/api/events"),
        fetch("/api/announcements"),
        fetch("/api/enquiries"),
      ]);
      if (nRes.ok) setNotices(await nRes.json());
      if (eRes.ok) setEvents(await eRes.json());
      if (aRes.ok) setAnnouncements(await aRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "teachers");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.url) {
        // Update teacher profile with new photo
        const updateRes = await fetch("/api/teachers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: teacherProfile.id, photo: uploadData.url }),
        });
        if (updateRes.ok) {
          const updated = await updateRes.json();
          setTeacherProfile(updated.teacher);
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setPhotoUploading(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/teachers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teacherProfile.id, ...teacherProfile }),
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherProfile(data.teacher);
        setEditProfile(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // CRUD for notices, events, announcements
  const handleCreate = async (type: string) => {
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchData();
        setShowForm(false);
        setFormData({});
      }
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  const handleUpdate = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      });
      if (res.ok) {
        await fetchData();
        setEditingItem(null);
        setFormData({});
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/${type}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const startEdit = (item: Record<string, unknown>, type: string) => {
    setEditingItem(`${type}-${item.id as string}`);
    setFormData(
      Object.fromEntries(
        Object.entries(item).filter(([k]) => k !== "id" && k !== "createdAt" && k !== "updatedAt")
      ) as Record<string, string>
    );
  };

  const startCreate = (type: string) => {
    setShowForm(true);
    setEditingItem(`new-${type}`);
    setFormData({});
  };

  // Enquiry status update
  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const tabs = [
    { id: "profile" as TeacherTab, label: "My Profile", icon: UserCircle },
    { id: "notices" as TeacherTab, label: "Notices", icon: Bell },
    { id: "events" as TeacherTab, label: "Events", icon: Calendar },
    { id: "announcements" as TeacherTab, label: "Announcements", icon: Megaphone },
    { id: "enquiries" as TeacherTab, label: "Enquiries", icon: MessageSquare },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-accent/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-accent" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-navy">Teacher Panel</h1>
              <p className="text-xs text-muted-foreground">{teacherProfile.name} • {teacherProfile.designation}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-green-accent text-white shadow-sm"
                  : "text-muted-foreground hover:text-navy hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-accent p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Photo */}
                <div className="relative">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border-2 border-white/30 overflow-hidden">
                    {teacherProfile.photo ? (
                      <img src={teacherProfile.photo} alt={teacherProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-16 h-16 text-white/40" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gold/10 transition-colors"
                    disabled={photoUploading}
                  >
                    {photoUploading ? (
                      <span className="w-4 h-4 border-2 border-green-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-green-accent" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{teacherProfile.name}</h2>
                  <p className="text-white/80 font-medium text-sm sm:text-base">{teacherProfile.designation}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white/70 mt-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gold" />
                      {teacherProfile.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-gold" />
                      {teacherProfile.qualification}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gold" />
                      {teacherProfile.experience} Years
                    </span>
                  </div>
                  <CheckCircle className="inline-block w-4 h-4 text-gold mr-1 mt-2" />
                  <span className="text-xs text-white/70">Approved • {teacherProfile.email}</span>
                </div>
              </div>
            </div>

            {/* Profile details */}
            <div className="p-6 space-y-6">
              {editProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Name</label>
                    <input
                      value={teacherProfile.name}
                      onChange={(e) => setTeacherProfile({...teacherProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Designation</label>
                    <input
                      value={teacherProfile.designation}
                      onChange={(e) => setTeacherProfile({...teacherProfile, designation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Subject</label>
                    <input
                      value={teacherProfile.subject}
                      onChange={(e) => setTeacherProfile({...teacherProfile, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Qualification</label>
                    <input
                      value={teacherProfile.qualification}
                      onChange={(e) => setTeacherProfile({...teacherProfile, qualification: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Experience (years)</label>
                    <input
                      type="number"
                      value={teacherProfile.experience}
                      onChange={(e) => setTeacherProfile({...teacherProfile, experience: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Languages</label>
                    <input
                      value={teacherProfile.languages}
                      onChange={(e) => setTeacherProfile({...teacherProfile, languages: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Short Introduction</label>
                    <textarea
                      value={teacherProfile.shortIntro}
                      onChange={(e) => setTeacherProfile({...teacherProfile, shortIntro: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy mb-1 block">Teaching Philosophy</label>
                    <textarea
                      value={teacherProfile.teachingPhilosophy}
                      onChange={(e) => setTeacherProfile({...teacherProfile, teachingPhilosophy: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} className="bg-green-accent hover:bg-green-accent/90 text-white">
                      <Save className="w-4 h-4 mr-1" /> Save Profile
                    </Button>
                    <Button variant="outline" onClick={() => setEditProfile(false)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setEditProfile(true)} className="text-green-accent border-green-accent/20 hover:bg-green-accent/5">
                      <Pencil className="w-4 h-4 mr-1" /> Edit Profile
                    </Button>
                  </div>

                  {teacherProfile.languages && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                        <Languages className="w-5 h-5 text-green-accent" />
                        Languages Known
                      </h3>
                      <p className="text-muted-foreground text-sm">{teacherProfile.languages}</p>
                    </div>
                  )}

                  {teacherProfile.shortIntro && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                        <MessageSquare className="w-5 h-5 text-green-accent" />
                        Introduction
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{teacherProfile.shortIntro}</p>
                    </div>
                  )}

                  {teacherProfile.teachingPhilosophy && (
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-semibold text-navy mb-2">
                        <Award className="w-5 h-5 text-green-accent" />
                        Teaching Philosophy
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{teacherProfile.teachingPhilosophy}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Notices</h2>
              <Button size="sm" onClick={() => startCreate("notices")} className="bg-green-accent hover:bg-green-accent/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Notice
              </Button>
            </div>

            {editingItem === "new-notices" && showForm && (
              <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-3">
                <input placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <textarea placeholder="Content" value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <select value={formData.category || "General"} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {noticeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="date" value={formData.date || new Date().toISOString().split("T")[0]} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <div className="flex gap-2">
                  <Button onClick={() => handleCreate("notices")} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); setFormData({}); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-accent/20 transition-colors">
                  {editingItem === `notices-${notice.id}` ? (
                    <div className="space-y-3">
                      <input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <textarea value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <select value={formData.category || "General"} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        {noticeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("notices", notice.id)} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-3.5 h-3.5 mr-1" /> Update</Button>
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(null); setFormData({}); }}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-navy text-sm">{notice.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{notice.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{notice.category}</span>
                            <span>{new Date(notice.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(notice, "notices")} className="text-green-accent hover:bg-green-accent/5">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete("notices", notice.id)} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {notices.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">No notices yet. Click &quot;Add Notice&quot; to create one.</p>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Events</h2>
              <Button size="sm" onClick={() => startCreate("events")} className="bg-green-accent hover:bg-green-accent/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Event
              </Button>
            </div>

            {editingItem === "new-events" && showForm && (
              <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-3">
                <input placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <textarea placeholder="Description" value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input type="datetime-local" value={formData.date || ""} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input type="datetime-local" value={formData.endTime || ""} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input placeholder="Venue" value={formData.venue || "School Campus"} onChange={(e) => setFormData({...formData, venue: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <select value={formData.category || "General"} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button onClick={() => handleCreate("events")} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); setFormData({}); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-accent/20 transition-colors">
                  {editingItem === `events-${event.id}` ? (
                    <div className="space-y-3">
                      <input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input type="datetime-local" value={formData.date || ""} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input placeholder="Venue" value={formData.venue || ""} onChange={(e) => setFormData({...formData, venue: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <select value={formData.category || "General"} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("events", event.id)} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-3.5 h-3.5 mr-1" /> Update</Button>
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(null); setFormData({}); }}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-navy text-sm">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">{event.category}</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>{event.venue}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(event, "events")} className="text-green-accent hover:bg-green-accent/5">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete("events", event.id)} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">No events yet. Click &quot;Add Event&quot; to create one.</p>
              )}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">Announcements</h2>
              <Button size="sm" onClick={() => startCreate("announcements")} className="bg-green-accent hover:bg-green-accent/90 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Announcement
              </Button>
            </div>

            {editingItem === "new-announcements" && showForm && (
              <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-3">
                <input placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <textarea placeholder="Content" value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <select value={formData.priority || "normal"} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {priorityOptions.map(p => <option key={p} value={p}>{p === "high" ? "High Priority" : "Normal"}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button onClick={() => handleCreate("announcements")} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); setFormData({}); }}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-accent/20 transition-colors">
                  {editingItem === `announcements-${ann.id}` ? (
                    <div className="space-y-3">
                      <input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <textarea value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <select value={formData.priority || "normal"} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        {priorityOptions.map(p => <option key={p} value={p}>{p === "high" ? "High Priority" : "Normal"}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate("announcements", ann.id)} className="bg-green-accent hover:bg-green-accent/90 text-white"><Save className="w-3.5 h-3.5 mr-1" /> Update</Button>
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(null); setFormData({}); }}><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-navy text-sm">{ann.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{ann.content}</p>
                          <span className={`text-xs px-2 py-0.5 rounded mt-2 inline-block ${ann.priority === "high" ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"}`}>
                            {ann.priority === "high" ? "High Priority" : "Normal"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(ann, "announcements")} className="text-green-accent hover:bg-green-accent/5">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete("announcements", ann.id)} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">No announcements yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Admission Enquiries</h2>
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-accent/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy text-sm">{enq.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{enq.email}</span>
                        <span>{enq.phone}</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{enq.class}</span>
                      </div>
                      {enq.message && <p className="text-xs text-muted-foreground mt-2">{enq.message}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1"
                      >
                        {enquiryStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {enquiries.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">No enquiries yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
