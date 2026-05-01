"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Car, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Mail,
  Smartphone,
  Hash
} from "lucide-react";
import Link from "next/link";

// --- TYPES ---

interface Vehicle {
  id: number;
  make: string;
  model: string;
  license_plate?: string;
  licensePlate?: string;
  status: string;
}

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

interface DashboardProps {
  stats: {
    totalFleet: number;
    availableFleet: number;
    totalClients: number;
    activeClients: number;
  };
  recentVehicles: Vehicle[];
  recentClients: Client[];
}

// --- MAIN CLIENT COMPONENT ---

export default function MainDashboardClient({ stats, recentVehicles, recentClients }: DashboardProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12"
    >
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Operational Core Hub
           </div>
           <h1 className="text-6xl font-black tracking-tighter leading-none text-white">
              System <span className="text-[#6e6e73]">Overview</span>
           </h1>
           <div className="flex items-center gap-4 text-[#86868b] font-medium tracking-tight">
              <Clock size={16} />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              <span className="opacity-30">|</span>
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
           </div>
        </div>

        <div className="flex gap-4">
           <Link href="/Admin" className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d1d1d6] transition-all shadow-xl active:scale-95">
              Enter Admin Panel
           </Link>
        </div>
      </header>

      {/* 2. STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          variants={itemVariants}
          icon={<Car size={24} />} 
          label="Total Fleet Size" 
          value={stats.totalFleet.toString()} 
          color="blue"
        />
        <StatCard 
          variants={itemVariants}
          icon={<ShieldCheck size={24} />} 
          label="Available Units" 
          value={stats.availableFleet.toString()} 
          color="green"
        />
        <StatCard 
          variants={itemVariants}
          icon={<Users size={24} />} 
          label="Registered Clients" 
          value={stats.totalClients.toString()} 
          color="orange"
        />
        <StatCard 
          variants={itemVariants}
          icon={<Activity size={24} />} 
          label="Active Accounts" 
          value={stats.activeClients.toString()} 
          color="purple"
        />
      </div>

      {/* 3. QUICK NAVIGATION BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <QuickAction 
            variants={itemVariants}
            title="Fleet Manager" 
            desc="Control specifications and availability" 
            href="/Admin/Vehicle" 
            icon={<Car />} 
         />
         <QuickAction 
            variants={itemVariants}
            title="Client Registry" 
            desc="Verify identity and security status" 
            href="/Admin/Client" 
            icon={<Users />} 
         />
      </div>

      {/* 4. RECENT ACTIVITY SPLIT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* RECENT VEHICLES */}
         <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Recent Fleet Additions</h4>
               <Link href="/Admin/Vehicle" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
               {recentVehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.05] transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <Car size={18} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white uppercase">{v.make} {v.model}</p>
                           <p className="text-[10px] font-mono text-[#6e6e73] tracking-widest">{v.license_plate || v.licensePlate}</p>
                        </div>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        v.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                     }`}>
                        {v.status}
                     </span>
                  </div>
               ))}
               {recentVehicles.length === 0 && <p className="text-center text-[#6e6e73] text-[10px] py-10 uppercase tracking-widest">No recent data</p>}
            </div>
         </motion.div>

         {/* RECENT CLIENTS */}
         <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">New Client Registrations</h4>
               <Link href="/Admin/Client" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
               {recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.05] transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all">
                           {c.first_name[0]}{c.last_name[0]}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white">{c.first_name} {c.last_name}</p>
                           <p className="text-[10px] font-medium text-[#6e6e73]">{c.email}</p>
                        </div>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        c.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                     }`}>
                        {c.status}
                     </span>
                  </div>
               ))}
               {recentClients.length === 0 && <p className="text-center text-[#6e6e73] text-[10px] py-10 uppercase tracking-widest">No recent data</p>}
            </div>
         </motion.div>
      </div>

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </motion.div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ icon, label, value, color, variants }: any) {
  const colors: any = {
    blue: "text-blue-500 shadow-blue-500/5",
    green: "text-green-500 shadow-green-500/5",
    orange: "text-orange-500 shadow-orange-500/5",
    purple: "text-purple-500 shadow-purple-500/5",
  };

  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-8 bg-[#2c2c2e]/50 backdrop-blur-xl border border-white/5 rounded-[32px] flex flex-col gap-6 group transition-all hover:border-blue-500/30 ${colors[color]}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">{label}</p>
        <p className="text-4xl font-black text-white tracking-tighter leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

function QuickAction({ title, desc, href, icon, variants }: any) {
  return (
    <motion.div variants={variants}>
      <Link href={href} className="group block">
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.05] transition-all flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {icon}
             </div>
             <div>
                <h4 className="text-lg font-black text-white tracking-tight uppercase">{title}</h4>
                <p className="text-sm font-medium text-[#6e6e73] group-hover:text-[#86868b] transition-colors">{desc}</p>
             </div>
          </div>
          <ArrowRight className="text-[#424245] group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
