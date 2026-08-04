"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Navigation/Sidebar";
import Header from "@/components/Navigation/Header";
import MobileBottomNav from "@/components/Navigation/MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
  onAddUnit?: () => void;
}

export default function AppShell({ children, onAddUnit }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation — desktop always visible, mobile as drawer */}
      <Sidebar
        isDrawerOpen={isMobileMenuOpen}
        onCloseDrawer={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0e0e11] h-full">
        {/* Top Header Bar */}
        <Header
          onAddUnit={onAddUnit}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 min-h-0 flex flex-col relative overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileBottomNav />
    </div>
  );
}
