import React from "react";

interface HeaderProps {
  activeView: string;
}

export default function Header({ activeView }: HeaderProps) {
  // Dynamically configure search placeholder and user profile info to match the screenshots exactly
  const getHeaderConfig = () => {
    switch (activeView) {
      case "Dashboard":
        return {
          placeholder: "Search fleet or driver...",
          profileText: null,
          profileSubText: null,
          hasHamburger: true,
        };
      case "AdminPortal":
        return {
          placeholder: "Search operational data...",
          profileText: "Admin Controller",
          profileSubText: "MANAGER PROFILE",
          hasHamburger: false,
        };
      case "FleetManagement":
        return {
          placeholder: "Search fleet assets...",
          profileText: "FleetControl",
          profileSubText: null,
          hasHamburger: false,
        };
      case "ClientRegistry":
        return {
          placeholder: "Search registry...",
          profileText: null,
          profileSubText: null,
          hasHamburger: false,
        };
      case "RegisterClient":
        return {
          placeholder: "Search registry...",
          profileText: "Alex Management",
          profileSubText: "FLEET MANAGER",
          hasHamburger: false,
        };
      default:
        return {
          placeholder: "Search...",
          profileText: "Alex Management",
          profileSubText: "FLEET MANAGER",
          hasHamburger: false,
        };
    }
  };

  const config = getHeaderConfig();

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 relative z-10">
      {/* Left Search Bar & optional Hamburger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {config.hasHamburger && (
          <button className="text-gray-500 hover:text-gray-700 md:hidden block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={config.placeholder}
            className="w-full bg-[#f1f5f9] text-gray-800 placeholder-gray-400 text-xs font-medium pl-10 pr-4 py-2.5 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-6">
        {/* Quick Action Icons */}
        <div className="flex items-center gap-3 border-r border-gray-200 pr-5">
          {/* Notifications */}
          <button className="text-gray-400 hover:text-gray-600 relative p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border border-white" />
          </button>

          {/* History */}
          <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          {config.profileText && (
            <div className="flex flex-col text-right">
              <span className="text-gray-800 text-xs font-bold">{config.profileText}</span>
              {config.profileSubText && (
                <span className="text-gray-400 text-[9px] font-semibold tracking-wider">{config.profileSubText}</span>
              )}
            </div>
          )}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
            {config.profileText ? (
              <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {config.profileText.charAt(0)}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
