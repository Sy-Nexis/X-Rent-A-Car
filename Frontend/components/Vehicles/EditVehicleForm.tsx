"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Save, X, Info, ShieldCheck, Zap, Fuel, Gauge, MapPin, Palette } from "lucide-react";
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

interface EditVehicleFormProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export default function EditVehicleForm({ vehicle, onClose }: EditVehicleFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      dailyRate: vehicle.dailyRate,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      engineCapacity: vehicle.engineCapacity || "",
      color: vehicle.color || "",
      mileage: vehicle.mileage || 0,
      branch: vehicle.branch || "Main",
      licensePlate: vehicle.licensePlate, // Included but read-only usually
    },
  });

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      // 1. CONSTRUCT PAYLOAD (Matching user's Backend destructuring)
      const payload = {
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        licensePlate: data.licensePlate,
        transmission: data.transmission,
        fuelType: data.fuelType,
        engineCapacity: data.engineCapacity,
        color: data.color,
        mileage: parseInt(data.mileage),
        dailyRate: parseFloat(data.dailyRate),
        branch: data.branch,
        status: data.status,
      };

      // 2. API CALL
      const response = await fetch(`http://localhost:5000/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update vehicle");
      }

      // 3. SUCCESS WORKFLOW
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error("Update Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[90vh]">
      {/* HEADER SECTION */}
      <div className="px-10 py-8 bg-white dark:bg-[#2c2c2e] border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Zap size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-tight">
              Manage Vehicle Specification
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
                Registry Sync Active
              </span>
              <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">
                VIN: {vehicle.vin}
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all text-[#6e6e73] hover:rotate-90"
        >
          <X size={24} />
        </button>
      </div>

      {/* FORM CONTENT (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar space-y-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500"
          >
            <AlertCircle size={24} />
            <div className="text-xs font-bold uppercase tracking-wide">{error}</div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* IDENTIFICATION GROUP */}
          <SectionTitle icon={<ShieldCheck size={16}/>} title="Immutable Identity" />
          
          <div className="space-y-6 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput 
              label="VIN Number" 
              value={vehicle.vin} 
              disabled 
              icon={<Info size={14}/>}
              isMono
            />
            <FormInput 
              label="License Plate" 
              {...register("licensePlate")}
              icon={<Info size={14}/>}
              isMono
            />
          </div>

          {/* BASIC SPECIFICATIONS */}
          <SectionTitle icon={<Car size={16}/>} title="Core Specifications" />
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em] ml-1">Make</label>
            <input
              {...register("make", { required: "Make is required" })}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em] ml-1">Model</label>
            <input
              {...register("model", { required: "Model is required" })}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em] ml-1">Year of Manufacture</label>
            <input
              type="number"
              {...register("year", { required: true, min: 1990, max: 2026 })}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em] ml-1">Operational Status</label>
            <select
              {...register("status")}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="In Prep">In Prep</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* TECHNICAL GROUP */}
          <SectionTitle icon={<Zap size={16}/>} title="Technical details" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <Fuel size={12} className="text-[#6e6e73]" />
              <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em]">Fuel Type</label>
            </div>
            <select
              {...register("fuelType")}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none appearance-none"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <Gauge size={12} className="text-[#6e6e73]" />
              <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em]">Transmission</label>
            </div>
            <select
              {...register("transmission")}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none appearance-none"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Tiptronic">Tiptronic</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <Palette size={12} className="text-[#6e6e73]" />
              <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em]">Exterior Color</label>
            </div>
            <input
              {...register("color")}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <MapPin size={12} className="text-[#6e6e73]" />
              <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em]">Assigned Branch</label>
            </div>
            <input
              {...register("branch")}
              className="w-full px-6 py-4 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-sm font-bold transition-all outline-none"
            />
          </div>

          {/* FINANCIALS */}
          <SectionTitle icon={<Save size={16}/>} title="Financial Control" />

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em] ml-1">Daily Rental Rate (Rs.)</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black text-[#6e6e73]">Rs.</div>
              <input
                type="number"
                step="0.01"
                {...register("dailyRate", { required: true, min: 0 })}
                className="w-full pl-16 pr-6 py-5 bg-white dark:bg-[#1c1c1e] border-2 border-gray-100 dark:border-white/5 focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 rounded-2xl text-lg font-black transition-all outline-none text-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="px-10 py-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
          {isDirty ? "Unsaved changes detected" : "All specifications are up to date"}
        </p>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || isUpdating}
            className={`
              flex items-center gap-3 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
              ${!isDirty || isUpdating
                ? 'bg-gray-200 dark:bg-white/5 text-[#6e6e73] cursor-not-allowed'
                : 'bg-blue-500 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95'}
            `}
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isUpdating ? "Syncing..." : "Update Specifications"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionTitle({ icon, title }: any) {
  return (
    <div className="col-span-full flex items-center gap-3 py-2 border-b border-gray-200/50 dark:border-white/5">
      <div className="text-blue-500">{icon}</div>
      <h4 className="text-[10px] font-black text-[#1d1d1f] dark:text-white uppercase tracking-[0.2em]">{title}</h4>
    </div>
  );
}

function FormInput({ label, icon, isMono = false, ...props }: any) {
  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center gap-2 mb-1 ml-1">
        {icon}
        <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.15em]">{label}</label>
      </div>
      <input
        {...props}
        className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-2 border-transparent rounded-2xl text-sm font-bold text-[#6e6e73] outline-none ${isMono ? 'font-mono' : ''} ${props.disabled ? 'cursor-not-allowed opacity-60' : 'focus:border-blue-500/30'}`}
      />
    </div>
  );
}
