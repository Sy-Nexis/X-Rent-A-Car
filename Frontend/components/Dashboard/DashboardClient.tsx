"use client";

import React from "react";
import TopNav from "./TopNav";
import StatsRow from "./StatsRow";
import { LiveFleetMap, DriverRoster } from "./FleetMap";
import { DriverDetailHero, GPSTracker, ActivityLog } from "./SidebarInfo";
import { TripsBarChart, FleetStatusDonut, ActiveAlerts } from "./Analytics";

export default function DashboardClient() {
  return (
    <div className="min-h-screen bg-bg-base">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <StatsRow />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Left Column */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <LiveFleetMap />
            <DriverRoster />
          </div>
          
          {/* Right Column */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <DriverDetailHero />
            <GPSTracker />
            <ActivityLog />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
          <TripsBarChart />
          <FleetStatusDonut />
          <ActiveAlerts />
        </div>
      </main>
    </div>
  );
}
