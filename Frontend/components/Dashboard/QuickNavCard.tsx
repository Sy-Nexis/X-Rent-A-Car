"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface QuickNavCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  color: "blue" | "purple";
  index: number;
}

export default function QuickNavCard({ title, subtitle, icon, href, color, index }: QuickNavCardProps) {
  const themes = {
    blue: "hover:shadow-[0_20px_80px_rgba(0,113,227,0.15)] group-hover:border-blue-500/30 group-hover:bg-blue-500/5",
    purple: "hover:shadow-[0_20px_80px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30 group-hover:bg-purple-500/5",
  };

  const iconColors = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
      className="group relative h-full"
    >
      <Link href={href} className="block h-full">
        <div className={`h-full p-12 bg-white/[0.02] border border-white/5 rounded-[40px] transition-all duration-500 flex flex-col justify-between ${themes[color]}`}>
          
          <div className="space-y-8">
            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconColors[color]}`}>
              {icon}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{title}</h3>
               <p className="text-lg font-medium text-[#86868b] max-w-[280px] leading-relaxed group-hover:text-white/70 transition-colors">
                  {subtitle}
               </p>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between">
             <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#6e6e73] group-hover:text-white transition-all">
                Enter Terminal
                <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
             </div>
             
             {/* GLOW DECORATOR */}
             <div className={`w-1 h-12 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity ${color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
