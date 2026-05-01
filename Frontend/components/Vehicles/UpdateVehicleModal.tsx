"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  X,
  PencilLine,
  ShieldCheck,
  Lock,
  Car,
  Zap,
  Loader2,
  Check,
  Fuel,
  Gauge,
  Palette,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
  Database
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  engineCapacity?: string;
  color?: string;
  mileage?: number;
  branch?: string;
}

interface UpdateVehicleModalProps {
  vehicle: Vehicle;
  onActionComplete?: () => void;
}

export default function UpdateVehicleModal({ vehicle, onActionComplete }: UpdateVehicleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      year: vehicle.year,
      status: vehicle.status,
      dailyRate: vehicle.dailyRate,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      engineCapacity: vehicle.engineCapacity || "",
      color: vehicle.color || "",
      mileage: vehicle.mileage || 0,
      branch: vehicle.branch || "Colombo HQ",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        year: vehicle.year,
        status: vehicle.status,
        dailyRate: vehicle.dailyRate,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        engineCapacity: vehicle.engineCapacity || "",
        color: vehicle.color || "",
        mileage: vehicle.mileage || 0,
        branch: vehicle.branch || "Colombo HQ",
      });
    }
  }, [isOpen, vehicle, reset]);

  const handleClose = () => {
    if (isUpdating) return;
    setIsOpen(false);
    setError(null);
    setShowSuccess(false);
  };

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      const payload = {
        ...data,
        year: parseInt(data.year),
        dailyRate: parseFloat(data.dailyRate),
        mileage: parseInt(data.mileage),
      };

      const response = await fetch(`http://localhost:5000/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update record");
      }

      setShowSuccess(true);
      router.refresh();

      setTimeout(() => {
        handleClose();
        if (onActionComplete) onActionComplete();
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setIsUpdating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all"
      >
        <PencilLine size={14} />
        Manage Asset
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-[#000000]/80 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl h-full max-h-[800px] bg-[#1c1c1e] rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >

              {/* LEFT SIDEBAR: IDENTITY PANEL (40%) */}
              <div className="w-full md:w-[38%] bg-[#1c1c1e] p-10 md:p-14 flex flex-col justify-between border-r border-white/5">
                <div className="space-y-12">
                  <div className="w-16 h-16 bg-[#2c2c2e] rounded-2xl flex items-center justify-center text-blue-500 border border-white/5 shadow-inner">
                    <Car size={32} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
                      {vehicle.make} <span className="text-[#86868b]">{vehicle.model}</span>
                    </h2>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">Registry ID: {vehicle.id}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={18} className="text-green-500" />
                      <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Verified Asset</span>
                    </div>

                    <div className="p-6 bg-[#2c2c2e] rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-[#6e6e73] uppercase tracking-widest mb-3">Status</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{vehicle.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-black/20 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Lock size={10} /> VIN Number
                    </p>
                    <p className="text-xs font-mono font-black text-white tracking-widest uppercase opacity-80">{vehicle.vin}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT: INPUT GRID (62%) */}
              <div className="flex-1 bg-[#2c2c2e]/30 flex flex-col relative">
                <button
                  onClick={handleClose}
                  className="absolute top-10 right-10 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-[#86868b] transition-all z-10"
                >
                  <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto px-10 md:px-14 py-14 custom-scrollbar">
                  <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">

                    <InputGroup label="Year" icon={<Calendar size={14} />}>
                      <input type="number" {...register("year")} className="raw-input" />
                    </InputGroup>

                    <InputGroup label="License Plate" icon={<Database size={14} />} disabled>
                      <input value={vehicle.licensePlate} disabled className="raw-input opacity-50" />
                    </InputGroup>

                    <InputGroup label="Fuel Type" icon={<Fuel size={14} />}>
                      <select {...register("fuelType")} className="raw-input bg-transparent">
                        <option value="Hybrid">Hybrid</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </InputGroup>

                    <InputGroup label="Transmission" icon={<Gauge size={14} />}>
                      <select {...register("transmission")} className="raw-input bg-transparent">
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </InputGroup>

                    <InputGroup label="Engine" icon={<Zap size={14} />}>
                      <input {...register("engineCapacity")} className="raw-input" placeholder="e.g. 1800cc" />
                    </InputGroup>

                    <InputGroup label="Color" icon={<Palette size={14} />}>
                      <input {...register("color")} className="raw-input" />
                    </InputGroup>

                    <InputGroup label="Mileage" icon={<Activity size={14} />}>
                      <div className="flex items-baseline gap-1">
                        <input type="number" {...register("mileage")} className="raw-input" />
                        <span className="text-[10px] font-black text-[#6e6e73]">KM</span>
                      </div>
                    </InputGroup>

                    <InputGroup label="Branch" icon={<MapPin size={14} />}>
                      <input {...register("branch")} className="raw-input" />
                    </InputGroup>

                    <InputGroup label="Daily Rate" icon={<DollarSign size={14} />} className="col-span-2 border-blue-500/20 bg-blue-500/5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-black text-blue-500">Rs.</span>
                        <input type="number" step="0.01" {...register("dailyRate")} className="raw-input text-blue-500 text-xl" />
                      </div>
                    </InputGroup>
                  </form>
                </div>

                {/* FOOTER ACTION BAR */}
                <div className="p-10 md:p-14 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <span className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">
                      {isDirty ? "Sync Pending" : "Records Synced"}
                    </span>
                  </div>

                  <div className="flex items-center gap-8">
                    <button onClick={handleClose} className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest hover:text-white transition-colors">
                      Discard
                    </button>
                    <button
                      form="update-form"
                      type="submit"
                      disabled={!isDirty || isUpdating}
                      className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${!isDirty || isUpdating
                          ? 'bg-white/5 text-[#424245] cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-500 shadow-2xl shadow-blue-600/20 active:scale-95'
                        }`}
                    >
                      {isUpdating ? <Loader2 size={14} className="animate-spin" /> : showSuccess ? <Check size={14} /> : <Database size={14} />}
                      {showSuccess ? "Success" : isUpdating ? "Processing" : "Update Asset"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .raw-input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: white;
            font-size: 14px;
            font-weight: 800;
            padding: 0;
            margin-top: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
        }
      `}</style>
    </>
  );
}

function InputGroup({ label, icon, children, className = "", disabled = false }: any) {
  return (
    <div className={`p-6 bg-[#2c2c2e]/50 rounded-3xl border border-white/5 transition-all group focus-within:border-blue-500/30 ${className} ${disabled ? 'opacity-80' : ''}`}>
      <div className="flex items-center gap-2 mb-1 opacity-40 group-focus-within:opacity-100 transition-opacity">
        <span className="text-blue-500">{icon}</span>
        <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest">{label}</label>
      </div>
      {children}
    </div>
  );
}