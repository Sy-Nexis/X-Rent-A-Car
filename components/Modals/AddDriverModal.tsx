"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera } from "lucide-react";

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDriverModal({ isOpen, onClose }: AddDriverModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log("Driver Data:", data);
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
                <h2 className="text-xl font-bold text-text-primary">Add New Driver</h2>
                <p className="text-xs text-text-secondary mt-0.5">Register a new fleet operator</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-bg-base transition-colors text-text-secondary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Left: Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-border-subtle flex flex-col items-center justify-center bg-bg-base text-text-secondary hover:bg-bg-base/80 transition-colors cursor-pointer group relative overflow-hidden">
                    <Camera size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase mt-2">Upload Photo</span>
                  </div>
                  <div className="text-[10px] text-text-secondary text-center max-w-[120px]">
                    PNG or JPG up to 5MB
                  </div>
                </div>

                {/* Right: Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">First Name</label>
                    <input
                      {...register("firstName", { required: true })}
                      placeholder="e.g. Amal"
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Last Name</label>
                    <input
                      {...register("lastName", { required: true })}
                      placeholder="e.g. Perera"
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">License Number</label>
                    <input
                      {...register("licenseNumber", { required: true })}
                      placeholder="B1234567"
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Expiry Date</label>
                    <input
                      {...register("expiryDate", { required: true })}
                      type="date"
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Phone Number</label>
                    <input
                      {...register("phoneNumber", { required: true })}
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Assign Vehicle</label>
                    <select
                      {...register("assignedVehicle")}
                      className="w-full px-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm appearance-none"
                    >
                      <option value="">None</option>
                      <option value="XNR-1042">XNR-1042 (Toyota Prius)</option>
                      <option value="XNR-8831">XNR-8831 (Honda Civic)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload License Area */}
              <div className="mb-8">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1 mb-2 block">Upload License Document</label>
                <div className="w-full border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center bg-bg-base/50 hover:bg-bg-base transition-colors cursor-pointer group">
                  <Upload size={24} className="text-text-secondary group-hover:text-blue-apple transition-colors mb-2" />
                  <span className="text-sm font-medium text-text-primary">Drag and drop or click to upload</span>
                  <span className="text-xs text-text-secondary mt-1">PDF, JPG or PNG (max 10MB)</span>
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
                  Register Driver
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
