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
import LandingView from "../components/LandingView";
import LoginView from "../components/LoginView";
import RegisterView from "../components/RegisterView";
import FleetEmptyView from "../components/FleetEmptyView";
import FleetListView from "../components/FleetListView";
import SettingsView from "../components/SettingsView";

export default function Home() {
  const [activeView, setActiveView] = useState<string>("Landing");

  const renderActiveView = () => {
    switch (activeView) {
      case "Landing":
        return <LandingView onEnter={() => setActiveView("Login")} />;
      case "Login":
        return (
          <LoginView
            onLoginSuccess={() => setActiveView("Dashboard")}
            onGoToRegister={() => setActiveView("Register")}
          />
        );
      case "Register":
        return (
          <RegisterView
            onRegisterSuccess={() => setActiveView("Login")}
            onGoToLogin={() => setActiveView("Login")}
          />
        );
      case "Dashboard":
        return <DashboardView />;
      case "AdminPortal":
        return <AdminPortalView />;
      case "FleetManagement":
        return <FleetManagementView />;
      case "FleetEmpty":
        return (
          <FleetEmptyView
            onEnterVehicle={() => setActiveView("FleetManagement")}
          />
        );
      case "FleetList":
        return (
          <FleetListView
            onAddVehicle={() => setActiveView("FleetManagement")}
          />
        );
      case "ClientRegistry":
        return (
          <ClientRegistryView
            onEnterClient={() => setActiveView("RegisterClient")}
          />
        );
      case "RegisterClient":
        return <RegisterClientView />;
      case "Settings":
        return <SettingsView onLogout={() => setActiveView("Landing")} />;
      default:
        return <DashboardView />;
    }
  };

  // Full screen views without Sidebar & Header
  const isFullScreen = ["Landing", "Login", "Register"].includes(activeView);

  if (isFullScreen) {
    return <div className="w-screen h-screen">{renderActiveView()}</div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f6fa] h-full">
        {/* Top Header Bar */}
        <Header
          activeView={activeView}
          onAddUnit={() => setActiveView("FleetManagement")}
        />

        {/* Content Container */}
        <main className="flex-1 min-h-0 flex flex-col relative">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
