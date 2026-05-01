"use client";

import React from "react";
import { motion } from "framer-motion";
import { tripsData, alertsData } from "./mockData";

interface FleetStatusProps {
  vehicles?: any[];
}

export function TripsBarChart() {
  const maxTrips = Math.max(...tripsData.map(d => d.trips));

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Fleet Utilization</h3>
           <p className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.3em]">Weekly Statistics</p>
        </div>
        <div className="text-[10px] font-black text-blue-apple uppercase tabular-nums tracking-widest">
           Avg: 148 trips
        </div>
      </div>
      
      <div className="flex items-end justify-between h-40 gap-2">
        {tripsData.map((data, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
            <div className="relative w-full h-full flex items-end">
               <motion.div
                 initial={{ height: 0 }}
                 animate={{ height: `${(data.trips / maxTrips) * 100}%` }}
                 transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                 className="w-full bg-blue-apple/10 rounded-t-lg group-hover:bg-blue-apple transition-all duration-300 relative"
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black tabular-nums bg-bg-surface border border-border-subtle px-2 py-1 rounded-md shadow-xl">
                     {data.trips}
                  </div>
               </motion.div>
            </div>
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">{data.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FleetStatusDonut({ vehicles = [] }: FleetStatusProps) {
  const activeCount = vehicles.filter(v => v.status === 'Active' || v.status === 'Available').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;
  const prepCount = vehicles.filter(v => v.status === 'In Prep').length;
  const total = vehicles.length || 1;

  const segments = [
    { name: "Operational", value: activeCount, color: "#0071e3", percentage: (activeCount / total) * 100 },
    { name: "Maintenance", value: maintenanceCount, color: "#ff453a", percentage: (maintenanceCount / total) * 100 },
    { name: "In Prep", value: prepCount, color: "#ff9f0a", percentage: (prepCount / total) * 100 },
  ];

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm">
       <div className="mb-6">
          <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Fleet Status</h3>
          <p className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.3em]">Operational Health</p>
       </div>
      
      <div className="relative aspect-square flex items-center justify-center mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((s, i) => {
            const offset = segments.slice(0, i).reduce((acc, curr) => acc + curr.percentage, 0);
            return (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={s.color}
                strokeWidth="10"
                strokeDasharray={`${s.percentage} 100`}
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${s.percentage} 100` }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
           <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total</span>
           <span className="text-3xl font-black text-text-primary tabular-nums">{vehicles.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-tight">{s.name}</span>
            </div>
            <span className="text-[10px] font-black text-text-primary tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActiveAlerts() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Active Alerts</h3>
           <p className="text-[8px] font-bold text-text-secondary uppercase tracking-[0.3em]">Security & Health</p>
        </div>
        <span className="px-2 py-1 bg-red-apple/10 text-red-apple text-[8px] font-black rounded-full border border-red-apple/20 uppercase tracking-widest">
           Live
        </span>
      </div>
      
      <div className="space-y-4">
        {alertsData.map((alert, i) => (
          <div key={i} className="p-4 bg-bg-base/50 rounded-2xl border border-border-subtle/50 flex items-start gap-4 group hover:bg-bg-base transition-colors">
            <span className="text-lg leading-none">{alert.severity}</span>
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-tight group-hover:text-red-apple transition-colors">{alert.title}</h4>
              <p className="text-[9px] font-medium text-text-secondary uppercase tracking-tighter">{alert.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
