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
  Database,
  Info
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
      licensePlate: vehicle.licensePlate,
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
        licensePlate: vehicle.licensePlate,
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

      const response = await fetch(`http://localhost:5001/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Registry Sync Failed");
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
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-black uppercase tracking-widest text-[#6e6e73] hover:text-blue-500 hover:bg-blue-500/5 rounded-xl transition-all group"
      >
        <div className="flex items-center gap-3">
          <PencilLine size={16} className="text-blue-500" />
          Edit Asset Specs
        </div>
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 lg:p-20">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
            />

            {/* THE BIG DASHBOARD MODAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[1200px] h-full max-h-[900px] bg-[#1c1c1e] rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >
              
              {/* --- LEFT: IDENTITY SIDEBAR (35%) --- */}
              <div className="md:w-[35%] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-16 flex flex-col justify-between border-r border-white/5">
                <div>
                  <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 mb-12">
                    <Car size={48} />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-5xl font-black text-white tracking-tighter">{vehicle.make}</h2>
                    <p className="text-2xl font-bold text-[#86868b]">{vehicle.model}</p>
                  </div>

                  <div className="mt-12 space-y-6">
                    <Badge icon={<ShieldCheck size={16}/>} label="Verified Asset" color="blue" />
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                       <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em] mb-3">Asset Registry ID</p>
                       <p className="text-xl font-mono font-black text-white">{vehicle.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Lock size={12} />
                        SECURE IDENTIFIER
                      </p>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">VIN</p>
                        <p className="text-sm font-mono font-black text-white tracking-tighter">{vehicle.vin}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 text-[9px] font-black text-[#424245] uppercase tracking-[0.4em]">
                      <Zap size={14} />
                      XNRENT FLEET CONSOLE
                   </div>
                </div>
              </div>

              {/* --- RIGHT: INPUT ARENA (65%) --- */}
              <div className="flex-1 bg-[#1c1c1e] flex flex-col overflow-hidden">
                <div className="px-16 py-12 flex items-center justify-between shrink-0">
                  <h4 className="text-sm font-black text-[#86868b] uppercase tracking-[0.4em]">Advanced Specifications</h4>
                  <button onClick={handleClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-[#86868b] hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-16 pb-12 custom-scrollbar">
                  <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                    {error && (
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-sm font-bold uppercase tracking-widest flex items-center gap-4">
                        <Info size={20} />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                      <InputCard label="Production Year" icon={<Calendar size={18}/>} {...register("year")} />
                      <InputCard label="License Plate" icon={<Database size={18}/>} {...register("licensePlate")} />
                      <InputCard label="Fuel Architecture" icon={<Fuel size={18}/>} {...register("fuelType")} isSelect options={['Petrol', 'Diesel', 'Hybrid', 'Electric']} />
                      <InputCard label="Transmission" icon={<Gauge size={18}/>} {...register("transmission")} isSelect options={['Automatic', 'Manual', 'Tiptronic']} />
                      <InputCard label="Engine Capacity" icon={<Zap size={18}/>} {...register("engineCapacity")} />
                      <InputCard label="Exterior Palette" icon={<Palette size={18}/>} {...register("color")} />
                      <InputCard label="Operational Mileage" icon={<Activity size={18}/>} {...register("mileage")} type="number" />
                      <InputCard label="Daily Rental Rate (Rs.)" icon={<DollarSign size={18}/>} {...register("dailyRate")} type="number" step="0.01" />
                    </div>

                    <div className="pt-10 border-t border-white/5">
                       <InputCard label="Fleet Status" icon={<ShieldCheck size={18}/>} {...register("status")} isSelect options={['Active', 'Maintenance', 'In Prep', 'Retired']} />
                    </div>
                  </form>
                </div>

                {/* STICKY FOOTER */}
                <div className="px-16 py-12 bg-[#1c1c1e] border-t border-white/10 flex items-center justify-between shrink-0">
                   <p className="text-xs font-black text-[#6e6e73] uppercase tracking-[0.3em]">
                      {isDirty ? "UNSAVED CHANGES DETECTED" : "REGISTRY IN SYNC"}
                   </p>
                   <div className="flex items-center gap-8">
                      <button type="button" onClick={handleClose} className="text-xs font-black text-[#6e6e73] hover:text-white uppercase tracking-[0.3em] transition-colors">
                        Dismiss
                      </button>
                      <button
                        form="update-form"
                        type="submit"
                        disabled={!isDirty || isUpdating || showSuccess}
                        className={`
                          flex items-center gap-4 px-16 py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.4em] transition-all
                          ${!isDirty || isUpdating || showSuccess
                            ? 'bg-white/5 text-[#424245] cursor-not-allowed shadow-none'
                            : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95'}
                        `}
                      >
                        {isUpdating ? <Loader2 size={20} className="animate-spin" /> : showSuccess ? <Check size={20} /> : <Zap size={20} />}
                        <span>{showSuccess ? "Success" : isUpdating ? "Syncing..." : "Sync Registry"}</span>
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </>
  );
}

// --- SUB-COMPONENTS ---

function Badge({ icon, label, color }: any) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit
      ${color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}
    `}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

const InputCard = React.forwardRef(({ label, icon, isSelect, options, ...props }: any, ref: any) => (
  <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 focus-within:border-blue-500/50 focus-within:bg-blue-500/[0.02] transition-all group">
    <div className="flex items-center gap-3 mb-4 opacity-50 group-focus-within:opacity-100 transition-opacity">
       <span className="text-blue-500">{icon}</span>
       <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">{label}</label>
    </div>
    {isSelect ? (
      <select ref={ref} {...props} className="w-full bg-transparent text-xl font-bold text-white outline-none appearance-none cursor-pointer">
        {options.map((opt: string) => <option key={opt} value={opt} className="bg-[#1c1c1e] text-white">{opt}</option>)}
      </select>
    ) : (
      <input ref={ref} {...props} className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder:text-[#424245]" />
    )}
  </div>
));

InputCard.displayName = "InputCard";