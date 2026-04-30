"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Settings2, 
  ArrowRight, 
  Car, 
  ShieldCheck, 
  Cpu, 
  Globe 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/30">
      
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px]" 
        />
        
        {/* Subtle Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 py-20 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-white/5 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Operations Terminal v2.4</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#1d1d1f] to-[#6e6e73] dark:from-white dark:to-[#86868b]"
          >
            XNRENT <span className="text-blue-500">CAR</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto font-medium"
          >
            A high-performance fleet intelligence system. <br className="hidden md:block" />
            Select your specialized workspace to begin.
          </motion.p>
        </div>

        {/* PORTAL SELECTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          
          {/* PATH 1: FLEET DASHBOARD */}
          <Link href="/dashboard" className="group">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative h-[320px] bg-white/60 dark:bg-[#2c2c2e]/60 backdrop-blur-2xl rounded-[32px] border border-gray-200/50 dark:border-white/5 p-10 flex flex-col justify-between overflow-hidden shadow-2xl shadow-black/5 hover:border-blue-500/50 transition-colors"
            >
              {/* Background Decoration */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                  <LayoutDashboard size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Fleet Dashboard</h3>
                  <p className="text-sm text-[#6e6e73] leading-relaxed dark:text-[#86868b]">
                    Real-time GPS tracking, active driver monitoring, and live operations analytics.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                  <Globe size={16} className="text-[#6e6e73]" />
                  <Cpu size={16} className="text-[#6e6e73]" />
                  <ShieldCheck size={16} className="text-[#6e6e73]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* PATH 2: ADMIN PORTAL */}
          <Link href="/admin" className="group">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative h-[320px] bg-white/60 dark:bg-[#2c2c2e]/60 backdrop-blur-2xl rounded-[32px] border border-gray-200/50 dark:border-white/5 p-10 flex flex-col justify-between overflow-hidden shadow-2xl shadow-black/5 hover:border-purple-500/50 transition-colors"
            >
              {/* Background Decoration */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />

              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/30 group-hover:-rotate-6 transition-transform">
                  <Settings2 size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">System Admin</h3>
                  <p className="text-sm text-[#6e6e73] leading-relaxed dark:text-[#86868b]">
                    Manage fleet vehicles, driver registrations, and global system configurations.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                  <Car size={16} className="text-[#6e6e73]" />
                  <Settings2 size={16} className="text-[#6e6e73]" />
                  <LayoutDashboard size={16} className="text-[#6e6e73]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

        </div>

        {/* FOOTER INFO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-[0.2em]">
            Secured and Encrypted Fleet Network
          </p>
          <div className="h-px w-12 bg-gray-300 dark:bg-white/10" />
          <div className="text-[10px] text-[#86868b] flex items-center gap-2">
            <span>Server Status:</span>
            <span className="text-green-500 font-bold uppercase tracking-widest">Optimal</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}