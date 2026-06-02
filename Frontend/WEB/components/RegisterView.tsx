import React, { useState } from "react";

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export default function RegisterView({ onRegisterSuccess, onGoToLogin }: RegisterViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("corporate@fleetcontrol.com");
  const [password, setPassword] = useState("strongPassword123!");
  const [authTier, setAuthTier] = useState<"STAFF" | "ADMIN">("STAFF");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSuccess();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] flex items-center justify-center p-6 text-slate-800 select-none">
      {/* Large Card holding Split Layout */}
      <div className="w-full max-w-[940px] bg-white rounded-2xl border border-gray-150 shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch">
        
        {/* LEFT COLUMN: BRANDING & ILLUSTRATION (Dark navy bg, span 1) */}
        <div className="w-full md:w-1/2 bg-[#0b1220] text-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle mesh background grid details */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div>
              {/* Logo Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
                  </svg>
                </div>
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">FleetControl</span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black tracking-tight leading-tight mb-3">
                Empower your logistics network with real-time precision.
              </h2>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Join the thousands of fleet managers optimizing their operations through our industrial-grade intelligence platform.
              </p>
            </div>

            {/* Truck Row Image */}
            <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/5 shadow-inner bg-slate-900 my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/parked_trucks.png"
                alt="Fleet Grid View"
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Quote block */}
            <div className="bg-[#111c35] border border-white/5 rounded-xl p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                MT
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[10px] text-gray-300 font-semibold italic leading-relaxed">
                  &quot;Standardizing our fleet under FleetControl increased our uptime by 24% in the first quarter.&quot;
                </p>
                <span className="text-[9px] font-black text-cyan-400">
                  Marcus Thorne — Fleet Director
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM (White bg, span 1) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Create Account</h2>
            <p className="text-xs text-gray-500 font-medium mb-6">
              Register for the Precision Logistics Gateway
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First & Last Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-450">
                      👤
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-450">
                      👤
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-455">
                    ✉
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="corporate@fleetcontrol.com"
                    className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-455">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-450 hover:text-slate-700">
                    👁
                  </span>
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-2">
                  <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-emerald-500 h-full w-[68%]" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-[#0694a2] uppercase tracking-wider">
                    <span>Strong Password</span>
                    <span className="text-gray-450">68%</span>
                  </div>
                </div>
              </div>

              {/* Authentication Tier selection */}
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Authentication Tier
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* STAFF */}
                  <button
                    type="button"
                    onClick={() => setAuthTier("STAFF")}
                    className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      authTier === "STAFF"
                        ? "bg-[#e1fcf6] border-cyan-400 text-cyan-800"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span>📇</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider">Staff</span>
                    {authTier === "STAFF" && (
                      <span className="w-4 h-4 rounded-full bg-cyan-400 text-white flex items-center justify-center text-[9px] ml-auto">
                        ✓
                      </span>
                    )}
                  </button>

                  {/* ADMIN */}
                  <button
                    type="button"
                    onClick={() => setAuthTier("ADMIN")}
                    className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      authTier === "ADMIN"
                        ? "bg-[#e0f2fe] border-blue-400 text-blue-800"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span>🛡</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider">Admin</span>
                    {authTier === "ADMIN" && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] ml-auto">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0b1220] hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-black uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer mt-6"
              >
                Register
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>

          {/* Bottom redirection */}
          <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
              Already have a fleet access account?
            </span>
            <button
              onClick={onGoToLogin}
              className="w-full text-center border border-gray-250 bg-white hover:bg-slate-50 text-slate-850 text-xs font-extrabold uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer mb-6"
            >
              Login
            </button>

            {/* Certifications footer */}
            <div className="flex items-center justify-center gap-6 text-gray-400 text-[9px] font-bold uppercase tracking-wider">
              <span>✓ AES-256</span>
              <span>✓ ISO 27001</span>
              <span>✓ 99.9% Uptime</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
