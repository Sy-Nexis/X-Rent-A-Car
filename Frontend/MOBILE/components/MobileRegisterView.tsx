"use client";

import React, { useState } from "react";
import { Truck, Mail, Lock, Eye, EyeOff, ShieldCheck, User } from "lucide-react";

interface MobileRegisterViewProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export default function MobileRegisterView({
  onRegisterSuccess,
  onGoToLogin,
}: MobileRegisterViewProps) {
  const [authTier, setAuthTier] = useState<string>("STAFF");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col justify-start gap-y-5 overflow-y-auto custom-scrollbar bg-[#fcf9f9] p-5 pb-8">
      <div className="flex flex-col items-center text-center mt-2 select-none">
        <span className="font-serif text-[#0f172a] text-5xl tracking-wide flex items-center leading-none mb-1">
          ne
          <span className="font-serif text-[#0f172a] text-6xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
          us
        </span>
        <span className="text-[8.5px] font-bold tracking-wider text-gray-400 uppercase">
          Powered by X Rent A Car
        </span>
      </div>

      {/* Welcome / Create Account headers */}
      <div className="text-center mt-2">
        <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
          Create Account
        </h2>
        <p className="text-[9.5px] font-bold text-[#64748b] mt-0.5">
          Register for the Precision Logistics Gateway
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3 text-[9px] font-extrabold text-[#475569]">
          <div className="space-y-1">
            <label className="uppercase tracking-wider">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1 text-[9px] font-extrabold text-[#475569]">
          <label className="uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="j.doe@fleetflow.com"
              className="w-full pl-9 pr-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f152a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
        </div>

        {/* Secure Password */}
        <div className="space-y-1 text-[9px] font-extrabold text-[#475569]">
          <label className="uppercase tracking-wider">Secure Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-9 pr-10 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength indicator */}
        <div className="space-y-1.5">
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-[#10b981] rounded-full" />
            <div className="h-1 flex-1 bg-[#10b981] rounded-full" />
            <div className="h-1 flex-1 bg-[#10b981] rounded-full" />
            <div className="h-1 flex-1 bg-[#e2e8f0] rounded-full" />
          </div>
          <div className="flex items-center gap-1 text-[#10b981] text-[8px] font-extrabold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            Strong security compliance
          </div>
        </div>

        {/* Authentication Tier Selection */}
        <div className="space-y-1 text-[9px] font-extrabold text-[#475569]">
          <label className="uppercase tracking-wider">Authentication Tier</label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* STAFF Button */}
            <button
              onClick={() => setAuthTier("STAFF")}
              type="button"
              className={`py-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${authTier === "STAFF"
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                : "border-[#cbd5e1] bg-white text-[#64748b] hover:bg-slate-50"
                }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-wider">Staff</span>
            </button>

            {/* ADMIN Button */}
            <button
              onClick={() => setAuthTier("ADMIN")}
              type="button"
              className={`py-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${authTier === "ADMIN"
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                : "border-[#cbd5e1] bg-white text-[#64748b] hover:bg-slate-50"
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider">Admin</span>
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={onRegisterSuccess}
          className="w-full bg-[#2563eb] text-white text-[9.5px] font-extrabold py-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all hover:bg-blue-700 uppercase tracking-widest mt-2"
        >
          Register
          <svg className="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Already registered */}
      <div className="text-center mt-auto pt-6 space-y-2">
        <p className="text-[10px] font-bold text-[#64748b]">
          Already registered with the fleet?
        </p>
        <button
          onClick={onGoToLogin}
          className="w-full bg-white border border-[#cbd5e1] text-[#0f172a] text-[10px] font-black py-3 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
        >
          Login
        </button>
      </div>
    </div>
  );
}
