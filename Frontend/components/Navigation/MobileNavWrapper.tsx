"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Shield,
  Car,
  Users,
  Settings,
  Plus,
  ArrowLeft,
  Activity,
  LogOut
} from "lucide-react";
import { deleteCookie } from "@/lib/cookies";

// --- MOBILE HEADER SUB-COMPONENT ---
interface MobileHeaderProps {
  activeView: string;
  onBack?: () => void;
}

function MobileHeader({ activeView, onBack }: MobileHeaderProps) {
  const router = useRouter();

  // If we are in Add Vehicle or Add Client, render a header with a Back button
  if (activeView === "AddVehicle" || activeView === "RegisterClient") {
    return (
      <header className="w-full bg-[#1c1c1e]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors h-11 min-w-[44px] active:scale-95 duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          {activeView === "AddVehicle" ? "Register Unit" : "Register Client"}
        </span>
        <div className="w-11" /> {/* Spacer to balance Back button */}
      </header>
    );
  }

  // If in Fleet Management, render header with DB status and "Add Unit" button
  if (activeView === "FleetList") {
    return (
      <header className="w-full bg-[#1c1c1e]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-white uppercase tracking-wider leading-tight">
            Fleet Operations
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse"></span>
            <span className="text-[8px] font-bold text-[#30d158] uppercase tracking-widest">
              Live Sync
            </span>
          </div>
        </div>

        <Link
          href="/Admin/Vehicle/Data"
          className="bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black px-3 py-2 rounded-xl shadow-lg shadow-blue-600/10 flex items-center gap-1 transition-all active:scale-95 uppercase tracking-wider min-h-[36px] duration-200"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          Add Unit
        </Link>
      </header>
    );
  }

  // Default header for Main Portal (Dashboard, Clients, Settings)
  return (
    <header className="w-full bg-[#1c1c1e]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <Car size={16} />
        </div>
        <span className="text-white text-lg font-serif tracking-wide flex items-center select-none leading-none">
          ne
          <span className="text-white text-xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
          us
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-inner">
          AD
        </div>
      </div>
    </header>
  );
}

// --- MAIN MOBILE NAVIGATION WRAPPER ---
export default function MobileNavWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  // Map route to active view string
  let activeView = "Dashboard";
  if (pathname === "/Admin") activeView = "Dashboard";
  else if (pathname === "/Admin/Vehicle") activeView = "FleetList";
  else if (pathname === "/Admin/Client") activeView = "ClientRegistry";
  else if (pathname === "/Admin/Settings") activeView = "Settings";
  else if (pathname === "/Admin/Vehicle/Data") activeView = "AddVehicle";
  else if (pathname === "/Admin/Client/Data") activeView = "RegisterClient";

  // Handles mobile back button navigation
  const handleBack = () => {
    if (activeView === "AddVehicle") {
      router.push("/Admin/Vehicle");
    } else if (activeView === "RegisterClient") {
      router.push("/Admin/Client");
    } else {
      router.back();
    }
  };

  const tabs = [
    { id: "Dashboard", label: "DASHBOARD", icon: LayoutGrid, path: "/Admin" },
    { id: "FleetList", label: "FLEET", icon: Car, path: "/Admin/Vehicle" },
    { id: "ClientRegistry", label: "CLIENTS", icon: Users, path: "/Admin/Client" },
    { id: "Settings", label: "SETTINGS", icon: Settings, path: "/Admin/Settings" },
  ];

  // Helper to determine if tab is active
  const getIsActive = (tabId: string) => {
    if (tabId === "Dashboard" && activeView === "Dashboard") return true;
    if (
      tabId === "FleetList" &&
      (activeView === "FleetList" || activeView === "AddVehicle")
    )
      return true;
    if (
      tabId === "ClientRegistry" &&
      (activeView === "ClientRegistry" || activeView === "RegisterClient")
    )
      return true;
    if (tabId === "Settings" && activeView === "Settings") return true;
    return false;
  };

  return (
    <div className="lg:hidden flex flex-col w-full z-40 relative">
      {/* Dynamic Header */}
      <MobileHeader activeView={activeView} onBack={handleBack} />

      {/* Sticky Bottom Nav Bar */}
      <nav className="w-full bg-[#1c1c1e]/90 backdrop-blur-lg border-t border-white/5 h-16 fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 pb-1 shrink-0 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = getIsActive(tab.id);

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 min-h-[48px] ${
                isActive ? "text-blue-500" : "text-[#86868b] hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform ${
                  isActive ? "scale-110 stroke-[2.5px]" : "stroke-[1.8px]"
                }`}
              />
              <span
                className={`text-[8.5px] font-black tracking-wider transition-all uppercase ${
                  isActive ? "opacity-100 font-black" : "opacity-75 font-bold"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
