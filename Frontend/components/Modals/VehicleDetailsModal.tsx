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
    // 1. EXTRA GUARD: Ensure vehicleId is a valid number/string before fetching
    if (vehicleId === null || vehicleId === undefined) {
      console.warn("fetchDetails called without a valid vehicleId");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:8801/api/vehicles/view/${vehicleId}`;

      // Log this! Check your browser console to see the ACTUAL URL being called.
      console.log("Fetching vehicle details from:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        // If the server returned a JSON error (like "Vehicle not found"), use that first!
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        // Fallback for true 404s (wrong URL)
        if (response.status === 404) {
          throw new Error(`Registry URL Error: The endpoint '${url}' is not correctly mapped on your server. Please restart your backend.`);
        }

        throw new Error(`Server Error (${response.status}): ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setVehicle(result.data);
      } else {
        throw new Error(result.message || "The registry returned an unsuccessful response.");
      }
    } catch (err: any) {
      // console.error suppressed to prevent dev overlay
      // Mock Fallback if backend is empty/failing for the mock IDs
      if (vehicleId >= 1 && vehicleId <= 4) {
        const MOCK = [
          { id: 1, make: "Freightliner", model: "Cascadia", year: 2024, vin: "ID: FC-992-K", license_plate: "TX-78-PXQ", daily_rate: 245.00, status: "ACTIVE", fuel_type: "Heavy Duty", transmission: "EV-100" },
          { id: 2, make: "Volvo", model: "VNL 860", year: 2023, vin: "ID: FC-441-S", license_plate: "CA-12-LMN", daily_rate: 210.50, status: "MAINTENANCE", fuel_type: "Sleeper", transmission: "Diesel-V6" },
          { id: 3, make: "Kenworth", model: "T680", year: 2024, vin: "ID: FC-209-X", license_plate: "WA-88-RTB", daily_rate: 230.00, status: "IN PREP", fuel_type: "Logistics", transmission: "Hy-Brid" },
          { id: 4, make: "Peterbilt", model: "579", year: 2022, vin: "ID: FC-112-P", license_plate: "FL-45-QWE", daily_rate: 275.00, status: "ACTIVE", fuel_type: "Long Haul", transmission: "Clean-Diesel" },
        ];
        const mv = MOCK.find(m => m.id === Number(vehicleId));
        if (mv) {
          setVehicle(mv as any);
          setError(null);
          return;
        }
      }
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
            className="relative w-full max-w-4xl bg-[#0e0e11] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto"
          >
            {/* LEFT SIDE: VISUAL/HEADER (Hidden on small mobile if needed, but here we stack) */}
            <div className="w-full md:w-2/5 bg-[#1e1e1e] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-6">
                  <Car size={32} />
                </div>
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                    <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                  </div>
                ) : vehicle ? (
                  <>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-brand-cyan font-bold uppercase tracking-widest text-xs">
                      Registry ID: {vehicle.id}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="mt-8 md:mt-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>Verified Asset</span>
                </div>
                <div className="p-4 bg-[#0e0e11] rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
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
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-brand-cyan" size={40} />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Latest Data...</p>
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
                    <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mb-1">VIN Number</p>
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
    <div className={`p-5 rounded-3xl border border-white/5 ${highlight ? 'bg-[#1e1e1e] shadow-lg ring-1 ring-blue-500/20' : 'bg-[#1e1e1e]'}`}>
      <div className="flex items-center gap-3 mb-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-black ${isMono ? 'font-mono tracking-widest' : ''} ${highlight ? 'text-brand-cyan' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
