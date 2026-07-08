"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilLine } from "lucide-react";
import EditVehicleForm from "./EditVehicleForm";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  dailyRate: number;
  status: string;
  fuelType: string;
  transmission: string;
  engineCapacity?: string;
  color?: string;
  mileage?: number;
  branch?: string;
}

interface UpdateVehicleActionProps {
  vehicle: Vehicle;
  onActionComplete?: () => void;
}

export default function UpdateVehicleAction({ vehicle, onActionComplete }: UpdateVehicleActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onActionComplete) onActionComplete();
  };

  return (
    <>
      {/* TRIGGER BUTTON (This will be used inside the dropdown) */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all group"
      >
        <PencilLine size={16} className="text-blue-500 group-hover:rotate-12 transition-transform" />
        Edit Details
      </button>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5"
            >
              <EditVehicleForm vehicle={vehicle} onClose={handleClose} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
