"use client";

import React from "react";
import { motion } from "framer-motion";
import {
   Car,
   Users,
   ShieldCheck,
   ArrowRight,
   Plus,
   LayoutDashboard,
   Edit,
   Activity,
   CarFront
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

   return (
      <motion.div
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="max-w-7xl mx-auto p-8 lg:p-12 space-y-16"
      >
         {/* 1. HEADER */}
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                  <LayoutDashboard size={16} />
                  Administrative Command Hub
               </div>
               <h1 className="text-6xl font-black tracking-tighter leading-none text-white">
                  Admin <span className="text-[#6e6e73]">Operations</span>
               </h1>
               <p className="text-[#86868b] text-xl font-medium tracking-tight">
                  Manage fleet specifications and client registry protocols.
               </p>
            </div>

            <div className="flex gap-4">
               <Link href="/" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Return to Monitoring
               </Link>
            </div>
         </header>

         {/* 2. QUICK ACTIONS (PATHWAYS TO EDIT) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard
               variants={itemVariants}
               title="Manage Fleet Operations"
               count={vehicles.length}
               label="Total Units"
               href="/Admin/Vehicle"
               icon={<CarFront size={48} />}
               color="blue"
            />
            <ActionCard
               variants={itemVariants}
               title="Manage Client Registry"
               count={clients.length}
               label="Total Clients"
               href="/Admin/Client"
               icon={<Users size={48} />}
               color="purple"
            />
         </div>

         {/* 3. RECENT ACTIVITY SPLIT VIEW */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* RECENT VEHICLES */}
            <motion.div variants={itemVariants} className="space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Recently Added Units</h4>
                  <Link href="/Admin/Vehicle" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View Spec Sheet</Link>
               </div>
               <div className="space-y-4">
                  {vehicles.slice(-5).reverse().map((v) => (
                     <RecentItem
                        key={v.id}
                        title={`${v.make} ${v.model}`}
                        subtitle={v.license_plate || v.licensePlate}
                        href="/Admin/Vehicle"
                        icon={<Car size={18} />}
                     />
                  ))}
               </div>
            </motion.div>

            {/* RECENT CLIENTS */}
            <motion.div variants={itemVariants} className="space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Recently Registered Clients</h4>
                  <Link href="/Admin/Client" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View Registry</Link>
               </div>
               <div className="space-y-4">
                  {clients.slice(-5).reverse().map((c) => (
                     <RecentItem
                        key={c.id}
                        title={`${c.first_name} ${c.last_name}`}
                        subtitle={c.email}
                        href="/Admin/Client"
                        icon={<Users size={18} />}
                     />
                  ))}
               </div>
            </motion.div>
         </div>

         {/* BACKGROUND DECORATION */}
         <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </motion.div>
   );
}

function ActionCard({ title, count, label, href, icon, color, variants }: any) {
   const themes: any = {
      blue: "hover:shadow-[0_20px_80px_rgba(0,113,227,0.1)] group-hover:border-blue-500/30",
      purple: "hover:shadow-[0_20px_80px_rgba(168,85,247,0.1)] group-hover:border-purple-500/30",
   };

   return (
      <motion.div variants={variants}>
         <Link href={href} className="group block h-full">
            <div className={`h-full p-12 bg-white/[0.02] border border-white/5 rounded-[40px] transition-all duration-500 flex flex-col justify-between ${themes[color]}`}>
               <div className="flex justify-between items-start mb-12">
                  <div className={`w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
                     {icon}
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest mb-1">{label}</p>
                     <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{count}</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <h3 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase">{title}</h3>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                     Open Management Table
                     <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </div>
               </div>
            </div>
         </Link>
      </motion.div>
   );
}

function RecentItem({ title, subtitle, href, icon }: any) {
   return (
      <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.05] transition-all">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:bg-blue-600 group-hover:text-white transition-all">
               {icon}
            </div>
            <div>
               <p className="text-sm font-bold text-white uppercase tracking-tight">{title}</p>
               <p className="text-[10px] font-medium text-[#6e6e73]">{subtitle}</p>
            </div>
         </div>
         <Link href={href} className="p-3 bg-white/5 rounded-xl text-[#424245] hover:text-white hover:bg-blue-600 transition-all">
            <Edit size={14} />
         </Link>
      </div>
   );
}
