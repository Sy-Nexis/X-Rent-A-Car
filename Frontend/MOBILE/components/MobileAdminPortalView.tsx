"use client";

import React from "react";
import { Hammer, Users, ShieldAlert, Award, FileText, ExternalLink } from "lucide-react";

interface MobileAdminPortalViewProps {
  onOpenFleet: () => void;
  onOpenClients: () => void;
}

export default function MobileAdminPortalView({
  onOpenFleet,
  onOpenClients,
}: MobileAdminPortalViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#fcf9f9] p-4 space-y-4 pb-20">
      {/* Page header text inside page */}
      <div>
        <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
          Operational Oversight
        </h2>
        <p className="text-[10px] font-bold text-[#64748b] leading-tight mt-1 max-w-[300px]">
          Manage global fleet infrastructure and client relationships.
        </p>
      </div>

      {/* Fleet Operations Card */}
      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
              <Hammer className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
              Fleet Operations
            </span>
          </div>
          <span className="text-[8px] font-extrabold text-[#10b981] bg-[#e8fbf4] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live
          </span>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-3">
          <p className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-wider">
            Total Unit Count
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-[#0f172a] tracking-tight">
              1,248
            </span>
            <span className="text-[10px] font-bold text-[#10b981] flex items-center">
              ▲ +4.2%
            </span>
          </div>
        </div>

        <div className="space-y-2 text-[10px] font-bold">
          <div className="flex justify-between items-center py-1 border-b border-[#f1f5f9]">
            <span className="flex items-center gap-2 text-[#64748b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Active Transit
            </span>
            <span className="text-[#0f172a] font-extrabold">892</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#64748b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /> In Maintenance
            </span>
            <span className="text-[#0f172a] font-extrabold">312</span>
          </div>
        </div>

        <button
          onClick={onOpenFleet}
          className="w-full bg-[#2563eb] text-white text-[9px] font-extrabold py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all hover:bg-blue-700 uppercase tracking-wider"
        >
          <FileText className="w-3.5 h-3.5" />
          Open Management Tables
        </button>
      </div>

      {/* Client Registry Card */}
      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-[#64748b]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
              Client Registry
            </span>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-3">
          <p className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-wider">
            Total Client Count
          </p>
          <p className="text-2xl font-black text-[#0f172a] tracking-tight mt-0.5">
            452
          </p>
        </div>

        <div className="space-y-2 text-[10px] font-bold">
          <div className="flex justify-between items-center py-1 border-b border-[#f1f5f9]">
            <span className="flex items-center gap-2 text-[#64748b]">
              <Award className="w-3.5 h-3.5 text-[#2563eb]" /> Enterprise Tiers
            </span>
            <span className="text-[#0f172a] font-extrabold">84</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="flex items-center gap-2 text-[#64748b]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#94a3b8]" /> Pending Review
            </span>
            <span className="text-[#0f172a] font-extrabold">12</span>
          </div>
        </div>

        <button
          onClick={onOpenClients}
          className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[9px] font-extrabold py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all hover:bg-slate-50 uppercase tracking-wider"
        >
          <FileText className="w-3.5 h-3.5" />
          Open Management Tables
        </button>
      </div>

      {/* System Integrity (Deep blue banner) */}
      <div className="bg-[#0f172a] rounded-xl p-4 text-white relative overflow-hidden flex flex-col justify-between h-28 shadow-md">
        {/* Decorative subtle shield in bottom corner */}
        <div className="absolute right-3 bottom-0 opacity-10 translate-y-2">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div>
          <p className="text-[8px] font-extrabold text-[#38bdf8] tracking-widest uppercase">
            System Integrity
          </p>
          <p className="text-2xl font-black tracking-tight leading-none mt-1">
            99.98%
          </p>
        </div>
        <p className="text-[9px] font-bold text-slate-300 leading-tight">
          Global Uptime Status
        </p>
      </div>

      {/* Footer copyright and links */}
      <div className="text-center py-4 space-y-1 z-10">
        <p className="text-[8px] font-bold text-[#94a3b8]">
          © 2024 FleetFlow Systems. All rights reserved.
        </p>
        <div className="flex justify-center gap-3 text-[9px] font-bold text-[#64748b]">
          <a href="#" className="hover:text-blue-500">Privacy</a>
          <span className="text-[#cbd5e1]">•</span>
          <a href="#" className="hover:text-blue-500">Status</a>
          <span className="text-[#cbd5e1]">•</span>
          <a href="#" className="hover:text-blue-500">Help</a>
        </div>
      </div>
    </div>
  );
}
