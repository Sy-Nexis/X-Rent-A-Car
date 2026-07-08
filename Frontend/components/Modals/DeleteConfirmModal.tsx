"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle, Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  vehicleLabel: string;
  vehiclePlate: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  vehicleLabel,
  vehiclePlate,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-white/5"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <Trash2 size={24} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-[#6e6e73]"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">
                Delete this vehicle?
              </h2>
              <p className="text-[#6e6e73] text-sm leading-relaxed mb-6">
                You are about to remove <span className="font-bold text-[#1d1d1f] dark:text-white">{vehicleLabel}</span> ({vehiclePlate}) from the fleet registry. This action cannot be undone.
              </p>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl mb-8 border border-gray-200/50 dark:border-white/5">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <span className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Real-time sync will remove this from tracking.
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm bg-gray-100 dark:bg-white/5 text-[#1d1d1f] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  onClick={onConfirm}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm bg-[#ff453a] text-white hover:bg-[#ff3b30] transition-all active:scale-95 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
