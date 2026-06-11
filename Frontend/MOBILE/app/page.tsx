"use client";

import React, { useState } from "react";
import MobileHeader from "../components/MobileHeader";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileDashboardView from "../components/MobileDashboardView";
import MobileAdminPortalView from "../components/MobileAdminPortalView";
import MobileFleetManagementView from "../components/MobileFleetManagementView";
import MobileClientRegistryView from "../components/MobileClientRegistryView";
import MobileAddVehicleView from "../components/MobileAddVehicleView";

export default function MobileHome() {
  const [activeView, setActiveView] = useState<string>("Dashboard");

  const renderActiveView = () => {
    switch (activeView) {
      case "Dashboard":
        return <MobileDashboardView />;
      case "AdminPortal":
        return (
          <MobileAdminPortalView
            onOpenFleet={() => setActiveView("FleetList")}
            onOpenClients={() => setActiveView("ClientRegistry")}
          />
        );
      case "FleetList":
      case "FleetManagement":
        return <MobileFleetManagementView />;
      case "ClientRegistry":
        return (
          <MobileClientRegistryView
            onEnterClient={() => setActiveView("AddVehicle")}
          />
        );
      case "AddVehicle":
        return <MobileAddVehicleView />;
      default:
        return <MobileDashboardView />;
    }
  };

  // Determine if we show bottom navigation bar in admin mode
  const isAdminMode = activeView === "AdminPortal";

  return (
    <div className="flex flex-col h-full w-full bg-[#f8fafc]">
      {/* Mobile Top Header */}
      <MobileHeader activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content Viewport */}
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {renderActiveView()}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeView}
        onTabChange={setActiveView}
        isAdminMode={isAdminMode}
      />
    </div>
  );
}
