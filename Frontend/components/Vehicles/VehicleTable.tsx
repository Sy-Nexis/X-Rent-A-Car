"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, MoreHorizontal, MapPin, Gauge } from "lucide-react";

interface VehicleTableProps {
  data: any[];
}

export default function VehicleTable({ data }: VehicleTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#2c2c2e] rounded-3xl border border-gray-200/50 dark:border-white/5 p-20 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
          <Car size={40} />
        </div>
        <h3 className="text-xl font-bold mb-2">No Vehicles Found</h3>
        <p className="text-[#6e6e73] max-w-xs mx-auto text-sm leading-relaxed">
          Your fleet registry is empty. Add your first vehicle to start tracking operations and performance.
        </p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Idle":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Repair":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200/50 dark:border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">ID & Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Make & Model</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">License Plate</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Mileage</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.map((vehicle, index) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={vehicle.id}
                className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-default"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-[#0071e3]">
                      <Car size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">XNR-{vehicle.id.toString().padStart(4, '0')}</div>
                      <div className="text-[10px] text-[#6e6e73] flex items-center gap-1 mt-0.5">
                         <MapPin size={10} /> Colombo HQ
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-sm">{vehicle.make}</div>
                  <div className="text-xs text-[#6e6e73]">{vehicle.model}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-white/5 rounded border border-gray-200/50 dark:border-white/5 font-bold uppercase">
                    {vehicle.license_plate}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Gauge size={14} className="text-[#6e6e73]" />
                    {vehicle.mileage?.toLocaleString()} <span className="text-[10px] opacity-50">KM</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-colors text-[#6e6e73]">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
