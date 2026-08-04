import React, { useState } from "react";

export default function FleetManagementView() {
  // Form fields
  const [brand, setBrand] = useState("Mercedes-Benz");
  const [model, setModel] = useState("Actros");
  const [year, setYear] = useState("2024");
  const [vin, setVin] = useState("17-digit alphanumeric string");
  const [plate, setPlate] = useState("ABC-1234");

  const [transmission, setTransmission] = useState("AUTO");
  const [fuelType, setFuelType] = useState("Diesel");
  const [engine, setEngine] = useState("450");
  const [color, setColor] = useState("Fleet White");
  const [mileage, setMileage] = useState("0");

  const [rate, setRate] = useState("0.00");
  const [branch, setBranch] = useState("Central Distribution Center");
  const [status, setStatus] = useState("Active");

  const handleClear = () => {
    setBrand("");
    setModel("");
    setYear("2024");
    setVin("");
    setPlate("");
    setTransmission("AUTO");
    setFuelType("Diesel");
    setEngine("");
    setColor("Fleet White");
    setMileage("0");
    setRate("0.00");
    setBranch("Central Distribution Center");
    setStatus("Active");
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
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
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
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
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
                <div className="flex items-center gap-2 bg-[#0e0e11] border border-white/5 rounded-lg px-3.5 py-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/10 bg-white shadow-sm flex-shrink-0" />
                  <span className="text-xs text-white font-semibold truncate">{color}</span>
                </div>
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
                      Daily Rental Rate ($)
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

          {/* DOCUMENTATIONS */}
          <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/5 text-brand-cyan flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                Documentations
              </h2>
            </div>

            {/* Photography Dropzones */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                Asset Photography (Front, Side, Back)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["FRONT VIEW", "SIDE VIEW", "BACK VIEW"].map((label) => (
                  <div
                    key={label}
                    className="border border-dashed border-white/10 hover:border-brand-cyan rounded-lg p-5 flex flex-col items-center justify-center gap-2 bg-[#0e0e11] hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <svg className="w-6 h-6 text-gray-500 group-hover:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[9px] font-extrabold tracking-wider text-gray-500 group-hover:text-brand-cyan transition-colors">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Upload Row Items */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                Compliance Documents (PDF Upload)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Registration_Main.pdf", size: "Not uploaded yet" },
                  { name: "Insurance_Policy.pdf", size: "Not uploaded yet" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-[#0e0e11] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center text-brand-red">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white truncate">{doc.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{doc.size}</span>
                      </div>
                    </div>
                    <button type="button" className="text-[10px] font-extrabold text-brand-cyan hover:opacity-85 uppercase tracking-wider cursor-pointer bg-transparent border-0">
                      UPLOAD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 border border-white/5 bg-[#0e0e11] hover:bg-red-950/20 hover:text-brand-red hover:border-brand-red/20 text-gray-400 text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Form
            </button>
            <button className="flex items-center gap-2.5 bg-brand-gradient hover:opacity-90 active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-lg shadow-md transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Vehicle Record
            </button>
          </div>
        </div>

        {/* Right Column: Latest Asset Preview (span 1) */}
        <div>
          <div className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden shadow-md flex flex-col">
            {/* Blue Asset Badge */}
            <div className="bg-brand-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5">
              Latest Fleet Asset
            </div>

            {/* Asset image container with details overlay */}
            <div className="relative h-64 bg-slate-900 overflow-hidden group">
              {/* Actros image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/actros_truck.png"
                alt="Mercedes-Benz Actros 2024"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-black/30 to-transparent" />

              {/* Text overlays on image */}
              <div className="absolute bottom-5 left-5 z-10">
                <span className="bg-brand-gradient text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded mb-1.5 inline-block">
                  Active Asset
                </span>
                <h4 className="text-white text-lg font-black tracking-tight leading-tight">
                  TRK-2024-XP
                </h4>
              </div>
            </div>

            {/* Asset specifications & pricing details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-5">
              <div>
                <h3 className="text-white text-base font-extrabold leading-tight mb-0.5">
                  Mercedes-Benz Actros 2024
                </h3>
                <span className="text-gray-400 text-[10px] font-bold block mb-4">
                  Heavy Duty Logistics Unit • Coastal Logistics Terminal
                </span>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Mileage</span>
                    <span className="text-xs font-black text-white">1,240 km</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Fuel</span>
                    <span className="text-xs font-black text-white">Diesel (Euro 6)</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">Transmission</span>
                    <span className="text-xs font-black text-white">Automatic</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">VIN</span>
                    <span className="text-xs font-black text-white truncate block max-w-[120px]">
                      WDB9634031L...
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-end mt-2">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-500 block">Daily Rate</span>
                  <span className="text-xl font-black text-brand-cyan tracking-tight">$450.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
