"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Car,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertCircle
} from "lucide-react";

type VehicleFormData = {
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  transmission: string;
  fuelType: string;
  engineCapacity: string;
  color: string;
  mileage: number;
  dailyRate: number;
  location: string;
  status: string;
};

export default function VehicleDataEntry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>();

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Map data to both camelCase and snake_case to ensure compatibility 
      // with all versions of the backend API.
      const payload = {
        ...data,
        year: Number(data.year),
        mileage: Number(data.mileage),
        daily_rate: Number(data.dailyRate),
        dailyRate: Number(data.dailyRate),
        license_plate: data.licensePlate,
        fuel_type: data.fuelType,
        engine_capacity: data.engineCapacity,
        branch: data.location,
      };

      console.log("SUBMITTING_VEHICLE_PAYLOAD:", payload);

      const response = await fetch("http://localhost:5000/api/vehicles/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message + (result.detail ? ` (${result.detail})` : "") + (result.hint ? ` [Hint: ${result.hint}]` : "") || "Failed to register vehicle");
      }

      console.log("VEHICLE_REGISTERED_SUCCESSFULLY:", result);
      setShowSuccess(true);
      reset();

      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (err: any) {
      console.error("VEHICLE_REGISTRATION_ERROR:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30">

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence mode="wait">
        {showSuccess && (
          <motion.div
            key="success-notification"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#2c2c2e] border border-green-500/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Vehicle Registered Successfully</h4>
              <p className="text-xs text-[#6e6e73]">The record has been added to the XNRENT fleet.</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error-notification"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#2c2c2e] border border-red-500/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Registration Failed</h4>
              <p className="text-xs text-[#6e6e73]">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-4 text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white">
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">

        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#6e6e73] uppercase tracking-widest mb-8">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span>Vehicles</span>
          <ChevronRight size={12} />
          <span className="text-[#1d1d1f] dark:text-white">Data Entry</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white mb-2">
            Register Fleet Vehicle
          </h1>
          <p className="text-[#6e6e73] font-medium leading-relaxed">
            Enter comprehensive vehicle specifications for the XNRENT tracking system.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-sm border border-gray-200/50 dark:border-white/5 overflow-hidden"
        >
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* SECTION 1: CORE IDENTIFICATION */}
            <div className="p-8">
              <header className="mb-8">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Section 01</h3>
                <h2 className="text-lg font-bold">Core Identification</h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Make</label>
                  <input
                    {...register("make", { required: true })}
                    placeholder="e.g. Toyota"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                  />
                  {errors.make && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> This field is required</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Model</label>
                  <input
                    {...register("model", { required: true })}
                    placeholder="e.g. Prius"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Year</label>
                  <input
                    {...register("year", { required: true, min: 1900 })}
                    type="number"
                    placeholder="2024"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">VIN / Chassis Number</label>
                  <input
                    {...register("vin", { required: true })}
                    placeholder="17-character alphanumeric code"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">License Plate</label>
                  <input
                    {...register("licensePlate", { required: true })}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-white/5" />

            {/* SECTION 2: TECHNICAL SPECIFICATIONS */}
            <div className="p-8 bg-gray-50/30 dark:bg-white/[0.01]">
              <header className="mb-8">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Section 02</h3>
                <h2 className="text-lg font-bold">Technical Specifications</h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Transmission</label>
                  <select
                    {...register("transmission")}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Fuel Type</label>
                  <select
                    {...register("fuelType")}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Engine Capacity / kWh</label>
                  <input
                    {...register("engineCapacity")}
                    placeholder="e.g. 1800cc or 50kWh"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Color</label>
                  <input
                    {...register("color")}
                    placeholder="e.g. Pearl White"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Current Mileage</label>
                  <div className="relative">
                    <input
                      {...register("mileage")}
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#6e6e73] uppercase">KM</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-white/5" />

            {/* SECTION 3: FLEET & FINANCIAL DETAILS */}
            <div className="p-8">
              <header className="mb-8">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Section 03</h3>
                <h2 className="text-lg font-bold">Fleet & Financial Details</h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Daily Rental Rate</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e6e73] text-sm font-medium">Rs.</span>
                    <input
                      {...register("dailyRate")}
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Assigned Branch</label>
                  <select
                    {...register("location")}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Colombo HQ">Colombo HQ</option>
                    <option value="Kandy Branch">Kandy Branch</option>
                    <option value="Galle Coastal">Galle Coastal</option>
                    <option value="Negombo Airport">Negombo Airport</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider ml-1">Initial Fleet Status</label>
                  <div className="flex gap-4">
                    {[
                      { id: "Available", label: "Active" },
                      { id: "In Prep", label: "In Prep" },
                      { id: "Maintenance", label: "Maintenance" }
                    ].map((st) => (
                      <label key={st.id} className="flex-1 cursor-pointer">
                        <input
                          {...register("status")}
                          type="radio"
                          value={st.id}
                          className="sr-only peer"
                          defaultChecked={st.id === "active"}
                        />
                        <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent peer-checked:border-blue-500 peer-checked:bg-blue-500/5 transition-all text-center text-xs font-semibold text-[#6e6e73] peer-checked:text-[#0071e3]">
                          {st.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-white/5" />

            {/* SECTION 4: DOCUMENTATION */}
            <div className="p-8 bg-gray-50/30 dark:bg-white/[0.01]">
              <header className="mb-8">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Section 04</h3>
                <h2 className="text-lg font-bold">Documentation</h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 group-hover:border-blue-500/50 group-hover:bg-blue-500/[0.02] transition-all">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 group-hover:scale-110 transition-all">
                      <Car size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold">Vehicle Photography</p>
                      <p className="text-[10px] text-[#6e6e73]">Front, Side, Interior (Max 10MB)</p>
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 group-hover:border-blue-500/50 group-hover:bg-blue-500/[0.02] transition-all">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-500 group-hover:scale-110 transition-all">
                      <FileText size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold">Registration & Insurance</p>
                      <p className="text-[10px] text-[#6e6e73]">PDF or Scanned Images</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] flex items-center justify-between">
              <button
                type="button"
                onClick={() => reset()}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Clear Form
              </button>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 min-w-[200px] justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Save Vehicle Record
                      <Upload size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </motion.div>

        {/* FOOTER TEXT */}
        <p className="mt-8 text-center text-[10px] text-[#6e6e73] font-bold uppercase tracking-widest">
          XNRENT Enterprise Fleet Management System · Data Integrity Unit
        </p>
      </div>
    </div>
  );
}