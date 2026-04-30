import React from "react";
import TopNav from "@/components/Dashboard/TopNav";
import StatsRow from "@/components/Dashboard/StatsRow";
import LiveFleetMap from "@/components/Dashboard/LiveFleetMap";
import DriverRoster from "@/components/Dashboard/DriverRoster";
import { DriverDetailHero, GPSTracker } from "@/components/Dashboard/DriverInfo";
import ActivityLog from "@/components/Dashboard/ActivityLog";
import { TripsBarChart, FleetStatusDonut, ActiveAlerts } from "@/components/Dashboard/Charts";

export const metadata = {
  title: 'Fleet Operations Dashboard | XNRENT CAR',
  description: 'Real-time monitoring and management of XNRENT fleet operations.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <TopNav />

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <StatsRow />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Left Column - Core Operations */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <LiveFleetMap />
            <DriverRoster />
          </div>

          {/* Right Column - Intelligence & Monitoring */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <DriverDetailHero />
            <GPSTracker />
            <ActivityLog />
          </div>
        </div>

        {/* Bottom Row - Analytics & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
          <TripsBarChart />
          <FleetStatusDonut />
          <ActiveAlerts />
        </div>
      </main>
    </div>
  );
}
