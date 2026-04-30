"use client";

import React from "react";
import { motion } from "framer-motion";
import { statsData } from "./mockData";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-surface p-5 rounded-card border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-element flex items-center justify-center ${stat.bg} ${stat.iconColor}`}>
              <stat.icon size={20} />
            </div>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">{stat.title}</h3>
          <div className="text-3xl font-bold text-text-primary mb-2">{stat.value}</div>
          <div className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</div>
        </motion.div>
      ))}
    </div>
  );
}
