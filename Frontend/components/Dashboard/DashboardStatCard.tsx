"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendType?: "up" | "down";
  index: number;
}

export default function DashboardStatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendType,
  index 
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="p-8 bg-[#2c2c2e]/50 backdrop-blur-xl border border-white/5 rounded-[32px] group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-12 h-12 bg-blue-500/20 rounded-full blur-xl" />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">
            {label}
          </p>
          <h3 className="text-4xl font-black text-white tracking-tighter group-hover:scale-[1.02] origin-left transition-transform duration-500">
            {value}
          </h3>
        </div>

        {trend && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              trendType === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
            }`}>
              {trendType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
            <span className="text-[9px] font-bold text-[#424245] uppercase tracking-widest">since last week</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
