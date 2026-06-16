"use client";

import React, { useState } from "react";
import { Truck, Activity, AlertTriangle, Search, Plus, Minus, Navigation } from "lucide-react";

export default function MobileDashboardView() {
  const [mapZoom, setMapZoom] = useState(13);

  // Sample data from Image 3
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 space-y-4 pb-20">
      {/* Active Vehicles Stat Card */}
      <div className="bg-white rounded-xl p-4 pb-6 border border-[#e2e8f0] shadow-sm relative overflow-hidden flex flex-col justify-between h-50">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-lg bg-[#e8fbf4] flex items-center justify-center text-[#10b981]">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#10b981] bg-[#e8fbf4] px-1.5 py-0.5 rounded-full">
            +12% from last week
          </span>
        </div>
        <div className="mt-2">
          <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
            Active Vehicles
          </p>
          <p className="text-2xl font-black text-[#0f172a] tracking-tight leading-none mt-1">
            1,284
          </p>
        </div>
        {/* Trend line visual representation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f1f5f9]">
          <div className="h-full bg-[#3b82f6] w-[70%]" />
        </div>
      </div>

      {/* KMS Driven Today Card */}
      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#2563eb] bg-[#eff6ff] px-1.5 py-0.5 rounded-full">
            On Target
          </span>
        </div>
        <div className="mt-1 flex justify-between items-end">
          <div>
            <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
              Kms Driven Today
            </p>
            <p className="text-2xl font-black text-[#0f172a] tracking-tight leading-none mt-1">
              42,890
            </p>
          </div>
          {/* Distribution bar chart */}
          <div className="flex items-end gap-1 h-8">
            <div className="w-2.5 bg-[#eff6ff] h-[20%] rounded-t-sm" />
            <div className="w-2.5 bg-[#eff6ff] h-[40%] rounded-t-sm" />
            <div className="w-2.5 bg-[#dbeafe] h-[55%] rounded-t-sm" />
            <div className="w-2.5 bg-[#bfdbfe] h-[75%] rounded-t-sm" />
            <div className="w-2.5 bg-[#60a5fa] h-[90%] rounded-t-sm" />
            <div className="w-2.5 bg-[#2563eb] h-[100%] rounded-t-sm" />
          </div>
        </div>
      </div>

      {/* Active Alerts Card */}
      <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center text-[#ef4444]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] px-1.5 py-0.5 rounded-md tracking-wider">
            CRITICAL
          </span>
        </div>
        <div className="mt-2 flex justify-between items-end">
          <div>
            <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
              Active Alerts
            </p>
            <p className="text-2xl font-black text-[#0f172a] tracking-tight leading-none mt-1">
              07
            </p>
          </div>
          <span className="text-[9px] font-bold text-[#64748b]">
            Avg. response: 4m 22s
          </span>
        </div>
      </div>

      {/* Live Fleet Section with Grayscale Map */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#f1f5f9]">
          <h3 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wider">
            Live Fleet
          </h3>
          <div className="flex items-start justify-between mt-1">
            <p className="text-[10px] font-bold text-[#64748b] max-w-[150px] leading-tight">
              Real-time telemetry and dispatch status
            </p>
            {/* Status indicators */}
            <div className="flex gap-1.5">
              <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-[#10b981] bg-[#e8fbf4] px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-[#10b981]" /> Active
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-[#ef4444] bg-[#fef2f2] px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-[#ef4444]" /> Alert
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-[#64748b] bg-[#f1f5f9] px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-[#64748b]" /> Offline
              </span>
            </div>
          </div>
        </div>

        {/* Styled Grayscale map area */}
        <div className="relative h-96 bg-[#e2e8f0] flex flex-col justify-between overflow-hidden">
          {/* Stylized Grid SVG Overlay */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Map decorative lines (simulating streets) */}
          <svg className="absolute inset-0 w-full h-full text-slate-400 stroke-current opacity-30" strokeWidth="2.5">
            <line x1="0" y1="50" x2="400" y2="120" />
            <line x1="50" y1="0" x2="180" y2="250" />
            <line x1="0" y1="200" x2="400" y2="170" />
            <line x1="300" y1="0" x2="250" y2="250" />
            <path d="M 0,100 C 150,150 200,80 400,220" fill="none" strokeWidth="4" className="text-slate-500" />
          </svg>

          {/* Map Search input */}
          <div className="p-3 z-10 w-full">
            <div className="relative w-full shadow-md rounded-lg overflow-hidden bg-white border border-[#e2e8f0]">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find vehicle or driver..."
                className="w-full pl-9 pr-4 py-2 text-[10px] text-[#0f172a] placeholder-[#94a3b8] bg-white outline-none font-bold"
              />
            </div>
          </div>

          {/* Interactive Map Pins */}
          {/* 1. Green vehicle pin */}
          <div className="absolute left-[40%] top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center text-white border-2 border-white shadow-lg">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div className="w-1.5 h-1.5 bg-[#10b981] rotate-45 -mt-0.5 border-r border-b border-white" />
          </div>

          {/* 2. Red Alert Pin */}
          <div className="absolute left-[55%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-bounce">
            <div className="w-7 h-7 rounded-full bg-[#ef4444] flex items-center justify-center text-white border-2 border-white shadow-lg">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="w-1.5 h-1.5 bg-[#ef4444] rotate-45 -mt-0.5 border-r border-b border-white" />
          </div>

          {/* 3. Grey Offline Pin */}
          <div className="absolute left-[68%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-[#64748b] flex items-center justify-center text-white border-2 border-white shadow-lg">
              <Truck className="w-3.5 h-3.5 opacity-70" />
            </div>
            <div className="w-1.5 h-1.5 bg-[#64748b] rotate-45 -mt-0.5 border-r border-b border-white" />
          </div>

          {/* Map Zoom Controls on bottom-right */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => setMapZoom(z => Math.min(z + 1, 18))}
              className="w-7 h-7 bg-white rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] shadow-md hover:bg-slate-50 font-bold text-xs"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
            </button>
            <button
              onClick={() => setMapZoom(z => Math.max(z - 1, 10))}
              className="w-7 h-7 bg-white rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] shadow-md hover:bg-slate-50 font-bold text-xs"
            >
              <Minus className="w-4 h-4 stroke-[3px]" />
            </button>
            <button className="w-7 h-7 bg-[#2563eb] rounded-lg flex items-center justify-center text-white shadow-md hover:bg-blue-600">
              <Navigation className="w-4 h-4 rotate-45" />
            </button>
          </div>

          {/* Bottom GPS Coordinates Banner */}
          <div className="w-full bg-white/95 backdrop-blur-sm border-t border-[#f1f5f9] px-3 py-2 flex justify-between items-center text-[8px] font-extrabold text-[#64748b] z-10 tracking-wider">
            <div>
              LAT: <span className="text-[#0f172a]">41.8781° N</span>
            </div>
            <div>
              LONG: <span className="text-[#0f172a]">87.6298° W</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#10b981]" />
              UPDATED 2 SECONDS AGO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
