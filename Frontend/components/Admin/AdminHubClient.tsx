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
         className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col gap-6 bg-[#0e0e11] select-none"
      >
         {/* 1. HEADER */}
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                  <LayoutDashboard size={24} className="text-brand-cyan" />
                  Admin Operations
               </h1>
               <p className="text-sm text-gray-400 font-medium">
                  Manage global fleet specifications and client registry protocols.
               </p>
            </div>

            <div className="flex gap-4">
               <Link href="/dashboard" className="px-5 py-2.5 bg-[#1e1e1e] border border-white/5 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-all shadow-md">
                  Return to Monitoring
               </Link>
            </div>
         </header>

         {/* 2. RESPONSIVE ACTIONS PANEL */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
               variants={itemVariants}
               title="Fleet Operations"
               count={vehicles.length}
               label="Total Unit Count"
               href="/vehicles"
               icon={<CarFront size={24} />}
               color="cyan"
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
               href="/clients"
               icon={<Users size={24} />}
               color="emerald"
               details={[
                  { label: "Active Tiers", value: activeClients, active: true },
                  { label: "Pending Review", value: reviewClients, alert: reviewClients > 0 }
               ]}
            />
         </div>

         {/* 3. RECENT ACTIVITY SPLIT VIEW */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* RECENT VEHICLES */}
            <motion.div variants={itemVariants} className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col h-full">
               <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">Recently Added Units</h4>
                  <Link href="/vehicles" className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View Spec Sheet</Link>
               </div>
               <div className="divide-y divide-white/5">
                  {vehicles.slice(-5).reverse().map((v) => (
                     <RecentItem
                        key={v.id}
                        title={`${v.make} ${v.model}`}
                        subtitle={v.license_plate || v.licensePlate}
                        href="/vehicles"
                        icon={<Car size={16} />}
                     />
                  ))}
               </div>
            </motion.div>

            {/* RECENT CLIENTS */}
            <motion.div variants={itemVariants} className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col h-full">
               <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">Recently Registered</h4>
                  <Link href="/clients" className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View Registry</Link>
               </div>
               <div className="divide-y divide-white/5">
                  {clients.slice(-5).reverse().map((c) => (
                     <RecentItem
                        key={c.id}
                        title={`${c.first_name} ${c.last_name}`}
                        subtitle={c.email}
                        href="/clients"
                        icon={<Users size={16} />}
                     />
                  ))}
               </div>
            </motion.div>
         </div>

         {/* 4. SYSTEM INTEGRITY STAT */}
         <motion.div
            variants={itemVariants}
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md mt-2"
         >
            <div className="absolute right-4 bottom-0 opacity-[0.02] translate-y-4">
               <LayoutDashboard className="w-32 h-32 text-brand-cyan" />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-extrabold text-gray-500 tracking-wider uppercase">
                  Global System Integrity
               </p>
               <p className="text-3xl font-black text-white leading-none mt-1">
                  99.98%
               </p>
               <p className="text-[11px] text-gray-400 font-bold mt-1">
                  Operational Fleet Nodes Online
               </p>
            </div>
            <div className="flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
               All Nodes Operational
            </div>
         </motion.div>
      </motion.div>
   );
}

function ActionCard({ title, count, label, href, icon, color, details, variants }: any) {
   const isCyan = color === 'cyan';
   
   return (
      <motion.div variants={variants}>
         <Link href={href} className="group block h-full">
            <div className="h-full p-6 bg-[#1e1e1e] border border-white/5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-md hover:border-white/10 hover:shadow-lg">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{label}</span>
                     <span className="text-3xl font-black text-white leading-none">{count}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 ${isCyan ? 'text-brand-cyan' : 'text-brand-green'}`}>
                     {icon}
                  </div>
               </div>

               {/* Detailed status row items */}
               {details && (
                  <div className="space-y-2 border-t border-white/5 pt-4 mb-6 text-[11px] font-bold">
                     {details.map((detail: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                           <span className="flex items-center gap-2 text-gray-400">
                              <span className={`w-1.5 h-1.5 rounded-full ${detail.alert ? 'bg-brand-red' : detail.active ? 'bg-brand-green' : 'bg-brand-cyan'}`} />
                              {detail.label}
                           </span>
                           <span className="text-white">{detail.value}</span>
                        </div>
                     ))}
                  </div>
               )}

               <div className="flex items-center justify-between mt-auto">
                  <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">{title}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-gradient text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/10 active:scale-95 duration-200 group-hover:opacity-90">
                     Open Console
                     <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
               </div>
            </div>
         </Link>
      </motion.div>
   );
}

function RecentItem({ title, subtitle, href, icon }: any) {
   return (
      <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 group-hover:text-brand-cyan transition-all flex-shrink-0">
               {icon}
            </div>
            <div className="flex flex-col min-w-0">
               <p className="text-xs font-bold text-white truncate">{title}</p>
               <p className="text-[10px] text-gray-500 font-semibold">{subtitle}</p>
            </div>
         </div>
         <Link href={href} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center active:scale-95">
            <Edit size={12} />
         </Link>
      </div>
   );
}
