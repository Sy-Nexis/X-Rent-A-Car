"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus, RefreshCcw, Car, ShieldAlert, MapPin } from "lucide-react";
import { drivers } from "./mockData";

export function LiveFleetMap() {
  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle overflow-hidden flex flex-col h-[500px] shadow-sm">
      <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-surface z-10 relative">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Live Fleet Map</h2>
          <p className="text-xs text-text-secondary mt-1">Real-time GPS · 48 vehicles tracked</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <Plus size={18} />
          </button>
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <Minus size={18} />
          </button>
          <button className="p-2 rounded-element hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#eef2f5] dark:bg-[#1a1f24] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-apple/30"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M100,100 C150,200 300,150 400,300" fill="none" stroke="#0071e3" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
          <path d="M500,50 C450,150 600,250 550,400" fill="none" stroke="#0071e3" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
        </svg>

        <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
          <div className="bg-blue-apple text-white p-2 rounded-full shadow-lg shadow-blue-apple/30 animate-bounce">
            <Car size={16} />
          </div>
          <div className="mt-1 bg-bg-surface px-2 py-1 rounded shadow text-[10px] font-bold text-text-primary">
            Amal K.
          </div>
        </div>
        
        <div className="absolute top-[60%] left-[20%] flex flex-col items-center">
          <div className="bg-orange-apple text-white p-2 rounded-full shadow-lg">
            <Car size={16} />
          </div>
        </div>

        <div className="absolute top-[20%] left-[70%] flex flex-col items-center">
          <div className="bg-red-apple text-white p-2 rounded-full shadow-lg">
            <ShieldAlert size={16} />
          </div>
          <div className="mt-1 bg-bg-surface px-2 py-1 rounded shadow text-[10px] font-bold text-red-apple">
            Speeding
          </div>
        </div>

        <div className="absolute top-[70%] left-[60%] flex flex-col items-center">
          <div className="bg-green-apple text-white p-2 rounded-full shadow-lg">
            <Car size={16} />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-bg-surface/90 backdrop-blur rounded-element p-3 shadow-md border border-border-subtle text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-apple"></span> Active</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-apple"></span> Idle</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-apple"></span> Alert</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-border-subtle"></span> Offline</div>
        </div>
      </div>
    </div>
  );
}

export function DriverRoster() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-blue-apple/10 text-blue-apple border-blue-apple/20";
      case "Idle": return "bg-orange-apple/10 text-orange-apple border-orange-apple/20";
      case "Alert": return "bg-red-apple/10 text-red-apple border-red-apple/20";
      default: return "bg-bg-base text-text-secondary border-border-subtle";
    }
  };

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-5 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-text-primary">Driver Roster</h2>
        <div className="px-2.5 py-1 bg-bg-base text-xs font-medium rounded-full text-text-secondary border border-border-subtle">
          42 on duty
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-secondary border-b border-border-subtle">
            <tr>
              <th className="pb-3 font-medium px-2">Driver</th>
              <th className="pb-3 font-medium px-2">Vehicle / Loc</th>
              <th className="pb-3 font-medium px-2">Speed</th>
              <th className="pb-3 font-medium px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, i) => (
              <tr key={i} className="group border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-apple/80 to-purple-apple/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {driver.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="font-medium text-text-primary whitespace-nowrap">{driver.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-col">
                    <span className="text-text-primary font-medium">{driver.id}</span>
                    <span className="text-text-secondary text-xs">{driver.location}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-text-primary font-medium">
                    {driver.speed} <span className="text-text-secondary text-xs font-normal">km/h</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
