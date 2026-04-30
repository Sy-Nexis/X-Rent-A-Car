"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { addVehicle } from '@/actions/vehicleActions';
import ImageUploader from './ImageUploader';

export default function AddVehicleForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    const result = await addVehicle(formData);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.error || 'Failed to add vehicle');
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-xl shadow-black/5 border border-gray-200/50 dark:border-white/5 overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10">
          {/* Section A: Basic Identification */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-[#6e6e73] uppercase tracking-widest mb-6">Basic Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Make</label>
                <input
                  {...register('make', { required: 'Make is required' })}
                  placeholder="e.g. Toyota"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent transition-all outline-none text-sm focus:bg-white dark:focus:bg-[#1c1c1e] ${
                    errors.make ? 'border-red-500/50' : 'focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Model</label>
                <input
                  {...register('model', { required: 'Model is required' })}
                  placeholder="e.g. Prius"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent transition-all outline-none text-sm focus:bg-white dark:focus:bg-[#1c1c1e] ${
                    errors.model ? 'border-red-500/50' : 'focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Year</label>
                <input
                  {...register('year', { required: 'Year is required', min: 1900, max: 2100 })}
                  type="number"
                  placeholder="2024"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent transition-all outline-none text-sm focus:bg-white dark:focus:bg-[#1c1c1e] ${
                    errors.year ? 'border-red-500/50' : 'focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-white/5 mb-10" />

          {/* Section B: Registration & Specs */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-[#6e6e73] uppercase tracking-widest mb-6">Registration & Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">License Plate</label>
                <input
                  {...register('licensePlate', { 
                    required: 'Plate is required',
                    pattern: {
                      value: /^[A-Z0-9 -]+$/i,
                      message: 'Invalid plate format'
                    }
                  })}
                  placeholder="e.g. CBA-9921"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent transition-all outline-none text-sm focus:bg-white dark:focus:bg-[#1c1c1e] uppercase ${
                    errors.licensePlate ? 'border-red-500/50' : 'focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Initial Mileage (km)</label>
                <input
                  {...register('mileage', { required: 'Mileage is required' })}
                  type="number"
                  placeholder="0"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent transition-all outline-none text-sm focus:bg-white dark:focus:bg-[#1c1c1e] ${
                    errors.mileage ? 'border-red-500/50' : 'focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fuel Type</label>
                <select
                  {...register('fuelType', { required: 'Fuel type is required' })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select Fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Transmission</label>
                <select
                  {...register('transmission', { required: 'Transmission is required' })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-lg border-2 border-transparent focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select Gearbox</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Uploader Component */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-[#6e6e73] uppercase tracking-widest mb-6">Vehicle Photos</h3>
            <ImageUploader />
          </div>

          {/* Action Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              className="text-sm font-semibold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              Cancel Registration
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Adding to Fleet...</span>
                </>
              ) : (
                'Add Vehicle to Fleet'
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/20"
          >
            <CheckCircle2 size={24} />
            <div>
              <p className="font-bold">Vehicle Registered</p>
              <p className="text-xs opacity-90">The vehicle is now active in the system.</p>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/20"
          >
            <AlertCircle size={24} />
            <div>
              <p className="font-bold">Registration Failed</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
