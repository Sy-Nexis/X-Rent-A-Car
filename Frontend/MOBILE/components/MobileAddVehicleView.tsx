"use client";

import React, { useState } from "react";
import { Info, Gauge, DollarSign, FileCode, Upload, FileText, ChevronDown, Plus } from "lucide-react";

interface MobileAddVehicleViewProps {
  onRegisterSuccess?: () => void;
}

export default function MobileAddVehicleView({ onRegisterSuccess }: MobileAddVehicleViewProps) {
  const [initialStatus, setInitialStatus] = useState<string>("Active");

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 space-y-4 pb-20">
      
      {/* Title block */}
      <div>
        <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
          Add New Fleet Vehicle
        </h2>
        <p className="text-[10px] font-bold text-[#64748b] leading-tight mt-1 max-w-[280px]">
          Register a new asset into the FleetFlow ecosystem with comprehensive technical and financial details.
        </p>
      </div>

      {/* SECTION 1: CORE IDENTIFICATION */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
              Core Identification
            </span>
          </div>
          <span className="text-[8px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
            Section 1 of 4
          </span>
        </div>

        {/* Input Fields */}
        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Brand</label>
            <input
              type="text"
              placeholder="e.g. Mercedes-Benz"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Model</label>
            <input
              type="text"
              placeholder="e.g. Sprinter 314"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Year</label>
            <input
              type="text"
              placeholder="2024"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">VIN (Vehicle Identification Number)</label>
            <input
              type="text"
              placeholder="17-character alphanumeric code"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">License Plate</label>
            <input
              type="text"
              placeholder="ABC-1234"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: TECHNICAL SPECIFICATION */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2 text-[#2563eb]">
            <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
              Technical Specification
            </span>
          </div>
          <span className="text-[8px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
            Section 2 of 4
          </span>
        </div>

        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Transmission</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white appearance-none">
                <option>Automatic</option>
                <option>Manual</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Fuel Type</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white appearance-none">
                <option>Diesel</option>
                <option>Petrol</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Capacity (kWh/cc)</label>
            <input
              type="text"
              placeholder="e.g. 75 KWh"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Color</label>
            <input
              type="text"
              placeholder="Obsidian Black"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Mileage (KM)</label>
            <input
              type="text"
              placeholder="0"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: FINANCIALS */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9] text-[#2563eb]">
          <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            Financials
          </span>
        </div>

        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Daily Rental Rate</label>
            <input
              type="text"
              placeholder="$ 0.00"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Assigned Branch</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white appearance-none">
                <option>Central Hub - NYC</option>
                <option>East Side Hub - Brooklyn</option>
                <option>West Side Hub - Jersey</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Initial Status List */}
          <div className="space-y-2 mt-2">
            <label className="uppercase tracking-wider">Initial Status</label>
            
            {/* Active option */}
            <label className="flex items-center justify-between p-2.5 border border-[#e2e8f0] rounded-lg cursor-pointer bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="initialStatus"
                  checked={initialStatus === "Active"}
                  onChange={() => setInitialStatus("Active")}
                  className="w-3.5 h-3.5 text-blue-600 outline-none"
                />
                <span className="text-[10px] font-black text-[#0f172a]">Active</span>
              </div>
              <span className="text-[7px] font-black text-[#10b981] bg-[#e8fbf4] border border-[#d1fae5] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Ready
              </span>
            </label>

            {/* InPrep option */}
            <label className="flex items-center justify-between p-2.5 border border-[#e2e8f0] rounded-lg cursor-pointer bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="initialStatus"
                  checked={initialStatus === "InPrep"}
                  onChange={() => setInitialStatus("InPrep")}
                  className="w-3.5 h-3.5 text-blue-600 outline-none"
                />
                <span className="text-[10px] font-black text-[#0f172a]">In-Prep</span>
              </div>
              <span className="text-[7px] font-black text-[#d97706] bg-[#fef3c7] border border-[#fde68a] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Pending
              </span>
            </label>

            {/* Maintenance option */}
            <label className="flex items-center justify-between p-2.5 border border-[#e2e8f0] rounded-lg cursor-pointer bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="initialStatus"
                  checked={initialStatus === "Maintenance"}
                  onChange={() => setInitialStatus("Maintenance")}
                  className="w-3.5 h-3.5 text-blue-600 outline-none"
                />
                <span className="text-[10px] font-black text-[#0f172a]">Maintenance</span>
              </div>
              <span className="text-[7px] font-black text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Down
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4: DOCUMENTATIONS */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9] text-[#2563eb]">
          <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
            <FileCode className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            Documentations
          </span>
        </div>

        {/* Photos Drop Slots */}
        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-wider block">
              Vehicle Photos
            </label>
            <span className="text-[7.5px] font-bold text-[#94a3b8] block -mt-0.5">
              Minimum 3 angles required (Front, Side, Rear)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {["FRONT VIEW", "SIDE VIEW", "REAR VIEW"].map((angle) => (
              <div
                key={angle}
                className="border-2 border-dashed border-[#e2e8f0] rounded-xl py-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#94a3b8] mb-1.5" />
                <span className="text-[8px] font-black text-[#64748b] tracking-widest">{angle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Document Uploads */}
        <div className="space-y-2.5">
          <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-wider block">
            Official Paperwork (PDF)
          </label>

          {/* Vehicle Registration */}
          <div className="border border-[#e2e8f0] rounded-xl p-3 flex justify-between items-center bg-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-[#1e293b] leading-tight truncate">
                  Vehicle_Registration.pdf
                </span>
                <span className="text-[7.5px] font-bold text-[#94a3b8]">Not uploaded</span>
              </div>
            </div>
            <button className="text-[#2563eb] p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Insurance Policy */}
          <div className="border border-[#e2e8f0] rounded-xl p-3 flex justify-between items-center bg-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-[#1e293b] leading-tight truncate">
                  Insurance_Policy.pdf
                </span>
                <span className="text-[7.5px] font-bold text-[#94a3b8]">Not uploaded</span>
              </div>
            </div>
            <button className="text-[#2563eb] p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 bg-white border border-[#cbd5e1] text-[#475569] text-[9.5px] font-extrabold py-3.5 rounded-lg transition-all hover:bg-slate-50 uppercase tracking-wider text-center"
        >
          Clear Form
        </button>
        <button
          onClick={onRegisterSuccess}
          type="button"
          className="flex-1 bg-[#2563eb] text-white text-[9.5px] font-extrabold py-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all hover:bg-blue-700 active:scale-95 uppercase tracking-wider text-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" />
          Register Vehicle
        </button>
      </div>
    </div>
  );
}
