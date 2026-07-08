"use client";

import React from "react";
import { AlertCircle, RefreshCcw, Car, Plus } from "lucide-react";
import EmptyRegistry from "@/components/Admin/EmptyRegistry";

/**
 * VehicleErrorState
 * 
 * Displayed when the frontend cannot connect to the vehicle API.
 */
export function VehicleErrorState() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center text-red-500 mx-auto shadow-2xl shadow-red-500/10">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Fleet Offline</h2>
          <p className="text-[#6e6e73] font-medium leading-relaxed">
            The xrent Fleet API is unreachable or returned a critical error. Please ensure the backend is running and the vehicle registry endpoint is active.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleRetry}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3 border border-white/5"
          >
            <RefreshCcw size={16} />
            Retry Connection
          </button>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-mono text-[#424245] uppercase tracking-widest">
            TARGET_ADDR: http://localhost:8801/api/vehicles/view
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * VehicleEmptyState
 * 
 * Displayed when the database is connected but contains zero vehicles.
 */
export function VehicleEmptyState() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
      <EmptyRegistry
        heading="Fleet Registry Empty"
        subtext="Your fleet directory is currently unoccupied. Onboard your first unit to begin monitoring operational intelligence and asset status."
        buttonText="ONBOARD FIRST VEHICLE"
        href="/Admin/Vehicle/Data"
        icon={<Car size={44} className="text-white" strokeWidth={1.5} />}
        secondaryIcon={<Plus size={20} className="text-blue-400" strokeWidth={3} />}
      />
    </div>
  );
}
