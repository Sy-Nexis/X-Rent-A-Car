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
  Box
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

  useEffect(() => {
    if (isOpen) {
      reset({
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
      });
    }
  }, [isOpen, vehicle, reset]);

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      const payload = {
        ...data,
        year: parseInt(data.year),
        dailyRate: parseFloat(data.dailyRate),
        mileage: parseInt(data.mileage),
        licensePlate: vehicle.licensePlate 
      };

      const response = await fetch(`http://localhost:5000/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Update failed");
      }

      setShowSuccess(true);
      router.refresh();
      
      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
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
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all group"
      >
        <PencilLine size={16} className="text-blue-500" />
        Edit Details
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* SPLIT PANEL MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-[#1c1c1e] rounded-[32px] shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row min-h-[650px] max-h-[90vh]"
            >
              {/* LEFT SIDEBAR: IDENTITY PANEL (35%) */}
              <div className="md:w-[35%] bg-gradient-to-b from-[#1c1c1e] to-[#121214] p-10 flex flex-col justify-between border-r border-white/5">
                <div>
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20">
                    <Car size={40} />
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">{vehicle.make}</h2>
                    <h3 className="text-xl font-bold text-[#86868b]">{vehicle.model}</h3>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 w-fit px-3 py-1.5 rounded-full border border-blue-500/20">
                       <ShieldCheck size={12} />
                       <span>Verified Asset</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">
                      Registry ID: {vehicle.id}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest mb-2">Fleet Status</p>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${vehicle.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                         <span className="text-sm font-black text-white uppercase tracking-widest">{vehicle.status}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 text-[#424245] text-[9px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                         <Zap size={12} />
                         <span>XNRENT CORE V2</span>
                      </div>
                      <div className="w-1 h-1 bg-[#424245] rounded-full" />
                      <span>{new Date().getFullYear()}</span>
                   </div>
                </div>
              </div>

              {/* RIGHT PANEL: INPUT GRID (65%) */}
              <div className="flex-1 bg-[#2c2c2e] flex flex-col">
                {/* HEADER */}
                <div className="px-10 py-8 flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#86868b] uppercase tracking-[0.3em]">Vehicle Specifications</h4>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-[#86868b] hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* FORM CONTENT */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                  <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                        <Box size={16} />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <InputCard label="Year" icon={<Calendar size={14}/>} {...register("year")} />
                      <InputCard label="Fuel Type" icon={<Fuel size={14}/>} {...register("fuelType")} />
                      <InputCard label="Transmission" icon={<Gauge size={14}/>} {...register("transmission")} />
                      <InputCard label="Engine" icon={<Zap size={14}/>} {...register("engineCapacity")} />
                      <InputCard label="Color" icon={<Palette size={14}/>} {...register("color")} />
                      <InputCard label="Mileage (km)" icon={<Activity size={14}/>} {...register("mileage")} />
                      <InputCard label="Branch" icon={<MapPin size={14}/>} {...register("branch")} />
                      <InputCard label="Daily Rate" icon={<DollarSign size={14}/>} {...register("dailyRate")} />
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                       <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.2em] ml-1">Secure Identifiers (Read Only)</p>
                       <div className="grid grid-cols-2 gap-4 opacity-60">
                          <div className="p-5 bg-[#1c1c1e] rounded-2xl border border-white/5 flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">VIN Number</p>
                                <p className="text-xs font-mono font-bold text-white tracking-tighter">{vehicle.vin}</p>
                             </div>
                             <Lock size={14} className="text-[#424245]" />
                          </div>
                          <div className="p-5 bg-[#1c1c1e] rounded-2xl border border-white/5 flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">License Plate</p>
                                <p className="text-xs font-mono font-bold text-white tracking-widest">{vehicle.licensePlate}</p>
                             </div>
                             <Lock size={14} className="text-[#424245]" />
                          </div>
                       </div>
                    </div>
                  </form>
                </div>

                {/* FOOTER */}
                <div className="px-10 py-8 bg-[#2c2c2e] border-t border-white/5 flex items-center justify-end gap-4">
                   <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 text-[10px] font-black text-[#86868b] uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    form="update-form"
                    type="submit"
                    disabled={!isDirty || isUpdating || showSuccess}
                    className={`
                      flex items-center gap-3 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${!isDirty || isUpdating || showSuccess
                        ? 'bg-white/5 text-[#424245] cursor-not-allowed'
                        : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95'}
                    `}
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : showSuccess ? <Check size={16} /> : <SaveIcon size={16} />}
                    <span>{showSuccess ? "Success" : isUpdating ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const InputCard = React.forwardRef(({ label, icon, ...props }: any, ref: any) => (
  <div className="p-4 bg-[#1c1c1e] rounded-2xl border border-white/5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all group">
    <div className="flex items-center gap-2 mb-2">
       <span className="text-blue-500 group-focus-within:scale-110 transition-transform">{icon}</span>
       <label className="text-[9px] font-black text-[#6e6e73] uppercase tracking-widest">{label}</label>
    </div>
    <input
      ref={ref}
      {...props}
      className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-[#424245]"
    />
  </div>
));

function SaveIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

InputCard.displayName = "InputCard";
