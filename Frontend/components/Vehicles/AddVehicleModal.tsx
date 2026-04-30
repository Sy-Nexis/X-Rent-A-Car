"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { addVehicle } from "@/actions/vehicleActions";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate natural delay for UX
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value as string));

    const result = await addVehicle(formData);

    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 1500);
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#2c2c2e] rounded-[32px] shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Register New Vehicle</h3>
                <p className="text-xs text-[#6e6e73] font-medium uppercase tracking-widest mt-1">
                  Fleet Expansion · Data Input
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-[#6e6e73]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            {isSuccess ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h4 className="text-lg font-bold">Successfully Added!</h4>
                <p className="text-sm text-[#6e6e73]">The vehicle is now part of the active fleet.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Make</label>
                    <input
                      {...register("make", { required: true })}
                      placeholder="e.g. Toyota"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Model</label>
                    <input
                      {...register("model", { required: true })}
                      placeholder="e.g. Prius"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Year</label>
                    <input
                      {...register("year", { required: true })}
                      type="number"
                      placeholder="2024"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">License Plate</label>
                    <input
                      {...register("licensePlate", { required: true })}
                      placeholder="ABC-1234"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Mileage (KM)</label>
                    <input
                      {...register("mileage", { required: true })}
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest ml-1">Fuel Type</label>
                    <select
                      {...register("fuelType", { required: true })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Complete Registration"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
