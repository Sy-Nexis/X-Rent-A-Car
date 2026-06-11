"use client";

import React from "react";
import { Menu, Search, Plus, Shield } from "lucide-react";

interface MobileHeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function MobileHeader({ activeView, onNavigate }: MobileHeaderProps) {
  // Image 4: FleetManagement header (With Database Connected & Add Unit button)
  if (activeView === "FleetList" || activeView === "FleetManagement") {
    return (
      <header className="w-full bg-white border-b border-[#f1f5f9] h-14 flex items-center justify-between px-3 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button className="text-[#64748b] p-1 rounded-md hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[12px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              Fleet Management
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-[8px] font-bold text-[#10b981] tracking-wider uppercase">
                Database Connected
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("AddVehicle")}
          className="bg-[#2563eb] text-white text-[9px] font-extrabold px-2 py-1.5 rounded-md shadow-sm flex items-center gap-1 transition-all hover:bg-blue-700 active:scale-95 uppercase tracking-wider"
        >
          <Plus className="w-3 h-3 stroke-[3px]" />
          Add Unit
        </button>
      </header>
    );
  }

  // Image 2: AdminPortal (Operational Oversight) header
  if (activeView === "AdminPortal") {
    return (
      <header className="w-full bg-white border-b border-[#f1f5f9] h-14 flex items-center justify-between px-3 shrink-0 z-20">
        <div className="flex items-center gap-2">
          {/* Dark blue/green background truck logo */}
          <div className="w-7 h-7 bg-[#0f172a] rounded-lg flex items-center justify-center text-white">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="text-sm font-extrabold text-[#0f172a] tracking-tight">
            FleetFlow
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-[#64748b] p-1.5 rounded-md hover:bg-slate-100">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-[#64748b] p-1.5 rounded-md hover:bg-slate-100">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  // Image 3 & Image 5: Dashboard and Client Registry header
  return (
    <header className="w-full bg-white border-b border-[#f1f5f9] h-14 flex items-center justify-between px-3 shrink-0 z-20">
      <div className="flex items-center gap-2">
        <button className="text-[#64748b] p-1 rounded-md hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-extrabold text-[#0f172a] tracking-tight">
          FleetFlow
        </span>
      </div>

      {activeView !== "AddVehicle" && (
        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
          {/* Simple premium looking avatar placeholder */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
