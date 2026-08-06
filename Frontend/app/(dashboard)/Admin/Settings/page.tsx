"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Paintbrush, 
  Sun, 
  Moon, 
  ShieldCheck, 
  LogOut, 
  User, 
  Mail, 
  Lock,
  Loader2,
  ChevronRight,
  Settings
} from "lucide-react";
import { deleteCookie } from "@/lib/cookies";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("Alexander Vance");
  const [email, setEmail] = useState("a.vance@fleetflow.inc");

  const handleLogout = () => {
    deleteCookie("xrent_token");
    localStorage.removeItem("xrent_user");
    router.push("/login");
    router.refresh();
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-6 md:p-8 lg:p-12 space-y-12 select-none">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
            <Settings size={14} />
            Console Configuration
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
            System <span className="text-[#6e6e73]">Settings</span>
          </h1>
          <p className="text-[#86868b] text-sm md:text-base font-medium max-w-xl">
            Configure your personal console layout preferences and credentials.
          </p>
        </div>
      </header>

      {/* SETTINGS WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CARD 1: APPEARANCE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-base font-black uppercase tracking-wider text-white">Appearance</span>
              <Paintbrush className="w-5 h-5 text-[#6e6e73]" />
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex flex-col text-left space-y-1 max-w-[70%]">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Interface Theme
                </span>
                <span className="text-[10px] font-medium text-[#86868b] leading-tight">
                  Toggle between high-contrast dark or classic light themes.
                </span>
              </div>
              
              {/* Custom Toggle Switch */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none min-w-[44px] min-h-[24px] ${
                  darkMode ? "bg-blue-600" : "bg-[#424245]"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Light / Dark Mode selector buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setDarkMode(false)}
                className={`py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-bold min-h-[48px] active:scale-95 duration-200 ${
                  !darkMode
                    ? "border-blue-500 bg-blue-600/10 text-blue-500 font-black shadow-lg"
                    : "border-white/5 bg-white/[0.02] text-[#86868b] hover:text-white hover:bg-white/5"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Light Mode</span>
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-bold min-h-[48px] active:scale-95 duration-200 ${
                  darkMode
                    ? "border-blue-500 bg-blue-600/10 text-blue-500 font-black shadow-lg"
                    : "border-white/5 bg-white/[0.02] text-[#86868b] hover:text-white hover:bg-white/5"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Dark Mode</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: ACCOUNT PROFILE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-base font-black uppercase tracking-wider text-white">Console Profile</span>
              <User className="w-5 h-5 text-[#6e6e73]" />
            </div>

            <div className="space-y-4 text-[10px] font-black text-[#86868b]">
              <div className="space-y-2">
                <label className="uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Vance"
                  className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <label className="uppercase tracking-widest ml-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="a.vance@fleetflow.inc"
                  className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <label className="uppercase tracking-widest ml-1">Assigned Designation</label>
                <input
                  type="text"
                  value="Senior Operations Manager"
                  disabled
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[#6e6e73] text-xs font-bold cursor-not-allowed min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-600/10 flex items-center justify-center gap-2 min-h-[44px] active:scale-95 duration-200 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </motion.div>

        {/* CARD 3: SECURITY & CONTROLS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-base font-black uppercase tracking-wider text-white">System Security</span>
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 shadow-sm">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black tracking-widest leading-tight uppercase">ACCOUNT SECURED</span>
                <span className="text-[8.5px] font-bold text-green-500/70 mt-0.5">Authorized via Terminal Key 4829-X</span>
              </div>
            </div>

            {/* Session Metadata Info */}
            <div className="border border-white/5 rounded-2xl p-4 bg-black/20 space-y-3 text-[10px] font-bold text-[#86868b]">
              <div className="flex justify-between items-center">
                <span>Console Terminal</span>
                <span className="text-white font-black uppercase">Web-Client-04</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Branch Location</span>
                <span className="text-white font-black uppercase">Colombo HQ</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Uptime Status</span>
                <span className="text-[#30d158] font-black">99.98% ONLINE</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-red-500/15 border border-white/5 text-white hover:text-red-500 text-[10px] font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 duration-200 transition-all uppercase tracking-widest min-h-[48px]"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </button>
            <span className="text-[8px] font-bold text-[#6e6e73] text-center block uppercase tracking-wider">
              Terminates session token and cookies immediately
            </span>
          </div>
        </motion.div>

      </div>

      {/* AMBIENT GLOW */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
