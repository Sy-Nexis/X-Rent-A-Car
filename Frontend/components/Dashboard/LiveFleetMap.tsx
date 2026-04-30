"use client";

import React from "react";
import { Plus, Minus, RefreshCcw, Car, ShieldAlert } from "lucide-react";

export default function LiveFleetMap() {
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
