"use client";

import React from "react";
import { motion } from "framer-motion";
import {
   Car,
   Users,
   ArrowRight,
   LayoutDashboard,
   Edit,
   CarFront,
   Hammer,
   ShieldAlert,
   Award
} from "lucide-react";
import Link from "next/link";

interface AdminHubProps {
   vehicles: any[];
   clients: any[];
}

export default function AdminHubClient({ vehicles, clients }: AdminHubProps) {
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { staggerChildren: 0.1 }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
   };

   // Calculations from real API data
   const activeTransit = vehicles.filter(v => v.status?.toLowerCase() === 'active' || v.status?.toLowerCase() === 'available').length;
   const inMaintenance = vehicles.filter(v => v.status?.toLowerCase() === 'maintenance' || v.status?.toLowerCase() === 'alert').length;

   const activeClients = clients.filter(c => c.status === 'Active').length;
   const reviewClients = clients.filter(c => c.status !== 'Active').length;

   return (
      <motion.div
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12 select-none"
      >
         {/* 1. HEADER */}
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                  <LayoutDashboard size={14} />
                  Administrative Command Hub
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white">
                  Admin <span className="text-[#6e6e73]">Operations</span>
               </h1>
               <p className="text-[#86868b] text-sm md:text-lg font-medium tracking-tight">
                  Manage global fleet specifications and client registry protocols.
               </p>
            </div>

            <div className="flex gap-4">
               <Link href="/" className="px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-200 active:scale-95 min-h-[44px] flex items-center justify-center">
                  Return to Monitoring
               </Link>
            </div>
         </header>

         {/* 2. RESPONSIVE ACTIONS PANEL */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard
               variants={itemVariants}
               title="Fleet Operations"
               count={vehicles.length}
               label="Total Unit Count"
               href="/Admin/Vehicle"
               icon={<CarFront size={32} />}
               color="blue"
               details={[
                  { label: "Active Transit", value: activeTransit, active: true },
                  { label: "In Maintenance", value: inMaintenance, alert: true }
               ]}
            />
            <ActionCard
               variants={itemVariants}
               title="Client Registry"
               count={clients.length}
               label="Total Client Count"
               href="/Admin/Client"
               icon={<Users size={32} />}
               color="purple"
               details={[
                  { label: "Active Tiers", value: activeClients },
                  { label: "Pending Review", value: reviewClients, alert: reviewClients > 0 }
               ]}
            />
         </div>

         {/* 3. RECENT ACTIVITY SPLIT VIEW */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* RECENT VEHICLES */}
            <motion.div variants={itemVariants} className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Recently Added Units</h4>
                  <Link href="/Admin/Vehicle" className="text-[10px] font-black text-blue-550 uppercase tracking-widest hover:underline">View Spec Sheet</Link>
               </div>
               <div className="space-y-3">
                  {vehicles.slice(-5).reverse().map((v) => (
                     <RecentItem
                        key={v.id}
                        title={`${v.make} ${v.model}`}
                        subtitle={v.license_plate || v.licensePlate}
                        href="/Admin/Vehicle"
                        icon={<Car size={16} />}
                     />
                  ))}
               </div>
            </motion.div>

            {/* RECENT CLIENTS */}
            <motion.div variants={itemVariants} className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Recently Registered</h4>
                  <Link href="/Admin/Client" className="text-[10px] font-black text-blue-550 uppercase tracking-widest hover:underline">View Registry</Link>
               </div>
               <div className="space-y-3">
                  {clients.slice(-5).reverse().map((c) => (
                     <RecentItem
                        key={c.id}
                        title={`${c.first_name} ${c.last_name}`}
                        subtitle={c.email}
                        href="/Admin/Client"
                        icon={<Users size={16} />}
                     />
                  ))}
               </div>
            </motion.div>
         </div>

         {/* 4. SYSTEM INTEGRITY STAT */}
         <motion.div
            variants={itemVariants}
            className="w-full bg-[#111c35]/30 backdrop-blur-md border border-blue-500/10 rounded-[24px] p-6 text-white relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
         >
            <div className="absolute right-4 bottom-0 opacity-[0.03] translate-y-4">
               <LayoutDashboard className="w-32 h-32 text-blue-500" />
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-blue-400 tracking-[0.3em] uppercase">
                  Global System Integrity
               </p>
               <p className="text-3xl font-black tracking-tighter leading-none mt-1">
                  99.98%
               </p>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Operational Fleet Nodes Online
               </p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               All Nodes Operational
            </div>
         </motion.div>

         {/* BACKGROUND DECORATION */}
         <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </motion.div>
   );
}

function ActionCard({ title, count, label, href, icon, color, details, variants }: any) {
   const themes: any = {
      blue: "hover:shadow-[0_20px_50px_rgba(59,130,246,0.05)] hover:border-blue-500/20",
      purple: "hover:shadow-[0_20px_50px_rgba(168,85,247,0.05)] hover:border-purple-500/20",
   };

   return (
      <motion.div variants={variants}>
         <Link href={href} className="group block h-full">
            <div className={`h-full p-8 bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[32px] transition-all duration-300 flex flex-col justify-between ${themes[color]}`}>
               <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
                     {icon}
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                     <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{count}</p>
                  </div>
               </div>

               {/* Detailed status row items */}
               {details && (
                  <div className="space-y-2 border-t border-white/5 pt-4 mb-6 text-[10px] font-bold">
                     {details.map((detail: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                           <span className="flex items-center gap-2 text-gray-400">
                              <span className={`w-1.5 h-1.5 rounded-full ${detail.alert ? 'bg-red-500' : detail.active ? 'bg-green-500' : 'bg-blue-500'}`} />
                              {detail.label}
                           </span>
                           <span className="text-white font-extrabold">{detail.value}</span>
                        </div>
                     ))}
                  </div>
               )}

               <div className="space-y-4">
                  <h3 className="text-xl font-black text-white tracking-tighter leading-tight uppercase">{title}</h3>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-550 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/10 min-h-[38px] active:scale-95 duration-200">
                     Open Console Registry
                     <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </div>
         </Link>
      </motion.div>
   );
}

function RecentItem({ title, subtitle, href, icon }: any) {
   return (
      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all duration-300">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:bg-blue-600 group-hover:text-white transition-all">
               {icon}
            </div>
            <div>
               <p className="text-xs font-black text-white uppercase tracking-tight">{title}</p>
               <p className="text-[9px] font-bold text-gray-500 mt-0.5">{subtitle}</p>
            </div>
         </div>
         <Link href={href} className="p-2.5 bg-white/5 hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all duration-200 min-h-[36px] min-w-[36px] flex items-center justify-center active:scale-95">
            <Edit size={12} />
         </Link>
      </div>
   );
}

