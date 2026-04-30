"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutGrid, Users } from "lucide-react";
import VehicleTable from "./VehicleTable";
import DriverTable from "./DriverTable";
import AddVehicleModal from "./Modals/AddVehicleModal";
import AddDriverModal from "./Modals/AddDriverModal";

type Tab = "vehicles" | "drivers";

export default function TabSwitcher() {
  const [activeTab, setActiveTab] = useState<Tab>("vehicles");
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">System Management</h2>
          <p className="text-text-secondary mt-1">Manage your fleet resources and personnel</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Segmented Control */}
          <div className="bg-bg-surface p-1 rounded-xl border border-border-subtle flex shadow-sm">
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`relative px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "vehicles" ? "text-blue-apple" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === "vehicles" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-apple/5 border border-blue-apple/10 rounded-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <LayoutGrid size={16} className="relative z-10" />
              <span className="relative z-10">Vehicles</span>
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`relative px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "drivers" ? "text-blue-apple" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === "drivers" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-apple/5 border border-blue-apple/10 rounded-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Users size={16} className="relative z-10" />
              <span className="relative z-10">Drivers</span>
            </button>
          </div>

          <button
            onClick={() => activeTab === "vehicles" ? setIsVehicleModalOpen(true) : setIsDriverModalOpen(true)}
            className="px-5 py-2.5 bg-blue-apple text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-apple/20 hover:bg-blue-600 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Add {activeTab === "vehicles" ? "Vehicle" : "Driver"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "vehicles" ? <VehicleTable /> : <DriverTable />}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      {isVehicleModalOpen && (
        <AddVehicleModal 
          onClose={() => setIsVehicleModalOpen(false)} 
        />
      )}
      <AddDriverModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
      />
    </div>
  );
}
