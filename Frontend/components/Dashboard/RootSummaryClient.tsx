"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Car, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  LayoutDashboard,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Variants } from "framer-motion";

interface RootSummaryProps {
  stats: {
    totalFleet: number;
    availableFleet: number;
    totalClients: number;
  };
}

export default function RootSummaryClient({ stats }: RootSummaryProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full -z-0" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20 lg:py-32 space-y-24"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-6 text-center">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Live Operation System</span>
           </div>
           <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-none italic">
              XNRENT<span className="text-blue-500">.</span>
           </h1>
           <p className="text-[#86868b] text-xl font-medium tracking-tight max-w-2xl mx-auto uppercase">
              Global Summary Overview & Central Command Hub
           </p>
        </motion.div>

        {/* Massive Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <SummaryStatCard 
              label="Total Fleet" 
              value={stats.totalFleet.toString()} 
              icon={<Car size={32} />} 
              subtext="Units Registered"
           />
           <SummaryStatCard 
              label="Available Cars" 
              value={stats.availableFleet.toString()} 
              icon={<ShieldCheck size={32} />} 
              subtext="Operational Now"
           />
           <SummaryStatCard 
              label="Registered Clients" 
              value={stats.totalClients.toString()} 
              icon={<Users size={32} />} 
              subtext="Security Cleared"
           />
        </motion.div>

        {/* Navigation Portals */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <NavPortal 
              title="Go to Fleet Operations Center" 
              desc="Access real-time monitoring, GPS tracking, and fleet analytics."
              href="/Admin"
              icon={<LayoutDashboard size={40} />}
              color="blue"
           />
           <NavPortal 
              title="Manage Client Registry" 
              desc="Update identities, check statuses, and manage customer relations."
              href="/Admin/Client"
              icon={<Users size={40} />}
              color="purple"
           />
        </motion.div>

        {/* Footer info */}
        <motion.div variants={itemVariants} className="text-center pt-10">
           <p className="text-[10px] font-black text-[#424245] uppercase tracking-[0.6em]">System V3.0 // Fleet Intelligence Division</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SummaryStatCard({ label, value, icon, subtext }: any) {
  return (
    <div className="p-12 bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/5 rounded-[40px] flex flex-col items-center text-center gap-8 group hover:border-blue-500/30 transition-all duration-500">
       <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-blue-600 group-hover:scale-110">
          {icon}
       </div>
       <div className="space-y-2">
          <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.4em]">{label}</p>
          <p className="text-7xl font-black text-white tracking-tighter tabular-nums">{value}</p>
          <p className="text-xs font-bold text-blue-500/50 uppercase tracking-widest">{subtext}</p>
       </div>
    </div>
  );
}

function NavPortal({ title, desc, href, icon, color }: any) {
  const themes: any = {
    blue: "hover:shadow-[0_20px_80px_rgba(0,113,227,0.15)] group-hover:border-blue-500/30",
    purple: "hover:shadow-[0_20px_80px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30",
  };

  return (
    <Link href={href} className="group block">
      <div className={`p-12 bg-white/[0.02] border border-white/5 rounded-[48px] h-full transition-all duration-700 flex flex-col justify-between ${themes[color]}`}>
         <div className="space-y-8">
            <div className={`w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
               {icon}
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{title}</h3>
               <p className="text-lg font-medium text-[#86868b] leading-relaxed group-hover:text-white/70 transition-colors">
                  {desc}
               </p>
            </div>
         </div>
         <div className="mt-12 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 group-hover:text-white transition-all">
            Enter Portal
            <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
         </div>
      </div>
    </Link>
  );
}
