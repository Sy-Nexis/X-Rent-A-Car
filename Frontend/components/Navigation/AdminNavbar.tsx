"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CarFront, 
  Users, 
  PieChart, 
  Settings, 
  LogOut,
  Car,
  ChevronRight
} from "lucide-react";

// --- NAV LINKS CONFIG ---
const navLinks = [
  { 
    name: "Dashboard", 
    path: "/Admin", 
    icon: LayoutDashboard,
    exact: true 
  },
  { 
    name: "Fleet Management", 
    path: "/Admin/Vehicle", 
    icon: CarFront 
  },
  { 
    name: "Client Registry", 
    path: "/Admin/Client", 
    icon: Users 
  },
];

// --- MAIN COMPONENT ---
export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen fixed top-0 left-0 bg-[#1c1c1e] border-r border-white/5 flex flex-col z-50">
      
      {/* 1. BRANDING AREA */}
      <div className="p-8 pb-12">
        <Link href="/Admin" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <Car size={24} />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-black tracking-tighter text-white">XNRENT</span>
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Fleet Console</span>
          </div>
        </Link>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.path 
            : pathname.startsWith(link.path);
          
          return (
            <Link key={link.path} href={link.path} className="block relative group">
              <div className={`
                flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300
                ${isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-[#86868b] hover:text-white hover:bg-white/5"}
              `}>
                <div className="flex items-center gap-4">
                  <link.icon size={20} className={isActive ? "text-blue-500" : "group-hover:text-white"} />
                  <span className="text-xs font-black uppercase tracking-widest">{link.name}</span>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-active-glow"
                    className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  />
                )}
              </div>
              
              {/* HOVER INDICATOR */}
              {!isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white/10 rounded-full group-hover:h-8 transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. USER PROFILE WIDGET */}
      <div className="p-6 border-t border-white/5 space-y-6">
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[24px]">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c2c2e] to-black flex items-center justify-center text-white text-xs font-black border border-white/10 shadow-xl">
                 AD
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-wider">Admin User</p>
                 <p className="text-[9px] font-bold text-[#6e6e73] uppercase tracking-widest">Superuser</p>
              </div>
           </div>
           
           <button className="p-2.5 text-[#6e6e73] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
              <LogOut size={18} />
           </button>
        </div>

        <div className="flex items-center justify-center">
           <p className="text-[8px] font-black text-[#424245] uppercase tracking-[0.5em]">System V3.0 // XNRENT</p>
        </div>
      </div>

    </aside>
  );
}
