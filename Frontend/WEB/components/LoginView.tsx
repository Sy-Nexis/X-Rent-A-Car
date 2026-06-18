import React, { useState } from "react";

interface LoginViewProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginView({ onLoginSuccess, onGoToRegister }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 text-slate-800 select-none">
      {/* Container holding card & extra links */}
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Top Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center select-none">
          <span className="font-serif text-black text-5xl tracking-wide flex items-center leading-none mb-1.5">
            ne
            <span className="font-serif text-black text-6xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
            us
          </span>
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Powered by X Rent A Car
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-150 shadow-md p-8 mb-6">
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
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
