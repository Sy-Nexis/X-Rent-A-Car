"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  X,
  PencilLine,
  Car,
  Zap,
  Loader2,
  Fuel,
  Gauge,
  Palette,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Database,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TYPES ---
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

// --- MAIN COMPONENT ---
export default function UpdateVehicleModal({ vehicle, onActionComplete }: UpdateVehicleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
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
      branch: vehicle.branch || "Main",
      licensePlate: vehicle.licensePlate,
    },
  });

  // Re-sync form if the prop changes
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
        branch: vehicle.branch || "Main",
        licensePlate: vehicle.licensePlate,
      });
    }
  }, [isOpen, vehicle, reset]);

  const handleClose = () => {
    if (isUpdating) return;
    setIsOpen(false);
    setError(null);
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

      // Success workflow
      router.refresh();
      handleClose();
      if (onActionComplete) onActionComplete();

    } catch (err: any) {
      setError(err.message);
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON (Matches Dropdown Menu Style) */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all group"
      >
        <PencilLine size={16} className="text-blue-500" />
        Edit Asset
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP (Matches Delete Modal exactly) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* MODAL CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 flex flex-col"
            >

              {/* HEADER */}
              <div className="p-8 pb-6 flex justify-between items-start shrink-0">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Car size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
                      Edit {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-[#6e6e73] text-sm mt-0.5">
                      Registry ID: {vehicle.id} • VIN: {vehicle.vin}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-[#6e6e73]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* SCROLLABLE FORM BODY */}
              <div className="p-8 pt-0 overflow-y-auto custom-scrollbar flex-1">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold">
                    {error}
                  </div>
                )}

                <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormGroup label="Year" icon={<Calendar size={14} />}>
                    <input type="number" {...register("year")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="License Plate" icon={<Database size={14} />} disabled>
                    <input {...register("licensePlate")} disabled className="input-field opacity-50 cursor-not-allowed" />
                  </FormGroup>

                  <FormGroup label="Fuel Type" icon={<Fuel size={14} />}>
                    <select {...register("fuelType")} className="input-field appearance-none cursor-pointer">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Transmission" icon={<Gauge size={14} />}>
                    <select {...register("transmission")} className="input-field appearance-none cursor-pointer">
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="Tiptronic">Tiptronic</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Engine Capacity" icon={<Zap size={14} />}>
                    <input {...register("engineCapacity")} placeholder="e.g. 1500cc" className="input-field" />
                  </FormGroup>

                  <FormGroup label="Exterior Color" icon={<Palette size={14} />}>
                    <input {...register("color")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Mileage (KM)" icon={<Activity size={14} />}>
                    <input type="number" {...register("mileage")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Branch" icon={<MapPin size={14} />}>
                    <input {...register("branch")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Daily Rate (Rs.)" icon={<DollarSign size={14} />}>
                    <input type="number" step="0.01" {...register("dailyRate")} className="input-field font-black text-blue-500" />
                  </FormGroup>

                  <FormGroup label="Status" icon={<ShieldCheck size={14} />}>
                    <select {...register("status")} className="input-field appearance-none cursor-pointer">
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Prep">In Prep</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </FormGroup>
                </form>
              </div>

              {/* FOOTER (Matches Delete Modal exactly) */}
              <div className="p-6 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200/50 dark:border-white/5 flex gap-3 shrink-0">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleClose}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm bg-gray-100 dark:bg-white/5 text-[#1d1d1f] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  form="update-form"
                  type="submit"
                  disabled={!isDirty || isUpdating}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          color: inherit;
          font-size: 0.875rem;
          font-weight: 700;
          outline: none;
          padding: 0;
          margin-top: 0.25rem;
        }
        .input-field::placeholder {
          color: #86868b;
          font-weight: 500;
        }
        /* Custom Scrollbar for form body */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

// --- HELPER COMPONENT ---
function FormGroup({ label, icon, children, className = "", disabled = false }: any) {
  return (
    <div className={`p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200/50 dark:border-white/5 focus-within:border-blue-500/50 transition-all group ${className} ${disabled ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-2 mb-1 text-[#6e6e73]">
        <span className="text-blue-500">{icon}</span>
        <label className="text-[10px] font-bold uppercase tracking-widest">{label}</label>
      </div>
      <div className="text-[#1d1d1f] dark:text-white">
        {children}
      </div>
    </div>
  );
}