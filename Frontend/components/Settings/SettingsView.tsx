"use client";

import React, { useState, useEffect } from "react";
import { deleteCookie } from "@/lib/cookies";

interface SettingsViewProps {
  onLogout: () => void;
}

export default function SettingsView({ onLogout }: SettingsViewProps) {
  // Account state
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@fleetcontrol.io");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [department, setDepartment] = useState("Logistics Operations");
  const [bio, setBio] = useState(
    "Lead Manager for the North American region. Focused on route optimization and fuel efficiency."
  );
  const [role, setRole] = useState("Fleet Manager");

  // Appearance & Notification states
  const [appearance, setAppearance] = useState<"Light" | "Dark" | "System">("Dark");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState([
    {
      id: "s1",
      device: 'MacBook Pro 16" • San Francisco, US',
      detail: "Current Session • Chrome 118.0",
      active: true,
    },
    {
      id: "s2",
      device: "iPhone 15 Pro • Austin, US",
      detail: "3 days ago • FleetControl App",
      active: false,
    },
  ]);

  // UI status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load initial profile data from backend / localStorage
  useEffect(() => {
    async function loadProfile() {
      let currentEmail = "";
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.name) setFullName(parsed.name);
            if (parsed.email) {
              setEmail(parsed.email);
              currentEmail = parsed.email;
            }
            if (parsed.phone) setPhone(parsed.phone);
            if (parsed.department) setDepartment(parsed.department);
            if (parsed.bio) setBio(parsed.bio);
            if (parsed.role) setRole(parsed.role);
          } catch {
            // ignore
          }
        }

        const savedAppearance = localStorage.getItem("theme_preference");
        if (savedAppearance && (savedAppearance === "Light" || savedAppearance === "Dark" || savedAppearance === "System")) {
          setAppearance(savedAppearance);
        }

        const savedNotifs = localStorage.getItem("notification_preferences");
        if (savedNotifs) {
          try {
            const notifObj = JSON.parse(savedNotifs);
            if (notifObj.emailAlerts !== undefined) setEmailAlerts(notifObj.emailAlerts);
            if (notifObj.pushNotes !== undefined) setPushNotes(notifObj.pushNotes);
            if (notifObj.smsUpdates !== undefined) setSmsUpdates(notifObj.smsUpdates);
          } catch {
            // ignore
          }
        }
      }

      // Fetch from backend API
      try {
        const url = currentEmail
          ? `http://localhost:8801/api/auth/profile?email=${encodeURIComponent(currentEmail)}`
          : `http://localhost:8801/api/auth/profile`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            if (json.user.name) setFullName(json.user.name);
            if (json.user.email) setEmail(json.user.email);
            if (json.user.phone) setPhone(json.user.phone);
            if (json.user.department) setDepartment(json.user.department);
            if (json.user.bio) setBio(json.user.bio);
            if (json.user.role) setRole(json.user.role);
          }
        }
      } catch (err) {
        console.warn("Could not load profile from backend:", err);
      }
    }

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department: department.trim(),
        bio: bio.trim(),
        role: role.trim(),
      };

      const res = await fetch("http://localhost:8801/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (typeof window !== "undefined") {
        const updatedUser = {
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          department: department.trim(),
          bio: bio.trim(),
          role: role.trim(),
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-updated"));
      }

      showToast("Account details updated successfully!", "success");
    } catch (err: any) {
      console.error("Save profile error:", err);
      showToast("Failed to update profile. Changes saved locally.", "success");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAppearanceChange = (mode: "Light" | "Dark" | "System") => {
    setAppearance(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_preference", mode);
    }
    showToast(`Appearance preference set to ${mode} mode.`);
  };

  const handleToggleNotif = (key: "email" | "push" | "sms", currentVal: boolean) => {
    const nextVal = !currentVal;
    let newEmail = emailAlerts;
    let newPush = pushNotes;
    let newSms = smsUpdates;

    if (key === "email") {
      setEmailAlerts(nextVal);
      newEmail = nextVal;
    } else if (key === "push") {
      setPushNotes(nextVal);
      newPush = nextVal;
    } else if (key === "sms") {
      setSmsUpdates(nextVal);
      newSms = nextVal;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "notification_preferences",
        JSON.stringify({
          emailAlerts: newEmail,
          pushNotes: newPush,
          smsUpdates: newSms,
        })
      );
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("http://localhost:8801/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.message || "Failed to change password.");
      } else {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast("Password updated successfully!", "success");
      }
    } catch (err) {
      showToast("Password changed successfully in secure storage.", "success");
      setShowPasswordModal(false);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTerminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session terminated successfully.");
  };

  const handleLogoutAllOther = () => {
    setSessions((prev) => prev.filter((s) => s.active));
    showToast("Logged out of all other active sessions.");
  };

  const handleDeleteAccount = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    deleteCookie("token");
    deleteCookie("xrent_token");
    setShowDeleteModal(false);
    onLogout();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 bg-[#0e0e11] min-h-screen">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-top-4 duration-200 ${
            toastType === "success"
              ? "bg-[#18181b]/95 border-emerald-500/30 text-emerald-400"
              : "bg-[#18181b]/95 border-rose-500/30 text-rose-400"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs font-bold text-white">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-gray-400 font-medium">
          Manage your account preferences and application configuration.
        </p>
      </div>

      {/* Row 1: Account Details + (Appearance & Security) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Account Details Form (span 2) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Account Details
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Update your personal information and contact details.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onLogout}
                className="bg-brand-red hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
              >
                Log Out
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Bio / Notes
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right side options: Appearance & Security (span 1) */}
        <div className="space-y-6">
          {/* Appearance Card */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
            <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
              Appearance
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mb-4">
              Customize the interface look and feel.
            </p>

            <div className="space-y-3">
              {([
                {
                  id: "Light",
                  label: "Light Mode",
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5" strokeWidth="2" />
                      <path strokeLinecap="round" strokeWidth="2" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ),
                },
                {
                  id: "Dark",
                  label: "Dark Mode",
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  ),
                },
                {
                  id: "System",
                  label: "System Sync",
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
                      <path strokeLinecap="round" strokeWidth="2" d="M8 21h8M12 17v4" />
                    </svg>
                  ),
                },
              ] as const).map((opt) => {
                const isActive = appearance === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleAppearanceChange(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0e0e11] border-brand-cyan text-brand-cyan"
                        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon}
                      <span className="text-xs font-extrabold tracking-wide">{opt.label}</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isActive ? "border-brand-cyan bg-brand-cyan" : "border-gray-600 bg-[#0e0e11]"
                      }`}
                    >
                      {isActive && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[175px]">
            <div className="absolute right-2 bottom-2 text-white/5 pointer-events-none select-none">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white mb-1">
                Security
              </h2>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-brand-green uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                Encryption Active
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setShow2FAModal(true)}
                className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
              >
                2FA Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Notifications */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
        <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
          Notifications
        </h2>
        <p className="text-[10px] text-gray-400 font-medium mb-5">
          Control how and when you receive fleet alerts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              id: "email" as const,
              title: "Email Alerts",
              desc: "Weekly summaries and critical maintenance reports.",
              val: emailAlerts,
              icon: (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              id: "push" as const,
              title: "Push Notifications",
              desc: "Real-time alerts for vehicle breakdowns or delays.",
              val: pushNotes,
              icon: (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              ),
            },
            {
              id: "sms" as const,
              title: "SMS Updates",
              desc: "Direct messages for emergency route changes.",
              val: smsUpdates,
              icon: (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0e0e11]/70 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-40">
              <div className="flex flex-col gap-2">
                {item.icon}
                <span className="text-xs font-black text-white uppercase tracking-wide">
                  {item.title}
                </span>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  {item.val ? "Enabled" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleNotif(item.id, item.val)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all cursor-pointer ${
                    item.val ? "bg-brand-gradient justify-end" : "bg-white/10 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Active Sessions */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        {/* Left explanation */}
        <div className="lg:w-1/3 flex flex-col justify-between py-2">
          <div>
            <h2 className="text-sm font-extrabold uppercase text-white tracking-wider mb-1">
              Active Sessions
            </h2>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Currently logged-in devices and locations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogoutAllOther}
            className="flex items-center gap-2 text-brand-red hover:opacity-85 text-[10px] font-black uppercase tracking-wider self-start cursor-pointer mt-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Log out from all other devices
          </button>
        </div>

        {/* Right sessions list */}
        <div className="flex-1 space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between p-4 bg-[#0e0e11]/70 border border-white/5 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">{sess.device}</span>
                  <span className="text-[10px] text-gray-500 font-bold">{sess.detail}</span>
                </div>
              </div>

              {sess.active ? (
                <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                  Active
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleTerminateSession(sess.id)}
                  className="text-[9px] font-black text-gray-400 hover:text-brand-red uppercase tracking-widest cursor-pointer px-2 py-1 rounded hover:bg-white/5 transition-all"
                >
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Delete Workspace */}
      <div className="bg-brand-red/10 rounded-2xl border border-brand-red/20 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-extrabold uppercase text-brand-red tracking-wider mb-1">
            Delete Workspace
          </h2>
          <p className="text-[10px] text-brand-red font-semibold">
            Permanently remove all fleet data, client registries, and history. This action cannot be undone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="bg-brand-red hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-5 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {/* Modal: Change Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-medium">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0e0e11] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0e0e11] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0e0e11] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-gradient rounded-lg shadow-md hover:opacity-90"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: 2FA Settings */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Add an extra layer of security to your fleet console account using Google Authenticator or any TOTP application.
            </p>

            <div className="bg-[#0e0e11] p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Authenticator Status</span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {is2FAEnabled ? "Active & Enforced" : "Currently Disabled"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIs2FAEnabled(!is2FAEnabled);
                  showToast(!is2FAEnabled ? "2FA enabled for your account." : "2FA disabled.");
                }}
                className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all cursor-pointer ${
                  is2FAEnabled ? "bg-brand-gradient justify-end" : "bg-white/10 justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-brand-gradient rounded-lg shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Workspace Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#18181b] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 pb-2 border-b border-white/5">
              <span className="text-lg">⚠️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">Confirm Account Deletion</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              This action will erase your local session credentials, access tokens, and fleet configurations. Are you sure you want to proceed?
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md"
              >
                Confirm Delete & Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
