"use client";

import React from "react";
import { motion } from "framer-motion";
import { statsData as mockStats } from "./mockData";
import { Car, Users, Route, ShieldAlert } from "lucide-react";

interface StatsRowProps {
  customStats?: any[];
}

const iconMap: any = {
  active: Car,
  fleet: Route,
  clients: Users,
  alerts: ShieldAlert
};

const bgMap: any = {
  active: "bg-blue-apple/10 text-blue-apple",
  fleet: "bg-green-apple/10 text-green-apple",
  clients: "bg-purple-apple/10 text-purple-apple",
  alerts: "bg-orange-apple/10 text-orange-apple"
};

export default function StatsRow({ customStats }: StatsRowProps) {
  const displayStats = customStats || mockStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayStats.map((stat, i) => {
        const Icon = stat.icon || iconMap[stat.type] || Car;
        const bgClass = stat.bg || bgMap[stat.type] || "bg-blue-apple/10 text-blue-apple";

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-surface p-5 rounded-card border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-element flex items-center justify-center ${bgClass}`}>
                <Icon size={20} />
              </div>
            </div>
            <h3 className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.title}</h3>
            <div className="text-3xl font-black text-text-primary mb-2 tabular-nums">{stat.value}</div>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${stat.trendColor || 'text-text-secondary'}`}>{stat.trend}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
