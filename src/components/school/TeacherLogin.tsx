"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, GraduationCap, UserCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type TeacherStatus = "pending" | "approved" | "rejected" | "none";

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

export default function TeacherLogin({
  onLogin,
}: {
  onLogin: (teacher: TeacherData) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Teacher");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState<TeacherStatus>("none");
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if teacher exists in DB by email
      const res = await fetch(`/api/teachers?all=true`);
      const teachers = await res.json();

      const found = teachers.find((t: TeacherData) => t.email === email);

      if (!found) {
        setError("No account found with this email. Please sign up first.");
        setLoading(false);
        return;
      }

      if (found.status === "pending") {
        setSignupStatus("pending");
        setTeacherData(found);
        setLoading(false);
        return;
      }

      if (found.status === "rejected") {
        setSignupStatus("rejected");
        setTeacherData(found);
        setLoading(false);
        return;
      }

      if (found.status === "approved") {
        // For now, simple email-based auth (Google OAuth to be added later)
        onLogin(found);
        return;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          designation,
          subject,
          qualification,
          experience: parseInt(experience) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSignupStatus("pending");
      setTeacherData(data.teacher);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show approval status screens
  if (signupStatus === "pending" && teacherData) {
    return (
      <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-secondary/30 flex items-start justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-navy p-6 text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl font-bold text-white">Approval Pending</h2>
              <p className="text-sm text-gray-300 mt-1">Saint Mary School, Rajula</p>
            </div>
            <div className="p-6 space-y-4 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-yellow-800">Your registration is pending admin approval</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You have successfully registered as a teacher. The admin will review your application and approve it shortly.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                <p className="text-muted-foreground"><span className="font-medium text-navy">Name:</span> {teacherData.name}</p>
                <p className="text-muted-foreground"><span className="font-medium text-navy">Email:</span> {teacherData.email}</p>
                <p className="text-muted-foreground"><span className="font-medium text-navy">Subject:</span> {teacherData.subject}</p>
                <p className="text-muted-foreground"><span className="font-medium text-navy">Designation:</span> {teacherData.designation}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                You can check your approval status by logging in later with the same email.
              </p>
              <Button
                variant="outline"
                className="w-full border-navy text-navy hover:bg-navy/5"
                onClick={() => { setSignupStatus("none"); setTeacherData(null); setMode("login"); setEmail(teacherData.email); }}
              >
                Check Approval Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (signupStatus === "rejected" && teacherData) {
    return (
      <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-secondary/30 flex items-start justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-900 p-6 text-center">
              <div className="w-16 h-16 bg-red-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Application Rejected</h2>
              <p className="text-sm text-gray-300 mt-1">Saint Mary School, Rajula</p>
            </div>
            <div className="p-6 space-y-4 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-red-800">Your registration has been rejected by the admin</p>
                <p className="text-xs text-red-700 mt-1">
                  Please contact the school administration for further details or to reapply.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full border-navy text-navy hover:bg-navy/5"
                onClick={() => { setSignupStatus("none"); setTeacherData(null); setMode("signup"); }}
              >
                Try Again with Different Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen bg-secondary/30 flex items-start justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-green-accent p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {mode === "login" ? "Teacher Login" : "Teacher Signup"}
            </h2>
            <p className="text-sm text-gray-200 mt-1">Saint Mary School, Rajula</p>
          </div>

          {/* Mode toggle */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mode === "login"
                  ? "text-green-accent bg-green-accent/5 border-b-2 border-green-accent"
                  : "text-muted-foreground hover:text-navy"
              }`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-green-accent bg-green-accent/5 border-b-2 border-green-accent"
                  : "text-muted-foreground hover:text-navy"
              }`}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Password (Google OAuth coming soon)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password (temp)"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Google OAuth will be enabled once credentials are provided
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-accent hover:bg-green-accent/90 text-white font-semibold py-2.5 rounded-lg shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* Google OAuth placeholder */}
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <p className="text-xs text-muted-foreground">
                  Google Sign-In will be available once OAuth credentials are configured
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mrs. Sunita Desai"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                >
                  <option value="Principal">Principal</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Sports Instructor">Sports Instructor</option>
                  <option value="Computer Teacher">Computer Teacher</option>
                  <option value="Pre-Primary Teacher">Pre-Primary Teacher</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics, English, Science"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. M.Ed., B.Ed."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy mb-1.5 block">Experience (years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-accent/30 focus:border-green-accent transition-colors"
                  min="0"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-accent hover:bg-green-accent/90 text-white font-semibold py-2.5 rounded-lg shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Sign Up & Wait for Approval"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After signup, you&apos;ll need admin approval before accessing the teacher panel.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
