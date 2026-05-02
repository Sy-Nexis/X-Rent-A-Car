"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Fuel,
  Gauge,
  MoreHorizontal,
  Trash2,
  ChevronRight,
  AlertCircle,
  PencilLine
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import VehicleDetailsModal from "../Modals/VehicleDetailsModal";
import UpdateVehicleModal from "./UpdateVehicleModal";

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

interface VehicleListActionableProps {
  vehicles: Vehicle[];
}

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  maintenance: "bg-red-500/10 text-red-500 border-red-500/20",
  "in prep": "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function VehicleListActionable({ vehicles }: VehicleListActionableProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicleId, setViewingVehicleId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingVehicle) return;

    setIsDeleting(true);
    setError(null);

    try {
      /**
       * 1. SECURE URL CONSTRUCTION
       * Using URLSearchParams ensures that special characters in License Plates 
       * (like spaces or dashes) are properly encoded for the URL.
       */
      const queryParams = new URLSearchParams({
        vin: deletingVehicle.vin,
        plate: deletingVehicle.licensePlate
      }).toString();

      // Ensure the endpoint matches your Backend exactly (e.g., /del vs /delete)
      const API_BASE_URL = "http://localhost:5000";
      const url = `${API_BASE_URL}/api/vehicles/del?${queryParams}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If 404, it means the URL above doesn't exist on the server
        if (response.status === 404) {
          throw new Error(`Endpoint not found: Check if the Flask route is correct.`);
        }

        const contentType = response.headers.get("content-type");
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Success: Reset UI and refresh data
      setDeletingVehicle(null);
      router.refresh();

    } catch (err: any) {
      console.error("Delete Error details:", err);
      setError(err.message || "An unexpected error occurred");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[110] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        vehicleLabel={`${deletingVehicle?.make} ${deletingVehicle?.model}`}
        vehiclePlate={deletingVehicle?.licensePlate || ""}
      />

      <VehicleDetailsModal
        isOpen={!!viewingVehicleId}
        onClose={() => setViewingVehicleId(null)}
        vehicleId={viewingVehicleId}
      />

      <div className="bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-sm border border-gray-200/50 dark:border-white/5 overflow-visible">
        <div className="overflow-x-auto overflow-visible">
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
                    <td className="px-8 py-6 text-right relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === vehicle.id ? null : vehicle.id)}
                        className="p-2 hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-xl transition-all text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* DROPDOWN MENU */}
                      <AnimatePresence>
                        {activeMenu === vehicle.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-8 top-16 w-48 bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/5 rounded-2xl shadow-xl z-50 overflow-hidden"
                            >
                              <div className="p-2">
                                <button
                                  onClick={() => {
                                    setViewingVehicleId(vehicle.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all group"
                                >
                                  <ChevronRight size={16} className="text-blue-500" />
                                  View Details
                                </button>

                                <Link
                                  href={`/vehicles/edit/${vehicle.id}`}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all group"
                                >
                                  <PencilLine size={16} className="text-blue-500" />
                                  Edit Specifications
                                </Link>
                                <button
                                  onClick={() => {
                                    setDeletingVehicle(vehicle);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#ff453a] hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                  <Trash2 size={16} />
                                  Delete Vehicle
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
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
    </div>
  );
}
