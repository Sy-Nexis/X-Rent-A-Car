"use client";

import React from "react";
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EmptyFleet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#2c2c2e] rounded-3xl border border-gray-200/50 dark:border-white/5 p-20 flex flex-col items-center justify-center text-center shadow-sm"
    >
      <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-8">
        <Car size={48} />
      </div>
      <h3 className="text-2xl font-bold mb-3">No Vehicles in Inventory</h3>
      <p className="text-[#6e6e73] max-w-sm mx-auto text-sm leading-relaxed mb-10">
        Your fleet registry is currently empty. Start building your tracking system by registering your first vehicle.
      </p>

      <Link href="/Admin/vehicle/data">
        <button className="px-8 py-4 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Plus size={20} />
          Register First Vehicle
        </button>
      </Link>
    </motion.div>
  );
}
