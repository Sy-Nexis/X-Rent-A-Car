"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/cookies";

interface SidebarProps {
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

// Maps URL pathname to a logical view name used by the footer/active-state logic
function getViewFromPathname(pathname: string): string {
  if (pathname.startsWith("/Admin")) return "AdminPortal";
  if (pathname.startsWith("/assignments")) return "AssignVehicles";
  if (pathname.startsWith("/vehicles")) return "FleetList";
  if (pathname.startsWith("/clients/register")) return "RegisterClient";
  if (pathname.startsWith("/clients")) return "ClientRegistry";
  return "Dashboard";
}

export default function Sidebar({ isDrawerOpen = false, onCloseDrawer }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeView = getViewFromPathname(pathname);

  // Navigation items mapping
  const navItems = [
    {
      id: "Dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      id: "AdminPortal",
      path: "/Admin",
      label: "Admin Portal",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "FleetManagement",
      path: "/vehicles",
      label: "Fleet Management",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
        </svg>
      ),
    },
    {
      id: "ClientRegistry",
      path: "/clients",
      label: "Client Registry",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 014 0" />
        </svg>
      ),
    },
    {
      id: "AssignVehicles",
      path: "/assignments",
      label: "Assign Vehicles",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  const [userName, setUserName] = useState("Alex Rivera");
  const [userRole, setUserRole] = useState("Fleet Manager");

  const syncUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) setUserRole(parsed.role);
        } catch {
          // ignore
        }
      }
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("user-updated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase() || "AR";
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("xrent_user");
    }
    deleteCookie("token");
    deleteCookie("xrent_token");
    router.push("/");
  };

  // Dynamic footer profile
  const renderFooterProfile = () => {
    return (
      <div className="flex items-center justify-between p-3 bg-[#1e1e1e] border border-white/5 rounded-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-brand-gradient flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {getInitials(userName)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-semibold truncate">{userName}</span>
            <span className="text-gray-400 text-[10px] truncate capitalize">{userRole}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Log Out"
          className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  };

  const sidebarContent = (
    <aside className="w-64 bg-[#0e0e11] flex flex-col justify-between h-full flex-shrink-0 border-r border-white/5 relative z-20">
      {/* Brand Header */}
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center py-2">
          <span className="font-sans text-white text-4xl font-bold tracking-wide flex items-center select-none">
            ne
            <span className="text-brand-gradient text-4xl font-black mx-0.5">X</span>
            us
          </span>
        </div>
        {/* Close button — only visible in drawer mode on mobile */}
        {onCloseDrawer && (
          <button
            onClick={onCloseDrawer}
            className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (item.id === "ClientRegistry" && activeView === "RegisterClient") ||
            (item.id === "FleetManagement" && ["FleetList", "FleetEmpty", "FleetManagement"].includes(activeView));
          return (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path);
                if (onCloseDrawer) onCloseDrawer();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-brand-gradient text-white shadow-lg shadow-emerald-500/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Dynamic Profile Footer */}
      <div className="p-4 border-t border-white/5">
        {renderFooterProfile()}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseDrawer}
          />
          {/* Drawer container */}
          <div className="relative z-10 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
