import React, { useState, useRef, useEffect } from "react";

interface HeaderProps {
  activeView: string;
  onAddUnit?: () => void;
  onOpenMenu?: () => void;
}

export default function Header({ activeView, onAddUnit, onOpenMenu }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Dynamically configure search placeholder and user profile info to match the screenshots exactly
  const getHeaderConfig = () => {
    switch (activeView) {
      case "Dashboard":
        return {
          placeholder: "Search fleet or driver...",
          profileText: null,
          profileSubText: null,
          hasHamburger: true,
          showStatus: false,
        };
      case "AdminPortal":
        return {
          placeholder: "Search operational data...",
          profileText: "Admin Controller",
          profileSubText: "MANAGER PROFILE",
          hasHamburger: false,
          showStatus: false,
        };
      case "FleetManagement":
        return {
          placeholder: "Search fleet assets...",
          profileText: "FleetControl",
          profileSubText: null,
          hasHamburger: false,
          showStatus: false,
        };
      case "FleetEmpty":
        return {
          placeholder: "Search fleet registry...",
          profileText: null,
          profileSubText: null,
          hasHamburger: false,
          showStatus: false,
        };
      case "FleetList":
        return {
          placeholder: "Search registry...",
          profileText: null,
          profileSubText: null,
          hasHamburger: false,
          showStatus: true,
        };
      case "ClientRegistry":
        return {
          placeholder: "Search registry...",
          profileText: null,
          profileSubText: null,
          hasHamburger: false,
          showStatus: false,
        };
      case "RegisterClient":
        return {
          placeholder: "Search registry...",
          profileText: "Alex Management",
          profileSubText: "FLEET MANAGER",
          hasHamburger: false,
          showStatus: false,
        };
      default:
        return {
          placeholder: "Search...",
          profileText: "Alex Management",
          profileSubText: "FLEET MANAGER",
          hasHamburger: false,
          showStatus: false,
        };
    }
  };

  const config = getHeaderConfig();

  return (
    <header className="h-16 border-b border-white/5 bg-[#0e0e11] flex items-center justify-between px-4 md:px-8 relative z-10 flex-shrink-0">
      {/* Left: Hamburger (mobile only) + Search Bar */}
      <div className="flex items-center gap-3 md:gap-6 flex-1">
        {/* Mobile hamburger — always shown on mobile */}
        <button
          onClick={onOpenMenu}
          className="md:hidden flex-shrink-0 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={config.placeholder}
              className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 text-xs font-medium pl-10 pr-4 py-2 rounded-lg border border-white/5 focus:border-brand-cyan/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Database connection status & Add Unit button (Screenshot 5) */}
        {config.showStatus && (
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-555 bg-brand-gradient animate-pulse" />
              Database Connected
            </div>
            {onAddUnit && (
              <button
                onClick={onAddUnit}
                className="bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+</span> Add Unit to Fleet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Quick Action Icons — hidden on mobile to save space */}
        <div className="hidden sm:flex items-center gap-3 border-r border-white/5 pr-5">
          {/* Notifications */}
          <button className="text-gray-400 hover:text-white relative p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan border border-[#0e0e11]" />
          </button>

          {/* History */}
          <button className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* User Card & Dropdown */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* Profile text hidden on small screens */}
          {config.profileText && (
            <div className="hidden sm:flex flex-col text-right select-none">
              <span className="text-white text-xs font-bold">{config.profileText}</span>
              {config.profileSubText && (
                <span className="text-gray-405 text-gray-500 text-[9px] font-semibold tracking-wider">{config.profileSubText}</span>
              )}
            </div>
          )}
          
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/5 bg-[#1e1e1e] flex items-center justify-center hover:border-white/10 focus:outline-none transition-all cursor-pointer text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e1e1e] border border-white/5 rounded-xl shadow-xl py-2.5 z-50 select-none">
              {/* Account Quick Info */}
              <div className="px-4 py-2 border-b border-white/5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Logged in as</span>
                <span className="text-xs font-extrabold text-white block mt-0.5">{config.profileText || "Alex Management"}</span>
                <span className="text-[10px] text-gray-400 font-semibold block">{config.profileSubText || "FLEET MANAGER"}</span>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  Account Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  Security Credentials
                </button>
                <button className="w-full px-4 py-2 text-left text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                  System Preferences
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-white/5 mt-1 pt-1">
                <button className="w-full px-4 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer">
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
