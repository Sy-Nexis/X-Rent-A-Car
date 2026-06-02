import React, { useState } from "react";

interface LoginViewProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginView({ onLoginSuccess, onGoToRegister }: LoginViewProps) {
  const [email, setEmail] = useState("m.rossi@fleetcontrol.com");
  const [password, setPassword] = useState("password1234");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 text-slate-800 select-none">
      {/* Container holding card & extra links */}
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Top Header Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2 mb-1">
            {/* Logo Icon */}
            <div className="w-6 h-6 rounded bg-[#0b1220] flex items-center justify-center text-cyan-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
              </svg>
            </div>
            <span className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">FleetControl</span>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Precision Logistics & Fleet Intelligence
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl border-t-[4px] border-t-cyan-400 border-x border-b border-gray-150 shadow-md p-8 mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">System Access</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
            Enter your credentials to manage your fleet assets.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m.rossi@fleetcontrol.com"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[9px] font-black text-cyan-550 hover:text-cyan-600 uppercase tracking-widest"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#0b1220] hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-black uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer mt-6"
            >
              Log In
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Secure Environment Separator */}
          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-[1px] bg-gray-200" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
              Secure Environment
            </span>
            <span className="flex-1 h-[1px] bg-gray-200" />
          </div>

          {/* Warehouse Corridor Image */}
          <div className="w-full h-32 rounded-xl overflow-hidden relative border border-gray-100 shadow-2xs bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/warehouse_corridor.png"
              alt="Secure Environment"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Register Account Link */}
        <button
          onClick={onGoToRegister}
          className="flex items-center gap-2 text-cyan-550 hover:text-cyan-600 text-xs font-black uppercase tracking-widest cursor-pointer mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register Account
        </button>

        {/* Encrypted shield details */}
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wider">
            Standard protocol encrypted connection
          </span>
        </div>

        {/* Copyright */}
        <span className="text-[9px] font-extrabold text-gray-450 tracking-wider">
          © 2024 FLEETCONTROL SYSTEMS INC. ALL RIGHTS RESERVED.
        </span>
      </div>
    </div>
  );
}
