import React from "react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

export default function Sidebar({ activeView, onNavigate, isDrawerOpen = false, onCloseDrawer }: SidebarProps) {
  // Navigation items mapping
  const navItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      id: "AdminPortal",
      label: "Admin Portal",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "FleetManagement",
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
      label: "Client Registry",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 014 0" />
        </svg>
      ),
    },
    {
      id: "Settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Dynamic footer profile depending on selected view to match the screenshots exactly!
  const renderFooterProfile = () => {
    switch (activeView) {
      case "Dashboard":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              MT
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">Marcus Thorne</span>
              <span className="text-gray-400 text-[10px] truncate">Operations Director</span>
            </div>
          </div>
        );
      case "AdminPortal":
        return (
          <div className="flex flex-col gap-2 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">System Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-400 text-xs font-medium">All Systems Online</span>
            </div>
          </div>
        );
      case "FleetManagement":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">System Admin</span>
              <span className="text-gray-400 text-[10px] truncate">Logistics Lead</span>
            </div>
          </div>
        );
      case "FleetEmpty":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-550 flex items-center justify-center text-white font-semibold text-sm">
              AR
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">Alex Rivers</span>
              <span className="text-gray-400 text-[10px] truncate">Fleet Director</span>
            </div>
          </div>
        );
      case "FleetList":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">System Admin</span>
              <span className="text-gray-400 text-[10px] truncate">Logistics Tier 1</span>
            </div>
          </div>
        );
      case "ClientRegistry":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              HQ
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">Logistics HQ</span>
              <span className="text-gray-400 text-[10px] truncate">Admin Account</span>
            </div>
          </div>
        );
      case "RegisterClient":
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">FleetControl</span>
              <span className="text-gray-400 text-[10px] truncate">v4.2.0-stable</span>
            </div>
          </div>
        );
      case "Settings":
        return (
          <button
            onClick={() => onNavigate("Landing")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        );
      default:
        return (
          <div className="flex items-center gap-3 p-3 bg-[#111c35] border border-white/5 rounded-xl">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center text-white font-bold">
              FC
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-semibold truncate">FleetControl</span>
              <span className="text-gray-400 text-[10px] truncate font-medium">Precision Operations</span>
            </div>
          </div>
        );
    }
  };

  const sidebarContent = (
    <aside className="w-64 bg-[#0b1220] flex flex-col justify-between h-full flex-shrink-0 border-r border-white/5 relative z-20">
      {/* Brand Header */}
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center py-2">
          <span className="font-serif text-white text-4xl tracking-wide flex items-center select-none">
            ne
            <span className="font-serif text-white text-5xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
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
          // Normalize active states (RegisterClient is sub-view of ClientRegistry, FleetList & FleetEmpty & FleetManagement are sub-views of FleetManagement)
          const isActive =
            activeView === item.id ||
            (item.id === "ClientRegistry" && activeView === "RegisterClient") ||
            (item.id === "FleetManagement" && (activeView === "FleetList" || activeView === "FleetEmpty" || activeView === "FleetManagement"));
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "FleetManagement") {
                  // Switch between list view by default
                  onNavigate("FleetList");
                } else {
                  onNavigate(item.id);
                }
                // Close drawer on mobile after navigating
                if (onCloseDrawer) onCloseDrawer();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-[#1e293b]/50 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="absolute right-0 top-1/4 bottom-1/4 w-1 rounded-l-full bg-blue-500" />
              )}
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
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseDrawer}
          />
          {/* Drawer panel */}
          <div className="relative h-full animate-slideInLeft">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
