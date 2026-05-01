"use client";

import React, { useState } from "react";
import TopNav from "./TopNav";
import StatsRow from "./StatsRow";
import LiveFleetMap from "./LiveFleetMap";
import DriverRoster from "./DriverRoster";
import { DriverDetailHero, GPSTracker } from "./DriverInfo";
import ActivityLog from "./ActivityLog";
import { TripsBarChart, FleetStatusDonut, ActiveAlerts } from "./Charts";
import { motion, AnimatePresence } from "framer-motion";

interface MainDashboardClientProps {
  vehicles: any[];
}

export default function MainDashboardClient({ vehicles }: MainDashboardClientProps) {
  // 1. STATE MANAGEMENT
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] || null);

  // 2. DATA CALCULATIONS
  const activeVehicles = vehicles.filter(v => v.status === 'Active' || v.status === 'Available').length;
  const alertsCount = vehicles.filter(v => v.status === 'Maintenance' || v.status === 'Alert').length;
  
  const calculatedStats = [
    {
      title: "Active Vehicles",
      value: activeVehicles.toString(),
      trend: "▲ 3 since yesterday",
      trendColor: "text-green-apple",
      type: 'active'
    },
    {
      title: "Drivers On Duty",
      value: activeVehicles.toString(), // Assuming 1 driver per active vehicle
      trend: "▲ 5 online now",
      trendColor: "text-green-apple",
      type: 'clients'
    },
    {
      title: "km Driven Today",
      value: "1,240",
      trend: "↔ Avg 28.6 km/trip",
      trendColor: "text-text-secondary",
      type: 'fleet'
    },
    {
      title: "Active Alerts",
      value: alertsCount.toString(),
      trend: "▼ 2 critical",
      trendColor: "text-red-apple",
      type: 'alerts'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#1c1c1e]">
      {/* 1. TOP NAVIGATION */}
      <TopNav />

      {/* 2. DASHBOARD WORKSPACE */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 w-full space-y-6">
        
        {/* STAT ROW */}
        <StatsRow customStats={calculatedStats} />

        {/* MAIN SPLIT-PANEL LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: FLEET MONITORING */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
            >
              <LiveFleetMap />
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DriverRoster 
                data={vehicles} 
                onSelect={(v) => setSelectedVehicle(v)} 
                selectedId={selectedVehicle?.id}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: INTELLIGENCE VIEW */}
          <div className="xl:col-span-4 flex flex-col gap-6">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedVehicle?.id || 'empty'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <DriverDetailHero vehicle={selectedVehicle} />
                  <GPSTracker vehicle={selectedVehicle} />
                  <ActivityLog vehicle={selectedVehicle} />
                </motion.div>
             </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM CHARTS & ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
           <TripsBarChart />
           <FleetStatusDonut vehicles={vehicles} />
           <ActiveAlerts />
        </div>

      </main>

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed top-0 right-0 w-[1200px] h-[1200px] bg-blue-600/[0.02] blur-[200px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-900/[0.01] blur-[150px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
