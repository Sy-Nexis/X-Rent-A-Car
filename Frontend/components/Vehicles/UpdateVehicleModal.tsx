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
  DollarSign
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

  // Sync form if vehicle changes
  useEffect(() => {
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
  }, [vehicle, reset]);

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      const payload = {
        ...data,
        year: parseInt(data.year),
        dailyRate: parseFloat(data.dailyRate),
        mileage: parseInt(data.mileage),
        licensePlate: vehicle.licensePlate // Maintain identification
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

      // Success Sequence
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-[95vw] h-[95vh] bg-white dark:bg-[#1c1c1e] rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 overflow-hidden flex flex-col"
            >
              {/* STICKY HEADER - MUCH LARGER */}
              <div className="px-24 py-12 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#1c1c1e] z-10">
                <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40">
                    <Zap size={48} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-[#1d1d1f] dark:text-white tracking-tight">Edit Vehicle Specifications</h2>
                    <p className="text-sm font-bold text-[#6e6e73] uppercase tracking-[0.4em] mt-2">Enterprise Fleet Console v2.0</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-all text-[#6e6e73] scale-125"
                >
                  <X size={28} />
                </button>
              </div>

              {/* SCROLLABLE FORM CONTENT */}
              <div className="flex-1 overflow-y-auto px-16 py-12 custom-scrollbar">
                <form id="update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-16">
                  
                  {/* SECTION 01: IDENTIFICATION */}
                  <section>
                    <SectionHeader number="01" title="IDENTIFICATION" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
                      <div className="relative group">
                        <label className="text-sm font-black text-[#6e6e73] uppercase tracking-[0.2em] ml-2 mb-4 block">VIN Number</label>
                        <div className="relative">
                          <input disabled value={vehicle.vin} className="w-full pl-24 pr-8 py-8 bg-gray-100 dark:bg-white/5 rounded-[32px] border-4 border-transparent text-2xl font-mono font-black text-[#8e8e93] cursor-not-allowed" />
                          <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-[#8e8e93]" size={32} />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="text-sm font-black text-[#6e6e73] uppercase tracking-[0.2em] ml-2 mb-4 block">License Plate</label>
                        <div className="relative">
                          <input disabled value={vehicle.licensePlate} className="w-full pl-24 pr-8 py-8 bg-gray-100 dark:bg-white/5 rounded-[32px] border-4 border-transparent text-2xl font-mono font-black text-[#8e8e93] cursor-not-allowed" />
                          <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-[#8e8e93]" size={32} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* SECTION 02: FLEET SPECS */}
                  <section>
                    <SectionHeader number="02" title="FLEET SPECIFICATIONS" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-6">
                      {/* LEFT COLUMN */}
                      <div className="space-y-6">
                        <FormInput label="Make" icon={<Car size={16}/>} {...register("make", { required: true })} error={errors.make} />
                        <FormInput label="Model" icon={<Zap size={16}/>} {...register("model", { required: true })} error={errors.model} />
                        <FormInput label="Year" type="number" icon={<Calendar size={16}/>} {...register("year", { required: true })} error={errors.year} />
                        <FormSelect label="Branch" icon={<MapPin size={16}/>} {...register("branch")}>
                          <option value="Main">Main Branch</option>
                          <option value="Colombo">Colombo Central</option>
                          <option value="Kandy">Kandy Station</option>
                        </FormSelect>
                        <FormSelect label="Status" icon={<ShieldCheck size={16}/>} {...register("status")}>
                          <option value="Active">Active</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="In Prep">In Prep</option>
                        </FormSelect>
                      </div>

                      {/* RIGHT COLUMN */}
                      <div className="space-y-6">
                        <FormInput label="Mileage (KM)" type="number" icon={<Gauge size={16}/>} {...register("mileage")} />
                        <FormSelect label="Fuel Type" icon={<Fuel size={16}/>} {...register("fuelType")}>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybrid">Hybrid</option>
                        </FormSelect>
                        <FormInput label="Color" icon={<Palette size={16}/>} {...register("color")} />
                        <FormSelect label="Transmission" icon={<Zap size={16}/>} {...register("transmission")}>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </FormSelect>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest ml-1 block">Daily Rental Rate (Rs.)</label>
                           <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                              <input 
                                type="number" 
                                step="0.01" 
                                {...register("dailyRate", { required: true, min: 0 })}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1c1c1e] rounded-2xl border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-black text-blue-500 transition-all outline-none"
                              />
                           </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* STICKY FOOTER - MUCH LARGER */}
              <div className="px-24 py-12 border-t-2 border-gray-200/50 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1c1c1e]">
                <p className="text-xl font-black text-[#6e6e73] uppercase tracking-[0.3em]">
                  {error ? <span className="text-red-500">{error}</span> : "Enterprise Registry Sync"}
                </p>
                <div className="flex items-center gap-10">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isUpdating}
                    className="px-10 py-6 text-sm font-black uppercase tracking-[0.4em] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    form="update-form"
                    type="submit"
                    disabled={!isDirty || isUpdating || showSuccess}
                    className={`
                      flex items-center gap-6 px-16 py-8 rounded-[32px] text-sm font-black uppercase tracking-[0.4em] transition-all
                      ${!isDirty || isUpdating || showSuccess
                        ? 'bg-gray-200 dark:bg-white/5 text-[#6e6e73] cursor-not-allowed'
                        : 'bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.5)] hover:-translate-y-2 active:scale-95'}
                    `}
                  >
                    {isUpdating ? <Loader2 size={24} className="animate-spin" /> : showSuccess ? <Check size={24} /> : null}
                    <span>{showSuccess ? "Sync Successful" : isUpdating ? "Syncing..." : "Update Specifications"}</span>
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

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-6 border-b-2 border-gray-200/50 dark:border-white/10 pb-6">
      <span className="text-2xl font-black text-blue-500 tracking-tighter">{number}</span>
      <h3 className="text-2xl font-black text-[#1d1d1f] dark:text-white uppercase tracking-[0.4em]">{title}</h3>
    </div>
  );
}

const FormInput = React.forwardRef(({ label, icon, error, ...props }: any, ref: any) => (
  <div className="space-y-4">
    <label className="text-sm font-black text-[#6e6e73] uppercase tracking-[0.2em] ml-2 block">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-blue-500 transition-colors">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <input
        ref={ref}
        {...props}
        className={`w-full pl-20 pr-8 py-8 bg-white dark:bg-[#121214] rounded-[32px] border-4 border-transparent focus:border-blue-600 focus:ring-[20px] focus:ring-blue-600/5 text-2xl font-bold transition-all outline-none ${error ? 'border-red-500/50 ring-[20px] ring-red-500/5' : ''}`}
      />
    </div>
  </div>
));

const FormSelect = React.forwardRef(({ label, icon, children, ...props }: any, ref: any) => (
  <div className="space-y-4">
    <label className="text-sm font-black text-[#6e6e73] uppercase tracking-[0.2em] ml-2 block">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-blue-500 transition-colors">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <select
        ref={ref}
        {...props}
        className="w-full pl-20 pr-12 py-8 bg-white dark:bg-[#121214] rounded-[32px] border-4 border-transparent focus:border-blue-600 focus:ring-[20px] focus:ring-blue-600/5 text-2xl font-bold transition-all outline-none appearance-none"
      >
        {children}
      </select>
    </div>
  </div>
));

FormInput.displayName = "FormInput";
FormSelect.displayName = "FormSelect";
