"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/Layout/AppShell";
import FleetListView from "@/components/Vehicles/FleetListView";

export default function VehiclesPage() {
  const router = useRouter();

  return (
    <AppShell onAddUnit={() => router.push("/vehicles/new")}>
      <FleetListView onAddVehicle={() => router.push("/vehicles/new")} />
    </AppShell>
  );
}
