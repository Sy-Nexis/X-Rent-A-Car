"use strict";

"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardView from "../components/DashboardView";
import AdminPortalView from "../components/AdminPortalView";
import FleetManagementView from "../components/FleetManagementView";
import ClientRegistryView from "../components/ClientRegistryView";
import RegisterClientView from "../components/RegisterClientView";

export default function Home() {
  const [activeView, setActiveView] = useState<string>("Dashboard");

  const renderActiveView = () => {
    switch (activeView) {
      case "Dashboard":
        return <DashboardView />;
      case "AdminPortal":
        return <AdminPortalView />;
      case "FleetManagement":
        return <FleetManagementView />;
      case "ClientRegistry":
        return (
          <ClientRegistryView
            onEnterClient={() => setActiveView("RegisterClient")}
          />
        );
      case "RegisterClient":
        return <RegisterClientView />;
      case "Settings":
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500 font-medium p-8">
            Settings page configuration and parameters.
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f6fa] h-full">
        {/* Top Header Bar */}
        <Header activeView={activeView} />

        {/* Content Container */}
        <main className="flex-1 min-h-0 flex flex-col relative">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
