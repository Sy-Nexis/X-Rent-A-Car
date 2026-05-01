"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, MoreHorizontal, Car, Fuel, Settings2, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmptyFleet from "./EmptyFleet";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  dailyRate: number;
  branch: string;
  status: 'Active' | 'In Prep' | 'Maintenance';
  fuelType: string;
  transmission: string;
}

interface VehicleInventoryManagerProps {
  initialVehicles: Vehicle[];
}

const statusColors = {
  Active: "bg-green-500/10 text-green-500 border-green-500/20",
  "In Prep": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Maintenance: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function VehicleInventoryManager({ initialVehicles }: VehicleInventoryManagerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((v) => {
      const matchesSearch = 
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        v.vin.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, initialVehicles]);

  if (initialVehicles.length === 0) return <EmptyFleet />;

  return (
    <div className="space-y-8">
      
      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Search */}
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, plate or VIN..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>

        {/* Status Pills */}
        <div className="flex p-1.5 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/5">
          {["All", "Active", "In Prep", "Maintenance"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                statusFilter === status 
                  ? "text-[#1d1d1f] dark:text-white" 
                  : "text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              {statusFilter === status && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INVENTORY LIST */}
      <div className="bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-sm border border-gray-200/50 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200/50 dark:border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Vehicle Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">License Plate</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest text-center">Specs</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Daily Rate</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((vehicle) => (
                  <motion.tr
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <Car size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#1d1d1f] dark:text-white">
                            {vehicle.make} {vehicle.model}
                            <span className="ml-2 text-[#6e6e73] font-medium">{vehicle.year}</span>
                          </div>
                          <div className="text-[10px] font-mono text-[#6e6e73] uppercase tracking-tighter mt-1 truncate max-w-[120px]">
                            {vehicle.vin}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg font-mono text-xs font-bold tracking-widest border border-gray-200/50 dark:border-white/5">
                        {vehicle.licensePlate}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-4 text-[#6e6e73]">
                        <div className="flex flex-col items-center gap-1">
                          <Fuel size={14} />
                          <span className="text-[9px] font-bold uppercase">{vehicle.fuelType}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                          <Gauge size={14} />
                          <span className="text-[9px] font-bold uppercase">{vehicle.transmission[0]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-[#1d1d1f] dark:text-white">
                        ${vehicle.dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] text-[#6e6e73] font-medium ml-1">/ day</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[vehicle.status]}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${vehicle.status === 'Active' ? 'bg-green-500' : vehicle.status === 'In Prep' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-xl transition-all text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* FOOTER INFO */}
        <div className="px-8 py-5 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">
            Showing {filteredVehicles.length} of {initialVehicles.length} registered vehicles
          </p>
          <div className="flex items-center gap-2">
             <Settings2 size={12} className="text-[#6e6e73]" />
             <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Table Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
