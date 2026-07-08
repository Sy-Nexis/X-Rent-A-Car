"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Fuel, Gauge, MoreHorizontal } from "lucide-react";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  dailyRate: number;
  status: string;
  fuelType: string;
  transmission: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  maintenance: "bg-red-500/10 text-red-500 border-red-500/20",
  "in prep": "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
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
              {vehicles.map((vehicle) => (
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
                        <span className="text-[9px] font-bold uppercase">{vehicle.fuelType || 'N/A'}</span>
                      </div>
                      <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                      <div className="flex flex-col items-center gap-1">
                        <Gauge size={14} />
                        <span className="text-[9px] font-bold uppercase">
                          {vehicle.transmission ? vehicle.transmission[0] : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-[#1d1d1f] dark:text-white">
                      Rs. {vehicle.dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-[10px] text-[#6e6e73] font-medium ml-1">/ day</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[vehicle.status.toLowerCase()] || 'bg-gray-100 text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${vehicle.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-current'} animate-pulse`} />
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
      
      {/* TABLE FOOTER */}
      <div className="px-8 py-5 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">
          Showing {vehicles.length} vehicle records
        </p>
      </div>
    </div>
  );
}
