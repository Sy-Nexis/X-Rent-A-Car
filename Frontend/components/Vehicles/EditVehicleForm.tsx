"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Save, X } from "lucide-react";
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
    },
  });

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      // 1. CONSTRUCT SMART PAYLOAD (Only send what's changed or standard set)
      const payload = {
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        dailyRate: parseFloat(data.dailyRate),
        status: data.status,
        fuelType: data.fuelType,
        transmission: data.transmission,
        engineCapacity: data.engineCapacity,
        color: data.color,
        mileage: parseInt(data.mileage),
        branch: data.branch,
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
      setError(err.message || "An unexpected error occurred during update.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Edit Specifications</h3>
          <p className="text-xs font-bold text-[#6e6e73] uppercase tracking-widest mt-1">Vehicle Asset: {vehicle.licensePlate}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-[#6e6e73]"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IDENTITY (READ ONLY) */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">VIN (Immutable)</label>
          <input
            disabled
            value={vehicle.vin}
            className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-2xl text-xs font-mono text-[#6e6e73] cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">License Plate</label>
          <input
            disabled
            value={vehicle.licensePlate}
            className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-2xl text-xs font-mono text-[#6e6e73] cursor-not-allowed"
          />
        </div>

        {/* BASIC SPECS */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Make</label>
          <input
            {...register("make", { required: "Make is required" })}
            placeholder="e.g., Toyota"
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none"
          />
          {errors.make && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.make.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Model</label>
          <input
            {...register("model", { required: "Model is required" })}
            placeholder="e.g., Prius"
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none"
          />
          {errors.model && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.model.message}</p>}
        </div>

        {/* FINANCIALS & STATUS */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Daily Rental Rate (LKR)</label>
          <input
            type="number"
            {...register("dailyRate", { required: "Rate is required", min: 1 })}
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none"
          />
          {errors.dailyRate && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.dailyRate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Operational Status</label>
          <select
            {...register("status")}
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none appearance-none"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="In Prep">In Prep</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* TECHNICAL DETAILS */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Mileage (KM)</label>
          <input
            type="number"
            {...register("mileage")}
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Branch Location</label>
          <input
            {...register("branch")}
            className="w-full px-5 py-4 bg-white dark:bg-[#1c1c1e] border border-gray-200/50 dark:border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold transition-all outline-none"
          />
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="pt-6 border-t border-gray-200/50 dark:border-white/5 flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isUpdating}
          className={`
            relative overflow-hidden group
            flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all
            ${!isDirty || isUpdating 
              ? 'bg-gray-100 dark:bg-white/5 text-[#6e6e73] cursor-not-allowed' 
              : 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95'}
          `}
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{isUpdating ? "Processing..." : "Save Changes"}</span>
          
          {/* MAGNETIC GLOW EFFECT */}
          {!isUpdating && isDirty && (
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}
        </button>
      </div>
    </form>
  );
}
