"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { setCookie } from "@/lib/cookies";

interface LoginViewProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginView({ onLoginSuccess, onGoToRegister }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Fallback check against backend API if user was created via backend staff table
        try {
          const res = await fetch("http://localhost:8801/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          });
          const resData = await res.json();
          if (res.ok && resData.token) {
            setCookie("token", resData.token, 1);
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(resData.user));
              localStorage.setItem("token", resData.token);
            }
            onLoginSuccess();
            return;
          }
        } catch {
          // Backend fallback failed, proceed with Supabase error
        }

        setErrorMessage(error.message || "Invalid login credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        // Store access token in cookie and localStorage
        setCookie("token", data.session.access_token, 1);
        if (typeof window !== "undefined") {
          localStorage.setItem("supabase_token", data.session.access_token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              role: data.user.user_metadata?.role || "Admin",
            })
          );
        }
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("Login unexpected error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-white select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-[420px] flex flex-col items-center relative z-10">

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

        {/* Login Card */}
        <div className="w-full bg-brand-dark-card border border-white/5 rounded-2xl shadow-2xl p-8 mb-6 backdrop-blur-md">
          <h2 className="text-lg font-black text-white tracking-tight mb-1">System Access</h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
            Enter your credentials to manage your fleet assets.
          </p>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-cyan transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@xrent.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:border-brand-cyan/40 focus:outline-none transition-all placeholder:text-gray-600"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-cyan transition-colors">
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
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white cursor-pointer transition-colors"
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
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group btn-shimmer w-full flex items-center justify-center gap-2 bg-brand-gradient hover:opacity-90 active:scale-[0.99] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all cursor-pointer mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Log In
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Connected badge */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">
              Supabase Auth Connected
            </span>
          </div>
        </div>

        {/* Register Link */}
        <button
          onClick={onGoToRegister}
          className="group flex items-center gap-2 text-brand-cyan hover:opacity-75 text-xs font-black uppercase tracking-widest cursor-pointer mb-8 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register Account
        </button>

        {/* Encrypted shield line */}
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wider">
            Standard protocol encrypted connection
          </span>
        </div>

        {/* Copyright */}
        <span className="text-[9px] font-extrabold text-gray-600 tracking-wider">
          © {new Date().getFullYear()} X RENT A CAR. ALL RIGHTS RESERVED.
        </span>
      </div>
    </div>
  );
}
