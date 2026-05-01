"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleTable from "./VehicleTable";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  daily_rate: string | number;
  status: string;
  fuel_type: string;
  transmission: string;
}

interface FleetManagerProps {
  initialData: Vehicle[];
}

export default function FleetManager({ initialData }: FleetManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Format data for the table and handle calculations
  const vehicles = useMemo(() => {
    return initialData.map(v => ({
      ...v,
      dailyRate: v.daily_rate ? (typeof v.daily_rate === 'string' ? parseFloat(v.daily_rate) : v.daily_rate) : 0,
      licensePlate: v.license_plate || 'No Plate',
      fuelType: v.fuel_type || 'Unknown',
    }));
  }, [initialData]);

  // Statistics
  const stats = useMemo(() => {
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status.toLowerCase() === 'active').length;
    const maintenance = vehicles.filter(v => v.status.toLowerCase() === 'maintenance').length;
    const inPrep = vehicles.filter(v => v.status.toLowerCase() === 'in prep' || v.status.toLowerCase() === 'inprep').length;

    return { total, active, maintenance, inPrep };
  }, [vehicles]);

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch =
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || v.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  if (initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#2c2c2e] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm">
        <AlertCircle size={48} className="text-[#6e6e73] mb-4" />
        <h3 className="text-xl font-bold">No Vehicles Found</h3>
        <p className="text-[#6e6e73] mt-2">The fleet registry is currently empty or the backend is offline.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#0071e3] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#0077ed] transition-colors"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Fleet", value: stats.total, color: "blue" },
          { label: "Active Now", value: stats.active, color: "green" },
          { label: "Maintenance", value: stats.maintenance, color: "red" },
          { label: "In Prep", value: stats.inPrep, color: "orange" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#2c2c2e] p-6 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm"
          >
            <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search make, model, or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex p-1.5 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/5 overflow-x-auto">
          {["All", "Active", "Maintenance", "In Prep"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap ${statusFilter === status
                  ? "text-[#1d1d1f] dark:text-white"
                  : "text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white"
                }`}
            >
              {statusFilter === status && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <VehicleTable vehicles={filteredVehicles} />
    </div>
  );
}
