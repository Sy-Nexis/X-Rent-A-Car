"use client";

import React from "react";
import { LayoutGrid, Shield, Car, Users, Settings } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdminMode?: boolean;
}

export default function MobileBottomNav({
  activeTab,
  onTabChange,
  isAdminMode = false,
}: MobileBottomNavProps) {
  // If in AdminPortalView (Operational Oversight), tabs are Dashboard, Admin, Fleet, Settings.
  // Otherwise, tabs are Dashboard, Fleet, Clients, Settings.
  const tabs = isAdminMode
    ? [
        { id: "Dashboard", label: "DASHBOARD", icon: LayoutGrid },
        { id: "AdminPortal", label: "ADMIN", icon: Shield },
        { id: "FleetList", label: "FLEET", icon: Car },
        { id: "Settings", label: "SETTINGS", icon: Settings },
      ]
    : [
        { id: "Dashboard", label: "DASHBOARD", icon: LayoutGrid },
        { id: "FleetList", label: "FLEET", icon: Car },
        { id: "ClientRegistry", label: "CLIENTS", icon: Users },
        { id: "Settings", label: "SETTINGS", icon: Settings },
      ];

  // Map active tab IDs if they match alternative names
  const getIsActive = (tabId: string) => {
    if (tabId === "Dashboard" && activeTab === "Dashboard") return true;
    if (tabId === "AdminPortal" && activeTab === "AdminPortal") return true;
    if (tabId === "FleetList" && (activeTab === "FleetList" || activeTab === "FleetManagement")) return true;
    if (tabId === "ClientRegistry" && (activeTab === "ClientRegistry" || activeTab === "RegisterClient")) return true;
    if (tabId === "Settings" && activeTab === "Settings") return true;
    return false;
  };

  return (
    <div className="w-full bg-white border-t border-[#f1f5f9] h-16 flex items-center justify-around px-2 pb-1 shrink-0 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = getIsActive(tab.id);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
              isActive
                ? "text-[#2563eb]"
                : "text-[#94a3b8] hover:text-[#64748b]"
            }`}
          >
            <Icon
              className={`w-5 h-5 mb-1 transition-transform ${
                isActive ? "scale-110 stroke-[2.5px]" : "stroke-[1.8px]"
              }`}
            />
            <span
              className={`text-[9px] font-bold tracking-wider transition-all ${
                isActive ? "opacity-100 font-extrabold" : "opacity-80 font-semibold"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
