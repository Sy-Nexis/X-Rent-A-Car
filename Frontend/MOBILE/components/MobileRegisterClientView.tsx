"use client";

import React from "react";
import { User, MapPin, UserPlus } from "lucide-react";

interface MobileRegisterClientViewProps {
  onRegisterSuccess: () => void;
}

export default function MobileRegisterClientView({
  onRegisterSuccess,
}: MobileRegisterClientViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 space-y-4 pb-20">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
          Add New Client
        </h2>
        <p className="text-[10px] font-bold text-[#64748b] leading-tight mt-1 max-w-[280px]">
          Register a new client into the FleetFlow ecosystem. Please ensure all information is accurate for operational compliance.
        </p>
      </div>

      {/* SECTION 1: PERSONAL INFORMATION */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9] text-[#2563eb]">
          <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            Personal Information
          </span>
        </div>

        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">First Name</label>
            <input
              type="text"
              placeholder="e.g. John"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Last Name</label>
            <input
              type="text"
              placeholder="e.g. Doe"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="john.doe@enterprise.com"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
            <span className="text-[7.5px] font-bold text-[#94a3b8] italic block">
              Client communication will be sent to this address.
            </span>
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Phone</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">NIC Number</label>
            <input
              type="text"
              placeholder="National Identification Card Number"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
            <span className="text-[7.5px] font-bold text-[#94a3b8] italic block">
              Enter unique identifier for compliance verification.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: RESIDENTIAL INFORMATION */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9] text-[#2563eb]">
          <div className="w-6 h-6 rounded-lg bg-[#eff6ff] flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            Residential Information
          </span>
        </div>

        <div className="space-y-2.5 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Street Address</label>
            <input
              type="text"
              placeholder="123 Logistics Way, Suite 400"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">City</label>
            <input
              type="text"
              placeholder="e.g. San Francisco"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">State</label>
            <input
              type="text"
              placeholder="e.g. CA"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Zip/Postal Code</label>
            <input
              type="text"
              placeholder="94105"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
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
          <UserPlus className="w-4 h-4 stroke-[2.5px]" />
          Register Client
        </button>
      </div>
    </div>
  );
}
