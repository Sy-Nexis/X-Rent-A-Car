"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Car,
  Fuel,
  Gauge,
  Calendar,
  Hash,
  MapPin,
  DollarSign,
  Palette,
  Activity,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";

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
  engine_capacity?: string;
  color?: string;
  mileage?: number;
  branch?: string;
  created_at?: string;
}

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
}

export default function VehicleDetailsModal({ isOpen, onClose, vehicleId }: VehicleDetailsModalProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vehicleId) {
      fetchDetails();
    } else {
      setVehicle(null);
      setError(null);
    }
  }, [isOpen, vehicleId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:5000/api/vehicles/view/${vehicleId}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setVehicle(result.data);
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }
    } catch (err: any) {
      console.error("Fetch Details Error:", err);
      setError(err.message || "Failed to connect to the fleet registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto"
          >
            {/* LEFT SIDE: VISUAL/HEADER (Hidden on small mobile if needed, but here we stack) */}
            <div className="w-full md:w-2/5 bg-white dark:bg-[#2c2c2e] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-white/5">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                  <Car size={32} />
                </div>
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg w-1/2" />
                  </div>
                ) : vehicle ? (
                  <>
                    <h2 className="text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-white mb-2">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                      Registry ID: {vehicle.id}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="mt-8 md:mt-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest mb-4">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>Verified Asset</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                  <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${vehicle?.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                    <span className="text-sm font-black uppercase">{vehicle?.status || '---'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: DATA GRID */}
            <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-[#6e6e73]"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                  <p className="text-xs font-bold text-[#6e6e73] uppercase tracking-widest">Fetching Latest Data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500 font-bold uppercase text-xs tracking-widest">
                  {error}
                </div>
              ) : vehicle ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* SPEC CARDS */}
                  <DetailCard icon={<Calendar size={18} />} label="Year" value={vehicle.year} />
                  <DetailCard icon={<Hash size={18} />} label="License Plate" value={vehicle.license_plate} isMono />
                  <DetailCard icon={<Fuel size={18} />} label="Fuel Type" value={vehicle.fuel_type} />
                  <DetailCard icon={<Gauge size={18} />} label="Transmission" value={vehicle.transmission} />
                  <DetailCard icon={<Zap size={18} />} label="Engine" value={vehicle.engine_capacity || 'N/A'} />
                  <DetailCard icon={<Palette size={18} />} label="Color" value={vehicle.color || 'N/A'} />
                  <DetailCard icon={<Activity size={18} />} label="Mileage" value={`${vehicle.mileage?.toLocaleString() || 0} km`} />
                  <DetailCard icon={<MapPin size={18} />} label="Branch" value={vehicle.branch || 'Main'} />
                  <DetailCard icon={<DollarSign size={18} />} label="Daily Rate" value={`Rs. ${Number(vehicle.daily_rate).toLocaleString()}`} highlight />

                  <div className="col-span-full mt-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">VIN Number</p>
                    <p className="text-xs font-mono font-bold tracking-tighter break-all">{vehicle.vin}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailCard({ icon, label, value, isMono = false, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-3xl border border-gray-200/50 dark:border-white/5 ${highlight ? 'bg-white dark:bg-[#2c2c2e] shadow-lg ring-1 ring-blue-500/20' : 'bg-white/50 dark:bg-white/[0.02]'}`}>
      <div className="flex items-center gap-3 mb-2 text-[#6e6e73]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-black ${isMono ? 'font-mono tracking-widest' : ''} ${highlight ? 'text-blue-500' : 'text-[#1d1d1f] dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}
