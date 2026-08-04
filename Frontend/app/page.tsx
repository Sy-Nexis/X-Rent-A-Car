"use strict";

"use client";

import React, { useState } from "react";
import Sidebar from "../components/Navigation/Sidebar";
import Header from "../components/Navigation/Header";
import MobileBottomNav from "../components/Navigation/MobileBottomNav";
import DashboardView from "../components/Dashboard/DashboardView";
import AdminPortalView from "../components/Admin/AdminPortalView";
import FleetManagementView from "../components/Vehicles/FleetManagementView";
import ClientRegistryView from "../components/Clients/ClientRegistryView";
import RegisterClientView from "../components/Clients/RegisterClientView";
import LandingView from "../components/Landing/LandingView";
import LoginView from "../components/Auth/LoginView";
import RegisterView from "../components/Auth/RegisterView";
import FleetEmptyView from "../components/Vehicles/FleetEmptyView";
import FleetListView from "../components/Vehicles/FleetListView";
import SettingsView from "../components/Settings/SettingsView";

export default function Home() {
  const [activeView, setActiveView] = useState<string>("Landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Sidebar Navigation — desktop always visible, mobile as drawer */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isDrawerOpen={isMobileMenuOpen}
        onCloseDrawer={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0e0e11] h-full">
        {/* Top Header Bar */}
        <Header
          activeView={activeView}
          onAddUnit={() => setActiveView("FleetManagement")}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Content Container — add bottom padding on mobile for the bottom nav */}
        <main className="flex-1 min-h-0 flex flex-col relative overflow-y-auto pb-16 md:pb-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileBottomNav activeView={activeView} onNavigate={setActiveView} />
    </div>
  );
}
