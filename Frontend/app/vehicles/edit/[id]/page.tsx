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
  Database,
  Type,
  Layers
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
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuelType: string;
  engineCapacity: string;
  color: string;
  mileage: number;
  dailyRate: number;
  branch: string;
  status: string;
  licensePlate: string;
  vin: string;
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

  // 1. DATA FETCHING & POPULATION (The "Missing Data" Fix)
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

          // CRITICAL: Map snake_case from DB to camelCase for Form
          reset({
            make: data.make,
            model: data.model,
            year: data.year,
            transmission: data.transmission,
            fuelType: data.fuel_type, // Mapped from fuel_type
            engineCapacity: data.engine_capacity || "", // Mapped from engine_capacity
            color: data.color || "",
            mileage: data.mileage || 0,
            dailyRate: data.daily_rate, // Mapped from daily_rate
            branch: data.branch || "",
            status: data.status,
            licensePlate: data.license_plate, // Mapped from license_plate
            vin: data.vin
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

  // 2. FORM SUBMISSION (Update Phase)
  const onSubmit = async (data: FormValues) => {
    if (!vehicle) return;

    setIsSaving(true);
    setError(null);

    try {
      // Format Payload: match the backend's req.body destructuring (camelCase)
      const payload = {
        make: data.make,
        model: data.model,
        year: parseInt(data.year.toString()),
        transmission: data.transmission,
        fuelType: data.fuelType,
        engineCapacity: data.engineCapacity,
        color: data.color,
        mileage: parseInt(data.mileage.toString()),
        dailyRate: parseFloat(data.dailyRate.toString()),
        branch: data.branch,
        status: data.status,
        licensePlate: data.licensePlate
      };

      const response = await fetch(`http://localhost:5000/api/vehicles/update?vin=${vehicle.vin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Update failed. Please check registry connectivity.");
      }

      setSuccess(true);
      router.refresh();

      setTimeout(() => {
        router.push("/Admin/Vehicle/");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  // --- RENDERING ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#121214] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-6"
        >
          <Zap size={40} className="animate-pulse" />
        </motion.div>
        <p className="text-[#6e6e73] font-black text-[10px] tracking-[0.3em] uppercase">Syncing with Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-white font-sans selection:bg-blue-500/30">

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 mb-8"
            >
              <CheckCircle2 size={64} />
            </motion.div>
            <h2 className="text-4xl font-black tracking-tighter">Asset Registry Synced</h2>
            <p className="text-[#6e6e73] mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">Updating Database State...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-3xl border-b border-gray-200 dark:border-white/5 px-10 py-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-all"
        >
          <div className="p-2.5 rounded-xl group-hover:bg-gray-100 dark:group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Fleet Dashboard</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Workstation Status</p>
            <p className={`text-xs font-bold uppercase ${isDirty ? 'text-orange-500' : 'text-blue-500'}`}>
              {isDirty ? 'Unsaved Changes' : 'Draft in Sync'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Database size={20} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto p-10 md:p-16 flex flex-col xl:flex-row gap-16">

        {/* --- LEFT PANEL: ASSET IDENTITY --- */}
        <aside className="xl:w-[380px] shrink-0 space-y-10">
          <section className="bg-white dark:bg-[#1c1c1e] p-12 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
            <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 mb-10 mx-auto">
              <Car size={48} />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight leading-tight uppercase">{vehicle?.make}</h1>
              <p className="text-2xl font-bold text-[#86868b] tracking-tight">{vehicle?.model}</p>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#000000] flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 shadow-sm transition-colors">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Verification</p>
                  <p className="text-sm font-bold uppercase tracking-tight">Verified Asset</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#000000] flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 shadow-sm transition-colors">
                  <Database size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Registry ID</p>
                  <p className="text-sm font-mono font-black">{vehicle?.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5">
              <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Lock size={14} />
                Secure Identifiers
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-gray-100 dark:bg-black/40 rounded-3xl border border-transparent dark:border-white/5 opacity-80">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-2">License Plate (Locked)</span>
                  <span className="text-sm font-mono font-black tracking-widest text-[#1d1d1f] dark:text-white">{(vehicle as any)?.license_plate || vehicle?.licensePlate}</span>
                </div>
                <div className="p-6 bg-gray-100 dark:bg-black/40 rounded-3xl border border-transparent dark:border-white/5 opacity-80">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-2">VIN Number (Locked)</span>
                  <span className="text-sm font-mono font-black tracking-tighter text-[#1d1d1f] dark:text-white">{vehicle?.vin}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>

        {/* --- RIGHT PANEL: FORM WORKSTATION --- */}
        <section className="flex-1">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden flex flex-col h-full">

            {/* SECTION HEADER */}
            <div className="px-14 py-12 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-black text-[#1d1d1f] dark:text-white uppercase tracking-[0.4em]">Asset Specification Editor</h3>
                <p className="text-[10px] text-[#6e6e73] font-bold uppercase tracking-widest mt-1">Registry Workspace V3.0</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#6e6e73]" />
              </div>
            </div>

            {/* FORM BODY */}
            <div className="flex-1 p-14 overflow-y-auto custom-scrollbar">
              <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-16">
                {error && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-5 text-red-500 text-xs font-black uppercase tracking-widest">
                    <AlertCircle size={24} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                  <FormGroup label="Manufacturer" icon={<Type size={16} />}>
                    <input {...register("make", { required: true })} className="input-field" placeholder="e.g. Toyota" />
                  </FormGroup>

                  <FormGroup label="Model Name" icon={<Layers size={16} />}>
                    <input {...register("model", { required: true })} className="input-field" placeholder="e.g. Prius" />
                  </FormGroup>

                  <FormGroup label="Production Year" icon={<Calendar size={16} />}>
                    <input type="number" {...register("year", { required: true })} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Fuel Architecture" icon={<Fuel size={16} />}>
                    <select {...register("fuelType")} className="input-field appearance-none cursor-pointer">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Transmission" icon={<Gauge size={16} />}>
                    <select {...register("transmission")} className="input-field appearance-none cursor-pointer">
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="Tiptronic">Tiptronic</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Engine Displacement" icon={<Zap size={16} />}>
                    <input {...register("engineCapacity")} placeholder="e.g. 1500cc" className="input-field" />
                  </FormGroup>

                  <FormGroup label="Exterior Palette" icon={<Palette size={16} />}>
                    <input {...register("color")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Odometer (KM)" icon={<Activity size={16} />}>
                    <input type="number" {...register("mileage")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Asset Branch" icon={<MapPin size={16} />}>
                    <input {...register("branch")} className="input-field" />
                  </FormGroup>

                  <FormGroup label="Fleet Status" icon={<ShieldCheck size={16} />}>
                    <select {...register("status")} className="input-field appearance-none cursor-pointer">
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Prep">In Prep</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Daily Rate (Rs.)" icon={<div className="text-blue-500 font-black text-xs">Rs</div>} className="lg:col-span-2 bg-blue-600/[0.04] border-blue-500/10 shadow-inner">
                    <input type="number" step="0.01" {...register("dailyRate", { required: true })} className="input-field text-3xl font-black text-blue-600" />
                  </FormGroup>
                </div>
              </form>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="px-14 py-12 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-8">
              <div className="hidden lg:block mr-auto">
                <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">Editor Policy</p>
                <p className="text-[9px] text-[#8e8e93] font-bold mt-1.5 max-w-[280px] leading-relaxed uppercase">Manual registry overrides require double-verification of asset identity.</p>
              </div>

              <div className="flex items-center gap-8 w-full lg:w-auto">
                <button
                  onClick={() => router.back()}
                  className="flex-1 lg:flex-none px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#6e6e73] hover:text-red-500 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  form="vehicle-form"
                  type="submit"
                  disabled={!isDirty || isSaving}
                  className={`
                      flex-1 lg:flex-none flex items-center justify-center gap-4 px-16 py-6 rounded-[28px] text-xs font-black uppercase tracking-[0.3em] transition-all
                      ${!isDirty || isSaving
                      ? 'bg-gray-200 dark:bg-white/5 text-[#8e8e93] cursor-not-allowed shadow-none'
                      : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:-translate-y-2 active:scale-95'}
                    `}
                >
                  {isSaving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
                  <span>{isSaving ? "Syncing Registry..." : "Sync Specifications"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- CUSTOM STYLES --- */}
      <style jsx>{`
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          font-weight: 800;
          font-size: 1.125rem;
          outline: none;
          padding: 0;
          margin-top: 0.5rem;
          color: inherit;
          tracking: -0.02em;
        }
        .input-field::placeholder {
          color: #8e8e93;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.2);
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(120, 120, 120, 0.4);
        }
      `}</style>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function FormGroup({ label, icon, children, className = "" }: any) {
  return (
    <div className={`p-8 bg-gray-50 dark:bg-[#121214]/40 rounded-[32px] border border-gray-100 dark:border-white/5 focus-within:border-blue-500/50 focus-within:bg-blue-500/[0.05] shadow-sm transition-all group ${className}`}>
      <div className="flex items-center gap-3 mb-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
        <div className="w-6 h-6 flex items-center justify-center text-blue-500">
          {icon}
        </div>
        <label className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.2em]">{label}</label>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
