import React, { useState } from "react";

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export default function RegisterView({ onRegisterSuccess, onGoToLogin }: RegisterViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authTier, setAuthTier] = useState<"STAFF" | "ADMIN">("STAFF");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSuccess();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6 text-slate-800 select-none">
      <div className="w-full max-w-[460px] flex flex-col items-center">
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

        {/* Registration Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-150 shadow-md p-8 mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Create Account</h2>
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
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
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
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@fleetcontrol.com"
                  className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
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
                  className="w-full bg-[#f1f5f9]/70 border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-850 focus:bg-white focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-400"
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
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${authTier === "STAFF"
                      ? "bg-[#e0f2fe] border-blue-400 text-blue-800"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider">Staff</span>
                  {authTier === "STAFF" && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] ml-auto">
                      ✓
                    </span>
                  )}
                </button>

                {/* ADMIN */}
                <button
                  type="button"
                  onClick={() => setAuthTier("ADMIN")}
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${authTier === "ADMIN"
                      ? "bg-[#e0f2fe] border-blue-400 text-blue-800"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                >
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

        {/* Login Account Link */}
        <button
          onClick={onGoToLogin}
          className="group flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest cursor-pointer mt-4 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>
            Already have an account?{" "}
            <span className="text-gray-400 group-hover:text-blue-500 transition-colors">Login</span>
          </span>
        </button>

        {/* Certifications footer */}
        <div className="flex items-center justify-center gap-6 text-gray-400 text-[9px] font-bold uppercase tracking-wider">
          <span>✓ AES-256</span>
          <span>✓ ISO 27001</span>
          <span>✓ 99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
}
