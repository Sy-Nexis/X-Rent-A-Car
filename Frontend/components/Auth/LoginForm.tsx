"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle, Car, ArrowRight } from "lucide-react";
import { setCookie } from "@/lib/cookies";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/Admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    console.log("LOGIN_ATTEMPT: Initiating login request...");

    try {
      const response = await fetch("http://localhost:8801/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("LOGIN_NON_JSON_RESPONSE:", text);
        result = { message: `Server responded with non-JSON content (${response.status})` };
      }

      if (!response.ok) {
        console.error("LOGIN_ERROR_STATUS:", response.status);
        console.error("LOGIN_ERROR_RESPONSE:", result);
        throw new Error(result.message || result.detail || `Authentication failed (Status ${response.status})`);
      }

      console.log("LOGIN_SUCCESS: Initializing Session...");

      // SUCCESS: Set secure cookie using internal utility
      setCookie("xrent_token", result.token, 0.5); // 12 hours

      // Save user info for UI (optional but helpful)
      localStorage.setItem("xrent_user", JSON.stringify(result.user));

      // Always redirect to the Summary Dashboard (Root) after login
      window.location.href = "/";

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: error ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.6, x: { duration: 0.4 } }}
        className="bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 max-w-md w-full shadow-2xl relative z-10"
      >
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
            <Car size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tighter text-white">xrent <span className="text-blue-500">CAR</span></h1>
            <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em] mt-1">Authorized Access Only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* EMAIL */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest block ml-1">Email Terminal</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                {...register("email", { required: "Identity required" })}
                type="email"
                placeholder="admin@xrent.com"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm placeholder:text-[#424245] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide ml-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Security Key</label>
              <button type="button" className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot Key?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                {...register("password", { required: "Encryption key required" })}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm placeholder:text-[#424245] focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide ml-1">{errors.password.message}</p>}
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center gap-3 px-1">
            <input
              {...register("remember")}
              type="checkbox"
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Trust this workstation</span>
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  Initialize Session
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* ERROR FEEDBACK */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
            >
              <AlertCircle size={18} />
              <p className="text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-center relative z-10"
      >
        <Link href="/register" className="text-[10px] font-black text-[#6e6e73] hover:text-white uppercase tracking-widest transition-colors">
          New personnel? <span className="text-blue-500">Register account</span>
        </Link>
      </motion.div>

      <p className="mt-12 text-[9px] font-black text-[#424245] uppercase tracking-[0.5em] relative z-10">
        System V4.0 // Secured by xrent Core
      </p>
    </div>
  );
}
