"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Car
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "Staff"
    }
  });

  const password = watch("password", "");

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8801/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error("Critical Server Failure: Invalid Response");
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || "Registry Synchronization Failed");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 bg-[#1c1c1e] -z-20" />
      <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#2c2c2e]/50 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 max-w-lg w-full shadow-2xl relative z-10"
      >
        {/* LOGO AREA */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
            <Car size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tighter text-white">SYSTEM <span className="text-blue-500">ONBOARDING</span></h1>
            <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em] mt-1">Personnel Registry Protocol</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME ROW */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#98989d] uppercase tracking-widest block ml-1">First Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  {...register("first_name", { required: "Required" })}
                  placeholder="John"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#98989d] uppercase tracking-widest block ml-1">Last Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  {...register("last_name", { required: "Required" })}
                  placeholder="Doe"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* EMAIL */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black text-[#98989d] uppercase tracking-widest block ml-1">Email Terminal</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                {...register("email", {
                  required: "Identity required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                type="email"
                placeholder="admin@xrent.com"
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
              />
            </div>
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide ml-1">{errors.email.message}</p>}
          </motion.div>

          {/* PASSWORD & STRENGTH */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black text-[#98989d] uppercase tracking-widest block ml-1">Encryption Key</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                {...register("password", { required: "Security key required", minLength: { value: 8, message: "Min 8 chars" } })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-5 pl-14 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#424245] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength Meter */}
            <div className="mt-3 flex gap-1 h-1 px-1">
              {[25, 50, 75, 100].map((step) => (
                <div
                  key={step}
                  className={`flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= step ? 'bg-blue-500' : 'bg-white/5'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* ROLE SELECTION */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black text-[#98989d] uppercase tracking-widest block ml-1">Authorization Tier</label>
            <div className="relative">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-[#424245]" size={18} />
              <select
                {...register("role")}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer"
              >
                <option value="Staff" className="bg-[#1c1c1e]">Staff Terminal</option>
                <option value="Manager" className="bg-[#1c1c1e]">Fleet Manager</option>
                <option value="Admin" className="bg-[#1c1c1e]">SuperAdmin</option>
              </select>
            </div>
          </motion.div>

          {/* SUBMIT */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              disabled={isLoading || isSuccess}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Synchronizing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  Account Ready
                </>
              ) : (
                <>
                  Initialize Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* FEEDBACK OVERLAYS */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
            >
              <AlertCircle size={18} />
              <p className="text-[10px] font-bold uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#2c2c2e] rounded-[40px] flex flex-col items-center justify-center text-center p-12 z-50"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-600/40">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Registration Complete</h3>
              <p className="text-[#86868b] text-sm font-medium">Your credentials have been securely stored. Redirecting to login terminal...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <Link href="/login" className="text-[10px] font-black text-[#6e6e73] hover:text-white uppercase tracking-widest transition-colors">
            Already have an account? <span className="text-blue-500">Log in</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
