"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, User, Mail, Phone, GraduationCap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const classOptions = [
  "Nursery", "JKG", "SKG",
  "Class 1", "Class 2", "Class 3", "Class 4",
  "Class 5", "Class 6", "Class 7", "Class 8",
];

export default function EnquirySection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", class: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="enquiry" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 sm:p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Enquiry Submitted!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Thank you for your interest in Saint Mary School, Rajula. We have received your enquiry and will get back to you soon.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-gold hover:bg-gold-dark text-white text-sm"
            >
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="py-16 bg-gradient-to-b from-white to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="text-gold font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-2">Admission Enquiry</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Interested in admitting your child to Saint Mary School? Fill out the form below and we will reach out to you with all the details.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">
                  Student Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter student name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="parent@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Class */}
              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">
                  Class Seeking Admission For
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all appearance-none bg-white"
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-navy mb-1.5 block">
                Message <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  placeholder="Any questions or specific requirements..."
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all resize-none"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white text-sm px-8 py-2.5 rounded-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Enquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
