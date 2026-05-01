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

interface AdminFleetClientProps {
  initialVehicles: any[];
  initialClients: any[];
}

export default function AdminFleetClient({ initialVehicles, initialClients }: AdminFleetClientProps) {
  // 1. STATE MANAGEMENT
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicles[0] || null);

  // 2. DATA CALCULATIONS (for Stat Cards & Charts)
  const totalVehicles = initialVehicles.length;
  const activeVehicles = initialVehicles.filter(v => v.status === 'Active' || v.status === 'Available').length;
  const alertsCount = initialVehicles.filter(v => v.status === 'Maintenance' || v.status === 'In Prep').length;
  
  // Custom stats for the Stat Cards
  const calculatedStats = [
    {
      title: "Active Vehicles",
      value: activeVehicles.toString(),
      trend: `▲ ${activeVehicles} online`,
      trendColor: "text-green-apple",
      type: 'active'
    },
    {
      title: "Fleet Registry",
      value: totalVehicles.toString(),
      trend: `${totalVehicles} units total`,
      trendColor: "text-blue-apple",
      type: 'fleet'
    },
    {
      title: "Client Registry",
      value: initialClients.length.toString(),
      trend: `${initialClients.length} registered`,
      trendColor: "text-purple-apple",
      type: 'clients'
    },
    {
      title: "Active Alerts",
      value: alertsCount.toString(),
      trend: `${alertsCount} units in prep`,
      trendColor: "text-orange-apple",
      type: 'alerts'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <TopNav />

      {/* DASHBOARD CONTENT */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 w-full space-y-6">
        
        {/* TOP STATS */}
        <StatsRow customStats={calculatedStats} />

        {/* MAIN PANEL SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: MONITORING & ROSTER */}
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
                data={initialVehicles} 
                onSelect={(v) => setSelectedVehicle(v)} 
                selectedId={selectedVehicle?.id}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: INTELLIGENCE & UPDATES */}
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

        {/* BOTTOM ANALYTICS & ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
           <TripsBarChart />
           <FleetStatusDonut vehicles={initialVehicles} />
           <ActiveAlerts />
        </div>

      </main>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-[#0a0a0a] -z-20" />
      <div className="fixed top-0 right-0 w-[1200px] h-[1200px] bg-blue-600/[0.02] blur-[200px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
