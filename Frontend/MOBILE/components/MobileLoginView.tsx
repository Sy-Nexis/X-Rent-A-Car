"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";

interface MobileLoginViewProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function MobileLoginView({
  onLoginSuccess,
  onGoToRegister,
}: MobileLoginViewProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-[#fafafa] p-5 pb-6">
      
      {/* Centered Logo Label */}
      <div className="text-center mt-2">
        <span className="text-[11px] font-black tracking-[0.2em] text-[#0f172a] uppercase font-mono">
          FleetFlow
        </span>
      </div>

      {/* Decorative top warehouse image */}
      <div className="w-full h-24 rounded-xl overflow-hidden mt-4 relative border border-[#e2e8f0]">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&h=150"
          alt="Warehouse operations background"
          className="w-full h-full object-cover filter grayscale opacity-90 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafafa] opacity-50" />
      </div>

      {/* Welcome headers */}
      <div className="text-center mt-4">
        <h2 className="text-base font-extrabold text-[#0f172a] tracking-tight">
          Welcome back
        </h2>
        <p className="text-[9.5px] font-bold text-[#64748b] mt-0.5">
          Access your fleet operations center
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4 space-y-4 mt-4">
        {/* Email Address */}
        <div className="space-y-1 text-[9px] font-bold text-[#475569]">
          <label className="uppercase tracking-wider font-extrabold">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              defaultValue="manager@fleetflow.com"
              className="w-full pl-9 pr-3 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1 text-[9px] font-bold text-[#475569]">
          <div className="flex justify-between items-center">
            <label className="uppercase tracking-wider font-extrabold">Password</label>
            <a href="#" className="text-blue-600 font-extrabold lowercase hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              defaultValue="password"
              className="w-full pl-9 pr-10 py-2 border border-[#cbd5e1] rounded-lg text-[#0f172a] outline-none focus:border-blue-500 font-bold bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={onLoginSuccess}
          className="w-full bg-[#2563eb] text-white text-[10px] font-extrabold py-3 rounded-lg shadow-md transition-all hover:bg-blue-700 uppercase tracking-widest mt-2"
        >
          Log In
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-[#e2e8f0]"></div>
        <span className="flex-shrink mx-3 text-[8.5px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
          New to FleetFlow?
        </span>
        <div className="flex-grow border-t border-[#e2e8f0]"></div>
      </div>

      {/* Register Account Button */}
      <button
        onClick={onGoToRegister}
        className="w-full bg-white border border-[#cbd5e1] text-[#0f172a] text-[10px] font-black py-3 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
      >
        Register Account
      </button>

      {/* Security note and Copyright Footer */}
      <div className="text-center space-y-3 mt-6">
        <div className="flex justify-center items-center gap-1.5 text-[8.5px] font-extrabold text-[#10b981]">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Enterprise-grade security protocol active
        </div>
        <p className="text-[8.5px] font-extrabold text-[#94a3b8]">
          © 2024 FleetFlow Logistics. All rights reserved.
        </p>
      </div>
    </div>
  );
}
