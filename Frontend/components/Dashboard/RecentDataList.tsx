"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

interface RecentItem {
  id: string | number;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  icon?: React.ReactNode;
}

interface RecentDataListProps {
  title: string;
  items: RecentItem[];
  viewAllHref: string;
  viewAllLabel: string;
  delay?: number;
}

export default function RecentDataList({ title, items, viewAllHref, viewAllLabel, delay = 0 }: RecentDataListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className="bg-[#2c2c2e]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">{title}</h4>
          <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Real-time Stream</p>
        </div>
        <div className="p-2.5 bg-white/5 rounded-2xl text-[#6e6e73]">
          <Clock size={16} />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + 0.3 + (idx * 0.1) }}
            className="flex items-center justify-between p-4 hover:bg-white/5 rounded-[24px] transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-all">
                {item.icon ? item.icon : item.title[0]}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h5>
                <p className="text-[11px] font-medium text-[#6e6e73] mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
               }`}>
                  {item.status}
               </span>
               <span className="text-[10px] font-bold text-[#424245] uppercase tabular-nums">{item.meta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <Link 
        href={viewAllHref}
        className="mt-10 pt-10 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] font-black text-[#6e6e73] hover:text-white uppercase tracking-[0.3em] transition-all group"
      >
        {viewAllLabel}
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
