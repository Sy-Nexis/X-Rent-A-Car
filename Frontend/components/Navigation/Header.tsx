"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/cookies";

interface HeaderProps {
  onAddUnit?: () => void;
  onOpenMenu?: () => void;
}

function getViewFromPathname(pathname: string): string {
  if (pathname.startsWith("/Admin")) return "AdminPortal";
  if (pathname.startsWith("/assignments")) return "AssignVehicles";
  if (pathname.startsWith("/logs")) return "ActivityLogs";
  if (pathname.startsWith("/vehicles/new")) return "FleetManagement";
  if (pathname.startsWith("/vehicles")) return "FleetList";
  if (pathname.startsWith("/clients/register")) return "RegisterClient";
  if (pathname.startsWith("/clients")) return "ClientRegistry";
  return "Dashboard";
}

export default function Header({ onAddUnit, onOpenMenu }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeView = getViewFromPathname(pathname);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // User state
  const [userName, setUserName] = useState("Staff User");
  const [userRole, setUserRole] = useState("STAFF");

  const syncUserData = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) setUserRole(parsed.role.toUpperCase());
        } catch {
          // keep defaults
        }
      }
    }
  };

  useEffect(() => {
    syncUserData();

    // Listen to user update events across app
    window.addEventListener("user-updated", syncUserData);
    window.addEventListener("storage", syncUserData);
    return () => {
      window.removeEventListener("user-updated", syncUserData);
      window.removeEventListener("storage", syncUserData);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("xrent_user");
    }
    deleteCookie("token");
    deleteCookie("xrent_token");
    setIsDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0e0e11] flex items-center justify-between px-4 md:px-8 relative z-10 flex-shrink-0">
      {/* Left: Hamburger (mobile only) */}
      <div className="flex items-center gap-3 md:gap-6 flex-1">
        {/* Mobile hamburger — always shown on mobile */}
        <button
          onClick={onOpenMenu}
          aria-label="Open mobile menu"
          className="md:hidden flex-shrink-0 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Add Unit button */}
        {activeView === "FleetList" && onAddUnit && (
          <div className="hidden sm:flex items-center gap-5">
            <button
              onClick={onAddUnit}
              className="bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <span>+</span> Add Unit to Fleet
            </button>
          </div>
        )}
      </div>

      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* User Card & Dropdown */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* Profile text */}
          <div className="hidden sm:flex flex-col text-right select-none">
            <span className="text-white text-xs font-bold">{userName}</span>
            <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">{userRole}</span>
          </div>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/5 bg-[#1e1e1e] flex items-center justify-center hover:border-white/10 focus:outline-none transition-all cursor-pointer text-gray-400 hover:text-white"
            title="User Profile Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e1e1e] border border-white/5 rounded-xl shadow-2xl py-2.5 z-50 select-none animate-in fade-in zoom-in-95 duration-100">
              {/* Account Quick Info */}
              <div className="px-4 py-2 border-b border-white/5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Logged in as</span>
                <span className="text-xs font-extrabold text-white block mt-0.5">{userName}</span>
                <span className="text-[10px] text-brand-cyan font-semibold block uppercase">{userRole}</span>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/dashboard");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/vehicles");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Fleet Management
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/assignments");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Assign Vehicles
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/logs");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  Activity Logs
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-white/5 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
