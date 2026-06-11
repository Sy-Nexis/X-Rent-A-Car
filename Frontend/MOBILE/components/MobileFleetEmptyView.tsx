"use client";

import React from "react";
import { Siren, Plus, FileSpreadsheet, Network } from "lucide-react";

interface MobileFleetEmptyViewProps {
  onEnterVehicle: () => void;
}

export default function MobileFleetEmptyView({ onEnterVehicle }: MobileFleetEmptyViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#fcf9f9] pb-20">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        {/* Large siren icon with blue circular badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl border border-slate-200 flex items-center justify-center bg-[#f8fafc] text-[#94a3b8]">
            <Siren className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 text-[#2563eb]">
            <Plus className="w-4 h-4 stroke-[3px]" />
          </div>
        </div>

        {/* Info */}
        <h3 className="text-base font-black text-[#0f172a] tracking-tight">
          Fleet registry empty
        </h3>
        <p className="text-[10px] font-bold text-[#64748b] leading-relaxed mt-2 max-w-[260px]">
          Your management dashboard is ready for operation. Add your first vehicle to begin tracking diagnostics, fuel consumption, and route performance.
        </p>

        {/* Enter Vehicle primary action */}
        <button
          onClick={onEnterVehicle}
          className="w-full max-w-[280px] bg-[#2563eb] text-white text-[9.5px] font-extrabold py-3.5 rounded-lg shadow-md transition-all hover:bg-blue-700 active:scale-95 mt-6 uppercase tracking-wider"
        >
          Enter Vehicle
        </button>
      </div>

      {/* Cards at the bottom */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Bulk Import */}
        <div className="bg-white rounded-xl p-3 border border-[#e2e8f0] shadow-sm flex flex-col space-y-1 hover:border-blue-200 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <span className="text-[9.5px] font-black text-[#1e293b] mt-1">
            Bulk Import
          </span>
          <span className="text-[8px] font-bold text-[#64748b] leading-tight">
            Upload CSV/Excel fleet data.
          </span>
        </div>

        {/* API Sync */}
        <div className="bg-white rounded-xl p-3 border border-[#e2e8f0] shadow-sm flex flex-col space-y-1 hover:border-blue-200 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <span className="text-[9.5px] font-black text-[#1e293b] mt-1">
            API Sync
          </span>
          <span className="text-[8px] font-bold text-[#64748b] leading-tight">
            Connect external telematics.
          </span>
        </div>
      </div>
    </div>
  );
}
