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
    <div className="w-full min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-white select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.07)_0%,transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-[460px] flex flex-col items-center relative z-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center select-none">
          <span className="font-serif text-white text-5xl tracking-wide flex items-center leading-none mb-1.5">
            ne
            <span className="font-serif text-white text-6xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
            us
          </span>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Powered by X Rent A Car
          </span>
        </div>

        {/* Registration Card */}
        <div className="w-full bg-brand-dark-card border border-white/5 rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-black text-white tracking-tight mb-1">Create Account</h2>
          <p className="text-xs text-gray-400 font-medium mb-6">
            Register for the Precision Logistics Gateway
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  First Name
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-brand-cyan transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:border-brand-cyan/40 focus:outline-none transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Last Name
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-brand-cyan transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:border-brand-cyan/40 focus:outline-none transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-brand-cyan transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@fleetcontrol.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:border-brand-cyan/40 focus:outline-none transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-brand-cyan transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-10 py-2.5 text-xs font-semibold text-white focus:border-brand-cyan/40 focus:outline-none transition-all placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-600 hover:text-white cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1">
                  <div className="h-full w-[68%]" style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }} />
                </div>
                <div className="flex justify-between items-center text-[9px] font-extrabold text-brand-cyan uppercase tracking-wider">
                  <span>Strong Password</span>
                  <span className="text-gray-500">68%</span>
                </div>
              </div>
            </div>

            {/* Authentication Tier */}
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                Authentication Tier
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* STAFF */}
                <button
                  type="button"
                  onClick={() => setAuthTier("STAFF")}
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                    authTier === "STAFF"
                      ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan"
                      : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider">Staff</span>
                  {authTier === "STAFF" && (
                    <span className="w-4 h-4 rounded-full bg-brand-gradient text-white flex items-center justify-center text-[9px] ml-auto"
                      style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* ADMIN */}
                <button
                  type="button"
                  onClick={() => setAuthTier("ADMIN")}
                  className={`flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                    authTier === "ADMIN"
                      ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan"
                      : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider">Admin</span>
                  {authTier === "ADMIN" && (
                    <span className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] ml-auto"
                      style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group btn-shimmer w-full flex items-center justify-center gap-2 bg-brand-gradient hover:opacity-90 active:scale-[0.99] text-white text-xs font-black uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer mt-6"
            >
              Register
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Login Link */}
        <button
          onClick={onGoToLogin}
          className="group flex items-center gap-2 text-gray-400 hover:text-brand-cyan text-xs font-black uppercase tracking-widest cursor-pointer mt-4 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 group-hover:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>
            Already have an account?{" "}
            <span className="text-brand-cyan">Login</span>
          </span>
        </button>

        {/* Certifications footer */}
        <div className="flex items-center justify-center gap-6 text-gray-600 text-[9px] font-bold uppercase tracking-wider">
          <span>&#10003; AES-256</span>
          <span>&#10003; ISO 27001</span>
          <span>&#10003; 99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
}
