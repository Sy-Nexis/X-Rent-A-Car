"use client";

import React from "react";
import AppShell from "@/components/Layout/AppShell";
import DashboardView from "@/components/Dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}
