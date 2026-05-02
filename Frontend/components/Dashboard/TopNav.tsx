"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/lib/cookies";

export default function TopNav() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("xnrent_token");
    localStorage.removeItem("xnrent_user");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg-base/80 border-b border-border-subtle">
      <div className="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-apple to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-apple/20">
            <Car size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-text-primary">
            XNRENT <span className="text-blue-apple">CAR</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-apple/10 border border-green-apple/20">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-apple"
            />
            <span className="text-xs font-semibold text-green-apple tracking-wide uppercase">
              Live
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-blue-apple border-b-2 border-blue-apple pb-0.5 cursor-pointer">Dashboard</span>
            <Link href="/Admin" className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">Admin Portal</Link>
          </div>

          <div className="h-6 w-px bg-border-subtle hidden sm:block"></div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden md:flex">
               <p className="text-[10px] font-black text-text-primary uppercase tracking-wider">Admin Staff</p>
               <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Connected</p>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-apple to-purple-apple flex items-center justify-center text-white font-semibold text-sm shadow-md transition-transform group-hover:scale-105">
                AD
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-text-tertiary hover:text-red-apple hover:bg-red-apple/10 rounded-lg transition-all"
                title="Initialize System Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
