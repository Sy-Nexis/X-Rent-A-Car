"use client";

import React, { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  Sparkles
} from "lucide-react";
import { getApiBaseUrl, invalidateClientDataCache, getAuthHeaders } from "@/lib/api";
import { searchBrands, searchVehicles, VehicleCatalogItem } from "@/lib/vehicleCatalog";

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
  const [autoFilledNote, setAutoFilledNote] = useState<string | null>(null);

  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

  const makeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      transmission: "Automatic",
      fuelType: "Petrol",
      location: "Colombo HQ",
      status: "Available"
    }
  });

  const watchedMake = watch("make") || "";
  const watchedModel = watch("model") || "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (makeRef.current && !makeRef.current.contains(e.target as Node)) {
        setShowMakeSuggestions(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setShowModelSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCatalogItem = (item: VehicleCatalogItem) => {
    setValue("make", item.brand, { shouldValidate: true });
    setValue("model", item.model, { shouldValidate: true });
    setValue("transmission", item.transmission === "AUTO" ? "Automatic" : "Manual");
    setValue("fuelType", item.fuelType);
    setValue("engineCapacity", item.engineCapacity);
    setValue("dailyRate", item.dailyRate);
    if (item.color) {
      setValue("color", item.color);
    }
    setShowMakeSuggestions(false);
    setShowModelSuggestions(false);
    setAutoFilledNote(`Auto-filled specs for ${item.brand} ${item.model}`);
    setTimeout(() => setAutoFilledNote(null), 4000);
  };

  const handleSelectBrand = (brandName: string) => {
    setValue("make", brandName, { shouldValidate: true });
    setShowMakeSuggestions(false);
    setShowModelSuggestions(true);
  };

  const matchingMakes = searchBrands(watchedMake);
  const matchingModels = searchVehicles(watchedModel, watchedMake);

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
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

      const response = await fetch(`${getApiBaseUrl()}/api/vehicles/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message + (result.detail ? ` (${result.detail})` : "") || "Failed to register vehicle");
      }

      invalidateClientDataCache("vehicles");
      console.log("VEHICLE_REGISTERED_SUCCESSFULLY:", result);
      setShowSuccess(true);
      reset();

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
    <div className="bg-transparent py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 text-white select-none">

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence mode="wait">
        {showSuccess && (
          <motion.div
            key="success-notification"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#2c2c2e]/90 backdrop-blur-md border border-green-500/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 text-green-500"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider">Vehicle Registered</h4>
              <p className="text-xs text-gray-400">The record has been securely added to the neXus fleet database.</p>
            </div>
          </motion.div>
        )}

        {autoFilledNote && (
          <motion.div
            key="autofill-notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#1c1c1f]/95 backdrop-blur-md border border-blue-500/40 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-3 text-blue-400"
          >
            <Sparkles size={18} className="text-blue-400" />
            <span className="text-xs font-bold text-white">{autoFilledNote}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error-notification"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#2c2c2e]/90 backdrop-blur-md border border-red-500/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 text-red-500"
          >
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider">Registration Failed</h4>
              <p className="text-xs text-gray-400">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-4 text-gray-500 hover:text-white transition-colors h-11 w-11 flex items-center justify-center rounded-xl">
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">

        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#86868b] uppercase tracking-widest mb-8">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span>Vehicles</span>
          <ChevronRight size={12} />
          <span className="text-white">Data Entry</span>
        </nav>

        {/* HEADER */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
            Register <span className="text-[#6e6e73]">Fleet Vehicle</span>
          </h1>
          <p className="text-[#86868b] text-sm md:text-base font-medium max-w-xl">
            Enter comprehensive vehicle specifications with intelligent model auto-fill.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2c2c2e]/50 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* SECTION 1: CORE IDENTIFICATION */}
            <div className="p-6 md:p-8">
              <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  <div>
                    <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">Section 01</h3>
                    <h2 className="text-base font-black uppercase text-white">Core Identification</h2>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                  <Sparkles size={11} /> Auto-Fill Specs Active
                </span>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* MAKE / BRAND WITH AUTOCOMPLETE */}
                <div ref={makeRef} className="space-y-2 relative">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Make / Brand</label>
                  <input
                    {...register("make", { required: "Make is required" })}
                    onFocus={() => setShowMakeSuggestions(true)}
                    placeholder="e.g. Toyota, Honda, Suzuki"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                  />
                  {errors.make && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-bold"><AlertCircle size={12} /> {errors.make.message}</p>}

                  {showMakeSuggestions && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-[#1c1c1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto custom-scrollbar">
                      <div className="p-2.5 bg-black/40 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-400">
                        Popular Manufacturers ({matchingMakes.length})
                      </div>
                      {matchingMakes.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleSelectBrand(b)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-blue-500/10 hover:text-blue-400 text-xs font-bold text-gray-200 flex items-center justify-between border-b border-white/[0.02] transition-colors"
                        >
                          <span>{b}</span>
                          <span className="text-[10px] text-gray-500">Select →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* MODEL WITH AUTOCOMPLETE & SPEC PREVIEWS */}
                <div ref={modelRef} className="space-y-2 relative">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Model</label>
                  <input
                    {...register("model", { required: "Model is required" })}
                    onFocus={() => setShowModelSuggestions(true)}
                    placeholder="e.g. Prius, Axio, Vezel"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                  />
                  {errors.model && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-bold"><AlertCircle size={12} /> {errors.model.message}</p>}

                  {showModelSuggestions && (
                    <div className="absolute z-50 left-0 -right-20 md:right-0 top-full mt-1.5 bg-[#1c1c1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                      <div className="p-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <span>Matching Presets ({matchingModels.length})</span>
                        <span className="text-blue-400">Click to fill</span>
                      </div>
                      {matchingModels.length > 0 ? (
                        matchingModels.map((item, idx) => (
                          <button
                            key={`${item.brand}-${item.model}-${idx}`}
                            type="button"
                            onClick={() => handleSelectCatalogItem(item)}
                            className="w-full text-left p-3 hover:bg-white/5 border-b border-white/[0.03] transition-all group flex flex-col gap-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                                {item.brand} {item.model}
                              </span>
                              <span className="text-[10px] font-black text-blue-400">
                                LKR {item.dailyRate.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="text-emerald-400 font-bold">{item.fuelType}</span>
                              <span>•</span>
                              <span>{item.engineCapacity}</span>
                              <span>•</span>
                              <span>{item.transmission}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-gray-500">Custom model &quot;{watchedModel}&quot;</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Year of Manufacture</label>
                  <input
                    {...register("year", { required: "Year is required", min: { value: 1900, message: "Invalid year" } })}
                    type="number"
                    placeholder="2024"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                  />
                  {errors.year && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-bold"><AlertCircle size={12} /> {errors.year.message}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Chassis / VIN Number</label>
                  <input
                    {...register("vin", { required: "VIN is required" })}
                    placeholder="e.g. ZVW50-1049281 or 17-digit VIN"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 uppercase min-h-[44px]"
                  />
                  {errors.vin && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-bold"><AlertCircle size={12} /> {errors.vin.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">License Plate (Sri Lanka)</label>
                  <input
                    {...register("licensePlate", { required: "Plate is required" })}
                    placeholder="WP CAB-1234"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 uppercase min-h-[44px]"
                  />
                  {errors.licensePlate && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-bold"><AlertCircle size={12} /> {errors.licensePlate.message}</p>}
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* SECTION 2: TECHNICAL SPECIFICATIONS */}
            <div className="p-6 md:p-8 bg-white/[0.01]">
              <header className="mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <div>
                  <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">Section 02</h3>
                  <h2 className="text-base font-black uppercase text-white">Technical Specifications</h2>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Transmission</label>
                  <div className="relative">
                    <select
                      {...register("transmission")}
                      className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:border-blue-500/50 text-sm text-white font-bold cursor-pointer min-h-[44px] appearance-none"
                    >
                      <option value="Automatic" className="bg-[#2c2c2e]">Automatic (AUTO)</option>
                      <option value="Manual" className="bg-[#2c2c2e]">Manual (MAN)</option>
                      <option value="CVT" className="bg-[#2c2c2e]">CVT</option>
                      <option value="Tiptronic" className="bg-[#2c2c2e]">Tiptronic</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Fuel Type</label>
                  <div className="relative">
                    <select
                      {...register("fuelType")}
                      className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:border-blue-500/50 text-sm text-white font-bold cursor-pointer min-h-[44px] appearance-none"
                    >
                      <option value="Petrol" className="bg-[#2c2c2e]">Petrol</option>
                      <option value="Diesel" className="bg-[#2c2c2e]">Diesel</option>
                      <option value="Hybrid" className="bg-[#2c2c2e]">Hybrid</option>
                      <option value="Electric" className="bg-[#2c2c2e]">Electric</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Engine Capacity (cc / kWh)</label>
                  <input
                    {...register("engineCapacity")}
                    placeholder="e.g. 1500cc / 1800cc or 64kWh"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Color</label>
                  <input
                    {...register("color")}
                    placeholder="e.g. Pearl White, Metallic Silver"
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Current Mileage</label>
                  <div className="relative">
                    <input
                      {...register("mileage")}
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 pr-12 min-h-[44px]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-500 uppercase tracking-widest">KM</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* SECTION 3: FLEET & FINANCIAL DETAILS */}
            <div className="p-6 md:p-8">
              <header className="mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <div>
                  <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">Section 03</h3>
                  <h2 className="text-base font-black uppercase text-white">Fleet & Financial Details</h2>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Daily Rental Rate</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] text-xs font-black uppercase tracking-wider">LKR</span>
                    <input
                      {...register("dailyRate", { min: 0, max: 99999999 })}
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 focus:border-blue-500/50 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-white font-bold placeholder:text-gray-600 min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Assigned Branch (Sri Lanka)</label>
                  <div className="relative">
                    <select
                      {...register("location")}
                      className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:border-blue-500/50 text-sm text-white font-bold cursor-pointer min-h-[44px] appearance-none"
                    >
                      <option value="Colombo HQ" className="bg-[#2c2c2e]">Colombo HQ (Head Office)</option>
                      <option value="Kandy Branch" className="bg-[#2c2c2e]">Kandy Branch</option>
                      <option value="Galle Coastal" className="bg-[#2c2c2e]">Galle Coastal Branch</option>
                      <option value="Negombo Airport" className="bg-[#2c2c2e]">Negombo Airport Branch</option>
                      <option value="Jaffna Branch" className="bg-[#2c2c2e]">Jaffna Branch</option>
                      <option value="Kurunegala Branch" className="bg-[#2c2c2e]">Kurunegala Branch</option>
                      <option value="Matara Branch" className="bg-[#2c2c2e]">Matara Branch</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[9px] font-black text-[#86868b] uppercase tracking-widest ml-1">Initial Fleet Status</label>
                  <div className="flex flex-col sm:flex-row gap-4">
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
                        />
                        <div className="px-4 py-3.5 bg-black/20 rounded-xl border border-white/5 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all text-center text-xs font-black uppercase tracking-widest text-[#86868b] peer-checked:text-blue-400 min-h-[44px] flex items-center justify-center">
                          {st.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* SECTION 4: DOCUMENTATION */}
            <div className="p-6 md:p-8 bg-white/[0.01]">
              <header className="mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <div>
                  <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.25em]">Section 04</h3>
                  <h2 className="text-base font-black uppercase text-white">Documentation (Sri Lanka DMT / MTA 6)</h2>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/[0.02] flex flex-col items-center justify-center gap-3 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-550 group-hover:scale-105 transition-all">
                      <Car size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-white">Vehicle Photography</p>
                      <p className="text-[9px] font-bold text-gray-500 tracking-wider uppercase mt-1">Front, Side, Interior (Max 10MB)</p>
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/[0.02] flex flex-col items-center justify-center gap-3 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#6e6e73] group-hover:text-blue-550 group-hover:scale-105 transition-all">
                      <FileText size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-white">CR Book (MTA 6) & Revenue License</p>
                      <p className="text-[9px] font-bold text-gray-500 tracking-wider uppercase mt-1">PDF or Scanned Copy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="p-6 md:p-8 border-t border-white/5 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors h-11 px-4 active:scale-95 duration-200"
              >
                <Trash2 size={14} />
                Clear Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-550 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 min-w-[220px] justify-center min-h-[48px] duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Save Vehicle Record
                    <Upload size={16} />
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

        {/* FOOTER TEXT */}
        <p className="mt-8 text-center text-[8px] text-[#6e6e73] font-black uppercase tracking-[0.4em]">
          xrent Enterprise Fleet Management System · Data Integrity Unit
        </p>
      </div>
    </div>
  );
}