"use client";

import React, { useState } from "react";
import MobileHeader from "../components/MobileHeader";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileDashboardView from "../components/MobileDashboardView";
import MobileAdminPortalView from "../components/MobileAdminPortalView";
import MobileFleetManagementView from "../components/MobileFleetManagementView";
import MobileClientRegistryView from "../components/MobileClientRegistryView";
import MobileAddVehicleView from "../components/MobileAddVehicleView";
import MobileFleetEmptyView from "../components/MobileFleetEmptyView";
import MobileSplashView from "../components/MobileSplashView";
import MobileRegisterView from "../components/MobileRegisterView";
import MobileLoginView from "../components/MobileLoginView";
import MobileRegisterClientView from "../components/MobileRegisterClientView";
import MobileSettingsView from "../components/MobileSettingsView";

export default function MobileHome() {
  const [activeView, setActiveView] = useState<string>("Splash");

  const renderActiveView = () => {
    switch (activeView) {
      case "Splash":
        return <MobileSplashView onComplete={() => setActiveView("Login")} />;
      case "Login":
        return (
          <MobileLoginView
            onLoginSuccess={() => setActiveView("Dashboard")}
            onGoToRegister={() => setActiveView("Register")}
          />
        );
      case "Register":
        return (
          <MobileRegisterView
            onRegisterSuccess={() => setActiveView("Login")}
            onGoToLogin={() => setActiveView("Login")}
          />
        );
      case "Dashboard":
        return <MobileDashboardView />;
      case "AdminPortal":
        return (
          <MobileAdminPortalView
            onOpenFleet={() => setActiveView("FleetList")}
            onOpenClients={() => setActiveView("ClientRegistry")}
          />
        );
      case "FleetEmpty":
        return <MobileFleetEmptyView onEnterVehicle={() => setActiveView("AddVehicle")} />;
      case "FleetList":
      case "FleetManagement":
        return <MobileFleetManagementView />;
      case "ClientRegistry":
        return (
          <MobileClientRegistryView
            onEnterClient={() => setActiveView("RegisterClient")}
          />
        );
      case "RegisterClient":
        return <MobileRegisterClientView onRegisterSuccess={() => setActiveView("ClientRegistry")} />;
      case "AddVehicle":
        return <MobileAddVehicleView />;
      case "Settings":
        return <MobileSettingsView onLogout={() => setActiveView("Login")} />;
      default:
        return <MobileDashboardView />;
    }
  };

  const isFullScreen = ["Splash", "Login", "Register"].includes(activeView);
  const isAdminMode = activeView === "AdminPortal";

  return (
    <div className="flex flex-col h-full w-full bg-[#f8fafc]">
      {/* Mobile Top Header (hidden on full screen views) */}
      {!isFullScreen && (
        <MobileHeader activeView={activeView} onNavigate={setActiveView} />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {renderActiveView()}
      </main>

      {/* Sticky Bottom Navigation Bar (hidden on full screen views) */}
      {!isFullScreen && (
        <MobileBottomNav
          activeTab={activeView}
          onTabChange={(tab) => {
            // Support transition between active state redirects
            if (tab === "FleetList") {
              // Toggle between empty and full list for demonstration
              setActiveView("FleetEmpty");
            } else {
              setActiveView(tab);
            }
          }}
          isAdminMode={isAdminMode}
        />
      )}
    </div>
  );
}

