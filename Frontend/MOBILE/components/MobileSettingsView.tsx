"use client";

import React, { useState } from "react";
import { Paintbrush, Sun, Moon, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

interface MobileSettingsViewProps {
  onLogout: () => void;
}

export default function MobileSettingsView({ onLogout }: MobileSettingsViewProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#fcf9f9] p-4 space-y-4 pb-20">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
          System Settings
        </h2>
        <p className="text-[10px] font-bold text-[#64748b] leading-tight mt-1 max-w-[280px]">
          Configure your personal preferences and enterprise account details.
        </p>
      </div>

      {/* CARD 1: APPEARANCE */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#f1f5f9]">
          <span className="text-sm font-black text-[#0f172a]">Appearance</span>
          <Paintbrush className="w-4 h-4 text-[#64748b]" />
        </div>

        <div className="flex justify-between items-center py-1.5">
          <div className="flex flex-col text-left">
            <span className="text-[9.5px] font-black text-[#1e293b] leading-tight">
              DARK MODE
            </span>
            <span className="text-[8px] font-bold text-[#94a3b8] mt-0.5 max-w-[180px] leading-tight">
              Switch between light and dark interface themes.
            </span>
          </div>
          {/* Custom Toggle Switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              darkMode ? "bg-blue-600" : "bg-[#cbd5e1]"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                darkMode ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Light / Dark Mode selector buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setDarkMode(false)}
            className={`py-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all font-bold ${
              !darkMode
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:bg-slate-50"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-[9.5px] font-black uppercase tracking-wider">Light</span>
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={`py-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all font-bold ${
              darkMode
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:bg-slate-50"
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-[9.5px] font-black uppercase tracking-wider">Dark</span>
          </button>
        </div>
      </div>

      {/* CARD 2: ACCOUNT DETAILS */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="pb-1 border-b border-[#f1f5f9]">
          <span className="text-sm font-black text-[#0f172a]">Account Details</span>
        </div>

        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              defaultValue="Alexander Vance"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
            <span className="text-[8px] font-bold text-[#94a3b8] block -mt-0.5">
              Used for administrative reports
            </span>
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider">Work Email</label>
            <input
              type="email"
              defaultValue="a.vance@fleetflow.inc"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider">Designation</label>
            <input
              type="text"
              defaultValue="Senior Operations Manager"
              disabled
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#94a3b8] bg-[#f1f5f9] font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button className="bg-[#2563eb] text-white text-[9.5px] font-extrabold px-5 py-2.5 rounded-lg shadow-sm transition-all hover:bg-blue-700 uppercase tracking-wider">
            Save Changes
          </button>
        </div>
      </div>

      {/* CARD 3: SESSION SECURITY */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="pb-1 border-b border-[#f1f5f9]">
          <span className="text-sm font-black text-[#0f172a]">Session Security</span>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2.5 p-2 bg-[#e8fbf4] border border-[#d1fae5] rounded-xl text-[#10b981]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[9.5px] font-black leading-tight">ACCOUNT ACTIVE</span>
            <span className="text-[8px] font-bold text-[#10b981]/80">Authenticated via Fleet ID 4829-X</span>
          </div>
        </div>

        {/* Session details */}
        <div className="border border-[#cbd5e1] rounded-xl p-3 bg-[#f8fafc] space-y-2 text-[9.5px] font-bold text-[#64748b]">
          <div className="flex justify-between items-center">
            <span>Last Login</span>
            <span className="text-[#1e293b] font-black">Today, 08:45 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Location</span>
            <span className="text-[#1e293b] font-black">Chicago, HQ</span>
          </div>
        </div>

        {/* Logout action */}
        <button
          onClick={onLogout}
          className="w-full bg-[#0f172a] text-white text-[10px] font-black py-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          Logout
        </button>
        <span className="text-[8px] font-bold text-[#94a3b8] text-center block">
          You will be redirected to the secure login gateway.
        </span>
      </div>

      {/* CARD 4: NEED TECHNICAL HELP */}
      <div className="bg-[#0b1220] rounded-xl p-4 text-white relative overflow-hidden flex flex-col justify-between h-32 shadow-md">
        {/* Screen/grid visual background overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="10" y="20" width="30" height="20" rx="2" />
            <rect x="50" y="20" width="40" height="25" rx="2" />
            <rect x="15" y="55" width="45" height="30" rx="2" />
          </svg>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-black tracking-tight leading-tight">
            Need technical help?
          </h4>
          <p className="text-[8.5px] font-bold text-slate-300 max-w-[200px] leading-tight">
            Our fleet experts are available 24/7 for operational support.
          </p>
        </div>

        <a
          href="#"
          className="text-white text-[8.5px] font-black tracking-wider uppercase flex items-center gap-1 hover:underline mt-2"
        >
          Contact Support
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
