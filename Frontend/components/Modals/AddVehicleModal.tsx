"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Info } from "lucide-react";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log("Vehicle Data:", data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-surface rounded-2xl shadow-2xl overflow-hidden border border-border-subtle"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle bg-bg-surface">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Add New Vehicle</h2>
                <p className="text-xs text-text-secondary mt-0.5">Enter fleet vehicle specifications</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Make</label>
                  <input
                    {...register("make", { required: true })}
                    placeholder="e.g. Toyota"
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Model</label>
                  <input
                    {...register("model", { required: true })}
                    placeholder="e.g. Prius"
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Year</label>
                  <input
                    {...register("year", { required: true })}
                    placeholder="2024"
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">License Plate</label>
                  <input
                    {...register("licensePlate", { required: true })}
                    placeholder="WP AAA-1234"
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Initial Mileage (km)</label>
                  <input
                    {...register("mileage", { required: true })}
                    placeholder="0"
                    type="number"
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Fuel Type</label>
                  <select
                    {...register("fuelType", { required: true })}
                    className="w-full px-4 py-2.5 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm appearance-none"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end pt-6 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:bg-bg-base transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-apple hover:bg-blue-600 transition-all shadow-lg shadow-blue-apple/20 active:scale-[0.98]"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
