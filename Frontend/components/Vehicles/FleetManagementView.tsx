"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl, invalidateClientDataCache } from "@/lib/api";

export default function FleetManagementView() {
  const router = useRouter();

  // Form fields with clean empty defaults
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2024");
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");

  const [transmission, setTransmission] = useState("AUTO");
  const [fuelType, setFuelType] = useState("Diesel");
  const [engine, setEngine] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");

  const [rate, setRate] = useState("");
  const [branch, setBranch] = useState("Central Distribution Center");
  const [status, setStatus] = useState("Active");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClear = () => {
    setBrand("");
    setModel("");
    setYear("2024");
    setVin("");
    setPlate("");
    setTransmission("AUTO");
    setFuelType("Diesel");
    setEngine("");
    setColor("");
    setMileage("");
    setRate("");
    setBranch("Central Distribution Center");
    setStatus("Active");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSaveVehicle = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!brand.trim() || !model.trim() || !vin.trim() || !plate.trim()) {
      setErrorMessage("Please fill in all core identification fields (Brand, Model, VIN, Plate).");
      setIsSaving(false);
      return;
    }

    try {
      const parsedMileage = Number(mileage) || 0;
      const parsedRate = Number(rate) || 0;

      const payload = {
        make: brand.trim(),
        model: model.trim(),
        year: parseInt(year) || 2024,
        vin: vin.trim(),
        licensePlate: plate.trim(),
        transmission: transmission === "AUTO" ? "Automatic" : "Manual",
        fuelType: fuelType,
        engineCapacity: engine.trim(),
        color: color.trim(),
        mileage: parsedMileage,
        dailyRate: parsedRate,
        daily_rate: parsedRate,
        branch: branch,
        status: status === "InPrep" ? "In Prep" : status,
      };

      const res = await fetch(`${getApiBaseUrl()}/api/vehicles/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to register vehicle to database");
      }

      invalidateClientDataCache("vehicles");
      setSuccessMessage("Vehicle registered successfully in Supabase! Redirecting to fleet registry...");
      setTimeout(() => {
        router.push("/vehicles");
      }, 1200);
    } catch (err: any) {
      console.error("Save vehicle error:", err);
      setErrorMessage(err.message || "An error occurred while saving vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0e0e11]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
        <span>Operations</span>
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-brand-cyan">Fleet Management</span>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Add Vehicle Record</h1>
        <p className="text-sm text-gray-400 font-medium">
          Register a new asset into the Precision Logistics ecosystem.
        </p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
        {/* Left Column Forms (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* CORE IDENTIFICATION */}
          <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 014 0" />
                </svg>
              </div>
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                Core Identification
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Mercedes-Benz"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Actros"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Year
                </label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none appearance-none cursor-pointer transition-all"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  VIN/Chassis Number
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="17-digit alphanumeric string"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  License Plate
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="ABC-1234"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* TECHNICAL SPECIFICATION */}
          <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                Technical Specification
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Transmission
                </label>
                <div className="flex bg-[#0e0e11] p-0.5 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setTransmission("AUTO")}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all cursor-pointer ${
                      transmission === "AUTO" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    AUTO
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransmission("MAN")}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all cursor-pointer ${
                      transmission === "MAN" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    MAN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Fuel Type
                </label>
                <div className="relative">
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none appearance-none cursor-pointer transition-all"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Engine KWh/CC
                </label>
                <input
                  type="text"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  placeholder="450"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Fleet White"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Mileage (Km)
                </label>
                <input
                  type="text"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* FLEET & FINANCIAL & INTEGRITY CARD ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* FLEET & FINANCIAL CARD (span 2) */}
            <div className="md:col-span-2 bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                    Fleet & Financial
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Daily Rental Rate (LKR)
                    </label>
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Assigned Branch
                    </label>
                    <div className="relative">
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none appearance-none cursor-pointer transition-all"
                      >
                        <option value="Central Distribution Center">Central Distribution Center</option>
                        <option value="North Terminal">North Terminal</option>
                        <option value="East Hub">East Hub</option>
                        <option value="Coastal Logistics Terminal">Coastal Logistics Terminal</option>
                        <option value="Main">Main</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Initial Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Active", color: "bg-brand-green", border: "hover:border-brand-green/20", activeBg: "bg-brand-green/10 text-brand-green border-brand-green/20" },
                    { name: "InPrep", color: "bg-amber-500", border: "hover:border-amber-500/20", activeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                    { name: "Maintenance", color: "bg-brand-red", border: "hover:border-brand-red/20", activeBg: "bg-brand-red/10 text-brand-red border-brand-red/20" },
                  ].map((s) => {
                    const isActive = status === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setStatus(s.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 transition-all cursor-pointer ${s.border} ${
                          isActive ? s.activeBg : "bg-[#0e0e11] text-gray-400"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${s.color} mb-1.5`} />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide">{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* OPERATIONAL INTEGRITY CARD (span 1) */}
            <div className="bg-[#1e1e1e] text-white rounded-xl border border-white/5 p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2">
                  Operational Integrity
                </h3>
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                  Ensure all technical specifications match the physical hardware documents. Inaccurate data affects routing AI and fuel optimization metrics.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <span className="text-[9px] uppercase font-extrabold text-gray-450 tracking-widest block mb-2">
                  Automated Fleet Check
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse shadow-sm shadow-emerald-450/50" />
                  <span className="text-[10px] font-bold text-brand-green tracking-wide uppercase">Real-Time Validation Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleClear}
              type="button"
              disabled={isSaving}
              className="flex items-center gap-2 border border-white/5 bg-[#0e0e11] hover:bg-red-950/20 hover:text-brand-red hover:border-brand-red/20 text-gray-400 text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Form
            </button>
            <button
              onClick={handleSaveVehicle}
              type="button"
              disabled={isSaving}
              className="flex items-center gap-2.5 bg-brand-gradient hover:opacity-90 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-lg shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving Vehicle...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Vehicle Record
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Latest Asset Preview (span 1) */}
        <div>
          <div className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden shadow-md flex flex-col">
            {/* Blue Asset Badge */}
            <div className="bg-brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5">
              Live Asset Preview
            </div>

            {/* Asset illustration preview container */}
            <div className="relative h-56 bg-gradient-to-br from-slate-900 via-[#151518] to-slate-950 flex flex-col items-center justify-center p-6 border-b border-white/5 overflow-hidden group">
              <div className="w-20 h-20 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-2 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan bg-brand-cyan/10 px-2.5 py-0.5 rounded-full border border-brand-cyan/20">
                {plate || "NEW-UNIT"}
              </span>
            </div>

            {/* Asset specifications & pricing details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-5">
              <div>
                <h3 className="text-white text-base font-extrabold leading-tight mb-0.5">
                  {brand || "New"} {model || "Vehicle"} ({year || "2024"})
                </h3>
                <span className="text-gray-400 text-[10px] font-bold block mb-4">
                  {fuelType} • {branch}
                </span>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Mileage</span>
                    <span className="text-xs font-black text-white">{mileage || "0"} km</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Fuel</span>
                    <span className="text-xs font-black text-white">{fuelType}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Transmission</span>
                    <span className="text-xs font-black text-white">{transmission}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">VIN</span>
                    <span className="text-xs font-black text-white truncate block max-w-[120px] font-mono">
                      {vin || "UNASSIGNED"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-end mt-2">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-500 block">Daily Rate</span>
                  <span className="text-xl font-black text-brand-cyan tracking-tight">LKR {Number(rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
