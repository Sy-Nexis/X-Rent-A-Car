"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  Car, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Fuel, 
  Gauge, 
  Zap, 
  Palette, 
  Activity, 
  MapPin, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Database
} from "lucide-react";

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

interface FormValues {
  year: number;
  fuelType: string;
  transmission: string;
  engineCapacity: string;
  color: string;
  mileage: number;
  branch: string;
  status: string;
  dailyRate: number;
}

// --- PAGE COMPONENT ---
export default function EditVehiclePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>();

  // 1. DATA FETCHING ON MOUNT
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/vehicles/view/${id}`);
        
        if (!response.ok) {
          throw new Error(`Registry Error: Vehicle with ID ${id} not found.`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          setVehicle(data);
          
          // Map to Form
          reset({
            year: data.year,
            fuelType: data.fuelType,
            transmission: data.transmission,
            engineCapacity: data.engineCapacity || "",
            color: data.color || "",
            mileage: data.mileage || 0,
            branch: data.branch || "",
            status: data.status,
            dailyRate: data.dailyRate,
          });
        } else {
          throw new Error(result.message || "Failed to fetch vehicle details");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVehicle();
  }, [id, reset]);

  // 2. FORM SUBMISSION
  const onSubmit = async (data: FormValues) => {
    if (!vehicle) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Format Payload per requirements
      const payload = {
        ...data,
        year: parseInt(data.year.toString()),
        mileage: parseInt(data.mileage.toString()),
        dailyRate: parseFloat(data.dailyRate.toString()),
        licensePlate: vehicle.licensePlate // Primary key safeguard
      };

      const response = await fetch(`http://localhost:5000/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update asset registry.");
      }

      setSuccess(true);
      router.refresh(); // Sync server state
      
      setTimeout(() => {
        router.push("/Admin/Vehicle/Details"); // Returning to main fleet table
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  // --- RENDERING LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-500"
        >
          <Loader2 size={48} />
        </motion.div>
        <p className="text-[#6e6e73] font-bold text-sm tracking-widest uppercase">Initializing Workstation...</p>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-black text-[#1d1d1f] dark:text-white mb-2">Registry Connection Failed</h1>
        <p className="text-[#6e6e73] mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-sans selection:bg-blue-500/30">
      
      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 mb-8"
            >
              <CheckCircle2 size={64} />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight">Sync Successful</h2>
            <p className="text-[#6e6e73] mt-2 font-bold uppercase tracking-widest text-xs">Registry updated. Redirecting...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 px-8 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-gray-100 dark:group-hover:bg-white/5 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Fleet</span>
        </button>
        
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Editor Status</p>
              <p className="text-xs font-bold text-blue-500 uppercase">{isDirty ? 'Unsaved Changes' : 'Draft in Sync'}</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Zap size={18} />
           </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12">
        
        {/* --- LEFT PANEL: VEHICLE IDENTITY --- */}
        <aside className="lg:w-1/3 space-y-8">
          <section className="bg-white dark:bg-[#1c1c1e] p-10 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
             <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 mb-8">
                <Car size={40} />
             </div>
             
             <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight leading-tight">{vehicle?.make}</h1>
                <p className="text-xl font-bold text-[#86868b]">{vehicle?.model}</p>
             </div>

             <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Verification</p>
                    <p className="text-sm font-bold uppercase tracking-tight">Verified Asset</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 transition-colors">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Registry ID</p>
                    <p className="text-sm font-mono font-bold">{vehicle?.id}</p>
                  </div>
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.2em]">Secure Identifiers</p>
                  <Lock size={14} className="text-[#6e6e73]" />
                </div>
                <div className="space-y-3">
                  <div className="p-5 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5">
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1">VIN Number</span>
                    <span className="text-xs font-mono font-black tracking-tighter">{vehicle?.vin}</span>
                  </div>
                  <div className="p-5 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5 opacity-70">
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1">License Plate</span>
                    <span className="text-xs font-mono font-black tracking-widest">{vehicle?.licensePlate}</span>
                  </div>
                </div>
             </div>
          </section>
        </aside>

        {/* --- RIGHT PANEL: SPECIFICATION WORKSTATION --- */}
        <section className="lg:w-2/3">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-full">
             
             {/* SECTION HEADER */}
             <div className="px-12 py-10 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-xs font-black text-[#6e6e73] uppercase tracking-[0.4em]">Asset Specification Workstation</h3>
             </div>

             {/* FORM BODY */}
             <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                   {error && (
                     <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-bold">
                        <AlertCircle size={20} />
                        {error}
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormGroup label="Model Year" icon={<Calendar size={16}/>}>
                        <input type="number" {...register("year", { required: true })} className="input-field" />
                      </FormGroup>

                      <FormGroup label="Fuel Architecture" icon={<Fuel size={16}/>}>
                        <select {...register("fuelType")} className="input-field appearance-none cursor-pointer bg-transparent">
                          <option value="Petrol" className="bg-white dark:bg-[#1c1c1e]">Petrol</option>
                          <option value="Diesel" className="bg-white dark:bg-[#1c1c1e]">Diesel</option>
                          <option value="Hybrid" className="bg-white dark:bg-[#1c1c1e]">Hybrid</option>
                          <option value="Electric" className="bg-white dark:bg-[#1c1c1e]">Electric</option>
                        </select>
                      </FormGroup>

                      <FormGroup label="Transmission" icon={<Gauge size={16}/>}>
                        <select {...register("transmission")} className="input-field appearance-none cursor-pointer bg-transparent">
                          <option value="Automatic" className="bg-white dark:bg-[#1c1c1e]">Automatic</option>
                          <option value="Manual" className="bg-white dark:bg-[#1c1c1e]">Manual</option>
                          <option value="Tiptronic" className="bg-white dark:bg-[#1c1c1e]">Tiptronic</option>
                        </select>
                      </FormGroup>

                      <FormGroup label="Engine Displacement" icon={<Zap size={16}/>}>
                        <input {...register("engineCapacity")} placeholder="e.g. 1500cc" className="input-field" />
                      </FormGroup>

                      <FormGroup label="Exterior Finish" icon={<Palette size={16}/>}>
                        <input {...register("color")} className="input-field" />
                      </FormGroup>

                      <FormGroup label="Operational Odometer (KM)" icon={<Activity size={16}/>}>
                        <input type="number" {...register("mileage")} className="input-field" />
                      </FormGroup>

                      <FormGroup label="Station/Branch" icon={<MapPin size={16}/>}>
                        <input {...register("branch")} className="input-field" />
                      </FormGroup>

                      <FormGroup label="Asset Status" icon={<ShieldCheck size={16}/>}>
                        <select {...register("status")} className="input-field appearance-none cursor-pointer bg-transparent">
                          <option value="Active" className="bg-white dark:bg-[#1c1c1e]">Active</option>
                          <option value="Maintenance" className="bg-white dark:bg-[#1c1c1e]">Maintenance</option>
                          <option value="In Prep" className="bg-white dark:bg-[#1c1c1e]">In Prep</option>
                          <option value="Retired" className="bg-white dark:bg-[#1c1c1e]">Retired</option>
                        </select>
                      </FormGroup>

                      <FormGroup label="Daily Rental Rate (Rs.)" icon={<DollarSign size={16}/>} className="md:col-span-2 bg-blue-500/5 border-blue-500/10">
                        <input type="number" step="0.01" {...register("dailyRate", { required: true })} className="input-field text-2xl font-black text-blue-500" />
                      </FormGroup>
                   </div>
                </form>
             </div>

             {/* FOOTER ACTIONS */}
             <div className="px-12 py-10 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="hidden md:block">
                   <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Workstation Policy</p>
                   <p className="text-[9px] text-[#8e8e93] mt-1 max-w-[200px] leading-relaxed">Ensure all technical specifications match the vehicle registry before syncing.</p>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <button 
                    onClick={() => router.back()}
                    className="flex-1 md:flex-none px-8 py-5 text-xs font-black uppercase tracking-widest text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                   >
                    Cancel
                   </button>
                   <button
                    form="vehicle-form"
                    type="submit"
                    disabled={!isDirty || isSaving}
                    className={`
                      flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                      ${!isDirty || isSaving
                        ? 'bg-gray-200 dark:bg-white/5 text-[#8e8e93] cursor-not-allowed'
                        : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95'}
                    `}
                   >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{isSaving ? "Syncing..." : "Commit Changes"}</span>
                   </button>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* --- STYLES --- */}
      <style jsx>{`
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          outline: none;
          padding: 0;
          margin-top: 0.25rem;
          color: inherit;
        }
        .input-field::placeholder {
          color: #8e8e93;
          font-weight: 400;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// --- UTILS ---

function FormGroup({ label, icon, children, className = "" }: any) {
  return (
    <div className={`p-6 bg-gray-50 dark:bg-black/20 rounded-[24px] border border-gray-100 dark:border-white/5 focus-within:border-blue-500/40 focus-within:bg-blue-500/[0.03] transition-all group ${className}`}>
      <div className="flex items-center gap-2 mb-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
        <span className="text-blue-500">{icon}</span>
        <label className="text-[9px] font-black text-[#6e6e73] uppercase tracking-widest">{label}</label>
      </div>
      {children}
    </div>
  );
}
