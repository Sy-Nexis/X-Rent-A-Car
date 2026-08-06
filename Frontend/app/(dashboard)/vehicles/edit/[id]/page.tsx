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
        const response = await fetch(`http://localhost:8801/api/vehicles/view/${id}`);

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
        // Mock Fallback
        if (id && ["1", "2", "3", "4"].includes(id.toString())) {
          const MOCK = [
            { id: 1, make: "Freightliner", model: "Cascadia", year: 2024, vin: "ID: FC-992-K", license_plate: "TX-78-PXQ", daily_rate: 245.00, status: "ACTIVE", fuel_type: "Heavy Duty", transmission: "EV-100" },
            { id: 2, make: "Volvo", model: "VNL 860", year: 2023, vin: "ID: FC-441-S", license_plate: "CA-12-LMN", daily_rate: 210.50, status: "MAINTENANCE", fuel_type: "Sleeper", transmission: "Diesel-V6" },
            { id: 3, make: "Kenworth", model: "T680", year: 2024, vin: "ID: FC-209-X", license_plate: "WA-88-RTB", daily_rate: 230.00, status: "IN PREP", fuel_type: "Logistics", transmission: "Hy-Brid" },
            { id: 4, make: "Peterbilt", model: "579", year: 2022, vin: "ID: FC-112-P", license_plate: "FL-45-QWE", daily_rate: 275.00, status: "ACTIVE", fuel_type: "Long Haul", transmission: "Clean-Diesel" },
          ];
          const data = MOCK.find(m => m.id.toString() === id.toString());
          if (data) {
            setVehicle(data as any);
            reset({
              make: data.make,
              model: data.model,
              year: data.year,
              transmission: data.transmission,
              fuelType: data.fuel_type,
              engineCapacity: "",
              color: "",
              mileage: 0,
              dailyRate: data.daily_rate,
              branch: "",
              status: data.status,
              licensePlate: data.license_plate,
              vin: data.vin
            });
            setIsLoading(false);
            return;
          }
        }
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

      const response = await fetch(`http://localhost:8801/api/vehicles/update?vin=${vehicle.vin}`, {
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
      <div className="min-h-screen bg-[#0e0e11] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-brand-cyan/10 rounded-full flex items-center justify-center text-brand-cyan mb-6"
        >
          <Zap size={40} className="animate-pulse" />
        </motion.div>
        <p className="text-gray-400 font-black text-[10px] tracking-[0.3em] uppercase">Syncing with Registry...</p>
      </div>
    );
  }

  // --- CUSTOM STYLES / CONSTANTS ---
  const inputTW = "w-full bg-transparent border-none font-black text-lg text-white outline-none p-0 mt-2 placeholder-gray-600 tracking-tight appearance-none";

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white font-sans selection:bg-brand-cyan/30">

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 mb-8"
            >
              <CheckCircle2 size={64} />
            </motion.div>
            <h2 className="text-4xl font-black tracking-tighter text-white">Asset Registry Synced</h2>
            <p className="text-gray-400 mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">Updating Database State...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION BAR - Relative, not Sticky to prevent overlapping */}
      <nav className="relative z-40 bg-[#1e1e1e] border-b border-white/5 px-10 py-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all"
        >
          <div className="p-2.5 rounded-xl group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Fleet Dashboard</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Workstation Status</p>
            <p className={`text-xs font-bold uppercase ${isDirty ? 'text-orange-500' : 'text-brand-cyan'}`}>
              {isDirty ? 'Unsaved Changes' : 'Draft in Sync'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Database size={20} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto p-10 md:p-16 flex flex-col xl:flex-row gap-16">

        {/* --- LEFT PANEL: ASSET IDENTITY --- */}
        <aside className="xl:w-[380px] shrink-0 space-y-10">
          <section className="bg-[#1e1e1e] p-12 rounded-[40px] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
            <div className="w-24 h-24 bg-brand-gradient rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 mb-10 mx-auto">
              <Car size={48} />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight leading-tight uppercase">{vehicle?.make}</h1>
              <p className="text-2xl font-bold text-gray-400 tracking-tight">{vehicle?.model}</p>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-5 p-4 bg-white/5 rounded-3xl border border-transparent hover:border-brand-cyan/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#0e0e11] flex items-center justify-center text-gray-400 group-hover:text-brand-cyan shadow-sm transition-colors">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification</p>
                  <p className="text-sm font-bold uppercase tracking-tight">Verified Asset</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 bg-white/5 rounded-3xl border border-transparent hover:border-brand-cyan/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#0e0e11] flex items-center justify-center text-gray-400 group-hover:text-brand-cyan shadow-sm transition-colors">
                  <Database size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry ID</p>
                  <p className="text-sm font-mono font-black">{vehicle?.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Lock size={14} />
                Secure Identifiers
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-[#0e0e11] rounded-3xl border border-white/5 opacity-80">
                  <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-[0.2em] block mb-2">License Plate (Locked)</span>
                  <span className="text-sm font-mono font-black tracking-widest text-white">{(vehicle as any)?.license_plate || vehicle?.licensePlate}</span>
                </div>
                <div className="p-6 bg-[#0e0e11] rounded-3xl border border-white/5 opacity-80">
                  <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-[0.2em] block mb-2">VIN Number (Locked)</span>
                  <span className="text-sm font-mono font-black tracking-tighter text-white">{vehicle?.vin}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>

        {/* --- RIGHT PANEL: FORM WORKSTATION --- */}
        <section className="flex-1 min-w-0">
          <div className="bg-[#1e1e1e] rounded-[40px] border border-white/5 shadow-2xl shadow-black/5 overflow-hidden flex flex-col h-full">

            {/* SECTION HEADER */}
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Asset Specification Editor</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Registry Workspace V3.0</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#6e6e73]" />
              </div>
            </div>

            {/* FORM BODY */}
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
              <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {error && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-5 text-red-500 text-xs font-black uppercase tracking-widest">
                    <AlertCircle size={24} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-8">
                  <FormGroup label="Manufacturer" icon={<Type size={16} />}>
                    <input {...register("make", { required: true })} className={inputTW} placeholder="e.g. Toyota" />
                  </FormGroup>

                  <FormGroup label="Model Name" icon={<Layers size={16} />}>
                    <input {...register("model", { required: true })} className={inputTW} placeholder="e.g. Prius" />
                  </FormGroup>

                  <FormGroup label="Production Year" icon={<Calendar size={16} />}>
                    <input type="number" {...register("year", { required: true })} className={inputTW} placeholder="2024" />
                  </FormGroup>

                  <FormGroup label="Fuel Architecture" icon={<Fuel size={16} />}>
                    <div className="relative">
                      <select {...register("fuelType")} className={`${inputTW} cursor-pointer pr-8`}>
                        <option className="bg-[#0e0e11] text-white" value="Petrol">Petrol</option>
                        <option className="bg-[#0e0e11] text-white" value="Diesel">Diesel</option>
                        <option className="bg-[#0e0e11] text-white" value="Hybrid">Hybrid</option>
                        <option className="bg-[#0e0e11] text-white" value="Electric">Electric</option>
                        <option className="bg-[#0e0e11] text-white" value="Heavy Duty">Heavy Duty</option>
                        <option className="bg-[#0e0e11] text-white" value="Sleeper">Sleeper</option>
                        <option className="bg-[#0e0e11] text-white" value="Logistics">Logistics</option>
                        <option className="bg-[#0e0e11] text-white" value="Long Haul">Long Haul</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup label="Transmission" icon={<Gauge size={16} />}>
                    <div className="relative">
                      <select {...register("transmission")} className={`${inputTW} cursor-pointer pr-8`}>
                        <option className="bg-[#0e0e11] text-white" value="Automatic">Automatic</option>
                        <option className="bg-[#0e0e11] text-white" value="Manual">Manual</option>
                        <option className="bg-[#0e0e11] text-white" value="Tiptronic">Tiptronic</option>
                        <option className="bg-[#0e0e11] text-white" value="EV-100">EV-100</option>
                        <option className="bg-[#0e0e11] text-white" value="Diesel-V6">Diesel-V6</option>
                        <option className="bg-[#0e0e11] text-white" value="Hy-Brid">Hy-Brid</option>
                        <option className="bg-[#0e0e11] text-white" value="Clean-Diesel">Clean-Diesel</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup label="Engine Displacement" icon={<Zap size={16} />}>
                    <input {...register("engineCapacity")} placeholder="e.g. 1500cc" className={inputTW} />
                  </FormGroup>

                  <FormGroup label="Exterior Palette" icon={<Palette size={16} />}>
                    <input {...register("color")} className={inputTW} placeholder="e.g. Midnight Black" />
                  </FormGroup>

                  <FormGroup label="Odometer (KM)" icon={<Activity size={16} />}>
                    <input type="number" {...register("mileage")} className={inputTW} placeholder="e.g. 15000" />
                  </FormGroup>

                  <FormGroup label="Asset Branch" icon={<MapPin size={16} />}>
                    <input {...register("branch")} className={inputTW} placeholder="e.g. Central Hub" />
                  </FormGroup>

                  <FormGroup label="Fleet Status" icon={<ShieldCheck size={16} />}>
                    <div className="relative">
                      <select {...register("status")} className={`${inputTW} cursor-pointer pr-8`}>
                        <option className="bg-[#0e0e11] text-white" value="ACTIVE">ACTIVE</option>
                        <option className="bg-[#0e0e11] text-white" value="MAINTENANCE">MAINTENANCE</option>
                        <option className="bg-[#0e0e11] text-white" value="IN PREP">IN PREP</option>
                        <option className="bg-[#0e0e11] text-white" value="RETIRED">RETIRED</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </FormGroup>

                  <FormGroup label="Daily Rate (Rs.)" icon={<div className="text-brand-cyan font-black text-xs">Rs</div>} className="md:col-span-2 bg-brand-cyan/[0.04] border-brand-cyan/10 shadow-inner">
                    <input type="number" step="0.01" {...register("dailyRate", { required: true })} className="w-full bg-transparent border-none outline-none p-0 mt-2 placeholder-gray-600 tracking-tight appearance-none text-3xl font-black text-brand-cyan" />
                  </FormGroup>
                </div>
              </form>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="px-6 py-6 md:px-10 md:py-8 bg-[#1e1e1e] border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-6">
              <div className="hidden 2xl:block mr-auto">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Editor Policy</p>
                <p className="text-[9px] text-gray-500 font-bold mt-1.5 max-w-[280px] leading-relaxed uppercase">Manual registry overrides require double-verification of asset identity.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full 2xl:w-auto xl:ml-auto">
                <button
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  form="vehicle-form"
                  type="submit"
                  disabled={!isDirty || isSaving}
                  className={`
                      w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all
                      ${!isDirty || isSaving
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-brand-gradient text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:-translate-y-2 active:scale-95'}
                    `}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span className="whitespace-nowrap">{isSaving ? "Syncing..." : "Sync Specifications"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function FormGroup({ label, icon, children, className = "" }: any) {
  return (
    <div className={`p-5 bg-[#0e0e11] rounded-2xl border border-white/5 focus-within:border-brand-cyan/50 focus-within:bg-brand-cyan/[0.05] shadow-sm transition-all group ${className}`}>
      <div className="flex items-center gap-3 mb-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
        <div className="w-5 h-5 flex items-center justify-center text-brand-cyan">
          {icon}
        </div>
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</label>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
